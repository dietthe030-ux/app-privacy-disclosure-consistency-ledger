# Deployment and recovery runbook

This runbook separates the accepted Studio Devnet 61997 deployment from historical 61999 deployments. The current source, exact live byte parity and four-step lifecycle are verified. Historical contract/frontend evidence cannot satisfy the current 61997 release gates.

## Current source

- Contract: `contracts/app_privacy_disclosure_consistency_ledger.py`
- SHA-256: `7A1F9260FCC24174482142B522AAE60CA9BD96352BF8C497EB2B2E03CC991C8E`
- Contract source commit: `0c1ed06b00099023d7d04184017a9970e0d02275`
- Constructor arguments: `[]`
- Contract methods: `create`, `freeze`, `assess`, `reassess`, `upgrade`, `get`, `get_assessment`, `list_ids`

## Recorded pre-deployment decisions

1. Classification is `UPGRADABLE`: the deployer will be stored as the authorized upgrader and registered in the native Root Slot upgrader list by the fresh Studio Devnet deployment. Upgrade authority is lost if that Studio account becomes unavailable or Studio Devnet resets; no stronger recovery claim is made.
2. The selected and locked current Studio Devnet deployer/upgrader is configured actor `actor7`, public address `0x8581c4a532dd3f9b163b12809b1bd089f367147f`; its current read-only readiness balance is recorded in `docs/preflight/studio-tool-readiness-runtime-fix.json` (SHA-256 `D1B3C5E9E50B029561F278B4B1F64DB03ADCEA583708ED556D92AD05820ED300`, source-bound to `7A1F9260FCC24174482142B522AAE60CA9BD96352BF8C497EB2B2E03CC991C8E`). No signature or transaction was sent while selecting it. The prior `0x34b92E6553eaCA11A00A9d86d75d8a7881779D78` is historical 61999 actor data only.
3. Historical approvals do not transfer. The current deployment evidence is bound to the exact source commit and source hash recorded in the manifest; any later source change requires a new scoped review.
4. Every conclusive verdict requires exact app-store URL/ID binding, a distinct non-store policy host, identity `MATCH` for both sources, valid bounded bodies, exact supporting quotes, and validator agreement.
5. A malformed, unavailable or truncated source, invalid model schema, identity uncertainty or validator disagreement fails closed.

The frontend write preflight requires at least `0.01 GEN` from the selected external wallet before enabling or submitting a zero-value contract write. This is a conservative local floor, not a claim about production gas pricing; final transaction success still requires finality, semantic execution success and readback.

## Accepted Studio Devnet 61997 deployment

The current official CLI route for the locked target is:

```powershell
genlayer deploy --contract contracts/app_privacy_disclosure_consistency_ledger.py --rpc https://studio-dev.genlayer.com/api
```

The selected Studio Dev CLI route targeted chain `61997` (`0xf22d`) and Explorer `https://explorer-studio-dev.genlayer.com/`. The accepted deployment is `0xd07a6566f188ce5ce40b82598ee9c0f165608bea`, created by the locked Studio account. The historical 61999 address must not be used or presented as current.

Canonical `gen_getContractCode` returned bytes exactly equal to the corrected committed source: 27,600 bytes and SHA-256 `7A1F9260FCC24174482142B522AAE60CA9BD96352BF8C497EB2B2E03CC991C8E`. The deployment transaction is `0x3fa837ba9b5a200c26bcba0a30260e3b1c642eb5b21650fbfc91f9ef0f300b9a` and is finalized with semantic success. Any future mismatch requires another replacement; documentation cannot waive byte parity.

## Post-deployment matrix

Use one live row for each unique transition and retain failed attempts as diagnostic evidence:

- `LIVE-01`: create a draft using an exact Google Play package/listing or Apple numeric ID/listing and a distinct publisher policy; readback shows `Draft` and revision `0`.
- `LIVE-02`: owner freezes the record; readback shows frozen sources.
- `LIVE-03`: any caller assesses frozen sources; `get_assessment(1)` must show complete source metadata, identity result, exact supporting quotes, normalized fields and verdict.
- `LIVE-04`: any caller reassesses after a subsequent public retrieval of the frozen sources; revision `1` must remain byte-for-byte/readback equivalent, revision `2` must be retained, and any observed source-digest variance must remain visible rather than normalized away. A controlled publisher mutation is optional future evidence and is not claimed by the current package. The exact reconciliation is `docs/preflight/POST-DEPLOY-ACCEPTANCE-RECONCILIATION-BF20-CD71AD9-20260920.md`.

Current accepted record: `privacy-ledger-live-20260920-v03` using the Android package `com.whatsapp`, with lifecycle transactions recorded in `docs/preflight/STUDIO-E2E-CHECKPOINT-RUNTIME-V03-20260920.json`. The final state is `ASSESSED`, revision `2`; revisions `1` and `2` remain readable. The current Studio evidence is not Vercel browser E2E.

Each successful write requires `FINALIZED`, current interface semantic execution success, and authoritative readback. A submitted or finalized transaction alone is not success evidence.

## Frontend wiring and production E2E

The current frontend binding is `VITE_CONTRACT_ADDRESS=0xd07a6566f188ce5ce40b82598ee9c0f165608bea` on chain `61997`. The old production aliases and their browser journey are historical evidence for superseded 61999 contracts, not evidence for this release. Publish the exact approved source, deploy from build root `frontend`, verify the resulting artifact, and only then run the separate production browser lifecycle. The UI must visibly render every retained assessment revision and its source metadata, quotes, normalized fields and digest.

For a new local frontend session after the fresh deployment, set `frontend/.env.local`:

```text
VITE_CONTRACT_ADDRESS=0xd07a6566f188ce5ce40b82598ee9c0f165608bea
```

Then run `npm test` and `npm run build`. The separate browser journey is intentionally pending until the exact Vercel artifact and stable alias are verified. The frontend must use chain `61997`; never store a private key, seed phrase, wallet credential, or Studio identity secret in this project.

## Official references

- [Load a contract into Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/loading-contract)
- [Deploy contracts in Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/deploying-contract)
- [CLI deployment](https://docs.genlayer.com/developers/intelligent-contracts/deploying/cli-deployment)
- [Execute transactions in Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/execute-transaction)
- [Current contract state](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/contract-state)
