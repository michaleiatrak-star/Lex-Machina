import { afterEach, describe, expect, it, vi } from "vitest";
import { newExecutionId, startDraftPolling } from "./MatterChatApp.js";

afterEach(() => {
  vi.useRealTimers();
});

describe("live draft polling", () => {
  it("shows the runtime draft while running and clears it when stopped", async () => {
    vi.useFakeTimers();
    const drafts: string[] = [];
    const fetchProgress = vi.fn(async () => ({
      text: "Wersja robocza",
      updatedAt: "2026-09-23T00:00:00.000Z"
    }));
    const stop = startDraftPolling(
      "0f1e2d3c-4b5a-6978-8796-a5b4c3d2e1f0",
      (text) => drafts.push(text),
      1000,
      fetchProgress
    );
    await vi.advanceTimersByTimeAsync(1000);
    expect(fetchProgress).toHaveBeenCalledWith(
      "0f1e2d3c-4b5a-6978-8796-a5b4c3d2e1f0"
    );
    expect(drafts).toContain("Wersja robocza");
    stop();
    expect(drafts.at(-1)).toBe("");
    await vi.advanceTimersByTimeAsync(3000);
    expect(fetchProgress).toHaveBeenCalledTimes(1);
  });

  it("creates execution ids accepted by the runtime", () => {
    expect(newExecutionId()).toMatch(/^[A-Za-z0-9-]{16,64}$/);
  });
});
