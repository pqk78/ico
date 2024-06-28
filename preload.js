const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ico', {
  convert: (image, options) => ipcRenderer.invoke('convert', image, options),
});

contextBridge.exposeInMainWorld('liquid', {
  render: (file, options) => ipcRenderer.invoke('liquid:render', file, options),
})

contextBridge.exposeInMainWorld('settings', {
  restoreDefault: () => ipcRenderer.send('settings:restore-default'),
  unset: (key) => ipcRenderer.send('settings:unset', key),
  update: (key, value) => ipcRenderer.send('settings:update', key, value),
  updateColorMode: mode => ipcRenderer.send('settings:update-color-mode', mode),
});