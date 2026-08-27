export type Brand = { id: string; name: string };

export const BRANDS: Brand[] = [
  { id: "bmw", name: "BMW" },
  { id: "audi", name: "Audi" },
  { id: "vw", name: "Volkswagen" },
  { id: "seat", name: "SEAT" },
  { id: "mercedes", name: "Mercedes-Benz" },
  { id: "toyota", name: "Toyota" },
  { id: "renault", name: "Renault" },
];

export const MODELS: Record<string, string[]> = {
  bmw: ["1 Series", "3 Series", "4 Series", "M2", "X1"],
  audi: ["A1", "A3", "A4", "S3", "Q3"],
  vw: ["Golf", "Golf GTI", "Polo", "T-Roc", "Passat"],
  seat: ["Ibiza", "León", "León Cupra", "Ateca", "Arona"],
  mercedes: ["A-Class", "C-Class", "CLA", "GLA", "A45"],
  toyota: ["Corolla", "Yaris", "GR Yaris", "C-HR", "RAV4"],
  renault: ["Clio", "Mégane", "Mégane RS", "Captur", "Arkana"],
};

export const YEARS = Array.from({ length: 16 }, (_, i) => String(2025 - i));

export const VERSIONS = ["Base", "Sport", "Performance", "Hybrid"];

export type VehicleSelection = {
  brand: string | null;
  model: string | null;
  year: string | null;
  version: string | null;
};

export const EMPTY_VEHICLE: VehicleSelection = {
  brand: null,
  model: null,
  year: null,
  version: null,
};

export const vehicleLabel = (v: VehicleSelection) =>
  [BRANDS.find((b) => b.id === v.brand)?.name, v.model, v.year, v.version]
    .filter(Boolean)
    .join(" · ");

export const isComplete = (v: VehicleSelection) =>
  Boolean(v.brand && v.model && v.year && v.version);
