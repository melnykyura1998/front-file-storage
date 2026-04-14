import type { SVGProps } from "react";

type IconName =
  | "folder"
  | "file"
  | "upload"
  | "search"
  | "lock"
  | "globe"
  | "arrowUp"
  | "arrowDown"
  | "copy"
  | "share"
  | "trash"
  | "edit"
  | "logout";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const paths: Record<IconName, string> = {
  folder:
    "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Z",
  file: "M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z",
  upload: "M12 16V4m0 0-4 4m4-4 4 4M5 20h14",
  search: "m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
  lock: "M7 10V7a5 5 0 1 1 10 0v3m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z",
  globe:
    "M12 2a10 10 0 1 0 0 20m0-20c2.5 2.7 4 6.4 4 10s-1.5 7.3-4 10m0-20C9.5 4.7 8 8.4 8 12s1.5 7.3 4 10m-9-10h18",
  arrowUp: "m12 5-5 5m5-5 5 5M12 5v14",
  arrowDown: "m12 19 5-5m-5 5-5-5m5 5V5",
  copy: "M9 9h11v11H9zM4 4h11v11",
  share:
    "M14 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 11.4l6.8-3.8M8.6 12.6l6.8 3.8",
  trash:
    "M4 7h16m-10 4v6m4-6v6M8 7l1-3h6l1 3m-9 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13",
  edit: "M4 20h4l10-10-4-4L4 16v4Zm11-13 4 4",
  logout:
    "M10 17v2a2 2 0 0 0 2 2h7M14 12H3m0 0 4-4m-4 4 4 4M21 3h-9a2 2 0 0 0-2 2v2",
};

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
