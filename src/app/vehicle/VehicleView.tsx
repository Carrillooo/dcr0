"use client";

import { VehicleSelector } from "@/components/ui/VehicleSelector";
import { Reveal } from "@/components/ui/Reveal";
import { Scene } from "@/components/ui/Scene";

/* ---------------------------------------------------------------------------
 * Fitment gets a whole page and a whole scene, because it is the thing DCRO
 * has that a general accessory shop does not.
 *
 * Layout is its own again: the selector holds the left column and the car
 * drawing occupies the right, resolving from wireframe to solid body as the
 * four choices are made. Split composition — not the centred hero used
 * everywhere else on the site.
 * ------------------------------------------------------------------------ */

export function VehicleView() {
  return (
    <>
      <Scene scene="vehicle" />

      <div className="relative min-h-screen pt-[calc(var(--nav-h)+8vh)]">
        <div className="mx-auto max-w-[1800px] px-5 pb-32 md:px-10">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal as="p" className="t-mono text-accent">
                Fitment
              </Reveal>
              <Reveal as="h1" className="t-display mt-4 text-[15vw] leading-[0.84] md:text-[6.5vw]" y={70}>
                Select
                <br />
                your car.
              </Reveal>
              <p className="t-body mt-8">
                Four choices. After that the catalogue only shows you parts that fit, and every
                product page tells you plainly whether it works on your car.
              </p>

              <div className="mt-16">
                <VehicleSelector />
              </div>
            </div>

            {/* The right column is intentionally empty: the car drawing lives in
                the canvas behind it, and covering it with a panel would defeat
                the whole point of the scene. */}
            <div className="hidden lg:col-span-5 lg:col-start-8 lg:block" aria-hidden />
          </div>
        </div>
      </div>
    </>
  );
}
