import type { ReactElement } from "react";
import clsx from "clsx";
import type { FolderTreeNode } from "../../store/types";
import { Icon } from "../ui/Icon";

interface FolderTreeProps {
  currentFolderId: string | null;
  nodes: FolderTreeNode[];
  onSelect: (folderId: string | null) => void;
}

export function FolderTree({
  currentFolderId,
  nodes,
  onSelect,
}: FolderTreeProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        className={clsx(
          "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800",
          currentFolderId === null &&
            "bg-slate-100 font-semibold dark:bg-slate-800",
        )}
        onClick={() => onSelect(null)}
      >
        <Icon name="folder" className="h-4 w-4" />
        My Drive
      </button>
      <div className="space-y-1">
        {nodes.map((node) => renderNode(node, currentFolderId, onSelect, 0))}
      </div>
    </div>
  );
}

function renderNode(
  node: FolderTreeNode,
  currentFolderId: string | null,
  onSelect: (folderId: string) => void,
  depth: number,
): ReactElement {
  return (
    <div key={node.id} className="space-y-1">
      <button
        type="button"
        className={clsx(
          "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800",
          currentFolderId === node.id &&
            "bg-slate-100 font-semibold dark:bg-slate-800",
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={() => onSelect(node.id)}
      >
        <span className="flex items-center gap-2">
          <Icon name="folder" className="h-4 w-4" />
          {node.name}
        </span>
        <span className="text-xs text-slate-400">{node.fileCount}</span>
      </button>
      {node.children.map((child) =>
        renderNode(child, currentFolderId, onSelect, depth + 1),
      )}
    </div>
  );
}
