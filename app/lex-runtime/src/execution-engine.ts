        type,
        target,
        status,
        ...(detail ? { detail } : {})
      });
    };

    const session = new LegalSession(this.registry);
    const bootstrap = session.initializeLegalQuery();
    for (const event of bootstrap) {
      emit(event.type, event.target, event.status);
    }

    if (args.route.jurisdiction !== "PL") {
      emit("route", args.route.jurisdiction, "BLOCKED", "NON_PL_ROUTE");
      throw new LexExecutionError(
        "This vertical slice accepts Polish-law routes only.",
        args.route.jurisdiction,
        [...events]
      );
    }

    const polishLaw = this.registry.get("prawo-polskie-v2");
    if (!polishLaw) {
      emit("skill_read", "prawo-polskie-v2", "BLOCKED");
      throw new LexExecutionError(
        "prawo-polskie-v2 is required for Polish-law routing.",
        "prawo-polskie-v2",
        [...events]
      );
    }
    emit("skill_read", "prawo-polskie-v2", "OK");

    const routingMap = this.registry.resolveResource(
      "prawo-polskie-v2",
      "prawo-polskie-v2/ROUTING-MAP.md"
    );
    if (!routingMap) {
      emit("resource_read", "prawo-polskie-v2/ROUTING-MAP.md", "BLOCKED");
      throw new LexExecutionError(
        "The central Polish-law routing map is unavailable.",
        "prawo-polskie-v2/ROUTING-MAP.md",
        [...events]
      );
    }
    emit("resource_read", "prawo-polskie-v2/ROUTING-MAP.md", "OK");

    if (!args.route.primarySkill.startsWith("dr-")) {
      emit("route", args.route.primarySkill, "BLOCKED", "INVALID_PRIMARY_SKILL");
      throw new LexExecutionError(
        "A Polish-law route must select one DR skill.",
        args.route.primarySkill,
        [...events]
      );
    }

    const primary = this.registry.get(args.route.primarySkill);
    if (!primary) {
      emit("skill_read", args.route.primarySkill, "BLOCKED");
      throw new LexExecutionError(
        "Selected primary DR skill does not exist.",
        args.route.primarySkill,
        [...events]
      );
    }

    const routingMapText = fs.readFileSync(routingMap, "utf8");
    if (!routingMapText.includes(args.route.primarySkill)) {
      emit(
        "route",
        args.route.primarySkill,
        "BLOCKED",
        "PRIMARY_SKILL_NOT_IN_ROUTING_MAP"
      );
      throw new LexExecutionError(
        "Selected primary DR skill is not present in ROUTING-MAP.md.",
        args.route.primarySkill,
        [...events]
      );
    }

    emit(
      "route",
      args.route.primarySkill,
      "OK",
      `mode=${args.route.mode};jurisdiction=PL`
    );
    emit("skill_read", args.route.primarySkill, "OK");

    const baseSystemPrompt = combineSkillPrompt(this.registry, [
      "prawny-router-v3",
      "prawo-polskie-v2",
      args.route.primarySkill
    ]);
    const systemPrompt = args.tools?.length
      ? [
          baseSystemPrompt,
          "# RUNTIME VERIFICATION CONTRACT",
          "Before stating an article, Dz.U. reference, statutory deadline/amount, or case signature, call verify_legal_reference with the exact claim and a fresh official HTTPS source URL.",
          "A VERIFIED tool result returns a marker. Copy that marker verbatim onto the same output line as the exact verified reference.",
          "If verification returns UNVERIFIED or DENIED, do not present the reference as verified. Use the required unverified marker when mentioning it is necessary.",
          "Never fabricate a verification marker."
        ].join("\n\n")
      : baseSystemPrompt;

    emit("provider_start", args.provider, "OK", args.model);
    const response = await this.providers.stream(args.provider, {
      model: args.model,
      systemPrompt,
      messages: [{ role: "user", content: args.query }],
      ...(args.tools?.length ? { tools: args.tools } : {}),
      ...(args.runTools ? { runTools: args.runTools } : {}),
      reasoning: "none"
    });
    emit("provider_end", args.provider, "OK", args.model);

    emit("gate", "G7_VERTICAL_SLICE", "OK");

    return {
      provider: args.provider,
      primarySkill: args.route.primarySkill,
      output: response.fullText,
      events
    };
  }
}