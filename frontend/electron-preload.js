/**
 * preload script voor Electron
 *
 * Verbindt de main-process IPC (via ipcRenderer) met de renderer-process
 * door selectieve API's bloot te stellen in window.electronAPI.
 * Hierdoor kan de frontend veilig functies aanroepen zoals printSilent,
 * savePdf, saveImage, en luisteren naar Arduino-data.
 */
const { contextBridge, ipcRenderer } = require("electron");

// Expose API's in de renderer via window.electronAPI
contextBridge.exposeInMainWorld("electronAPI", {
	/**
	 * Verstuur een silent print-opdracht naar de main-process
	 */
	printSilent: () => ipcRenderer.send("print-silent"),

	/**
	 * Vraag het main-process om een PDF-bestand op te slaan
	 * @param {Buffer} buffer - de PDF-data als buffer
	 * @param {string} filename - gewenste bestandsnaam
	 * @returns {Promise<string>} - pad waar de PDF is opgeslagen
	 */
	savePdf: (buffer, filename) =>
		ipcRenderer.invoke("save-pdf", buffer, filename),

	/**
	 * Luister naar "arduino-data" events vanuit main-process
	 * en roep cb(data) aan voor elk ontvangen bericht.
	 * @param {function(string): void} cb - callback voor inkomende data
	 * @returns {function(): void} - functie om listener te verwijderen
	 */
	onArduinoData: (cb) => {
		// Registratie van event listener
		const listener = (_evt, data) => cb(data);
		ipcRenderer.on("arduino-data", listener);
		// Return functie om de listener weer te verwijderen (unsubscribe)
		return () => {
			ipcRenderer.removeListener("arduino-data", listener);
		};
	},
	/**
	 * Sla een PNG-afbeelding op via main-process
	 * @param {string} base64Png - image data als base64-string
	 * @param {string} name - gewenste bestandsnaam (met extensie)
	 * @returns {Promise<string>} - pad waar de afbeelding is opgeslagen
	 */
	saveImage: (base64Png, name) =>
		ipcRenderer.invoke("save-image", base64Png, name),
	/**
	 * Vraag de main-process om bestanden in de gallerij-directory op te sommen
	 * @param {string} type - gallerij-type (bijv. "letter" of "poster")
	 * @returns {Promise<string[]>} - lijst van bestands-paden
	 */
	listGalleryFiles: (type) => ipcRenderer.invoke("list-gallery-files", type),
	/**
	 * Vraag de main-process om een gallerij-bestand te openen
	 * @param {string} path - pad naar het bestand
	 * @returns {Promise<void>}
	 */
	openGalleryFile: (path) => ipcRenderer.invoke("open-gallery-file", path),
});
