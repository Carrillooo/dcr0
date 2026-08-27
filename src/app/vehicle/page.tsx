import type { Metadata } from "next";
import { VehicleView } from "./VehicleView";

export const metadata: Metadata = {
  title: "Find your fit",
  description:
    "Tell DCRO what you drive and the catalogue filters itself. Make, model, year, version — then only the parts that fit.",
};

export default function VehiclePage() {
  return <VehicleView />;
}
