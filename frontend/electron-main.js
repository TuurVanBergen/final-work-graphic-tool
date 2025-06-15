/**
 * Electron main-process
 *
 * Verantwoordelijk voor het opstarten van de BrowserWindow,
 * initialiseren van de seriële poort voor Arduino-communicatie,
 * afhandelen van IPC-requests voor print, PDF, afbeeldingen en gallerij-bestanden,
 */
// src/electron-main.js
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import { initSerialPort } from "./serial-handler.js";
import fs from "fs/promises";

// Bepaal __dirname in ES-module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory voor opgeslagen gallerij-bestanden
const galleryDir = path.join(app.getPath("userData"), "gallerij");
let mainWindow; // Ref naar het hoofdvenster
let serialPortHandle; // Referentie naar de geopende SerialPort

/**
 * Maak het hoofdvenster en initialiseer functionaliteit
 */
function createWindow() {
	// 1) Maak BrowserWindow aan
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
	// 2) Laad frontend: ontwikkel of productie
	if (process.env.NODE_ENV === "development") {
		mainWindow.loadURL("http://localhost:5173");
	} else {
		const indexHtml = path.join(__dirname, "dist", "../dist/index.html");
		mainWindow.loadFile(indexHtml);
	}

	// 3) Open seriële poort voor Arduino
	try {
		serialPortHandle = initSerialPort(
			mainWindow,
			"/dev/cu.usbmodem11201",
			9600
		);
		console.log("SerialPort geopend op /dev/cu.usbmodem11101 @9600");
	} catch (err) {
		console.error("Kon SerialPort niet openen:", err);
	}

	// 4) IPC-handler voor silent print
	ipcMain.on("print-silent", () => {
		console.log(" print-silent IPC ontvangen in main");
		mainWindow.webContents.print(
			{ silent: true, printBackground: true },
			(success, failureReason) => {
				if (!success) console.error("Print mislukt:", failureReason);
			}
		);
	});
	// 5) Opruiming bij sluiten van het venster
	mainWindow.on("closed", () => {
		// Sluit seriële poort  af
		if (serialPortHandle && typeof serialPortHandle.close === "function") {
			serialPortHandle.close();
		}
		mainWindow = null;
		app.quit();
	});
}
// 6) Wanneer Electron klaar is, maak het venster
app.whenReady().then(createWindow);

// 7) IPC voor opslaan van PDF-bestanden
ipcMain.handle("save-pdf", async (_, buffer, filename) => {
	// Maak map aan als die nog niet bestaat
	const dir = path.join(app.getPath("userData"), "gallerij");
	await fs.mkdir(dir, { recursive: true });

	const filePath = path.join(dir, filename);
	// buffer is een ArrayBuffer
	await fs.writeFile(filePath, Buffer.from(buffer));
	return filePath;
});
// 8) IPC voor opslaan van PNG-afbeelding
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
// 9) IPC voor oplijsten van gallery-bestanden op basis van type

ipcMain.handle("list-gallery-files", async (evt, type) => {
	const dir = path.join(app.getPath("userData"), "gallerij");
	await fs.mkdir(dir, { recursive: true });
	const files = await fs.readdir(dir);
	const prefix = type === "letter" ? "letter_" : "poster_";
	return files
		.filter((f) => f.startsWith(prefix))
		.map((f) => path.join(dir, f));
});
// 10) IPC voor openen van geselecteerd bestand in OS
ipcMain.handle("open-gallery-file", async (evt, filePath) => {
	return shell.openPath(filePath);
});
// 11) Quitting op niet-macOS platform
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
