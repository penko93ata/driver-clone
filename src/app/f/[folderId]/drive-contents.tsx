"use client";

import { ChevronRight } from "lucide-react";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { redirect, useRouter } from "next/navigation";
import { FileRow, FolderRow } from "./file-row";
import { Button } from "~/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { MUTATIONS } from "~/server/db/queries";
import { createFolder } from "~/server/actions";

export default function DriveContents(props: {
  files: (typeof files_table.$inferInsert)[];
  folders: (typeof folders_table.$inferInsert)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
}) {
  const { files, folders, parents, currentFolderId } = props;

  const navigate = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            {parents.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="mx-2 text-gray-500" size={16} />
                )}
                <Link
                  href={`/f/${folder.id}`}
                  className="text-gray-300 hover:text-white"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          <ul>
            {folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
        <UploadButton
          endpoint="driveUploader"
          input={{ folderId: currentFolderId }}
          onClientUploadComplete={() => navigate.refresh()}
        />
        <form action={createFolder}>
          <input type="hidden" name="parentFolderId" value={currentFolderId} />
          <Button type="submit">Create new folder</Button>
        </form>
      </div>
    </div>
  );
}
