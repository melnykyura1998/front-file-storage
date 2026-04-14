import { FileCard, FolderCard } from "../ItemCard";
import type { FileItem, FolderItem } from "../../../store/types";

interface DriveContentProps {
  error: string | null;
  files: FileItem[];
  folders: FolderItem[];
  loading: boolean;
  onCloneFile: (id: string) => void;
  onCloneFolder: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onDeleteFolder: (id: string) => void;
  onMoveFile: (id: string, direction: "up" | "down") => void;
  onMoveFolder: (id: string, direction: "up" | "down") => void;
  onOpenFolder: (folderId: string) => void;
  onRenameFile: (id: string, name: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onToggleFileVisibility: (id: string, isPublic: boolean) => void;
  onToggleFolderVisibility: (id: string, isPublic: boolean) => void;
}

export function DriveContent({
  error,
  files,
  folders,
  loading,
  onCloneFile,
  onCloneFolder,
  onDeleteFile,
  onDeleteFolder,
  onMoveFile,
  onMoveFolder,
  onOpenFolder,
  onRenameFile,
  onRenameFolder,
  onToggleFileVisibility,
  onToggleFolderVisibility,
}: DriveContentProps) {
  return (
    <>
      {error ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-200">
          {error}
        </section>
      ) : null}

      {loading ? <DriveLoadingState /> : null}

      <section className="flex flex-wrap gap-4">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            item={folder}
            onOpen={onOpenFolder}
            onRename={onRenameFolder}
            onDelete={onDeleteFolder}
            onClone={onCloneFolder}
            onMove={onMoveFolder}
            onToggleVisibility={onToggleFolderVisibility}
          />
        ))}
        {files.map((file) => (
          <FileCard
            key={file.id}
            item={file}
            onRename={onRenameFile}
            onDelete={onDeleteFile}
            onClone={onCloneFile}
            onMove={onMoveFile}
            onToggleVisibility={onToggleFileVisibility}
          />
        ))}
      </section>

      {!loading && folders.length === 0 && files.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            No items yet
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create a folder or upload a JPEG, PNG, or WebP image to get started.
          </p>
        </section>
      ) : null}
    </>
  );
}

function DriveLoadingState() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-white" />
      <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
        Loading drive content...
      </p>
    </section>
  );
}
