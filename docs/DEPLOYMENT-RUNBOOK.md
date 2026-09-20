# Deployment and recovery runbook

This runbook separates the current Studio Devnet 61997 candidate from historical 61999 deployments. The current source is locally verified but may not be deployed until fresh `PRE_DEPLOY` approval. Historical contract/frontend evidence cannot satisfy the current 61997 assessment schema or release gates.

## Current source

- Contract: `contracts/app_privacy_disclosure_consistency_ledger.py`
- SHA-256: `7A1F9260FCC24174482142B522AAE60CA9BD96352BF8C497EB2B2E03CC991C8E`
- Contract source commit: `88256329df7805ca541aeb5d504e12c33e05bba2`
- Constructor arguments: `[]`
- Contract methods: `create`, `freeze`, `assess`, `reassess`, `upgrade`, `get`, `get_assessment`, `list_ids`

## Recorded pre-deployment decisions

1. Classification is `UPGRADABLE`: the deployer will be stored as the authorized upgrader and registered in the native Root Slot upgrader list by the fresh Studio Devnet deployment. Upgrade authority is lost if that Studio account becomes unavailable or Studio Devnet resets; no stronger recovery claim is made.
2. The selected and locked current Studio Devnet deployer/upgrader is configured actor `actor7`, public address `0x8581c4a532dd3f9b163b12809b1bd089f367147f`; its current read-only readiness balance is recorded in `docs/preflight/studio-tool-readiness-runtime-fix.json` (SHA-256 `D1B3C5E9E50B029561F278B4B1F64DB03ADCEA583708ED556D92AD05820ED300`, source-bound to `7A1F9260FCC24174482142B522AAE60CA9BD96352BF8C497EB2B2E03CC991C8E`). No signature or transaction was sent while selecting it. The prior `0x34b92E6553eaCA11A00A9d86d75d8a7881779D78` is historical 61999 actor data only.
3. Historical approvals do not transfer. The corrected candidate requires a fresh anonymous `PRE_DEPLOY` verdict bound to its exact commit and source hash.
4. Every conclusive verdict requires exact app-store URL/ID binding, a distinct non-store policy host, identity `MATCH` for both sources, valid bounded bodies, exact supporting quotes, and validator agreement.
5. A malformed, unavailable or truncated source, invalid model schema, identity uncertainty or validator disagreement fails closed.

The frontend write preflight requires at least `0.01 GEN` from the selected external wallet before enabling or submitting a zero-value contract write. This is a conservative local floor, not a claim about production gas pricing; final transaction success still requires finality, semantic execution success and readback.

## Gated Studio Devnet 61997 action

The current official CLI route for the locked target is:

```powershell
genlayer deploy --contract contracts/app_privacy_disclosure_consistency_ledger.py --rpc https://studio-dev.genlayer.com/api
```

The selected Studio Dev CLI/browser route must target chain `61997` (`0xf22d`) and Explorer `https://explorer-studio-dev.genlayer.com/`. After approval, upload the exact committed candidate source and deploy one new upgradable contract from the locked Studio account. The historical 61999 address must not be used or presented as current.

After deployment, canonical `gen_getContractCode` must return bytes exactly equal to the corrected committed source and SHA-256 `7A1F9260FCC24174482142B522AAE60CA9BD96352BF8C497EB2B2E03CC991C8E`. Any mismatch requires another replacement; documentation cannot waive byte parity.

## Post-deployment matrix

Use one live row for each unique transition and retain failed attempts as diagnostic evidence:

- `LIVE-01`: create a draft using an exact Google Play package/listing or Apple numeric ID/listing and a distinct publisher policy; readback shows `Draft` and revision `0`.
- `LIVE-02`: owner freezes the record; readback shows frozen sources.
- `LIVE-03`: any caller assesses frozen sources; `get_assessment(1)` must show complete source metadata, identity result, exact supporting quotes, normalized fields and verdict.
- `LIVE-04`: any caller reassesses after a controlled public source change; revision `2` must differ where expected while `get_assessment(1)` remains byte-for-byte unchanged.

Each successful write requires `FINALIZED`, current interface semantic execution success, and authoritative readback. A submitted or finalized transaction alone is not success evidence.

## Frontend wiring and production E2E

The production aliases currently point to the historical frozen contract and are not corrected-release evidence. After the replacement contract passes live verification, update `VITE_CONTRACT_ADDRESS`, deploy from the exact corrected frontend commit with build root `frontend`, and repeat the full browser lifecycle. The UI must visibly render every retained assessment revision and its source metadata, quotes, normalized fields and digest.

For a new local frontend session after the fresh deployment, set `frontend/.env.local`:

```text
VITE_CONTRACT_ADDRESS=<verified Studio Devnet 61997 contract address>
```

Then run `npm test`, `npm run build`, and the exact browser journey against that address. The frontend must use chain `61997`; never store a private key, seed phrase, wallet credential, or Studio identity secret in this project.

## Official references

- [Load a contract into Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/loading-contract)
- [Deploy contracts in Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/deploying-contract)
- [CLI deployment](https://docs.genlayer.com/developers/intelligent-contracts/deploying/cli-deployment)
- [Execute transactions in Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/execute-transaction)
- [Current contract state](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/contract-state)
