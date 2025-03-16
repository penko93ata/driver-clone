import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "~/server/db/schema";
import DriveContents from "./drive-contents";

export default async function GoogleDriveClone() {
  const folders = await db.select().from(foldersSchema);
  const files = await db.select().from(filesSchema);

  return <DriveContents files={files} folders={folders} />;
}
