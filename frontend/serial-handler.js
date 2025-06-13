/**
 * initSerialPort functie
 *
 * Initialiseer en open een seriële poort voor Arduino-communicatie.
 * • Log alle beschikbare poorten.
 * • Open de opgegeven poort met de gekozen baudrate.
 * • Lees inkomende data per regel en stuur naar de renderer via IPC.
 * • Log eventuele verbindingsfouten.
 *
 * @param {BrowserWindow} mainWindow - Het Electron BrowserWindow object dat de IPC ontvangt
 * @param {string} portPath - Het pad of de naam van de seriële poort (bijv. "COM3" of "/dev/ttyUSB0")
 * @param {number} baudRate - De baudrate voor de seriële verbinding (bijv. 9600)
 * @returns {Promise<SerialPort>} - De geopende SerialPort instance
 */
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

export async function initSerialPort(mainWindow, portPath, baudRate) {
	// 1) Haal lijst op van alle beschikbare seriële poorten
	const ports = await SerialPort.list();
	console.log("Beschikbare seriële poorten:", ports);

	// 2) Maak en open een nieuw SerialPort-object
	const port = new SerialPort({
		path: portPath,
		baudRate: baudRate,
		autoOpen: true,
	});

	// 3) Koppel een Readline-parser om per regel data te ontvangen
	const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));
	parser.on("data", (line) => {
		const trimmed = line.trim(); // Verwijder whitespace en newline
		if (trimmed) {
			// Stuur de ontvangen regel naar de renderer via IPC
			mainWindow.webContents.send("arduino-data", trimmed);
		}
	});

	// 4) Foutafhandeling voor seriële poort
	port.on("error", (err) => {
		console.error("SerialPort-fout:", err);
	});
	// 5) Retourneer de geopende poort voor eventueel latere acties
	return port;
}
