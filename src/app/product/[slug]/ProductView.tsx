"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { formatPrice, type Product } from "@/data/products";
import { vehicleLabel } from "@/data/vehicles";
import { useCommerce, useExperience, type CanvasFinish } from "@/lib/store";
import { Scene } from "@/components/ui/Scene";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { VehicleSelector } from "@/components/ui/VehicleSelector";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---------------------------------------------------------------------------
 * The product page is an interactive studio, then a story.
 *
 * Above the fold it is a working commerce page: the object on the left in the
 * live canvas, everything you need to buy on the right, nothing in the way.
 * Below the fold the scroll takes over and the same object is disassembled,
 * examined and fitted.
 * ------------------------------------------------------------------------ */

const MOOD = {
  interior: "soft",
  exterior: "contrast",
  lighting: "emissive",
  technology: "clinical",
  protection: "industrial",
} as const;

export function ProductView({ product, related }: { product: Product; related: Product[] }) {
  const [variant, setVariant] = useState(product.variants?.[0]?.id);
  const [added, setAdded] = useState(false);
  const add = useCommerce((s) => s.add);
  const vehicle = useCommerce((s) => s.vehicle);
  const saved = useCommerce((s) => s.saved);
  const toggleSaved = useCommerce((s) => s.toggleSaved);
  const setExplode = useExperience((s) => s.setExplode);

  const finish: CanvasFinish =
    (variant as CanvasFinish) && ["graphite", "silver", "red", "carbon"].includes(variant ?? "")
      ? (variant as CanvasFinish)
      : product.category === "exterior"
        ? "carbon"
        : "graphite";

  const fits = vehicle.brand ? product.fits.includes(vehicle.brand) : null;
  const isSaved = saved.includes(product.slug);

  const onAdd = () => {
    add(product.slug, variant);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <>
      <Scene
        scene="product"
        finish={finish}
        mood={MOOD[product.category]}
        glow={product.category === "lighting" ? 3.4 : 1}
        offsetX={-1.15}
      />

      {/* ── Studio + buy ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen pt-[var(--nav-h)]">
        <div className="mx-auto grid max-w-[1800px] gap-8 px-5 md:px-10 lg:grid-cols-12">
          {/* Left: intentionally empty. The object lives in the canvas behind
              this column; painting a panel here would hide it. */}
          <div className="relative hidden min-h-[80vh] lg:col-span-7 lg:block" aria-hidden>
            <span className="t-mono absolute bottom-10 right-0 text-aluminium">
              Drag to rotate · Scroll to disassemble
            </span>
          </div>

          {/* Mobile keeps the live object — it just gets its own viewport band
              above the buy column rather than a 65% side panel. */}
          <div className="relative h-[52vh] lg:hidden" aria-hidden>
            <span className="t-mono absolute bottom-3 right-0 text-aluminium">
              Drag to rotate
            </span>
          </div>

          <div className="py-6 lg:col-span-4 lg:col-start-9 lg:py-[12vh]">
            <p className="t-mono text-accent">{product.line}</p>
            <h1 className="t-display mt-3 text-[13vw] leading-[0.86] md:text-[4vw]">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-snug text-paper/85">{product.tagline}</p>

            <p className="t-mono mt-8 text-2xl tabular-nums text-paper">
              {formatPrice(product.price)}
            </p>

            {product.variants && (
              <fieldset className="mt-9">
                <legend className="t-mono mb-4 text-aluminium">Finish</legend>
                <div role="radiogroup" aria-label="Finish" className="flex gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      role="radio"
                      aria-checked={variant === v.id}
                      aria-label={v.label}
                      onClick={() => setVariant(v.id)}
                      data-cursor={v.label}
                      className="group relative flex flex-col items-center gap-2"
                    >
                      <span
                        className="block h-9 w-9 border transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                        style={{
                          background: v.hex,
                          borderColor: variant === v.id ? "#f2f2f0" : "rgb(242 242 240 / 0.18)",
                        }}
                      />
                      <span
                        className={`t-mono text-[9px] transition-colors ${variant === v.id ? "text-paper" : "text-aluminium"}`}
                      >
                        {v.label}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Fitment, stated plainly. */}
            <div className="mt-9 border-t border-rule pt-5">
              <p className="t-mono mb-3 text-aluminium">Compatibility</p>
              {fits === null ? (
                <details className="group">
                  <summary className="t-mono cursor-pointer list-none border-b border-rule-strong pb-2 text-paper marker:hidden">
                    Select your vehicle to check
                    <span className="ml-3 inline-block text-accent transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="pt-8">
                    <VehicleSelector compact />
                  </div>
                </details>
              ) : (
                <p className="flex items-center gap-3">
                  <span
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{ background: fits ? "#5fbf7f" : "#c8102e" }}
                  />
                  <span className="font-display text-lg uppercase tracking-tight">
                    {fits ? "Compatible" : "Not compatible"}
                  </span>
                  <span className="t-mono text-aluminium">{vehicleLabel(vehicle)}</span>
                </p>
              )}
            </div>

            <div className="mt-9 flex flex-col gap-3">
              <button
                type="button"
                onClick={onAdd}
                disabled={product.stock === 0}
                data-cursor="Add"
                className="group relative w-full overflow-hidden border border-paper px-6 py-4 text-center disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-paper transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100 group-disabled:hidden" />
                <span className="t-mono relative transition-colors duration-300 group-hover:text-ground">
                  {added ? "Added to cart" : product.stock === 0 ? "Out of stock" : "Add to cart"}
                </span>
              </button>

              <div className="flex gap-3">
                <Link
                  href="/checkout"
                  onClick={() => add(product.slug, variant)}
                  className="flex-1 border border-rule-strong px-6 py-4 text-center transition-colors hover:border-paper"
                >
                  <span className="t-mono">Buy now</span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleSaved(product.slug)}
                  aria-pressed={isSaved}
                  className="border border-rule-strong px-5 py-4 transition-colors hover:border-paper"
                >
                  <span className="t-mono">{isSaved ? "Saved" : "Save"}</span>
                </button>
              </div>

              <p className="t-mono mt-2 text-aluminium">
                {product.stock > 0 ? `${product.stock} in stock` : "Back in 3 weeks"} · Free EU
                shipping over €200 · 30-day returns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Story ──────────────────────────────────────────────────────── */}
      <Story product={product} setExplode={setExplode} />

      {/* ── Specification ──────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-rule bg-ground py-20 md:py-28">
        <div className="mx-auto max-w-[1800px] px-5 md:px-10">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal as="p" className="t-mono text-accent">
                Specification
              </Reveal>
              <Reveal as="h2" className="t-display mt-4 text-[11vw] leading-[0.86] md:text-[3.4vw]">
                The numbers.
              </Reveal>
            </div>

            <RevealGroup className="grid gap-x-10 gap-y-0 md:col-span-7 md:col-start-6 md:grid-cols-2">
              {product.specs.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between border-b border-rule py-4">
                  <span className="t-mono text-aluminium">{s.label}</span>
                  <span className="t-mono tabular-nums text-paper">{s.value}</span>
                </div>
              ))}
            </RevealGroup>
          </div>

          <div className="mt-20 grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="t-mono mb-6 text-aluminium">Materials</p>
              <ul className="space-y-3">
                {product.materials.map((m) => (
                  <li key={m} className="rail-tick relative pl-8 text-paper/85">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <p className="t-mono mb-6 text-aluminium">Features</p>
              <ul className="space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="rail-tick relative pl-8 text-paper/85">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Installation ───────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-rule bg-graphite py-20 md:py-28">
        <div className="mx-auto max-w-[1800px] px-5 md:px-10">
          <Reveal as="p" className="t-mono text-accent">
            Installation
          </Reveal>
          <Reveal as="h2" className="t-display mt-4 text-[12vw] leading-[0.86] md:text-[4vw]">
            Four steps.
            <br />
            <span className="text-aluminium">No specialist tools.</span>
          </Reveal>

          <RevealGroup className="mt-14 grid gap-8 md:grid-cols-4">
            {product.install.map((s) => (
              <div key={s.step} className="border-t border-rule pt-5">
                <span className="t-mono text-accent">{s.step}</span>
                <p className="font-display mt-2 text-2xl uppercase tracking-tight">{s.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-paper/70">{s.detail}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {related.length > 0 && (
        <section className="relative z-10 border-t border-rule bg-ground py-20 md:py-28">
          <div className="mx-auto max-w-[1800px] px-5 md:px-10">
            <Reveal as="p" className="t-mono mb-12 text-aluminium">
              Also in this world
            </Reveal>
            <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Scroll takes the object apart. Pinned, scrubbed, with the callouts arriving
 * as their component separates.
 * ------------------------------------------------------------------------ */

function Story({ product, setExplode }: { product: Product; setExplode: (n: number) => void }) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const beats = Array.from(
        section.current?.querySelectorAll<HTMLElement>("[data-beat]") ?? [],
      ).map((el) => ({
        el,
        from: parseFloat(el.dataset.from ?? "0"),
        to: parseFloat(el.dataset.to ?? "1"),
      }));

      beats.forEach((b) => gsap.set(b.el, { opacity: 0, y: 18 }));

      const t = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "+=340%",
        pin: ".pv-sticky",
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          // Out and back: it assembles again before you leave.
          setExplode(smooth(0.06, 0.66, p) - smooth(0.82, 1, p) * 0.98);

          for (const b of beats) {
            const span = b.to - b.from;
            const inT = clamp((p - b.from) / (span * 0.25));
            const outT = clamp((p - (b.to - span * 0.25)) / (span * 0.25));
            const v = inT * (1 - outT);
            const e = v * v * (3 - 2 * v);
            b.el.style.opacity = String(e);
            b.el.style.transform = `translate3d(0,${(1 - e) * 18}px,0)`;
            b.el.style.visibility = e > 0.004 ? "visible" : "hidden";
          }
        },
        onLeave: () => setExplode(0),
        onLeaveBack: () => setExplode(0),
      });

      return () => t.kill();
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative" style={{ height: "440vh" }}>
      <div className="pv-sticky relative h-screen overflow-hidden">
        <div className="mx-auto flex h-full max-w-[1800px] flex-col justify-between px-5 py-[12vh] md:px-10">
          <div data-beat data-from="0" data-to="0.14">
            <p className="t-mono text-accent">Built with precision</p>
            <h2 className="t-display mt-3 text-[12vw] leading-[0.86] md:text-[4.5vw]">
              Six components.
            </h2>
          </div>

          <div className="relative flex-1">
            {product.parts.map((part, i) => {
              const from = 0.12 + i * 0.105;
              return (
                <div
                  key={part.id}
                  data-beat
                  data-from={from}
                  data-to={from + 0.14}
                  className="absolute right-0 top-1/2 w-[64vw] -translate-y-1/2 text-right md:w-[26vw]"
                  style={{ opacity: 0, visibility: "hidden" }}
                >
                  <div className="flex items-start justify-end gap-4">
                    <div>
                      <span className="t-mono block text-paper">{part.label}</span>
                      <span className="t-mono mt-1 block text-[9px] text-aluminium">{part.note}</span>
                    </div>
                    <span className="t-mono shrink-0 text-accent">{part.index}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div data-beat data-from="0.84" data-to="1" style={{ opacity: 0, visibility: "hidden" }}>
            <p className="t-display text-[10vw] leading-[0.88] md:text-[3.6vw]">
              {product.statement}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
