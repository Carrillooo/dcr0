import type { Metadata } from "next";
import { AboutView } from "./AboutView";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why DCRO exists: design, function, automotive culture and quality — accessories engineered to component standards.",
};

export default function AboutPage() {
  return <AboutView />;
}
