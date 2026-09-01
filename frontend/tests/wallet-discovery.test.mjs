import test from "node:test";
import assert from "node:assert/strict";

class FakeWindow extends EventTarget {
  setTimeout = globalThis.setTimeout.bind(globalThis);
  ethereum;
}

globalThis.window = new FakeWindow();

const wallet = await import("../src/wallet.ts");

function provider(flags = {}) {
  const calls = [];
  return {
    calls,
    ...flags,
    request: async ({ method, params }) => {
      calls.push({ method, params });
      if (method === "eth_requestAccounts") return ["0x1111111111111111111111111111111111111111"];
      if (method === "eth_chainId") return "0xf1cf";
      return null;
    },
  };
}

test("discovers and deduplicates the three supported wallets without requesting accounts", async () => {
  const providers = [
    ["MetaMask", "io.metamask", provider({ isMetaMask: true })],
    ["OKX Wallet", "com.okex.wallet", provider({ isOKXWallet: true })],
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
  assert.deepEqual(selected.calls.map((call) => call.method), ["eth_requestAccounts"]);
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
      if (method === "eth_chainId") return switched ? "0xf22f" : "0x1";
      if (method === "wallet_switchEthereumChain" && !switched) {
        const error = new Error("unknown chain");
        error.code = 4902;
        throw error;
      }
      if (method === "wallet_addEthereumChain") { switched = true; return null; }
      return null;
    },
  };
  await wallet.ensureStudionet(selected, { id: 61999, name: "Genlayer Studio Network", rpcUrls: { default: { http: ["https://studio.genlayer.com/api"] } }, nativeCurrency: { name: "GEN Token", symbol: "GEN", decimals: 18 } });
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
  await assert.rejects(() => wallet.ensureStudionet(selected, { id: 61999, name: "Genlayer Studio Network", rpcUrls: { default: { http: ["https://studio.genlayer.com/api"] } }, nativeCurrency: { name: "GEN Token", symbol: "GEN", decimals: 18 } }), (error) => error.code === 4001);
  assert.deepEqual(calls, ["eth_chainId", "wallet_switchEthereumChain"]);
});

test("does not expose an unknown legacy provider", async () => {
  window.ethereum = provider();
  const freshWallet = await import(`../src/wallet.ts?legacy-unknown=${Date.now()}`);
  assert.deepEqual(await freshWallet.getAvailableWallets(), []);
  window.ethereum = undefined;
});

test("rejects a wallet with no spendable GEN balance", async () => {
  const selected = { request: async ({ method }) => method === "eth_getBalance" ? "0x0" : null };
  await assert.rejects(
    () => wallet.ensureSpendableBalance(selected, "0x1111111111111111111111111111111111111111"),
    /no spendable GEN balance/,
  );
});

test("accepts a positive balance from the selected provider", async () => {
  const calls = [];
  const selected = {
    request: async ({ method, params }) => {
      calls.push({ method, params });
      return method === "eth_getBalance" ? "0x1" : null;
    },
  };
  await wallet.ensureSpendableBalance(selected, "0x1111111111111111111111111111111111111111");
  assert.deepEqual(calls, [{ method: "eth_getBalance", params: ["0x1111111111111111111111111111111111111111", "latest"] }]);
});
