# Deployment and recovery runbook

This runbook separates the steward-requested corrected candidate from the historical frozen deployment. The corrected source is locally verified but may not be deployed until fresh `PRE_DEPLOY` approval. The previous contract/frontend evidence remains historical and cannot satisfy the corrected assessment schema.

## Current source

- Contract: `contracts/app_privacy_disclosure_consistency_ledger.py`
- SHA-256: `276D367E4D681A44A7C9C909CA8BB7B762DEB882CA90DEE7B6029AF45089AE21`
- Contract source commit: `41993872e3ff32422acbf8d4aeee91aff0bded01`
- Constructor arguments: `[]`
- Contract methods: `create`, `freeze`, `assess`, `reassess`, `get`, `get_assessment`, `list_ids`

## Recorded pre-deployment decisions

1. Classification is `INTENTIONALLY FROZEN`: a post-deployment defect requires a replacement contract and frontend address update.
2. The selected Studio deployer public address was `0xeF5D2119416A2f5afa35dCFA209766EFC1BE5902`; balance was rechecked immediately before deployment at `998 GEN`.
3. Historical approvals do not transfer. The corrected candidate requires a fresh anonymous `PRE_DEPLOY` verdict bound to its exact commit and source hash.
4. Every conclusive verdict requires exact app-store URL/ID binding, a distinct non-store policy host, identity `MATCH` for both sources, valid bounded bodies, exact supporting quotes, and validator agreement.
5. A malformed, unavailable or truncated source, invalid model schema, identity uncertainty or validator disagreement fails closed.

The frontend write preflight requires at least `0.01 GEN` from the selected external wallet before enabling or submitting a zero-value contract write. This is a conservative local floor, not a claim about production gas pricing; final transaction success still requires finality, semantic execution success and readback.

## Gated Studionet action

The current official CLI guide documents this Studionet command:

```powershell
genlayer deploy --contract contracts/app_privacy_disclosure_consistency_ledger.py --rpc https://studio.genlayer.com/api
```

The CLI was unavailable on this machine, so the intended deployment route remains the Codex-controlled GenLayer Studio browser. Do not overwrite or present the old address as current. After approval, upload the exact committed candidate source and deploy a new intentionally frozen contract.

After deployment, canonical `gen_getContractCode` must return bytes exactly equal to the corrected committed source and SHA-256 `276D367E4D681A44A7C9C909CA8BB7B762DEB882CA90DEE7B6029AF45089AE21`. Any mismatch requires another replacement; documentation cannot waive byte parity.

## Post-deployment matrix

Use one live row for each unique transition and retain failed attempts as diagnostic evidence:

- `LIVE-01`: create a draft using an exact Google Play package/listing or Apple numeric ID/listing and a distinct publisher policy; readback shows `Draft` and revision `0`.
- `LIVE-02`: owner freezes the record; readback shows frozen sources.
- `LIVE-03`: any caller assesses frozen sources; `get_assessment(1)` must show complete source metadata, identity result, exact supporting quotes, normalized fields and verdict.
- `LIVE-04`: any caller reassesses after a controlled public source change; revision `2` must differ where expected while `get_assessment(1)` remains byte-for-byte unchanged.

Each successful write requires `FINALIZED`, current interface semantic execution success, and authoritative readback. A submitted or finalized transaction alone is not success evidence.

## Frontend wiring and production E2E

The production aliases currently point to the historical frozen contract and are not corrected-release evidence. After the replacement contract passes live verification, update `VITE_CONTRACT_ADDRESS`, deploy from the exact corrected frontend commit with build root `frontend`, and repeat the full browser lifecycle. The UI must visibly render every retained assessment revision and its source metadata, quotes, normalized fields and digest.

For a new local frontend session, set `frontend/.env.local`:

```text
VITE_CONTRACT_ADDRESS=<verified Studionet contract address>
```

Then run `npm test`, `npm run build`, and the exact browser journey against that address. Never store a private key, seed phrase, wallet credential, or Studio identity secret in this project.

## Official references

- [Load a contract into Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/loading-contract)
- [Deploy contracts in Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/deploying-contract)
- [CLI deployment](https://docs.genlayer.com/developers/intelligent-contracts/deploying/cli-deployment)
- [Execute transactions in Studio](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/execute-transaction)
- [Current contract state](https://docs.genlayer.com/developers/intelligent-contracts/tools/genlayer-studio/contract-state)
