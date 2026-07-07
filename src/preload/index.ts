import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/ipc-types'
import type { CreateFileResponse, ExportResponse, RenameFileResponse, SimpleResponse, TextFileInfo } from '../shared/ipc-types'

const api = {
  selectFolder: (): Promise<string | null> => ipcRenderer.invoke(IPC.selectFolder),
  getLastWorkspace: (): Promise<string | null> => ipcRenderer.invoke(IPC.getLastWorkspace),
  listFiles: (folderPath: string): Promise<TextFileInfo[]> =>
    ipcRenderer.invoke(IPC.listFiles, folderPath),
  readFile: (folderPath: string, name: string): Promise<string> =>
    ipcRenderer.invoke(IPC.readFile, folderPath, name),
  saveFile: (folderPath: string, name: string, content: string): Promise<SimpleResponse> =>
    ipcRenderer.invoke(IPC.saveFile, folderPath, name, content),
  createFile: (folderPath: string, name: string): Promise<CreateFileResponse> =>
    ipcRenderer.invoke(IPC.createFile, folderPath, name),
  renameFile: (folderPath: string, oldName: string, newName: string): Promise<RenameFileResponse> =>
    ipcRenderer.invoke(IPC.renameFile, folderPath, oldName, newName),
  deleteFile: (folderPath: string, name: string): Promise<SimpleResponse> =>
    ipcRenderer.invoke(IPC.deleteFile, folderPath, name),
  exportCombined: (defaultFileName: string, combinedContent: string): Promise<ExportResponse> =>
    ipcRenderer.invoke(IPC.exportCombined, defaultFileName, combinedContent)
}

export type TextCombinerApi = typeof api

contextBridge.exposeInMainWorld('api', api)
