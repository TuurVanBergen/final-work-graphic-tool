const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	printSilent: () => ipcRenderer.send("print-silent"),
	savePdf: (buffer, filename) =>
		ipcRenderer.invoke("save-pdf", buffer, filename),
	onArduinoData: (cb) => {
		// maak één listener aan, en geef een cleanup-functie terug
		const listener = (_evt, data) => cb(data);
		ipcRenderer.on("arduino-data", listener);
		// de returnwaarde wordt in React als 'unsubscribe' gebruikt
		return () => {
			ipcRenderer.removeListener("arduino-data", listener);
		};
	},
	saveImage: (base64Png, name) =>
		ipcRenderer.invoke("save-image", base64Png, name),
	listGalleryFiles: (type) => ipcRenderer.invoke("list-gallery-files", type),
	openGalleryFile: (path) => ipcRenderer.invoke("open-gallery-file", path),
});
