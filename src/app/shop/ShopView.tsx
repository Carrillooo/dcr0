"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, type CategorySlug } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { Scene } from "@/components/ui/Scene";
import { useCommerce } from "@/lib/store";
import { isComplete, vehicleLabel } from "@/data/vehicles";

/* ---------------------------------------------------------------------------
 * The catalogue. Premium, but this is where people actually buy, so the
 * experimentation stops and the discipline takes over: large product plates,
 * a lot of air, filters that stay quiet until you want them.
 *
 * The grid is deliberately irregular — every fourth item runs wide — so it
 * reads as an edited page rather than a search result.
 * ------------------------------------------------------------------------ */

type Sort = "featured" | "price-asc" | "price-desc";

export function ShopView() {
  const [cat, setCat] = useState<CategorySlug | "all">("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [fitOnly, setFitOnly] = useState(false);
  const vehicle = useCommerce((s) => s.vehicle);
  const hasVehicle = isComplete(vehicle);

  const items = useMemo(() => {
    let list = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
    if (fitOnly && hasVehicle && vehicle.brand) {
      list = list.filter((p) => p.fits.includes(vehicle.brand!));
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "featured") list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return list;
  }, [cat, sort, fitOnly, hasVehicle, vehicle.brand]);

  return (
    <>
      {/* Canvas goes quiet here — the products are the subject now. */}
      <Scene scene="void" />

      <div className="relative z-10 min-h-screen bg-ground pt-[calc(var(--nav-h)+6vh)]">
        <div className="mx-auto max-w-[1800px] px-5 md:px-10">
          <header className="border-b border-rule pb-10">
            <Reveal as="p" className="t-mono text-accent">
              Catalogue
            </Reveal>
            <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <Reveal as="h1" className="t-display text-[13vw] leading-[0.86] md:text-[8vw]">
                Every part
                <br />
                we make.
              </Reveal>
              <p className="t-mono shrink-0 text-aluminium md:pb-4">
                {items.length} of {PRODUCTS.length} shown
              </p>
            </div>
          </header>

          {/* Filters — a quiet row of rules, not a shelf of pills. */}
          <div className="sticky top-[var(--nav-h)] z-20 -mx-5 mb-12 border-b border-rule bg-ground/92 px-5 py-4 backdrop-blur-sm md:-mx-10 md:px-10">
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <FilterButton active={cat === "all"} onClick={() => setCat("all")}>
                All
              </FilterButton>
              {CATEGORIES.map((c) => (
                <FilterButton key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
                  {c.name}
                </FilterButton>
              ))}

              <div className="ml-auto flex items-center gap-6">
                {hasVehicle ? (
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={fitOnly}
                      onChange={(e) => setFitOnly(e.target.checked)}
                      className="h-3 w-3 accent-[#c8102e]"
                    />
                    <span className="t-mono text-aluminium">
                      Fits {vehicleLabel(vehicle).split(" · ")[0]}
                    </span>
                  </label>
                ) : (
                  <Link href="/vehicle" className="t-mono text-aluminium underline-offset-4 hover:text-paper hover:underline">
                    Select vehicle
                  </Link>
                )}

                <label className="flex items-center gap-2">
                  <span className="sr-only">Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className="t-mono cursor-pointer border-none bg-transparent text-paper outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price low</option>
                    <option value="price-desc">Price high</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="py-32 text-center">
              <p className="t-display text-[8vw] leading-none md:text-[4vw]">Nothing fits yet.</p>
              <p className="t-body mx-auto mt-5">
                We do not have a part for that combination. Tell us what you drive and we will
                let you know when we do.
              </p>
              <Link href="/vehicle" className="t-mono mt-8 inline-block border-b border-accent pb-1">
                Change vehicle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-5 gap-y-16 pb-32 sm:grid-cols-2 lg:grid-cols-6">
              {items.map((p, i) => (
                <div
                  key={p.slug}
                  // Alternating rhythm that still closes each row at 6 columns:
                  // a wide pair, then a tighter trio. An edited page, not a
                  // result set — and no orphan gap at the end of a row.
                  className={i % 5 < 2 ? "lg:col-span-3" : "lg:col-span-2"}
                >
                  <ProductCard product={p} index={i} wide={i % 5 < 2} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="group relative py-1"
    >
      <span className={`t-mono transition-colors ${active ? "text-paper" : "text-aluminium hover:text-paper"}`}>
        {children}
      </span>
      <span
        className={`absolute -bottom-px left-0 h-px w-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </button>
  );
}
