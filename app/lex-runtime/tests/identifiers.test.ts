import { describe, expect, it } from "vitest";
import {
  detectIdentifiers,
  validIban,
  validIdCard,
  validLandRegistry,
  validNip,
  validPassport,
  validPesel,
  validRegon
} from "../src/privacy/identifiers.js";

// Synthetic numbers with correct check digits; none belongs to a real person.
const PESEL = "44051401359";
const NIP = "5260250274";
const REGON9 = "123456785";
const REGON14 = "12345678512347";
const IBAN = "PL61 1090 1014 0000 0712 1981 2874";
const ID_CARD = "ABA300000";
const PASSPORT = "ZS0000177";

function kinds(text: string) {
  return detectIdentifiers(text).map((span) => [span.kind, span.value]);
}

describe("identifier detectors", () => {
  it("validates check digits", () => {
    expect(validPesel(PESEL)).toBe(true);
    expect(validPesel("44051401358")).toBe(false);
    expect(validNip(NIP)).toBe(true);
    expect(validNip("526-025-02-74")).toBe(true);
    expect(validNip("5260250275")).toBe(false);
    expect(validRegon(REGON9)).toBe(true);
    expect(validRegon("123456789")).toBe(false);
    expect(validRegon(REGON14)).toBe(true);
    expect(validIban(IBAN)).toBe(true);
    expect(validIban("61109010140000071219812874")).toBe(true);
    expect(validIban("PL61 1090 1014 0000 0712 1981 2875")).toBe(false);
    expect(validIban("DE89 3704 0044 0532 0130 00")).toBe(true);
    expect(validIdCard(ID_CARD)).toBe(true);
    expect(validIdCard("ABA300001")).toBe(false);
    expect(validPassport(PASSPORT)).toBe(true);
    expect(validLandRegistry("WA1M/00012345/5")).toBe(
      (() => {
        // Recompute the check digit independently.
        const table = "0123456789XABCDEFGHIJKLMNOPRSTUWYZ";
        const chars = [..."WA1M00012345"];
        const sum = chars.reduce((acc, char, index) => acc + table.indexOf(char) * [1, 3, 7][index % 3]!, 0);
        return sum % 10 === 5;
      })()
    );
  });

  it("finds identifiers in a document and leaves ordinary numbers alone", () => {
    const text = [
      `PESEL ${PESEL}, NIP 526-025-02-74, REGON ${REGON9}.`,
      `Rachunek: ${IBAN}. Dowód osobisty ${ID_CARD}, paszport ${PASSPORT}.`,
      "tel. 601234567, kontakt: +48 22 123 45 67, e-mail: jan@example.com.",
      "Spółka wpisana do KRS pod numerem KRS: 0000123456.",
      "urodzony dnia 14.05.1944 r. w Krakowie; samochód nr rej. KR 12345.",
      "Kwota 123456789 zł, art. 471 k.c., sygn. akt I C 1234/25, rok 2025."
    ].join("\n");
    const found = kinds(text);
    expect(found).toEqual(expect.arrayContaining([
      ["PESEL", PESEL],
      ["NIP", "526-025-02-74"],
      ["REGON", REGON9],
      ["IBAN", IBAN],
      ["ID_CARD", ID_CARD],
      ["PASSPORT", PASSPORT],
      ["PHONE", "601234567"],
      ["EMAIL", "jan@example.com"],
      ["KRS", "0000123456"],
      ["BIRTH_DATE", "14.05.1944 r."],
      ["VEHICLE_PLATE", "KR 12345"]
    ]));
    // An amount with no valid checksum and a case number are not identifiers.
    expect(found.some(([, value]) => value === "123456789")).toBe(false);
    expect(found.some(([, value]) => String(value).includes("1234/25"))).toBe(false);
  });
});
