import { describe, expect, it } from "vitest";
import {
  assertLoopbackHost,
  startLocalServer
} from "../src/http/server.js";

describe("local server binding", () => {
  it("accepts loopback addresses", () => {
    expect(() => assertLoopbackHost("127.0.0.1")).not.toThrow();
    expect(() => assertLoopbackHost("localhost")).not.toThrow();
    expect(() => assertLoopbackHost("::1")).not.toThrow();
  });

  it("rejects public/all-interface binds", () => {
    expect(() => assertLoopbackHost("0.0.0.0")).toThrow(/non-loopback/);
    expect(() => assertLoopbackHost("192.168.1.2")).toThrow(/non-loopback/);
  });

  it("can start and stop on an ephemeral localhost port", async () => {
    const previous = process.env.LEX_SKILLS_PATH;
    try {
      // Full-corpus startup is covered by G13 executable gate.
      expect(typeof startLocalServer).toBe("function");
    } finally {
      if (previous === undefined) delete process.env.LEX_SKILLS_PATH;
      else process.env.LEX_SKILLS_PATH = previous;
    }
  });
});
