import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import { initSerialPort } from "./serial-handler.js";
import fs from "fs/promises";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const galleryDir = path.join(app.getPath("userData"), "gallerij");
let mainWindow;
let serialPortHandle;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		fullscreen: true,
		autoHideMenuBar: true,
		webPreferences: {
			webSecurity: false,
			preload: path.join(__dirname, "electron-preload.js"),
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	if (process.env.NODE_ENV === "development") {
		mainWindow.loadURL("http://localhost:5173");
	} else {
		const indexHtml = path.join(__dirname, "dist", "index.html");
		mainWindow.loadFile(indexHtml);
	}

	// Open de seriële poort
	try {
		serialPortHandle = initSerialPort(
			mainWindow,
			"/dev/cu.usbmodem11101",
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
ipcMain.handle("save-pdf", async (_, buffer, filename) => {
	// Maak map aan als die nog niet bestaat
	const dir = path.join(app.getPath("userData"), "gallerij");
	await fs.mkdir(dir, { recursive: true });

	const filePath = path.join(dir, filename);
	// buffer is een ArrayBuffer
	await fs.writeFile(filePath, Buffer.from(buffer));
	return filePath;
});
ipcMain.handle("save-image", async (_, base64, name) => {
	await fs.mkdir(galleryDir, { recursive: true });
	const buffer = Buffer.from(base64, "base64");
	const filePath = path.join(galleryDir, name);
	await fs.writeFile(filePath, buffer);
	return filePath;
});
ipcMain.handle("list-gallery-images", async () => {
	try {
		await fs.mkdir(galleryDir, { recursive: true });
		const files = await fs.readdir(galleryDir);
		// enkel PNG’s
		return files
			.filter((f) => f.endsWith(".png"))
			.map((f) => path.join(galleryDir, f));
	} catch (e) {
		console.error(e);
		return [];
	}
});
ipcMain.handle("list-gallery-files", async (evt, type) => {
	const dir = path.join(app.getPath("userData"), "gallerij");
	await fs.mkdir(dir, { recursive: true });
	const files = await fs.readdir(dir);
	const prefix = type === "letter" ? "letter_" : "poster_";
	return files
		.filter((f) => f.startsWith(prefix))
		.map((f) => path.join(dir, f));
});

ipcMain.handle("open-gallery-file", async (evt, filePath) => {
	return shell.openPath(filePath);
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
