import "./style.css";
import { config, createWriteClient, getAssessment, getRecord, listRecordIds, submitWrite } from "./ledger.ts";
import { accountFromChange, bindProviderSession, ensureStudioDevnet, getAvailableWallets, isUserRejected, normalizeChainId, providerChainId, requestAccount, type DiscoveredWallet, type EthereumProvider } from "./wallet.ts";
import { studioDevnet } from "genlayer-js/chains";
import { mountE2ETrace } from "./e2eTrace.ts";

type Session = {
  account: `0x${string}`;
  provider: EthereumProvider;
  walletLabel: string;
  writeClient: ReturnType<typeof createWriteClient> | undefined;
  accountListener: (...args: unknown[]) => void;
  chainListener: (...args: unknown[]) => void;
  removeListeners: () => void;
};

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Application root is missing");
const root = app;

let session: Session | undefined;
let restoreFocus: HTMLElement | undefined;

app.innerHTML = `
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Disclosure Ledger home"><span class="brand-mark" aria-hidden="true">↗</span><span>Disclosure Ledger</span></a>
      <nav class="topnav" aria-label="Primary navigation"><a href="#ledger-title">Workspace</a><a href="#how-it-works">How it works</a></nav>
      <div class="topbar-actions">
        <span class="network-pill"><span class="network-dot" aria-hidden="true"></span><span class="network-status" id="network-status" role="status">Not connected</span></span>
        <button class="button button-secondary" type="button" id="connect-wallet">Connect wallet</button>
      </div>
    </header>
    <section class="hero" aria-labelledby="page-title">
      <div class="hero-copy-block">
        <p class="eyebrow hero-eyebrow">Privacy evidence / live ledger</p>
        <h1 id="page-title">Make privacy claims easier to trust.</h1>
        <p class="hero-copy">Compare an app-store disclosure with the publisher’s policy, preserve each source snapshot, and keep every result auditable over time.</p>
        <div class="hero-actions"><a class="button" href="#ledger-title">Open workspace <span aria-hidden="true">↘</span></a><span class="hero-note"><span class="pulse-dot" aria-hidden="true"></span>Verifiable on GenLayer Studio</span></div>
      </div>
      <div class="hero-visual" aria-label="Comparison flow preview">
        <div class="visual-topline"><span>Comparison flow</span><span class="visual-live">LIVE</span></div>
        <div class="source-stack"><div class="source-card"><span class="source-icon">A</span><span><strong>App Store disclosure</strong><small>Public source snapshot</small></span><span class="source-check">✓</span></div><div class="source-card"><span class="source-icon source-icon-alt">P</span><span><strong>Publisher policy</strong><small>Public source snapshot</small></span><span class="source-check">✓</span></div></div>
        <div class="flow-line"><span></span><b>→</b><span></span></div>
        <div class="result-card"><span class="result-ring">≈</span><span><small>Latest result</small><strong>Evidence compared</strong></span><span class="result-arrow">↗</span></div>
      </div>
    </section>
    <section class="trust-strip" aria-label="Ledger properties"><div><strong>01</strong><span>Capture public sources</span></div><div><strong>02</strong><span>Freeze a revision</span></div><div><strong>03</strong><span>Compare with evidence</span></div></section>
    <section class="ledger-section" aria-labelledby="ledger-title">
      <div class="section-heading section-heading-ledger">
        <div><p class="eyebrow">Workspace / records</p><h2 id="ledger-title">Your disclosure ledger</h2><p class="section-intro">A clear history of what was compared, when, and why.</p></div>
        <button class="button" type="button" id="create-record"><span aria-hidden="true">+</span> New record</button>
      </div>
      <div class="screen-status" id="screen-status" role="status" aria-live="polite" aria-busy="false"></div>
      <div class="transaction-evidence" id="transaction-evidence" role="status" aria-live="polite" hidden></div>
      <div class="records" id="records"></div>
    </section>
    <section class="how-it-works" id="how-it-works" aria-labelledby="how-title"><div><p class="eyebrow">Built for review</p><h2 id="how-title">A calm, inspectable workflow.</h2></div><p>Each record moves from draft to frozen sources to a comparison result. The ledger keeps the revision trail visible, while the network confirms the write.</p><div class="how-badge"><span>GEN</span><span>Studio network</span></div></section>
    <footer class="footer"><span>Disclosure Ledger</span><span>Public-source evidence, made inspectable.</span></footer>
  </main>
`;

if (new URLSearchParams(window.location.search).get("e2e") === "1") {
  const trace = document.createElement("pre");
  trace.id = "e2e-trace";
  trace.hidden = true;
  trace.setAttribute("aria-hidden", "true");
  document.body.append(trace);
  mountE2ETrace();
}

const connectButton = document.querySelector<HTMLButtonElement>("#connect-wallet");
const createButton = document.querySelector<HTMLButtonElement>("#create-record");
const networkStatus = document.querySelector<HTMLSpanElement>("#network-status");
const screenStatus = document.querySelector<HTMLDivElement>("#screen-status");
const transactionEvidence = document.querySelector<HTMLDivElement>("#transaction-evidence");
const records = document.querySelector<HTMLDivElement>("#records");

function setScreenStatus(message: string, active = false): void {
  if (!screenStatus) return;
  screenStatus.replaceChildren();
  if (active) {
    const spinner = document.createElement("span");
    spinner.className = "status-spinner";
    spinner.setAttribute("aria-hidden", "true");
    screenStatus.append(spinner);
  }
  screenStatus.append(document.createTextNode(message));
  screenStatus.setAttribute("aria-busy", String(active));
}
function setNetworkStatus(message: string): void { if (networkStatus) networkStatus.textContent = message; }

function showTransactionEvidence(hash: string, action: string): void {
  if (!transactionEvidence || !config) return;
  transactionEvidence.hidden = false;
  transactionEvidence.replaceChildren();
  const label = document.createElement("span");
  label.className = "transaction-label";
  label.textContent = `${action} submitted`;
  const value = document.createElement("code");
  value.textContent = hash;
  const copy = document.createElement("button");
  copy.className = "hash-copy";
  copy.type = "button";
  copy.textContent = "Copy hash";
  copy.addEventListener("click", async () => {
    await navigator.clipboard?.writeText(hash);
    copy.textContent = "Copied";
    window.setTimeout(() => { copy.textContent = "Copy hash"; }, 1600);
  });
  const explorer = document.createElement("a");
  explorer.className = "hash-link";
  explorer.href = `https://explorer-studio-dev.genlayer.com/address/${config.address}`;
  explorer.target = "_blank";
  explorer.rel = "noreferrer";
  explorer.textContent = "Open contract";
  transactionEvidence.append(label, value, copy, explorer);
}

function field(record: unknown, key: string): unknown {
  if (typeof record !== "object" || record === null) return undefined;
  return (record as Record<string, unknown>)[key];
}

function displayValue(value: unknown, fallback = "—"): string {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function objectValue(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
}

function evidenceRow(label: string, value: unknown): HTMLDivElement {
  const row = document.createElement("div");
  const term = document.createElement("dt");
  const detail = document.createElement("dd");
  term.textContent = label;
  detail.textContent = displayValue(value);
  row.append(term, detail);
  return row;
}

async function renderAssessmentHistory(card: HTMLElement, recordId: string, revision: number): Promise<void> {
  if (revision < 1) return;
  const history = document.createElement("section");
  history.className = "assessment-history";
  const title = document.createElement("h4");
  title.textContent = `Assessment history (${revision})`;
  history.append(title);
  for (let current = revision; current >= 1; current -= 1) {
    const assessment = objectValue(await getAssessment(recordId, current));
    const store = objectValue(assessment.store);
    const policy = objectValue(assessment.policy);
    const identity = objectValue(assessment.identity);
    const storeEvidence = objectValue(assessment.store_evidence);
    const policyEvidence = objectValue(assessment.policy_evidence);
    const evidenceQuotes = objectValue(assessment.evidence_quotes);
    const item = document.createElement("details");
    item.className = "assessment-revision";
    if (current === revision) item.open = true;
    const summary = document.createElement("summary");
    summary.textContent = `Revision ${current} · ${verdictLabel(assessment.verdict)} · ${displayValue(assessment.retrieved_at)}`;
    item.append(summary);
    const identityLine = document.createElement("p");
    identityLine.className = "identity-result";
    identityLine.textContent = `Source identity — app: ${displayValue(identity.store_app)}; publisher policy: ${displayValue(identity.publisher_policy)}`;
    const comparison = document.createElement("dl");
    comparison.className = "assessment-comparison";
    comparison.append(
      evidenceRow("Collection", `${displayValue(store.collection)} / ${displayValue(policy.collection)}`),
      evidenceRow("Sharing", `${displayValue(store.sharing)} / ${displayValue(policy.sharing)}`),
      evidenceRow("Deletion", `${displayValue(store.deletion)} / ${displayValue(policy.deletion)}`),
      evidenceRow("Retention", `${displayValue(store.retention_kind)} ${displayValue(store.retention_days, "0")} / ${displayValue(policy.retention_kind)} ${displayValue(policy.retention_days, "0")}`),
      evidenceRow("Evidence status", `${displayValue(assessment.evidence_status)} · ${displayValue(assessment.reason_code)}`),
    );
    item.append(identityLine, comparison);
    const quoteGrid = document.createElement("div");
    quoteGrid.className = "evidence-quotes";
    for (const [label, quotesValue] of [["App-store supporting quotes", evidenceQuotes.store], ["Publisher-policy supporting quotes", evidenceQuotes.policy]] as const) {
      const quotes = objectValue(quotesValue);
      const group = document.createElement("div");
      const heading = document.createElement("h5");
      heading.textContent = label;
      group.append(heading);
      for (const key of ["identity", "collection", "sharing", "deletion", "retention"]) {
        if (!quotes[key]) continue;
        const quote = document.createElement("p");
        quote.textContent = `${key}: “${displayValue(quotes[key])}”`;
        group.append(quote);
      }
      quoteGrid.append(group);
    }
    item.append(quoteGrid);
    for (const [label, evidence] of [["App-store evidence", storeEvidence], ["Publisher-policy evidence", policyEvidence]] as const) {
      const source = document.createElement("div");
      source.className = "evidence-snapshot";
      const sourceTitle = document.createElement("h5");
      sourceTitle.textContent = label;
      const metadata = document.createElement("p");
      metadata.textContent = `HTTP ${displayValue(evidence.http_status)} · ${displayValue(evidence.captured_bytes, "0")} captured bytes${evidence.truncated === true ? " · bounded snapshot" : ""}`;
      const link = document.createElement("a");
      link.href = sourceUrl(evidence.requested_url);
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = displayValue(evidence.requested_url);
      const digest = document.createElement("code");
      digest.textContent = displayValue(evidence.sha256);
      const excerpt = document.createElement("blockquote");
      excerpt.textContent = displayValue(evidence.excerpt, "No readable evidence captured.");
      source.append(sourceTitle, metadata, link, digest, excerpt);
      item.append(source);
    }
    history.append(item);
  }
  card.append(history);
}

function sourceUrl(value: unknown): string {
  if (typeof value !== "string") return "Source unavailable";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "Source unavailable";
  } catch { return "Source unavailable"; }
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
    if (message.includes("insufficient") || message.includes("balance")) return "This wallet does not have enough GEN to pay for this transaction.";
    if (message.includes("usererror") || message.includes("record must") || message.includes("unknown record")) return "The record could not be updated. Check its current state and try again.";
    if (message.includes("chain") || message.includes("switch") || message.includes("network")) return "Switch to GenLayer Studio network before continuing.";
    if (message.includes("rpc") || message.includes("rate") || message.includes("fetch") || message.includes("timeout")) return "The network is temporarily unavailable. Please try again shortly.";
    return "The request could not be completed. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

function tearDownSession(): void {
  if (!session) return;
  session.removeListeners();
  session = undefined;
}

async function syncNetwork(): Promise<boolean> {
  if (!session) return false;
  const current = await providerChainId(session.provider);
  const target = `0x${studioDevnet.id.toString(16)}`;
  if (normalizeChainId(current) !== target) {
    session.writeClient = undefined;
    setNetworkStatus("Switch to GenLayer Studio network");
    return false;
  }
  session.writeClient = createWriteClient(session.account, session.provider);
  setNetworkStatus("Connected to GenLayer Studio");
  return true;
}

async function ensureWriteClient(): Promise<NonNullable<Session["writeClient"]>> {
  if (!session) throw new Error("Connect a wallet before continuing.");
  if (!session.writeClient) await syncNetwork();
  if (!session?.writeClient) throw new Error("Switch to GenLayer Studio network before continuing.");
  return session.writeClient;
}

function setConnectedSession(account: `0x${string}`, provider: EthereumProvider, walletLabel: string): void {
  tearDownSession();
  const accountListener = (...args: unknown[]): void => {
    const next = accountFromChange(args[0]);
    if (!next) {
      tearDownSession();
      if (connectButton) connectButton.textContent = "Connect wallet";
      setNetworkStatus("Not connected");
      setScreenStatus("Wallet disconnected. Connect again to continue.");
      return;
    }
    if (session) {
      session.account = next;
      void syncNetwork().catch(() => setNetworkStatus("Network connection needs attention"));
    }
  };
  const chainListener = (): void => { void syncNetwork().catch(() => setNetworkStatus("Network connection needs attention")); };
  const removeListeners = bindProviderSession(provider, accountListener, chainListener);
  session = { account, provider, walletLabel, writeClient: undefined, accountListener, chainListener, removeListeners };
  if (connectButton) connectButton.textContent = "Switch wallet";
  setNetworkStatus("Checking wallet connection…");
  void syncNetwork().catch(() => setNetworkStatus("Network connection needs attention"));
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
          await ensureStudioDevnet(wallet.provider, studioDevnet);
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
      <label>Record ID<input name="record_id" required maxlength="64" pattern="[A-Za-z0-9_-]+" placeholder="my-app-2026" /><small>1–64 letters, numbers, hyphens, or underscores.</small></label>
      <label>App-store ID<input name="app_id" required maxlength="256" placeholder="Android package or numeric Apple ID" /><small>Use the package ID for Google Play or the numeric ID from an Apple App Store URL.</small></label>
      <label>Platform<select name="platform"><option value="android">Android</option><option value="ios">iOS</option><option value="other">Other</option></select></label>
      <label>App-store listing URL<input name="store_url" type="url" required placeholder="https://play.google.com/store/apps/details?id=…" /></label>
      <label>Publisher policy URL<input name="policy_url" type="url" required placeholder="https://publisher.example/privacy" /><small>Must be a distinct publisher-controlled host, not an app-store URL.</small></label>
      <button class="button" type="submit">Create record</button>
      <p class="inline-error" id="form-error" role="alert" hidden></p>
    </form>
  `;
  panel.querySelector<HTMLButtonElement>("[data-close]")?.addEventListener("click", () => panel.remove());
  panel.querySelector<HTMLFormElement>("#record-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const error = panel.querySelector<HTMLParagraphElement>("#form-error");
    if (!session) { panel.remove(); await openWalletPicker(); return; }
    const values = Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement).entries());
    const button = panel.querySelector<HTMLButtonElement>("button[type=submit]");
    if (button) button.disabled = true;
    try {
      const client = await ensureWriteClient();
      setScreenStatus("Submitting the record…", true);
      await submitWrite(client, "create", [String(values.record_id), String(values.app_id), String(values.store_url), String(values.policy_url), String(values.platform)], (hash) => {
        showTransactionEvidence(hash, "Create record");
        setScreenStatus("Submitted. Waiting for finalized confirmation and ledger readback…", true);
      });
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
  setScreenStatus("Loading records…", true);
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
      card.innerHTML = `<div class="record-card-heading"><div><p class="eyebrow"></p><h3></h3></div><span class="state-badge"></span></div><dl><div><dt>Record</dt><dd class="record-id"></dd></div><div><dt>Latest comparison</dt><dd class="verdict"></dd></div><div><dt>Revision</dt><dd class="revision"></dd></div></dl><div class="record-sources"><div class="source-row"><span class="source-type">App Store disclosure</span><a class="source-link store-source" target="_blank" rel="noreferrer"></a></div><div class="source-row"><span class="source-type">Publisher policy</span><a class="source-link policy-source" target="_blank" rel="noreferrer"></a></div></div><div class="record-timeline" aria-label="Record lifecycle"><span class="timeline-step draft-step">Draft</span><span class="timeline-connector"></span><span class="timeline-step frozen-step">Frozen</span><span class="timeline-connector"></span><span class="timeline-step assessed-step">Compared</span></div><div class="card-actions"></div>`;
      card.querySelector(".eyebrow")!.textContent = displayValue(field(record, "platform"));
      card.querySelector("h3")!.textContent = displayValue(field(record, "app_id"), id);
      card.querySelector(".record-id")!.textContent = id;
      card.querySelector(".state-badge")!.textContent = stateLabel(field(record, "state"));
      card.querySelector(".verdict")!.textContent = verdictLabel(field(record, "verdict"));
      card.querySelector(".revision")!.textContent = displayValue(field(record, "revision"), "0");
      const store = sourceUrl(field(record, "store_url"));
      const policy = sourceUrl(field(record, "policy_url"));
      for (const [selector, url] of [[".store-source", store], [".policy-source", policy]] as const) {
        const link = card.querySelector<HTMLAnchorElement>(selector)!;
        link.textContent = url === "Source unavailable" ? url : new URL(url).hostname;
        if (url !== "Source unavailable") link.href = url;
      }
      const lifecycle = ["DRAFT", "FROZEN", "ASSESSED"];
      const stateIndex = lifecycle.indexOf(stateLabel(field(record, "state")).toUpperCase() === "COMPARED" ? "ASSESSED" : displayValue(field(record, "state")));
      card.querySelectorAll<HTMLElement>(".timeline-step").forEach((step, index) => step.classList.toggle("is-complete", index <= stateIndex));
      const actions = card.querySelector<HTMLDivElement>(".card-actions")!;
      const state = displayValue(field(record, "state"));
      if (state === "DRAFT") actions.append(actionButton("Freeze sources", "freeze", id));
      if (state === "FROZEN") actions.append(actionButton("Compare sources", "assess", id));
      if (state === "ASSESSED") actions.append(actionButton("Run comparison again", "reassess", id));
      records.append(card);
      await renderAssessmentHistory(card, id, Number(field(record, "revision")) || 0);
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
    button.disabled = true;
    try {
      const client = await ensureWriteClient();
      setScreenStatus(`Submitting ${label.toLowerCase()}…`, true);
      await submitWrite(client, method, [recordId], (hash) => {
        showTransactionEvidence(hash, label);
        setScreenStatus("Submitted. Waiting for finalized confirmation and ledger readback…", true);
      });
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
