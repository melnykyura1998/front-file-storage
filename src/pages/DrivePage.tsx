import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Breadcrumbs } from "../components/drive/Breadcrumbs";
import { FileCard, FolderCard } from "../components/drive/ItemCard";
import { FolderTree } from "../components/drive/FolderTree";
import { Toolbar } from "../components/drive/Toolbar";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { authActions, driveActions } from "../store/actions";
import type { RootState } from "../store/types";

export function DrivePage() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const drive = useSelector((state: RootState) => state.drive);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    document.title = "Drive Workspace";
  }, []);

  const visibleFolders = useMemo(() => {
    if (searchValue.trim()) {
      return drive.searchResults.folders;
    }

    return drive.folders;
  }, [drive.folders, drive.searchResults.folders, searchValue]);

  const visibleFiles = useMemo(() => {
    if (searchValue.trim()) {
      return drive.searchResults.files;
    }

    return drive.files;
  }, [drive.files, drive.searchResults.files, searchValue]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const submitFolder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(
      driveActions.createFolderRequest({
        name: folderName,
        parentId: drive.currentFolderId,
      }),
    );
    setFolderName("");
    setIsCreateModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:flex-row lg:p-6">
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
              onClick={() => dispatch(authActions.logout())}
              aria-label="Logout from drive"
            >
              <Icon name="logout" className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
            <p className="font-medium text-slate-900 dark:text-white">
              {user?.email}
            </p>
            <p>
              {user?.isDemo
                ? "Demo access token is active."
                : "JWT session is active."}
            </p>
          </div>

          <div className="mt-6">
            <FolderTree
              nodes={drive.tree}
              currentFolderId={drive.currentFolderId}
              onSelect={(folderId) => {
                dispatch(driveActions.setCurrentFolder(folderId));
                dispatch(driveActions.itemsRequest(folderId));
              }}
            />
          </div>
        </aside>

        <section className="min-w-0 flex-1 space-y-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:p-6">
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
                <StatusBadge label={drive.loading ? "Syncing" : "Synced"} />
                {drive.successMessage ? (
                  <StatusBadge label={drive.successMessage} />
                ) : null}
              </div>
            </div>

            <Breadcrumbs
              items={drive.breadcrumbs}
              onRootClick={() => {
                dispatch(driveActions.setCurrentFolder(null));
                dispatch(driveActions.itemsRequest(null));
              }}
              onSelect={(folderId) => {
                dispatch(driveActions.setCurrentFolder(folderId));
                dispatch(driveActions.itemsRequest(folderId));
              }}
            />
          </header>

          <Toolbar
            onCreateFolder={() => setIsCreateModalOpen(true)}
            onSearch={(value) => {
              setSearchValue(value);
              dispatch(driveActions.searchRequest(value));
            }}
            onUpload={(file) =>
              dispatch(
                driveActions.uploadFileRequest({
                  file,
                  folderId: drive.currentFolderId,
                }),
              )
            }
            searchValue={searchValue}
          />

          {drive.error ? (
            <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-200">
              {drive.error}
            </section>
          ) : null}

          <section className="flex flex-wrap gap-4">
            {visibleFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                item={folder}
                onOpen={(folderId) => {
                  dispatch(driveActions.setCurrentFolder(folderId));
                  dispatch(driveActions.itemsRequest(folderId));
                }}
                onRename={(id, name) =>
                  dispatch(driveActions.renameFolderRequest({ id, name }))
                }
                onDelete={(id) =>
                  dispatch(driveActions.deleteFolderRequest(id))
                }
                onClone={(id) => dispatch(driveActions.cloneFolderRequest(id))}
                onMove={(id, direction) =>
                  dispatch(driveActions.moveFolderRequest({ id, direction }))
                }
                onToggleVisibility={(id, isPublic) =>
                  dispatch(
                    driveActions.toggleFolderVisibilityRequest({
                      id,
                      isPublic,
                    }),
                  )
                }
              />
            ))}
            {visibleFiles.map((file) => (
              <FileCard
                key={file.id}
                item={file}
                onRename={(id, name) =>
                  dispatch(driveActions.renameFileRequest({ id, name }))
                }
                onDelete={(id) => dispatch(driveActions.deleteFileRequest(id))}
                onClone={(id) => dispatch(driveActions.cloneFileRequest(id))}
                onMove={(id, direction) =>
                  dispatch(driveActions.moveFileRequest({ id, direction }))
                }
                onToggleVisibility={(id, isPublic) =>
                  dispatch(
                    driveActions.toggleFileVisibilityRequest({ id, isPublic }),
                  )
                }
              />
            ))}
          </section>

          {visibleFolders.length === 0 && visibleFiles.length === 0 ? (
            <section className="rounded-3xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                No items yet
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Create a folder or upload a JPEG, PNG, or WebP image to get
                started.
              </p>
            </section>
          ) : null}
        </section>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        title="Create folder"
        onClose={() => setIsCreateModalOpen(false)}
      >
        <form className="space-y-4" onSubmit={submitFolder}>
          <Input
            label="Folder name"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            required
          />
          <Button type="submit" fullWidth>
            Create folder
          </Button>
        </form>
      </Modal>
    </main>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-200">
      {label}
    </span>
  );
}
