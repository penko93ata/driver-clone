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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { FilePlus, FilePlus2, FolderPlus, Plus, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function DriveContents(props: {
  files: (typeof files_table.$inferInsert)[];
  folders: (typeof folders_table.$inferInsert)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
}) {
  const { files, folders, parents, currentFolderId } = props;

  const navigate = useRouter();
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(createFolder, {
    message: "",
  });

  useEffect(() => {
    if (!isPending && state?.message === "Folder created successfully") {
      setOpen(false);
      state.message = "";
    }
  }, [isPending, state]);

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
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
        {/* TODO - Edit styling  */}
        {/* TODO - Move functionality to dropdown */}
        {/* TODO - Remove old buttons */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Plus /> Open
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <FilePlus /> New Folder
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create new folder</DialogTitle>
                    <DialogDescription>
                      Create a new folder in {currentFolderId}
                    </DialogDescription>
                  </DialogHeader>
                  {state?.message !== "" && !state.issues && (
                    <div className="text-red-500">{state.message}</div>
                  )}
                  {state?.issues && (
                    <div className="text-red-500">
                      <ul>
                        {state.issues.map((issue) => (
                          <li key={issue} className="flex gap-1">
                            <X fill="red" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <form action={formAction} id="createFolderForm">
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
                      <Button
                        disabled={isPending}
                        form="createFolderForm"
                        type="submit"
                      >
                        Create
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>
                <UploadButton
                  endpoint="driveUploader"
                  input={{ folderId: currentFolderId }}
                  onClientUploadComplete={() => navigate.refresh()}
                />
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <FolderPlus /> Folder Upload
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <UploadButton
          endpoint="driveUploader"
          input={{ folderId: currentFolderId }}
          onClientUploadComplete={() => navigate.refresh()}
        />
      </div>
    </div>
  );
}
