import { combineReducers } from "redux";
import { actionTypes, type AppAction } from "./actions";
import type { AuthState, DriveState } from "./types";

const initialAuthState: AuthState = {
  token: localStorage.getItem("drive_token"),
  user: null,
  status: localStorage.getItem("drive_token") ? "loading" : "idle",
  error: null,
};

const initialDriveState: DriveState = {
  tree: [],
  currentFolderId: null,
  breadcrumbs: [],
  folders: [],
  files: [],
  searchQuery: "",
  searchResults: {
    folders: [],
    files: [],
  },
  loading: false,
  error: null,
  successMessage: null,
};

function authReducer(state = initialAuthState, action: AppAction): AuthState {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
    case actionTypes.REGISTER_REQUEST:
    case actionTypes.FETCH_ME_REQUEST:
      return {
        ...state,
        status: "loading",
        error: null,
      };
    case actionTypes.AUTH_SUCCESS:
      return {
        token: action.payload.token,
        user: action.payload.user,
        status: "authenticated",
        error: null,
      };
    case actionTypes.AUTH_FAILURE:
      return {
        ...state,
        status: "idle",
        error: action.payload,
      };
    case actionTypes.LOGOUT:
      return {
        token: null,
        user: null,
        status: "idle",
        error: null,
      };
    default:
      return state;
  }
}

function driveReducer(
  state = initialDriveState,
  action: AppAction,
): DriveState {
  switch (action.type) {
    case actionTypes.TREE_REQUEST:
    case actionTypes.SEARCH_REQUEST:
    case actionTypes.CREATE_FOLDER_REQUEST:
    case actionTypes.UPLOAD_FILE_REQUEST:
    case actionTypes.RENAME_FOLDER_REQUEST:
    case actionTypes.RENAME_FILE_REQUEST:
    case actionTypes.DELETE_FOLDER_REQUEST:
    case actionTypes.DELETE_FILE_REQUEST:
    case actionTypes.CLONE_FOLDER_REQUEST:
    case actionTypes.CLONE_FILE_REQUEST:
    case actionTypes.MOVE_FOLDER_REQUEST:
    case actionTypes.MOVE_FILE_REQUEST:
    case actionTypes.TOGGLE_FOLDER_VISIBILITY_REQUEST:
    case actionTypes.TOGGLE_FILE_VISIBILITY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        successMessage: null,
      };
    case actionTypes.ITEMS_REQUEST:
      return {
        ...state,
        folders: [],
        files: [],
        loading: true,
        error: null,
        successMessage: null,
      };
    case actionTypes.TREE_SUCCESS:
      return {
        ...state,
        tree: action.payload,
        loading: false,
      };
    case actionTypes.ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        breadcrumbs: action.payload.breadcrumbs,
        folders: action.payload.folders,
        files: action.payload.files,
        currentFolderId: action.payload.parent?.id ?? null,
      };
    case actionTypes.SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResults: action.payload,
      };
    case actionTypes.CLEAR_SEARCH:
      return {
        ...state,
        searchQuery: "",
        searchResults: {
          folders: [],
          files: [],
        },
        loading: false,
      };
    case actionTypes.DRIVE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case actionTypes.SET_CURRENT_FOLDER:
      return {
        ...state,
        currentFolderId: action.payload,
      };
    case actionTypes.SET_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}

export const rootReducer = combineReducers({
  auth: authReducer,
  drive: driveReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
