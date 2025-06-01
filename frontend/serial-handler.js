import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

export async function initSerialPort(mainWindow, portPath, baudRate) {
	const ports = await SerialPort.list();
	console.log("Beschikbare seriële poorten:", ports);

	const port = new SerialPort({
		path: portPath,
		baudRate: baudRate,
		autoOpen: true,
	});

	const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));
	parser.on("data", (line) => {
		const trimmed = line.trim();
		if (trimmed) {
			mainWindow.webContents.send("arduino-data", trimmed);
		}
	});

	port.on("error", (err) => {
		console.error("SerialPort-fout:", err);
	});

	return port;
}
