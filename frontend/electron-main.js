// electron-main.js
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// __dirname berekenen in ES-module modus:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		fullscreen: true,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, "electron-preload.js"),
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	if (process.env.NODE_ENV === "development") {
		mainWindow.loadURL("http://localhost:5174");
	} else {
		const indexHtml = path.join(__dirname, "dist", "index.html");
		mainWindow.loadFile(indexHtml);
	}

	// Optioneel: IPC voor “silent print” (laat Electron direct naar de printer gaan)
	ipcMain.on("print-silent", () => {
		mainWindow.webContents.print(
			{ silent: true, printBackground: true },
			(success, failureReason) => {
				if (!success) console.error("Print mislukt:", failureReason);
			}
		);
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
		app.quit();
	});
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
