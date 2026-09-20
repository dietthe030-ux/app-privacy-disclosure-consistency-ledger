# Verification — Privacy Disclosure Consistency Ledger

This document is the single evidence ledger for the project and is intentionally secret-free. The current candidate targets Studio Devnet 61997 but has no deployment address or live lifecycle yet. Historical 61999 deployments and Vercel journeys below are segregated provenance only and do not prove the current candidate.

## Steward-request correction status

- Corrected contract source SHA-256: `C475DF6EF49A4EE4984CFD98A1664E50D3577AEE1B5D98899253917CA6F897AA`.
- Source binding: Google Play requires exact package ID and path; Apple App Store requires the exact numeric ID path; publisher policy must use a distinct non-store HTTPS host.
- Conclusive verdict boundary: both app listing identity and publisher-policy identity must be `MATCH`; mismatch or uncertainty produces `UNRESOLVED`.
- Immutable assessment readback: every revision exposes retrieval time, requested URL, verified host, HTTP status, captured byte count, truncation flag, digest, bounded excerpt, exact supporting quotes for identity/category conclusions, normalized fields, reason and verdict through `get_assessment`.
- Oversized evidence is explicitly bounded and fails closed with `SOURCE_TRUNCATED`; it cannot produce a conclusive verdict.
- Frontend renders every retained revision and aligns Record ID validation with the contract.
- Validator verification: validators independently refetch both sources, compare consequential normalized decisions, and verify that the leader's bounded supporting quotes occur in independently retrieved source bytes; equivalent decisions may use different valid quotes.
- Upgrade lifecycle: constructor registers the deployer in native Root Slot upgraders; explicit authorization guards code replacement; authorized replacement and unauthorized rejection are covered locally.
- Local checks: lint/schema PASS with 8 methods; Direct Mode `17 passed`; frontend `13 passed`; production build PASS.
- Current target: Studio Devnet, chain `61997`, RPC `https://studio-dev.genlayer.com/api`, Explorer `https://explorer-studio-dev.genlayer.com/`.
- Current deployment status: `PENDING_DEPLOYMENT`; no 61997 contract address, deployment transaction, source parity, LIVE-01 through LIVE-04 proof, GitHub publication, Vercel artifact or production E2E is claimed.
- Read-only Studio Devnet readiness artifact: `docs/preflight/studio-tool-readiness.json`; SHA-256 groups `7302B6B6 82CD51EE 6412742C F64C6D20 E246FA6B 073B2B1A 03211661 78B04188` (full SHA `7302B6B682CD51EE6412742CF64C6D20E246FA6B073B2B1A0321166178B04188`).
- Required next gates: obtain the scoped `PRE_DEPLOY` approval, deploy once to Studio Devnet, verify exact source parity and fresh lifecycle evidence, then wire the frontend to the new 61997 address and pursue the separate GitHub/Vercel gates.

## Identity

- Category: `PROJECT`
- Project folder: `E:\Genlayer-Projects\app-privacy-disclosure-consistency-ledger`
- Current contract source: `contracts/app_privacy_disclosure_consistency_ledger.py`
- Current corrected candidate SHA-256: `C475DF6EF49A4EE4984CFD98A1664E50D3577AEE1B5D98899253917CA6F897AA`
- Current frontend lockfile SHA-256: `0EF3A34944BFA2006C6C958C4BD9467C499A46EA9BE9630C6A38A2D24AA33F31`
- Historical frontend source commit used by the superseded `0xfE2E...` Vercel deployment: `21439e6e8d2a1d88156593a943b356d1e64b48af`
- Contract source commit: `e63d5eaa816f8dfa79e069f6e30291885555565e`
- Current target network: Studio Devnet (`61997`); RPC `https://studio-dev.genlayer.com/api`; Explorer `https://explorer-studio-dev.genlayer.com/`.
- Current contract address: `PENDING_DEPLOYMENT`; deployment transaction: `PENDING_DEPLOYMENT`.
- Historical 61999 corrected contract: `0x41F4A7F278Ae526e98A329F2C31cA1CE31fa8c51`; deployment transaction `0x72732555ed7fda8caf2646f0e548908e180d789169c9ae3a4a443927d04813c6`. This address and its lifecycle are not current 61997 proof.
- Historical frozen address: `0xfE2E4216502f12206A61a2b2103CbD1329FFb56b`; it is not current 61997 proof.

## Local verification

| ID | Requirement | Command | Result |
|---|---|---|---|
| L-01 | Contract lint and schema visibility | `genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json` | PASS; 8 methods, 3 views, 5 writes |
| L-02 | Contract lifecycle, native upgrade authorization, exact model schema, source binding, immutable evidence, independent quote verification, negative consensus and fail-closed behavior | `py -3.13 -m pytest -q tests/direct/ -p no:cacheprovider` | PASS; 17 passed |
| F-01 | Frontend wallet/provider and assessment-history regression | `cd frontend; npm test` | PASS; 13 passed |
| F-02 | Frontend TypeScript/Vite production build | `cd frontend; npm run build` | PASS; Vite build succeeded |
| F-03 | Local dev entrypoint | `cd frontend; npm run dev -- --host 127.0.0.1` | PASS; HTTP 200 verified on `/` and `/src/main.ts` |

## Product and trust boundary

The contract owns the record lifecycle and the comparison verdict. The frontend only submits user-provided source metadata and triggers contract methods; it does not calculate or override the verdict. Each assessment stores a new revision and does not overwrite prior assessment history.

The contract is documentary comparison only. It does not establish privacy-law compliance, legal sufficiency, or the truth of either publisher-controlled source beyond the bounded comparison performed by the contract.

## PRE_DEPLOY status — current Studio Devnet candidate

- Contract classification: `UPGRADABLE`; deployer is registered in `gl.storage.Root.get().upgraders` and stored as the explicit authorized upgrader.
- Classification consequence: the locked Studio deployer is intended to be the sole explicit upgrader and will be registered in the native Root Slot upgrader list by the fresh 61997 deployment. Losing that Studio account or a Studio Devnet reset can require replacement deployment; no stronger recovery claim is made.
- Locked current Studio Devnet deployer/upgrader: configured actor `actor7`, public address `0x8581c4a532dd3f9b163b12809b1bd089f367147f`.
- Read-only Studio Devnet readiness balance is recorded in `docs/preflight/studio-tool-readiness.json`; no signature or transaction was sent. The prior `0x34b92E6553eaCA11A00A9d86d75d8a7881779D78` is historical 61999 actor data only.
- Anonymous `PRE_DEPLOY` status: the current Studio Devnet migration package is awaiting correction/re-review; no deployment is authorized by this document until the exact package is approved.
- Deployment runbook: `docs/DEPLOYMENT-RUNBOOK.md`.
- Exact current-source package: local lint/schema/Direct Mode complete; frontend local checks complete.
- Runtime compatibility evidence: `.probe/contract_probe.py` and `tests/direct/test_contract_probe.py` record that installed GenVM `0.3.0-rc7` exposes `Response.status`; `_response_status` prefers the official `status_code` field and safely falls back to that verified installed field.
- Negative evidence: validator disagreement, malformed/missing/empty/overlong model output, source-change digesting, and delimiter-boundary injection tests pass with pickling checks enabled.
- Disagreement rollback evidence: Direct Mode snapshots the pre-assessment state, forces validator disagreement, reverts the transaction simulation, and verifies the record remains `FROZEN`, IDs remain unchanged, and no assessment revision exists.
- Balance preflight: `MIN_SPENDABLE_BALANCE_WEI` is `0.01 GEN`, a documented conservative floor for this zero-value write flow; the selected provider/account is checked before session enablement and again before each write, with low-balance and threshold tests.
- Local rendered picker inspection at `http://127.0.0.1:5173/`: the first-judge flow opened a public `Choose a wallet` dialog, showed the zero-provider message, focused `Close wallet chooser`, set the application inert attribute, and on `Escape` closed the dialog and restored focus to `Connect wallet`. No account RPC or transaction was sent.
- Prior `POST_DEPLOY_TEST` verdict: `CHANGES REQUIRED` because the superseded deployment returned live source SHA-256 `BC02B9C1032D1C3D7CAA7AC43BEE12C86868072A25F1B0323B793D98697FF2E2` and 16520 bytes instead of the committed `ACF89615555C2CAF2634F690661B2A53873DB5B3807F463EB34284B8181946FB` and 16072 bytes. The frozen contract was replaced; the current package records fresh parity and fresh LIVE-01 through LIVE-04 evidence.
- Historical 61999 `POST_DEPLOY_TEST` verdict: `APPROVED` for the then-current deployment package; it does not authorize or validate this 61997 candidate.
- Historical anonymous delta verdicts remain attached only to the 61999 evidence package; current GitHub/Vercel and production E2E gates are pending.
- Current known warning: `genvm-lint` reports informational newer-runner notice `I200`; it is recorded and does not fail lint.

## Historical 2026-09-02 replacement source parity

- Superseded address: `0x97a005a129e0212c792CC00B20B702288c1C13EB`.
- Historical replacement address: `0xfE2E4216502f12206A61a2b2103CbD1329FFb56b`; it was later superseded by the steward-requested corrected contract.
- Canonical `gen_getContractCode` replacement result: 16072 bytes, SHA-256 `ACF89615555C2CAF2634F690661B2A53873DB5B3807F463EB34284B8181946FB`.
- Exact byte comparison: `True`; local source and live source are identical.

## Historical 61999 live proof matrix — not current 61997 evidence

The rows below are bound only to historical 61999 address `0x41F4A7F278Ae526e98A329F2C31cA1CE31fa8c51`, source SHA-256 `C475DF6EF49A4EE4984CFD98A1664E50D3577AEE1B5D98899253917CA6F897AA`, and record `privacy-ledger-steward-20260907-001`. They do not prove a Studio Devnet 61997 deployment.

| ID | Action | Transaction | Finalized + semantic result | Authoritative readback | Status |
|---|---|---|---|---|---|
| LIVE-01 | Create | `0x789fd47aabe035eec33306506eabd7d5783a7fa5008d956a74bc1d79695c964f` | `FINALIZED`; `MAJORITY_AGREE`; leader `SUCCESS` | `DRAFT`, revision `0`, `UNRESOLVED` | PASS |
| LIVE-02 | Freeze | `0x260e42bfee28df6a7b92cd0bef9f9f859261f38429a49c0a31ecfd494085d045` | `FINALIZED`; `MAJORITY_AGREE`; leader `SUCCESS` | `FROZEN`, revision `0`, `UNRESOLVED` | PASS |
| LIVE-03 | Assess | `0xb50c041818f85a6f6cd36eecf7cffe75c7f17862be8a2f5fbf46ff28d69f9bd5` | `FINALIZED`; `MAJORITY_AGREE`; leader `SUCCESS` | `ASSESSED`, revision `1`; assessment 1 readable | PASS |
| LIVE-04 | Reassess | `0x93228a72f006dabfdaef6fe655ec008e736f567d7b077b26da3f0c5fb68346d4` | `FINALIZED`; `MAJORITY_AGREE`; leader `SUCCESS` | `ASSESSED`, revision `2`; assessments 1 and 2 readable | PASS WITH DIGEST VARIANCE |

Revision 1 remains readable with store/policy digests `73d292880ca37c53c26e99ef77478c1aaff52e49d560f4cee5f0e98dfc7849c2` / `215321f297e5b947097d488d53332af8cc2bb1d892a89658755a07e18340a2f9`. Revision 2 records `73d292880ca37c53c26e99ef77478c1aaff52e49d560f4cee5f0e98dfc7849c2` / `80b90356a4b2f8801579ec3b8ca39d04bb2848ee215c19d71a3d08cf8a682c31`. The dynamic publisher-policy response changed between retrievals; the immutable evidence history exposes rather than hides this drift. Both outcomes fail closed as `UNRESOLVED` with reason `SOURCE_TRUNCATED`.

### Historical frozen-schema lifecycle

The following rows are retained only as historical evidence for the previous contract and are not part of the corrected deployment's acceptance claim.

| ID | Actor / action | Contract method | Transaction | Finalized + semantic result | Authoritative readback | Status |
|---|---|---|---|---|---|---|
| LIVE-01 | Publisher creates a draft record `privacy-ledger-replacement-20260902` | `create` | `0x3650d9bc1c4a7f12f765506c8ef98e2e415519b1e8cb7002a7b737545ce46f0c` | `FINALIZED`; `SUCCESS`; consensus reached | Finalized `get`: `state=DRAFT`, `revision=0`, `verdict=UNRESOLVED` | PASS |
| LIVE-02 | Owner freezes the two source URLs | `freeze` | `0xb3d75441e939fd863af0a25e8ba8a3a8f1b939d26e2446551ba50dac485eb157` | `FINALIZED`; `SUCCESS`; consensus reached | Finalized `get`: `state=FROZEN`, `revision=0` | PASS |
| LIVE-03 | Any user assesses frozen sources | `assess` | `0x80fe6c5772896b06cf651a63c6145d16aad6fc23a4e4b6462e6d1922c524d021` | `FINALIZED`; `SUCCESS`; consensus reached | Finalized `get`: `state=ASSESSED`, `revision=1`; `get_assessment(1)`: matching digests, `UNRESOLVED` | PASS |
| LIVE-04 | Any user appends a reassessment | `reassess` | `0x5302e0a159019d19ec46391637bf7365dbd01b8986a08d2c276e65a8853d0080` | `FINALIZED`; `SUCCESS`; consensus/finality reached | Finalized `get`: `state=ASSESSED`, `revision=2`; `get_assessment(2)` readable and preserves revision 1 | PASS |

## Historical Vercel E2E — historical 61999 frontend and superseded contract `0xfE2E4216502f12206A61a2b2103CbD1329FFb56b`

All evidence in this section belongs only to the historical frontend wired to 61999 contract `0xfE2E4216502f12206A61a2b2103CbD1329FFb56b`. It does **not** validate historical 61999 contract `0x41F4A7F278Ae526e98A329F2C31cA1CE31fa8c51`, the current Studio Devnet 61997 candidate, its future frontend artifact, or `POST_GITHUB_VERCEL_FINAL`. Current 61997 Vercel deployment and browser E2E are pending.

Historical deployment `dpl_FjcSZs34J9Tuiub9WDmQCVbvjxQF` was `READY`, had `gitCommitSha=21439e6e8d2a1d88156593a943b356d1e64b48af`, used build root `frontend`, and served `https://app-privacy-disclosure-consistency-ledger-255wf7epg.vercel.app`. Its historical aliases were `https://app-privacy-disclosure-consistency.vercel.app/` and `https://app-privacy-consistency.vercel.app/`. Its bundle `/assets/index-CO7d9rP0.js` was 545492 bytes with SHA-256 `FF1F2EBF544224A567D405763C19120FF207E0C5A975E4AFEF42B68EE2E763F0` and contained historical contract `0xfE2E4216502f12206A61a2b2103CbD1329FFb56b`.

The historical deployment metadata source commit exactly matched that historical frontend source. The historical browser run used OKX Wallet account `0xBf90Af1bc61314775d57B641b89c1f702a93b40D`, fresh record `privacy-ledger-final-e2e-20260902-r7`, chain `61999`, and `https://app-privacy-consistency.vercel.app/?e2e=1`. These facts are retained only as provenance for the superseded frontend journey.

| Historical UI E2E on `0xfE2E...` | Transaction | Finality and semantic result | Browser UI result | Authoritative readback |
|---|---|---|---|---|
| Create draft | `0xc3b00955f1bf9ccae9de3188eb3eefab1820f449539653c7d1480de5883d2cf6` | `FINALIZED`; `MAJORITY_AGREE`; leader execution `SUCCESS` | Hash shown; finalized confirmation; record read back | `state=DRAFT`, `revision=0` |
| Freeze sources | `0x8e12320084eb09b269c6f4ae44e707b0b48ef777bb8de55673db4f2901646828` | `FINALIZED`; `MAJORITY_AGREE`; leader execution `SUCCESS` | Hash shown; finalized confirmation; record read back | `state=FROZEN`, `revision=0` |
| Assess | `0xd47a69b832330909e0e6fb42d85a8d71e3372e260d48a57cc5d682f1c231576b` | `FINALIZED`; `MAJORITY_AGREE`; leader execution `SUCCESS` | Hash shown; finalized confirmation; record read back | `state=ASSESSED`, `revision=1` |
| Reassess | `0xf777903d1eea25038aeac8643e2bd975f819c8484182cc8b65e25de7fa1ddfb2` | `FINALIZED`; `MAJORITY_AGREE`; leader execution `SUCCESS` | Hash shown; finalized confirmation; record read back | `state=ASSESSED`, `revision=2` |

Historical authoritative GenLayerJS reads for contract `0xfE2E...` confirmed its final record was `ASSESSED`, revision `2`, verdict `UNRESOLVED`; `get_assessment(1)` and `get_assessment(2)` were both readable, and both revisions retained equal store digest `2d3eebbcb618c9b79217b5c54e90ea8b966facafb0ea78e30e0c0eb8fa5a5e76` and policy digest `3d2c8c276b6ac1c8bf282790f30a5b0ef96594afc72ef91a1bc988f89e04736a`. All four historical receipts reported `FINALIZED`, `MAJORITY_AGREE`, matching sender/recipient, and leader execution `SUCCESS`; no duplicate write was sent. This evidence is not a readback of corrected contract `0x41F4...`.

### Historical request-count ledger

This request ledger applies only to the historical 61999 `0xfE2E...` Vercel journey. Instrumentation ran inside that deployed frontend only when `?e2e=1` was present. It counted wallet-provider requests and page JSON-RPC fetches, classified by method, with no secrets or storage inspection. The hard ceiling was `541`; the hard stop was not reached. A fresh measured ledger remains required for the current Studio Devnet 61997 production journey.

| Action | Total requests | Polling | Readback | Write submissions | Retries |
|---|---:|---:|---:|---:|---:|
| Create | 16 | 11 | 1 | 1 | 0 |
| Freeze | 16 | 11 | 1 | 1 | 0 |
| Assess | 21 | 16 | 1 | 1 | 0 |
| Reassess | 24 | 19 | 1 | 1 | 0 |
| Whole run | **123** | — | — | **4** | **0** |

Historical whole-run breakdown: provider `11` (`eth_requestAccounts=2`, `eth_chainId=3`, `eth_getBalance=2`, `eth_sendTransaction=4`) plus page JSON-RPC fetch `112` (`gen_call=43`, `eth_getTransactionCount=4`, `eth_estimateGas=4`, `eth_gasPrice=4`, `eth_getTransactionByHash=57`). The four historical write hashes are unique; no write retry or duplicate submission occurred. That superseded-contract run remained below the hard ceiling of `541`.

## Release blockers

1. Deploy to Studio Devnet 61997 and verify a fresh contract address, exact source parity, and LIVE-01 through LIVE-04; historical 61999 addresses cannot satisfy this gate.
2. Build and verify a new frontend/Vercel artifact explicitly wired to the fresh 61997 address; historical `0xfE2E...` and 61999 Vercel evidence cannot satisfy this gate.
3. GitHub/Vercel final submission and Project Explorer manual submission remain separate release gates; this verification does not claim those submissions are complete.
