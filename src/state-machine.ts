import { PrivacyState, RiskVector } from "./types";

export function nextState(prev: PrivacyState, risk: RiskVector): PrivacyState {
  // Deterministic transitions (no direct EXPOSED -> SAFE).
  if (prev === "CONTAINED") return "CONTAINED";

  if (risk.exposed) {
    // Once exposed, go to EXPOSED then CONTAINED via enforcement.
    return prev === "EXPOSED" ? "EXPOSED" : "EXPOSED";
  }

  // Not exposed: decay towards SAFE, but step-wise.
  if (prev === "EXPOSED") return "EXPOSED";
  if (prev === "CORRELATING") return "ELEVATED";
  if (prev === "ELEVATED") return "SAFE";
  return "SAFE";
}
