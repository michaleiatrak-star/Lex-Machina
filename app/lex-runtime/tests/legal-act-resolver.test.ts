import { describe, expect, it } from "vitest";
import {
  DeterministicLegalActResolver
} from "../src/legal-act-resolver.js";

describe("DeterministicLegalActResolver", () => {
  const resolver = new DeterministicLegalActResolver();

  it("resolves canonical aliases without model-supplied URLs", () => {
    expect(resolver.resolve("KC")).toMatchObject({
      id: "KC",
      title: "Kodeks cywilny",
      eli: "DU/2026/795",
      baseEli: "DU/1964/93",
      sourceUrl:
        "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.html",
      sourceKind: "consolidated_text",
      registryAsOf: "2026-09-15"
    });

    expect(resolver.resolve("k.p.c.").id).toBe("KPC");
    expect(
      resolver.resolve("Kodeks postępowania karnego").id
    ).toBe("KPK");
    expect(
      resolver.resolve("Kodeks karny")
    ).toMatchObject({
      id: "KK",
      eli: "DU/2025/383",
      baseEli: "DU/1997/553"
    });
    expect(
      resolver.resolve("k.k.").id
    ).toBe("KK");
    expect(
      resolver.resolve(
        "  Kodeks   postępowania   karnego  "
      ).id
    ).toBe("KPK");
  });

  it("returns defensive copies of the registry", () => {
    const first = resolver.list();
    const second = resolver.list();

    expect(first).toHaveLength(4);
    expect(first).toEqual(second);
    expect(first).not.toBe(second);
  });

  it("fails closed for unknown and empty act identities", () => {
    expect(() => resolver.resolve("")).toThrow(
      "Legal act identifier cannot be empty."
    );
    expect(() => resolver.resolve("USTAWA-NIEZNANA")).toThrow(
      "Legal act is not present in the runtime registry."
    );
  });
});
