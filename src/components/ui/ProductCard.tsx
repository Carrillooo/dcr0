"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { formatPrice, type Product } from "@/data/products";
import { ProductPlate } from "./ProductPlate";

/* ---------------------------------------------------------------------------
 * Not a SaaS card. No border, no radius, no shadow, no badge row — the product
 * sits on a lit plate and the type stays out of its way until you approach it.
 *
 * On hover: the light moves across the plate, the product lifts, and the name
 * underlines from the left. Three coordinated moves, one easing family.
 * ------------------------------------------------------------------------ */

export function ProductCard({
  product,
  index,
  wide = false,
}: {
  product: Product;
  index?: number;
  /** Wide tiles get a landscape plate — a 4:5 crop on a double-width card
      blows the product up to twice the size of its neighbours. */
  wide?: boolean;
}) {
  const root = useRef<HTMLAnchorElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const sweep = useRef<HTMLDivElement>(null);

  const enter = () => {
    gsap.to(plate.current, { scale: 1.045, y: -8, duration: 0.7, ease: "power3.out" });
    gsap.fromTo(
      sweep.current,
      { xPercent: -120 },
      { xPercent: 120, duration: 1.1, ease: "power2.inOut" },
    );
  };

  const leave = () => {
    gsap.to(plate.current, { scale: 1, y: 0, x: 0, rotateY: 0, rotateX: 0, duration: 0.9, ease: "power3.out" });
  };

  // Pointer parallax — the product acknowledges the cursor without wobbling.
  const move = (e: React.MouseEvent) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const r = root.current?.getBoundingClientRect();
    if (!r) return;
    const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
    gsap.to(plate.current, {
      rotateY: nx * 9,
      rotateX: -ny * 7,
      x: nx * 10,
      duration: 0.6,
      ease: "power3.out",
      transformPerspective: 800,
    });
  };

  return (
    <Link
      ref={root}
      href={`/product/${product.slug}`}
      data-cursor="View"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onMouseMove={move}
      className="group block"
    >
      <div className={`relative overflow-hidden bg-[#0c0c0f] ${wide ? "aspect-[16/11]" : "aspect-[4/5]"}`}>
        {/* Plate light — a long strip reflection, not a radial glow */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "linear-gradient(168deg, #1c1c21 0%, #101014 42%, #08080a 100%)",
          }}
        />
        <div
          ref={sweep}
          aria-hidden
          className="absolute inset-y-0 -left-1/3 w-1/3 opacity-0 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(100deg, transparent, rgba(242,242,240,0.13), transparent)",
          }}
        />

        {index !== undefined && (
          <span className="t-mono absolute left-4 top-4 z-10 text-[9px] text-aluminium">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}

        <div ref={plate} className="absolute inset-0 flex items-center justify-center p-[16%] will-change-transform">
          <ProductPlate category={product.category} />
        </div>

        {product.stock <= 10 && (
          <span className="t-mono absolute bottom-4 right-4 z-10 text-[9px] text-accent">
            {product.stock} left
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-display text-lg uppercase leading-none tracking-tight">
            <span className="relative inline-block">
              {product.name}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-paper transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:origin-left group-hover:scale-x-100" />
            </span>
          </h3>
          <p className="t-mono mt-2 text-aluminium">{product.line}</p>
        </div>
        <span className="t-mono shrink-0 tabular-nums text-paper">{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}
