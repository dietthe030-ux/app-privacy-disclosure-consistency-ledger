# Privacy Disclosure Consistency Ledger

A GenLayer project that binds an exact app-store listing to a publisher privacy policy, captures independently verifiable evidence, and compares their bounded public claims over time.

## Current status

The current candidate passes local lint/schema, Direct Mode, frontend tests and production build. It targets Studio Devnet (chain `61997`, RPC `https://studio-dev.genlayer.com/api`) and is ready for a fresh deployment after `PRE_DEPLOY` approval. Two earlier 61997 deployment attempts finalized with semantic execution error and are explicitly excluded; no usable current address, post-deploy proof, GitHub publication or Vercel production E2E exists yet. The earlier 61999 deployment and Vercel journey are historical-only evidence. See [docs/VERIFICATION.md](docs/VERIFICATION.md) for exact evidence and status.

## Verified links

- Current target network: [Studio Devnet Explorer](https://explorer-studio-dev.genlayer.com/)
- Historical 61999 frontend (not current release evidence): [Vercel production](https://app-privacy-disclosure-consistency.vercel.app/)

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

The frontend requires explicit wallet selection, checks the selected account and Studio Devnet network, submits once, retains the transaction hash, waits for `FINALIZED` and successful execution, then performs an authoritative readback. Rejected, pending, failed, rate-limited, and reconciliation states remain actionable; the UI does not show success from a submission toast alone.

## Local checks

```powershell
genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json
& 'C:\Users\LEGION\AppData\Local\Programs\Python\Python313\python.exe' -m pytest -q tests/direct/ -p no:gltest -p no:cacheprovider
cd frontend
npm install --save-exact
npm test
npm run build
```

For a live frontend after the pending deployment, copy `frontend/.env.example` to `frontend/.env.local` and set `VITE_CONTRACT_ADDRESS` to the newly verified Studio Devnet address. Do not use a historical 61999 address. A public Vercel artifact must be built later from the exact approved frontend source with chain `61997` and the fresh address.

## Tests and verification

```powershell
genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json
& 'C:\Users\LEGION\AppData\Local\Programs\Python\Python313\python.exe' -m pytest -q tests/direct/ -p no:gltest -p no:cacheprovider
cd frontend
npm test
npm run build
```

The candidate passes v0.3 lint/schema, 17 Direct Mode tests in the matching pinned toolchain, 13 frontend tests, and the production build. Its 27,600-byte committed source has SHA-256 `7A1F9260FCC24174482142B522AAE60CA9BD96352BF8C497EB2B2E03CC991C8E`. Deployment parity and lifecycle writes remain pending for Studio Devnet 61997; both failed 61997 deployment attempts are diagnostic only, and historical 61999 live evidence is retained only in the verification ledger.

## Deployment and recovery

No current contract is deployed for Studio Devnet 61997 in this candidate. The prior 61999 deployment and the existing Vercel artifact are explicitly historical-only; after fresh Devnet deployment, verify exact source parity, complete create → freeze → assess → reassess evidence, and only then wire the frontend and pursue GitHub/Vercel gates.

## Security and limitations

User-controlled and fetched page content is treated as untrusted data. The contract bounds source retrieval and model output, validates the canonical schema, preserves disagreement/failure safely, and stores digests for lineage. Results describe consistency of captured disclosures only; they do not prove that a source is truthful, current, complete, or legally compliant.

## Scope

This is documentary consistency comparison, not legal advice or a privacy-compliance certification. The frontend does not calculate or override the on-chain verdict.
