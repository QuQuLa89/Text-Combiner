import { FolderIcon } from '../icons'

interface WorkspacePickerProps {
  onSelect: () => void
}

export function WorkspacePicker({ onSelect }: WorkspacePickerProps): JSX.Element {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-bg-primary">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-tertiary text-accent">
        <FolderIcon className="h-8 w-8" />
      </div>
      <div className="text-center">
        <h1 className="text-lg font-semibold text-text-primary">Text Combiner</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Choose a folder to store and manage your .txt notes
        </p>
      </div>
      <button
        onClick={onSelect}
        className="mt-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
      >
        Open Folder
      </button>
    </div>
  )
}
