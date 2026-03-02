
# Privacy State Machine

States:

SAFE
ELEVATED
CORRELATING
EXPOSED
CONTAINED

Transitions:

SAFE → ELEVATED (metadata anomaly detected)
ELEVATED → CORRELATING (identity linkage vector detected)
CORRELATING → EXPOSED (proof of leak)
EXPOSED → CONTAINED (key rotation + isolation + log pruning)

System never transitions from EXPOSED → SAFE
without full state reset.

Deterministic rule:

f(state, signal, policy) → next_state
