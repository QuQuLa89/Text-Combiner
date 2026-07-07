import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { getLastWorkspace, setLastWorkspace } from './config'
import {
  listTextFiles,
  readTextFile,
  writeTextFile,
  createTextFile,
  renameTextFile,
  resolveExistingPath
} from './fileService'
import { IPC, type ExportResponse } from '../shared/ipc-types'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 680,
    minHeight: 420,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#1e1f22',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle(IPC.selectFolder, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    })
    if (result.canceled || result.filePaths.length === 0) return null
    const folderPath = result.filePaths[0]
    setLastWorkspace(folderPath)
    return folderPath
  })

  ipcMain.handle(IPC.getLastWorkspace, () => {
    return getLastWorkspace() ?? null
  })

  ipcMain.handle(IPC.listFiles, async (_event, folderPath: string) => {
    return listTextFiles(folderPath)
  })

  ipcMain.handle(IPC.readFile, async (_event, folderPath: string, name: string) => {
    return readTextFile(folderPath, name)
  })

  ipcMain.handle(
    IPC.saveFile,
    async (_event, folderPath: string, name: string, content: string) => {
      await writeTextFile(folderPath, name, content)
      return { ok: true } as const
    }
  )

  ipcMain.handle(IPC.createFile, async (_event, folderPath: string, name: string) => {
    try {
      const file = await createTextFile(folderPath, name)
      return { ok: true, file } as const
    } catch (error) {
      return { ok: false, message: (error as Error).message } as const
    }
  })

  ipcMain.handle(
    IPC.renameFile,
    async (_event, folderPath: string, oldName: string, newName: string) => {
      try {
        const file = await renameTextFile(folderPath, oldName, newName)
        return { ok: true, file } as const
      } catch (error) {
        return { ok: false, message: (error as Error).message } as const
      }
    }
  )

  ipcMain.handle(IPC.deleteFile, async (_event, folderPath: string, name: string) => {
    try {
      const target = resolveExistingPath(folderPath, name)
      await shell.trashItem(target)
      return { ok: true } as const
    } catch (error) {
      return { ok: false, message: (error as Error).message } as const
    }
  })

  ipcMain.handle(
    IPC.exportCombined,
    async (_event, defaultFileName: string, combinedContent: string): Promise<ExportResponse> => {
      const result = await dialog.showSaveDialog({
        title: 'Export combined text file',
        defaultPath: defaultFileName,
        filters: [{ name: 'Text File', extensions: ['txt'] }]
      })
      if (result.canceled || !result.filePath) {
        return { ok: true, cancelled: true }
      }
      try {
        const { writeFile } = await import('fs/promises')
        await writeFile(result.filePath, combinedContent, 'utf-8')
        return { ok: true, path: result.filePath }
      } catch (error) {
        return { ok: false, message: (error as Error).message }
      }
    }
  )
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.textcombiner.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
