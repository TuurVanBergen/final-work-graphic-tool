const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	printSilent: () => ipcRenderer.send("print-silent"),
	savePdf: (buffer, filename) =>
		ipcRenderer.invoke("save-pdf", buffer, filename),
	onArduinoData: (callback) => {
		ipcRenderer.on("arduino-data", (_, data) => {
			callback(data);
		});
	},
	saveImage: (base64Png, name) =>
		ipcRenderer.invoke("save-image", base64Png, name),
	listGalleryFiles: (type) => ipcRenderer.invoke("list-gallery-files", type),
	openGalleryFile: (path) => ipcRenderer.invoke("open-gallery-file", path),
});
