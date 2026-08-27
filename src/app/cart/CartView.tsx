"use client";

import Link from "next/link";
import { useHydrated } from "@/lib/client";
import { formatPrice, getProduct } from "@/data/products";
import { cartTotal, useCommerce } from "@/lib/store";
import { ProductPlate } from "@/components/ui/ProductPlate";
import { Scene } from "@/components/ui/Scene";

/* Utility route: the type system and colour stay, the experimentation stops.
   Clarity beats art direction from here to the confirmation screen. */

export function CartView() {
  const lines = useCommerce((s) => s.lines);
  const setQty = useCommerce((s) => s.setQty);
  const remove = useCommerce((s) => s.remove);
  // Client-only state: hold the empty frame until hydration so the server
  // paint and the first client paint agree.
  const ready = useHydrated();

  const subtotal = cartTotal(lines);
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 12;

  return (
    <>
      <Scene scene="void" />

      <div className="relative z-10 min-h-screen bg-ground pt-[calc(var(--nav-h)+8vh)]">
        <div className="mx-auto max-w-[1800px] px-5 pb-32 md:px-10">
          <h1 className="t-display text-[14vw] leading-[0.86] md:text-[6vw]">Cart</h1>

          {!ready ? (
            <p className="t-mono mt-12 text-aluminium">Loading…</p>
          ) : lines.length === 0 ? (
            <div className="mt-16 border-t border-rule pt-16">
              <p className="t-display text-[8vw] leading-none text-aluminium md:text-[3vw]">
                Nothing in it yet.
              </p>
              <Link href="/shop" className="group mt-10 inline-flex items-center gap-4 border-b border-rule-strong pb-2">
                <span className="t-mono">Browse the catalogue</span>
                <span className="block h-px w-10 bg-accent transition-all duration-500 group-hover:w-16" />
              </Link>
            </div>
          ) : (
            <div className="mt-14 grid gap-16 lg:grid-cols-12">
              <ul className="border-t border-rule lg:col-span-7">
                {lines.map((l) => {
                  const p = getProduct(l.slug);
                  if (!p) return null;
                  const key = `${l.slug}-${l.variant ?? "-"}`;
                  return (
                    <li key={key} className="flex gap-5 border-b border-rule py-6">
                      <Link
                        href={`/product/${p.slug}`}
                        className="relative h-24 w-24 shrink-0 overflow-hidden bg-[#0d0d10] p-3"
                      >
                        <ProductPlate category={p.category} />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <Link href={`/product/${p.slug}`} className="font-display text-xl uppercase tracking-tight hover:text-aluminium">
                            {p.name}
                          </Link>
                          <p className="t-mono mt-1 text-aluminium">
                            {p.line}
                            {l.variant ? ` · ${l.variant}` : ""}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center gap-5">
                          <div className="flex items-center border border-rule">
                            <button
                              type="button"
                              onClick={() => setQty(l.slug, l.qty - 1, l.variant)}
                              aria-label={`Decrease quantity of ${p.name}`}
                              className="px-3 py-1.5 text-aluminium transition-colors hover:text-paper"
                            >
                              −
                            </button>
                            <span className="t-mono w-8 text-center tabular-nums">{l.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(l.slug, l.qty + 1, l.variant)}
                              aria-label={`Increase quantity of ${p.name}`}
                              className="px-3 py-1.5 text-aluminium transition-colors hover:text-paper"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(l.slug, l.variant)}
                            className="t-mono text-aluminium underline-offset-4 transition-colors hover:text-paper hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <span className="t-mono shrink-0 tabular-nums">
                        {formatPrice(p.price * l.qty)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <aside className="lg:col-span-4 lg:col-start-9">
                <div className="border-t border-rule pt-6">
                  <Row label="Subtotal" value={formatPrice(subtotal)} />
                  <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
                  <div className="mt-4 flex items-baseline justify-between border-t border-rule-strong pt-4">
                    <span className="font-display text-xl uppercase tracking-tight">Total</span>
                    <span className="t-mono text-xl tabular-nums">{formatPrice(subtotal + shipping)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="group relative mt-8 block w-full overflow-hidden border border-paper px-6 py-4 text-center"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-paper transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
                    <span className="t-mono relative transition-colors duration-300 group-hover:text-ground">
                      Checkout
                    </span>
                  </Link>

                  <p className="t-mono mt-5 text-aluminium">
                    Free EU shipping over €200 · 30-day returns · Machined in EU
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-2">
      <span className="t-mono text-aluminium">{label}</span>
      <span className="t-mono tabular-nums">{value}</span>
    </div>
  );
}
