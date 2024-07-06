const isMac = process.platform === 'darwin';

const buildTemplate = (app, win) => [
  ...(isMac
    ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Settings',
          click: () => {
            win.webContents.send('ico:nav', 'settings')
          },
        },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }]
    : []),
  ...(isMac
    ? [{
      label: 'Edit',
      submenu: [
        ...(isMac
          ? [
            {
              label: 'Speech',
              submenu: [
                { role: 'startSpeaking' },
                { role: 'stopSpeaking' }
              ]
            }
          ]
          : [])
      ]
    }] : []
  ),
  { role: 'viewMenu' },
  { role: 'windowMenu' },
  {
    role: 'help',
    submenu: [
      {
        label: 'ICO Help',
        click: () => {
          win.webContents.send('ico:nav', 'help')
        },
      }
    ]
  }
];

module.exports = { buildTemplate };