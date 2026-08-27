"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { CATEGORIES, PRODUCTS, formatPrice } from "@/data/products";
import { ProductPlate } from "@/components/ui/ProductPlate";
import { Scene } from "@/components/ui/Scene";

/* Search opens as a whole page with the field set at display size — the field
   is the composition. Results are live, with imagery, never a plain dropdown. */

const SUGGESTED = ["Shift", "Carbon", "Lighting", "Aluminium", "Interior"];

export function SearchView() {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return PRODUCTS.filter((p) =>
      [p.name, p.line, p.tagline, p.category, ...p.materials, ...p.features]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [q]);

  return (
    <>
      <Scene scene="void" />

      <div className="relative z-10 min-h-screen bg-ground pt-[calc(var(--nav-h)+8vh)]">
        <div className="mx-auto max-w-[1800px] px-5 pb-32 md:px-10">
          <label htmlFor="q" className="t-mono block text-accent">
            Search
          </label>
          <input
            ref={input}
            id="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a product, material or category"
            autoComplete="off"
            className="t-display mt-5 w-full border-b border-rule-strong bg-transparent pb-5 text-[9vw] leading-[0.9] text-paper outline-none transition-colors placeholder:text-[#3a3a3c] focus:border-paper md:text-[4.5vw]"
          />

          {!q && (
            <div className="mt-12">
              <p className="t-mono mb-5 text-aluminium">Try</p>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    className="group relative py-1"
                  >
                    <span className="font-display text-2xl uppercase tracking-tight text-aluminium transition-colors group-hover:text-paper">
                      {s}
                    </span>
                    <span className="absolute -bottom-px left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                  </button>
                ))}
              </div>

              <p className="t-mono mb-5 mt-16 text-aluminium">Or browse a world</p>
              <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/shop/${c.slug}`} className="group block border-t border-rule pt-4">
                      <span className="t-mono text-accent">{c.index}</span>
                      <p className="font-display mt-1 text-xl uppercase tracking-tight transition-transform duration-500 group-hover:translate-x-1.5">
                        {c.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {q && (
            <>
              <p className="t-mono mt-8 text-aluminium" role="status" aria-live="polite">
                {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
              </p>

              {results.length === 0 ? (
                <p className="t-display mt-16 text-[8vw] leading-none text-aluminium md:text-[3.5vw]">
                  Nothing yet.
                </p>
              ) : (
                <ul className="mt-12 border-t border-rule">
                  {results.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/product/${p.slug}`}
                        data-cursor="View"
                        className="group flex items-center gap-6 border-b border-rule py-5"
                      >
                        <span className="relative h-16 w-16 shrink-0 overflow-hidden bg-[#0d0d10] p-2">
                          <ProductPlate category={p.category} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="font-display block text-2xl uppercase leading-none tracking-tight transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2">
                            {p.name}
                          </span>
                          <span className="t-mono mt-1.5 block text-aluminium">{p.line}</span>
                        </span>
                        <span className="t-mono shrink-0 tabular-nums">{formatPrice(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
