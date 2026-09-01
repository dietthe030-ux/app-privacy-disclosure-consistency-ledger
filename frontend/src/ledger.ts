import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { ExecutionResult, TransactionStatus } from "genlayer-js/types";
import type { EthereumProvider } from "./wallet.ts";

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

export const readClient = createClient({ chain: studionet });

function decodeContractReturn(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try { return JSON.parse(value) as unknown; } catch { return value; }
}

export function createWriteClient(address: Address, provider: EthereumProvider): GenLayerClient {
  return createClient({ chain: studionet, account: address, provider });
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

export async function submitWrite(client: GenLayerClient, functionName: string, args: string[]): Promise<{ hash: string; record: unknown }> {
  if (!config) throw new Error("Ledger is not configured.");
  const hash = await client.writeContract({ address: config.address, functionName, args, value: BigInt(0) }) as `0x${string}`;
  const receipt = await readClient.waitForTransactionReceipt({ hash: hash as never, status: TransactionStatus.FINALIZED, interval: 3000, retries: 120 });
  if (receipt.txExecutionResultName !== ExecutionResult.FINISHED_WITH_RETURN) {
    throw new Error("The network finalized the request without a successful contract result.");
  }
  const recordId = typeof args[0] === "string" && functionName !== "create" ? args[0] : typeof args[0] === "string" ? args[0] : "";
  const record = recordId ? await getRecord(recordId) : undefined;
  return { hash, record };
}
