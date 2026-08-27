"use client";

import { useSyncExternalStore } from "react";

/* ---------------------------------------------------------------------------
 * Hydration-safe reads of browser state.
 *
 * useSyncExternalStore rather than useState + useEffect: the server snapshot is
 * explicit, there is no cascading render on mount, and matchMedia changes are
 * subscribed properly instead of being sampled once.
 * ------------------------------------------------------------------------ */

const noop = () => () => {};

/** False during SSR and the first client render, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

const mqCache = new Map<string, MediaQueryList>();

function mq(query: string) {
  let m = mqCache.get(query);
  if (!m) {
    m = window.matchMedia(query);
    mqCache.set(query, m);
  }
  return m;
}

/** Live media query. Returns `serverValue` until hydrated. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const m = mq(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => mq(query).matches,
    () => serverValue,
  );
}

export function webglSupported() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
