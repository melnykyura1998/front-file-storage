import { FolderTree } from "../FolderTree";
import { Button } from "../../ui/Button";
import { Icon } from "../../ui/Icon";
import type { FolderTreeNode, User } from "../../../store/types";

interface DriveSidebarProps {
  currentFolderId: string | null;
  onLogout: () => void;
  onSelectFolder: (folderId: string | null) => void;
  tree: FolderTreeNode[];
  user: User | null;
}

export function DriveSidebar({
  currentFolderId,
  onLogout,
  onSelectFolder,
  tree,
  user,
}: DriveSidebarProps) {
  return (
    <aside className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:w-80">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Workspace
          </p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {user?.name ?? "Drive"}
          </h2>
        </div>
        <Button
          variant="ghost"
          onClick={onLogout}
          aria-label="Logout from drive"
        >
          <Icon name="logout" className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        <p className="font-medium text-slate-900 dark:text-white">
          {user?.email}
        </p>
      </div>

      <div className="mt-6">
        <FolderTree
          nodes={tree}
          currentFolderId={currentFolderId}
          onSelect={onSelectFolder}
        />
      </div>
    </aside>
  );
}
