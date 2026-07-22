export type TaveloColor = {
  slug: string;
  name: string;
  swatch: string;
  image: string;
  sku: string;
};

export type TaveloModel = {
  slug: string;
  name: string;
  family: "AROW Race" | "AROW SL" | "Arden" | "GROW" | "WILD";
  category: "Road race" | "All-road" | "Gravel";
  price: number;
  weight: string;
  carbon: string;
  tireClearance: string;
  tagline: string;
  description: string;
  heroColorSlug: string;
  colors: TaveloColor[];
  specs: Array<{ label: string; value: string }>;
};

export const taveloModels: TaveloModel[] = [
  {
    slug: "arow-race",
    name: "TAVELO AROW Race",
    family: "AROW Race",
    category: "Road race",
    price: 165000,
    weight: "820 г",
    carbon: "Toray T800 carbon",
    tireClearance: "до 32 мм",
    tagline: "Аэродинамическая шоссейная рама для гонок и быстрых групповых заездов.",
    description:
      "AROW Race - главная гоночная платформа Tavelo: обтекаемые трубы, интегрированная проводка, жесткая карбоновая база и несколько ярких SKU для индивидуальной сборки.",
    heroColorSlug: "zebra",
    colors: [
      { slug: "zebra", name: "Zebra", swatch: "#d7d8ce", image: "/media/tavelo/arow-race-zebra.png", sku: "tavelo-arow-race-zebra" },
      { slug: "watt", name: "WATT", swatch: "#e7e1d7", image: "/media/tavelo/arow-race-watt.png", sku: "tavelo-arow-race-watt" },
      { slug: "neo-blue", name: "Neo Blue", swatch: "#315fbc", image: "/media/tavelo/arow-race-neo-blue.png", sku: "tavelo-arow-race-neo-blue" },
      { slug: "polestar", name: "Polestar", swatch: "#5e6b8d", image: "/media/tavelo/arow-race-polestar.png", sku: "tavelo-arow-race-polestar" },
      { slug: "geo", name: "GEO", swatch: "#1b1f23", image: "/media/tavelo/arow-race-geo.png", sku: "tavelo-arow-race-geo" },
      { slug: "ludicrous", name: "Ludicrous", swatch: "#2b2528", image: "/media/tavelo/arow-race-ludicrous.png", sku: "tavelo-arow-race-ludicrous" },
      { slug: "alpha", name: "Alpha", swatch: "#b8bab7", image: "/media/tavelo/arow-race-alpha.png", sku: "tavelo-arow-race-alpha" }
    ],
    specs: [
      { label: "Цена", value: "165 000 ₽" },
      { label: "Вес", value: "820 г" },
      { label: "Карбон", value: "Toray T800 carbon" },
      { label: "Назначение", value: "Road race" }
    ]
  },
  {
    slug: "arow-sl",
    name: "TAVELO AROW SL",
    family: "AROW SL",
    category: "Road race",
    price: 215000,
    weight: "710 г",
    carbon: "Toray T1100 carbon",
    tireClearance: "до 32 мм",
    tagline: "Сверхлегкая гоночная рама с аэродинамической формой AROW.",
    description:
      "AROW SL делает акцент на весе и премиальном карбоне Toray T1100, сохраняя гоночную геометрию и чистую интеграцию Tavelo.",
    heroColorSlug: "neo-black",
    colors: [
      { slug: "neo-black", name: "Neo Black", swatch: "#101010", image: "/media/tavelo/arow-sl-neo-black.png", sku: "tavelo-arow-sl-neo-black" },
      { slug: "plaid", name: "Plaid", swatch: "#3d4051", image: "/media/tavelo/arow-sl-plaid.png", sku: "tavelo-arow-sl-plaid" }
    ],
    specs: [
      { label: "Цена", value: "215 000 ₽" },
      { label: "Вес", value: "710 г" },
      { label: "Карбон", value: "Toray T1100 carbon" },
      { label: "Назначение", value: "Light race" }
    ]
  },
  {
    slug: "arden",
    name: "TAVELO Arden",
    family: "Arden",
    category: "All-road",
    price: 245000,
    weight: "650 г",
    carbon: "Toray carbon TBC",
    tireClearance: "до 40 мм",
    tagline: "Легкая универсальная шоссейная рама нового поколения.",
    description:
      "Arden - новинка 2026 для длинных дистанций и быстрых дорог. Очень низкий вес, запас под широкие покрышки и спокойная универсальная посадка.",
    heroColorSlug: "gloss-silver-metallic",
    colors: [
      { slug: "gloss-silver-metallic", name: "Gloss Silver Metallic", swatch: "#d9dbd6", image: "/media/tavelo/arden-race-gloss-silver.png", sku: "tavelo-arden-race-frameset" }
    ],
    specs: [
      { label: "Цена", value: "245 000 ₽" },
      { label: "Вес", value: "650 г" },
      { label: "Покрышки", value: "до 40 мм" },
      { label: "Год", value: "новинка 2026" }
    ]
  },
  {
    slug: "grow",
    name: "TAVELO GROW",
    family: "GROW",
    category: "Gravel",
    price: 165000,
    weight: "895 г",
    carbon: "Toray T800 carbon",
    tireClearance: "до 55 мм",
    tagline: "Быстрая аэрогравийная рама для гонок, путешествий и плохих дорог.",
    description:
      "GROW соединяет аэродинамику и практичность: широкие покрышки, готовность к багажу и регулируемому подседельному штырю, чистая карбоновая платформа для быстрой гравийной сборки.",
    heroColorSlug: "cyber-pink",
    colors: [
      { slug: "cyber-pink", name: "Cyber Pink", swatch: "#b65ba6", image: "/media/tavelo/grow-cyber-pink.png", sku: "tavelo-grow" },
      { slug: "carbon", name: "Carbon", swatch: "#151515", image: "/media/tavelo/grow-cp.webp", sku: "tavelo-grow-carbon" }
    ],
    specs: [
      { label: "Цена", value: "165 000 ₽" },
      { label: "Вес", value: "895 г" },
      { label: "Покрышки", value: "до 55 мм" },
      { label: "Назначение", value: "Aero gravel" }
    ]
  },
  {
    slug: "wild",
    name: "TAVELO WILD",
    family: "WILD",
    category: "Gravel",
    price: 134000,
    weight: "960 г",
    carbon: "Toray T800 carbon",
    tireClearance: "до 50 мм",
    tagline: "Гравийная рама на каждый день для асфальта и грунтовок.",
    description:
      "WILD - более доступная и практичная gravel-платформа Tavelo: запас под широкую резину, спокойная геометрия и карбон T800 для повседневных маршрутов.",
    heroColorSlug: "wild",
    colors: [
      { slug: "wild", name: "Wild", swatch: "#303435", image: "/media/tavelo/wild.webp", sku: "tavelo-wild" }
    ],
    specs: [
      { label: "Цена", value: "134 000 ₽" },
      { label: "Вес", value: "960 г" },
      { label: "Покрышки", value: "до 50 мм" },
      { label: "Назначение", value: "Daily gravel" }
    ]
  }
];

export const taveloCockpit = {
  name: "TAVELO Rise Handlebar",
  price: 28000,
  weight: "285 г",
  image: "/media/tavelo/rise-cockpit.png",
  description: "Карбоновый аэроруль с интегрированным выносом для сборок Tavelo AROW."
};

export function formatTaveloPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

export function getTaveloModelBySlug(slug: string) {
  return taveloModels.find((model) => model.slug === slug);
}

export function getTaveloHeroColor(model: TaveloModel) {
  return model.colors.find((color) => color.slug === model.heroColorSlug) ?? model.colors[0];
}
