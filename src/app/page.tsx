"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Act, Beat, Rail } from "@/components/home/Act";
import { SceneGate } from "@/components/home/SceneGate";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { CATEGORIES, PRODUCTS, featured, getProduct } from "@/data/products";
import { Magnetic } from "@/components/ui/Magnetic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HERO = getProduct("dcro-one-shift-module")!;

export default function Home() {
  return (
    <>
      {/* ────────────────────────────────────────────────────────────────────
          ACT 01 — REVEAL
          A light crosses a black stage and finds an object. Nothing else
          happens for three screens, which is the point: the restraint is what
          makes the second act land.
      ──────────────────────────────────────────────────────────────────── */}
      <Act id="reveal" length={3} label="Reveal">
        <Rail index="01" title="Reveal" note="Light finds the object" />

        <Beat from={0} to={0.26} y={0} className="absolute inset-x-5 top-[22vh] md:inset-x-10">
          <div className="mx-auto max-w-[1800px]">
            <p className="t-mono text-accent">Engineered for automotive</p>
            <p className="t-display mt-4 text-[9vw] leading-[0.9] md:text-[3.2vw]">
              One part
              <br />
              <span className="text-aluminium">at a time.</span>
            </p>
          </div>
        </Beat>

        <Beat from={0} to={0.24} y={0} className="absolute inset-x-0 bottom-16 flex justify-center">
          <span className="t-mono text-aluminium">
            Scroll<span className="mx-3 inline-block h-px w-8 translate-y-[-4px] bg-rule-strong" />to begin
          </span>
        </Beat>

        <Beat
          from={0.22}
          to={0.72}
          y={40}
          className="absolute inset-x-0 top-[14vh] px-5 text-center md:px-10"
        >
          <h1 className="t-display text-[15vw] leading-[0.84] md:text-[8.5vw]">
            DCRO
            <br />
            <span className="text-aluminium">Automotive</span>
            <br />
            Redefined
          </h1>
        </Beat>

        <Beat
          from={0.68}
          to={1}
          hold
          y={30}
          className="absolute inset-x-0 bottom-[12vh] px-5 md:px-10"
        >
          <div className="mx-auto flex max-w-[1800px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="t-mono text-accent">{HERO.parts.length} components · 1 billet</p>
              <p className="font-display mt-2 text-3xl uppercase leading-none tracking-tight md:text-5xl">
                {HERO.name}
              </p>
              <p className="t-mono mt-2 text-aluminium">{HERO.line}</p>
            </div>
            <Magnetic>
              <Link
                href="/shop"
                data-cursor="Explore"
                className="group inline-flex items-center gap-4 border-b border-rule-strong pb-2"
              >
                <span className="t-mono text-paper">Explore products</span>
                <span className="block h-px w-10 bg-accent transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-16" />
              </Link>
            </Magnetic>
          </div>
        </Beat>
      </Act>

      {/* ────────────────────────────────────────────────────────────────────
          ACT 02 — EXPLODED VIEW
          The product separates into its six components as you scroll, each one
          calling itself out, then reassembles. An engineering film, not an
          animation.
      ──────────────────────────────────────────────────────────────────── */}
      <Act id="explode" length={4} label="Exploded view">
        <Rail index="02" title="Exploded" note="Six components" />

        <Beat from={0} to={0.22} y={34} className="absolute inset-x-0 top-[12vh] px-5 md:px-10">
          <h2 className="t-display text-[12vw] leading-[0.86] md:text-[6vw]">
            Built from
            <br />
            six parts.
          </h2>
        </Beat>

        {/* Each callout owns a slice of the act's timeline. */}
        {HERO.parts.map((part, i) => {
          const from = 0.16 + i * 0.115;
          return (
            <Beat
              key={part.id}
              from={from}
              // Spans never exceed the spacing, so exactly one callout is
              // legible at a time instead of three crossfading into mud.
              to={from + 0.108}
              y={14}
              className="absolute inset-x-5 bottom-[14vh] text-left md:inset-x-auto md:right-10 md:top-1/2 md:w-[30vw] md:-translate-y-1/2 md:text-right"
            >
              <div className="flex items-start gap-4 md:justify-end">
                <span className="t-mono shrink-0 text-accent md:order-2">{part.index}</span>
                <div className="md:order-1">
                  <span className="t-mono block text-paper">{part.label}</span>
                  <span className="t-mono mt-1 block text-[9px] text-aluminium">{part.note}</span>
                </div>
              </div>
            </Beat>
          );
        })}

        <Beat from={0.86} to={1} hold y={24} className="absolute inset-x-0 bottom-[12vh] px-5 md:px-10">
          <p className="t-display text-[9vw] leading-[0.9] md:text-[4vw]">
            And back together.
          </p>
        </Beat>
      </Act>

      {/* ────────────────────────────────────────────────────────────────────
          ACT 03 — THE FIVE WORLDS
          Categories are not a filter row. Each one changes the light, the
          material and the mood of the same stage.
      ──────────────────────────────────────────────────────────────────── */}
      <Act id="worlds" length={5} label="Categories">
        <Rail index="03" title="Worlds" note="Five environments" />

        {CATEGORIES.map((c, i) => {
          const from = i * 0.2;
          return (
            <Beat
              key={c.slug}
              from={from}
              to={from + 0.2}
              y={40}
              className="absolute inset-x-0 bottom-[14vh] px-5 md:px-10"
            >
              <div className="mx-auto flex max-w-[1800px] flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="t-mono text-accent">{c.index}</span>
                  <h2 className="t-display mt-3 text-[16vw] leading-[0.82] md:text-[7vw]">
                    {c.name}
                  </h2>
                </div>
                <div className="md:max-w-sm md:pb-3">
                  <p className="text-lg leading-snug text-paper/80">{c.mood}</p>
                  <p className="t-mono mt-4 text-aluminium">{c.materials}</p>
                  <Link
                    href={`/shop/${c.slug}`}
                    data-cursor="Enter"
                    className="group mt-6 inline-flex items-center gap-3 border-b border-rule-strong pb-2"
                  >
                    <span className="t-mono">Enter {c.name}</span>
                    <span className="block h-px w-8 bg-accent transition-all duration-500 group-hover:w-14" />
                  </Link>
                </div>
              </div>
            </Beat>
          );
        })}
      </Act>

      {/* ────────────────────────────────────────────────────────────────────
          ACT 04 — IN CONTEXT
          The camera descends into the cabin and the product is already fitted.
      ──────────────────────────────────────────────────────────────────── */}
      <Act id="context" length={3} label="In the car">
        <Rail index="04" title="Context" note="Installed, not added" />

        <Beat from={0} to={0.34} y={34} className="absolute inset-x-0 top-[14vh] px-5 text-center md:px-10">
          <h2 className="t-display text-[13vw] leading-[0.86] md:text-[6.5vw]">
            It only counts
            <br />
            in the car.
          </h2>
        </Beat>

        <Beat from={0.42} to={0.78} y={20} className="absolute left-5 top-1/2 -translate-y-1/2 md:left-10">
          <p className="t-mono mb-3 text-accent">Fitment</p>
          <p className="max-w-xs text-lg leading-snug text-paper/85">
            Machined to the factory thread. No adapters showing, no gap at the collar,
            no movement after a year.
          </p>
        </Beat>

        <Beat from={0.8} to={1} hold y={24} className="absolute inset-x-0 bottom-[12vh] px-5 md:px-10">
          <div className="mx-auto flex max-w-[1800px] items-end justify-between">
            <div>
              <p className="t-mono text-aluminium">Shown fitted</p>
              <p className="font-display text-2xl uppercase leading-none tracking-tight md:text-4xl">
                {HERO.name}
              </p>
            </div>
            <Magnetic>
              <Link
                href={`/product/${HERO.slug}`}
                data-cursor="Open"
                className="group inline-flex items-center gap-4 border-b border-rule-strong pb-2"
              >
                <span className="t-mono">View product</span>
                <span className="block h-px w-10 bg-accent transition-all duration-500 group-hover:w-16" />
              </Link>
            </Magnetic>
          </div>
        </Beat>
      </Act>

      {/* ────────────────────────────────────────────────────────────────────
          ACT 05 — ENGINEERED DIFFERENTLY
          Macro. The camera closes to almost nothing, then goes through the cap
          and cuts out of the narrative entirely.
      ──────────────────────────────────────────────────────────────────── */}
      <Act id="engineering" length={3} label="Engineering">
        <Rail index="05" title="Engineering" note="Macro" />

        <Beat from={0} to={0.26} y={34} className="absolute inset-x-0 top-[13vh] px-5 md:px-10">
          <h2 className="t-display text-[13vw] leading-[0.84] md:text-[6.5vw]">
            Engineered
            <br />
            <span className="text-aluminium">differently.</span>
          </h2>
        </Beat>

        {[
          { k: "Automotive grade", v: "Tested to the same standard as the parts around it" },
          { k: "Precision fit", v: "±0.02 mm across the whole production run" },
          { k: "Tested materials", v: "2 000 hours of UV, salt and thermal cycling" },
          { k: "Built for daily use", v: "Not a show part. A part." },
        ].map((s, i) => {
          const from = 0.24 + i * 0.13;
          return (
            <Beat
              key={s.k}
              from={from}
              to={from + 0.17}
              y={18}
              className="absolute inset-x-5 bottom-[16vh] md:inset-x-10"
            >
              <div className="mx-auto max-w-[1800px]">
                <span className="t-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-display mt-2 text-3xl uppercase leading-none tracking-tight md:text-6xl">
                  {s.k}
                </p>
                <p className="t-mono mt-3 max-w-md text-aluminium">{s.v}</p>
              </div>
            </Beat>
          );
        })}
      </Act>

      {/* ────────────────────────────────────────────────────────────────────
          From here the canvas switches off and the page becomes typographic.
          The cut out of the 3D is deliberate — it gives the eye somewhere to
          rest before the product grid.
      ──────────────────────────────────────────────────────────────────── */}
      <SceneGate>
        <FeaturedRail />
        <VehicleCall />
        <Statement />
        <ShopCall />
      </SceneGate>
    </>
  );
}

/* ---------------------------------------------------------------------------
 * SCENE 07 — Featured products, as a horizontal travelling shot driven by
 * vertical scroll. Not a grid.
 * ------------------------------------------------------------------------ */

function FeaturedRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const items = featured();

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      // Desktop: vertical scroll drives a horizontal travelling shot.
      mm.add("(min-width: 768px)", () => {
        const tween = gsap.to(el, {
          x: () => -(el.scrollWidth - window.innerWidth + 80),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${el.scrollWidth - window.innerWidth + 80}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        return () => tween.kill();
      });

      // Touch: a real horizontal scroller with snap. Hijacking vertical scroll
      // into horizontal movement feels wrong on a phone, every time.
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative overflow-hidden bg-ground py-24 md:py-0">
      <div className="md:flex md:h-screen md:flex-col md:justify-center">
        <div className="mb-10 px-5 md:mb-14 md:px-10">
          <Reveal as="p" className="t-mono text-accent">
            06 — Selected
          </Reveal>
          <Reveal as="h2" className="t-display mt-4 text-[13vw] leading-[0.86] md:text-[5vw]">
            Four we would fit
            <br />
            to our own cars.
          </Reveal>
        </div>

        <div
          ref={track}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:snap-none md:overflow-visible md:px-10 md:pb-0"
        >
          {items.map((p, i) => (
            <div
              key={p.slug}
              className="w-[76vw] shrink-0 snap-start md:w-[34vw] lg:w-[26vw]"
            >
              <ProductCard product={p} index={i} />
            </div>
          ))}
          <div className="hidden w-[10vw] shrink-0 md:block" />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * SCENE 08 — Vehicle compatibility, given the weight it deserves. This is the
 * thing DCRO has that a general accessory shop does not.
 * ------------------------------------------------------------------------ */

function VehicleCall() {
  return (
    <section className="relative border-t border-rule bg-graphite">
      <div className="mx-auto grid max-w-[1800px] gap-10 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36">
        <div className="md:col-span-7">
          <Reveal as="p" className="t-mono text-accent">
            07 — Fitment
          </Reveal>
          <Reveal as="h2" className="t-display mt-5 text-[12vw] leading-[0.84] md:text-[6vw]">
            Tell us
            <br />
            what you drive.
          </Reveal>
        </div>

        <div className="flex flex-col justify-end md:col-span-4 md:col-start-9">
          <p className="t-body">
            Every product on this site knows which cars it fits. Select yours once and the
            whole catalogue filters itself — no cross-referencing part numbers, no guessing
            from a photograph.
          </p>
          <Magnetic>
            <Link
              href="/vehicle"
              data-cursor="Select"
              className="group mt-8 inline-flex items-center gap-4 border-b border-rule-strong pb-2"
            >
              <span className="t-mono">Select your vehicle</span>
              <span className="block h-px w-10 bg-accent transition-all duration-500 group-hover:w-16" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * SCENE 09 — Brand statement. Type only, held long.
 * ------------------------------------------------------------------------ */

function Statement() {
  return (
    <section className="relative flex min-h-[80vh] items-center border-t border-rule bg-ground">
      <div className="mx-auto w-full max-w-[1800px] px-5 md:px-10">
        <Reveal as="p" className="t-mono mb-8 text-aluminium">
          08 — Position
        </Reveal>
        <Reveal as="p" className="t-display text-[13vw] leading-[0.84] md:text-[7vw]" y={90}>
          Precision
        </Reveal>
        <Reveal as="p" className="t-display text-[13vw] leading-[0.84] text-aluminium md:text-[7vw]" y={90} delay={0.08}>
          you can feel.
        </Reveal>
        <RevealGroup className="mt-14 grid gap-8 border-t border-rule pt-10 md:grid-cols-3">
          {[
            ["Designed", "In-house, from the fitment outward. Never styled onto an existing part."],
            ["Machined", "EU suppliers we have visited. Tolerances we can hold, on paper and in the hand."],
            ["Tested", "On real cars, through real winters, before anything gets a part number."],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="t-mono text-accent">{k}</p>
              <p className="mt-3 text-paper/75">{v}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * SCENE 10 — Shop. One line, one link, no giant button.
 * ------------------------------------------------------------------------ */

function ShopCall() {
  return (
    <section className="relative border-t border-rule bg-ground py-24 md:py-40">
      <div className="mx-auto max-w-[1800px] px-5 md:px-10">
        <Reveal as="p" className="t-mono text-accent">
          09 — Catalogue
        </Reveal>
        <Link
          href="/shop"
          data-cursor="Enter"
          className="group mt-6 block"
        >
          <h2 className="t-display text-[14vw] leading-[0.84] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-4 md:text-[9vw]">
            {PRODUCTS.length} products.
            <br />
            <span className="text-aluminium transition-colors group-hover:text-paper">
              One standard.
            </span>
          </h2>
          <span className="mt-8 flex items-center gap-4">
            <span className="t-mono">Enter the shop</span>
            <span className="block h-px w-14 bg-accent transition-all duration-500 group-hover:w-28" />
          </span>
        </Link>
      </div>
    </section>
  );
}
