import type { SortDirection, SortKey } from '../../../shared/ipc-types'
import { ChevronDownIcon, DownloadIcon, FolderIcon, PlusIcon } from '../icons'

interface ToolbarProps {
  workspaceName: string
  onChangeWorkspace: () => void
  onCreate: () => void
  sortKey: SortKey
  sortDirection: SortDirection
  onSortKeyChange: (key: SortKey) => void
  onToggleSortDirection: () => void
  allSelected: boolean
  someSelected: boolean
  onToggleSelectAll: () => void
  selectedCount: number
  onExport: () => void
  fileCount: number
}

export function Toolbar({
  workspaceName,
  onChangeWorkspace,
  onCreate,
  sortKey,
  sortDirection,
  onSortKeyChange,
  onToggleSortDirection,
  allSelected,
  someSelected,
  onToggleSelectAll,
  selectedCount,
  onExport,
  fileCount
}: ToolbarProps): JSX.Element {
  return (
    <div className="flex flex-col gap-2 border-b border-border px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onChangeWorkspace}
          title="Change workspace folder"
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary hover:bg-bg-hover hover:text-text-primary"
        >
          <FolderIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{workspaceName}</span>
        </button>
        <button
          onClick={onCreate}
          title="New text file"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-text-secondary hover:bg-bg-hover hover:text-accent"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <label
          className="flex items-center gap-1.5 rounded px-1.5 py-1 text-xs text-text-secondary hover:bg-bg-hover"
          title={allSelected ? 'Deselect all' : 'Select all'}
        >
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected && !allSelected
            }}
            onChange={onToggleSelectAll}
            className="h-3.5 w-3.5 accent-accent"
            disabled={fileCount === 0}
          />
          {selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
        </label>

        <div className="ml-auto flex items-center gap-1">
          <select
            value={sortKey}
            onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
            className="rounded border border-border bg-bg-secondary px-1.5 py-1 text-xs text-text-primary outline-none hover:border-accent"
          >
            <option value="name">Name</option>
            <option value="modified">Modified</option>
          </select>
          <button
            onClick={onToggleSortDirection}
            title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            className="flex h-6 w-6 items-center justify-center rounded text-text-secondary hover:bg-bg-hover hover:text-text-primary"
          >
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={onExport}
        disabled={selectedCount === 0}
        className="flex items-center justify-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-bg-tertiary disabled:text-text-muted"
      >
        <DownloadIcon className="h-3.5 w-3.5" />
        Export combined .txt{selectedCount > 0 ? ` (${selectedCount})` : ''}
      </button>
    </div>
  )
}
