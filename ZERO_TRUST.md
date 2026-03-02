
# Zero Trust Model

deny_by_default = true

Rules:

- All inbound traffic requires explicit policy allow
- All outbound traffic minimized
- No implicit trust between modules
- Credentials scoped + time-bound
- Surface minimization enforced at runtime

trust = explicit_policy ∩ invariant_check

if trust == null:
    terminate_connection()
