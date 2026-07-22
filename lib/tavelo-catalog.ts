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
  category: "Шоссейная гонка" | "Шоссе / выносливость" | "Гравий";
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
    name: "Tavelo AROW Race",
    family: "AROW Race",
    category: "Шоссейная гонка",
    price: 165000,
    weight: "820 г",
    carbon: "карбон Toray T800",
    tireClearance: "до 32 мм",
    tagline: "Аэродинамический шоссейный фреймсет для гонок, быстрых групповых заездов и жесткой спортивной сборки.",
    description:
      "AROW Race - гоночная платформа Tavelo с обтекаемыми трубами, внутренней проводкой и жесткой карбоновой базой. Хороший выбор, когда нужен быстрый шоссейный велосипед без компромисса по посадке и управлению.",
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
      { label: "Цена фреймсета", value: "165 000 ₽" },
      { label: "Вес рамы", value: "820 г" },
      { label: "Материал", value: "карбон Toray T800" },
      { label: "Покрышки", value: "до 32 мм" }
    ]
  },
  {
    slug: "arow-sl",
    name: "Tavelo AROW SL",
    family: "AROW SL",
    category: "Шоссейная гонка",
    price: 215000,
    weight: "710 г",
    carbon: "карбон Toray T1100",
    tireClearance: "до 32 мм",
    tagline: "Сверхлегкий гоночный фреймсет с аэродинамической формой AROW и премиальным карбоном.",
    description:
      "AROW SL делает акцент на низком весе и отзывчивости. Это фреймсет для тех, кто хочет сохранить гоночную аэродинамику, но получить максимально легкую основу для кастомной сборки.",
    heroColorSlug: "neo-black",
    colors: [
      { slug: "neo-black", name: "Neo Black", swatch: "#101010", image: "/media/tavelo/arow-sl-neo-black.png", sku: "tavelo-arow-sl-neo-black" },
      { slug: "plaid", name: "Plaid", swatch: "#3d4051", image: "/media/tavelo/arow-sl-plaid.png", sku: "tavelo-arow-sl-plaid" }
    ],
    specs: [
      { label: "Цена фреймсета", value: "215 000 ₽" },
      { label: "Вес рамы", value: "710 г" },
      { label: "Материал", value: "карбон Toray T1100" },
      { label: "Посадка", value: "гоночная" }
    ]
  },
  {
    slug: "arden",
    name: "Tavelo Arden",
    family: "Arden",
    category: "Шоссе / выносливость",
    price: 245000,
    weight: "650 г",
    carbon: "карбон Toray",
    tireClearance: "до 40 мм",
    tagline: "Легкая универсальная шоссейная рама для длинных дистанций, быстрых дорог и широкой резины.",
    description:
      "Arden - новая универсальная платформа Tavelo для длинных заездов. Очень низкий вес, запас под покрышки до 40 мм и спокойная посадка делают ее хорошей основой для быстрого велосипеда на каждый день.",
    heroColorSlug: "gloss-silver-metallic",
    colors: [
      { slug: "gloss-silver-metallic", name: "Gloss Silver Metallic", swatch: "#d9dbd6", image: "/media/tavelo/arden-race-gloss-silver.png", sku: "tavelo-arden-race-frameset" }
    ],
    specs: [
      { label: "Цена фреймсета", value: "245 000 ₽" },
      { label: "Вес рамы", value: "650 г" },
      { label: "Покрышки", value: "до 40 мм" },
      { label: "Год", value: "новинка 2026" }
    ]
  },
  {
    slug: "grow",
    name: "Tavelo GROW",
    family: "GROW",
    category: "Гравий",
    price: 165000,
    weight: "895 г",
    carbon: "карбон Toray T800",
    tireClearance: "до 55 мм",
    tagline: "Быстрый аэрогравийный фреймсет для гонок, путешествий и дорог, где асфальт заканчивается.",
    description:
      "GROW соединяет аэродинамику и практичность: широкие покрышки, готовность к багажу, регулируемый подседельный штырь и чистая карбоновая база для быстрой гравийной сборки.",
    heroColorSlug: "cyber-pink",
    colors: [
      { slug: "cyber-pink", name: "Cyber Pink", swatch: "#b65ba6", image: "/media/tavelo/grow-cyber-pink.png", sku: "tavelo-grow" },
      { slug: "carbon", name: "Carbon", swatch: "#151515", image: "/media/tavelo/grow-cp.webp", sku: "tavelo-grow-carbon" }
    ],
    specs: [
      { label: "Цена фреймсета", value: "165 000 ₽" },
      { label: "Вес рамы", value: "895 г" },
      { label: "Покрышки", value: "до 55 мм" },
      { label: "Назначение", value: "быстрый гравий" }
    ]
  },
  {
    slug: "wild",
    name: "Tavelo WILD",
    family: "WILD",
    category: "Гравий",
    price: 134000,
    weight: "960 г",
    carbon: "карбон Toray T800",
    tireClearance: "до 50 мм",
    tagline: "Гравийная рама на каждый день для асфальта, грунтовок, тренировок и поездок за город.",
    description:
      "WILD - более доступная и практичная гравийная платформа Tavelo. Запас под широкую резину, спокойная геометрия и карбон T800 подходят для повседневных маршрутов и уверенной кастомной сборки.",
    heroColorSlug: "wild",
    colors: [
      { slug: "wild", name: "Wild", swatch: "#303435", image: "/media/tavelo/wild.webp", sku: "tavelo-wild" }
    ],
    specs: [
      { label: "Цена фреймсета", value: "134 000 ₽" },
      { label: "Вес рамы", value: "960 г" },
      { label: "Покрышки", value: "до 50 мм" },
      { label: "Назначение", value: "гравий каждый день" }
    ]
  }
];

export const taveloCockpit = {
  name: "Кокпит Tavelo Rise",
  price: 28000,
  weight: "285 г",
  image: "/media/tavelo/rise-cockpit.png",
  description: "Карбоновый интегрированный кокпит Tavelo для чистой проводки, жесткого переднего узла и аккуратной сборки шоссейного велосипеда."
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
