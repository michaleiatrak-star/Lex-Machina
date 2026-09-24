export const EXECUTION_PHASES = [
    { key: "PREPARE", label: "Anonimizacja wiadomości i plików" },
    { key: "ROUTING", label: "Routing prawny (prawny-router-v3)" },
    { key: "SKILLS", label: "Wczytanie skilli i modułów" },
    { key: "MODEL", label: "Analiza modelu i narzędzia prawne" },
    { key: "VERIFY", label: "Weryfikacja przepisów i źródeł" },
    { key: "RESTORE", label: "Przywrócenie danych w odpowiedzi" }
];
const MAX_DETAILS = 40;
export class ExecutionSteps {
    current = 0;
    details = new Map();
    /**
     * Moves to a later stage (never back: a skill read while the model writes
     * is listed under the skills stage, and the model stage stays current).
     */
    report(phase, detail) {
        const index = EXECUTION_PHASES.findIndex((item) => item.key === phase);
        if (index < 0)
            return;
        if (index > this.current)
            this.current = index;
        if (!detail)
            return;
        const list = this.details.get(phase) ?? [];
        const text = detail.replace(/\s+/g, " ").trim().slice(0, 140);
        if (text && !list.includes(text)) {
            list.push(text);
            if (list.length > MAX_DETAILS)
                list.shift();
        }
        this.details.set(phase, list);
    }
    snapshot() {
        return {
            current: this.current + 1,
            total: EXECUTION_PHASES.length,
            phases: EXECUTION_PHASES.map((item, index) => ({
                key: item.key,
                label: item.label,
                status: index < this.current ? "done" : index === this.current ? "active" : "pending",
                details: [...(this.details.get(item.key) ?? [])]
            }))
        };
    }
}
