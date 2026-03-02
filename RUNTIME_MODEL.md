
# Runtime Model

Obscura operates as a continuous enforcement loop:

scan(surface)
→ evaluate(risk_vector)
→ enforce(policy)
→ rotate(state_if_exposed)
→ attest(invariant)
→ repeat

Properties:

- No randomness
- Pure evaluation function
- Deterministic output given identical inputs

action = f(surface, metadata, policy)

if invariant_violation:
    contain()
