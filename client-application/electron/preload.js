const { ipcRenderer, contextBridge } = require('electron');

const WINDOW_API = {
    Maximize: () => ipcRenderer.invoke("Maximize"),
    Default_Size: () => ipcRenderer.invoke("Default_Size"), 
}

contextBridge.exposeInMainWorld("api",WINDOW_API);