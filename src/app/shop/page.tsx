import type { Metadata } from "next";
import { ShopView } from "./ShopView";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Every DCRO product. Interior, exterior, lighting, technology and protection — engineered to component standards.",
};

export default function ShopPage() {
  return <ShopView />;
}
