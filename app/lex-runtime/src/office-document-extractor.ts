import {
  spawn
} from "node:child_process";
import path from "node:path";
import {
  fileURLToPath
} from "node:url";

export const DOCX_MEDIA_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const ODT_MEDIA_TYPE =
  "application/vnd.oasis.opendocument.text";

export type OfficeDocumentMediaType =
  | typeof DOCX_MEDIA_TYPE
  | typeof ODT_MEDIA_TYPE;

export interface OfficeDocumentTextExtractor {
  extract(
    data: Uint8Array,
    mediaType:
      OfficeDocumentMediaType
  ): Promise<string>;
}

export type LocalOfficeDocumentTextExtractorOptions = {
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
    "../../storage/office_extract_worker.py"
  );
}

export class LocalOfficeDocumentTextExtractor
implements OfficeDocumentTextExtractor {
  private readonly python:
    string;
  private readonly workerPath:
    string;
  private readonly timeoutMs:
    number;

  constructor(
    options:
      LocalOfficeDocumentTextExtractorOptions = {}
  ) {
    this.python =
      options.python ??
      process.env
        .LEX_STORAGE_PYTHON ??
      "python3";
    this.workerPath =
      options.workerPath ??
      process.env
        .LEX_OFFICE_EXTRACT_WORKER ??
      defaultWorkerPath();
    this.timeoutMs =
      options.timeoutMs ??
      60_000;
  }

  async extract(
    data: Uint8Array,
    mediaType:
      OfficeDocumentMediaType
  ): Promise<string> {
    if (
      data.byteLength < 1 ||
      data.byteLength >
        64 * 1024 * 1024
    ) {
      throw new Error(
        "OFFICE_DOCUMENT_SIZE_INVALID"
      );
    }

    return await new Promise<
      string
    >(
      (resolve, reject) => {
        const child =
          spawn(
            this.python,
            [
              this.workerPath,
              "--media-type",
              mediaType
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
        let stdoutBytes = 0;
        let stderr = "";
        let settled = false;

        const finish = (
          action: () => void
        ): void => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
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
                    "OFFICE_DOCUMENT_EXTRACTION_TIMEOUT"
                  )
                )
              );
            },
            this.timeoutMs
          );

        child.stdout.on(
          "data",
          (
            chunk: Buffer
          ) => {
            stdoutBytes +=
              chunk.byteLength;
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
                    "OFFICE_DOCUMENT_OUTPUT_TOO_LARGE"
                  )
                )
              );
              return;
            }
            stdout.push(
              Buffer.from(chunk)
            );
          }
        );

        child.stderr.on(
          "data",
          (
            chunk: Buffer
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
          (error) => {
            finish(() =>
              reject(error)
            );
          }
        );

        child.once(
          "exit",
          (code) => {
            finish(() => {
              if (code !== 0) {
                reject(
                  new Error(
                    stderr
                      .trim()
                      .split(
                        "\n"
                      )
                      .pop() ||
                    "OFFICE_DOCUMENT_EXTRACTION_FAILED"
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
                  ) as
                    Record<
                      string,
                      unknown
                    >;
                if (
                  typeof parsed.text !==
                    "string" ||
                  parsed.text.length >
                    100_000_000
                ) {
                  throw new Error(
                    "OFFICE_DOCUMENT_OUTPUT_INVALID"
                  );
                }
                resolve(
                  parsed.text
                );
              } catch (error) {
                reject(
                  error instanceof
                    Error
                    ? error
                    : new Error(
                        "OFFICE_DOCUMENT_OUTPUT_INVALID"
                      )
                );
              }
            });
          }
        );

        child.stdin.once(
          "error",
          (error) => {
            finish(() =>
              reject(error)
            );
          }
        );
        child.stdin.end(
          Buffer.from(data)
        );
      }
    );
  }
}
