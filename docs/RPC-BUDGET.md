# RPC Budget — Steward Resubmission Correction

## STUDIO RPC MEASUREMENT CAPABILITY PROBE

STUDIO_CAPABILITY_PROBE_STATUS: COMPLETE

STUDIO_MEASUREMENT_MODE: OBSERVABLE_ACTION_LEDGER

STUDIO_MEASUREMENT_TIMING: PRE_E2E

STUDIO_CAPABILITY_PROBE_AT: `2026-09-07T09:04:26Z`

STUDIO_CAPABILITY_TOOL_OR_API: Codex-controlled Studio browser actions, transaction hashes, lightweight transaction status, terminal Ethereum receipt, Explorer transaction state, and authoritative GenLayerJS contract reads.

STUDIO_CAPABILITY_CHECK: Prior exact-release execution established that hosted Studio/RPC does not expose a reliable complete physical-request stream and that `gen_getTransactionReceipt` / `gen_dbg_traceTransaction` may return `Method not found`; every primary-AI submission, hash, bounded status read, terminal receipt and authoritative readback remains directly observable.

STUDIO_CAPABILITY_RESULT: Physical network request totals are not reliably exposed. Lock an observable action ledger before any Studio action and make no physical-request-count claim.

STUDIO_PHYSICAL_COUNT_CLAIM: NONE

STUDIO_ACTION_LEDGER_STATUS: READY

No Studio page, deployment, transaction or live E2E action for the corrected candidate occurred before this probe.

## STUDIO RPC BUDGET MATRIX

| Row | Trigger | Observable action | Max actions | Poll interval / attempts | Terminal condition | Terminal receipt reads | Authoritative readbacks | Transactions | Retry / stop rule |
|---|---|---|---:|---|---|---:|---:|---:|---|
| S-01 | Before Studio opens | Verify chain, selected deployer and balance | 3 | none | chain 61999, locked account and sufficient balance | 0 | 0 | 0 | stop on identity/network mismatch |
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
