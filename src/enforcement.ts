import { Attestation, EnforcementAction, Metadata, Policy, PrivacyState, Surface } from "./types";
import { evaluateRisk, hashPolicy } from "./policy";
import { nextState } from "./state-machine";
import { makeAttestation } from "./attestation";

export type EnforcementResult = {
  prevState: PrivacyState;
  nextState: PrivacyState;
  actions: EnforcementAction[];
  attestation: Attestation;
};

export function enforce(params: {
  surface: Surface;
  metadata: Metadata;
  policy: Policy;
  state: PrivacyState;
}): EnforcementResult {
  const { surface, metadata, policy, state } = params;

  const policyHash = hashPolicy(policy);
  const risk = evaluateRisk(surface, metadata, policy);

  const plannedNext = nextState(state, risk);

  const actions: EnforcementAction[] = [];

  if (risk.exposed) {
    // Deterministic containment sequence
    actions.push({ kind: "ROTATE_KEYS" });
    actions.push({ kind: "REVOKE_TOKENS" });
    actions.push({ kind: "PRUNE_LOGS" });
    actions.push({ kind: "ISOLATE_SURFACE" });
    actions.push({ kind: "CONTAIN" });
  } else {
    actions.push({ kind: "NOOP" });
  }

  const finalNext: PrivacyState = risk.exposed ? "CONTAINED" : plannedNext;

  const attestation = makeAttestation({
    surfaceId: surface.id,
    prevState: state,
    nextState: finalNext,
    risk,
    actions,
    policyHash
  });

  return { prevState: state, nextState: finalNext, actions, attestation };
}
