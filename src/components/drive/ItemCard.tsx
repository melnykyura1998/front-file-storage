import { useMemo, useState } from "react";
import { resolveApiUrl } from "../../api/client";
import type { FileItem, FolderItem } from "../../store/types";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

interface FolderCardProps {
  item: FolderItem;
  onClone: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
}

interface FileCardProps {
  item: FileItem;
  onClone: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onRename: (id: string, name: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
}

export function FolderCard({
  item,
  onClone,
  onDelete,
  onMove,
  onOpen,
  onRename,
  onToggleVisibility,
}: FolderCardProps) {
  return (
    <article className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3 shadow-sm dark:border-amber-900/50 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          onClick={() => onOpen(item.id)}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-900 dark:bg-amber-500/20 dark:text-amber-100">
            <Icon name="folder" className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-semibold text-slate-900 dark:text-white">
              {item.name}
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              {item.isPublic ? "Public folder" : "Private folder"}
            </span>
          </span>
        </button>
        <VisibilityToggle
          isPublic={item.isPublic}
          onToggle={() => onToggleVisibility(item.id, !item.isPublic)}
        />
      </div>
      <ActionRow
        className="mt-3"
        onClone={() => onClone(item.id)}
        onDelete={() => onDelete(item.id)}
        onMoveUp={() => onMove(item.id, "up")}
        onMoveDown={() => onMove(item.id, "down")}
        onRename={() => {
          const nextName = window.prompt("Rename folder", item.name);
          if (nextName) {
            onRename(item.id, nextName);
          }
        }}
      />
    </article>
  );
}

export function FileCard({
  item,
  onClone,
  onDelete,
  onMove,
  onRename,
  onToggleVisibility,
}: FileCardProps) {
  const fileUrl = useMemo(() => resolveApiUrl(item.url), [item.url]);
  const [hasPreviewError, setHasPreviewError] = useState(false);

  return (
    <article className="rounded-2xl border border-sky-200 bg-white p-3 shadow-sm dark:border-sky-900/50 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-label={`Open ${item.name}`}
        >
          {hasPreviewError ? (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
              <Icon name="file" className="h-5 w-5" />
            </span>
          ) : (
            <img
              src={fileUrl}
              alt={`Preview of ${item.name}`}
              className="h-11 w-11 shrink-0 rounded-xl object-cover"
              onError={() => setHasPreviewError(true)}
            />
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900 dark:text-white">
              {item.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatFileSize(item.size)}
            </p>
          </div>
        </a>
        <div className="shrink-0">
          <VisibilityToggle
            isPublic={item.isPublic}
            onToggle={() => onToggleVisibility(item.id, !item.isPublic)}
          />
        </div>
      </div>
      <ActionRow
        className="mt-3"
        onClone={() => onClone(item.id)}
        onDelete={() => onDelete(item.id)}
        onMoveUp={() => onMove(item.id, "up")}
        onMoveDown={() => onMove(item.id, "down")}
        onRename={() => {
          const nextName = window.prompt("Rename file", item.name);
          if (nextName) {
            onRename(item.id, nextName);
          }
        }}
      />
    </article>
  );
}

function VisibilityToggle({
  isPublic,
  onToggle,
}: {
  isPublic: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onToggle}
      aria-label={isPublic ? "Make private" : "Make public"}
    >
      <Icon name={isPublic ? "globe" : "lock"} className="h-4 w-4" />
      {isPublic ? "Public" : "Private"}
    </Button>
  );
}

function ActionRow({
  className,
  onClone,
  onDelete,
  onMoveDown,
  onMoveUp,
  onRename,
}: {
  className?: string;
  onClone: () => void;
  onDelete: () => void;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRename: () => void;
}) {
  return (
    <div className={`mt-4 flex flex-wrap gap-1.5 ${className ?? ""}`}>
      <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={onRename}>
        <Icon name="edit" className="h-4 w-4" />
        Rename
      </Button>
      <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={onClone}>
        <Icon name="copy" className="h-4 w-4" />
        Clone
      </Button>
      <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={onMoveUp}>
        <Icon name="arrowUp" className="h-4 w-4" />
        Up
      </Button>
      <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={onMoveDown}>
        <Icon name="arrowDown" className="h-4 w-4" />
        Down
      </Button>
      <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={onDelete}>
        <Icon name="trash" className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
