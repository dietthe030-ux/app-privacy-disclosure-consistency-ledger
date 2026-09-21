# Privacy Disclosure Consistency Ledger

A GenLayer project that binds an exact app-store listing to a publisher privacy policy, captures independently verifiable evidence, and compares their bounded public claims over time.

## Current status

The current candidate passes local lint/schema, Direct Mode, frontend tests and production build. It is deployed on Studio Devnet (chain `61997`, RPC `https://studio-dev.genlayer.com/api`) at `0xd07a6566f188ce5ce40b82598ee9c0f165608bea`; exact `gen_getContractCode` parity and LIVE-01 through LIVE-04 are PASS. GitHub `main` and the [production frontend](https://app-privacy-disclosure-consistency.vercel.app/) are live. A separate-wallet Chrome journey completed create → freeze → assess → reassess on this contract, with finality, readbacks, revision retention and measured RPC usage. The final wallet-label-only bundle was then verified on the same alias by reload/reconnect, without another write. Two failed 61997 deployments and the earlier 61999 frontend remain historical-only. Final anonymous release review and manual Explorer resubmission are not claimed. See [docs/VERIFICATION.md](docs/VERIFICATION.md).

## Verified links

- Current target network: [Studio Devnet Explorer](https://explorer-studio-dev.genlayer.com/)
- Current frontend: [Vercel production](https://app-privacy-disclosure-consistency.vercel.app/)
- Current Studio Devnet contract: [Explorer](https://explorer-studio-dev.genlayer.com/address/0xd07a6566f188ce5ce40b82598ee9c0f165608bea)

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
wsl.exe bash -lc "cd /mnt/e/Genlayer-Projects/app-privacy-disclosure-consistency-ledger && /mnt/e/Genlayer-Tools/studio-next-toolchain/.wsl-venv/bin/python -m pytest -q -p no:cacheprovider"
cd frontend
npm install --save-exact
npm test
npm run build
```

For local development, copy `frontend/.env.example` to `frontend/.env.local`; it is bound to the verified Studio Devnet address. Do not use a historical 61999 address. The production Vercel build uses chain `61997` and this address; see the deployment manifest for the exact artifact and bundle identity.

## Tests and verification

```powershell
genvm-lint check contracts/app_privacy_disclosure_consistency_ledger.py --json
wsl.exe bash -lc "cd /mnt/e/Genlayer-Projects/app-privacy-disclosure-consistency-ledger && /mnt/e/Genlayer-Tools/studio-next-toolchain/.wsl-venv/bin/python -m pytest -q -p no:cacheprovider"
cd frontend
npm test
npm run build
```

The candidate passes v0.3 lint/schema, 17 Direct Mode tests in the matching pinned toolchain, 12 frontend tests, and the production build. Its 27,600-byte committed source has SHA-256 `7A1F9260FCC24174482142B522AAE60CA9BD96352BF8C497EB2B2E03CC991C8E`. Deployment parity and LIVE-01 through LIVE-04 pass on Studio Devnet 61997 at `0xd07a6566f188ce5ce40b82598ee9c0f165608bea`. The production-browser lifecycle and the subsequent presentation-only reload/reconnect are recorded separately in the verification ledger. Failed 61997 attempts and historical 61999 evidence are excluded from current release proof.

## Deployment and recovery

The accepted contract is deployed on Studio Devnet 61997 at `0xd07a6566f188ce5ce40b82598ee9c0f165608bea`, with exact source parity. The frontend is published from build root `frontend` on the current production alias. Its four-write E2E record reaches `ASSESSED`, revision `2`, and both assessments remain readable. A transient post-assess readback saturation was reconciled without a duplicate write. Final release review and manual Explorer resubmission remain separate gates.

## Security and limitations

User-controlled and fetched page content is treated as untrusted data. The contract bounds source retrieval and model output, validates the canonical schema, preserves disagreement/failure safely, and stores digests for lineage. Results describe consistency of captured disclosures only; they do not prove that a source is truthful, current, complete, or legally compliant.

## Scope

This is documentary consistency comparison, not legal advice or a privacy-compliance certification. The frontend does not calculate or override the on-chain verdict.
