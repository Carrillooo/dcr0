"use client";

import Link from "next/link";
import { useState } from "react";
import { useHydrated } from "@/lib/client";
import { formatPrice, getProduct } from "@/data/products";
import { cartTotal, useCommerce } from "@/lib/store";
import { Scene } from "@/components/ui/Scene";

/* ---------------------------------------------------------------------------
 * The one place where clarity beats art direction outright. Same type, same
 * colour, no experimentation: a single column, visible steps, no surprises and
 * nothing that delays the person trying to pay.
 * ------------------------------------------------------------------------ */

type Step = 1 | 2 | 3;

export function CheckoutView() {
  const lines = useCommerce((s) => s.lines);
  const clear = useCommerce((s) => s.clear);
  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState(false);
  // Client-only state: hold the empty frame until hydration so the server
  // paint and the first client paint agree.
  const ready = useHydrated();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartTotal(lines);
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 12;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};

    if (step === 1) {
      if (!String(data.get("email") ?? "").includes("@")) next.email = "Enter a valid email address.";
    }
    if (step === 2) {
      for (const f of ["name", "address", "city", "postcode"]) {
        if (!String(data.get(f) ?? "").trim()) next[f] = "This field is required.";
      }
    }
    if (step === 3) {
      const card = String(data.get("card") ?? "").replace(/\s/g, "");
      if (card.length < 12) next.card = "Enter the full card number.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (step < 3) setStep((step + 1) as Step);
    else {
      setDone(true);
      clear();
    }
  };

  if (done) {
    return (
      <>
        <Scene scene="void" />
        <div className="relative z-10 flex min-h-screen items-center bg-ground px-5 md:px-10">
          <div className="mx-auto w-full max-w-[1800px]">
            <p className="t-mono text-accent">Order placed</p>
            <h1 className="t-display mt-5 text-[13vw] leading-[0.86] md:text-[6vw]">
              Thank you.
              <br />
              <span className="text-aluminium">It ships Monday.</span>
            </h1>
            <p className="t-body mt-8">
              A confirmation is on its way. This is a demonstration checkout — no payment was taken
              and no card details were stored.
            </p>
            <Link href="/shop" className="group mt-10 inline-flex items-center gap-4 border-b border-rule-strong pb-2">
              <span className="t-mono">Back to the catalogue</span>
              <span className="block h-px w-10 bg-accent transition-all duration-500 group-hover:w-16" />
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Scene scene="void" />

      <div className="relative z-10 min-h-screen bg-ground pt-[calc(var(--nav-h)+8vh)]">
        <div className="mx-auto max-w-[1100px] px-5 pb-32 md:px-10">
          <h1 className="t-display text-[12vw] leading-[0.86] md:text-[4.5vw]">Checkout</h1>

          <ol className="mt-10 flex gap-6 border-b border-rule pb-4">
            {(["Contact", "Delivery", "Payment"] as const).map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className={`t-mono ${step === i + 1 ? "text-accent" : "text-aluminium"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`t-mono ${step === i + 1 ? "text-paper" : "text-aluminium"}`}>{s}</span>
              </li>
            ))}
          </ol>

          {ready && lines.length === 0 ? (
            <div className="mt-16">
              <p className="t-display text-[7vw] leading-none text-aluminium md:text-[2.6vw]">
                Your cart is empty.
              </p>
              <Link href="/shop" className="t-mono mt-8 inline-block border-b border-accent pb-1">
                Browse the catalogue
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid gap-16 lg:grid-cols-12">
              <form onSubmit={submit} noValidate className="lg:col-span-7">
                {step === 1 && (
                  <>
                    <Field name="email" label="Email" type="email" autoComplete="email" error={errors.email} />
                    <Field name="phone" label="Phone (optional)" type="tel" autoComplete="tel" />
                  </>
                )}

                {step === 2 && (
                  <>
                    <Field name="name" label="Full name" autoComplete="name" error={errors.name} />
                    <Field name="address" label="Address" autoComplete="street-address" error={errors.address} />
                    <div className="grid gap-x-8 sm:grid-cols-2">
                      <Field name="city" label="City" autoComplete="address-level2" error={errors.city} />
                      <Field name="postcode" label="Postcode" autoComplete="postal-code" inputMode="numeric" error={errors.postcode} />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Field name="card" label="Card number" inputMode="numeric" autoComplete="cc-number" error={errors.card} />
                    <div className="grid gap-x-8 sm:grid-cols-2">
                      <Field name="expiry" label="Expiry" placeholder="MM/YY" autoComplete="cc-exp" />
                      <Field name="cvc" label="CVC" inputMode="numeric" autoComplete="cc-csc" />
                    </div>
                    <p className="t-mono mt-4 text-aluminium">
                      Demonstration only. Do not enter a real card number.
                    </p>
                  </>
                )}

                <div className="mt-10 flex items-center gap-6">
                  <button
                    type="submit"
                    className="group relative overflow-hidden border border-paper px-8 py-4"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-paper transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
                    <span className="t-mono relative transition-colors duration-300 group-hover:text-ground">
                      {step === 3 ? "Place order" : "Continue"}
                    </span>
                  </button>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep((step - 1) as Step)}
                      className="t-mono text-aluminium hover:text-paper"
                    >
                      Back
                    </button>
                  )}
                </div>
              </form>

              <aside className="lg:col-span-4 lg:col-start-9">
                <p className="t-mono mb-5 text-aluminium">Order</p>
                <ul className="border-t border-rule">
                  {lines.map((l) => {
                    const p = getProduct(l.slug);
                    if (!p) return null;
                    return (
                      <li key={`${l.slug}-${l.variant ?? "-"}`} className="flex justify-between gap-4 border-b border-rule py-3">
                        <span className="min-w-0">
                          <span className="block truncate font-display text-base uppercase tracking-tight">
                            {p.name}
                          </span>
                          <span className="t-mono text-aluminium">× {l.qty}</span>
                        </span>
                        <span className="t-mono shrink-0 tabular-nums">{formatPrice(p.price * l.qty)}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 flex items-baseline justify-between border-t border-rule-strong pt-4">
                  <span className="font-display text-lg uppercase tracking-tight">Total</span>
                  <span className="t-mono tabular-nums">{formatPrice(subtotal + shipping)}</span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Field({
  name,
  label,
  error,
  ...rest
}: {
  name: string;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-8">
      <label htmlFor={name} className="t-mono mb-2 block text-aluminium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className="w-full border-b border-rule-strong bg-transparent pb-3 text-lg text-paper outline-none transition-colors focus:border-paper"
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="t-mono mt-2 text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
