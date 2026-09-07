# Privacy Disclosure Consistency Ledger

A GenLayer project that binds an exact app-store listing to a publisher privacy policy, captures independently verifiable evidence, and compares their bounded public claims over time.

## Current status

The steward-requested correction passes local lint/schema, Direct Mode, frontend tests and production build. The previously approved Studionet address remains historical evidence only: its intentionally frozen schema cannot expose the new per-revision evidence snapshot. A replacement deployment and fresh affected release gates are required before resubmission. See [docs/VERIFICATION.md](docs/VERIFICATION.md) for exact evidence and status.

## Verified links

- Historical frozen contract (not the corrected candidate): [Explorer](https://explorer-studio.genlayer.com/address/0xfE2E4216502f12206A61a2b2103CbD1329FFb56b)
- Historical frontend (not yet rebound to the corrected candidate): [Vercel production](https://app-privacy-disclosure-consistency.vercel.app/)

## Trust problem

An app-store disclosure and a publisher policy can change independently, while a centralized comparison service can silently choose a favorable interpretation. This ledger records both public sources, freezes their URLs, and preserves each later assessment as an immutable revision.

## Why GenLayer

The important decision is nondeterministic: validators independently fetch the two bounded public sources and normalize privacy categories, retention, and source digests. GenLayer consensus commits the resulting bounded decision on-chain; no frontend or model prose can override the verdict.

## How it works

1. Anyone creates a record with a platform-specific app-store ID, its matching allowlisted listing URL, and a policy URL on a distinct publisher host.
2. The owner freezes the sources.
3. Anyone assesses the frozen sources; validators independently retrieve both sources and confirm the app/publisher identity relationship before a conclusive verdict.
4. Anyone reassesses later; each immutable revision keeps retrieval time, source URL/host/status, captured byte count, truncation flag, digest, bounded excerpt, exact supporting quotes, normalized comparison and verdict.

## Architecture

- Contract: owns records, lifecycle authorization, append-only assessments, normalized evidence, and the verdict.
- Validators: independently retrieve and extract bounded fields, then reach consensus on the complete canonical decision.
- Frontend: discovers a selected wallet, submits contract methods, tracks finality, and reads authoritative state. It never calculates or overrides the verdict.
- Source of truth: lifecycle and complete assessment history are on-chain; `get_assessment(record_id, revision)` exposes the evidence snapshot used for every historical verdict.

## Intelligent Contract

State moves from `DRAFT` to `FROZEN` to `ASSESSED`. `create` is permissionless, `freeze` is owner-only, and `assess`/`reassess` are permissionless. Read methods are `get`, `get_assessment`, and `list_ids`. Safe outcomes include `CONSISTENT`, `MATERIAL_CONFLICT`, `DISCLOSURE_MISSING`, and `UNRESOLVED`; the contract is documentary comparison only, not legal or privacy-compliance advice.

## Transaction lifecycle

The frontend requires explicit wallet selection, checks the selected account and Studionet network, submits once, retains the transaction hash, waits for `FINALIZED` and successful execution, then performs an authoritative readback. Rejected, pending, failed, rate-limited, and reconciliation states remain actionable; the UI does not show success from a submission toast alone.

## Local checks

```powershell
genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json
py -3.13 -m pytest -q tests/direct/ -p no:cacheprovider
cd frontend
npm install --save-exact
npm test
npm run build
```

For a live frontend, copy `frontend/.env.example` to `frontend/.env.local` and set `VITE_CONTRACT_ADDRESS` only after the Studionet deployment has passed live smoke verification. The production artifact is separately bound to the replacement address and chain in [docs/VERIFICATION.md](docs/VERIFICATION.md).

## Tests and verification

```powershell
genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json
py -3.13 -m pytest -q tests/direct/ -p no:cacheprovider
cd frontend
npm test
npm run build
```

The corrected local package passes lint/schema, 13 Direct Mode tests, 13 frontend tests, and the production build. Replacement deployment and fresh live proof remain mandatory before resubmission.

## Deployment and recovery

The existing Studionet deployment is explicitly superseded for the steward-requested correction. Because it is intentionally frozen, the corrected contract must be deployed at a new address and rebound to the frontend only after exact-source parity and fresh lifecycle evidence pass.

## Security and limitations

User-controlled and fetched page content is treated as untrusted data. The contract bounds source retrieval and model output, validates the canonical schema, preserves disagreement/failure safely, and stores digests for lineage. Results describe consistency of captured disclosures only; they do not prove that a source is truthful, current, complete, or legally compliant.

## Scope

This is documentary consistency comparison, not legal advice or a privacy-compliance certification. The frontend does not calculate or override the on-chain verdict.
