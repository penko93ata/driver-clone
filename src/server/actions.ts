"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table, folderCreationSchema } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { MUTATIONS } from "./db/queries";
import { revalidatePath } from "next/cache";

const utApi = new UTApi();

export async function deleteFile(id: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, id), eq(files_table.ownerId, session.userId)),
    );

  if (!file) {
    return { error: "File not found" };
  }

  const utApiResponse = await utApi.deleteFiles([
    file.url.replace("https://13sqmydxbz.ufs.sh/f/", ""),
  ]);

  if (!utApiResponse.success) {
    return { error: "Failed to delete file" };
  }

  await db
    .delete(files_table)
    .where(
      and(eq(files_table.id, id), eq(files_table.ownerId, session.userId)),
    );

  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export type FormState = {
  message: string;
  fields?: Record<string, string[]>;
  issues?: string[];
};

export async function createFolder(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();

  if (!session.userId) {
    return { message: "Unauthorized" };
  }

  const parentId = formData.get("parentFolderId");
  const name = formData.get("folderName");

  const parsed = folderCreationSchema.safeParse({
    name: name,
    parent: Number(parentId),
  });

  if (!parsed.success) {
    const fields: Record<string, string[]> = {};
    Array.from(formData.entries()).forEach(([key, value]) => {
      fields[key] = [value.toString()];
    });
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const folderId = await MUTATIONS.createFolder({
    folder: {
      name: name as string,
      parent: parentId ? Number(parentId) : null,
    },
    userId: session.userId,
  });

  revalidatePath(`/f/${parentId}`);

  return { message: "Folder created successfully" };
}

export async function renameFolder(prevState: FormState, formData: FormData) {
  const session = await auth();
  if (!session.userId) {
    return { message: "Unauthorized" };
  }

  const parentId = formData.get("parentFolderId");
  const name = formData.get("folderName");

  const parsed = folderCreationSchema.safeParse({
    name: name,
    parent: Number(parentId),
  });

  if (!parsed.success) {
    const fields: Record<string, string[]> = {};
    Array.from(formData.entries()).forEach(([key, value]) => {
      fields[key] = [value.toString()];
    });
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  await MUTATIONS.renameFolder({
    folderId: Number(parentId),
    name: name as string,
    userId: session.userId,
  });

  return { message: "Folder renamed successfully" };
}

export async function deleteFolder(folderId: number) {
  const session = await auth();
  if (!session.userId) {
    return { message: "Unauthorized" };
  }

  if (!folderId) return { error: "Folder not found" };

  await MUTATIONS.deleteFoldersAndFiles({
    folderId,
    userId: session.userId,
  });

  revalidatePath(`/f/${folderId}`);

  return { message: "Folder deleted successfully" };
}
