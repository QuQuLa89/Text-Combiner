import { useCallback, useEffect, useState } from 'react'
import type { TextFileInfo } from '../../../shared/ipc-types'

interface UseTextFilesResult {
  files: TextFileInfo[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useTextFiles(workspacePath: string | null): UseTextFilesResult {
  const [files, setFiles] = useState<TextFileInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!workspacePath) {
      setFiles([])
      return
    }
    setLoading(true)
    try {
      const list = await window.api.listFiles(workspacePath)
      setFiles(list)
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [workspacePath])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { files, loading, error, refresh }
}
