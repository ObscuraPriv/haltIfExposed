export type PrivacyState = "SAFE" | "ELEVATED" | "CORRELATING" | "EXPOSED" | "CONTAINED";

export type Surface = {
  id: string;                  // e.g. "api.obscura.run"
  endpoints?: string[];        // public paths
  openPorts?: number[];        // observed ports
};

export type Metadata = {
  headers?: Record<string, string>;
  logsEnabled?: boolean;
  credentialTTLSeconds?: number;   // remaining TTL
  exposureSignals?: string[];      // e.g. ["public-log", "leaky-header"]
};

export type Policy = {
  denyByDefault: boolean;
  maxCredentialTTLSeconds: number;
  forbidPlaintextLogs: boolean;
  forbiddenHeaders: string[];      // headers that should never appear
  exposureThreshold: number;       // deterministic threshold
};

export type RiskVector = {
  score: number;                  // deterministic risk score
  signals: string[];              // reasons
  exposed: boolean;
};

export type EnforcementAction =
  | { kind: "NOOP" }
  | { kind: "PRUNE_LOGS" }
  | { kind: "ROTATE_KEYS" }
  | { kind: "REVOKE_TOKENS" }
  | { kind: "ISOLATE_SURFACE" }
  | { kind: "CONTAIN" };

export type Attestation = {
  surfaceId: string;
  prevState: PrivacyState;
  nextState: PrivacyState;
  risk: RiskVector;
  actions: EnforcementAction[];
  policyHash: string;
  attestationHash: string;
  ts: number;
};
