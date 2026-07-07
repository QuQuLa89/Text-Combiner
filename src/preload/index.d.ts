import type { TextCombinerApi } from './index'

declare global {
  interface Window {
    api: TextCombinerApi
  }
}
