import { Attestation, EnforcementAction, PrivacyState, RiskVector } from "./types";
import { sha256, stableJson } from "./utils";

export function makeAttestation(params: {
  surfaceId: string;
  prevState: PrivacyState;
  nextState: PrivacyState;
  risk: RiskVector;
  actions: EnforcementAction[];
  policyHash: string;
  ts?: number;
}): Attestation {
  const ts = params.ts ?? Date.now();

  const core = {
    surfaceId: params.surfaceId,
    prevState: params.prevState,
    nextState: params.nextState,
    risk: params.risk,
    actions: params.actions,
    policyHash: params.policyHash,
    ts
  };

  const attestationHash = sha256(stableJson(core));

  return {
    ...core,
    attestationHash
  };
}
