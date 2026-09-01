# Verification — Privacy Disclosure Consistency Ledger

This document is the single evidence ledger for the current build revision. It is intentionally secret-free. Blank live fields are permitted only because deployment and live testing have not started.

## Identity

- Category: `PROJECT`
- Project folder: `E:\Genlayer-Projects\app-privacy-disclosure-consistency-ledger`
- Current contract source: `contracts/app_privacy_disclosure_consistency_ledger.py`
- Current contract SHA-256: `ACF89615555C2CAF2634F690661B2A53873DB5B3807F463EB34284B8181946FB`
- Current frontend lockfile SHA-256: `73ECF77F53911D17E656528D3B7D38BBE7C70C76E0024DA2381EB2BB117DC054`
- Contract source commit: `5cdd176013c2a06180119f0561078fd4f4fa734f`
- Network: Studionet (mandatory release network)
- Contract address: `0x97a005a129e0212c792CC00B20B702288c1C13EB`
- Deployment transaction: `0x6c79de4694e9584293ba1eb31b20466c85bf417c3bdc899103c7db56ac39b2f7` (`FINALIZED`, `SUCCESS`)
- Live Studio application: deployed and live-verified; frontend address wiring remains a separate release step.

## Local verification

| ID | Requirement | Command | Result |
|---|---|---|---|
| L-01 | Contract lint and schema visibility | `genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json` | PASS; 7 methods, 3 views, 4 writes |
| L-02 | Direct contract lifecycle, negative consensus, runtime probe and safe failure behavior | `py -3.13 -m pytest -q tests/direct/ -p no:cacheprovider` | PASS; 8 passed |
| F-01 | Frontend wallet/provider, legacy-scope, chain, account and balance regression | `cd frontend; npm test` | PASS; 12 passed |
| F-02 | Frontend TypeScript/Vite production build | `cd frontend; npm run build` | PASS; Vite build succeeded |
| F-03 | Local dev entrypoint | `cd frontend; npm run dev -- --host 127.0.0.1` | PASS; HTTP 200 verified on `/` and `/src/main.ts` |

## Product and trust boundary

The contract owns the record lifecycle and the comparison verdict. The frontend only submits user-provided source metadata and triggers contract methods; it does not calculate or override the verdict. Each assessment stores a new revision and does not overwrite prior assessment history.

The contract is documentary comparison only. It does not establish privacy-law compliance, legal sufficiency, or the truth of either publisher-controlled source beyond the bounded comparison performed by the contract.

## PRE_DEPLOY status

- Contract classification: `INTENTIONALLY FROZEN`.
- Classification consequence: a post-deployment defect requires a replacement contract and frontend address update; no upgrade authority is advertised.
- Studio deployer public address: `0xeF5D2119416A2f5afa35dCFA209766EFC1BE5902`.
- Studio balance immediately before deployment: `998 GEN` (sufficient for the planned zero-value writes).
- Anonymous `PRE_DEPLOY` verdict: `APPROVED` for the exact pre-deploy source package at HEAD `610495ab520aacf4d3a13ca34b6355896ab007e8`.
- Deployment runbook: `docs/DEPLOYMENT-RUNBOOK.md`.
- Exact current-source package: local lint/schema/Direct Mode complete; frontend local checks complete.
- Runtime compatibility evidence: `.probe/contract_probe.py` and `tests/direct/test_contract_probe.py` record that installed GenVM `0.3.0-rc7` exposes `Response.status`; `_response_status` prefers the official `status_code` field and safely falls back to that verified installed field.
- Negative evidence: validator disagreement, malformed/missing/empty/overlong model output, source-change digesting, and delimiter-boundary injection tests pass with pickling checks enabled.
- Disagreement rollback evidence: Direct Mode snapshots the pre-assessment state, forces validator disagreement, reverts the transaction simulation, and verifies the record remains `FROZEN`, IDs remain unchanged, and no assessment revision exists.
- Balance preflight: `MIN_SPENDABLE_BALANCE_WEI` is `0.01 GEN`, a documented conservative floor for this zero-value write flow; the selected provider/account is checked before session enablement and again before each write, with low-balance and threshold tests.
- Local rendered picker inspection at `http://127.0.0.1:5173/`: the first-judge flow opened a public `Choose a wallet` dialog, showed the zero-provider message, focused `Close wallet chooser`, set the application inert attribute, and on `Escape` closed the dialog and restored focus to `Connect wallet`. No account RPC or transaction was sent.
- Prior reviewer verdict on the superseded `7764f9d…` package: `CHANGES REQUIRED`; this revision contains the corrective delta and requires a fresh exact-package review.
- Current known warning: `genvm-lint` reports informational newer-runner notice `I200`; it is recorded and does not fail lint.

## Live proof matrix

The live rows below are bound to the deployed Studionet address and exact source hash.

| ID | Actor / action | Contract method | Transaction | Finalized + semantic result | Authoritative readback | Status |
|---|---|---|---|---|---|---|
| LIVE-01 | Publisher creates a draft record `privacy-ledger-live-20260901` | `create` | `0x70d8db9a62b614ccfabbe855b12edd5b21cf609cf7df851e02b667254c164b1f` | `FINALIZED`; `SUCCESS`; consensus reached | Finalized `get`: `state=DRAFT`, `revision=0`, `verdict=UNRESOLVED` | PASS |
| LIVE-02 | Owner freezes the two source URLs | `freeze` | `0x72d12e8d2cadf773a1eca378488a758d5c6a4f89ccbc8d03a7e9686c361ef436` | `FINALIZED`; `SUCCESS`; consensus reached | Finalized `get`: `state=FROZEN`, `revision=0` | PASS |
| LIVE-03 | Any user assesses frozen sources | `assess` | `0xbc67077d80b49989887443b3d2e31a5b4a32c75d5d0e2fcbc512355edaf25de2` | `FINALIZED`; `SUCCESS`; consensus reached | Finalized `get`: `state=ASSESSED`, `revision=1`; `get_assessment(1)`: `SUFFICIENT`, `NORMALIZED`, `UNRESOLVED` | PASS |
| LIVE-04 | Any user appends a reassessment | `reassess` | `0x8a9a55465661a65428fb5fe7db5c85d3776a2689dd653caa7a72995b617a3672` | `FINALIZED`; `SUCCESS`; consensus/finality reached after leader rotation | Finalized `get`: `state=ASSESSED`, `revision=2`; `get_assessment(2)` readable and preserves revision 1 | PASS |

## Release blockers

1. Obtain anonymous `POST_DEPLOY_TEST` approval for this exact deployed-source/evidence package.
2. Set `VITE_CONTRACT_ADDRESS` only after the deployed address passes live smoke/readback verification (now satisfied).
