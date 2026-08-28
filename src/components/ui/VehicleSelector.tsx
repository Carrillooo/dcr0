"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BRANDS, MODELS, VERSIONS, YEARS, isComplete, type VehicleSelection } from "@/data/vehicles";
import { useCommerce, useExperience } from "@/lib/store";
import { PRODUCTS } from "@/data/products";

/* ---------------------------------------------------------------------------
 * Fitment, as an instrument rather than a form.
 *
 * Four stages that open one at a time. Each choice is a row on a rule, the
 * selected value stays visible above, and the whole thing writes its progress
 * into the canvas so the car behind resolves from a wireframe drawing into a
 * solid body as the selection completes.
 *
 * Still a real form underneath: proper radiogroups, keyboard operable, focus
 * visible. Premium is not a reason to break a fieldset.
 * ------------------------------------------------------------------------ */

const STAGES = ["brand", "model", "year", "version"] as const;
type StageKey = (typeof STAGES)[number];

const LABEL: Record<StageKey, string> = {
  brand: "Make",
  model: "Model",
  year: "Year",
  version: "Version",
};

export function VehicleSelector({ compact = false }: { compact?: boolean }) {
  const vehicle = useCommerce((s) => s.vehicle);
  const setVehicle = useCommerce((s) => s.setVehicle);
  const clearVehicle = useCommerce((s) => s.clearVehicle);
  const setVehicleProgress = useExperience((s) => s.setVehicleProgress);
  const root = useRef<HTMLDivElement>(null);

  const step = useMemo<StageKey>(() => {
    if (!vehicle.brand) return "brand";
    if (!vehicle.model) return "model";
    if (!vehicle.year) return "year";
    return "version";
  }, [vehicle]);

  const options = useMemo<string[]>(() => {
    if (step === "brand") return BRANDS.map((b) => b.id);
    if (step === "model") return MODELS[vehicle.brand!] ?? [];
    if (step === "year") return YEARS;
    return VERSIONS;
  }, [step, vehicle.brand]);

  const filled = STAGES.filter((s) => vehicle[s]).length;

  // Drive the 3D car: wireframe drawing → solid body as the selection resolves.
  useEffect(() => {
    setVehicleProgress(filled / STAGES.length);
  }, [filled, setVehicleProgress]);

  useGSAP(
    () => {
      gsap.fromTo(
        ".vs-opt",
        { opacity: 0, x: -18 },
        { opacity: 1, x: 0, duration: 0.55, ease: "power3.out", stagger: 0.035, overwrite: true },
      );
    },
    { dependencies: [step], scope: root },
  );

  const choose = (value: string) => {
    const next: VehicleSelection = { ...vehicle };
    if (step === "brand") {
      next.brand = value;
      next.model = null;
      next.year = null;
      next.version = null;
    } else if (step === "model") next.model = value;
    else if (step === "year") next.year = value;
    else next.version = value;
    setVehicle(next);
  };

  const back = (to: StageKey) => {
    const next: VehicleSelection = { ...vehicle };
    const i = STAGES.indexOf(to);
    STAGES.forEach((s, j) => {
      if (j >= i) next[s] = null;
    });
    setVehicle(next);
  };

  const label = (id: string) =>
    step === "brand" ? (BRANDS.find((b) => b.id === id)?.name ?? id) : id;

  return (
    <div ref={root} className={compact ? "" : "w-full"}>
      {/* Progress: four ticks on a rule. */}
      <div className="mb-8 flex items-center gap-2" aria-hidden>
        {STAGES.map((s, i) => (
          <span
            key={s}
            className="h-px flex-1 transition-colors duration-500"
            style={{ background: i < filled ? "#c8102e" : "rgb(242 242 240 / 0.12)" }}
          />
        ))}
      </div>

      {/* Chosen so far — each one clickable to step back. */}
      {filled > 0 && (
        <ul className="mb-10 flex flex-wrap gap-x-8 gap-y-2">
          {STAGES.filter((s) => vehicle[s]).map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => back(s)}
                className="group text-left"
                aria-label={`Change ${LABEL[s]}`}
              >
                <span className="t-mono block text-[9px] text-aluminium">{LABEL[s]}</span>
                <span className="font-display text-lg uppercase tracking-tight">
                  {s === "brand" ? label(vehicle.brand!) : vehicle[s]}
                </span>
                <span className="mt-0.5 block h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-400 group-hover:origin-left group-hover:scale-x-100" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {isComplete(vehicle) ? (
        <Complete onReset={clearVehicle} />
      ) : (
        <fieldset>
          <legend className="t-mono mb-6 text-accent">
            {String(filled + 1).padStart(2, "0")} — Select {LABEL[step].toLowerCase()}
          </legend>
          <div
            role="radiogroup"
            aria-label={LABEL[step]}
            className="grid gap-x-8 grid-cols-2 md:grid-cols-3"
          >
            {options.map((o) => (
              <button
                key={o}
                type="button"
                role="radio"
                aria-checked={false}
                onClick={() => choose(o)}
                data-cursor="Select"
                className="vs-opt group flex min-h-[3.25rem] items-center justify-between gap-3 border-b border-rule py-3 text-left transition-colors hover:border-rule-strong"
              >
                <span className="font-display min-w-0 break-words text-base uppercase leading-tight tracking-tight transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1.5 md:text-lg">
                  {label(o)}
                </span>
                <span className="t-mono text-aluminium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  →
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}

function Complete({ onReset }: { onReset: () => void }) {
  const vehicle = useCommerce((s) => s.vehicle);
  const count = useMemo(() => countFor(vehicle.brand), [vehicle.brand]);

  return (
    <div>
      <p className="t-mono text-accent">Match found</p>
      <p className="t-display mt-4 text-[10vw] leading-[0.88] md:text-[3.4vw]">
        {count} product{count === 1 ? "" : "s"} fit
        <br />
        <span className="text-aluminium">your car.</span>
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-8">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-4 border-b border-rule-strong pb-2"
          data-cursor="Enter"
        >
          <span className="t-mono">See what fits</span>
          <span className="block h-px w-10 bg-accent transition-all duration-500 group-hover:w-16" />
        </Link>
        <button type="button" onClick={onReset} className="t-mono text-aluminium hover:text-paper">
          Start again
        </button>
      </div>
    </div>
  );
}

function countFor(brand: string | null) {
  if (!brand) return 0;
  return PRODUCTS.filter((p) => p.fits.includes(brand)).length;
}
