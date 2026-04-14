import type { FormEvent } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Modal } from "../../ui/Modal";

interface CreateFolderModalProps {
  folderName: string;
  isOpen: boolean;
  onChangeFolderName: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function CreateFolderModal({
  folderName,
  isOpen,
  onChangeFolderName,
  onClose,
  onSubmit,
}: CreateFolderModalProps) {
  return (
    <Modal isOpen={isOpen} title="Create folder" onClose={onClose}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Folder name"
          value={folderName}
          onChange={(event) => onChangeFolderName(event.target.value)}
          required
        />
        <Button type="submit" fullWidth>
          Create folder
        </Button>
      </form>
    </Modal>
  );
}
