
# Threat Model

Obscura assumes adversaries can:

- Correlate wallet ↔ IP ↔ domain
- Scrape metadata from public surfaces
- Exploit stale credentials
- Infer identity via logs or headers
- Enumerate runtime endpoints
- Perform timing analysis on responses

We do NOT assume:

- Trusted infrastructure
- Perfect anonymity
- Zero compromise probability

We assume breach is possible.
We enforce containment.

attack_surface ↓
metadata ↓
correlation ↓

Containment > perimeter defense.
