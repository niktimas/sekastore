export type BikeColor = {
  slug: string;
  name: string;
  swatch: string;
  image: string;
  sourceFilename: string;
};

export type BikeModel = {
  slug: string;
  name: string;
  line: "Spear" | "Exceed" | "Exaero";
  version: "Standard" | "RDC" | "GR";
  category: "Шоссейный гоночный" | "Шоссейный endurance-race" | "Гравийный";
  tagline: string;
  description: string;
  sizes: string[];
  heroColorSlug: string;
  colors: BikeColor[];
  specs: Array<{ label: string; value: string }>;
};

export const bikeModels: BikeModel[] = [
  {
    slug: "spear-rdc",
    name: "SEKA Spear RDC",
    line: "Spear",
    version: "RDC",
    category: "Шоссейный гоночный",
    tagline: "Фреймсет SEKA SPEAR RDC: максимальная аэродинамика для высоких скоростей.",
    description:
      "Spear RDC разработан с учетом требований профессиональных райдеров. Премиальный карбон TeXtreme-Framework Foundation, технология True One-Piece Molding, комплектный руль Rapier и полностью внутренняя проводка дают легкую, жесткую и предельно собранную платформу для гонок.",
    sizes: ["XS", "S", "M", "L", "XL"],
    heroColorSlug: "nighthawk-blue",
    colors: [
      { slug: "chronos", name: "Chronos", swatch: "#b5b0a5", image: "/media/models-clean/seka/spear-rdc/chronos.webp", sourceFilename: "chronos.png" },
      { slug: "meteor-pink", name: "Meteor Pink", swatch: "#d9a2b1", image: "/media/models-clean/seka/spear-rdc/meteor-pink.webp", sourceFilename: "meteor pink.png" },
      { slug: "nighthawk-blue", name: "Nighthawk Blue", swatch: "#263a56", image: "/media/models-clean/seka/spear-rdc/nighthawk-blue.webp", sourceFilename: "nighthawk blue.png" },
      { slug: "shadow-black", name: "Shadow Black", swatch: "#121315", image: "/media/models-clean/seka/spear-rdc/shadow-black.webp", sourceFilename: "shadow black.png" },
      { slug: "solar-bronze", name: "Solar Bronze", swatch: "#9c6843", image: "/media/models-clean/seka/spear-rdc/solar-bronze.webp", sourceFilename: "solar bronze.png" },
      { slug: "thorian-purple", name: "Thorian Purple", swatch: "#6a5484", image: "/media/models-clean/seka/spear-rdc/thorian-purple.webp", sourceFilename: "thorian purple.png" },
      { slug: "ultra-white", name: "Ultra White", swatch: "#f4f3ee", image: "/media/models-clean/seka/spear-rdc/ultra-white.webp", sourceFilename: "ultra white.png" }
    ],
    specs: [
      { label: "Материал", value: "TeXtreme-Framework Foundation" },
      { label: "Вес рамы", value: "685 г, размер M, без покраски" },
      { label: "Вилка", value: "Карбон, 360 г" },
      { label: "Покрышки", value: "До 32 мм" },
      { label: "Руль", value: "Rapier Integrated Cockpit" },
      { label: "Проводка", value: "Полная внутренняя, Di2/eTap/механика" },
      { label: "Тормоза", value: "Дисковые, flat mount" },
      { label: "Оси", value: "12x100 мм / 12x142 мм" },
      { label: "Сертификация", value: "UCI Approved" }
    ]
  },
  {
    slug: "spear-standard",
    name: "SEKA Spear Standard",
    line: "Spear",
    version: "Standard",
    category: "Шоссейный гоночный",
    tagline: "SEKA SPEAR Standard. Гоночный фреймсет с оптимальным балансом цены и технологии.",
    description:
      "Spear Standard сохраняет продвинутую аэродинамическую геометрию, внутреннюю интеграцию тросов и совместимость с современными трансмиссиями. Отличие от RDC - более простое слоение карбона, благодаря которому модель становится доступнее.",
    sizes: ["XS", "S", "M", "L", "XL"],
    heroColorSlug: "twilight-blue",
    colors: [
      { slug: "achromatic-silver", name: "Achromatic Silver", swatch: "#c9c9c4", image: "/media/models-clean/seka/spear/achromatic-silver.webp", sourceFilename: "achromatic silver.png" },
      { slug: "borealis-blue", name: "Borealis Blue", swatch: "#395569", image: "/media/models/spear-standard/borealis-blue.png", sourceFilename: "borealis blue.png" },
      { slug: "cosmic-beige", name: "Cosmic Beige", swatch: "#d0c0a5", image: "/media/models-clean/seka/spear/cosmic-beige.webp", sourceFilename: "cosmic beige.png" },
      { slug: "frosty-blue", name: "Frosty Blue", swatch: "#b7d1dc", image: "/media/models-clean/seka/spear/frosty-blue.webp", sourceFilename: "frosty blue.png" },
      { slug: "mint-green", name: "Mint Green", swatch: "#99c7af", image: "/media/models-clean/seka/spear/mint-green.webp", sourceFilename: "mint green.png" },
      { slug: "twilight-blue", name: "Twilight Blue", swatch: "#324b79", image: "/media/models-clean/seka/spear/twilight-blue.webp", sourceFilename: "twilight blue.png" }
    ],
    specs: [
      { label: "Материал", value: "TeXtreme-Framework Foundation" },
      { label: "Вес рамы", value: "Около 720 г, размер M, без окраски" },
      { label: "Вилка", value: "Карбон, около 360 г" },
      { label: "Покрышки", value: "До 32 мм" },
      { label: "Руль", value: "Rapier Integrated Cockpit, опционально" },
      { label: "Проводка", value: "Внутренняя, Di2/eTap/механика" },
      { label: "Тормоза", value: "Дисковые, flat mount" },
      { label: "Оси", value: "12x100 мм / 12x142 мм" },
      { label: "Сертификация", value: "UCI" }
    ]
  },
  {
    slug: "exceed-rdc",
    name: "SEKA Exceed RDC",
    line: "Exceed",
    version: "RDC",
    category: "Шоссейный endurance-race",
    tagline: "SEKA EXCEED RDC. Аэродинамический фреймсет гоночного уровня, в котором сочетаются легкость, технологичность и комфорт для длительных заездов.",
    description:
      "Exceed RDC сочетает нацеленную на скорость геометрию с дополнительным комфортом. Карбон Toray T1100/T800, оптимизированная аэродинамика труб, интегрированный GEN 2 Cockpit и полностью скрытая проводка делают модель сильной платформой для гранфондо и динамичного шоссе.",
    sizes: ["XS", "S", "M", "L", "XL"],
    heroColorSlug: "lightspeed",
    colors: [
      { slug: "charcoal-matte-black", name: "Charcoal Matte Black", swatch: "#181817", image: "/media/models/exceed-rdc/charcoal-matte-black.png", sourceFilename: "Charcoal matte black.png" },
      { slug: "lightspeed", name: "Lightspeed", swatch: "#c6ced0", image: "/media/models/exceed-rdc/lightspeed.png", sourceFilename: "lightspeed.png" },
      { slug: "pearl-white", name: "Pearl White", swatch: "#efeee7", image: "/media/models/exceed-rdc/pearl-white.png", sourceFilename: "pearl white.png" },
      { slug: "seafoam-green", name: "Seafoam Green", swatch: "#9dbdb0", image: "/media/models/exceed-rdc/seafoam-green.png", sourceFilename: "seaform green.png" },
      { slug: "turismo-silver-metallic", name: "Turismo Silver Metallic", swatch: "#a5a89f", image: "/media/models/exceed-rdc/turismo-silver-metallic.png", sourceFilename: "turismo silver metallic.png" }
    ],
    specs: [
      { label: "Материал", value: "Toray T1100 + T800" },
      { label: "Вес рамы", value: "Около 720 г, размер M, без покраски" },
      { label: "Вилка", value: "Карбон, около 360 г" },
      { label: "Руль", value: "GEN 2 Integrated Cockpit" },
      { label: "Покрышки", value: "До 30 мм" },
      { label: "Геометрия", value: "Endurance-race" },
      { label: "Тормоза", value: "Дисковые, flat mount" },
      { label: "Оси", value: "12x100 мм / 12x142 мм" },
      { label: "Сертификация", value: "UCI Approved" }
    ]
  },
  {
    slug: "exceed-standard",
    name: "SEKA Exceed Standard",
    line: "Exceed",
    version: "Standard",
    category: "Шоссейный endurance-race",
    tagline: "SEKA EXCEED Standard. Комфорт и скорость в одной геометрии.",
    description:
      "Exceed Standard объединяет аэродинамическую геометрию, стабильность и комфорт. В комплект входят рама, интегрированный руль GEN 2, вилка, подседельный штырь и оси. Полностью внутренняя проводка и карбон T1100/T800 дают отзывчивую платформу для разных дорог.",
    sizes: ["XS", "S", "M", "L", "XL"],
    heroColorSlug: "ice-lake-blue",
    colors: [
      { slug: "arctic-grey", name: "Arctic Grey", swatch: "#b9b9b3", image: "/media/models-clean/seka/exceed/arctic-grey.webp", sourceFilename: "arcticgrey.png" },
      { slug: "aurora-green", name: "Aurora Green", swatch: "#7aa092", image: "/media/models-clean/seka/exceed/aurora-green.webp", sourceFilename: "aurora green.png" },
      { slug: "ice-lake-blue", name: "Ice Lake Blue", swatch: "#a9c9d8", image: "/media/models/exceed-standard/ice-lake-blue.png", sourceFilename: "ice lake blue.png" },
      { slug: "lilac-dream", name: "Lilac Dream", swatch: "#b6a8ce", image: "/media/models/exceed-standard/lilac-dream.png", sourceFilename: "lilac dream.png" }
    ],
    specs: [
      { label: "Материал", value: "Карбон T1100 + T800" },
      { label: "Вес рамы", value: "Около 760 г, размер M, без покраски" },
      { label: "Комплект", value: "Рама, GEN 2 cockpit, вилка, подседельный штырь, оси" },
      { label: "Покрышки", value: "До 30 мм" },
      { label: "Проводка", value: "Полная внутренняя" },
      { label: "Трансмиссии", value: "Di2, eTap, механика" },
      { label: "Тормоза", value: "Дисковые, flat mount" },
      { label: "Оси", value: "12x100 мм / 12x142 мм" }
    ]
  },
  {
    slug: "exaero-gr",
    name: "SEKA Exaero GR",
    line: "Exaero",
    version: "GR",
    category: "Гравийный",
    tagline: "Топовый гравийный фреймсет для максимальной скорости и проходимости.",
    description:
      "Exaero GR создан для быстрых гравийных гонок. Конструкция Wind Eye и Extended Tail Glide снижает сопротивление, а совместимость с колесами 650B и 700C и резиной до 56 мм спереди дает широкий диапазон сетапов. Встроенное хранилище и магнитное крепление флягодержателя добавляют практичности без визуального шума.",
    sizes: ["49", "52", "54", "56", "58", "61"],
    heroColorSlug: "mariana-blue",
    colors: [
      { slug: "mariana-blue", name: "Mariana Blue", swatch: "#285270", image: "/media/models/exaero-gr/mariana-blue.jpg", sourceFilename: "mariana blue.jpg" },
      { slug: "stardust-silver", name: "Stardust Silver", swatch: "#c2c0b8", image: "/media/models/exaero-gr/stardust-silver.jpg", sourceFilename: "stardust silver.jpg" }
    ],
    specs: [
      { label: "Материал", value: "Toray T1100 + M46J" },
      { label: "Вес рамы", value: "Около 920 г, размер M" },
      { label: "Технология", value: "True One-Piece Monocoque" },
      { label: "Покрышки", value: "До 56 мм спереди / 52 мм сзади" },
      { label: "Колеса", value: "650B и 700C" },
      { label: "Аэродинамика", value: "Wind Eye + Extended Tail Glide" },
      { label: "Каретка", value: "T47 с резьбой" },
      { label: "Петух", value: "SRAM UDH" }
    ]
  }
];

export function getModelBySlug(slug: string) {
  return bikeModels.find((model) => model.slug === slug);
}

export function getHeroColor(model: BikeModel) {
  return model.colors.find((color) => color.slug === model.heroColorSlug) ?? model.colors[0];
}
