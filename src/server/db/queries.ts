import "server-only";

import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "~/server/db/schema";
import { and, asc, eq, isNull } from "drizzle-orm";

export const QUERIES = {
  getFolders: function (folderId: number) {
    return db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.parent, folderId))
      .orderBy(foldersSchema.id);
  },
  getFiles: function (folderId: number) {
    return db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.parent, folderId))
      .orderBy(filesSchema.id);
  },
  getAllParentsForFolder: async function (folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(foldersSchema)
        .where(eq(foldersSchema.id, currentId));

      if (!folder[0]) {
        throw new Error("Parent folder not found");
      }
      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }
    return parents;
  },
  getFolderById: async function (folderId: number) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId));
    return folder[0];
  },

  getRootFolderForUser: async function (userId: string) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(
        and(eq(foldersSchema.ownerId, userId), isNull(foldersSchema.parent)),
      );
    return folder[0];
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
    };
    userId: string;
  }) {
    return await db
      .insert(filesSchema)
      .values({ ...input.file, ownerId: input.userId });
  },
  createFolder: async function (input: {
    folder: {
      name: string;
      parent: number | null;
    };
    userId: string;
  }) {
    const folder = await db
      .insert(foldersSchema)
      .values({ ...input.folder, ownerId: input.userId })
      .$returningId();

    return folder[0]?.id;
  },
  renameFolder: async function (input: {
    folderId: number;
    name: string;
    userId: string;
  }) {
    await db
      .update(foldersSchema)
      .set({ name: input.name })
      .where(
        and(
          eq(foldersSchema.id, input.folderId),
          eq(foldersSchema.ownerId, input.userId),
        ),
      );
  },
  deleteFoldersAndFiles: async function (input: {
    folderId: number;
    userId: string;
  }) {
    // await db
    //   .delete(foldersSchema)
    //   .where(
    //     and(
    //       eq(foldersSchema.id, input.folderId),
    //       eq(foldersSchema.ownerId, input.userId),
    //     ),
    //   );

    // Fetch all folders that have this folder as a parent
    const folders = await db
      .select()
      .from(foldersSchema)
      .where(
        and(
          eq(foldersSchema.parent, input.folderId),
          eq(foldersSchema.ownerId, input.userId),
        ),
      );

    // Delete all folders that have this folder as a parent
    await db
      .delete(foldersSchema)
      .where(
        and(
          eq(foldersSchema.parent, input.folderId),
          eq(foldersSchema.ownerId, input.userId),
        ),
      );

    // Delete all files that have this folder as a parent
    await db
      .delete(filesSchema)
      .where(
        and(
          eq(filesSchema.parent, input.folderId),
          eq(filesSchema.ownerId, input.userId),
        ),
      );
  },
  onboardUser: async function (userId: string) {
    const rootFolder = await db
      .insert(foldersSchema)
      .values({ name: "Root", ownerId: userId, parent: null })
      .$returningId();

    const rootFolderId = rootFolder[0]?.id;

    if (!rootFolderId) {
      throw new Error("Failed to create root folder");
    }

    await db.insert(foldersSchema).values([
      {
        name: "Trash",
        ownerId: userId,
        parent: rootFolderId,
      },
      {
        name: "Shared",
        ownerId: userId,
        parent: rootFolderId,
      },
      {
        name: "Documents",
        ownerId: userId,
        parent: rootFolderId,
      },
    ]);

    return rootFolderId;
  },
};
