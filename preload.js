const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ico', {
  convert: (image, options) => ipcRenderer.invoke('ico:convert', image, options),
  deleteFile: (file) => ipcRenderer.send('ico:delete-file', file),
  getFiles: () => ipcRenderer.invoke('ico:get-all'),
  onNavChange: (callback) => ipcRenderer.on('ico:nav', (e, file) => callback(file)),
  zip: (paths) => ipcRenderer.invoke('ico:zip', paths),
});

contextBridge.exposeInMainWorld('liquid', {
  render: (file, options) => ipcRenderer.invoke('liquid:render', file, options),
})

contextBridge.exposeInMainWorld('storage', {
  getAll: () => ipcRenderer.invoke('storage:get-all'),
  restoreDefaults: () => ipcRenderer.send('storage:restore-defaults'),
  unset: (key) => ipcRenderer.send('storage:unset', key),
  update: (key, value) => ipcRenderer.send('storage:update', key, value),
  updateColorMode: mode => ipcRenderer.send('storage:update-color-mode', mode),
});