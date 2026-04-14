import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Toolbar } from "../components/drive/Toolbar";
import { CreateFolderModal } from "../components/drive/page/CreateFolderModal";
import { DriveContent } from "../components/drive/page/DriveContent";
import { DriveHeader } from "../components/drive/page/DriveHeader";
import {
  ShareAccessModal,
  type ShareAccessTarget,
} from "../components/drive/page/ShareAccessModal";
import { DriveSidebar } from "../components/drive/page/DriveSidebar";
import { authActions, driveActions } from "../store/actions";
import type { RootState } from "../store/types";

export function DrivePage() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const drive = useSelector((state: RootState) => state.drive);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<ShareAccessTarget | null>(
    null,
  );
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

  const selectFolder = (folderId: string | null) => {
    dispatch(driveActions.setCurrentFolder(folderId));
    dispatch(driveActions.itemsRequest(folderId));
  };

  const closeShareModal = () => {
    setShareTarget(null);
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <DriveSidebar
          tree={drive.tree}
          currentFolderId={drive.currentFolderId}
          user={user}
          onLogout={() => dispatch(authActions.logout())}
          onSelectFolder={selectFolder}
        />

        <section className="min-w-0 flex-1 space-y-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:p-6">
          <DriveHeader
            breadcrumbs={drive.breadcrumbs}
            loading={drive.loading}
            successMessage={drive.successMessage}
            onRootClick={() => selectFolder(null)}
            onSelectBreadcrumb={(folderId) => selectFolder(folderId)}
          />

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

          <DriveContent
            loading={drive.loading}
            error={drive.error}
            folders={visibleFolders}
            files={visibleFiles}
            onOpenFolder={selectFolder}
            onRenameFolder={(id, name) =>
              dispatch(driveActions.renameFolderRequest({ id, name }))
            }
            onDeleteFolder={(id) =>
              dispatch(driveActions.deleteFolderRequest(id))
            }
            onCloneFolder={(id) =>
              dispatch(driveActions.cloneFolderRequest(id))
            }
            onShareFolder={(id, name) =>
              setShareTarget({ id, name, resourceType: "folder" })
            }
            onMoveFolder={(id, direction) =>
              dispatch(driveActions.moveFolderRequest({ id, direction }))
            }
            onToggleFolderVisibility={(id, isPublic) =>
              dispatch(
                driveActions.toggleFolderVisibilityRequest({
                  id,
                  isPublic,
                }),
              )
            }
            onRenameFile={(id, name) =>
              dispatch(driveActions.renameFileRequest({ id, name }))
            }
            onDeleteFile={(id) => dispatch(driveActions.deleteFileRequest(id))}
            onCloneFile={(id) => dispatch(driveActions.cloneFileRequest(id))}
            onShareFile={(id, name) =>
              setShareTarget({ id, name, resourceType: "file" })
            }
            onMoveFile={(id, direction) =>
              dispatch(driveActions.moveFileRequest({ id, direction }))
            }
            onToggleFileVisibility={(id, isPublic) =>
              dispatch(
                driveActions.toggleFileVisibilityRequest({ id, isPublic }),
              )
            }
          />
        </section>
      </div>

      <CreateFolderModal
        isOpen={isCreateModalOpen}
        folderName={folderName}
        onClose={() => setIsCreateModalOpen(false)}
        onChangeFolderName={setFolderName}
        onSubmit={submitFolder}
      />
      <ShareAccessModal
        isLoading={drive.loading}
        isOpen={Boolean(shareTarget)}
        target={shareTarget}
        onClose={closeShareModal}
        onSubmit={(target, payload) => {
          if (target.resourceType === "folder") {
            dispatch(
              driveActions.shareFolderRequest({
                id: target.id,
                email: payload.email,
                role: payload.role,
              }),
            );
          } else {
            dispatch(
              driveActions.shareFileRequest({
                id: target.id,
                email: payload.email,
                role: payload.role,
              }),
            );
          }

          closeShareModal();
        }}
      />
    </main>
  );
}
