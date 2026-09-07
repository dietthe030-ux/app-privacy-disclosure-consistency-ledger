# App Privacy Disclosure Consistency Ledger — Build Plan

## Baseline and authority

- Category: `PROJECT`
- Approved research package: `E:\Genlayer-Projects\_research-candidates-2026-09-01\RESEARCH-CANDIDATES-R1.md`
- Approved package SHA-256: `377D62248B34C0822C50B6230ED67D60EC8CC588E6137209674105558C8EFF90`
- Research verdict: `APPROVED` in `RESEARCH-HANDOFF-R4.md`
- Product boundary: one contract, one record per app, two public HTTPS disclosures, documentary consistency only; no compliance or legal-advice claim.

## Minimal implementation

1. Contract: one `gl.Contract` with `DRAFT -> FROZEN -> ASSESSED`, append-only assessment history, owner-only freeze, permissionless assess/reassess, and safe failure without overwriting prior history.
2. Consensus: each leader and validator independently fetches both frozen URLs and extracts only bounded normalized fields. Deterministic code computes the public verdict after consensus.
3. Frontend: browse, create, detail/history; explicit MetaMask/OKX Wallet/Rabby picker; provider-selected writes; finality, execution-success and authoritative readback before success UI.
4. Verification: Direct Mode first, then exact source lint/schema, PRE_DEPLOY review, Studionet deployment/E2E, GitHub/Vercel and final review gates.

## Required proof

- category omission, qualifier mapping, renamed category, retention boundary, source change, unavailable/malformed evidence, validator disagreement, immutable revision-1 readback;
- all state-changing methods and their authorization/replay behavior;
- exact source, schema, runtime, deployment and frontend revision parity.

## Current local checkpoint

- Feasibility probe: `genvm-lint check` and `genlayer-test` Direct Mode passed on 2026-09-01 with `genvm-lint 0.11.0`, `genlayer-test 0.29.2`, Python 3.13, pickling enabled, agreement and deliberate disagreement coverage.
- Corrected contract candidate: `contracts/app_privacy_disclosure_consistency_ledger.py`; lint/schema pass and Direct Mode suite reports `16 passed`, including source identity, deceptive URL, exact model schema, immutable evidence, exact supporting quote, malformed/truncated source and fail-closed coverage.
- Frontend: functional baseline added under `frontend/` after the user authorized the minimum dependency install. It uses `genlayer-js@1.1.8`, Vite `8.2.2`, TypeScript `7.0.2`, and no framework or connector dependency. It includes the explicit wallet picker, public record list/create/update journeys, finality/execution/readback handling, selected-provider balance preflight, and built-in Node regression tests.
- Corrected frontend local checkpoint: `npm test` passes 13 tests and `npm run build` passes. It aligns Record ID rules and renders complete `get_assessment` history. The old Vercel artifact remains historical until a newly approved replacement contract is deployed and rebound.

## Steward-request repair implementation plan

The September 2026 resubmission correction keeps the product boundary and lifecycle unchanged while making every historical assessment independently auditable:

1. Bind each record to a platform-appropriate app-store listing plus a publisher-controlled privacy-policy URL, reject identical source URLs, and make the browser form use the exact same record-ID rule as the contract.
2. Snapshot retrieval metadata and bounded evidence for both sources in every assessment revision: requested URL, verified requested host, HTTP status, retrieval timestamp, captured byte count, SHA-256 digest, and a bounded readable excerpt. The current WebRequest response has no final-URL or redirect-chain field; the exact limitation and compensating controls are recorded below rather than fabricating provenance.
3. Return that complete immutable snapshot from `get_assessment(record_id, revision)` and render all retained revisions in the frontend, including normalized comparison fields and source evidence.
4. Add focused regressions for source binding, ID parity, historical evidence retention, changed sources, and frontend history rendering; then rerun lint/schema, Direct Mode, frontend tests, and production build.
5. Because the deployed contract is intentionally frozen and its storage/return schema changes materially, treat the current address as superseded. A replacement deployment, fresh lifecycle E2E, exact source parity, frontend address update, Vercel E2E, and affected anonymous gates are required before resubmission.

## FRONTEND RPC BUDGET MATRIX

FRONTEND_MATRIX_STATUS: READY

| Screen/workflow | Trigger | Read/write | RPC method | Cache key | TTL | Invalidation | Polling | Retry | Max requests | Transactions | Terminal/readback |
|---|---|---|---|---|---|---|---|---|---:|---:|---|
| Initial ledger list | First load or manual refresh | Read | list_ids plus get | chain-contract-method-args | session list; no verdict cache | account-network-contract or completed write | none | at most 2 delayed read retries | 80 | 0 | all visible records loaded or bounded error |
| Record assessment history | Each assessed record after get | Read | get_assessment | chain-contract-record-revision | session immutable revision | contract or network change | none | at most 2 delayed read retries | 48 | 0 | revisions 1 through current revision rendered or bounded error |
| Create record | One user click and wallet signature | Write/read | create plus status plus get | chain-contract-create-record | none | list and record after success | 3 seconds; at most 120 attempts | no write retry; readback at most 2 retries | 128 | 1 | FINALIZED, semantic SUCCESS, matching DRAFT readback |
| Freeze sources | One user click and wallet signature | Write/read | freeze plus status plus get | chain-contract-freeze-record | none | record after success | 3 seconds; at most 120 attempts | no write retry; readback at most 2 retries | 128 | 1 | FINALIZED, semantic SUCCESS, matching FROZEN readback |
| Compare sources | One user click and wallet signature | Write/read | assess plus status plus get and get_assessment | chain-contract-assess-record | none | record and history after success | 3 seconds; at most 120 attempts | no write retry; readback at most 2 retries | 129 | 1 | FINALIZED, semantic SUCCESS, ASSESSED record and revision snapshot |
| Reassess sources | One user click and wallet signature | Write/read | reassess plus status plus get and get_assessment | chain-contract-reassess-record | none | record and history after success | 3 seconds; at most 120 attempts | no write retry; readback at most 2 retries | 129 | 1 | FINALIZED, semantic SUCCESS, incremented revision snapshot |

## SOURCE-VERIFICATION REUSE MAP

| Required pattern | Source-specific replacement | Implemented source path/symbol | Regression-test path/name | Current evidence | Status |
|---|---|---|---|---|---|
| Exact identity retrieval | Google Play package ID or numeric Apple App Store ID embedded exactly in the listing URL | `contracts/app_privacy_disclosure_consistency_ledger.py::_valid_store_url` | `test_source_binding_rejects_wrong_identity_and_deceptive_urls` | Direct Mode source-binding cases pass | VERIFIED |
| Host/path allowlist | Exact `play.google.com/store/apps/details?id=` or `apps.apple.com/.../id<digits>`; policy on a distinct non-store host | `_valid_url`, `_url_host`, `_query_value`, `_valid_store_url`, `_valid_policy_url` | source-binding test above | deceptive host, user-info, wrong ID, same-source and store-as-policy rejected | VERIFIED |
| HTTP and bounded response | Structured response status; first 12,000 accepted bytes with explicit truncation flag | `_response_status`, `_source_evidence` | unavailable and source-change tests | HTTP failure and empty/changed source cases pass | VERIFIED |
| Canonicalization and fingerprint | Canonical sorted JSON and SHA-256 of the exact captured bytes used for assessment | `_canonical_decision`, `_source_evidence` | `test_assessment_exposes_immutable_audit_evidence` | digest equals snapshot fingerprint and changes with evidence | VERIFIED |
| Untrusted-data boundary | Hex-encoded app ID, platform and captured source bytes inside explicit untrusted-data delimiters | `_prompt` | `test_prompt_boundary_encodes_untrusted_delimiters` | injected delimiter remains encoded data | VERIFIED |
| Exact output schema | Exact top-level, side, identity, evidence and quote key sets plus allowlisted values; malformed or extra-key output fails closed | `_parse_side`, `_parse_identity`, `_parse_quotes`, `_canonical_decision` | `test_invalid_model_outputs_fail_closed`; `test_model_schema_rejects_unknown_top_level_nested_and_evidence_keys` | malformed and extra-key responses return `UNRESOLVED` | VERIFIED |
| Independent refetch and substantive equality | Validator independently refetches both sources, reruns extraction, compares all consequential normalized fields and checks leader quotes in its independently fetched bytes | `_run_assessment.validator_fn`, `_validator_accepts` | disagreement and independent-quote tests | consequential disagreement or absent leader quote rejects consensus; equivalent valid quote selection passes | VERIFIED |
| Fail-closed identity consequence | Both app-store identity and publisher-policy identity must be `MATCH` | `_verdict` | `test_identity_uncertainty_cannot_produce_conclusive_verdict` | uncertain relationship returns `UNRESOLVED` | VERIFIED |
| Immutable revision evidence | Timestamp, URL, host, status, byte count, truncation, digest, excerpt, normalized fields and verdict | `Assessment.decision_json`, `get_assessment` | audit-evidence test | revision 1 remains byte-equivalent after revision 2 | VERIFIED |
| Authoritative frontend readback | Read every revision through `get_assessment` and render the complete snapshot | `frontend/src/ledger.ts::getAssessment`, `frontend/src/main.ts::renderAssessmentHistory` | frontend history regression | tests and production build pass | VERIFIED LOCALLY |
| Finality and live reproducibility | Replacement deployment and fresh lifecycle with contract plus UI readback | pending affected gates | pending Studio/Vercel E2E | frozen old deployment cannot satisfy new schema | PLANNED |

## SOURCE-VERIFICATION PATTERN DEVIATION — redirect provenance

- Original reusable requirement: constrain or verify the final origin after redirects, and never present the submitted host as a measured final URL.
- Verified incompatibility: the current official `gl.nondet.web.Response` contains only `status`, `headers`, and `body`; the current `WebRequest` ABI exposes the same fields. Inspection of GenVM main on 2026-09-07 confirms its filtered HTTP client follows up to ten public redirect hops but drops `reqwest::Response.url()` when serializing the contract-visible response. No supported no-redirect option, final-URL field, or redirect-chain field exists in the current Python API.
- Current implementation: stores the exact requested URL and labels only its parsed host as `verified_host`; it does not store or claim a final URL. Exact app-store host/path/ID and distinct publisher-policy host are validated before retrieval. Both leader and validators independently refetch, require the source body to identify the requested app/publisher relationship, validate exact supporting quotes against their fetched bytes, and fail disagreement or uncertainty closed.
- Trust limitation: these controls bind the assessment to content returned for the exact requested HTTPS URL, but cannot attest the transport's final redirect origin. This limitation is public and must be considered by PRE_DEPLOY review; no documentation may call `verified_host` a final origin.
- Rejected alternative: inventing a response field/header, trusting `Content-Location` as transport provenance, or introducing a centralized fetch proxy would either be unsupported or weaken independent source verification.
- Affected tests: deceptive submitted URLs, exact app IDs, body-bound quotes, independent refetch disagreement, malformed/oversized evidence and immutable source digests.
- Durable closure: upgrade to contract-visible final-URL/redirect metadata if GenVM exposes it; until then, preserve this explicit limitation and the independent identity/quote controls.
