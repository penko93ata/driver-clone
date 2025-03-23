"use client";

import type { files_table, folders_table } from "~/server/db/schema";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";
import { FileRow, FolderRow } from "./file-row";
import { Button } from "~/components/ui/button";
import { createFolder } from "~/server/actions";
import { DriveBreadcrumbs } from "./drive-breadcrumbs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

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
          <DriveBreadcrumbs
            parents={parents}
            currentFolderId={currentFolderId}
          />
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Folder</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new folder</DialogTitle>
              <DialogDescription>
                Create a new folder in {currentFolderId}
              </DialogDescription>
            </DialogHeader>
            <form action={createFolder} id="createFolderForm">
              <input
                type="hidden"
                name="parentFolderId"
                value={currentFolderId}
              />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="folderName" className="text-right">
                  Name
                </Label>
                <Input
                  id="folderName"
                  name="folderName"
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button">Cancel</Button>
                </DialogClose>
                <Button form="createFolderForm" type="submit">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
