# Verification — Privacy Disclosure Consistency Ledger

This document is the single evidence ledger for the current build revision. It is intentionally secret-free. Corrective replacement deployment and the exact-final Vercel E2E lifecycle are complete; a fresh `POST_GITHUB_VERCEL_FINAL` review is required for the updated evidence package.

## Identity

- Category: `PROJECT`
- Project folder: `E:\Genlayer-Projects\app-privacy-disclosure-consistency-ledger`
- Current contract source: `contracts/app_privacy_disclosure_consistency_ledger.py`
- Current contract SHA-256: `ACF89615555C2CAF2634F690661B2A53873DB5B3807F463EB34284B8181946FB`
- Current frontend lockfile SHA-256: `73ECF77F53911D17E656528D3B7D38BBE7C70C76E0024DA2381EB2BB117DC054`
- Current frontend source commit used by the exact-final Vercel deployment: `21439e6e8d2a1d88156593a943b356d1e64b48af`
- Contract source commit: `5cdd176013c2a06180119f0561078fd4f4fa734f`
- Network: Studionet (mandatory release network)
- Contract address: `0xfE2E4216502f12206A61a2b2103CbD1329FFb56b`
- Deployment transaction: `0xc945e31b1121c6b8c80d5e87cecd0a7cf3e6eefe921e712ebceaf9cb1d26be8e` (`FINALIZED`, `SUCCESS`)
- Live Studio application: deployed and live-verified. Production frontend is deployed at `https://app-privacy-disclosure-consistency.vercel.app/`; the shortened compatibility alias `https://app-privacy-consistency.vercel.app/` is bound to the same READY deployment; final Explorer submission remains separate.

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

## Exact-final Vercel E2E lifecycle

The exact final production alias is `https://app-privacy-disclosure-consistency.vercel.app/`. Deployment `dpl_FjcSZs34J9Tuiub9WDmQCVbvjxQF` is `READY`, has `gitCommitSha=21439e6e8d2a1d88156593a943b356d1e64b48af`, uses build root `frontend`, and serves `https://app-privacy-disclosure-consistency-ledger-255wf7epg.vercel.app`. The shortened compatibility alias `https://app-privacy-consistency.vercel.app/` was added to this same deployment after an independent probe of that hostname returned `DEPLOYMENT_NOT_FOUND`; fresh probes now return HTTP `200` for both aliases and both `?e2e=1` variants. The bundle is `/assets/index-CO7d9rP0.js`, 545492 bytes, SHA-256 `FF1F2EBF544224A567D405763C19120FF207E0C5A975E4AFEF42B68EE2E763F0`; it contains the replacement contract address, transaction evidence UI, progress spinner, and bounded readback path, while the superseded address is absent.

The deployment metadata source commit is the exact pushed frontend source commit. Any later evidence-only documentation commit does not alter `frontend/`, so the deployment/source relationship remains explicit and auditable.

The fresh browser run used OKX Wallet account `0xBf90Af1bc61314775d57B641b89c1f702a93b40D`, which differs from the locked Studio deployer `0xeF5D2119416A2f5afa35dCFA209766EFC1BE5902`. It used fresh record `privacy-ledger-final-e2e-20260902-r7` on the restored shortened alias `https://app-privacy-consistency.vercel.app/?e2e=1`, chain `61999`, and the public Apple disclosure/policy URLs.

| Final UI E2E | Transaction | Finality and semantic result | Browser UI result | Authoritative readback |
|---|---|---|---|---|
| Create draft | `0xc3b00955f1bf9ccae9de3188eb3eefab1820f449539653c7d1480de5883d2cf6` | `FINALIZED`; `MAJORITY_AGREE`; leader execution `SUCCESS` | Hash shown; finalized confirmation; record read back | `state=DRAFT`, `revision=0` |
| Freeze sources | `0x8e12320084eb09b269c6f4ae44e707b0b48ef777bb8de55673db4f2901646828` | `FINALIZED`; `MAJORITY_AGREE`; leader execution `SUCCESS` | Hash shown; finalized confirmation; record read back | `state=FROZEN`, `revision=0` |
| Assess | `0xd47a69b832330909e0e6fb42d85a8d71e3372e260d48a57cc5d682f1c231576b` | `FINALIZED`; `MAJORITY_AGREE`; leader execution `SUCCESS` | Hash shown; finalized confirmation; record read back | `state=ASSESSED`, `revision=1` |
| Reassess | `0xf777903d1eea25038aeac8643e2bd975f819c8484182cc8b65e25de7fa1ddfb2` | `FINALIZED`; `MAJORITY_AGREE`; leader execution `SUCCESS` | Hash shown; finalized confirmation; record read back | `state=ASSESSED`, `revision=2` |

Authoritative GenLayerJS reads confirm the final record is `ASSESSED`, revision `2`, verdict `UNRESOLVED`; `get_assessment(1)` and `get_assessment(2)` are both readable, and both revisions retain equal store digest `2d3eebbcb618c9b79217b5c54e90ea8b966facafb0ea78e30e0c0eb8fa5a5e76` and policy digest `3d2c8c276b6ac1c8bf282790f30a5b0ef96594afc72ef91a1bc988f89e04736a`. All four receipts independently report `FINALIZED`, `MAJORITY_AGREE`, matching sender/recipient, and leader execution `SUCCESS`. No duplicate write was sent.

### Request-count ledger

Instrumentation ran inside the deployed frontend only when `?e2e=1` was present. It counted wallet-provider requests and page JSON-RPC fetches, classified by method, with no secrets or storage inspection. The hard ceiling was `541`; the hard stop was not reached.

| Action | Total requests | Polling | Readback | Write submissions | Retries |
|---|---:|---:|---:|---:|---:|
| Create | 16 | 11 | 1 | 1 | 0 |
| Freeze | 16 | 11 | 1 | 1 | 0 |
| Assess | 21 | 16 | 1 | 1 | 0 |
| Reassess | 24 | 19 | 1 | 1 | 0 |
| Whole run | **123** | — | — | **4** | **0** |

Whole-run breakdown: provider `11` (`eth_requestAccounts=2`, `eth_chainId=3`, `eth_getBalance=2`, `eth_sendTransaction=4`) plus page JSON-RPC fetch `112` (`gen_call=43`, `eth_getTransactionCount=4`, `eth_estimateGas=4`, `eth_gasPrice=4`, `eth_getTransactionByHash=57`). The four write hashes are unique; no write retry or duplicate submission occurred. The run remained below the hard ceiling of `541`.

## Release blockers

1. Keep frontend/Vercel wiring separately bound to the approved replacement contract and chain.
2. GitHub/Vercel final submission and Project Explorer manual submission remain separate release gates; this verification does not claim those submissions are complete.
