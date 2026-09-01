import "./style.css";
import { config, createWriteClient, getRecord, listRecordIds, submitWrite } from "./ledger.ts";
import { ensureSpendableBalance, ensureStudionet, getAvailableWallets, isUserRejected, providerChainId, requestAccount, type DiscoveredWallet, type EthereumProvider } from "./wallet.ts";
import { studionet } from "genlayer-js/chains";

type Session = {
  account: `0x${string}`;
  provider: EthereumProvider;
  walletLabel: string;
  writeClient: ReturnType<typeof createWriteClient> | undefined;
  accountListener: (...args: unknown[]) => void;
  chainListener: (...args: unknown[]) => void;
};

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Application root is missing");
const root = app;

let session: Session | undefined;
let restoreFocus: HTMLElement | undefined;

app.innerHTML = `
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Disclosure Ledger home">Disclosure Ledger</a>
      <div class="topbar-actions">
        <span class="network-status" id="network-status" role="status">Not connected</span>
        <button class="button button-secondary" type="button" id="connect-wallet">Connect wallet</button>
      </div>
    </header>
    <section class="hero" aria-labelledby="page-title">
      <p class="eyebrow">Public source comparison</p>
      <h1 id="page-title">See whether an app’s privacy disclosures tell the same story.</h1>
      <p class="hero-copy">Keep an auditable record of the app-store disclosure and the publisher policy, then compare the public claims over time.</p>
    </section>
    <section class="ledger-section" aria-labelledby="ledger-title">
      <div class="section-heading">
        <div><p class="eyebrow">Your ledger</p><h2 id="ledger-title">Disclosure records</h2></div>
        <button class="button" type="button" id="create-record">Create a record</button>
      </div>
      <p class="screen-status" id="screen-status" role="status" aria-live="polite"></p>
      <div class="records" id="records"></div>
    </section>
  </main>
`;

const connectButton = document.querySelector<HTMLButtonElement>("#connect-wallet");
const createButton = document.querySelector<HTMLButtonElement>("#create-record");
const networkStatus = document.querySelector<HTMLSpanElement>("#network-status");
const screenStatus = document.querySelector<HTMLParagraphElement>("#screen-status");
const records = document.querySelector<HTMLDivElement>("#records");

function setScreenStatus(message: string): void { if (screenStatus) screenStatus.textContent = message; }
function setNetworkStatus(message: string): void { if (networkStatus) networkStatus.textContent = message; }

function field(record: unknown, key: string): unknown {
  if (typeof record !== "object" || record === null) return undefined;
  return (record as Record<string, unknown>)[key];
}

function displayValue(value: unknown, fallback = "—"): string {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function stateLabel(value: unknown): string {
  return ({ DRAFT: "Draft", FROZEN: "Sources frozen", ASSESSED: "Compared" } as Record<string, string>)[String(value)] ?? displayValue(value);
}

function verdictLabel(value: unknown): string {
  return ({ CONSISTENT: "Consistent", MATERIAL_CONFLICT: "Material conflict", DISCLOSURE_MISSING: "Disclosure missing", UNRESOLVED: "Could not resolve" } as Record<string, string>)[String(value)] ?? displayValue(value);
}

function walletMark(label: string): string {
  if (label === "MetaMask") return "M";
  if (label === "OKX Wallet") return "O";
  if (label === "Rabby") return "R";
  return "W";
}

function errorMessage(error: unknown): string {
  if (isUserRejected(error)) return "The wallet request was cancelled. Choose a wallet when you are ready.";
  if (error instanceof Error && error.message) {
    const message = error.message.toLowerCase();
    if (message.includes("no wallet account")) return "No wallet account was returned. Choose an account and try again.";
    if (message.includes("insufficient") || message.includes("balance")) return "This wallet does not have enough GEN to complete the action.";
    if (message.includes("usererror") || message.includes("record must") || message.includes("unknown record")) return "The record could not be updated. Check its current state and try again.";
    if (message.includes("chain") || message.includes("switch") || message.includes("network")) return "Switch to GenLayer Studio network before continuing.";
    if (message.includes("rpc") || message.includes("rate") || message.includes("fetch") || message.includes("timeout")) return "The network is temporarily unavailable. Please try again shortly.";
    return "The request could not be completed. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

function tearDownSession(): void {
  if (!session) return;
  session.provider.removeListener?.("accountsChanged", session.accountListener);
  session.provider.removeListener?.("chainChanged", session.chainListener);
  session = undefined;
}

async function syncNetwork(): Promise<void> {
  if (!session) return;
  const current = await providerChainId(session.provider);
  const target = `0x${studionet.id.toString(16)}`;
  if (current !== target) {
    session.writeClient = undefined;
    setNetworkStatus("Switch to GenLayer Studio network");
    return;
  }
  await ensureSpendableBalance(session.provider, session.account);
  session.writeClient = createWriteClient(session.account, session.provider);
  setNetworkStatus("Connected to GenLayer Studio");
}

function setConnectedSession(account: `0x${string}`, provider: EthereumProvider, walletLabel: string): void {
  tearDownSession();
  const accountListener = (...args: unknown[]): void => {
    const next = Array.isArray(args[0]) ? args[0][0] : undefined;
    if (typeof next !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(next)) {
      tearDownSession();
      if (connectButton) connectButton.textContent = "Connect wallet";
      setNetworkStatus("Not connected");
      setScreenStatus("Wallet disconnected. Connect again to continue.");
      return;
    }
    if (session) {
      session.account = next as `0x${string}`;
      void syncNetwork().catch(() => setNetworkStatus("Network connection needs attention"));
    }
  };
  const chainListener = (): void => { void syncNetwork().catch(() => setNetworkStatus("Network connection needs attention")); };
  session = { account, provider, walletLabel, writeClient: undefined, accountListener, chainListener };
  provider.on?.("accountsChanged", accountListener);
  provider.on?.("chainChanged", chainListener);
  if (connectButton) connectButton.textContent = "Switch wallet";
  setNetworkStatus("Checking wallet connection…");
  void syncNetwork().catch(() => setNetworkStatus("Wallet balance or network needs attention"));
}

function closeModal(modal: HTMLDivElement): void {
  modal.remove();
  root.inert = false;
  restoreFocus?.focus();
  restoreFocus = undefined;
}

function showWalletPicker(walletOptions: DiscoveredWallet[]): void {
  restoreFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.setAttribute("role", "presentation");
  modal.innerHTML = `
    <section class="wallet-modal" role="dialog" aria-modal="true" aria-labelledby="wallet-title">
      <div class="modal-heading"><div><p class="eyebrow">Connect</p><h2 id="wallet-title">Choose a wallet</h2></div><button class="icon-button" type="button" data-close aria-label="Close wallet chooser">×</button></div>
      <p class="modal-copy">Select the wallet you want to use for this session.</p>
      <div class="wallet-options" role="list"></div>
      <p class="inline-error" id="wallet-error" role="alert" hidden></p>
    </section>
  `;
  const optionContainer = modal.querySelector<HTMLDivElement>(".wallet-options");
  const error = modal.querySelector<HTMLParagraphElement>("#wallet-error");
  if (walletOptions.length === 0) {
    optionContainer!.innerHTML = `<p class="empty-copy">No supported wallet is available in this browser.</p>`;
  } else {
    walletOptions.forEach((wallet) => {
      const button = document.createElement("button");
      button.className = "wallet-option";
      button.type = "button";
      const icon = document.createElement("span");
      icon.className = "wallet-mark";
      icon.setAttribute("aria-hidden", "true");
      if (/^(data:image\/|https:\/\/)/i.test(wallet.info.icon)) {
        const image = document.createElement("img");
        image.src = wallet.info.icon;
        image.alt = "";
        image.width = 28;
        image.height = 28;
        icon.replaceChildren(image);
      } else {
        icon.textContent = walletMark(wallet.label);
      }
      const label = document.createElement("span");
      label.textContent = wallet.label;
      const arrow = document.createElement("span");
      arrow.className = "option-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";
      button.append(icon, label, arrow);
      button.addEventListener("click", async () => {
        button.disabled = true;
        if (error) error.hidden = true;
        try {
          const account = await requestAccount(wallet.provider);
          await ensureStudionet(wallet.provider, studionet);
          await ensureSpendableBalance(wallet.provider, account);
          setConnectedSession(account, wallet.provider, wallet.label);
          closeModal(modal);
          setScreenStatus(`${wallet.label} is connected. You can now create or update a record.`);
        } catch (connectionError) {
          button.disabled = false;
          if (error) { error.textContent = errorMessage(connectionError); error.hidden = false; }
        }
      });
      optionContainer?.append(button);
    });
  }
  const close = (): void => closeModal(modal);
  modal.querySelector<HTMLButtonElement>("[data-close]")?.addEventListener("click", close);
  modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key !== "Tab") return;
    const focusable = [...modal.querySelectorAll<HTMLElement>("button:not([disabled])")];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  root.inert = true;
  document.body.append(modal);
  (optionContainer?.querySelector<HTMLButtonElement>("button") ?? modal.querySelector<HTMLButtonElement>("[data-close]"))?.focus();
}

async function openWalletPicker(): Promise<void> { showWalletPicker(await getAvailableWallets()); }

function showCreateForm(): void {
  const existing = document.querySelector<HTMLDivElement>("#create-panel");
  if (existing) { existing.remove(); return; }
  const panel = document.createElement("div");
  panel.id = "create-panel";
  panel.className = "panel form-panel";
  panel.innerHTML = `
    <div class="section-heading"><div><p class="eyebrow">New record</p><h2>Create a disclosure record</h2></div><button class="icon-button" type="button" data-close aria-label="Close create form">×</button></div>
    <p class="form-copy">Add two public HTTPS sources. The record starts as a draft and can be frozen before comparison.</p>
    <form id="record-form" class="record-form">
      <label>Record ID<input name="record_id" required maxlength="128" pattern="[A-Za-z0-9._-]+" placeholder="my-app-2026" /></label>
      <label>App name or ID<input name="app_id" required maxlength="256" placeholder="My App" /></label>
      <label>Platform<select name="platform"><option value="android">Android</option><option value="ios">iOS</option><option value="other">Other</option></select></label>
      <label>App-store disclosure URL<input name="store_url" type="url" required placeholder="https://example.com/store-privacy" /></label>
      <label>Publisher policy URL<input name="policy_url" type="url" required placeholder="https://example.com/privacy" /></label>
      <button class="button" type="submit">Create record</button>
      <p class="inline-error" id="form-error" role="alert" hidden></p>
    </form>
  `;
  panel.querySelector<HTMLButtonElement>("[data-close]")?.addEventListener("click", () => panel.remove());
  panel.querySelector<HTMLFormElement>("#record-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const error = panel.querySelector<HTMLParagraphElement>("#form-error");
    if (!session) { panel.remove(); await openWalletPicker(); return; }
    if (!session.writeClient) { if (error) { error.textContent = "Switch to GenLayer Studio network before creating a record."; error.hidden = false; } return; }
    const values = Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement).entries());
    const button = panel.querySelector<HTMLButtonElement>("button[type=submit]");
    if (button) button.disabled = true;
    try {
      await ensureSpendableBalance(session.provider, session.account);
      await submitWrite(session.writeClient, "create", [String(values.record_id), String(values.app_id), String(values.store_url), String(values.policy_url), String(values.platform)]);
      panel.remove();
      await loadRecords();
      setScreenStatus("Record created and read back from the ledger.");
    } catch (writeError) {
      if (button) button.disabled = false;
      if (error) { error.textContent = errorMessage(writeError); error.hidden = false; }
    }
  });
  document.querySelector(".ledger-section")?.prepend(panel);
  panel.querySelector<HTMLInputElement>("input")?.focus();
}

async function loadRecords(): Promise<void> {
  if (!records) return;
  if (!config) { records.innerHTML = `<div class="panel empty-state"><div><h3>Ledger is getting ready</h3><p>Records will appear here when the public ledger is connected.</p></div></div>`; return; }
  setScreenStatus("Loading records…");
  try {
    const ids = await listRecordIds();
    records.innerHTML = "";
    if (ids.length === 0) {
      records.innerHTML = `<div class="panel empty-state"><div><h3>No records yet</h3><p>Create the first record to compare two public privacy sources.</p></div></div>`;
      setScreenStatus("");
      return;
    }
    for (const id of ids) {
      const record = await getRecord(id);
      const card = document.createElement("article");
      card.className = "record-card panel";
      card.innerHTML = `<div class="record-card-heading"><div><p class="eyebrow"></p><h3></h3></div><span class="state-badge"></span></div><dl><div><dt>Record</dt><dd class="record-id"></dd></div><div><dt>Latest comparison</dt><dd class="verdict"></dd></div><div><dt>Revision</dt><dd class="revision"></dd></div></dl><div class="card-actions"></div>`;
      card.querySelector(".eyebrow")!.textContent = displayValue(field(record, "platform"));
      card.querySelector("h3")!.textContent = displayValue(field(record, "app_id"), id);
      card.querySelector(".record-id")!.textContent = id;
      card.querySelector(".state-badge")!.textContent = stateLabel(field(record, "state"));
      card.querySelector(".verdict")!.textContent = verdictLabel(field(record, "verdict"));
      card.querySelector(".revision")!.textContent = displayValue(field(record, "revision"), "0");
      const actions = card.querySelector<HTMLDivElement>(".card-actions")!;
      const state = displayValue(field(record, "state"));
      if (state === "DRAFT") actions.append(actionButton("Freeze sources", "freeze", id));
      if (state === "FROZEN") actions.append(actionButton("Compare sources", "assess", id));
      if (state === "ASSESSED") actions.append(actionButton("Run comparison again", "reassess", id));
      records.append(card);
    }
    setScreenStatus("");
  } catch (error) {
    records.innerHTML = `<div class="panel empty-state"><div><h3>Records are temporarily unavailable</h3><p>Refresh this view and try again.</p></div></div>`;
    setScreenStatus(errorMessage(error));
  }
}

function actionButton(label: string, method: string, recordId: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "button button-secondary";
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", async () => {
    if (!session) { await openWalletPicker(); return; }
    if (!session.writeClient) { setScreenStatus("Switch to GenLayer Studio network before updating this record."); return; }
    button.disabled = true;
    setScreenStatus("Waiting for the network to confirm the update…");
    try {
      await ensureSpendableBalance(session.provider, session.account);
      await submitWrite(session.writeClient, method, [recordId]);
      await loadRecords();
      setScreenStatus("Record updated and read back from the ledger.");
    } catch (error) {
      button.disabled = false;
      setScreenStatus(errorMessage(error));
    }
  });
  return button;
}

connectButton?.addEventListener("click", () => void openWalletPicker());
createButton?.addEventListener("click", showCreateForm);
void loadRecords();
