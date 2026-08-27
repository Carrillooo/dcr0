export type CategorySlug =
  | "interior"
  | "exterior"
  | "lighting"
  | "technology"
  | "protection";

/** Each category is a world with its own light, mood and camera — not a filter chip. */
export type Category = {
  slug: CategorySlug;
  name: string;
  index: string;
  /** One line of art direction that drives the 3D environment for this world. */
  mood: string;
  materials: string;
  /** Studio lighting preset key consumed by <Studio />. */
  light: "soft" | "contrast" | "emissive" | "clinical" | "industrial";
};

export const CATEGORIES: Category[] = [
  {
    slug: "interior",
    name: "Interior",
    index: "01",
    mood: "Dark cabin. Light falls slowly. Nothing is rushed.",
    materials: "Leather · Machined aluminium · Alcantara",
    light: "soft",
  },
  {
    slug: "exterior",
    name: "Exterior",
    index: "02",
    mood: "Night road. Light moves across the surface and leaves.",
    materials: "Anodised alloy · Automotive paint · Stainless",
    light: "contrast",
  },
  {
    slug: "lighting",
    name: "Lighting",
    index: "03",
    mood: "The product is the only light source in the room.",
    materials: "Optical glass · Heat-sink alloy · Silicone",
    light: "emissive",
  },
  {
    slug: "technology",
    name: "Technology",
    index: "04",
    mood: "Engineering grey. Measured, precise, unemotional.",
    materials: "Carbon composite · PCB · Tempered glass",
    light: "clinical",
  },
  {
    slug: "protection",
    name: "Protection",
    index: "05",
    mood: "Built to be hit. Heavier light, heavier material.",
    materials: "Reinforced polymer · Rubber · Steel",
    light: "industrial",
  },
];

export type Part = {
  id: string;
  index: string;
  label: string;
  note: string;
};

export type Product = {
  slug: string;
  name: string;
  line: string;
  category: CategorySlug;
  price: number;
  /** Short, declarative. No marketing paragraphs. */
  tagline: string;
  statement: string;
  materials: string[];
  specs: { label: string; value: string }[];
  features: string[];
  install: { step: string; label: string; detail: string }[];
  /** Exploded-view callouts, driven by scroll. */
  parts: Part[];
  fits: string[];
  stock: number;
  variants?: { id: string; label: string; hex: string }[];
  featured?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    slug: "dcro-one-shift-module",
    name: "DCRO ONE",
    line: "Precision Shift Module",
    category: "interior",
    price: 289,
    tagline: "Machined from a single billet. Weighted to the gram.",
    statement:
      "The one part of the car your hand never stops touching. So we built it like a component, not an accessory.",
    materials: [
      "6061-T6 aluminium, hard anodised",
      "Full-grain leather collar",
      "316 stainless weight core",
      "Optical-grade lens cap",
    ],
    specs: [
      { label: "Mass", value: "412 g" },
      { label: "Body", value: "6061-T6 billet" },
      { label: "Finish", value: "Type III anodise" },
      { label: "Thread", value: "M10 / M12 adapter set" },
      { label: "Tolerance", value: "±0.02 mm" },
      { label: "Origin", value: "Machined in EU" },
    ],
    features: [
      "Weighted core tunes throw feel",
      "Knurl geometry cut, not cast",
      "Thermal collar — no cold metal in winter",
      "Fits factory boot without modification",
    ],
    install: [
      { step: "01", label: "Release", detail: "Unthread the factory knob counter-clockwise." },
      { step: "02", label: "Select adapter", detail: "Match the thread adapter to your shifter." },
      { step: "03", label: "Seat", detail: "Thread on, hand-tight, then a quarter turn." },
      { step: "04", label: "Align", detail: "Lock the collar with the supplied 2 mm key." },
    ],
    parts: [
      { id: "lens", index: "01", label: "Optical Cap", note: "Cast acrylic, polished" },
      { id: "crown", index: "02", label: "Aluminium Housing", note: "6061-T6, anodised" },
      { id: "knurl", index: "03", label: "Precision Knurl", note: "Cut on a 5-axis mill" },
      { id: "collar", index: "04", label: "Leather Collar", note: "Full-grain, hand-stitched" },
      { id: "core", index: "05", label: "Stainless Weight Core", note: "316, 210 g" },
      { id: "base", index: "06", label: "Thread Adapter", note: "M10 / M12 / M8" },
    ],
    fits: ["bmw", "audi", "vw", "seat", "mercedes"],
    stock: 24,
    variants: [
      { id: "graphite", label: "Graphite", hex: "#1c1c1e" },
      { id: "silver", label: "Raw Silver", hex: "#b8b8b2" },
      { id: "red", label: "Signal Red", hex: "#c8102e" },
    ],
    featured: true,
  },
  {
    slug: "dcro-lumen-bar",
    name: "DCRO LUMEN",
    line: "Interior Light Bar",
    category: "lighting",
    price: 179,
    tagline: "Light that belongs to the cabin, not to the aftermarket.",
    statement:
      "Most interior lighting announces itself. This one only shows you the surface it lands on.",
    materials: ["Extruded alloy housing", "Diffused optical lens", "Automotive silicone seal"],
    specs: [
      { label: "Output", value: "420 lm" },
      { label: "Temp", value: "2 700 K warm" },
      { label: "Draw", value: "4.2 W" },
      { label: "Length", value: "310 mm" },
      { label: "IP", value: "IP54" },
      { label: "Input", value: "12 V switched" },
    ],
    features: [
      "No visible diodes — diffusion only",
      "Dims with ignition state",
      "Adhesive and bracket mounting",
      "Zero flicker at any level",
    ],
    install: [
      { step: "01", label: "Position", detail: "Dry-fit along the trim line before peeling." },
      { step: "02", label: "Route", detail: "Run the loom behind the panel to the fuse tap." },
      { step: "03", label: "Tap", detail: "Connect to a switched 12 V circuit." },
      { step: "04", label: "Seat", detail: "Press for 30 seconds along the full length." },
    ],
    parts: [
      { id: "lens", index: "01", label: "Diffusion Lens", note: "92% transmission" },
      { id: "crown", index: "02", label: "Extruded Housing", note: "Anodised alloy" },
      { id: "knurl", index: "03", label: "Heat Sink Fins", note: "Passive dissipation" },
      { id: "collar", index: "04", label: "Silicone Seal", note: "IP54 rated" },
      { id: "core", index: "05", label: "LED Array", note: "Automotive grade" },
      { id: "base", index: "06", label: "Mount Rail", note: "Adhesive + bracket" },
    ],
    fits: ["bmw", "audi", "vw", "seat", "mercedes", "toyota"],
    stock: 61,
    featured: true,
  },
  {
    slug: "dcro-apex-pedals",
    name: "DCRO APEX",
    line: "Performance Pedal Set",
    category: "interior",
    price: 219,
    tagline: "Grip you feel through the sole.",
    statement:
      "Pedal covers usually add thickness and take away feel. These add texture and give it back.",
    materials: ["Billet aluminium face", "Vulcanised rubber inserts", "Stainless fixings"],
    specs: [
      { label: "Set", value: "3 pieces" },
      { label: "Face", value: "Billet 6082" },
      { label: "Insert", value: "Vulcanised rubber" },
      { label: "Added height", value: "3.1 mm" },
      { label: "Fixing", value: "Mechanical, no glue" },
      { label: "Finish", value: "Bead blast + anodise" },
    ],
    features: [
      "Mechanical fixing — never lifts",
      "Rubber inserts replaceable",
      "Machined drainage channels",
      "Left-foot rest included",
    ],
    install: [
      { step: "01", label: "Clean", detail: "Degrease the factory pedal faces." },
      { step: "02", label: "Clamp", detail: "Locate the backing plate behind the pedal." },
      { step: "03", label: "Torque", detail: "Tighten to 4 Nm in a cross pattern." },
      { step: "04", label: "Check", detail: "Confirm full travel before driving." },
    ],
    parts: [
      { id: "lens", index: "01", label: "Rubber Insert", note: "Replaceable, vulcanised" },
      { id: "crown", index: "02", label: "Billet Face", note: "6082, bead blast" },
      { id: "knurl", index: "03", label: "Grip Geometry", note: "Machined, not stamped" },
      { id: "collar", index: "04", label: "Isolation Gasket", note: "No metal-on-metal" },
      { id: "core", index: "05", label: "Backing Plate", note: "Stainless clamp" },
      { id: "base", index: "06", label: "Fixing Set", note: "A2 stainless" },
    ],
    fits: ["bmw", "audi", "vw", "seat"],
    stock: 12,
  },
  {
    slug: "dcro-vector-mount",
    name: "DCRO VECTOR",
    line: "Magnetic Device Mount",
    category: "technology",
    price: 129,
    tagline: "Holds at 1.2 g. Disappears at rest.",
    statement:
      "A mount is a failure of design if you notice it when it is not holding anything.",
    materials: ["Machined aluminium arm", "N52 magnet array", "Automotive TPE contact"],
    specs: [
      { label: "Hold", value: "1.2 g lateral" },
      { label: "Array", value: "12 × N52" },
      { label: "Rotation", value: "360° detented" },
      { label: "Mass", value: "96 g" },
      { label: "Mount", value: "Vent / adhesive" },
      { label: "Charge", value: "Qi2 pass-through" },
    ],
    features: [
      "Detented rotation — clicks to level",
      "Qi2 charging pass-through",
      "No vent-blade stress",
      "Shields the device from the array",
    ],
    install: [
      { step: "01", label: "Choose", detail: "Vent clip or adhesive base." },
      { step: "02", label: "Set angle", detail: "Rotate to the nearest detent." },
      { step: "03", label: "Attach plate", detail: "Fit the plate inside your case." },
      { step: "04", label: "Verify", detail: "Shake test at full extension." },
    ],
    parts: [
      { id: "lens", index: "01", label: "Contact Face", note: "Automotive TPE" },
      { id: "crown", index: "02", label: "Magnet Housing", note: "Machined alloy" },
      { id: "knurl", index: "03", label: "Detent Ring", note: "12-position" },
      { id: "collar", index: "04", label: "Ball Joint", note: "PTFE lined" },
      { id: "core", index: "05", label: "N52 Array", note: "Shielded rear" },
      { id: "base", index: "06", label: "Vent Clamp", note: "Load-spreading" },
    ],
    fits: ["bmw", "audi", "vw", "seat", "mercedes", "toyota", "renault"],
    stock: 88,
    featured: true,
  },
  {
    slug: "dcro-halo-projector",
    name: "DCRO HALO",
    line: "Door Projection Unit",
    category: "lighting",
    price: 149,
    tagline: "The first thing the car says, before you get in.",
    statement:
      "A single sharp line of light on the ground. No logo carousel, no colour cycling.",
    materials: ["Optical glass gobo", "Alloy body", "Sealed connector"],
    specs: [
      { label: "Output", value: "180 lm" },
      { label: "Optic", value: "Glass, 12 mm" },
      { label: "Temp", value: "5 000 K" },
      { label: "IP", value: "IP67" },
      { label: "Draw", value: "2.8 W" },
      { label: "Fit", value: "Plug-and-play" },
    ],
    features: [
      "Glass optics — no plastic haze",
      "Sharp edge at 700 mm throw",
      "Sealed for wheel-arch spray",
      "Factory connector, no cutting",
    ],
    install: [
      { step: "01", label: "Remove", detail: "Pop the factory courtesy lamp." },
      { step: "02", label: "Swap", detail: "Transfer the connector to the HALO body." },
      { step: "03", label: "Focus", detail: "Rotate the optic until the edge is sharp." },
      { step: "04", label: "Seat", detail: "Clip back until it locks." },
    ],
    parts: [
      { id: "lens", index: "01", label: "Glass Optic", note: "Ground and polished" },
      { id: "crown", index: "02", label: "Alloy Body", note: "Anodised black" },
      { id: "knurl", index: "03", label: "Focus Ring", note: "Knurled, damped" },
      { id: "collar", index: "04", label: "Weather Seal", note: "IP67" },
      { id: "core", index: "05", label: "Emitter", note: "5 000 K, 180 lm" },
      { id: "base", index: "06", label: "OEM Connector", note: "No cutting" },
    ],
    fits: ["bmw", "audi", "vw", "mercedes"],
    stock: 37,
  },
  {
    slug: "dcro-shield-arch",
    name: "DCRO SHIELD",
    line: "Arch Protection Set",
    category: "protection",
    price: 249,
    tagline: "Takes the hit so the paint does not.",
    statement:
      "Protection usually looks like protection. This is shaped to the arch line and finished like trim.",
    materials: ["Reinforced polymer", "Closed-cell backing", "Stainless clips"],
    specs: [
      { label: "Set", value: "4 pieces" },
      { label: "Impact", value: "Tested to 40 J" },
      { label: "Backing", value: "Closed-cell foam" },
      { label: "Finish", value: "Textured satin" },
      { label: "UV", value: "10-year stable" },
      { label: "Fixing", value: "Clip + tape" },
    ],
    features: [
      "Follows the factory arch radius",
      "Foam backing prevents grit abrasion",
      "Serviceable — clips release cleanly",
      "No drilling",
    ],
    install: [
      { step: "01", label: "Clean", detail: "Wash and dry the arch lip fully." },
      { step: "02", label: "Locate", detail: "Dry-fit and mark the clip positions." },
      { step: "03", label: "Clip", detail: "Seat each clip until it clicks." },
      { step: "04", label: "Bond", detail: "Peel the tape and press for 60 seconds." },
    ],
    parts: [
      { id: "lens", index: "01", label: "Outer Skin", note: "Textured satin" },
      { id: "crown", index: "02", label: "Impact Shell", note: "Reinforced polymer" },
      { id: "knurl", index: "03", label: "Rib Structure", note: "Load spreading" },
      { id: "collar", index: "04", label: "Edge Seal", note: "Water shedding" },
      { id: "core", index: "05", label: "Foam Backing", note: "Closed cell" },
      { id: "base", index: "06", label: "Clip Set", note: "Stainless" },
    ],
    fits: ["vw", "seat", "toyota", "renault"],
    stock: 19,
  },
  {
    slug: "dcro-blade-splitter",
    name: "DCRO BLADE",
    line: "Front Splitter Lip",
    category: "exterior",
    price: 439,
    tagline: "A line, added to a line that already worked.",
    statement:
      "Most lips fight the car's own geometry. This one continues it, which is much harder.",
    materials: ["Pre-preg carbon", "UV-stable clear coat", "Stainless fixings"],
    specs: [
      { label: "Layup", value: "Pre-preg 2×2 twill" },
      { label: "Mass", value: "1.9 kg" },
      { label: "Finish", value: "Satin clear" },
      { label: "Fixing", value: "Bolt + bond" },
      { label: "Clearance", value: "−18 mm" },
      { label: "Tested", value: "160 km/h" },
    ],
    features: [
      "Autoclave cured, not wet-lay",
      "Weave aligned to the car centreline",
      "Sacrificial edge strip included",
      "Fits factory mounting points",
    ],
    install: [
      { step: "01", label: "Lift", detail: "Raise the front on axle stands." },
      { step: "02", label: "Offer up", detail: "Locate to the factory bumper points." },
      { step: "03", label: "Bolt", detail: "Fit all fixings loose, then torque to 9 Nm." },
      { step: "04", label: "Bond", detail: "Apply the bead along the mating edge." },
    ],
    parts: [
      { id: "lens", index: "01", label: "Clear Coat", note: "UV stable, satin" },
      { id: "crown", index: "02", label: "Carbon Skin", note: "2×2 twill, aligned" },
      { id: "knurl", index: "03", label: "Edge Strip", note: "Sacrificial" },
      { id: "collar", index: "04", label: "Bond Line", note: "Structural adhesive" },
      { id: "core", index: "05", label: "Core Layup", note: "Pre-preg, autoclaved" },
      { id: "base", index: "06", label: "Fixing Set", note: "A4 stainless" },
    ],
    fits: ["bmw", "audi", "seat"],
    stock: 6,
    featured: true,
  },
  {
    slug: "dcro-grid-tray",
    name: "DCRO GRID",
    line: "Boot Organisation Tray",
    category: "protection",
    price: 169,
    tagline: "The boot stops being a place things slide around in.",
    statement: "A flat floor, a raised lip, and dividers that actually stay where you put them.",
    materials: ["Recycled polymer base", "Anodised divider rails", "Anti-slip skin"],
    specs: [
      { label: "Load", value: "45 kg" },
      { label: "Lip", value: "38 mm" },
      { label: "Dividers", value: "4 included" },
      { label: "Base", value: "Recycled polymer" },
      { label: "Clean", value: "Hose-safe" },
      { label: "Fold", value: "Flat, 22 mm" },
    ],
    features: [
      "Rails let dividers lock anywhere",
      "Raised lip contains spills",
      "Folds flat when not needed",
      "Cut to the factory boot shape",
    ],
    install: [
      { step: "01", label: "Clear", detail: "Empty the boot and lift the floor panel." },
      { step: "02", label: "Unfold", detail: "Open the tray and seat the corners." },
      { step: "03", label: "Rail", detail: "Slide the dividers into the rails." },
      { step: "04", label: "Set", detail: "Lock each divider with the thumb cam." },
    ],
    parts: [
      { id: "lens", index: "01", label: "Anti-slip Skin", note: "Textured top" },
      { id: "crown", index: "02", label: "Tray Body", note: "Recycled polymer" },
      { id: "knurl", index: "03", label: "Divider Rails", note: "Anodised" },
      { id: "collar", index: "04", label: "Containment Lip", note: "38 mm" },
      { id: "core", index: "05", label: "Rib Floor", note: "45 kg rated" },
      { id: "base", index: "06", label: "Corner Feet", note: "Non-marking" },
    ],
    fits: ["vw", "seat", "toyota", "renault", "mercedes"],
    stock: 44,
  },
  {
    slug: "dcro-mirror-caps",
    name: "DCRO MIRROR",
    line: "Carbon Mirror Caps",
    category: "exterior",
    price: 359,
    tagline: "Weave that runs with the car, not across it.",
    statement:
      "Anyone can wrap a mirror. Aligning the weave to the body line is the part that takes time.",
    materials: ["Pre-preg carbon", "Gloss clear coat", "OEM clip frame"],
    specs: [
      { label: "Pair", value: "2 pieces" },
      { label: "Layup", value: "Pre-preg twill" },
      { label: "Mass", value: "−140 g vs OEM" },
      { label: "Finish", value: "Gloss clear" },
      { label: "Fit", value: "Factory clips" },
      { label: "Weave", value: "Hand aligned" },
    ],
    features: [
      "Direct clip replacement",
      "Weave aligned left to right",
      "Lighter than the factory cap",
      "No adhesive residue on removal",
    ],
    install: [
      { step: "01", label: "Release", detail: "Push the cap forward and lift the rear edge." },
      { step: "02", label: "Unclip", detail: "Free the three factory clips in order." },
      { step: "03", label: "Fit", detail: "Locate the front lip, then press the rear." },
      { step: "04", label: "Confirm", detail: "Check all three clips are seated." },
    ],
    parts: [
      { id: "lens", index: "01", label: "Clear Coat", note: "Gloss, UV stable" },
      { id: "crown", index: "02", label: "Carbon Skin", note: "Aligned twill" },
      { id: "knurl", index: "03", label: "Edge Return", note: "Wrapped, not cut" },
      { id: "collar", index: "04", label: "Seal Lip", note: "Weather tight" },
      { id: "core", index: "05", label: "Substrate", note: "Injection frame" },
      { id: "base", index: "06", label: "OEM Clips", note: "Reusable" },
    ],
    fits: ["bmw", "audi", "vw"],
    stock: 9,
  },
  {
    slug: "dcro-pulse-display",
    name: "DCRO PULSE",
    line: "Telemetry Display",
    category: "technology",
    price: 399,
    tagline: "Six values. Nothing else on the screen.",
    statement:
      "Most aftermarket displays show everything the bus can give them. This one shows what you actually read at speed.",
    materials: ["Tempered glass front", "Machined alloy shell", "OBD harness"],
    specs: [
      { label: "Screen", value: "2.8 in AMOLED" },
      { label: "Refresh", value: "60 Hz" },
      { label: "Bus", value: "CAN via OBD-II" },
      { label: "Draw", value: "1.9 W" },
      { label: "Mount", value: "Magnetic dash" },
      { label: "Values", value: "6 configurable" },
    ],
    features: [
      "Reads directly from the CAN bus",
      "Auto-dims with cabin light",
      "Six configurable channels",
      "Removes without a trace",
    ],
    install: [
      { step: "01", label: "Plug", detail: "Connect the harness to the OBD-II port." },
      { step: "02", label: "Route", detail: "Run the cable along the A-pillar trim." },
      { step: "03", label: "Mount", detail: "Place the magnetic base on the dash." },
      { step: "04", label: "Pair", detail: "Select your vehicle profile on first boot." },
    ],
    parts: [
      { id: "lens", index: "01", label: "Tempered Glass", note: "AR coated" },
      { id: "crown", index: "02", label: "Alloy Shell", note: "Machined, anodised" },
      { id: "knurl", index: "03", label: "Bezel Knurl", note: "Grip for removal" },
      { id: "collar", index: "04", label: "Light Seal", note: "No edge bleed" },
      { id: "core", index: "05", label: "Logic Board", note: "Automotive grade" },
      { id: "base", index: "06", label: "Magnetic Base", note: "Residue free" },
    ],
    fits: ["bmw", "audi", "vw", "seat", "mercedes", "toyota", "renault"],
    stock: 15,
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const byCategory = (slug: CategorySlug) =>
  PRODUCTS.filter((p) => p.category === slug);
export const featured = () => PRODUCTS.filter((p) => p.featured);

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(n);
