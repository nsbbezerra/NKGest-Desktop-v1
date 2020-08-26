const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;
const Menu = electron.Menu;

Menu.setApplicationMenu(false);

function createWindow() {
  const iconPath = path.resolve(__dirname, "sgom.png");
  mainWindow = new BrowserWindow({
    width: 1340,
    height: 700,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true,
      plugins: true,
    },
    icon: iconPath,
    frame: false,
    transparent: true,
    resizable: true,
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.webContents.on(
    "new-window",
    (event, url, frameName, disposition, options, aditionalFeatures) => {
      if (frameName === "PrintPdf") {
        event.preventDefault();
        electron.shell.openExternal(url);
      }
    }
  );
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
