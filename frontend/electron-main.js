import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import { initSerialPort } from "./serial-handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let serialPortHandle;

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

	// Open de seriële poort
	try {
		serialPortHandle = initSerialPort(
			mainWindow,
			"/dev/cu.usbmodem11101", // <-- vervang dit door het pad dat je in macOS ziet
			9600
		);
		console.log("SerialPort geopend op /dev/cu.usbmodem11101 @9600");
	} catch (err) {
		console.error("Kon SerialPort niet openen:", err);
	}

	// Print‐silent
	ipcMain.on("print-silent", () => {
		console.log(" print-silent IPC ontvangen in main");
		mainWindow.webContents.print(
			{ silent: true, printBackground: true },
			(success, failureReason) => {
				if (!success) console.error("Print mislukt:", failureReason);
			}
		);
	});

	mainWindow.on("closed", () => {
		// Sluit seriële poort  af
		if (serialPortHandle && typeof serialPortHandle.close === "function") {
			serialPortHandle.close();
		}
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
