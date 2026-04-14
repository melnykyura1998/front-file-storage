import { AxiosError } from "axios";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { api, setAuthToken } from "../api/client";
import {
  actionTypes,
  authActions,
  driveActions,
  type AppAction,
} from "./actions";
import type { RootState, User } from "./types";

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      "Request failed."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error.";
}

function* bootstrapDrive() {
  yield put(driveActions.treeRequest());
  yield put(driveActions.itemsRequest(null));
}

export function* handleLogin(action: AppAction) {
  if (action.type !== actionTypes.LOGIN_REQUEST) {
    return;
  }

  try {
    if (action.payload.useDemoToken) {
      const demoToken = "demo-drive-token";
      setAuthToken(demoToken);
      const response: { data: User } = yield call([api, "get"], "/auth/me");
      yield put(
        authActions.authSuccess({
          token: demoToken,
          user: response.data,
        }),
      );
      yield call(bootstrapDrive);
      return;
    }

    const response: {
      data: {
        token: string;
        user: User;
      };
    } = yield call([api, "post"], "/auth/login", action.payload);
    setAuthToken(response.data.token);
    yield put(authActions.authSuccess(response.data));
    yield call(bootstrapDrive);
  } catch (error) {
    yield put(authActions.authFailure(getErrorMessage(error)));
  }
}

export function* handleRegister(action: AppAction) {
  if (action.type !== actionTypes.REGISTER_REQUEST) {
    return;
  }

  try {
    const response: {
      data: {
        token: string;
        user: User;
      };
    } = yield call([api, "post"], "/auth/register", action.payload);
    setAuthToken(response.data.token);
    yield put(authActions.authSuccess(response.data));
    yield call(bootstrapDrive);
  } catch (error) {
    yield put(authActions.authFailure(getErrorMessage(error)));
  }
}

function* handleFetchMe() {
  try {
    const token = localStorage.getItem("drive_token");
    if (!token) {
      yield put(authActions.authFailure("Please sign in to continue."));
      return;
    }

    setAuthToken(token);
    const response: { data: User } = yield call([api, "get"], "/auth/me");
    yield put(
      authActions.authSuccess({
        token,
        user: response.data,
      }),
    );
    yield call(bootstrapDrive);
  } catch (error) {
    setAuthToken(null);
    yield put(authActions.authFailure(getErrorMessage(error)));
  }
}

function* handleTreeRequest() {
  try {
    const response: { data: { folders: RootState["drive"]["tree"] } } =
      yield call([api, "get"], "/folders/tree");
    yield put(driveActions.treeSuccess(response.data.folders));
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleItemsRequest(action: AppAction): Generator {
  if (action.type !== actionTypes.ITEMS_REQUEST) {
    return;
  }

  try {
    const response = yield call([api, "get"], "/folders/items", {
      params: {
        parentId: action.payload ?? undefined,
      },
    });
    yield put(driveActions.itemsSuccess(response.data));
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleSearchRequest(action: AppAction): Generator {
  if (action.type !== actionTypes.SEARCH_REQUEST) {
    return;
  }

  const query = action.payload.trim();
  if (!query) {
    yield put(driveActions.clearSearch());
    return;
  }

  try {
    const response = yield call([api, "get"], "/search", {
      params: { q: query },
    });
    yield put(driveActions.searchSuccess(response.data));
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* refreshDrive(successMessage: string): Generator {
  const currentFolderId: string | null = yield select(
    (state: RootState) => state.drive.currentFolderId,
  );
  yield put(driveActions.treeRequest());
  yield put(driveActions.itemsRequest(currentFolderId));
  yield put(driveActions.setSuccessMessage(successMessage));
}

function* handleCreateFolder(action: AppAction) {
  if (action.type !== actionTypes.CREATE_FOLDER_REQUEST) {
    return;
  }

  try {
    yield call([api, "post"], "/folders", {
      name: action.payload.name,
      parentId: action.payload.parentId,
    });
    yield call(refreshDrive, "Folder created.");
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleUploadFile(action: AppAction) {
  if (action.type !== actionTypes.UPLOAD_FILE_REQUEST) {
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", action.payload.file);
    if (action.payload.folderId) {
      formData.append("folderId", action.payload.folderId);
    }
    yield call([api, "post"], "/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    yield call(refreshDrive, "File uploaded.");
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleRenameFolder(action: AppAction) {
  if (action.type !== actionTypes.RENAME_FOLDER_REQUEST) {
    return;
  }

  try {
    yield call([api, "patch"], `/folders/${action.payload.id}`, {
      name: action.payload.name,
    });
    yield call(refreshDrive, "Folder updated.");
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleRenameFile(action: AppAction) {
  if (action.type !== actionTypes.RENAME_FILE_REQUEST) {
    return;
  }

  try {
    yield call([api, "patch"], `/files/${action.payload.id}`, {
      name: action.payload.name,
    });
    yield call(refreshDrive, "File updated.");
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleDeleteFolder(action: AppAction) {
  if (action.type !== actionTypes.DELETE_FOLDER_REQUEST) {
    return;
  }

  try {
    yield call([api, "delete"], `/folders/${action.payload}`);
    yield call(refreshDrive, "Folder removed.");
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleDeleteFile(action: AppAction) {
  if (action.type !== actionTypes.DELETE_FILE_REQUEST) {
    return;
  }

  try {
    yield call([api, "delete"], `/files/${action.payload}`);
    yield call(refreshDrive, "File removed.");
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleCloneFolder(action: AppAction) {
  if (action.type !== actionTypes.CLONE_FOLDER_REQUEST) {
    return;
  }

  try {
    yield call([api, "post"], `/folders/${action.payload}/clone`);
    yield call(refreshDrive, "Folder cloned.");
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleCloneFile(action: AppAction) {
  if (action.type !== actionTypes.CLONE_FILE_REQUEST) {
    return;
  }

  try {
    yield call([api, "post"], `/files/${action.payload}/clone`);
    yield call(refreshDrive, "File cloned.");
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleMoveFolder(action: AppAction) {
  if (action.type !== actionTypes.MOVE_FOLDER_REQUEST) {
    return;
  }

  try {
    yield call([api, "post"], `/folders/${action.payload.id}/move`, {
      direction: action.payload.direction,
    });
    yield call(refreshDrive, "Folder reordered.");
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleMoveFile(action: AppAction) {
  if (action.type !== actionTypes.MOVE_FILE_REQUEST) {
    return;
  }

  try {
    yield call([api, "post"], `/files/${action.payload.id}/move`, {
      direction: action.payload.direction,
    });
    yield call(refreshDrive, "File reordered.");
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleToggleFolderVisibility(action: AppAction) {
  if (action.type !== actionTypes.TOGGLE_FOLDER_VISIBILITY_REQUEST) {
    return;
  }

  try {
    yield call([api, "patch"], `/folders/${action.payload.id}`, {
      isPublic: action.payload.isPublic,
    });
    yield call(refreshDrive, "Folder visibility updated.");
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function* handleToggleFileVisibility(action: AppAction) {
  if (action.type !== actionTypes.TOGGLE_FILE_VISIBILITY_REQUEST) {
    return;
  }

  try {
    yield call([api, "patch"], `/files/${action.payload.id}`, {
      isPublic: action.payload.isPublic,
    });
    yield call(refreshDrive, "File visibility updated.");
  } catch (error) {
    yield put(driveActions.driveFailure(getErrorMessage(error)));
  }
}

function handleLogout() {
  setAuthToken(null);
}

export function* rootSaga() {
  yield all([
    takeLatest(actionTypes.LOGIN_REQUEST, handleLogin),
    takeLatest(actionTypes.REGISTER_REQUEST, handleRegister),
    takeLatest(actionTypes.FETCH_ME_REQUEST, handleFetchMe),
    takeLatest(actionTypes.TREE_REQUEST, handleTreeRequest),
    takeLatest(actionTypes.ITEMS_REQUEST, handleItemsRequest),
    takeLatest(actionTypes.SEARCH_REQUEST, handleSearchRequest),
    takeLatest(actionTypes.CREATE_FOLDER_REQUEST, handleCreateFolder),
    takeLatest(actionTypes.UPLOAD_FILE_REQUEST, handleUploadFile),
    takeLatest(actionTypes.RENAME_FOLDER_REQUEST, handleRenameFolder),
    takeLatest(actionTypes.RENAME_FILE_REQUEST, handleRenameFile),
    takeLatest(actionTypes.DELETE_FOLDER_REQUEST, handleDeleteFolder),
    takeLatest(actionTypes.DELETE_FILE_REQUEST, handleDeleteFile),
    takeLatest(actionTypes.CLONE_FOLDER_REQUEST, handleCloneFolder),
    takeLatest(actionTypes.CLONE_FILE_REQUEST, handleCloneFile),
    takeLatest(actionTypes.MOVE_FOLDER_REQUEST, handleMoveFolder),
    takeLatest(actionTypes.MOVE_FILE_REQUEST, handleMoveFile),
    takeLatest(
      actionTypes.TOGGLE_FOLDER_VISIBILITY_REQUEST,
      handleToggleFolderVisibility,
    ),
    takeLatest(
      actionTypes.TOGGLE_FILE_VISIBILITY_REQUEST,
      handleToggleFileVisibility,
    ),
    takeLatest(actionTypes.LOGOUT, handleLogout),
  ]);
}
