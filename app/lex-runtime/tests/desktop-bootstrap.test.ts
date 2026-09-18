import {
  afterEach,
  describe,
  expect,
  it
} from "vitest";
import {
  startLocalServer
} from "../src/http/server.js";

const previous =
  process.env
    .LEX_DESKTOP_BOOTSTRAP_TOKEN;

afterEach(() => {
  if (
    previous === undefined
  ) {
    delete process.env
      .LEX_DESKTOP_BOOTSTRAP_TOKEN;
  } else {
    process.env
      .LEX_DESKTOP_BOOTSTRAP_TOKEN =
      previous;
  }
});

describe("desktop loopback bootstrap guard", () => {
  it("fails closed without the desktop secret and accepts the exact secret", async () => {
    const token =
      "desktop-" +
      "a".repeat(64);
    process.env
      .LEX_DESKTOP_BOOTSTRAP_TOKEN =
      token;

    const server =
      await startLocalServer({
        host:
          "127.0.0.1",
        port: 0
      });
    try {
      const base =
        `http://${server.host}:${server.port}`;

      const blocked =
        await fetch(
          base + "/health"
        );
      expect(
        blocked.status
      ).toBe(401);
      expect(
        await blocked.json()
      ).toEqual({
        error:
          "DESKTOP_BOOTSTRAP_REQUIRED"
      });

      const accepted =
        await fetch(
          base + "/health",
          {
            headers: {
              "x-lex-desktop-bootstrap":
                token
            }
          }
        );
      expect(
        accepted.status
      ).toBe(200);
      expect(
        await accepted.json()
      ).toMatchObject({
        status: "ok",
        localOnly: true
      });
    } finally {
      await server.close();
    }
  });
});
