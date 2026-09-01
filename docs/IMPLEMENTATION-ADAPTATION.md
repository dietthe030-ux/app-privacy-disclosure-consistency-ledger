# Stage 1/2 Implementation Adaptation

Date: 2026-09-01

## Research-package provenance

`RESEARCH-HANDOFF-R4.md` identifies the approved package as SHA-256 `377D62248B34C0822C50B6230ED67D60EC8CC588E6137209674105558C8EFF90`, which matches the current research package. `STAGE-1.md` and `RESEARCH-HANDOFF-R2.md` retain the superseded R2 hash `D6D5DD20D86AE616CE7A3E084C26E4DDF31410E4AF72383EC62A11C2F344E046`; they are historical metadata and are not used as the current build identity.

## Consensus mechanism

- Original choice: one `gl.eq_principle.strict_eq(fetch_decision)` call for the assessment.
- Verified problem/risk: the approved decision requires semantic extraction from live pages using `gl.nondet.exec_prompt`. Current official documentation says `strict_eq` requires exact matching and is unsuitable for LLM output; the runtime probe also showed the installed Direct Mode harness returns JSON-shaped LLM data rather than a string. A shape-only strict comparison would either fail consensus or fail to prove the substantive decision.
- Authoritative evidence: current GenLayer non-determinism/equivalence documentation checked 2026-09-01; `genvm-lint 0.11.0`; `genlayer-test 0.29.2`; exact probe `.probe/contract_probe.py`.
- Replacement: `gl.vm.run_nondet_unsafe(leader_fn, validator_fn)`. Both functions independently fetch both frozen URLs, bound to a 12,000-byte UTF-8 window, and independently extract the same bounded category/retention fields. The validator compares the complete canonical normalized decision, including source digests. Deterministic code derives `CONSISTENT`, `MATERIAL_CONFLICT`, `DISCLOSURE_MISSING`, or `UNRESOLVED` after consensus; no model prose is authoritative or stored.
- Preserved product outcomes: same two-source privacy comparison, four safe verdicts, validator consensus, source lineage, reassessment history and public judge journey.
- Affected tests/evidence: Direct Mode agreement/disagreement, malformed/missing/unavailable output, category/retention boundary fixtures, source digest binding, and final readback; PRE_DEPLOY package must disclose the custom validator and exact normalized schema.
- Residual risk: live public pages can change or fail between validators. Disagreement or runtime failure must leave state unchanged; a common unavailable response may produce a safe `UNRESOLVED` assessment.

