const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	printSilent: () => ipcRenderer.send("print-silent"),

	onArduinoData: (callback) => {
		ipcRenderer.on("arduino-data", (_, data) => {
			callback(data);
		});
	},
});
