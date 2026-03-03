import { Metadata, Policy, RiskVector, Surface } from "./types";
import { sha256, stableJson } from "./utils";

export function defaultPolicy(): Policy {
  return {
    denyByDefault: true,
    maxCredentialTTLSeconds: 60 * 60 * 6, // 6h
    forbidPlaintextLogs: true,
    forbiddenHeaders: ["x-forwarded-for", "cf-connecting-ip", "x-real-ip"],
    exposureThreshold: 3
  };
}

export function hashPolicy(policy: Policy): string {
  return sha256(stableJson(policy));
}

// Deterministic evaluation: no heuristics, no randomness.
export function evaluateRisk(surface: Surface, metadata: Metadata, policy: Policy): RiskVector {
  let score = 0;
  const signals: string[] = [];

  // Plaintext logs are an automatic risk bump
  if (policy.forbidPlaintextLogs && metadata.logsEnabled === true) {
    score += 2;
    signals.push("plaintext-logs-enabled");
  }

  // Credential TTL too long -> increases risk
  if (
    typeof metadata.credentialTTLSeconds === "number" &&
    metadata.credentialTTLSeconds > policy.maxCredentialTTLSeconds
  ) {
    score += 1;
    signals.push("credential-ttl-too-long");
  }

  // Forbidden headers presence -> exposure signal
  const headers = metadata.headers || {};
  for (const h of policy.forbiddenHeaders) {
    const found = Object.keys(headers).some((k) => k.toLowerCase() === h.toLowerCase());
    if (found) {
      score += 1;
      signals.push(`forbidden-header:${h}`);
    }
  }

  // Explicit signals passed in
  for (const s of metadata.exposureSignals || []) {
    score += 1;
    signals.push(`signal:${s}`);
  }

  // Surface sprawl: more endpoints/ports -> more exposure potential
  const endpointCount = (surface.endpoints || []).length;
  const portCount = (surface.openPorts || []).length;
  if (endpointCount > 10) {
    score += 1;
    signals.push("surface:endpoint-sprawl");
  }
  if (portCount > 5) {
    score += 1;
    signals.push("surface:port-sprawl");
  }

  const exposed = score >= policy.exposureThreshold;
  return { score, signals, exposed };
}
