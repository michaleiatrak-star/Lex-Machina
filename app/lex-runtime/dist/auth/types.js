export const DEFAULT_MODEL_ROUTING_PREFERENCES = {
    auxiliaryEnabled: false,
    auxiliaryProvider: "openai",
    auxiliaryModel: "local/bielik-11b-v3-q4km"
};
export const DEFAULT_AUTH_SESSION_POLICY = {
    idleTimeoutMs: 15 * 60 * 1000,
    overallTimeoutMs: 8 * 60 * 60 * 1000
};
export const DEFAULT_AUTH_KDF = {
    algorithm: "ARGON2ID",
    memoryKiB: 64 * 1024,
    iterations: 3,
    parallelism: 1,
    keyLength: 32,
    version: 1
};
