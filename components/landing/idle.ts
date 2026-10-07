/** Runs `fn` when the browser is idle, so decorative work never competes with the first paint. Returns a cancel function. */
export function onIdle(fn: () => void): () => void {
  // Safari has no requestIdleCallback.
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(fn, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 300);
  return () => clearTimeout(id);
}
