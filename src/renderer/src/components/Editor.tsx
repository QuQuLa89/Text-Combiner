import { DocumentIcon } from '../icons'

interface EditorProps {
  fileName: string | null
  content: string
  dirty: boolean
  onChange: (value: string) => void
}

export function Editor({ fileName, content, dirty, onChange }: EditorProps): JSX.Element {
  if (!fileName) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-2 text-text-muted">
        <DocumentIcon className="h-8 w-8" />
        <p className="text-sm">Select a file, or create a new one, to start editing</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <DocumentIcon className="h-4 w-4 text-text-muted" />
        <span className="text-sm font-medium text-text-primary">{fileName}</span>
        {dirty && <span className="h-1.5 w-1.5 rounded-full bg-accent" title="Unsaved changes" />}
      </div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 resize-none bg-bg-primary p-4 text-sm leading-relaxed text-text-primary outline-none"
        placeholder="Start typing…"
      />
    </div>
  )
}
