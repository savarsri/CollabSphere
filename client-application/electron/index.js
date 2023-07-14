const {app, BrowserWindow, ipcMain} = require("electron");
const {join} = require('path');

const isDev = !app.isPackaged;
let screenHeight, screenWidth;
app.whenReady().then(()=>{
    const { screen } = require('electron')
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize
    screenHeight=height;
    screenWidth=width;
    main(width,height)
});

let window;
function main(width,height){
    window = new BrowserWindow({
        // width: (width/2.4),
        // height: (height/1.5),
        width: width,
        height: height,
        show: false,
        autoHideMenuBar: true,
        icon: join(__dirname,'./public/favicon.png'),
        webPreferences:{
            preload: join(__dirname,"./preload.js"),
        }
    });
    
    window.loadFile(join(__dirname,"../public/index.html"));
    window.on("ready-to-show",window.show);
    if(isDev) window.webContents.openDevTools();
}

ipcMain.handleOnce('Maximize',()=>window.maximize());

ipcMain.handleOnce('Default_Size', ()=> {
    window
    .close();
    main(screenWidth,screenHeight);
});