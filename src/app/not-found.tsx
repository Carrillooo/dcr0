import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative z-10 flex min-h-screen items-center bg-ground px-5 md:px-10">
      <div className="mx-auto w-full max-w-[1800px]">
        <p className="t-mono text-accent">404</p>
        <h1 className="t-display mt-5 text-[11vw] leading-[0.88] md:text-[8vw]">
          No part
          <br />
          <span className="text-aluminium">by that name.</span>
        </h1>
        <p className="t-body mt-8">
          The page you asked for does not exist. It may have been renamed, or the link may be
          wrong.
        </p>
        <div className="mt-10 flex flex-wrap gap-10">
          <Link href="/" className="group inline-flex items-center gap-4 border-b border-rule-strong pb-2">
            <span className="t-mono">Home</span>
            <span className="block h-px w-10 bg-accent transition-all duration-500 group-hover:w-16" />
          </Link>
          <Link href="/shop" className="group inline-flex items-center gap-4 border-b border-rule-strong pb-2">
            <span className="t-mono">Catalogue</span>
            <span className="block h-px w-10 bg-accent transition-all duration-500 group-hover:w-16" />
          </Link>
        </div>
      </div>
    </div>
  );
}
