const { app, BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')
let mainWindow;

app.on('ready',() => {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences:{
            nodeIntegration: true
        },
        webContents: {
            openDevTools: true   //不想要控制台直接把这段删除
        },    
    })
    const urlLocation = isDev ? 'http://localhost:3000' : 'dummyurl'
    mainWindow.webContents.openDevTools()
    mainWindow.loadURL(urlLocation)
})