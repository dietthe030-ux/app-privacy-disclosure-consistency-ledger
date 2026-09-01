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

const supportedLabels = ["MetaMask", "OKX Wallet", "Rabby"] as const;
type SupportedLabel = (typeof supportedLabels)[number];

function labelFor(info: Partial<Eip6963Info>, provider: EthereumProvider): SupportedLabel | undefined {
  const haystack = `${info.name ?? ""} ${info.rdns ?? ""}`.toLowerCase();
  if (haystack.includes("metamask") || provider.isMetaMask) return "MetaMask";
  if (haystack.includes("okx") || provider.isOKXWallet) return "OKX Wallet";
  if (haystack.includes("rabby") || provider.isRabby) return "Rabby";
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
  const wallet = { info, provider, label };
  wallets.set(key, wallet);
  providers.set(provider as object, key);
}

function legacyWallet(): DiscoveredWallet | undefined {
  const candidate = window.ethereum;
  if (!candidate) return undefined;
  const provider = candidate as EthereumProvider;
  const label = labelFor({}, provider);
  const fallbackLabel = label ?? "Detected wallet";
  return {
    info: { uuid: "legacy", name: fallbackLabel, icon: "", rdns: "legacy" },
    provider,
    label: fallbackLabel,
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

export async function ensureStudionet(provider: EthereumProvider, chain: { id: number; name: string; rpcUrls: { default: { http: readonly string[] } }; nativeCurrency: { name: string; symbol: string; decimals: number }; blockExplorers?: { default: { url: string } } }): Promise<void> {
  const target = `0x${chain.id.toString(16)}`;
  const current = await provider.request({ method: "eth_chainId" });
  if (current === target) return;
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

export function providerChainId(provider: EthereumProvider): Promise<unknown> {
  return provider.request({ method: "eth_chainId" });
}
