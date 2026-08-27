import type { Metadata } from "next";
import { SearchView } from "./SearchView";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the DCRO catalogue by product, category or material.",
};

export default function SearchPage() {
  return <SearchView />;
}
