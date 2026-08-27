"use client";

import Link from "next/link";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { Scene } from "@/components/ui/Scene";

/* ---------------------------------------------------------------------------
 * Editorial, not corporate. A documentary spread: one enormous opening
 * statement, a text column set against a wide margin, chapter rules, and
 * numbers that carry the argument instead of stock photography of a meeting.
 *
 * Its own composition again — asymmetric text column, no cards anywhere.
 * ------------------------------------------------------------------------ */

const CHAPTERS = [
  {
    n: "01",
    k: "Design",
    lead: "We start at the fitment and work outward.",
    body: "Most accessories are styled first and made to fit afterwards, which is why they sit proud of the trim and why the gaps never close. We take the mounting point as the first constraint and let the form follow it. It is slower, and it is the only way the part ends up looking like it was always there.",
  },
  {
    n: "02",
    k: "Function",
    lead: "A part that only looks good is a failed part.",
    body: "Every product has to survive a European winter, a car wash, a summer dashboard at 70°C and somebody's keys. If a finish cannot take that, we do not ship the finish. We would rather sell three products that last than thirty that photograph well.",
  },
  {
    n: "03",
    k: "Culture",
    lead: "We are not tuning. We are not OEM either.",
    body: "There is a space between the factory part and the aftermarket part where almost nobody works: the same restraint as the original, with the care of something made in small numbers. That is the whole brief. No decals, no fake vents, nothing that shouts.",
  },
  {
    n: "04",
    k: "Quality",
    lead: "Tolerances we can hold, on paper and in the hand.",
    body: "We machine in the EU with suppliers we have visited. Every batch is measured, and the tolerance on the sheet is the tolerance in the box. When something is out, it does not ship — it goes back.",
  },
];

const NUMBERS = [
  { v: "±0.02", l: "mm tolerance" },
  { v: "2 000", l: "hours of testing" },
  { v: "6", l: "components, one part" },
  { v: "100%", l: "machined in the EU" },
];

export function AboutView() {
  return (
    <>
      <Scene scene="void" />

      <div className="relative z-10 bg-ground">
        {/* Opening statement — the whole frame, held. */}
        <section className="flex min-h-screen flex-col justify-end pb-[12vh] pt-[calc(var(--nav-h)+10vh)]">
          <div className="mx-auto w-full max-w-[1800px] px-5 md:px-10">
            <Reveal as="p" className="t-mono text-accent">
              Why DCRO exists
            </Reveal>
            <Reveal as="h1" className="t-display mt-6 text-[17vw] leading-[0.8] md:text-[9vw]" y={90}>
              Most upgrades
              <br />
              <span className="text-aluminium">make a car worse.</span>
            </Reveal>
            <Reveal as="p" className="t-body mt-10 md:ml-[50%]" y={40}>
              They add a thing where there was nothing, in a finish that does not match, held on
              with tape that will fail in July. DCRO started because we wanted the opposite: parts
              that read as though the factory had a better budget.
            </Reveal>
          </div>
        </section>

        {/* Chapters — an asymmetric text column against a wide margin. */}
        <section className="border-t border-rule">
          <div className="mx-auto max-w-[1800px] px-5 md:px-10">
            {CHAPTERS.map((c) => (
              <article key={c.n} className="grid gap-6 border-b border-rule py-16 md:grid-cols-12 md:py-24">
                <div className="md:col-span-3">
                  <span className="t-mono text-accent">{c.n}</span>
                  <h2 className="t-display mt-2 text-5xl md:text-6xl">{c.k}</h2>
                </div>
                <div className="md:col-span-8 md:col-start-5">
                  <Reveal as="p" className="font-display text-[7vw] uppercase leading-[0.94] tracking-tight md:text-[2.6vw]">
                    {c.lead}
                  </Reveal>
                  <p className="t-body mt-6">{c.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Numbers carry the argument. */}
        <section className="border-b border-rule py-20 md:py-28">
          <div className="mx-auto max-w-[1800px] px-5 md:px-10">
            <RevealGroup className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {NUMBERS.map((n) => (
                <div key={n.l}>
                  <p className="t-display text-[13vw] leading-none tabular-nums md:text-[4.5vw]">{n.v}</p>
                  <p className="t-mono mt-3 text-aluminium">{n.l}</p>
                </div>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section className="py-24 md:py-36">
          <div className="mx-auto max-w-[1800px] px-5 md:px-10">
            <Link href="/shop" data-cursor="Enter" className="group block">
              <h2 className="t-display text-[13vw] leading-[0.85] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-4 md:text-[7vw]">
                Built around
                <br />
                <span className="text-aluminium transition-colors group-hover:text-paper">the details.</span>
              </h2>
              <span className="mt-8 flex items-center gap-4">
                <span className="t-mono">See the products</span>
                <span className="block h-px w-14 bg-accent transition-all duration-500 group-hover:w-28" />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
