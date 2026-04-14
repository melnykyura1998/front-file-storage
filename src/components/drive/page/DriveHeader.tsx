import { Breadcrumbs } from "../Breadcrumbs";
import type { FolderItem } from "../../../store/types";

interface DriveHeaderProps {
  breadcrumbs: FolderItem[];
  loading: boolean;
  onRootClick: () => void;
  onSelectBreadcrumb: (folderId: string) => void;
  successMessage: string | null;
}

export function DriveHeader({
  breadcrumbs,
  loading,
  onRootClick,
  onSelectBreadcrumb,
  successMessage,
}: DriveHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Collaborative file drive
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Manage folders, images, and visibility.
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={loading ? "Syncing" : "Synced"} />
          {successMessage ? <StatusBadge label={successMessage} /> : null}
        </div>
      </div>

      <Breadcrumbs
        items={breadcrumbs}
        onRootClick={onRootClick}
        onSelect={onSelectBreadcrumb}
      />
    </header>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-200">
      {label}
    </span>
  );
}
