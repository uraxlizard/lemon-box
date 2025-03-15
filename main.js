const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let serverProcess;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 500,
        minWidth: 700,
        minHeight: 500,
        title: "Lemon Box",
        autoHideMenuBar: true,
        resizable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadFile("index.html");

    // Start server.js
    const serverPath = path.join(process.resourcesPath, "server.js");
    serverProcess = spawn("node", [serverPath]);

    serverProcess.stdout.on("data", (data) => console.log(`Server: ${data}`));
    serverProcess.stderr.on("data", (data) => console.error(`Server Error: ${data}`));

    mainWindow.on("closed", () => {
        mainWindow = null;
        if (serverProcess) {
            serverProcess.kill();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        if (serverProcess) {
            serverProcess.kill();
        }
        app.quit();
    }
});
