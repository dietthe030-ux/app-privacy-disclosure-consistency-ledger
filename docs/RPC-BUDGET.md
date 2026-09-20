# RPC Budget — Studio Devnet 61997 Candidate

## STUDIO RPC MEASUREMENT CAPABILITY PROBE

STUDIO_CAPABILITY_PROBE_STATUS: COMPLETE

STUDIO_MEASUREMENT_MODE: OBSERVABLE_ACTION_LEDGER

STUDIO_MEASUREMENT_TIMING: PRE_E2E

STUDIO_CAPABILITY_PROBE_AT: `2026-09-07T09:04:26Z`

STUDIO_CAPABILITY_TOOL_OR_API: Codex-controlled Studio browser actions, transaction hashes, lightweight transaction status, terminal Ethereum receipt, Explorer transaction state, and authoritative GenLayerJS contract reads.

STUDIO_CAPABILITY_CHECK: Prior exact-release execution established that hosted Studio/RPC does not expose a reliable complete physical-request stream and that `gen_getTransactionReceipt` / `gen_dbg_traceTransaction` may return `Method not found`; every primary-AI submission, hash, bounded status read, terminal receipt and authoritative readback remains directly observable.

STUDIO_CAPABILITY_RESULT: Physical network request totals are not reliably exposed. Lock an observable action ledger before any Studio action and make no physical-request-count claim.

STUDIO_PHYSICAL_COUNT_CLAIM: NONE

STUDIO_ACTION_LEDGER_STATUS: COMPLETE

No Studio page, deployment, transaction or live E2E action for the corrected candidate occurred before this probe.

STUDIO_FIRST_ACTION_AT: `2026-09-07T15:22:59Z` (read-only Studio open/account inspection after the completed probe).

CURRENT_LOCKED_STUDIO_DEVNET_DEPLOYER_UPGRADER: actor `actor7`, address `0x8581c4a532dd3f9b163b12809b1bd089f367147f` (current read-only balance is recorded in `docs/preflight/studio-tool-readiness-runtime-fix.json`, SHA-256 `7D3C68291296A0991280165E304F13FE8F206B89BE5BF77EDA913B4C86AACA15`, source-bound to `DCF01BA79105957001AEC350629E6D2CAEB3BC880CB677235D33C0762F7EDF4A`; no signature or transaction sent).

## CURRENT STUDIO DEVNET 61997 PLAN — LOCKED BEFORE DEPLOYMENT

CURRENT_TARGET_NETWORK: `Studio Devnet`

CURRENT_TARGET_CHAIN_ID: `61997` (`0xf22d`)

CURRENT_TARGET_RPC: `https://studio-dev.genlayer.com/api`

CURRENT_TARGET_EXPLORER: `https://explorer-studio-dev.genlayer.com/`

CURRENT_DEPLOYMENT_STATUS: `PENDING_DEPLOYMENT`

CURRENT_CONTRACT_ADDRESS: `null`

No deployment or lifecycle transaction has been made for the current Studio Devnet candidate. The following is the locked minimum-sufficient action budget for the post-approval run; no blind retry or duplicate write is permitted.

| Row | Trigger | Observable action | Max actions | Poll interval / attempts | Terminal condition | Terminal receipt reads | Authoritative readbacks | Transactions | Retry / stop rule |
|---|---|---|---:|---|---|---:|---:|---:|---|---|
| D-01 | Before Studio opens | Verify chain `61997`, selected actor and balance | 3 | none | target chain, explicit actor and sufficient balance | 0 | 0 | 0 | stop on identity/network mismatch |
| D-02 | Candidate load | Upload exact committed source and inspect schema | 2 | none | 8 methods: 3 views and 5 writes | 0 | 0 | 0 | no reload unless deterministic upload failure is corrected |
| D-03 | One approved deployment | Submit fresh Studio Devnet deployment | 1 | 5 seconds / 36 | finalized and semantic success | 1 | 1 source-code read | 1 | never redeploy without reconciling any returned hash/address |
| D-04 | Fresh lifecycle record | Submit `create` | 1 | 5 seconds / 36 | finalized and DRAFT readback | 1 | 1 `get` | 1 | never resubmit the same record ID |
| D-05 | Created record | Submit `freeze` | 1 | 5 seconds / 36 | finalized and FROZEN readback | 1 | 1 `get` | 1 | stop unless create readback is DRAFT |
| D-06 | Frozen record | Submit `assess` | 1 | 5 seconds / 60 | finalized and revision 1 readback | 1 | 2: `get`, `get_assessment(1)` | 1 | stop unless freeze readback is FROZEN |
| D-07 | Assessed record | Submit `reassess` | 1 | 5 seconds / 60 | finalized and revision 2 retained | 1 | 3: `get`, assessments 1 and 2 | 1 | stop unless revision 1 remains readable |
| D-08 | Final verification | Compare source bytes, hashes, addresses and evidence | 12 | none | complete exact evidence matrix | 4 maximum diagnostics | 8 maximum sparse reads | 0 | no write or deployment retry |

Current whole-run ceilings: deployment transactions `1`; lifecycle transactions `4`; total transactions `5`; duplicate transactions `0`; status polls `228` maximum; terminal receipt reads `5` plus at most `4` diagnostics only after an observed mismatch; authoritative readbacks `10` planned and `18` hard maximum; observable primary-AI actions `270` hard maximum. For the frontend journey, the locked matrix in `docs/preflight/STUDIO-DEV-FRONTEND-RPC-MATRIX.md` sets a whole-run ceiling of `541` RPC requests, four lifecycle transactions, zero duplicate writes, zero automatic write retries, and one deliberate reconciliation per operation. Any wrong chain/account, insufficient balance, source mismatch, quota/rate limit, ambiguous hash, terminal failure, failed readback or ceiling breach is a hard stop.

## HISTORICAL 61999 STUDIO ACTION LEDGER — NOT CURRENT 61997 EVIDENCE

HISTORICAL_61999_LOCKED_DEPLOYER_UPGRADER: `0x34b92E6553eaCA11A00A9d86d75d8a7881779D78` (historical visible balance `10.001 GEN`; not a current configured actor).

- Historical 61999 transactions: `5` total — one deployment and four unique lifecycle writes.
- Lifecycle retries: `0`; duplicate transactions: `0`.
- Transaction hashes: deployment `0x72732555ed7fda8caf2646f0e548908e180d789169c9ae3a4a443927d04813c6`; create `0x789fd47aabe035eec33306506eabd7d5783a7fa5008d956a74bc1d79695c964f`; freeze `0x260e42bfee28df6a7b92cd0bef9f9f859261f38429a49c0a31ecfd494085d045`; assess `0xb50c041818f85a6f6cd36eecf7cffe75c7f17862be8a2f5fbf46ff28d69f9bd5`; reassess `0x93228a72f006dabfdaef6fe655ec008e736f567d7b077b26da3f0c5fb68346d4`.
- Terminal receipt reads: `5` total, one per terminal transaction.
- Authoritative readbacks: `9` total — deployed source once; create `get` once; freeze `get` once; assess `get` plus `get_assessment(1)` and one focused field projection; reassess `get` plus assessments 1 and 2.
- Primary-AI lifecycle status observations: create `2`, freeze `3`, assess `3`, reassess `4`; all stopped at `FINALIZED`.
- Diagnostic validator probes: `1`, confirming `20` backend validators while the restored Studio UI temporarily displayed zero.
- Matrix variance: Studio background schema loads from many open editor tabs exhausted the hosted `30 requests/minute` bucket. Writes stopped during the limit; unused task-owned editor tabs were closed, the same hashes/state were preserved, and testing resumed after cooldown. Physical background-request totals remain unavailable and no physical-request count is claimed.
- Final lifecycle readback: `ASSESSED`, revision `2`, both assessments readable. Store digests match; policy digests differ because the live publisher-policy response changed between retrievals. The exact variance is preserved for independent review.

## HISTORICAL 61999 RPC BUDGET MATRIX — NOT CURRENT 61997 INSTRUCTIONS

| Row | Trigger | Observable action | Max actions | Poll interval / attempts | Terminal condition | Terminal receipt reads | Authoritative readbacks | Transactions | Retry / stop rule |
|---|---|---|---:|---|---|---:|---:|---:|---|
| S-01 | Before Studio opens | Verify chain, selected deployer and balance | 3 | none | chain 61999, account `0x34b92E6553eaCA11A00A9d86d75d8a7881779D78`, sufficient balance | 0 | 0 | 0 | stop on identity/network mismatch |
| S-02 | Candidate load | Upload exact committed source and inspect discovered schema | 2 | none | 8 methods: 3 views and 5 writes | 0 | 0 | 0 | no reload unless deterministic upload failure is corrected |
| S-03 | One approved deployment | Submit replacement deployment | 1 | 5 seconds / 36 | finalized or terminal failure | 1 | 1 source-code read | 1 | never deploy again without reconciling existing hash/address |
| S-04 | Fresh lifecycle record | Submit `create` | 1 | 5 seconds / 36 | finalized or terminal failure | 1 | 1 `get` | 1 | never resubmit same record ID |
| S-05 | Created record | Submit `freeze` | 1 | 5 seconds / 36 | finalized or terminal failure | 1 | 1 `get` | 1 | stop unless create readback is DRAFT |
| S-06 | Frozen record | Submit `assess` | 1 | 5 seconds / 60 | finalized or terminal failure | 1 | 2: `get`, `get_assessment(1)` | 1 | stop unless freeze readback is FROZEN |
| S-07 | Assessed record | Submit `reassess` | 1 | 5 seconds / 60 | finalized or terminal failure | 1 | 3: `get`, assessment 1 and 2 | 1 | stop unless revision 1 is readable; preserve exact first snapshot |
| S-08 | Final verification | Compare committed/live bytes, all hashes, addresses, source identity and snapshot fields | 12 | none | exact parity and complete evidence matrix | 4 maximum diagnostics only | 8 maximum sparse reads | 0 | no write or deployment retry |

Whole-run ceilings:

- Deployment transactions: `1`.
- Lifecycle transactions: `4`.
- Total transactions: `5`.
- Duplicate transactions: `0`.
- Status polls: deployment `36`; create `36`; freeze `36`; assess `60`; reassess `60`; maximum `228`.
- Terminal receipt reads: `5`, plus at most `4` diagnostic reads only after an observed mismatch.
- Authoritative readbacks: `10` planned, `18` hard maximum including sparse reconciliation.
- Observable primary-AI actions: `270` hard maximum, excluding wallet signature popups performed by the user.
- Retries: no automatic deployment/write retry. A transient read may retry at most twice after bounded delay. Any returned transaction hash is reconciled instead of resubmitted.
- Hard stops: wrong chain/account; insufficient balance; schema mismatch; source-byte/hash mismatch; quota/rate limit; ambiguous transaction with a hash; terminal non-success; failed authoritative state; missing evidence snapshot fields; revision 1 mutation; or any ceiling reached.

## REQUIRED LIVE EVIDENCE

- Deployment: exact committed bytes, new address, deployment hash, `FINALIZED`, semantic `SUCCESS`, sender/address parity, and canonical `gen_getContractCode` byte equality.
- Source case: a real app-store listing whose URL contains the exact platform-specific app ID and a distinct publisher-controlled privacy-policy URL.
- `create`: DRAFT revision 0 readback.
- `freeze`: FROZEN revision 0 readback.
- `assess`: ASSESSED revision 1 plus complete `get_assessment(1)` snapshot.
- `reassess`: revision 2 plus complete snapshot; revision 1 must remain byte-for-byte identical to its earlier readback.
- Every assessment snapshot: retrieval timestamp, requested URL, verified host, structured HTTP status, body-valid flag, captured byte count, truncation flag, digest, bounded excerpt, exact supporting quotes, identity result, normalized fields, reason and verdict.
- Frontend E2E remains a later affected gate and must independently render both revisions from the replacement contract.
