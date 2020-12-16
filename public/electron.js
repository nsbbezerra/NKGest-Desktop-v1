const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const PDFWindow = require("electron-pdf-window");
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
    frame: true,
    transparent: false,
    resizable: true,
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.webContents.on(
    "new-window",
    (event, url, frameName, disposition, options, aditionalFeatures) => {
      if (frameName === "PrintPdf") {
        event.preventDefault();
        electron.shell.openExternal(url);
      }
      if (frameName === "pdfSale") {
        event.preventDefault();
        const width = options.width;
        const height = options.height;
        const win = new PDFWindow({
          width: width,
          height: height,
        });
        win.loadURL(url);
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
