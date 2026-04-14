import { useState, type FormEvent } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Modal } from "../../ui/Modal";

export interface ShareAccessTarget {
  id: string;
  name: string;
  resourceType: "folder" | "file";
}

interface ShareAccessModalProps {
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    target: ShareAccessTarget,
    payload: { email: string; role: "EDITOR" | "VIEWER" },
  ) => void;
  target: ShareAccessTarget | null;
}

export function ShareAccessModal({
  isLoading,
  isOpen,
  onClose,
  onSubmit,
  target,
}: ShareAccessModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("VIEWER");

  if (!target) {
    return null;
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(target, {
      email,
      role,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title={`Share ${target.resourceType}: ${target.name}`}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={submit}>
        <Input
          label="User email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="teammate@example.com"
          required
        />
        <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <span>Permission</span>
          <select
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            value={role}
            onChange={(event) =>
              setRole(event.target.value as "EDITOR" | "VIEWER")
            }
          >
            <option value="VIEWER">Viewer</option>
            <option value="EDITOR">Editor</option>
          </select>
        </label>
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Sharing..." : "Grant access"}
        </Button>
      </form>
    </Modal>
  );
}
