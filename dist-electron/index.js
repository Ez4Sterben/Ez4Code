"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const createWindow = () => {
  const win = new electron.BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      // 是否开启隔离上下文
      nodeIntegration: true,
      // 渲染进程使用Node API
      preload: path.join(__dirname, "./preload.js")
      // 需要引用js文件
    }
  });
  if (process.env.NODE_ENV !== "development") {
    win.loadFile(path.join(__dirname, "./index.html"));
    win.webContents.openDevTools();
  } else {
    let url = "http://localhost:5173";
    win.loadURL(url);
    win.webContents.openDevTools();
  }
};
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.ipcMain.handle("select-folder", async () => {
  const result = await electron.dialog.showOpenDialog({
    properties: ["openDirectory"]
  });
  return result.filePaths[0];
});
electron.ipcMain.handle("read-directory", async (event, dirPath) => {
  const readDirRecursive = (dir) => {
    const result = [];
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        result.push({ name: file, children: readDirRecursive(filePath) });
      } else {
        result.push({ name: file });
      }
    });
    return result;
  };
  return readDirRecursive(dirPath);
});
electron.ipcMain.handle("read-file", async (event, filePath) => {
  return fs.readFileSync(filePath, "utf-8");
});
electron.ipcMain.handle("write-file", async (event, filePath, content) => {
  try {
    await fs.promises.writeFile(filePath, content, "utf8");
    return { success: true };
  } catch (error) {
    console.error("Error writing file:", error);
    return { success: false, error: error.message };
  }
});
