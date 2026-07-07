import { useEffect, useRef, useState } from 'react'
import type { TextFileInfo } from '../../../shared/ipc-types'
import { DocumentIcon, PencilIcon, TrashIcon } from '../icons'
import { formatModified } from '../utils/date'

interface FileListProps {
  files: TextFileInfo[]
  selected: Set<string>
  activeName: string | null
  onToggleSelect: (name: string) => void
  onOpen: (name: string) => void
  onRenameSubmit: (oldName: string, newName: string) => void
  onDelete: (name: string) => void
  creatingNew: boolean
  onConfirmCreate: (name: string) => void
  onCancelCreate: () => void
}

function InlineNameInput({
  initialValue,
  placeholder,
  onSubmit,
  onCancel
}: {
  initialValue: string
  placeholder?: string
  onSubmit: (value: string) => void
  onCancel: () => void
}): JSX.Element {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  return (
    <input
      ref={inputRef}
      value={value}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => (value.trim() ? onSubmit(value.trim()) : onCancel())}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          value.trim() ? onSubmit(value.trim()) : onCancel()
        } else if (e.key === 'Escape') {
          e.preventDefault()
          onCancel()
        }
      }}
      className="w-full rounded border border-accent bg-bg-tertiary px-1.5 py-0.5 text-sm text-text-primary outline-none"
    />
  )
}

export function FileList({
  files,
  selected,
  activeName,
  onToggleSelect,
  onOpen,
  onRenameSubmit,
  onDelete,
  creatingNew,
  onConfirmCreate,
  onCancelCreate
}: FileListProps): JSX.Element {
  const [renamingName, setRenamingName] = useState<string | null>(null)

  if (files.length === 0 && !creatingNew) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-text-muted">
        No .txt files yet. Click the + button to create one.
      </div>
    )
  }

  return (
    <ul className="flex-1 overflow-y-auto py-1">
      {creatingNew && (
        <li className="flex items-center gap-2 px-3 py-1.5">
          <DocumentIcon className="h-4 w-4 shrink-0 text-text-muted" />
          <InlineNameInput
            initialValue="Untitled.txt"
            onSubmit={onConfirmCreate}
            onCancel={onCancelCreate}
          />
        </li>
      )}
      {files.map((file) => {
        const isActive = file.name === activeName
        const isSelected = selected.has(file.name)
        const isRenaming = renamingName === file.name

        return (
          <li
            key={file.path}
            className={`group flex items-center gap-2 px-3 py-1.5 ${
              isActive ? 'bg-accent-muted' : 'hover:bg-bg-hover'
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(file.name)}
              onClick={(e) => e.stopPropagation()}
              className="h-3.5 w-3.5 shrink-0 accent-accent"
            />

            {isRenaming ? (
              <InlineNameInput
                initialValue={file.name}
                onSubmit={(newName) => {
                  setRenamingName(null)
                  if (newName !== file.name) onRenameSubmit(file.name, newName)
                }}
                onCancel={() => setRenamingName(null)}
              />
            ) : (
              <button
                onClick={() => onOpen(file.name)}
                onDoubleClick={() => setRenamingName(file.name)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                title={file.name}
              >
                <DocumentIcon className="h-4 w-4 shrink-0 text-text-muted" />
                <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-text-muted">
                  {formatModified(file.mtimeMs)}
                </span>
              </button>
            )}

            {!isRenaming && (
              <span className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                <button
                  onClick={() => setRenamingName(file.name)}
                  title="Rename"
                  className="flex h-6 w-6 items-center justify-center rounded text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                >
                  <PencilIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(file.name)}
                  title="Move to trash"
                  className="flex h-6 w-6 items-center justify-center rounded text-text-secondary hover:bg-bg-tertiary hover:text-red-400"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
