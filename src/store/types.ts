export interface User {
  id: string;
  email: string;
  name: string;
  isDemo: boolean;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  position: number;
  isPublic: boolean;
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FileItem {
  id: string;
  name: string;
  folderId: string | null;
  position: number;
  isPublic: boolean;
  ownerId: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FolderTreeNode {
  id: string;
  name: string;
  parentId: string | null;
  isPublic: boolean;
  position: number;
  fileCount: number;
  children: FolderTreeNode[];
}

export interface FolderItemsPayload {
  parent: FolderItem | null;
  breadcrumbs: FolderItem[];
  folders: FolderItem[];
  files: FileItem[];
}

export interface SearchPayload {
  folders: FolderItem[];
  files: FileItem[];
}

export interface AuthState {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "authenticated";
  error: string | null;
}

export interface DriveState {
  tree: FolderTreeNode[];
  currentFolderId: string | null;
  breadcrumbs: FolderItem[];
  folders: FolderItem[];
  files: FileItem[];
  searchQuery: string;
  searchResults: SearchPayload;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface RootState {
  auth: AuthState;
  drive: DriveState;
}
