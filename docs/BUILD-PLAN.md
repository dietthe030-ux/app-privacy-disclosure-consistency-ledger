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
- Contract baseline: `contracts/app_privacy_disclosure_consistency_ledger.py`; `genvm-lint check` and schema extraction pass; Direct Mode suite: `8 passed` with pickling, disagreement, malformed/missing/empty/overlong-output, source-change, delimiter-boundary and runtime-response probe coverage.
- Frontend: functional baseline added under `frontend/` after the user authorized the minimum dependency install. It uses `genlayer-js@1.1.8`, Vite `8.2.2`, TypeScript `7.0.2`, and no framework or connector dependency. It includes the explicit wallet picker, public record list/create/update journeys, finality/execution/readback handling, selected-provider balance preflight, and built-in Node regression tests.
- Frontend local checkpoint: `npm test` passes 12 wallet/provider tests and `npm run build` passes. A read-only local browser inspection also verified the zero-provider picker, focus, inertness and Escape restoration. Live reads/writes still require a deployed `VITE_CONTRACT_ADDRESS`; no deployment, signing, Studio operation, or Vercel E2E has occurred.
