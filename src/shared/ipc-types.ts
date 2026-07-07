export interface TextFileInfo {
  name: string
  path: string
  size: number
  mtimeMs: number
  birthtimeMs: number
}

export type SortKey = 'name' | 'modified'
export type SortDirection = 'asc' | 'desc'

export interface CreateFileResult {
  ok: true
  file: TextFileInfo
}

export interface OperationError {
  ok: false
  message: string
}

export type CreateFileResponse = CreateFileResult | OperationError
export type RenameFileResponse = CreateFileResult | OperationError
export type SimpleResponse = { ok: true } | OperationError

export interface ExportResult {
  ok: true
  path: string
}
export type ExportResponse = ExportResult | OperationError | { ok: true; cancelled: true }

export const IPC = {
  selectFolder: 'workspace:selectFolder',
  getLastWorkspace: 'workspace:getLast',
  listFiles: 'files:list',
  readFile: 'files:read',
  saveFile: 'files:save',
  createFile: 'files:create',
  renameFile: 'files:rename',
  deleteFile: 'files:delete',
  exportCombined: 'files:exportCombined'
} as const
