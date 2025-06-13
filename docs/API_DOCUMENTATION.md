# API Documentation

> Hierin staan alle publieke Electron-IPC-calls.

## Electron Renderer API (`window.electronAPI`)

Via `contextBridge.exposeInMainWorld("electronAPI", { … })`:

- `printSilent(): void`  
  Verstuur een IPC “print-silent” naar de main-process voor stille afdruk.
- `savePdf(buffer: ArrayBuffer, filename: string): Promise<string>`  
  Slaat een PDF op, retourneert het volledige bestands-pad.
- `saveImage(base64Png: string, name: string): Promise<string>`  
  Slaat een PNG op, retourneert het volledige bestands-pad.
- `listGalleryFiles(type: "letter" | "poster"): Promise<string[]>`  
  Krijg een lijst van bestandsnamen (`letter_…` of `poster_…`) in de gallerij-map.
- `openGalleryFile(path: string): Promise<void>`  
  Opent een bestand in de standaard OS-viewer.
- `onArduinoData(cb: (data: string) => void): () => void`  
  Luistert naar inkomende seriële data van de Arduino; geeft een unsubscribe-functie terug.

## Electron Main IPC-Handlers

- `ipcMain.on("print-silent", …)`
- `ipcMain.handle("save-pdf", async (_ , buffer, filename) => …)`
- `ipcMain.handle("save-image", async (_, base64, name) => …)`
- `ipcMain.handle("list-gallery-files", async (_, type) => …)`
- `ipcMain.handle("open-gallery-file", async (_, filePath) => …)`
