import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { DB_FolderType } from "~/server/db/schema";

type DriveBreadcrumbsProps = {
  parents: DB_FolderType[];
  currentFolderId: number;
};

export function DriveBreadcrumbs({
  parents,
  currentFolderId,
}: DriveBreadcrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {parents.map((folder, index) => (
          <Fragment key={folder.id}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {currentFolderId === folder.id ? (
                <BreadcrumbPage className="text-gray-400">
                  {folder.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={`/f/${folder.id}`}
                  className="text-gray-300 hover:text-white"
                >
                  {folder.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
