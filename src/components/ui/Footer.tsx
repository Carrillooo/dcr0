import Link from "next/link";
import { CATEGORIES } from "@/data/products";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-rule bg-ground">
      <div className="mx-auto max-w-[1800px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="t-display text-[13vw] leading-[0.82] md:text-[6.5vw]">
              Every detail
              <br />
              matters.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="t-mono mb-5 text-aluminium">Worlds</p>
            <ul className="space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop/${c.slug}`}
                    className="group flex items-baseline gap-3 text-sm text-paper/75 transition-colors hover:text-paper"
                  >
                    <span className="t-mono text-[9px] text-accent">{c.index}</span>
                    <span className="relative">
                      {c.name}
                      <span className="absolute -bottom-px left-0 h-px w-full origin-right scale-x-0 bg-paper transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:origin-left group-hover:scale-x-100" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="t-mono mb-5 text-aluminium">Company</p>
            <ul className="space-y-2.5 text-sm text-paper/75">
              <li><Link href="/about" className="transition-colors hover:text-paper">About</Link></li>
              <li><Link href="/vehicle" className="transition-colors hover:text-paper">Find your fit</Link></li>
              <li><Link href="/account" className="transition-colors hover:text-paper">Account</Link></li>
              <li><Link href="/search" className="transition-colors hover:text-paper">Search</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="t-mono mb-5 text-aluminium">Contact</p>
            <ul className="space-y-2.5 text-sm text-paper/75">
              <li><a href="mailto:hello@dcro.example" className="transition-colors hover:text-paper">hello@dcro.example</a></li>
              <li className="text-aluminium">Barcelona · Stuttgart</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-rule pt-6 md:flex-row md:items-center md:justify-between">
          <p className="t-mono text-aluminium">© {new Date().getFullYear()} DCRO — Engineered for automotive</p>
          <p className="t-mono text-aluminium">Machined in EU · Shipped worldwide</p>
        </div>
      </div>
    </footer>
  );
}
