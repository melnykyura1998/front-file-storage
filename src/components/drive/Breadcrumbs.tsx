import type { FolderItem } from "../../store/types";
import { Button } from "../ui/Button";

interface BreadcrumbsProps {
  items: FolderItem[];
  onRootClick: () => void;
  onSelect: (folderId: string) => void;
}

export function Breadcrumbs({
  items,
  onRootClick,
  onSelect,
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm"
    >
      <Button variant="ghost" className="px-0" onClick={onRootClick}>
        Root
      </Button>
      {items.map((item) => (
        <span
          key={item.id}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400"
        >
          <span>/</span>
          <Button
            variant="ghost"
            className="px-0"
            onClick={() => onSelect(item.id)}
          >
            {item.name}
          </Button>
        </span>
      ))}
    </nav>
  );
}
