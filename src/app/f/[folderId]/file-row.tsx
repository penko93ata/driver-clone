"use client";

import { FileIcon, Folder as FolderIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { Button } from "~/components/ui/button";
import { deleteFile, deleteFolder } from "~/server/actions";
import { files_table, folders_table } from "~/server/db/schema";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { Spinner } from "~/components/Spinner";

export function FileRow(props: { file: typeof files_table.$inferInsert }) {
  const { file } = props;
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      toast.promise(deleteFile(file.id!), {
        loading: "Deleting file...",
        success: (result) => result.message,
        error: (result) => result.error,
      });
    });
  };

  return (
    <li
      className={twMerge(
        "hover:bg-gray-750 border-b border-gray-700 px-6 py-4",
        isPending && "pointer-events-none opacity-30",
      )}
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center gap-2">
          <FileIcon size={20} />
          <span>{file.name}</span>
        </div>
        <div className="col-span-2 text-gray-400">File</div>
        <div className="col-span-3 text-gray-400">{file.size}</div>
        <div className="col-span-1 text-gray-400">
          <Button
            variant="ghost"
            aria-label="Delete file"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? <Spinner size="sm" /> : <Trash2Icon size={20} />}
          </Button>
        </div>
      </div>
    </li>
  );
}

export function FolderRow(props: {
  folder: typeof folders_table.$inferInsert;
}) {
  const { folder } = props;
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      toast.promise(deleteFolder(folder.id!), {
        loading: "Deleting folder...",
        success: (result) => result.message,
        error: (result) => result.error,
      });
    });
  };

  return (
    <li
      className={twMerge(
        "hover:bg-gray-750 border-b border-gray-700 px-6 py-4",
        isPending && "pointer-events-none opacity-30",
      )}
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center gap-2">
          <FolderIcon size={20} />
          <Link href={`/f/${folder.id}`} className="hover:underline">
            {folder.name}
          </Link>
        </div>
        <div className="col-span-2 text-gray-400">Folder</div>
        <div className="col-span-3 text-gray-400"></div>
        <div className="col-span-1 text-gray-400">
          <Button
            variant="ghost"
            aria-label="Delete folder"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? <Spinner size="sm" /> : <Trash2Icon size={20} />}
          </Button>
        </div>
      </div>
    </li>
  );
}
