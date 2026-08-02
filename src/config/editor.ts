export const editorConfig = {
  autosave: {
    enabled: true,
    intervalMs: 5000,
  },
  keyboardShortcuts: {
    selectionTool: 'v',
    frameTool: 'f',
    rectangleTool: 'r',
    textTool: 't',
    pan: 'Space',
    duplicate: 'Ctrl+D',
    delete: 'Delete',
    group: 'Ctrl+G',
    ungroup: 'Ctrl+Shift+G',
    undo: 'Ctrl+Z',
    redo: 'Ctrl+Shift+Z',
  },
} as const;
