export type InventoryRow = {
  model: string;
  modelSlug: string;
  color: string;
  colorSlug?: string;
  size: string;
  cockpit: string;
  price: number;
  build?: string;
};

export type BuildOption = {
  brand?: string;
  name: string;
  price: number;
  type: "groupset" | "wheels" | "handlebar";
  description?: string;
  imagePath?: string;
  isPreorder?: boolean;
  availability?: "preorder" | "in_stock" | "order";
  ridingStyle?: "road" | "gravel" | "all";
  source?: string;
};

export const readyBikes: InventoryRow[] = [
  {
    model: "SEKA Exceed",
    modelSlug: "exceed-standard",
    color: "Ice Lake Blue",
    colorSlug: "ice-lake-blue",
    size: "L",
    cockpit: "400*100",
    price: 294900,
    build: "Shimano 105 Di2, Superteam, GP 5000 Ultrasport. Собран, 7.7 кг"
  },
  {
    model: "SEKA Exceed RDC",
    modelSlug: "exceed-rdc",
    color: "Seafoam Green",
    colorSlug: "seafoam-green",
    size: "XL (184-193)",
    cockpit: "400*100",
    price: 379900,
    build: "Shimano D2 Ultegra, Superteam, Michelin Power Cup 28. Собран, 7.3 кг"
  }
];

export const frames: InventoryRow[] = [
  {
    model: "SEKA Spear RDC",
    modelSlug: "spear-rdc",
    color: "Nighthawk Blue",
    colorSlug: "nighthawk-blue",
    size: "L",
    cockpit: "395*100",
    price: 249900
  },
  {
    model: "SEKA Exceed",
    modelSlug: "exceed-standard",
    color: "Ice Lake Blue",
    colorSlug: "ice-lake-blue",
    size: "S, M, M, L, XL, XL",
    cockpit: "400*100",
    price: 139800
  },
  {
    model: "SEKA Exceed",
    modelSlug: "exceed-standard",
    color: "Arctic Grey",
    colorSlug: "arctic-grey",
    size: "S, M, M, M, XL, XL",
    cockpit: "400*100",
    price: 139800
  },
  {
    model: "SEKA Exceed",
    modelSlug: "exceed-standard",
    color: "Arctic Grey",
    colorSlug: "arctic-grey",
    size: "XL",
    cockpit: "400*130",
    price: 139800
  },
  {
    model: "SEKA Exaero GR",
    modelSlug: "exaero-gr",
    color: "Mariana Blue",
    colorSlug: "mariana-blue",
    size: "52, 58",
    cockpit: "380/440 *110",
    price: 234000
  },
  {
    model: "SEKA Exaero GR",
    modelSlug: "exaero-gr",
    color: "Mariana Blue",
    colorSlug: "mariana-blue",
    size: "54, 56, 56",
    cockpit: "400/460 *110",
    price: 234000
  }
];

export const buildOptions: BuildOption[] = [
  {
    brand: "L-TWOO",
    name: "eR9 Electronic 12s",
    price: 37000,
    type: "groupset",
    description: "Электронная 12-скоростная группа для шоссейной сборки с аккуратной беспроводной логикой управления и доступным входом в электронное переключение.",
    imagePath: "/media/imported/carbonara-premium/ltwoo-er9.webp",
    isPreorder: true,
    availability: "preorder",
    ridingStyle: "road",
    source: "carbonara-premium.ru"
  },
  {
    brand: "SEKA",
    name: "Exceed Integrated Handlebar",
    price: 39900,
    type: "handlebar",
    description: "Интегрированный карбоновый кокпит SEKA Exceed для чистой внутренней проводки и собранной посадки на шоссейном фреймсете.",
    imagePath: "/media/imported/carbonara-premium/seka-exceed-handlebar.webp",
    isPreorder: true,
    availability: "preorder",
    ridingStyle: "road",
    source: "carbonara-premium.ru"
  },
  {
    brand: "L-TWOO",
    name: "eRX Electronic Carbon 12s",
    price: 48000,
    type: "groupset",
    description: "Карбоновая версия электронной 12-скоростной группы L-TWOO для легкой кастомной сборки с современным переключением.",
    imagePath: "/media/imported/carbonara-premium/ltwoo-erx.webp",
    isPreorder: true,
    availability: "preorder",
    ridingStyle: "road",
    source: "carbonara-premium.ru"
  },
  {
    brand: "Shimano",
    name: "105 Di2 R7150",
    price: 65000,
    type: "groupset",
    description: "Надежная электронная группа Shimano 105 Di2 для шоссейной сборки: точное переключение, 12 скоростей и понятная сервисная база.",
    imagePath: "/media/imported/carbonara-premium/shimano-105-di2.webp",
    isPreorder: true,
    availability: "preorder",
    ridingStyle: "road",
    source: "carbonara-premium.ru"
  },
  {
    brand: "Shimano",
    name: "Ultegra Di2 R8170",
    price: 125000,
    type: "groupset",
    description: "Гоночная электронная группа Shimano Ultegra Di2 с дисковыми тормозами, быстрым переключением и низким весом для серьезной шоссейной сборки.",
    imagePath: "/media/imported/carbonara-premium/shimano-ultegra-di2.webp",
    isPreorder: true,
    availability: "preorder",
    ridingStyle: "road",
    source: "carbonara-premium.ru"
  },
  {
    brand: "SRAM",
    name: "Rival XPLR AXS",
    price: 165000,
    type: "groupset",
    description: "Беспроводная 1x-группа SRAM Rival XPLR AXS для гравия и быстрых смешанных маршрутов с широким диапазоном кассеты.",
    imagePath: "/media/imported/carbonara-premium/sram-rival-xplr-axs.webp",
    isPreorder: true,
    availability: "preorder",
    ridingStyle: "gravel",
    source: "carbonara-premium.ru"
  },
  {
    brand: "SRAM",
    name: "Force XPLR AXS",
    price: 255000,
    type: "groupset",
    description: "Легкая беспроводная гравийная группа SRAM Force XPLR AXS с более высоким уровнем материалов и точной работой под нагрузкой.",
    imagePath: "/media/imported/carbonara-premium/sram-force-xplr-axs.webp",
    isPreorder: true,
    availability: "preorder",
    ridingStyle: "gravel",
    source: "carbonara-premium.ru"
  },
  {
    brand: "SRAM",
    name: "Red XPLR AXS",
    price: 460000,
    type: "groupset",
    description: "Топовая беспроводная гравийная группа SRAM Red XPLR AXS для премиальной сборки с минимальным весом и максимальной скоростью переключения.",
    imagePath: "/media/imported/carbonara-premium/sram-red-xplr-axs.webp",
    isPreorder: true,
    availability: "preorder",
    ridingStyle: "gravel",
    source: "carbonara-premium.ru"
  },
  {
    brand: "SHIMANO",
    name: "SHIMANO Ultegra Di2 8170 12",
    price: 129900,
    type: "groupset",
    description: "Складская шоссейная электронная группа Shimano Ultegra Di2 12-speed для быстрой сборки на Spear или Exceed.",
    isPreorder: false,
    availability: "in_stock",
    ridingStyle: "road"
  },
  {
    brand: "SHIMANO",
    name: "SHIMANO 105 Di2 7170 12 (на дисках Ultegra)",
    price: 89900,
    type: "groupset",
    description: "Складская электронная группа Shimano 105 Di2 12-speed с дисками Ultegra для шоссейной сборки.",
    isPreorder: false,
    availability: "in_stock",
    ridingStyle: "road"
  },
  {
    brand: "SRAM",
    name: "Sram Rival eTap AXS",
    price: 149900,
    type: "groupset",
    description: "Складская беспроводная шоссейная группа SRAM Rival eTap AXS для сборок Spear и Exceed.",
    isPreorder: false,
    availability: "in_stock",
    ridingStyle: "road"
  },
  {
    brand: "ELITE Wheels",
    name: "Карбоновые гравийные колеса ELITE Wheels Aero",
    price: 59900,
    type: "wheels",
    description: "Складские карбоновые гравийные колеса ELITE Wheels Aero для сборки SEKA Exaero GR.",
    isPreorder: false,
    availability: "in_stock",
    ridingStyle: "gravel"
  }
];

export const groupsetOptions = buildOptions.filter((option) => option.type === "groupset");

export const wheelOptions = buildOptions.filter((option) => option.type === "wheels");

export const handlebarOptions = buildOptions.filter((option) => option.type === "handlebar");

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

export function getFrameOptionsForModel(modelSlug: string) {
  return frames.filter((item) => item.modelSlug === modelSlug);
}
