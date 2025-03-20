"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

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
