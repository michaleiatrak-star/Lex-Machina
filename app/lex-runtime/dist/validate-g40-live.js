import { LegalFederationToolRuntime } from "./legal-federation-tool-runtime.js";
const SOURCES = [
    "saos",
    "nsa",
    "isap",
    "krs",
    "eureka",
    "kio",
    "uodo",
    "eu-sparql",
    "eu-compliance",
    "legalize"
];
async function main() {
    const runtime = new LegalFederationToolRuntime();
    try {
        const [coverage] = await runtime.runTools([
            {
                id: "g40-coverage",
                name: "federated_legal_coverage",
                input: {}
            }
        ]);
        if (!coverage ||
            coverage.content.includes("SOURCE_UNAVAILABLE")) {
            throw new Error("G40_COVERAGE_FAILED");
        }
        for (const source of SOURCES) {
            const [result] = await runtime.runTools([
                {
                    id: "g40-" +
                        source,
                    name: "list_federated_legal_sources",
                    input: {
                        sourceId: source
                    }
                }
            ]);
            if (!result) {
                throw new Error("G40_SOURCE_NO_RESULT:" +
                    source);
            }
            if (result.content.includes("SOURCE_UNAVAILABLE") ||
                result.content.includes("[source_unavailable]")) {
                throw new Error("G40_SOURCE_UNAVAILABLE:" +
                    source +
                    ":" +
                    result.content.slice(0, 800));
            }
            if (source === "eureka") {
                const [probe] = await runtime.runTools([
                    {
                        id: "g40-eureka-search",
                        name: "search_federated_legal_sources",
                        input: {
                            source: "eureka",
                            query: "VAT",
                            limit: 1
                        }
                    }
                ]);
                if (!probe ||
                    probe.content.includes("SOURCE_UNAVAILABLE")) {
                    throw new Error("G40_EUREKA_LIVE_SEARCH_FAILED");
                }
                console.log("G40_LIVE_QUERY_PASS", "eureka");
            }
            if (source === "uodo") {
                const [probe] = await runtime.runTools([
                    {
                        id: "g40-uodo-recent",
                        name: "call_federated_legal_source",
                        input: {
                            source: "uodo",
                            tool: "uodo_recent",
                            arguments: {
                                limit: 1
                            }
                        }
                    }
                ]);
                if (!probe ||
                    probe.content.includes("SOURCE_UNAVAILABLE") ||
                    !probe.content.includes("orzeczenia.uodo.gov.pl")) {
                    throw new Error("G40_UODO_OFFICIAL_FALLBACK_FAILED:" +
                        (probe?.content ??
                            "<missing>").slice(0, 800));
                }
                console.log("G40_LIVE_QUERY_PASS", "uodo-official-fallback");
            }
            console.log("G40_SOURCE_PASS", source);
        }
        const [uodoProbe] = await runtime.runTools([
            {
                id: "g40-uodo-live",
                name: "call_federated_legal_source",
                input: {
                    source: "uodo",
                    tool: "uodo_stats",
                    arguments: {}
                }
            }
        ]);
        if (!uodoProbe ||
            uodoProbe.content.includes("SOURCE_UNAVAILABLE") ||
            uodoProbe.content.includes("UODO_HTTP_")) {
            throw new Error("G40_UODO_LIVE_API_FAILED:" +
                (uodoProbe?.content ??
                    "NO_RESULT").slice(0, 1000));
        }
        console.log("G40_UODO_LIVE_API_PASS");
        console.log("G40_LEGAL_MCP_FLEET_PASS", SOURCES.join(","));
    }
    finally {
        await runtime.close();
    }
}
main().catch((error) => {
    console.error(error instanceof Error
        ? error.stack ??
            error.message
        : String(error));
    process.exitCode = 1;
});
