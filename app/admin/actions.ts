"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

function intValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(text(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function nullableInt(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function checkbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function availabilityValue(formData: FormData) {
  const value = text(formData, "availability");
  return value || (checkbox(formData, "isPreorder") ? "preorder" : "order");
}

function applicableBrandsValue(formData: FormData) {
  const brands = formData
    .getAll("applicableBrands")
    .filter((value): value is string => typeof value === "string" && ["seka", "tavelo"].includes(value));

  return brands.length ? Array.from(new Set(brands)).join(",") : "seka,tavelo";
}

function nullableId(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createLeadAction(formData: FormData) {
  await requireAdmin();

  await prisma.lead.create({
    data: {
      modelId: nullableId(formData, "modelId"),
      colorId: nullableId(formData, "colorId"),
      sizeId: nullableId(formData, "sizeId"),
      name: text(formData, "name"),
      phone: nullableText(formData, "phone"),
      email: nullableText(formData, "email"),
      city: nullableText(formData, "city"),
      message: nullableText(formData, "message"),
      status: text(formData, "status") || "new"
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
}

export async function updateLeadAction(formData: FormData) {
  await requireAdmin();

  await prisma.lead.update({
    where: { id: text(formData, "id") },
    data: {
      modelId: nullableId(formData, "modelId"),
      colorId: nullableId(formData, "colorId"),
      sizeId: nullableId(formData, "sizeId"),
      name: text(formData, "name"),
      phone: nullableText(formData, "phone"),
      email: nullableText(formData, "email"),
      city: nullableText(formData, "city"),
      message: nullableText(formData, "message"),
      status: text(formData, "status") || "new"
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
}

export async function deleteLeadAction(formData: FormData) {
  await requireAdmin();

  await prisma.lead.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
}

export async function createInventoryItemAction(formData: FormData) {
  await requireAdmin();

  await prisma.inventoryItem.create({
    data: {
      modelId: text(formData, "modelId"),
      colorId: nullableId(formData, "colorId"),
      sizeId: nullableId(formData, "sizeId"),
      buildOptionId: nullableId(formData, "buildOptionId"),
      itemType: text(formData, "itemType") || "frame",
      displayModel: nullableText(formData, "displayModel"),
      displayColor: nullableText(formData, "displayColor"),
      displaySize: nullableText(formData, "displaySize"),
      cockpit: nullableText(formData, "cockpit"),
      price: intValue(formData, "price"),
      buildDescription: nullableText(formData, "buildDescription"),
      quantity: nullableInt(formData, "quantity"),
      status: text(formData, "status") || "in_stock",
      isPublished: checkbox(formData, "isPublished"),
      sortOrder: intValue(formData, "sortOrder", 100),
      sourceNote: nullableText(formData, "sourceNote")
    }
  });

  revalidatePath("/inventory");
  revalidatePath("/admin/inventory");
}

export async function updateInventoryItemAction(formData: FormData) {
  await requireAdmin();

  await prisma.inventoryItem.update({
    where: { id: text(formData, "id") },
    data: {
      modelId: text(formData, "modelId"),
      colorId: nullableId(formData, "colorId"),
      sizeId: nullableId(formData, "sizeId"),
      buildOptionId: nullableId(formData, "buildOptionId"),
      itemType: text(formData, "itemType") || "frame",
      displayModel: nullableText(formData, "displayModel"),
      displayColor: nullableText(formData, "displayColor"),
      displaySize: nullableText(formData, "displaySize"),
      cockpit: nullableText(formData, "cockpit"),
      price: intValue(formData, "price"),
      buildDescription: nullableText(formData, "buildDescription"),
      quantity: nullableInt(formData, "quantity"),
      status: text(formData, "status") || "in_stock",
      isPublished: checkbox(formData, "isPublished"),
      sortOrder: intValue(formData, "sortOrder", 100),
      sourceNote: nullableText(formData, "sourceNote")
    }
  });

  revalidatePath("/inventory");
  revalidatePath("/admin/inventory");
}

export async function deleteInventoryItemAction(formData: FormData) {
  await requireAdmin();

  await prisma.inventoryItem.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/inventory");
  revalidatePath("/admin/inventory");
}

export async function createBuildOptionAction(formData: FormData) {
  await requireAdmin();

  await prisma.buildOption.create({
    data: {
      slug: text(formData, "slug"),
      brand: nullableText(formData, "brand"),
      name: text(formData, "name"),
      optionType: text(formData, "optionType") || "groupset",
      price: intValue(formData, "price"),
      description: nullableText(formData, "description"),
      imagePath: nullableText(formData, "imagePath"),
      source: nullableText(formData, "source"),
      isPreorder: availabilityValue(formData) === "preorder",
      availability: availabilityValue(formData),
      ridingStyle: text(formData, "ridingStyle") || "road",
      applicableBrands: applicableBrandsValue(formData),
      sortOrder: intValue(formData, "sortOrder", 100),
      isActive: checkbox(formData, "isActive")
    }
  });

  revalidatePath("/build-options");
  revalidatePath("/tavelo/build-options");
  revalidatePath("/admin/build-options");
}

export async function updateBuildOptionAction(formData: FormData) {
  await requireAdmin();

  await prisma.buildOption.update({
    where: { id: text(formData, "id") },
    data: {
      slug: text(formData, "slug"),
      brand: nullableText(formData, "brand"),
      name: text(formData, "name"),
      optionType: text(formData, "optionType") || "groupset",
      price: intValue(formData, "price"),
      description: nullableText(formData, "description"),
      imagePath: nullableText(formData, "imagePath"),
      source: nullableText(formData, "source"),
      isPreorder: availabilityValue(formData) === "preorder",
      availability: availabilityValue(formData),
      ridingStyle: text(formData, "ridingStyle") || "road",
      applicableBrands: applicableBrandsValue(formData),
      sortOrder: intValue(formData, "sortOrder", 100),
      isActive: checkbox(formData, "isActive")
    }
  });

  revalidatePath("/build-options");
  revalidatePath("/tavelo/build-options");
  revalidatePath("/admin/build-options");
}

export async function deleteBuildOptionAction(formData: FormData) {
  await requireAdmin();

  const id = text(formData, "id");
  try {
    await prisma.buildOption.delete({ where: { id } });
  } catch {
    await prisma.buildOption.update({ where: { id }, data: { isActive: false } });
  }

  revalidatePath("/build-options");
  revalidatePath("/tavelo/build-options");
  revalidatePath("/admin/build-options");
}

export async function updateModelAction(formData: FormData) {
  await requireAdmin();

  await prisma.model.update({
    where: { id: text(formData, "id") },
    data: {
      slug: text(formData, "slug"),
      name: text(formData, "name"),
      version: nullableText(formData, "version"),
      category: text(formData, "category"),
      shortDescription: nullableText(formData, "shortDescription"),
      description: nullableText(formData, "description"),
      sortOrder: intValue(formData, "sortOrder", 100),
      isPublished: checkbox(formData, "isPublished")
    }
  });

  revalidatePath("/");
  revalidatePath("/models");
  revalidatePath("/admin/models");
}

export async function createModelAction(formData: FormData) {
  await requireAdmin();

  await prisma.model.create({
    data: {
      lineId: text(formData, "lineId"),
      slug: text(formData, "slug"),
      name: text(formData, "name"),
      version: nullableText(formData, "version"),
      category: text(formData, "category"),
      shortDescription: nullableText(formData, "shortDescription"),
      description: nullableText(formData, "description"),
      sortOrder: intValue(formData, "sortOrder", 100),
      isPublished: checkbox(formData, "isPublished")
    }
  });

  revalidatePath("/");
  revalidatePath("/models");
  revalidatePath("/admin/models");
}

export async function deleteModelAction(formData: FormData) {
  await requireAdmin();

  const id = text(formData, "id");
  try {
    await prisma.model.delete({ where: { id } });
  } catch {
    await prisma.model.update({
      where: { id },
      data: { isPublished: false }
    });
  }

  revalidatePath("/");
  revalidatePath("/models");
  revalidatePath("/admin/models");
}
