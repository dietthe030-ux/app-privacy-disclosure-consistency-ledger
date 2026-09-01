import { instrumentProvider } from "./e2eTrace.ts";

export interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
  isRabby?: boolean;
  isOKXWallet?: boolean;
}

declare global {
  type EthereumProvider = import("./wallet.ts").EthereumProvider;
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export interface Eip6963Info {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface DiscoveredWallet {
  info: Eip6963Info;
  provider: EthereumProvider;
  label: string;
}

export type ProviderListener = (...args: unknown[]) => void;

const supportedLabels = ["MetaMask", "OKX Wallet", "Rabby"] as const;
type SupportedLabel = (typeof supportedLabels)[number];

function labelFor(info: Partial<Eip6963Info>, provider: EthereumProvider): SupportedLabel | undefined {
  const haystack = `${info.name ?? ""} ${info.rdns ?? ""}`.toLowerCase();
  if (haystack.includes("okx") || provider.isOKXWallet) return "OKX Wallet";
  if (haystack.includes("rabby") || provider.isRabby) return "Rabby";
  if (haystack.includes("metamask") || provider.isMetaMask) return "MetaMask";
  return undefined;
}

const wallets = new Map<string, DiscoveredWallet>();
const providers = new WeakMap<object, string>();
let eip6963Seen = false;

function addWallet(info: Eip6963Info, provider: EthereumProvider): void {
  const label = labelFor(info, provider);
  if (!label) return;
  const providerKey = providers.get(provider as object);
  const key = providerKey ?? `uuid:${info.uuid}`;
  const wallet = { info, provider: instrumentProvider(provider), label };
  wallets.set(key, wallet);
  providers.set(provider as object, key);
}

function legacyWallet(): DiscoveredWallet | undefined {
  const candidate = window.ethereum;
  if (!candidate) return undefined;
  const provider = instrumentProvider(candidate as EthereumProvider);
  const label = labelFor({}, provider);
  if (!label) return undefined;
  return {
    info: { uuid: "legacy", name: label, icon: "", rdns: "legacy" },
    provider,
    label,
  };
}

function announce(event: Event): void {
  const detail = (event as CustomEvent<{ info?: Eip6963Info; provider?: EthereumProvider }>).detail;
  if (!detail?.info || !detail.provider || !detail.info.uuid || !detail.info.name) return;
  eip6963Seen = true;
  const fallback = wallets.get("legacy");
  if (fallback) wallets.delete("legacy");
  addWallet(detail.info, detail.provider);
}

// Register before requesting announcements and keep this listener for page lifetime.
window.addEventListener("eip6963:announceProvider", announce);
window.dispatchEvent(new Event("eip6963:requestProvider"));

export async function getAvailableWallets(): Promise<DiscoveredWallet[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 80));
  if (!eip6963Seen && wallets.size === 0) {
    const fallback = legacyWallet();
    if (fallback) wallets.set("legacy", fallback);
  }
  return [...wallets.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function supportedWalletNames(): readonly string[] {
  return supportedLabels;
}

export function isUserRejected(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: number }).code === 4001;
}

export async function requestAccount(provider: EthereumProvider): Promise<`0x${string}`> {
  const result = await provider.request({ method: "eth_requestAccounts" });
  const account = Array.isArray(result) ? result[0] : undefined;
  if (typeof account !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(account)) {
    throw new Error("No wallet account was returned.");
  }
  return account as `0x${string}`;
}

export function accountFromChange(value: unknown): `0x${string}` | undefined {
  const account = Array.isArray(value) ? value[0] : undefined;
  return typeof account === "string" && /^0x[a-fA-F0-9]{40}$/.test(account) ? account as `0x${string}` : undefined;
}

export async function ensureStudionet(provider: EthereumProvider, chain: { id: number; name: string; rpcUrls: { default: { http: readonly string[] } }; nativeCurrency: { name: string; symbol: string; decimals: number }; blockExplorers?: { default: { url: string } } }): Promise<void> {
  const target = `0x${chain.id.toString(16)}`;
  const current = await provider.request({ method: "eth_chainId" });
  if (current !== target) {
    try {
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: target }] });
    } catch (error) {
      const code = typeof error === "object" && error !== null && "code" in error ? (error as { code?: number }).code : undefined;
      if (code !== 4902) throw error;
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [{ chainId: target, chainName: chain.name, rpcUrls: chain.rpcUrls.default.http, nativeCurrency: chain.nativeCurrency, blockExplorerUrls: chain.blockExplorers ? [chain.blockExplorers.default.url] : [] }],
      });
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: target }] });
    }
  }
  const verified = await provider.request({ method: "eth_chainId" });
  if (verified !== target) throw new Error("Network switch did not reach GenLayer Studio network.");
}

export function providerChainId(provider: EthereumProvider): Promise<unknown> {
  return provider.request({ method: "eth_chainId" });
}

export function bindProviderSession(provider: EthereumProvider, accountListener: ProviderListener, chainListener: ProviderListener): () => void {
  provider.on?.("accountsChanged", accountListener);
  provider.on?.("chainChanged", chainListener);
  return () => {
    provider.removeListener?.("accountsChanged", accountListener);
    provider.removeListener?.("chainChanged", chainListener);
  };
}

export const MIN_SPENDABLE_BALANCE_WEI = 10_000_000_000_000_000n;

export async function ensureSpendableBalance(provider: EthereumProvider, account: `0x${string}`): Promise<void> {
  const result = await provider.request({ method: "eth_getBalance", params: [account, "latest"] });
  if (typeof result !== "string" || BigInt(result) < MIN_SPENDABLE_BALANCE_WEI) {
    throw new Error("Wallet needs at least 0.01 GEN available for this action.");
  }
}
