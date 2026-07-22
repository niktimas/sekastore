import { headers } from "next/headers";

export type AdminBrand = "seka" | "tavelo";

export const adminBrands: Record<AdminBrand, { label: string; siteUrl: string; title: string }> = {
  seka: {
    label: "SEKA",
    siteUrl: "https://seka-bike.ru",
    title: "SEKA Carbonara Bike"
  },
  tavelo: {
    label: "Tavelo",
    siteUrl: "https://tavelo.ru",
    title: "Tavelo Carbonara Bike"
  }
};

export function normalizeAdminBrand(value?: string | string[] | null): AdminBrand | null {
  const brand = Array.isArray(value) ? value[0] : value;
  return brand === "tavelo" || brand === "seka" ? brand : null;
}

export async function resolveAdminBrand(searchParams?: { brand?: string | string[] }): Promise<AdminBrand> {
  const explicit = normalizeAdminBrand(searchParams?.brand);
  if (explicit) {
    return explicit;
  }

  const host = (await headers()).get("host")?.toLowerCase() ?? "";
  return host.includes("tavelo.ru") ? "tavelo" : "seka";
}

export function adminHref(path: string, brand: AdminBrand) {
  return `${path}?brand=${brand}`;
}

export function isTaveloText(value?: string | null) {
  return Boolean(value?.toLowerCase().includes("tavelo"));
}
