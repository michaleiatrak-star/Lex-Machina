import { describe, expect, it } from "vitest";
import type { CaseListItem } from "./api.js";
import { casesNewestFirst, groupByDay, monthGrid } from "./case-calendar.js";

describe("case calendar", () => {
  it("builds Monday-first weeks covering the month", () => {
    const weeks = monthGrid(2026, 8); // wrzesień 2026: 1.09 to wtorek
    expect(weeks[0]?.[0]).toEqual({ key: "2026-08-31", day: 31, inMonth: false });
    expect(weeks[0]?.[1]).toEqual({ key: "2026-09-01", day: 1, inMonth: true });
    expect(weeks.flat().filter((day) => day.inMonth)).toHaveLength(30);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
  });

  it("groups events by day and lists matters newest first", () => {
    const grouped = groupByDay([
      { startsAt: "2026-10-01T09:00" },
      { startsAt: "2026-10-01T12:00" },
      { startsAt: "2026-10-02T09:00" }
    ]);
    expect(grouped.get("2026-10-01")).toHaveLength(2);

    const item = (caseId: string, updatedAt: string, caseKind = "MATTER") =>
      ({ caseId, caseKind, updatedAt, createdAt: updatedAt }) as CaseListItem;
    expect(
      casesNewestFirst([
        item("a", "2026-01-01T00:00:00Z"),
        item("firm", "2026-12-01T00:00:00Z", "FIRM_KNOWLEDGE"),
        item("b", "2026-06-01T00:00:00Z")
      ]).map((entry) => entry.caseId)
    ).toEqual(["b", "a"]);
  });
});
