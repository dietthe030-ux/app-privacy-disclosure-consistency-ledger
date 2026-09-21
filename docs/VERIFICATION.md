# Verification — Privacy Disclosure Consistency Ledger

This document is the single evidence ledger for the project and is intentionally secret-free. The current candidate is deployed on Studio Devnet 61997 at `0xd07a6566f188ce5ce40b82598ee9c0f165608bea`; exact source parity and LIVE-01 through LIVE-04 are PASS. Two failed 61997 attempts are retained as diagnostic evidence and are not release evidence. Historical 61999 deployments and Vercel journeys below are segregated provenance only and do not prove the current candidate.

## Steward-request correction status

- Corrected contract source SHA-256: `7A1F9260FCC24174482142B522AAE60CA9BD96352BF8C497EB2B2E03CC991C8E`.
- Source binding: Google Play requires exact package ID and path; Apple App Store requires the exact numeric ID path; publisher policy must use a distinct non-store HTTPS host.
- Conclusive verdict boundary: both app listing identity and publisher-policy identity must be `MATCH`; mismatch or uncertainty produces `UNRESOLVED`.
- Immutable assessment readback: every revision exposes retrieval time, requested URL, verified host, HTTP status, captured byte count, truncation flag, digest, bounded excerpt, exact supporting quotes for identity/category conclusions, normalized fields, reason and verdict through `get_assessment`.
- Oversized evidence is explicitly bounded and fails closed with `SOURCE_TRUNCATED`; it cannot produce a conclusive verdict.
- Frontend renders every retained revision and aligns Record ID validation with the contract.
- Validator verification: validators independently refetch both sources, compare consequential normalized decisions, and verify that the leader's bounded supporting quotes occur in independently retrieved source bytes; equivalent decisions may use different valid quotes.
- Upgrade lifecycle: constructor registers the deployer in native Root Slot upgraders; explicit authorization guards code replacement; authorized replacement and unauthorized rejection are covered locally.
- Local checks: lint/schema PASS with 8 methods; Direct Mode `17 passed`; frontend `12 passed`; production build PASS.
- Current target: Studio Devnet, chain `61997`, RPC `https://studio-dev.genlayer.com/api`, Explorer `https://explorer-studio-dev.genlayer.com/`.
- Current deployment status: `DEPLOYED_FINALIZED`; accepted address `0xd07a6566f188ce5ce40b82598ee9c0f165608bea`, deployment transaction `0x3fa837ba9b5a200c26bcba0a30260e3b1c642eb5b21650fbfc91f9ef0f300b9a`, exact `gen_getContractCode` parity PASS, and LIVE-01 through LIVE-04 PASS. Failed diagnostic transactions `0xebb127384521ac8e654b54911a7d57ef4cc7c4ddff5c9b193b57edc63f7ed998` (address `0x689D1Bcd99cC7a27413fda4b19b3EFa603Fa5176`) and `0x272dbb4fded79ba11282453e0211a3822da94ccaeb62a0748f504c9306b688d6` (address `0x300C5c123F09e8D1bDE4d4392b4cc96c4853FC80`) both returned `FINALIZED` + `MAJORITY_AGREE` but `FINISHED_WITH_ERROR`; both remain explicitly unusable. GitHub publication, Vercel deployment and production browser E2E are not claimed.
- Read-only Studio Devnet readiness artifact: `docs/preflight/studio-tool-readiness-runtime-fix.json`; SHA-256 `D1B3C5E9E50B029561F278B4B1F64DB03ADCEA583708ED556D92AD05820ED300`, source-bound to the current adapted candidate. The recorded actor balance is the single read-only `account show` measurement at the artifact timestamp; the older readiness snapshots remain historical evidence only.
- Required next gates: bind the frontend to the accepted 61997 address, obtain the scoped post-deploy approval, publish the exact revision to GitHub, deploy Vercel from build root `frontend`, and only then perform the separate production browser E2E gate.

## Identity

- Category: `PROJECT`
- Project folder: `E:\Genlayer-Projects\app-privacy-disclosure-consistency-ledger`
- Current contract source: `contracts/app_privacy_disclosure_consistency_ledger.py`
- Current corrected candidate SHA-256: `7A1F9260FCC24174482142B522AAE60CA9BD96352BF8C497EB2B2E03CC991C8E`
- Current frontend lockfile SHA-256: `0EF3A34944BFA2006C6C958C4BD9467C499A46EA9BE9630C6A38A2D24AA33F31`
- Historical frontend source commit used by the superseded `0xfE2E...` Vercel deployment: `21439e6e8d2a1d88156593a943b356d1e64b48af`
- Contract source commit: `0c1ed06b00099023d7d04184017a9970e0d02275`
- Current target network: Studio Devnet (`61997`); RPC `https://studio-dev.genlayer.com/api`; Explorer `https://explorer-studio-dev.genlayer.com/`.
- Current contract address: `0xd07a6566f188ce5ce40b82598ee9c0f165608bea`; deployment transaction: `0x3fa837ba9b5a200c26bcba0a30260e3b1c642eb5b21650fbfc91f9ef0f300b9a`.
- Historical 61999 corrected contract: `0x41F4A7F278Ae526e98A329F2C31cA1CE31fa8c51`; deployment transaction `0x72732555ed7fda8caf2646f0e548908e180d789169c9ae3a4a443927d04813c6`. This address and its lifecycle are not current 61997 proof.
- Historical frozen address: `0xfE2E4216502f12206A61a2b2103CbD1329FFb56b`; it is not current 61997 proof.

## Local verification

| ID | Requirement | Command | Result |
|---|---|---|---|
| L-01 | Contract lint and schema visibility | `genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json` | PASS; 8 methods, 3 views, 5 writes |
| L-02 | Contract lifecycle, native upgrade authorization, exact model schema, source binding, immutable evidence, independent quote verification, negative consensus and fail-closed behavior | `wsl.exe bash -lc "cd /mnt/e/Genlayer-Projects/app-privacy-disclosure-consistency-ledger && /mnt/e/Genlayer-Tools/studio-next-toolchain/.wsl-venv/bin/python -m pytest -q -p no:cacheprovider"` | PASS; 17 passed in the matching pinned runtime (`genlayer-py 0.19.0rc2`, `genlayer-test 0.30.0rc2`, GenVM v0.3.0-rc7 / Manager v0.6.0-rc5) |
| F-01 | Frontend wallet/provider and assessment-history regression | `cd frontend; npm test` | PASS; 12 passed |
| F-02 | Frontend TypeScript/Vite production build | `cd frontend; npm run build` | PASS; Vite build succeeded |
| F-03 | Local dev entrypoint | `cd frontend; npm run dev -- --host 127.0.0.1` | PASS; HTTP 200 verified on `/` and `/src/main.ts` |

## Product and trust boundary

The contract owns the record lifecycle and the comparison verdict. The frontend only submits user-provided source metadata and triggers contract methods; it does not calculate or override the verdict. Each assessment stores a new revision and does not overwrite prior assessment history.

The contract is documentary comparison only. It does not establish privacy-law compliance, legal sufficiency, or the truth of either publisher-controlled source beyond the bounded comparison performed by the contract.

## PRE_DEPLOY status — current Studio Devnet candidate

- Contract classification: `UPGRADABLE`; deployer is registered in `gl.storage.Root.get().upgraders` and stored as the explicit authorized upgrader.
- Classification consequence: the locked Studio deployer is intended to be the sole explicit upgrader and will be registered in the native Root Slot upgrader list by the fresh 61997 deployment. Losing that Studio account or a Studio Devnet reset can require replacement deployment; no stronger recovery claim is made.
- Locked current Studio Devnet deployer/upgrader: configured actor `actor7`, public address `0x8581c4a532dd3f9b163b12809b1bd089f367147f`.
- Read-only Studio Devnet readiness balance is recorded in `docs/preflight/studio-tool-readiness-runtime-fix.json` (SHA-256 `D1B3C5E9E50B029561F278B4B1F64DB03ADCEA583708ED556D92AD05820ED300`, source-bound to `7A1F9260FCC24174482142B522AAE60CA9BD96352BF8C497EB2B2E03CC991C8E`); the actor line and `accountShow` check use the same `139.987760811499867053 GEN` measurement, and no signature or transaction was sent. The prior `0x34b92E6553eaCA11A00A9d86d75d8a7881779D78` is historical 61999 actor data only.
- Anonymous `PRE_DEPLOY` status: satisfied for the deployed candidate; the deployment and live lifecycle evidence are recorded below. The post-deploy package remains scoped to this exact source, address and evidence revision.
- Deployment runbook: `docs/DEPLOYMENT-RUNBOOK.md`.
- Exact current-source package: local lint/schema/Direct Mode complete; frontend local checks complete.
- Runtime compatibility evidence: `.probe/contract_probe.py` and `tests/direct/test_contract_probe.py` record that installed GenVM `0.3.0-rc7` exposes `Response.status`; `_response_status` prefers the official `status_code` field and safely falls back to that verified installed field.
- Negative evidence: validator disagreement, malformed/missing/empty/overlong model output, source-change digesting, and delimiter-boundary injection tests pass with pickling checks enabled.
- Disagreement rollback evidence: Direct Mode snapshots the pre-assessment state, forces validator disagreement, reverts the transaction simulation, and verifies the record remains `FROZEN`, IDs remain unchanged, and no assessment revision exists.
- Wallet connection has no artificial GEN balance floor. It verifies only the selected account and Studio Devnet chain. Each write obtains a current GenLayerJS fee estimate and submits its distribution plus non-zero `feeValue`, while leaving non-payable contract-call `value` unset; provider errors report insufficient affordability only at transaction time. Regression assertions prevent `eth_getBalance`, a fixed minimum, or zero-value fee submission from returning.
- Local rendered picker inspection at `http://127.0.0.1:5173/`: the first-judge flow opened a public `Choose a wallet` dialog, showed the zero-provider message, focused `Close wallet chooser`, set the application inert attribute, and on `Escape` closed the dialog and restored focus to `Connect wallet`. No account RPC or transaction was sent.
- Prior `POST_DEPLOY_TEST` verdict: `CHANGES REQUIRED` because the superseded deployment returned live source SHA-256 `BC02B9C1032D1C3D7CAA7AC43BEE12C86868072A25F1B0323B793D98697FF2E2` and 16520 bytes instead of the committed `ACF89615555C2CAF2634F690661B2A53873DB5B3807F463EB34284B8181946FB` and 16072 bytes. The frozen contract was replaced; the current package records fresh parity and fresh LIVE-01 through LIVE-04 evidence.
- Historical 61999 `POST_DEPLOY_TEST` verdict: `APPROVED` for the then-current deployment package; it does not authorize or validate this 61997 candidate.
- Historical anonymous delta verdicts remain attached only to the 61999 evidence package; current GitHub/Vercel publication and production E2E gates are pending.
- Current known warning: `genvm-lint` reports informational newer-runner notice `I200`; it is recorded and does not fail lint. The current exact local Direct Mode rerun used the matching pinned WSL toolchain and passed `17` tests; no Studio or browser action was performed.

## Current Studio Devnet 61997 source parity and live proof

- Current contract: `0xd07a6566f188ce5ce40b82598ee9c0f165608bea`; deployment transaction: `0x3fa837ba9b5a200c26bcba0a30260e3b1c642eb5b21650fbfc91f9ef0f300b9a`.
- The deployment receipt is `FINALIZED`, consensus is `MAJORITY_AGREE`, execution is `SUCCESS`, and sender/recipient match the locked actor and current contract.
- Canonical `gen_getContractCode` returned exactly 27,600 bytes with SHA-256 `7A1F9260FCC24174482142B522AAE60CA9BD96352BF8C497EB2B2E03CC991C8E`; byte comparison with the committed source is `True`.
- Fresh record: `privacy-ledger-live-20260920-v03`; app ID `com.whatsapp`; platform `android`; store URL `https://play.google.com/store/apps/details?id=com.whatsapp`; policy URL `https://www.whatsapp.com/legal/privacy-policy`.

| ID | Action | Transaction | Finalized + semantic result | Authoritative readback | Status |
|---|---|---|---|---|---|
| LIVE-01 | Create | `0x98d04e5e2edcb4735c64f999230f867d63c9f21e34907048b8f7f07d04a6a084` | `FINALIZED`; `MAJORITY_AGREE`; leader `SUCCESS`; `FINISHED_WITH_RETURN` | `DRAFT`, revision `0`, `UNRESOLVED` | PASS |
| LIVE-02 | Freeze | `0xaa7bd02b9e19e9ac772a1c5911cfe78f9114618e0bfb4ce85af36e8f3ab35f82` | `FINALIZED`; `MAJORITY_AGREE`; leader `SUCCESS`; `FINISHED_WITH_RETURN` | `FROZEN`, revision `0`, `UNRESOLVED` | PASS |
| LIVE-03 | Assess | `0x504639b10b8e51b6fd68ca2c56122d80229369592b043fea10b26787a0542821` | `FINALIZED`; `MAJORITY_AGREE`; leader `SUCCESS`; `FINISHED_WITH_RETURN` | `ASSESSED`, revision `1`; assessment 1 readable; reason `SOURCE_TRUNCATED` | PASS |
| LIVE-04 | Reassess | `0x5af66bf1b033f93d946c6e93392eece5b5eceb79720ed1fcaf36311ddc1c5281` | `FINALIZED`; `MAJORITY_AGREE`; leader `SUCCESS`; `FINISHED_WITH_RETURN` | `ASSESSED`, revision `2`; assessments 1 and 2 readable; reason `SOURCE_TRUNCATED` | PASS WITH DIGEST VARIANCE |

All four lifecycle receipts target the current contract and originate from the locked actor `0x8581c4a532dd3f9b163b12809b1bd089f367147f`. Revision 1 remains readable. Store digests are `57d82c9da791c7cd074c20a32133fda9aa869b21d56690431ac76e081bd12c48` and `0862af6fd737333c46eda0fed188b858d6bf91234ac0b99ba745d1767fa34dbe`; policy digests are `21db94801171e7b6334bef4c8c7b1d95727ae2e4c1a94e054aa646b47458a14c` and `038822f8689d51998fb4877f0ae04a73211e2e282e6695fbf85a7ceb5ebd70ad`. The public responses were truncated at 12,000 bytes and changed between subsequent retrievals; both immutable snapshots remain readable and the variance is retained. This is observed natural drift, not a controlled publisher mutation claim; the exact acceptance reconciliation is `docs/preflight/POST-DEPLOY-ACCEPTANCE-RECONCILIATION-BF20-CD71AD9-20260920.md`. No duplicate write or write retry occurred. This is current Studio evidence, not Vercel browser E2E.

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

1. Publish the exact approved revision to GitHub and verify the remote commit and repository state.
2. Build and verify a new Vercel artifact from the exact approved frontend source with build root `frontend`, chain `61997`, and contract `0xd07a6566f188ce5ce40b82598ee9c0f165608bea`; historical `0xfE2E...` and 61999 Vercel evidence cannot satisfy this gate.
3. Perform the separate production browser E2E gate only after the Vercel alias is stable; this document does not claim that browser E2E or Project Explorer manual submission is complete.
