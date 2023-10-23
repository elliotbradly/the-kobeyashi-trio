import { app, BrowserWindow, nativeTheme } from 'electron'
import { initialize, enable } from '@electron/remote/main'
import path from 'path'
import os from 'os'

//import * as Time from '../001.time'

initialize();

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
}
catch (_) { }

let mainWindow

async function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  console.log('------------------')
  console.log('opening.... electron main')
  console.log('version 0.0.1')
  console.log('------------------')

  const STORE = require('../001.store/index.js');
  const ActStr = require('../001.store/00.store.unit/store.action');

  var bit = await STORE.hunt(ActStr.INIT_STORE, { val: 0 });
  console.log(JSON.stringify(bit))

  var bit = await STORE.hunt(ActStr.WRITE_STORE, { val: 0 });
  console.log(JSON.stringify(bit))

  var bit = await STORE.hunt(ActStr.READ_STORE, { val: 0 });
  console.log(JSON.stringify(bit))


  //const trmBit = await TERMINAL.hunt(TERMINAL_ACTION.INIT_TERMINAL, { dat: MQTT, src: local });
  //const strBit = await STORE.hunt(STORE_ACTION.INIT_STORE, { val: 1, dat: MQTT, src: [localBit] });

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  }
  else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  enable(mainWindow.webContents);
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
