"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { FiAlertTriangle } from "react-icons/fi";

/**
 * The consent gate for the pieces flagged `mature` in `data/site.ts`.
 *
 * One answer covers the whole tab rather than one answer per image. The flagged
 * pieces sit next to each other in the Love Elysium gallery, so a viewer paging
 * through the lightbox would otherwise be stopped nine times in a row. The
 * answer lives in `sessionStorage`: remembered while the tab is open, gone once
 * it is closed, so a shared machine never inherits someone else's decision.
 *
 * `declined` is deliberately distinct from `unknown`. Both keep the artwork
 * covered, but only `unknown` lets the lightbox open its warning by itself —
 * once a viewer has said no, meeting the next flagged piece must not shove the
 * same card in front of them again.
 */
export type MatureConsent = "unknown" | "granted" | "declined";

const STORAGE_KEY = "mature-consent";

/**
 * The stored answer, read through `useSyncExternalStore` rather than copied
 * into state by an effect. That is what lets the value be correct on the first
 * client render: React uses the server snapshot ("unknown", the covered state)
 * while hydrating and swaps in the real one immediately afterwards, so nothing
 * is uncovered by a render the server never agreed to.
 */
let cached: MatureConsent | null = null;
const listeners = new Set<() => void>();

const readConsent = (): MatureConsent => {
  if (cached) return cached;
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    cached = stored === "granted" || stored === "declined" ? stored : "unknown";
  } catch {
    // Storage can be refused outright (private mode, embedded webviews).
    // Losing the answer only costs one more question.
    cached = "unknown";
  }
  return cached;
};

const writeConsent = (answer: MatureConsent) => {
  cached = answer;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, answer);
  } catch {
    // See above — the in-memory copy still carries the answer for this page.
  }
  listeners.forEach((listener) => listener());
};

const subscribeConsent = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

/** The server has no session to read, and covered is the safe default. */
const serverConsent = (): MatureConsent => "unknown";

interface MatureGate {
  consent: MatureConsent;
  /** Record an answer that was given somewhere other than the dialog. */
  decide: (granted: boolean) => void;
  /** Open the confirmation dialog. Resolves with the viewer's answer. */
  confirm: () => Promise<boolean>;
}

const MatureGateContext = createContext<MatureGate | null>(null);

export function useMatureGate() {
  const gate = useContext(MatureGateContext);
  if (!gate) throw new Error("useMatureGate must be used inside <MatureGateProvider>");
  return gate;
}

/**
 * The warning itself. Shared markup so the dialog on the gallery page and the
 * prompt inside the lightbox are the same object to the viewer, even though one
 * is a modal and the other is an overlay on the slide.
 */
export function MatureNotice({ titleId, onConfirm, onDismiss }: { titleId?: string; onConfirm: () => void; onDismiss: () => void }) {
  return <div className="mature-notice">
    <FiAlertTriangle aria-hidden="true" />
    <strong id={titleId}>Mature Content</strong>
    <p>This piece is meant for an adult audience. Confirm that you want to see it.</p>
    <span className="mature-notice-actions">
      {/* The safe answer is the one that takes focus — a stray Enter should
          never be what uncovers the artwork. */}
      <button type="button" className="mature-button is-quiet" data-mature-autofocus onClick={onDismiss}>Keep hidden</button>
      <button type="button" className="mature-button" onClick={onConfirm}>I am 18+, show it</button>
    </span>
    <small>Remembered until you close this tab.</small>
  </div>;
}

export function MatureGateProvider({ children }: { children: ReactNode }) {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, serverConsent);
  const [asking, setAsking] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pending = useRef<((granted: boolean) => void) | null>(null);

  const decide = useCallback((granted: boolean) => writeConsent(granted ? "granted" : "declined"), []);

  const settle = useCallback((granted: boolean) => {
    decide(granted);
    pending.current?.(granted);
    pending.current = null;
    setAsking(false);
  }, [decide]);

  const confirm = useCallback(() => new Promise<boolean>((resolve) => {
    // A second request arriving while one is open replaces it; the first caller
    // is answered "no" so its `await` never dangles.
    pending.current?.(false);
    pending.current = resolve;
    setAsking(true);
  }), []);

  // `showModal` is what puts the dialog in the top layer, above anything else on
  // the page without the two having to agree on a z-index, and brings the focus
  // trap, Escape handling and focus restoration with it. The button is focused
  // by hand because the dialog is still `display: none` while React mounts its
  // children, which is too early for the `autofocus` attribute to take.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (asking && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLButtonElement>("[data-mature-autofocus]")?.focus();
    }
    if (!asking && dialog.open) dialog.close();
  }, [asking]);

  const gate = useMemo(() => ({ consent, decide, confirm }), [consent, decide, confirm]);

  return <MatureGateContext.Provider value={gate}>
    {children}
    <dialog
      ref={dialogRef}
      className="mature-dialog"
      aria-labelledby="mature-dialog-title"
      onCancel={() => settle(false)}
      // A click whose target is the dialog element itself landed on the
      // backdrop: the card is a child, so anything inside it stops there.
      onClick={(event) => { if (event.target === dialogRef.current) settle(false); }}
    >
      {/* Mounted only while open so the focus call above always has a fresh
          button to aim at. */}
      {asking && <MatureNotice titleId="mature-dialog-title" onConfirm={() => settle(true)} onDismiss={() => settle(false)} />}
    </dialog>
  </MatureGateContext.Provider>;
}
