import { createClient, isSuccessful } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";
import type { EthereumProvider } from "./wallet.ts";
import { beginAction, endAction, noteActionError, noteRetry, noteWriteSubmission } from "./e2eTrace.ts";

export type Address = `0x${string}`;
export type GenLayerClient = ReturnType<typeof createClient>;

export interface LedgerConfig {
  address: Address;
}

const candidateAddress = import.meta.env.VITE_CONTRACT_ADDRESS as string | undefined;
const addressPattern = /^0x[a-fA-F0-9]{40}$/;

export const config: LedgerConfig | undefined = candidateAddress && addressPattern.test(candidateAddress)
  ? { address: candidateAddress as Address }
  : undefined;

export const readClient = createClient({ chain: studioDevnet });

function decodeContractReturn(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try { return JSON.parse(value) as unknown; } catch { return value; }
}

export function createWriteClient(address: Address, provider: EthereumProvider): GenLayerClient {
  return createClient({ chain: studioDevnet, account: address, provider });
}

export async function listRecordIds(): Promise<string[]> {
  if (!config) return [];
  const result = await readClient.readContract({ address: config.address, functionName: "list_ids", args: [] });
  return Array.isArray(result) ? result.filter((value): value is string => typeof value === "string") : [];
}

export async function getRecord(recordId: string): Promise<unknown> {
  if (!config) throw new Error("Ledger is not configured.");
  return decodeContractReturn(await readClient.readContract({ address: config.address, functionName: "get", args: [recordId] }));
}

export async function getAssessment(recordId: string, revision: number): Promise<unknown> {
  if (!config) throw new Error("Ledger is not configured.");
  return decodeContractReturn(await readClient.readContract({ address: config.address, functionName: "get_assessment", args: [recordId, revision] }));
}

async function readWithRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try { return await operation(); }
    catch (error) {
      lastError = error;
      noteRetry();
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("The ledger readback failed.");
}

export async function submitWrite(client: GenLayerClient, functionName: string, args: string[], onSubmitted?: (hash: string) => void): Promise<{ hash: string; record: unknown }> {
  if (!config) throw new Error("Ledger is not configured.");
  const action = functionName === "create" ? "create" : functionName === "freeze" ? "freeze" : functionName === "assess" ? "assess" : "reassess";
  beginAction(action);
  try {
    const call = { address: config.address, functionName, args };
    const estimate = await client.estimateTransactionFeesForWrite(call);
    const hash = await client.writeContract({
      ...call,
      fees: {
        distribution: estimate.distribution,
        messageAllocations: estimate.messageAllocations,
        feeValue: estimate.feeValue,
      },
    }) as `0x${string}`;
    noteWriteSubmission(action, hash);
    onSubmitted?.(hash);
    const waitForFinalization = readClient.waitForFinalization as unknown as (options: { hash: `0x${string}`; interval: number; retries: number; fullTransaction: boolean }) => Promise<unknown>;
    const retries = action === "create" || action === "freeze" ? 35 : 59;
    const receipt = await waitForFinalization({ hash: hash as `0x${string}`, interval: 5000, retries, fullTransaction: true });
    const receiptFields = receipt as unknown as Record<string, unknown>;
    const statusName = receiptFields.statusName ?? receiptFields.status_name;
    if (statusName !== "FINALIZED" || !isSuccessful(receipt as Parameters<typeof isSuccessful>[0])) {
      throw new Error("The network finalized the request without a successful contract result.");
    }
    const recordId = typeof args[0] === "string" ? args[0] : "";
    const record = recordId ? await readWithRetry(() => getRecord(recordId)) : undefined;
    const revision = typeof record === "object" && record !== null && typeof (record as Record<string, unknown>).revision === "number"
      ? (record as Record<string, unknown>).revision as number
      : 0;
    if (recordId && (action === "assess" || action === "reassess") && revision > 0) {
      await readWithRetry(() => getAssessment(recordId, revision));
    }
    endAction(action, "SUCCESS");
    return { hash, record };
  } catch (error) {
    noteActionError(error);
    endAction(action, "ERROR");
    throw error;
  }
}
