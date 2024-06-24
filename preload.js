const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('utils', {
    convert: (image, options) => ipcRenderer.invoke('convert', image, options),
    liquid: (file, options) => ipcRenderer.invoke('liquid', file, options)
});