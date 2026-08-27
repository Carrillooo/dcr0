"use client";

import Link from "next/link";
import { CATEGORIES, formatPrice, type Category, type Product } from "@/data/products";
import { ProductPlate } from "@/components/ui/ProductPlate";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { Scene } from "@/components/ui/Scene";

/* ---------------------------------------------------------------------------
 * A category is a world, so the page is a world too: a full-bleed title frame
 * with the category's own light, then the products laid out as an editorial
 * index — alternating sides, one at a time, with room to breathe.
 *
 * Deliberately NOT the same layout as /shop. Same type system, same colour,
 * same UI; different composition and different rhythm.
 * ------------------------------------------------------------------------ */

const FINISH: Record<string, "graphite" | "silver" | "carbon"> = {
  interior: "graphite",
  exterior: "carbon",
  lighting: "silver",
  technology: "graphite",
  protection: "graphite",
};

export function CategoryView({ category, products }: { category: Category; products: Product[] }) {
  const others = CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <>
      {/* The canvas carries this category's own light and material. */}
      <Scene
        scene="product"
        mood={category.light}
        finish={FINISH[category.slug] ?? "graphite"}
        glow={category.light === "emissive" ? 3.2 : 0.9}
        offsetX={1.35}
      />

      {/* Title frame: the canvas is visible behind, so nothing is painted here. */}
      <section className="relative flex min-h-[92vh] items-end pb-[10vh] pt-[var(--nav-h)]">
        <div className="mx-auto w-full max-w-[1800px] px-5 md:px-10">
          <Reveal as="p" className="t-mono text-accent">
            {category.index} — World
          </Reveal>
          <Reveal as="h1" className="t-display mt-4 text-[20vw] leading-[0.8] md:text-[11vw]" y={80}>
            {category.name}
          </Reveal>
          <div className="mt-8 grid gap-6 border-t border-rule pt-6 md:grid-cols-12">
            <Reveal as="p" className="text-xl leading-snug md:col-span-5">
              {category.mood}
            </Reveal>
            <p className="t-mono text-aluminium md:col-span-4 md:col-start-7">{category.materials}</p>
            <p className="t-mono text-aluminium md:col-span-2 md:col-start-11 md:text-right">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>
      </section>

      {/* Editorial index — alternating sides, generous scale, one at a time. */}
      <section className="relative z-10 bg-ground">
        <div className="mx-auto max-w-[1800px] px-5 md:px-10">
          {products.map((p, i) => {
            const left = i % 2 === 0;
            return (
              <article key={p.slug} className="border-t border-rule py-16 md:py-24">
                <Link href={`/product/${p.slug}`} data-cursor="View" className="group block">
                  <div
                    className={`grid items-center gap-8 md:grid-cols-12 ${
                      left ? "" : "md:[direction:rtl] md:[&>*]:[direction:ltr]"
                    }`}
                  >
                    <div className="md:col-span-5">
                      <div className="relative aspect-[5/4] overflow-hidden bg-[#0b0b0e]">
                        <div
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(155deg,#1d1d22 0%,#0f0f13 50%,#08080a 100%)" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center p-[14%] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]">
                          <ProductPlate category={p.category} />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-6 md:col-start-7">
                      <span className="t-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <h2 className="t-display mt-3 text-[11vw] leading-[0.88] md:text-[4.5vw]">
                        {p.name}
                      </h2>
                      <p className="t-mono mt-3 text-aluminium">{p.line}</p>
                      <p className="mt-6 max-w-md text-lg leading-snug text-paper/80">{p.tagline}</p>
                      <div className="mt-8 flex items-center gap-8">
                        <span className="t-mono tabular-nums">{formatPrice(p.price)}</span>
                        <span className="flex items-center gap-3">
                          <span className="t-mono">View</span>
                          <span className="block h-px w-10 bg-accent transition-all duration-500 group-hover:w-20" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Onward — the other worlds, as a quiet index. */}
      <section className="relative z-10 border-t border-rule bg-graphite py-20 md:py-28">
        <div className="mx-auto max-w-[1800px] px-5 md:px-10">
          <p className="t-mono mb-10 text-aluminium">Other worlds</p>
          <RevealGroup className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((c) => (
              <Link key={c.slug} href={`/shop/${c.slug}`} className="group block border-t border-rule pt-5">
                <span className="t-mono text-accent">{c.index}</span>
                <p className="t-display mt-2 text-4xl transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2">
                  {c.name}
                </p>
                <p className="t-mono mt-3 text-aluminium">{c.materials}</p>
              </Link>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
