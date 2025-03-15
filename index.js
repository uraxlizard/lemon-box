const { app, BrowserWindow } = require("electron");

// Enable live reloading
require("electron-reload")(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
});

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 700, // Match minWidth
        height: 700, // Match minHeight
        minWidth: 700, // Consistent with initial width
        minHeight: 700, // Consistent with initial height
        title: "Lemon Box - Bulgarian Radio Player",
        autoHideMenuBar: true,
        resizable: false, // Prevent resizing if needed
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
