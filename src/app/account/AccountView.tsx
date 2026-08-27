"use client";

import Link from "next/link";
import { useHydrated } from "@/lib/client";
import { formatPrice, getProduct } from "@/data/products";
import { useCommerce } from "@/lib/store";
import { isComplete, vehicleLabel } from "@/data/vehicles";
import { ProductPlate } from "@/components/ui/ProductPlate";
import { Scene } from "@/components/ui/Scene";

/* Account is a garage, not a dashboard: the car you registered, the parts you
   saved, and the orders. No widgets, no cards, no chart nobody asked for. */

const ORDERS = [
  { id: "DCRO-24816", date: "12 Aug 2026", items: 2, total: 468, status: "Delivered" },
  { id: "DCRO-24610", date: "27 Jun 2026", items: 1, total: 289, status: "Delivered" },
];

export function AccountView() {
  const vehicle = useCommerce((s) => s.vehicle);
  const saved = useCommerce((s) => s.saved);
  const toggleSaved = useCommerce((s) => s.toggleSaved);
  // Client-only state: hold the empty frame until hydration so the server
  // paint and the first client paint agree.
  const ready = useHydrated();

  return (
    <>
      <Scene scene="void" />

      <div className="relative z-10 min-h-screen bg-ground pt-[calc(var(--nav-h)+8vh)]">
        <div className="mx-auto max-w-[1800px] px-5 pb-32 md:px-10">
          <p className="t-mono text-accent">Account</p>
          <h1 className="t-display mt-4 text-[14vw] leading-[0.86] md:text-[6vw]">Your garage.</h1>

          <div className="mt-16 grid gap-16 lg:grid-cols-12">
            <section className="lg:col-span-5">
              <h2 className="t-mono mb-6 text-aluminium">Registered vehicle</h2>
              {ready && isComplete(vehicle) ? (
                <div className="border-t border-rule pt-5">
                  <p className="font-display text-3xl uppercase leading-none tracking-tight">
                    {vehicleLabel(vehicle)}
                  </p>
                  <Link href="/vehicle" className="t-mono mt-5 inline-block border-b border-accent pb-1">
                    Change vehicle
                  </Link>
                </div>
              ) : (
                <div className="border-t border-rule pt-5">
                  <p className="text-paper/70">No vehicle registered yet.</p>
                  <Link href="/vehicle" className="t-mono mt-5 inline-block border-b border-accent pb-1">
                    Add your car
                  </Link>
                </div>
              )}

              <h2 className="t-mono mb-6 mt-16 text-aluminium">Orders</h2>
              <ul className="border-t border-rule">
                {ORDERS.map((o) => (
                  <li key={o.id} className="flex items-baseline justify-between gap-4 border-b border-rule py-4">
                    <span>
                      <span className="t-mono block text-paper">{o.id}</span>
                      <span className="t-mono mt-1 block text-aluminium">
                        {o.date} · {o.items} item{o.items === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="t-mono block tabular-nums">{formatPrice(o.total)}</span>
                      <span className="t-mono mt-1 block text-aluminium">{o.status}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="lg:col-span-6 lg:col-start-7">
              <h2 className="t-mono mb-6 text-aluminium">Saved</h2>
              {!ready || saved.length === 0 ? (
                <div className="border-t border-rule pt-5">
                  <p className="text-paper/70">Nothing saved yet.</p>
                  <Link href="/shop" className="t-mono mt-5 inline-block border-b border-accent pb-1">
                    Browse the catalogue
                  </Link>
                </div>
              ) : (
                <ul className="border-t border-rule">
                  {saved.map((slug) => {
                    const p = getProduct(slug);
                    if (!p) return null;
                    return (
                      <li key={slug} className="flex items-center gap-5 border-b border-rule py-4">
                        <Link href={`/product/${p.slug}`} className="h-16 w-16 shrink-0 bg-[#0d0d10] p-2">
                          <ProductPlate category={p.category} />
                        </Link>
                        <Link href={`/product/${p.slug}`} className="min-w-0 flex-1">
                          <span className="font-display block text-xl uppercase tracking-tight">{p.name}</span>
                          <span className="t-mono mt-1 block text-aluminium">{p.line}</span>
                        </Link>
                        <span className="t-mono shrink-0 tabular-nums">{formatPrice(p.price)}</span>
                        <button
                          type="button"
                          onClick={() => toggleSaved(slug)}
                          className="t-mono shrink-0 text-aluminium hover:text-paper"
                        >
                          Remove
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
