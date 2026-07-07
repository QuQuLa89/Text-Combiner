import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SortDirection, SortKey, TextFileInfo } from '../../shared/ipc-types'
import { useTextFiles } from './hooks/useTextFiles'
import { WorkspacePicker } from './components/WorkspacePicker'
import { Toolbar } from './components/Toolbar'
import { FileList } from './components/FileList'
import { Editor } from './components/Editor'
import { StatusToast } from './components/StatusToast'

const AUTOSAVE_DELAY_MS = 600

function getBaseName(path: string): string {
  const parts = path.split(/[\\/]/).filter(Boolean)
  return parts[parts.length - 1] ?? path
}

function sortFiles(files: TextFileInfo[], key: SortKey, direction: SortDirection): TextFileInfo[] {
  const sorted = [...files].sort((a, b) => {
    if (key === 'name') {
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    }
    return a.mtimeMs - b.mtimeMs
  })
  if (direction === 'desc') sorted.reverse()
  return sorted
}

export default function App(): JSX.Element {
  const [workspacePath, setWorkspacePath] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(true)

  const { files, refresh } = useTextFiles(workspacePath)

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [activeName, setActiveName] = useState<string | null>(null)
  const [activeContent, setActiveContent] = useState('')
  const [dirty, setDirty] = useState(false)

  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [creatingNew, setCreatingNew] = useState(false)
  const [status, setStatus] = useState<{ message: string; tone?: 'info' | 'error' } | null>(null)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout>>()
  const activeContentRef = useRef(activeContent)
  const activeNameRef = useRef(activeName)
  activeContentRef.current = activeContent
  activeNameRef.current = activeName

  useEffect(() => {
    window.api.getLastWorkspace().then((path) => {
      setWorkspacePath(path)
      setInitializing(false)
    })
  }, [])

  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => setStatus(null), 3500)
    return () => clearTimeout(timer)
  }, [status])

  const sortedFiles = useMemo(() => sortFiles(files, sortKey, sortDirection), [files, sortKey, sortDirection])

  const saveActive = useCallback(async (): Promise<void> => {
    const name = activeNameRef.current
    if (!name || !workspacePath) return
    const result = await window.api.saveFile(workspacePath, name, activeContentRef.current)
    if (result.ok) {
      setDirty(false)
      refresh()
    } else {
      setStatus({ message: `Failed to save: ${result.message}`, tone: 'error' })
    }
  }, [workspacePath, refresh])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        saveActive()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveActive])

  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    }
  }, [])

  const handleSelectFolder = useCallback(async () => {
    const path = await window.api.selectFolder()
    if (!path) return
    await saveActive()
    setWorkspacePath(path)
    setSelected(new Set())
    setActiveName(null)
    setActiveContent('')
    setDirty(false)
  }, [saveActive])

  const openFile = useCallback(
    async (name: string) => {
      if (!workspacePath || name === activeName) return
      if (dirty) await saveActive()
      const content = await window.api.readFile(workspacePath, name)
      setActiveName(name)
      setActiveContent(content)
      setDirty(false)
    },
    [workspacePath, activeName, dirty, saveActive]
  )

  const handleContentChange = useCallback(
    (value: string) => {
      setActiveContent(value)
      setDirty(true)
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
      autosaveTimer.current = setTimeout(saveActive, AUTOSAVE_DELAY_MS)
    },
    [saveActive]
  )

  const toggleSelect = useCallback((name: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const allSelected = files.length > 0 && files.every((f) => selected.has(f.name))
  const someSelected = selected.size > 0

  const toggleSelectAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === files.length) return new Set()
      return new Set(files.map((f) => f.name))
    })
  }, [files])

  const handleConfirmCreate = useCallback(
    async (name: string) => {
      if (!workspacePath) return
      const result = await window.api.createFile(workspacePath, name)
      if (result.ok) {
        await refresh()
        setActiveName(result.file.name)
        setActiveContent('')
        setDirty(false)
        setCreatingNew(false)
      } else {
        setStatus({ message: result.message, tone: 'error' })
      }
    },
    [workspacePath, refresh]
  )

  const handleRenameSubmit = useCallback(
    async (oldName: string, newName: string) => {
      if (!workspacePath) return
      const result = await window.api.renameFile(workspacePath, oldName, newName)
      if (result.ok) {
        await refresh()
        setSelected((prev) => {
          if (!prev.has(oldName)) return prev
          const next = new Set(prev)
          next.delete(oldName)
          next.add(result.file.name)
          return next
        })
        if (activeNameRef.current === oldName) setActiveName(result.file.name)
      } else {
        setStatus({ message: result.message, tone: 'error' })
      }
    },
    [workspacePath, refresh]
  )

  const handleDelete = useCallback(
    async (name: string) => {
      if (!workspacePath) return
      const confirmed = window.confirm(`Move "${name}" to the Trash?`)
      if (!confirmed) return
      const result = await window.api.deleteFile(workspacePath, name)
      if (result.ok) {
        await refresh()
        setSelected((prev) => {
          if (!prev.has(name)) return prev
          const next = new Set(prev)
          next.delete(name)
          return next
        })
        if (activeNameRef.current === name) {
          setActiveName(null)
          setActiveContent('')
          setDirty(false)
        }
      } else {
        setStatus({ message: result.message, tone: 'error' })
      }
    },
    [workspacePath, refresh]
  )

  const handleExport = useCallback(async () => {
    if (!workspacePath || selected.size === 0) return
    if (dirty) await saveActive()

    const targets = sortedFiles.filter((f) => selected.has(f.name))
    const parts = await Promise.all(
      targets.map(async (file) => {
        const content = await window.api.readFile(workspacePath, file.name)
        return `# ${file.name}\n\n${content}`
      })
    )
    const combined = parts.join('\n\n')

    const result = await window.api.exportCombined('combined.txt', combined)
    if (!result.ok) {
      setStatus({ message: `Export failed: ${result.message}`, tone: 'error' })
    } else if (!('cancelled' in result)) {
      setStatus({ message: `Exported to ${result.path}` })
    }
  }, [workspacePath, selected, sortedFiles, dirty, saveActive])

  if (initializing) {
    return <div className="h-full w-full bg-bg-primary" />
  }

  if (!workspacePath) {
    return <WorkspacePicker onSelect={handleSelectFolder} />
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-bg-primary">
      <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-bg-secondary">
        <Toolbar
          workspaceName={getBaseName(workspacePath)}
          onChangeWorkspace={handleSelectFolder}
          onCreate={() => setCreatingNew(true)}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortKeyChange={setSortKey}
          onToggleSortDirection={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={toggleSelectAll}
          selectedCount={selected.size}
          onExport={handleExport}
          fileCount={files.length}
        />
        <FileList
          files={sortedFiles}
          selected={selected}
          activeName={activeName}
          onToggleSelect={toggleSelect}
          onOpen={openFile}
          onRenameSubmit={handleRenameSubmit}
          onDelete={handleDelete}
          creatingNew={creatingNew}
          onConfirmCreate={handleConfirmCreate}
          onCancelCreate={() => setCreatingNew(false)}
        />
      </aside>

      <main className="flex flex-1 flex-col">
        <Editor
          fileName={activeName}
          content={activeContent}
          dirty={dirty}
          onChange={handleContentChange}
        />
      </main>

      <StatusToast message={status?.message ?? null} tone={status?.tone} />
    </div>
  )
}
