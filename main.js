// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const serve = require("electron-serve");
const waitPort = require("wait-port");

const loadURL = serve({ directory: "./build" });

async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.removeMenu();

  if (isDev) {
    await waitPort({ target: "localhost", port: 8080 });
    mainWindow.loadURL("http://localhost:8080");
    mainWindow.webContents.openDevTools();
  } else {
    await loadURL(mainWindow);
  }

  return mainWindow;
}

(async () => {
  await app.whenReady();

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
  });
})();
