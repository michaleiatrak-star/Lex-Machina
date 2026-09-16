import {
  spawn
} from "node:child_process";
import path from "node:path";
import {
  fileURLToPath
} from "node:url";
import type {
  LegalDocumentAst
} from "./legal-document-ast.js";

export type LegalDocumentFormat =
  | "docx"
  | "odt";

export type LegalDocumentPackage = {
  data: Buffer;
  text: string;
  replaced?: number;
};

export type LegalDocumentRendererOptions = {
  python?: string;
  workerPath?: string;
  timeoutMs?: number;
};

function defaultWorkerPath():
  string {
  const here =
    path.dirname(
      fileURLToPath(
        import.meta.url
      )
    );
  return path.resolve(
    here,
    "../../storage/legal_document_worker.py"
  );
}

export class LocalLegalDocumentRenderer {
  private readonly python:
    string;
  private readonly workerPath:
    string;
  private readonly timeoutMs:
    number;

  constructor(
    options:
      LegalDocumentRendererOptions = {}
  ) {
    this.python =
      options.python ??
      process.env
        .LEX_STORAGE_PYTHON ??
      "python3";
    this.workerPath =
      options.workerPath ??
      process.env
        .LEX_LEGAL_DOCUMENT_WORKER ??
      defaultWorkerPath();
    this.timeoutMs =
      options.timeoutMs ??
      60_000;
  }

  async render(
    format:
      LegalDocumentFormat,
    ast:
      LegalDocumentAst
  ): Promise<
    LegalDocumentPackage
  > {
    return await this.call({
      operation:
        "render",
      format,
      ast
    });
  }

  async validate(
    format:
      LegalDocumentFormat,
    data:
      Uint8Array
  ): Promise<{
    text: string;
    bytes: number;
    aliases: number;
  }> {
    const result =
      await this.callRaw({
        operation:
          "validate",
        format,
        packageBase64:
          Buffer.from(data)
            .toString(
              "base64"
            )
      });
    if (
      typeof result.text !==
        "string" ||
      typeof result.bytes !==
        "number" ||
      typeof result.aliases !==
        "number"
    ) {
      throw new Error(
        "LEGAL_DOCUMENT_WORKER_RESPONSE_INVALID"
      );
    }
    return {
      text: result.text,
      bytes: result.bytes,
      aliases:
        result.aliases
    };
  }

  async deanonymize(
    format:
      LegalDocumentFormat,
    data:
      Uint8Array,
    replacements:
      Map<string, string>
  ): Promise<
    LegalDocumentPackage
  > {
    return await this.call({
      operation:
        "deanonymize",
      format,
      packageBase64:
        Buffer.from(data)
          .toString(
            "base64"
          ),
      replacements:
        Object.fromEntries(
          replacements
        )
    });
  }

  private async call(
    input:
      Record<string, unknown>
  ): Promise<
    LegalDocumentPackage
  > {
    const result =
      await this.callRaw(
        input
      );
    if (
      typeof result
        .packageBase64 !==
        "string" ||
      typeof result.text !==
        "string" ||
      typeof result.bytes !==
        "number"
    ) {
      throw new Error(
        "LEGAL_DOCUMENT_WORKER_RESPONSE_INVALID"
      );
    }
    const data =
      Buffer.from(
        result.packageBase64,
        "base64"
      );
    if (
      data.byteLength !==
        result.bytes ||
      data.byteLength >
        64 * 1024 * 1024
    ) {
      data.fill(0);
      throw new Error(
        "LEGAL_DOCUMENT_WORKER_SIZE_MISMATCH"
      );
    }
    return {
      data,
      text:
        result.text,
      ...(typeof result.replaced ===
      "number"
        ? {
            replaced:
              result.replaced
          }
        : {})
    };
  }

  private async callRaw(
    input:
      Record<string, unknown>
  ): Promise<
    Record<string, unknown>
  > {
    const request =
      Buffer.from(
        JSON.stringify(
          input
        ),
        "utf8"
      );
    if (
      request.byteLength >
        128 * 1024 * 1024
    ) {
      request.fill(0);
      throw new Error(
        "LEGAL_DOCUMENT_WORKER_INPUT_TOO_LARGE"
      );
    }

    try {
      return await new Promise(
        (
          resolve,
          reject
        ) => {
          const child =
            spawn(
              this.python,
              [
                this.workerPath
              ],
              {
                stdio: [
                  "pipe",
                  "pipe",
                  "pipe"
                ],
                env: {
                  ...process.env,
                  PYTHONUNBUFFERED:
                    "1"
                }
              }
            );
          const stdout:
            Buffer[] = [];
          let stdoutBytes =
            0;
          let stderr = "";
          let settled =
            false;

          const finish = (
            action:
              () => void
          ): void => {
            if (settled) {
              return;
            }
            settled = true;
            clearTimeout(
              timer
            );
            action();
          };

          const timer =
            setTimeout(
              () => {
                child.kill(
                  "SIGKILL"
                );
                finish(() =>
                  reject(
                    new Error(
                      "LEGAL_DOCUMENT_WORKER_TIMEOUT"
                    )
                  )
                );
              },
              this.timeoutMs
            );

          child.stdout.on(
            "data",
            (
              chunk:
                Buffer
            ) => {
              stdoutBytes +=
                chunk
                  .byteLength;
              if (
                stdoutBytes >
                  128 *
                    1024 *
                    1024
              ) {
                child.kill(
                  "SIGKILL"
                );
                finish(() =>
                  reject(
                    new Error(
                      "LEGAL_DOCUMENT_WORKER_OUTPUT_TOO_LARGE"
                    )
                  )
                );
                return;
              }
              stdout.push(
                Buffer.from(
                  chunk
                )
              );
            }
          );
          child.stderr.on(
            "data",
            (
              chunk:
                Buffer
            ) => {
              stderr +=
                chunk.toString(
                  "utf8"
                );
              if (
                stderr.length >
                  16_000
              ) {
                stderr =
                  stderr.slice(
                    -16_000
                  );
              }
            }
          );
          child.once(
            "error",
            (error) =>
              finish(() =>
                reject(
                  error
                )
              )
          );
          child.once(
            "exit",
            (code) =>
              finish(() => {
                if (
                  code !== 0
                ) {
                  reject(
                    new Error(
                      stderr
                        .trim()
                        .split(
                          "\n"
                        )
                        .pop() ||
                      "LEGAL_DOCUMENT_WORKER_FAILED"
                    )
                  );
                  return;
                }
                try {
                  const parsed =
                    JSON.parse(
                      Buffer.concat(
                        stdout
                      ).toString(
                        "utf8"
                      )
                    );
                  if (
                    !parsed ||
                    typeof parsed !==
                      "object" ||
                    Array.isArray(
                      parsed
                    )
                  ) {
                    throw new Error(
                      "LEGAL_DOCUMENT_WORKER_RESPONSE_INVALID"
                    );
                  }
                  resolve(
                    parsed as
                      Record<
                        string,
                        unknown
                      >
                  );
                } catch (
                  error
                ) {
                  reject(
                    error instanceof
                      Error
                      ? error
                      : new Error(
                          "LEGAL_DOCUMENT_WORKER_RESPONSE_INVALID"
                        )
                  );
                }
              })
          );
          child.stdin.once(
            "error",
            (error) =>
              finish(() =>
                reject(
                  error
                )
              )
          );
          child.stdin.end(
            request
          );
        }
      );
    } finally {
      request.fill(0);
    }
  }
}
