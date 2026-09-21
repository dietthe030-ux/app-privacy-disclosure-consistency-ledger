import type { EthereumProvider } from "./wallet.ts";

type ActionName = "create" | "freeze" | "assess" | "reassess";
type TraceEvent = { at: number; source: "provider" | "fetch"; method: string; action?: ActionName };
type ActionLedger = {
  action: ActionName;
  requests: number;
  providerRequests: number;
  fetchRequests: number;
  polling: number;
  readback: number;
  writeSubmissions: number;
  hash?: string;
  retries: number;
  status: "SUCCESS" | "ERROR";
};
type TraceState = {
  enabled: boolean;
  startedAt: string;
  providerTotal: number;
  fetchTotal: number;
  fetchRpc: number;
  providerByMethod: Record<string, number>;
  fetchByMethod: Record<string, number>;
  writeSubmissions: Record<ActionName, number>;
  writeHashes: Record<ActionName, string[]>;
  events: TraceEvent[];
  actions: ActionLedger[];
  currentAction?: ActionName;
  currentRetries: number;
  accountDiffersFromStudioDeployer?: boolean;
  lastError?: { code?: string | number; message: string };
};

const enabled = typeof window !== "undefined" && typeof window.location?.search === "string" && new URLSearchParams(window.location.search).get("e2e") === "1";
const state: TraceState = {
  enabled,
  startedAt: new Date().toISOString(),
  providerTotal: 0,
  fetchTotal: 0,
  fetchRpc: 0,
  providerByMethod: {},
  fetchByMethod: {},
  writeSubmissions: { create: 0, freeze: 0, assess: 0, reassess: 0 },
  writeHashes: { create: [], freeze: [], assess: [], reassess: [] },
  events: [],
  actions: [],
  currentRetries: 0,
};

const pollingMethods = new Set(["gen_getTransactionLifecycle", "gen_getTransactionStatus", "gen_getTransactionReceipt", "eth_getTransactionReceipt", "eth_getTransactionByHash"]);
const readMethods = new Set(["eth_call", "gen_call", "gen_getContractState", "gen_getContractCode"]);
const studioDeployer = "0x8581c4a532dd3f9b163b12809b1bd089f367147f";

export function differsFromStudioDeployer(account: `0x${string}`): boolean {
  return account.toLowerCase() !== studioDeployer;
}

function refreshElement(): void {
  if (!enabled) return;
  const element = document.getElementById("e2e-trace");
  if (element) element.textContent = JSON.stringify(snapshot());
}

function record(source: "provider" | "fetch", method: string): void {
  if (!enabled || !method) return;
  const bucket = source === "provider" ? state.providerByMethod : state.fetchByMethod;
  bucket[method] = (bucket[method] ?? 0) + 1;
  if (source === "provider") state.providerTotal += 1;
  else { state.fetchTotal += 1; state.fetchRpc += 1; }
  state.events.push({ at: Date.now(), source, method, action: state.currentAction });
  refreshElement();
}

function countFor(action: ActionName, predicate: (event: TraceEvent) => boolean): number {
  return state.events.filter((event) => event.action === action && predicate(event)).length;
}

export function mountE2ETrace(): void { refreshElement(); }

export function noteConnectedAccount(account: `0x${string}`): void {
  if (!enabled) return;
  state.accountDiffersFromStudioDeployer = differsFromStudioDeployer(account);
  refreshElement();
}

export function instrumentProvider(provider: EthereumProvider): EthereumProvider {
  if (!enabled) return provider;
  return new Proxy(provider, {
    get(target, property, receiver) {
      if (property === "request") {
        return async (args: { method: string; params?: unknown[] }) => {
          record("provider", args.method);
          return Reflect.apply(target.request, target, [args]);
        };
      }
      return Reflect.get(target, property, receiver);
    },
  });
}

export function beginAction(action: ActionName): void {
  if (!enabled) return;
  if (state.currentAction) throw new Error("E2E trace action overlap detected.");
  state.currentAction = action;
  state.currentRetries = 0;
}

export function noteWriteSubmission(action: ActionName, hash: string): void {
  if (!enabled) return;
  state.writeSubmissions[action] += 1;
  state.writeHashes[action].push(hash);
  refreshElement();
}

export function noteRetry(): void {
  if (!enabled || !state.currentAction) return;
  state.currentRetries += 1;
}

export function noteActionError(error: unknown): void {
  if (!enabled) return;
  const record = typeof error === "object" && error !== null ? error as { code?: unknown; message?: unknown } : {};
  state.lastError = {
    ...(typeof record.code === "string" || typeof record.code === "number" ? { code: record.code } : {}),
    message: typeof record.message === "string" ? record.message.slice(0, 500) : String(error).slice(0, 500),
  };
  refreshElement();
}

export function endAction(action: ActionName, status: "SUCCESS" | "ERROR"): void {
  if (!enabled || state.currentAction !== action) return;
  state.actions.push({
    action,
    requests: countFor(action, () => true),
    providerRequests: countFor(action, (event) => event.source === "provider"),
    fetchRequests: countFor(action, (event) => event.source === "fetch"),
    polling: countFor(action, (event) => pollingMethods.has(event.method)),
    readback: countFor(action, (event) => readMethods.has(event.method)),
    writeSubmissions: state.writeSubmissions[action],
    hash: state.writeHashes[action].at(-1),
    retries: state.currentRetries,
    status,
  });
  state.currentAction = undefined;
  state.currentRetries = 0;
  refreshElement();
}

export function snapshot(): unknown {
  return {
    enabled: state.enabled,
    startedAt: state.startedAt,
    ceiling: 541,
    providerTotal: state.providerTotal,
    fetchTotal: state.fetchTotal,
    fetchRpc: state.fetchRpc,
    wholeRunRequests: state.providerTotal + state.fetchRpc,
    providerByMethod: state.providerByMethod,
    fetchByMethod: state.fetchByMethod,
    writeSubmissions: state.writeSubmissions,
    writeHashes: state.writeHashes,
    actions: state.actions,
    accountDiffersFromStudioDeployer: state.accountDiffersFromStudioDeployer,
    lastError: state.lastError,
    hardStopReached: state.providerTotal + state.fetchRpc >= 541,
    eventCount: state.events.length,
  };
}

if (enabled && typeof window !== "undefined") {
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const body = args[1]?.body;
    if (typeof body === "string") {
      try { record("fetch", (JSON.parse(body) as { method?: string }).method ?? ""); } catch { /* non-JSON fetch */ }
    }
    return originalFetch(...args);
  };
}
