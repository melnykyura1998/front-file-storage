import type {
  FolderItemsPayload,
  FolderTreeNode,
  SearchPayload,
  User,
} from "./types";

export const actionTypes = {
  LOGIN_REQUEST: "LOGIN_REQUEST",
  REGISTER_REQUEST: "REGISTER_REQUEST",
  AUTH_SUCCESS: "AUTH_SUCCESS",
  AUTH_FAILURE: "AUTH_FAILURE",
  LOGOUT: "LOGOUT",
  FETCH_ME_REQUEST: "FETCH_ME_REQUEST",
  TREE_REQUEST: "TREE_REQUEST",
  TREE_SUCCESS: "TREE_SUCCESS",
  ITEMS_REQUEST: "ITEMS_REQUEST",
  ITEMS_SUCCESS: "ITEMS_SUCCESS",
  DRIVE_FAILURE: "DRIVE_FAILURE",
  SEARCH_REQUEST: "SEARCH_REQUEST",
  SEARCH_SUCCESS: "SEARCH_SUCCESS",
  CLEAR_SEARCH: "CLEAR_SEARCH",
  CREATE_FOLDER_REQUEST: "CREATE_FOLDER_REQUEST",
  UPLOAD_FILE_REQUEST: "UPLOAD_FILE_REQUEST",
  RENAME_FOLDER_REQUEST: "RENAME_FOLDER_REQUEST",
  RENAME_FILE_REQUEST: "RENAME_FILE_REQUEST",
  DELETE_FOLDER_REQUEST: "DELETE_FOLDER_REQUEST",
  DELETE_FILE_REQUEST: "DELETE_FILE_REQUEST",
  CLONE_FOLDER_REQUEST: "CLONE_FOLDER_REQUEST",
  CLONE_FILE_REQUEST: "CLONE_FILE_REQUEST",
  MOVE_FOLDER_REQUEST: "MOVE_FOLDER_REQUEST",
  MOVE_FILE_REQUEST: "MOVE_FILE_REQUEST",
  TOGGLE_FOLDER_VISIBILITY_REQUEST: "TOGGLE_FOLDER_VISIBILITY_REQUEST",
  TOGGLE_FILE_VISIBILITY_REQUEST: "TOGGLE_FILE_VISIBILITY_REQUEST",
  SHARE_FOLDER_REQUEST: "SHARE_FOLDER_REQUEST",
  SHARE_FILE_REQUEST: "SHARE_FILE_REQUEST",
  SET_CURRENT_FOLDER: "SET_CURRENT_FOLDER",
  SET_SUCCESS_MESSAGE: "SET_SUCCESS_MESSAGE",
} as const;

export interface AuthRequestPayload {
  email: string;
  password: string;
  name?: string;
}

export interface AuthSuccessPayload {
  token: string;
  user: User;
}

export interface FolderMutationPayload {
  id: string;
  name: string;
}

export interface FileMutationPayload {
  id: string;
  name: string;
}

export interface UploadPayload {
  file: File;
  folderId: string | null;
}

export interface MovePayload {
  id: string;
  direction: "up" | "down";
}

export interface VisibilityPayload {
  id: string;
  isPublic: boolean;
}

export interface SharePayload {
  id: string;
  email: string;
  role: "EDITOR" | "VIEWER";
}

export const authActions = {
  loginRequest: (payload: AuthRequestPayload) => ({
    type: actionTypes.LOGIN_REQUEST,
    payload,
  }),
  registerRequest: (payload: AuthRequestPayload) => ({
    type: actionTypes.REGISTER_REQUEST,
    payload,
  }),
  fetchMeRequest: () => ({
    type: actionTypes.FETCH_ME_REQUEST,
  }),
  authSuccess: (payload: AuthSuccessPayload) => ({
    type: actionTypes.AUTH_SUCCESS,
    payload,
  }),
  authFailure: (payload: string) => ({
    type: actionTypes.AUTH_FAILURE,
    payload,
  }),
  logout: () => ({
    type: actionTypes.LOGOUT,
  }),
};

export const driveActions = {
  treeRequest: () => ({
    type: actionTypes.TREE_REQUEST,
  }),
  treeSuccess: (payload: FolderTreeNode[]) => ({
    type: actionTypes.TREE_SUCCESS,
    payload,
  }),
  itemsRequest: (payload: string | null) => ({
    type: actionTypes.ITEMS_REQUEST,
    payload,
  }),
  itemsSuccess: (payload: FolderItemsPayload) => ({
    type: actionTypes.ITEMS_SUCCESS,
    payload,
  }),
  searchRequest: (payload: string) => ({
    type: actionTypes.SEARCH_REQUEST,
    payload,
  }),
  searchSuccess: (payload: SearchPayload) => ({
    type: actionTypes.SEARCH_SUCCESS,
    payload,
  }),
  clearSearch: () => ({
    type: actionTypes.CLEAR_SEARCH,
  }),
  createFolderRequest: (payload: {
    name: string;
    parentId: string | null;
  }) => ({
    type: actionTypes.CREATE_FOLDER_REQUEST,
    payload,
  }),
  uploadFileRequest: (payload: UploadPayload) => ({
    type: actionTypes.UPLOAD_FILE_REQUEST,
    payload,
  }),
  renameFolderRequest: (payload: FolderMutationPayload) => ({
    type: actionTypes.RENAME_FOLDER_REQUEST,
    payload,
  }),
  renameFileRequest: (payload: FileMutationPayload) => ({
    type: actionTypes.RENAME_FILE_REQUEST,
    payload,
  }),
  deleteFolderRequest: (payload: string) => ({
    type: actionTypes.DELETE_FOLDER_REQUEST,
    payload,
  }),
  deleteFileRequest: (payload: string) => ({
    type: actionTypes.DELETE_FILE_REQUEST,
    payload,
  }),
  cloneFolderRequest: (payload: string) => ({
    type: actionTypes.CLONE_FOLDER_REQUEST,
    payload,
  }),
  cloneFileRequest: (payload: string) => ({
    type: actionTypes.CLONE_FILE_REQUEST,
    payload,
  }),
  moveFolderRequest: (payload: MovePayload) => ({
    type: actionTypes.MOVE_FOLDER_REQUEST,
    payload,
  }),
  moveFileRequest: (payload: MovePayload) => ({
    type: actionTypes.MOVE_FILE_REQUEST,
    payload,
  }),
  toggleFolderVisibilityRequest: (payload: VisibilityPayload) => ({
    type: actionTypes.TOGGLE_FOLDER_VISIBILITY_REQUEST,
    payload,
  }),
  toggleFileVisibilityRequest: (payload: VisibilityPayload) => ({
    type: actionTypes.TOGGLE_FILE_VISIBILITY_REQUEST,
    payload,
  }),
  shareFolderRequest: (payload: SharePayload) => ({
    type: actionTypes.SHARE_FOLDER_REQUEST,
    payload,
  }),
  shareFileRequest: (payload: SharePayload) => ({
    type: actionTypes.SHARE_FILE_REQUEST,
    payload,
  }),
  driveFailure: (payload: string) => ({
    type: actionTypes.DRIVE_FAILURE,
    payload,
  }),
  setCurrentFolder: (payload: string | null) => ({
    type: actionTypes.SET_CURRENT_FOLDER,
    payload,
  }),
  setSuccessMessage: (payload: string | null) => ({
    type: actionTypes.SET_SUCCESS_MESSAGE,
    payload,
  }),
};

export type AppAction =
  | ReturnType<(typeof authActions)[keyof typeof authActions]>
  | ReturnType<(typeof driveActions)[keyof typeof driveActions]>;
