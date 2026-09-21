import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

class FakeWindow extends EventTarget {
  setTimeout = globalThis.setTimeout.bind(globalThis);
  ethereum;
}

globalThis.window = new FakeWindow();

const wallet = await import("../src/wallet.ts");
const trace = await import("../src/e2eTrace.ts");

function provider(flags = {}) {
  const calls = [];
  return {
    calls,
    ...flags,
    request: async ({ method, params }) => {
      calls.push({ method, params });
      if (method === "eth_accounts") return [];
      if (method === "eth_requestAccounts") return ["0x1111111111111111111111111111111111111111"];
      if (method === "eth_chainId") return "0xf1cf";
      return null;
    },
  };
}

test("discovers and deduplicates the three supported wallets without requesting accounts", async () => {
  const providers = [
    ["MetaMask", "io.metamask", provider({ isMetaMask: true })],
    ["OKX Wallet", "com.okex.wallet", provider({ isOKXWallet: true, isMetaMask: true })],
    ["Rabby", "io.rabby", provider({ isRabby: true })],
  ];
  for (const [name, rdns, injected] of providers) {
    window.dispatchEvent(new CustomEvent("eip6963:announceProvider", { detail: { info: { uuid: rdns, name, icon: "", rdns }, provider: injected } }));
  }
  window.dispatchEvent(new CustomEvent("eip6963:announceProvider", { detail: { info: { uuid: "io.metamask", name: "MetaMask", icon: "", rdns: "io.metamask" }, provider: providers[0][2] } }));
  const available = await wallet.getAvailableWallets();
  assert.deepEqual(available.map((item) => item.label).sort(), ["MetaMask", "OKX Wallet", "Rabby"].sort());
  assert.equal(providers.every(([, , injected]) => injected.calls.length === 0), true);
});

test("requests an account only after explicit provider selection", async () => {
  const selected = provider();
  const account = await wallet.requestAccount(selected);
  assert.equal(account, "0x1111111111111111111111111111111111111111");
  assert.deepEqual(selected.calls.map((call) => call.method), ["eth_accounts", "eth_requestAccounts"]);
});

test("reuses an already-authorized account without opening another wallet request", async () => {
  const selected = provider();
  selected.request = async ({ method, params }) => {
    selected.calls.push({ method, params });
    if (method === "eth_accounts") return ["0x1111111111111111111111111111111111111111"];
    throw new Error("eth_requestAccounts must not be called for an authorized session");
  };
  const account = await wallet.requestAccount(selected);
  assert.equal(account, "0x1111111111111111111111111111111111111111");
  assert.deepEqual(selected.calls.map((call) => call.method), ["eth_accounts"]);
});

test("rejects an empty account response", async () => {
  await assert.rejects(() => wallet.requestAccount({ request: async () => [] }), /No wallet account was returned/);
});

test("adds and retries a chain only after an unknown-chain switch error", async () => {
  const calls = [];
  let switched = false;
  const selected = {
    request: async ({ method, params }) => {
      calls.push({ method, params });
      if (method === "eth_chainId") return switched ? "0xf22d" : "0x1";
      if (method === "wallet_switchEthereumChain" && !switched) {
        const error = new Error("unknown chain");
        error.code = 4902;
        throw error;
      }
      if (method === "wallet_addEthereumChain") { switched = true; return null; }
      return null;
    },
  };
  await wallet.ensureStudioDevnet(selected, { id: 61997, name: "GenLayer Studio Devnet", rpcUrls: { default: { http: ["https://studio-dev.genlayer.com/api"] } }, nativeCurrency: { name: "GEN Token", symbol: "GEN", decimals: 18 } });
  assert.deepEqual(calls.map((call) => call.method), ["eth_chainId", "wallet_switchEthereumChain", "wallet_addEthereumChain", "wallet_switchEthereumChain", "eth_chainId"]);
});

test("does not add a chain after a non-unknown switch error", async () => {
  const calls = [];
  const selected = {
    request: async ({ method }) => {
      calls.push(method);
      if (method === "eth_chainId") return "0x1";
      const error = new Error("user rejected switch");
      error.code = 4001;
      throw error;
    },
  };
  await assert.rejects(() => wallet.ensureStudioDevnet(selected, { id: 61997, name: "GenLayer Studio Devnet", rpcUrls: { default: { http: ["https://studio-dev.genlayer.com/api"] } }, nativeCurrency: { name: "GEN Token", symbol: "GEN", decimals: 18 } }), (error) => error.code === 4001);
  assert.deepEqual(calls, ["eth_chainId", "wallet_switchEthereumChain"]);
});

test("preserves rejected account requests as a wallet cancellation", async () => {
  const selected = {
    request: async ({ method }) => {
      if (method === "eth_accounts") return [];
      const error = new Error("user rejected");
      error.code = 4001;
      throw error;
    },
  };
  await assert.rejects(() => wallet.requestAccount(selected), (error) => error.code === 4001);
});

test("accepts an account change and clears an account removal", () => {
  const account = "0x1111111111111111111111111111111111111111";
  assert.equal(wallet.accountFromChange([account]), account);
  assert.equal(wallet.accountFromChange([]), undefined);
  assert.equal(wallet.accountFromChange(["not-an-address"]), undefined);
});

test("compares the browser account with the current Studio deployer", () => {
  assert.equal(trace.differsFromStudioDeployer("0x8581c4a532dd3f9b163b12809b1bd089f367147f"), false);
  assert.equal(trace.differsFromStudioDeployer("0x1111111111111111111111111111111111111111"), true);
});

test("does not expose an unknown legacy provider", async () => {
  window.ethereum = provider();
  const freshWallet = await import(`../src/wallet.ts?legacy-unknown=${Date.now()}`);
  assert.deepEqual(await freshWallet.getAvailableWallets(), []);
  window.ethereum = undefined;
});

test("binds and cleans up account and chain listeners on the selected provider", () => {
  const listeners = new Map();
  const selected = {
    on: (event, listener) => listeners.set(event, listener),
    removeListener: (event, listener) => { if (listeners.get(event) === listener) listeners.delete(event); },
    request: async () => null,
  };
  let accountChanges = 0;
  let chainChanges = 0;
  const remove = wallet.bindProviderSession(selected, () => { accountChanges += 1; }, () => { chainChanges += 1; });
  listeners.get("accountsChanged")(["0x1111111111111111111111111111111111111111"]);
  listeners.get("chainChanged")("0xf22d");
  assert.deepEqual([...listeners.keys()].sort(), ["accountsChanged", "chainChanged"]);
  assert.equal(accountChanges, 1);
  assert.equal(chainChanges, 1);
  remove();
  assert.deepEqual([...listeners.keys()], []);
});

test("keeps the wallet picker accessibility and selected-provider write contract intact", async () => {
  const source = await readFile(new URL("../src/main.ts", import.meta.url), "utf8");
  const walletSource = await readFile(new URL("../src/wallet.ts", import.meta.url), "utf8");
  const ledgerSource = await readFile(new URL("../src/ledger.ts", import.meta.url), "utf8");
  const traceSource = await readFile(new URL("../src/e2eTrace.ts", import.meta.url), "utf8");
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /root\.inert = true/);
  assert.match(source, /event\.key === \"Escape\"/);
  assert.match(source, /event\.key !== \"Tab\"/);
  assert.match(source, /restoreFocus\?\.focus\(\)/);
  assert.match(source, /createWriteClient\(session\.account, session\.provider\)/);
  assert.match(source, /session\.walletLabel.*shortAccount\(session\.account\)/);
  assert.match(source, /\$\{wallet\.label\} · \$\{shortAccount\(account\)\}/);
  assert.doesNotMatch(source, /Connected account: \$\{account\}|is connected as \$\{account\}/);
  assert.match(source, /noteConnectedAccount\(account\)/);
  assert.match(source, /setScreenStatus\("Create was not submitted\."\)/);
  assert.match(ledgerSource, /noteActionError\(error\)/);
  assert.match(ledgerSource, /estimateTransactionFeesForWrite\(call\)/);
  assert.match(ledgerSource, /feeValue: estimate\.feeValue/);
  assert.doesNotMatch(ledgerSource, /value: BigInt\(0\)/);
  assert.match(traceSource, /lastError/);
  assert.match(traceSource, /0x8581c4a532dd3f9b163b12809b1bd089f367147f/);
  assert.doesNotMatch(traceSource, /0xef5d2119416a2f5afa35dcfa209766efc1be5902/);
  assert.match(source, /ensureWriteClient\(\)/);
  assert.match(source, /submitWrite\(client/);
  assert.match(source, /transaction-evidence/);
  assert.match(source, /Copy hash/);
  assert.match(source, /status-spinner/);
  assert.doesNotMatch(source, /ensureSpendableBalance|0\.01 GEN/);
  assert.doesNotMatch(walletSource, /eth_getBalance|MIN_SPENDABLE_BALANCE/);
});

test("keeps form validation aligned with the contract and renders immutable assessment history", async () => {
  const source = await readFile(new URL("../src/main.ts", import.meta.url), "utf8");
  assert.match(source, /maxlength="64" pattern="\[A-Za-z0-9_-\]\+"/);
  assert.match(source, /App-store ID/);
  assert.match(source, /getAssessment\(recordId, current\)/);
  assert.match(source, /Assessment history/);
  assert.match(source, /store_evidence/);
  assert.match(source, /policy_evidence/);
  assert.match(source, /requested_url/);
  assert.match(source, /captured_bytes/);
  assert.match(source, /evidence\.sha256/);
  assert.match(source, /evidence\.excerpt/);
  assert.match(source, /evidence_quotes/);
  assert.match(source, /supporting quotes/);
});
