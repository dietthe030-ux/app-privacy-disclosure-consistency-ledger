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
- Contract address: not deployed
- Deployment transaction: not sent
- Live application: not deployed

## Local verification

| ID | Requirement | Command | Result |
|---|---|---|---|
| L-01 | Contract lint and schema visibility | `genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json` | PASS; 7 methods, 3 views, 4 writes |
| L-02 | Direct contract lifecycle, negative consensus, runtime probe and safe failure behavior | `py -3.13 -m pytest -q tests/direct/ -p no:cacheprovider` | PASS; 8 passed |
| F-01 | Frontend wallet/provider, legacy-scope, chain and balance regression | `cd frontend; npm test` | PASS; 8 passed |
| F-02 | Frontend TypeScript/Vite production build | `cd frontend; npm run build` | PASS; Vite build succeeded |
| F-03 | Local dev entrypoint | `cd frontend; npm run dev -- --host 127.0.0.1` | PASS; HTTP 200 verified on `/` and `/src/main.ts` |

## Product and trust boundary

The contract owns the record lifecycle and the comparison verdict. The frontend only submits user-provided source metadata and triggers contract methods; it does not calculate or override the verdict. Each assessment stores a new revision and does not overwrite prior assessment history.

The contract is documentary comparison only. It does not establish privacy-law compliance, legal sufficiency, or the truth of either publisher-controlled source beyond the bounded comparison performed by the contract.

## PRE_DEPLOY status

- Contract classification: `INTENTIONALLY FROZEN`.
- Classification consequence: a post-deployment defect requires a replacement contract and frontend address update; no upgrade authority is advertised.
- Studio deployer public address: `0xeF5D2119416A2f5afa35dCFA209766EFC1BE5902`.
- Observed Studio balance at selection: `998 GEN` (sufficient for the planned small writes at selection time; recheck immediately before deployment).
- Anonymous `PRE_DEPLOY` verdict: not requested.
- Deployment runbook: `docs/DEPLOYMENT-RUNBOOK.md`.
- Exact current-source package: local lint/schema/Direct Mode complete; frontend local checks complete.
- Runtime compatibility evidence: `.probe/contract_probe.py` and `tests/direct/test_contract_probe.py` record that installed GenVM `0.3.0-rc7` exposes `Response.status`; `_response_status` prefers the official `status_code` field and safely falls back to that verified installed field.
- Negative evidence: validator disagreement, malformed/missing/empty/overlong model output, source-change digesting, and delimiter-boundary injection tests pass with pickling checks enabled.
- Prior reviewer verdict on the superseded `7764f9d…` package: `CHANGES REQUIRED`; this revision contains the corrective delta and requires a fresh exact-package review.
- Current known warning: `genvm-lint` reports informational newer-runner notice `I200`; it is recorded and does not fail lint.

## Live proof matrix

Live rows are intentionally not populated before PRE_DEPLOY authorization and deployment.

| ID | Actor / action | Contract method | Transaction | Finalized + semantic result | Authoritative readback | Status |
|---|---|---|---|---|---|---|
| LIVE-01 | Publisher creates a draft record | `create` | not sent | not applicable | not available | NOT YET CREATED |
| LIVE-02 | Owner freezes the two source URLs | `freeze` | not sent | not applicable | not available | NOT YET CREATED |
| LIVE-03 | Any user assesses frozen sources | `assess` | not sent | not applicable | not available | NOT YET CREATED |
| LIVE-04 | Any user appends a reassessment | `reassess` | not sent | not applicable | not available | NOT YET CREATED |

## Release blockers

1. Obtain anonymous `PRE_DEPLOY` approval for this exact source/evidence package.
2. Deploy and complete the required live Studio matrix.
3. Set `VITE_CONTRACT_ADDRESS` only after the deployed address passes live smoke/readback verification.
