import { promises as fs } from 'fs'
import { basename, join, resolve, sep } from 'path'
import type { TextFileInfo } from '../shared/ipc-types'

const TXT_EXTENSION = '.txt'

class PathValidationError extends Error {}

/**
 * Resolves `name` against `folderPath` and rejects any result that escapes the
 * folder (e.g. via "../"), since names arrive from the renderer over IPC.
 */
function resolveSafePath(folderPath: string, name: string): string {
  const safeName = basename(name)
  const resolvedFolder = resolve(folderPath)
  const resolvedTarget = resolve(resolvedFolder, safeName)
  if (resolvedTarget !== resolvedFolder && !resolvedTarget.startsWith(resolvedFolder + sep)) {
    throw new PathValidationError(`Invalid file name: ${name}`)
  }
  return resolvedTarget
}

function ensureTxtExtension(name: string): string {
  return name.toLowerCase().endsWith(TXT_EXTENSION) ? name : `${name}${TXT_EXTENSION}`
}

export async function listTextFiles(folderPath: string): Promise<TextFileInfo[]> {
  const entries = await fs.readdir(folderPath, { withFileTypes: true })
  const files = entries.filter(
    (entry) => entry.isFile() && entry.name.toLowerCase().endsWith(TXT_EXTENSION)
  )

  const infos = await Promise.all(
    files.map(async (entry): Promise<TextFileInfo> => {
      const fullPath = join(folderPath, entry.name)
      const stat = await fs.stat(fullPath)
      return {
        name: entry.name,
        path: fullPath,
        size: stat.size,
        mtimeMs: stat.mtimeMs,
        birthtimeMs: stat.birthtimeMs
      }
    })
  )

  return infos
}

export async function readTextFile(folderPath: string, name: string): Promise<string> {
  const target = resolveSafePath(folderPath, name)
  return fs.readFile(target, 'utf-8')
}

export async function writeTextFile(
  folderPath: string,
  name: string,
  content: string
): Promise<void> {
  const target = resolveSafePath(folderPath, name)
  await fs.writeFile(target, content, 'utf-8')
}

export async function createTextFile(folderPath: string, name: string): Promise<TextFileInfo> {
  const finalName = ensureTxtExtension(name.trim())
  if (!finalName || finalName === TXT_EXTENSION) {
    throw new Error('File name cannot be empty.')
  }
  const target = resolveSafePath(folderPath, finalName)

  const exists = await fs
    .access(target)
    .then(() => true)
    .catch(() => false)
  if (exists) {
    throw new Error(`"${finalName}" already exists.`)
  }

  await fs.writeFile(target, '', 'utf-8')
  const stat = await fs.stat(target)
  return {
    name: finalName,
    path: target,
    size: stat.size,
    mtimeMs: stat.mtimeMs,
    birthtimeMs: stat.birthtimeMs
  }
}

export async function renameTextFile(
  folderPath: string,
  oldName: string,
  newName: string
): Promise<TextFileInfo> {
  const finalNewName = ensureTxtExtension(newName.trim())
  if (!finalNewName || finalNewName === TXT_EXTENSION) {
    throw new Error('File name cannot be empty.')
  }
  const oldTarget = resolveSafePath(folderPath, oldName)
  const newTarget = resolveSafePath(folderPath, finalNewName)

  if (oldTarget !== newTarget) {
    const exists = await fs
      .access(newTarget)
      .then(() => true)
      .catch(() => false)
    if (exists) {
      throw new Error(`"${finalNewName}" already exists.`)
    }
  }

  await fs.rename(oldTarget, newTarget)
  const stat = await fs.stat(newTarget)
  return {
    name: finalNewName,
    path: newTarget,
    size: stat.size,
    mtimeMs: stat.mtimeMs,
    birthtimeMs: stat.birthtimeMs
  }
}

export function resolveExistingPath(folderPath: string, name: string): string {
  return resolveSafePath(folderPath, name)
}
