# Text Combiner

A dark-themed, Obsidian-inspired desktop app for managing a folder of plain
`.txt` files — browse them in a sidebar, edit them, and export any selection
combined into a single `.txt` file.

![theme](https://img.shields.io/badge/theme-dark-1e1f22?style=flat-square)
![license](https://img.shields.io/badge/license-MIT-3b82f6?style=flat-square)

## Features

- **Folder-based workspace** — point Text Combiner at any folder and it
  becomes your notes vault.
- **Combine & export** — select individual files (checkboxes) or use
  "Select all", then export the combined contents as one `.txt` file.
- **Sort** — order the file list by name or by last-modified date, ascending
  or descending.
- **Quick create** — the `+` button creates a new `.txt` file inline, ready
  to name and start typing immediately.
- Rename (double-click a file name) and delete (moves to the OS Trash, not
  a permanent delete) are also supported.
- Autosave while typing, plus explicit save with `Ctrl+S` / `Cmd+S`.

## Tech stack

- [Electron](https://www.electronjs.org/) + [electron-vite](https://electron-vite.org/)
- React 18 + TypeScript
- Tailwind CSS (dark theme, blue accent)

## Getting started

```bash
npm install
npm run dev
```

This launches the app in development mode with hot reload.

## Building

```bash
npm run build        # bundle main/preload/renderer
npm run build:win     # package a Windows installer
npm run build:mac     # package a macOS dmg
npm run build:linux   # package a Linux AppImage
```

Packaged apps are written to `dist/`.

## Type checking

```bash
npm run typecheck
```

## Project structure

```
src/
  main/       Electron main process — window creation, file system IPC
  preload/    contextBridge API exposed to the renderer as window.api
  renderer/   React UI (sidebar, editor, dialogs)
  shared/     Types shared between main, preload, and renderer
```

## License

MIT — see [LICENSE](LICENSE).
