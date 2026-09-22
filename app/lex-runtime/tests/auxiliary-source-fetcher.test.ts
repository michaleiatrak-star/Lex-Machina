import {
  Buffer
} from "node:buffer";
import {
  describe,
  expect,
  it
} from "vitest";
import {
  AuxiliarySourceFetchError,
  SafeAuxiliarySourceFetcher,
  extractAuxiliarySourceDates,
  isPublicInternetAddress,
  parseAuxiliarySourceUrl,
  resolveAuxiliarySourceTarget,
  type AuxiliaryDnsResolver,
  type AuxiliaryTransport
} from "../src/auxiliary-source-fetcher.js";

describe(
  "auxiliary legal source egress",
  () => {
    it(
      "accepts only public credential-free HTTPS hostnames",
      () => {
        expect(
          parseAuxiliarySourceUrl(
            "https://prawo.pl/prawo/example"
          ).hostname
        ).toBe("prawo.pl");

        for (
          const value
          of [
            "http://prawo.pl/example",
            "https://user:pass@prawo.pl/example",
            "https://127.0.0.1/example",
            "https://[::1]/example",
            "https://localhost/example",
            "https://service.local/example",
            "https://prawo.pl:8443/example",
            "https://prawo.pl/[PII:PERSON:0001]"
          ]
        ) {
          expect(() =>
            parseAuxiliarySourceUrl(
              value
            )
          ).toThrow(
            AuxiliarySourceFetchError
          );
        }
      }
    );

    it(
      "rejects private reserved and documentation address ranges",
      () => {
        for (
          const address
          of [
            "0.0.0.0",
            "10.1.2.3",
            "100.64.0.1",
            "127.0.0.1",
            "169.254.10.1",
            "172.16.0.1",
            "192.168.1.1",
            "192.0.2.1",
            "198.18.0.1",
            "198.51.100.2",
            "203.0.113.4",
            "224.0.0.1",
            "::1",
            "fc00::1",
            "fe80::1",
            "ff02::1",
            "2001:db8::1",
            "::ffff:127.0.0.1"
          ]
        ) {
          expect(
            isPublicInternetAddress(
              address
            )
          ).toBe(false);
        }

        expect(
          isPublicInternetAddress(
            "93.184.216.34"
          )
        ).toBe(true);
        expect(
          isPublicInternetAddress(
            "2606:4700:4700::1111"
          )
        ).toBe(true);
      }
    );

    it(
      "fails closed when any DNS answer is non-public",
      async () => {
        const resolver:
          AuxiliaryDnsResolver =
          async () => [
            {
              address:
                "93.184.216.34",
              family: 4
            },
            {
              address:
                "127.0.0.1",
              family: 4
            }
          ];

        await expect(
          resolveAuxiliarySourceTarget(
            "https://example.com/article",
            resolver
          )
        ).rejects.toMatchObject({
          code:
            "AUX_SOURCE_DNS_PRIVATE"
        });
      }
    );

    it(
      "pins a public DNS answer and revalidates each redirect",
      async () => {
        const resolver:
          AuxiliaryDnsResolver =
          async (hostname) => {
            if (
              hostname ===
              "source.example"
            ) {
              return [{
                address:
                  "93.184.216.34",
                family: 4
              }];
            }
            if (
              hostname ===
              "redirect.example"
            ) {
              return [{
                address:
                  "151.101.1.69",
                family: 4
              }];
            }
            return [];
          };

        const seen:
          string[] = [];
        const transport:
          AuxiliaryTransport =
          async (target) => {
            seen.push(
              target.url.hostname +
                "=" +
                target.address
            );
            if (
              target.url.hostname ===
              "source.example"
            ) {
              return {
                statusCode:
                  302,
                location:
                  "https://redirect.example/final",
                body:
                  new Uint8Array()
              };
            }
            return {
              statusCode:
                200,
              contentType:
                "text/html; charset=utf-8",
              body:
                Buffer.from(
                  "<html><body>Treść pomocnicza</body></html>"
                )
            };
          };

        const fetcher =
          new SafeAuxiliarySourceFetcher(
            resolver,
            transport,
            () =>
              "2026-09-22T07:00:00.000Z"
          );
        const result =
          await fetcher.fetch(
            "https://source.example/start"
          );

        expect(seen).toEqual([
          "source.example=93.184.216.34",
          "redirect.example=151.101.1.69"
        ]);
        expect(
          result.finalUrl
        ).toBe(
          "https://redirect.example/final"
        );
        expect(
          result.redirectCount
        ).toBe(1);
        expect(
          result.text
        ).toContain(
          "Treść pomocnicza"
        );
        expect(
          result.sha256
        ).toMatch(
          /^[a-f0-9]{64}$/
        );
      }
    );

    it(
      "blocks a redirect whose fresh DNS answer becomes private",
      async () => {
        const resolver:
          AuxiliaryDnsResolver =
          async (hostname) =>
            hostname ===
            "source.example"
              ? [{
                  address:
                    "93.184.216.34",
                  family: 4
                }]
              : [{
                  address:
                    "10.0.0.5",
                  family: 4
                }];

        const transport:
          AuxiliaryTransport =
          async () => ({
            statusCode: 302,
            location:
              "https://redirect.example/internal",
            body:
              new Uint8Array()
          });

        const fetcher =
          new SafeAuxiliarySourceFetcher(
            resolver,
            transport
          );

        await expect(
          fetcher.fetch(
            "https://source.example/start"
          )
        ).rejects.toMatchObject({
          code:
            "AUX_SOURCE_DNS_PRIVATE"
        });
      }
    );

    it(
      "extracts publication dates from source-owned HTML metadata",
      () => {
        const dates =
          extractAuxiliarySourceDates(
            Buffer.from(
              [
                "<html><head>",
                '<meta property="article:published_time" content="2026-08-01T10:30:00+02:00">',
                '<meta property="article:modified_time" content="2026-09-20T11:00:00+02:00">',
                "</head></html>"
              ].join("")
            ),
            "text/html"
          );

        expect(dates).toEqual({
          publishedAt:
            "2026-08-01",
          updatedAt:
            "2026-09-20"
        });
      }
    );

    it(
      "fails on unsupported content and oversized responses",
      async () => {
        const resolver:
          AuxiliaryDnsResolver =
          async () => [{
            address:
              "93.184.216.34",
            family: 4
          }];

        const binary =
          new SafeAuxiliarySourceFetcher(
            resolver,
            async () => ({
              statusCode: 200,
              contentType:
                "application/octet-stream",
              body:
                Buffer.from(
                  "binary"
                )
            })
          );
        await expect(
          binary.fetch(
            "https://source.example/a"
          )
        ).rejects.toMatchObject({
          code:
            "AUX_SOURCE_CONTENT_TYPE_UNSUPPORTED"
        });

        const oversized =
          new SafeAuxiliarySourceFetcher(
            resolver,
            async () => ({
              statusCode: 200,
              contentType:
                "text/plain",
              body:
                Buffer.alloc(
                  33,
                  65
                )
            }),
            () =>
              "2026-09-22T07:00:00.000Z",
            {
              timeoutMs: 1000,
              maxBytes: 32,
              maxRedirects: 1,
              maxTextChars: 100
            }
          );
        await expect(
          oversized.fetch(
            "https://source.example/b"
          )
        ).rejects.toMatchObject({
          code:
            "AUX_SOURCE_TOO_LARGE"
        });
      }
    );
  }
);
