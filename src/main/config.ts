import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

interface AppConfig {
  lastWorkspace?: string
}

function getConfigPath(): string {
  return join(app.getPath('userData'), 'config.json')
}

export function loadConfig(): AppConfig {
  const configPath = getConfigPath()
  if (!existsSync(configPath)) return {}
  try {
    return JSON.parse(readFileSync(configPath, 'utf-8'))
  } catch {
    return {}
  }
}

export function saveConfig(config: AppConfig): void {
  writeFileSync(getConfigPath(), JSON.stringify(config, null, 2), 'utf-8')
}

export function getLastWorkspace(): string | undefined {
  return loadConfig().lastWorkspace
}

export function setLastWorkspace(path: string): void {
  const config = loadConfig()
  config.lastWorkspace = path
  saveConfig(config)
}
