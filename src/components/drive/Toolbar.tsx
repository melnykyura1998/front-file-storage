import { useRef } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Input } from "../ui/Input";

interface ToolbarProps {
  onCreateFolder: () => void;
  onSearch: (value: string) => void;
  onUpload: (file: File) => void;
  searchValue: string;
}

export function Toolbar({
  onCreateFolder,
  onSearch,
  onUpload,
  searchValue,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-1 items-end gap-3">
        <div className="w-full max-w-md">
          <Input
            label="Search files and folders"
            placeholder="Type a file or folder name"
            value={searchValue}
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={onCreateFolder}>
          New folder
        </Button>
      </div>
      <div className="flex gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            const nextFile = event.target.files?.[0];
            if (nextFile) {
              onUpload(nextFile);
              event.target.value = "";
            }
          }}
        />
        <Button onClick={() => fileInputRef.current?.click()}>
          <Icon name="upload" className="h-4 w-4" />
          Upload image
        </Button>
      </div>
    </div>
  );
}
