const { app, BrowserWindow } = require("electron");

if (process.env.NODE_ENV === "development") {
    try {
        require("electron-reload")(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`),
        });
    } catch (err) {
        console.warn("Electron Reload not available in production.");
    }
}

let mainWindow;

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

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
