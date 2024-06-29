const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ico', {
  convert: (image, options) => ipcRenderer.invoke('ico:convert', image, options),
});

contextBridge.exposeInMainWorld('liquid', {
  render: (file, options) => ipcRenderer.invoke('liquid:render', file, options),
})

contextBridge.exposeInMainWorld('settings', {
  getAll: () => ipcRenderer.invoke('settings:get-all'),
  restoreDefaults: () => ipcRenderer.send('settings:restore-defaults'),
  unset: (key) => ipcRenderer.send('settings:unset', key),
  update: (key, value) => ipcRenderer.send('settings:update', key, value),
  updateColorMode: mode => ipcRenderer.send('settings:update-color-mode', mode),
});