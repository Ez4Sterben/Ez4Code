// electron-main/index.ts
import { app, BrowserWindow, dialog, ipcMain, globalShortcut } from "electron"
import path from "path"
import fs from 'fs'

const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            contextIsolation: false, // 是否开启隔离上下文
            nodeIntegration: true, // 渲染进程使用Node API
            preload: path.join(__dirname, "./preload.js"), // 需要引用js文件
        },
    })

    // 如果打包了，渲染index.html
    if (process.env.NODE_ENV !== 'development') {
        win.loadFile(path.join(__dirname, "./index.html"))
        win.webContents.openDevTools()
    } else {
        let url = "http://localhost:5173" // 本地启动的vue项目路径。注意：vite版本3以上使用的端口5173；版本2用的是3000
        win.loadURL(url)
        win.webContents.openDevTools()
    }

    // 注册全局快捷键
    app.whenReady().then(() => {
        const shortcut = process.platform === 'darwin' ? 'Command+L' : 'Ctrl+L';
        globalShortcut.register(shortcut, () => {
            win.webContents.send('toggle-dialog');
        });
    });
}

app.whenReady().then(() => {
    createWindow() // 创建窗口
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 关闭窗口
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on('will-quit', () => {
    // 注销所有快捷键
    globalShortcut.unregisterAll();
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return result.filePaths[0] // 返回选择的文件夹路径
})

ipcMain.handle('read-directory', async (event, dirPath) => {
  const readDirRecursive = (dir) => {
    const result = []
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        result.push({ name: file, children: readDirRecursive(filePath) })
      } else {
        result.push({ name: file })
      }
    })
    return result
  }
  return readDirRecursive(dirPath)
})

ipcMain.handle('read-file', async (event, filePath) => {
  return fs.readFileSync(filePath, 'utf-8')
})

// 添加 write-file 事件处理程序
ipcMain.handle('write-file', async (event, filePath, content) => {
  try {
    await fs.promises.writeFile(filePath, content, 'utf8');
    return { success: true };
  } catch (error) {
    console.error('Error writing file:', error);
    return { success: false, error: error.message };
  }
})

let isProjectPageActive = false;

ipcMain.on('page-status', (event, status) => {
  if (status === 'project' && !isProjectPageActive) {
    isProjectPageActive = true;
    const shortcut = process.platform === 'darwin' ? 'Command+L' : 'Ctrl+L';
    globalShortcut.register(shortcut, () => {
      const win = BrowserWindow.getFocusedWindow();
      if (win) {
        win.webContents.send('toggle-dialog');
      }
    });
  } else if (status !== 'project' && isProjectPageActive) {
    isProjectPageActive = false;
    globalShortcut.unregisterAll();
  }
});