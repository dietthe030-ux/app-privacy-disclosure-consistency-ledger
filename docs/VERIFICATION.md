# Verification — Privacy Disclosure Consistency Ledger

This document is the single evidence ledger for the current build revision. It is intentionally secret-free. Corrective replacement deployment, production Vercel deployment, and the bounded affected E2E rerun are complete; anonymous `POST_DEPLOY_TEST` is approved for exact frontend/evidence HEAD `eb853b6688a73b5924daa7bdafdd865f02a7b8ea`.

## Identity

- Category: `PROJECT`
- Project folder: `E:\Genlayer-Projects\app-privacy-disclosure-consistency-ledger`
- Current contract source: `contracts/app_privacy_disclosure_consistency_ledger.py`
- Current contract SHA-256: `ACF89615555C2CAF2634F690661B2A53873DB5B3807F463EB34284B8181946FB`
- Current frontend lockfile SHA-256: `73ECF77F53911D17E656528D3B7D38BBE7C70C76E0024DA2381EB2BB117DC054`
- Current frontend/evidence commit: `eb853b6688a73b5924daa7bdafdd865f02a7b8ea`
- Contract source commit: `5cdd176013c2a06180119f0561078fd4f4fa734f`
- Network: Studionet (mandatory release network)
- Contract address: `0xfE2E4216502f12206A61a2b2103CbD1329FFb56b`
- Deployment transaction: `0xc945e31b1121c6b8c80d5e87cecd0a7cf3e6eefe921e712ebceaf9cb1d26be8e` (`FINALIZED`, `SUCCESS`)
- Live Studio application: deployed and live-verified. Production frontend is deployed at `https://app-privacy-disclosure-consistency.vercel.app/`; final Explorer submission remains separate.

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
- Prior `POST_DEPLOY_TEST` verdict: `CHANGES REQUIRED` because the superseded deployment returned live source SHA-256 `BC02B9C1032D1C3D7CAA7AC43BEE12C86868072A25F1B0323B793D98697FF2E2` and 16520 bytes instead of the committed `ACF89615555C2CAF2634F690661B2A53873DB5B3807F463EB34284B8181946FB` and 16072 bytes. The frozen contract was replaced; the current package records fresh parity and fresh LIVE-01 through LIVE-04 evidence.
- Corrective anonymous `POST_DEPLOY_TEST` verdict: `APPROVED` for exact HEAD `c60bf028ca67d6d6bc51ce93306b9ee4986825e1`.
- Anonymous delta verdicts: `APPROVED` for the frontend redesign/hash evidence delta at `b9be2bf65448ee0f8152100acb9ac6a5cc237477` and bounded finalized-readback delta at `eb853b6688a73b5924daa7bdafdd865f02a7b8ea`.
- Current known warning: `genvm-lint` reports informational newer-runner notice `I200`; it is recorded and does not fail lint.

## Replacement source parity

- Superseded address: `0x97a005a129e0212c792CC00B20B702288c1C13EB`.
- Replacement address: `0xfE2E4216502f12206A61a2b2103CbD1329FFb56b`.
- Canonical `gen_getContractCode` replacement result: 16072 bytes, SHA-256 `ACF89615555C2CAF2634F690661B2A53873DB5B3807F463EB34284B8181946FB`.
- Exact byte comparison: `True`; local source and live source are identical.

## Live proof matrix

The live rows below are bound to the deployed Studionet address and exact source hash.

| ID | Actor / action | Contract method | Transaction | Finalized + semantic result | Authoritative readback | Status |
|---|---|---|---|---|---|---|
| LIVE-01 | Publisher creates a draft record `privacy-ledger-replacement-20260902` | `create` | `0x3650d9bc1c4a7f12f765506c8ef98e2e415519b1e8cb7002a7b737545ce46f0c` | `FINALIZED`; `SUCCESS`; consensus reached | Finalized `get`: `state=DRAFT`, `revision=0`, `verdict=UNRESOLVED` | PASS |
| LIVE-02 | Owner freezes the two source URLs | `freeze` | `0xb3d75441e939fd863af0a25e8ba8a3a8f1b939d26e2446551ba50dac485eb157` | `FINALIZED`; `SUCCESS`; consensus reached | Finalized `get`: `state=FROZEN`, `revision=0` | PASS |
| LIVE-03 | Any user assesses frozen sources | `assess` | `0x80fe6c5772896b06cf651a63c6145d16aad6fc23a4e4b6462e6d1922c524d021` | `FINALIZED`; `SUCCESS`; consensus reached | Finalized `get`: `state=ASSESSED`, `revision=1`; `get_assessment(1)`: matching digests, `UNRESOLVED` | PASS |
| LIVE-04 | Any user appends a reassessment | `reassess` | `0x5302e0a159019d19ec46391637bf7365dbd01b8986a08d2c276e65a8853d0080` | `FINALIZED`; `SUCCESS`; consensus/finality reached | Finalized `get`: `state=ASSESSED`, `revision=2`; `get_assessment(2)` readable and preserves revision 1 | PASS |

## Production Vercel E2E delta

The final production alias is `https://app-privacy-disclosure-consistency.vercel.app/`. Deployment `dpl_12twYFznR9xTqUFaUH4SRM9DjC63` is `READY`, has `gitCommitSha=eb853b6688a73b5924daa7bdafdd865f02a7b8ea`, and uses build root `frontend`. The bundle is `/assets/index-RLLSdGDN.js` with 542158 bytes and SHA-256 `393AFC45AE416C2A0B40308BC53DBB311B8362091C1E4A7D3B16FF7E31191ED4`; it contains the replacement contract address, transaction evidence UI, progress spinner, and bounded readback path, while the superseded address is absent.

The affected browser rerun used the connected OKX Wallet account `0xBf90Af1bc61314775d57B641b89c1f702a93b40D`, which differs from the locked Studio deployer `0xeF5D2119416A2f5afa35dCFA209766EFC1BE5902`. Reassess transaction `0x8eae0c6c2bdd890553e5145521603ef99d8d5d94c2dee4717d92c5a9b773b86e` targeted the replacement contract, finalized successfully with Explorer GenVM result `SUCCESS`, and authoritative readback shows record `privacy-ledger-vercel-20260902` at `state=ASSESSED`, revision `4`, verdict `UNRESOLVED`. No duplicate write was sent after submission.

## Release blockers

1. Keep frontend/Vercel wiring separately bound to the approved replacement contract and chain.
2. GitHub/Vercel final submission and Project Explorer manual submission remain separate release gates; this verification does not claim those submissions are complete.
