const { app, BrowserWindow, dialog, Tray, Menu } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let serverProcess;
let tray;

// Error handling for the main process
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    dialog.showErrorBox('Error', 'An unexpected error occurred. The application will restart.');
    app.relaunch();
    app.exit(1);
});

function createTray() {
    tray = new Tray(path.join(__dirname, 'assets/img/lemon.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Покажи Lemon Box',
            click: () => {
                mainWindow.show();
            }
        },
        {
            label: 'Затвори',
            click: () => {
                mainWindow.destroy();
            }
        }
    ]);

    tray.setToolTip('Lemon Box - Български Радио Плейър');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        mainWindow.show();
    });
}

function createWindow() {
    // Create the browser window with optimized dimensions
    mainWindow = new BrowserWindow({
        width: 600,
        height: 700,
        minWidth: 500,
        minHeight: 600,
        title: "Lemon Box - Български Радио Плейър",
        autoHideMenuBar: true,
        resizable: true,
        frame: false,
        icon: path.join(__dirname, 'assets/img/lemon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            spellcheck: false
        },
        backgroundColor: '#f0f2f5',
    });

    // Load the index.html file
    mainWindow.loadFile("index.html").catch(error => {
        console.error('Failed to load index.html:', error);
        dialog.showErrorBox('Loading Error', 'Failed to load the application interface.');
    });

    // Create tray
    createTray();

    // Start server.js with error handling
    startServer();

    // Minimize to tray instead of closing
    mainWindow.on('minimize', (event) => {
        event.preventDefault();
        mainWindow.hide();
    });

    // Handle minimize button click from renderer
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(`
            window.minimizeApp = function() {
                require('electron').ipcRenderer.send('minimize-app');
            };
        `);
    });

    // Handle minimize IPC message
    require('electron').ipcMain.on('minimize-app', () => {
        mainWindow.hide();
    });

    // Window management
    mainWindow.on("closed", () => {
        mainWindow = null;
        stopServer();
    });

    // Prevent accidental closing
    mainWindow.on('close', (e) => {
        if (mainWindow) {
            e.preventDefault();
            dialog.showMessageBox(mainWindow, {
                type: 'question',
                buttons: ['Затвори', 'Минимизирай в трея', 'Отказ'],
                title: 'Потвърждение',
                message: 'Какво искате да направите с Lemon Box?',
                defaultId: 1,
                cancelId: 2
            }).then(result => {
                if (result.response === 0) {
                    mainWindow.destroy();
                } else if (result.response === 1) {
                    mainWindow.hide();
                }
            });
        }
    });
}

function startServer() {
    try {
        // Use development path during development, and resourcesPath for production
        const serverPath = app.isPackaged 
            ? path.join(process.resourcesPath, "app", "server.js")
            : path.join(__dirname, "server.js");

        // In production, we need to set the NODE_PATH to include node_modules
        const env = app.isPackaged 
            ? { ...process.env, NODE_PATH: path.join(process.resourcesPath, "app", "node_modules") }
            : process.env;

        serverProcess = spawn("node", [serverPath], {
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: process.platform === 'win32',
            env: env
        });

        serverProcess.stdout.on("data", (data) => {
            console.log(`Server: ${data.toString()}`);
        });

        serverProcess.stderr.on("data", (data) => {
            console.error(`Server Error: ${data.toString()}`);
            if (!data.toString().includes('EADDRINUSE')) {
                dialog.showErrorBox('Server Error', 'The radio server encountered an error.');
            }
        });

        serverProcess.on('error', (error) => {
            console.error('Failed to start server:', error);
            if (error.code === 'ENOENT') {
                dialog.showErrorBox('Server Error', 'Could not find server.js file.');
            } else {
                dialog.showErrorBox('Server Error', `Failed to start the radio server: ${error.message}`);
            }
        });

        serverProcess.on('exit', (code, signal) => {
            if (code !== 0 && code !== null) {
                console.error(`Server exited with code ${code}`);
                if (code !== 1) {
                    dialog.showErrorBox('Server Error', `The radio server stopped unexpectedly (${code}).`);
                }
            }
        });
    } catch (error) {
        console.error('Server start error:', error);
        dialog.showErrorBox('Server Error', `Failed to initialize the radio server: ${error.message}`);
    }
}

function stopServer() {
    if (serverProcess) {
        try {
            serverProcess.kill();
            serverProcess = null;
        } catch (error) {
            console.error('Error stopping server:', error);
        }
    }
}

// App lifecycle management
app.whenReady().then(createWindow).catch(error => {
    console.error('Failed to initialize application:', error);
    dialog.showErrorBox('Initialization Error', 'Failed to start the application.');
    app.exit(1);
});

app.on("window-all-closed", () => {
    stopServer();
    if (tray) {
        tray.destroy();
    }
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Handle app errors
app.on('render-process-gone', (event, webContents, details) => {
    console.error('Render process gone:', details);
    dialog.showErrorBox('Error', 'The application encountered a critical error and needs to restart.');
    app.relaunch();
    app.exit(1);
});

// Optional: Handle squirrel events for Windows installer
if (require('electron-squirrel-startup')) app.quit();
