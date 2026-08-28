"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EMPTY_VEHICLE, type VehicleSelection } from "@/data/vehicles";
import { getProduct } from "@/data/products";

/* ---------------------------------------------------------------------------
 * One store shared by DOM and WebGL. The canvas never reads React props for
 * per-frame values — it reads these, and damps toward them inside useFrame.
 * ------------------------------------------------------------------------ */

export type SceneKey = "home" | "product" | "vehicle" | "shop" | "editorial" | "void";

/** Acts of the home narrative. Each one owns a camera behaviour and a mood. */
export type StageId =
  | "reveal"
  | "explode"
  | "worlds"
  | "context"
  | "engineering"
  | "studio"
  | "idle";

export type CanvasFinish = "graphite" | "silver" | "red" | "carbon";
export type CanvasMood = "soft" | "contrast" | "emissive" | "clinical" | "industrial";

type Experience = {
  loaded: boolean;
  setLoaded: (v: boolean) => void;

  scene: SceneKey;
  setScene: (s: SceneKey) => void;

  /** Slug of the product the canvas should be showing, if any. */
  activeProduct: string | null;
  setActiveProduct: (s: string | null) => void;

  /** Which act of the narrative the canvas is playing, and how far through it. */
  stage: StageId;
  narrative: number;
  setStage: (s: StageId, n: number) => void;
  setNarrative: (n: number) => void;

  /** 0→1 exploded amount, independent of narrative so the product page can drive it too. */
  explode: number;
  setExplode: (n: number) => void;

  /** Canvas dressing owned by whichever route is mounted. */
  finish: CanvasFinish;
  mood: CanvasMood;
  glow: number;
  offsetX: number;
  setDressing: (d: Partial<{ finish: CanvasFinish; mood: CanvasMood; glow: number; offsetX: number }>) => void;

  /** 0→1 completeness of the vehicle selection, drawn by VehicleScene. */
  vehicleProgress: number;
  setVehicleProgress: (n: number) => void;

  menuOpen: boolean;
  toggleMenu: (v?: boolean) => void;

  sound: boolean;
  toggleSound: () => void;

  cursor: string | null;
  setCursor: (label: string | null) => void;
};

export const useExperience = create<Experience>((set) => ({
  loaded: false,
  setLoaded: (loaded) => set({ loaded }),
  scene: "home",
  setScene: (scene) => set({ scene }),
  stage: "reveal",
  setStage: (stage, narrative) => set({ stage, narrative }),
  activeProduct: null,
  setActiveProduct: (activeProduct) => set({ activeProduct }),
  narrative: 0,
  setNarrative: (narrative) => set({ narrative }),
  explode: 0,
  setExplode: (explode) => set({ explode }),
  finish: "graphite",
  mood: "soft",
  glow: 1,
  offsetX: 0,
  setDressing: (d) => set(d),
  vehicleProgress: 0,
  setVehicleProgress: (vehicleProgress) => set({ vehicleProgress }),
  menuOpen: false,
  toggleMenu: (v) => set((s) => ({ menuOpen: v ?? !s.menuOpen })),
  sound: false,
  toggleSound: () => set((s) => ({ sound: !s.sound })),
  cursor: null,
  setCursor: (cursor) => set({ cursor }),
}));

/* --- Commerce ----------------------------------------------------------- */

export type CartLine = { slug: string; qty: number; variant?: string };

type Commerce = {
  lines: CartLine[];
  add: (slug: string, variant?: string) => void;
  remove: (slug: string, variant?: string) => void;
  setQty: (slug: string, qty: number, variant?: string) => void;
  clear: () => void;

  vehicle: VehicleSelection;
  setVehicle: (v: VehicleSelection) => void;
  clearVehicle: () => void;

  saved: string[];
  toggleSaved: (slug: string) => void;
};

const sameLine = (l: CartLine, slug: string, variant?: string) =>
  l.slug === slug && (l.variant ?? null) === (variant ?? null);

/* Commerce state survives a reload. A cart that empties when someone refreshes
   — or a fitment selection they have to make again on every page — is broken
   commerce, however good the rest of the site looks.

   Everything read from this store is behind `useHydrated()` in the components,
   so rehydrating from localStorage cannot desynchronise the server markup from
   the first client paint. */
export const useCommerce = create<Commerce>()(
  persist(
    (set) => ({
      lines: [],
      add: (slug, variant) =>
        set((s) => {
          const found = s.lines.find((l) => sameLine(l, slug, variant));
          return {
            lines: found
              ? s.lines.map((l) => (sameLine(l, slug, variant) ? { ...l, qty: l.qty + 1 } : l))
              : [...s.lines, { slug, qty: 1, variant }],
          };
        }),
      remove: (slug, variant) =>
        set((s) => ({ lines: s.lines.filter((l) => !sameLine(l, slug, variant)) })),
      setQty: (slug, qty, variant) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (sameLine(l, slug, variant) ? { ...l, qty } : l))
            .filter((l) => l.qty > 0),
        })),
      clear: () => set({ lines: [] }),

      vehicle: EMPTY_VEHICLE,
      setVehicle: (vehicle) => set({ vehicle }),
      clearVehicle: () => set({ vehicle: EMPTY_VEHICLE }),

      saved: [],
      toggleSaved: (slug) =>
        set((s) => ({
          saved: s.saved.includes(slug) ? s.saved.filter((x) => x !== slug) : [...s.saved, slug],
        })),
    }),
    {
      name: "dcro-commerce",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Only the durable parts. Actions are recreated on every load.
      partialize: (s) => ({ lines: s.lines, vehicle: s.vehicle, saved: s.saved }),
    },
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);

export const cartTotal = (lines: CartLine[]) =>
  lines.reduce((n, l) => n + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
