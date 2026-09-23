import fs from "node:fs";
export class RoutingCatalog {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    listDrSkills() {
        return [...this.registry.skills.keys()]
            .filter((name) => /^dr-\d{2}-/.test(name))
            .sort();
    }
    validate(primarySkill) {
        if (!/^dr-\d{2}-/.test(primarySkill)) {
            return {
                valid: false,
                primarySkill,
                reason: "NOT_A_DR"
            };
        }
        if (!this.registry.get(primarySkill)) {
            return {
                valid: false,
                primarySkill,
                reason: "SKILL_NOT_FOUND"
            };
        }
        const routingMap = this.registry.resolveResource("prawo-polskie-v2", "prawo-polskie-v2/ROUTING-MAP.md");
        if (!routingMap) {
            return {
                valid: false,
                primarySkill,
                reason: "ROUTING_MAP_MISSING"
            };
        }
        const text = fs.readFileSync(routingMap, "utf8");
        if (!text.includes(primarySkill)) {
            return {
                valid: false,
                primarySkill,
                reason: "NOT_IN_ROUTING_MAP"
            };
        }
        return {
            valid: true,
            primarySkill
        };
    }
}
