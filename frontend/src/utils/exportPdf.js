/**
 * ExportPdf util
 *
 * Genereert een PDF-bestand vanuit een PNG-dataURL van een canvas.
 * Maakt gebruik van jsPDF om de afbeelding in te voegen in een PDF van dezelfde afmetingen.
 */
// src/utils/exportPdf.js
import { jsPDF } from "jspdf";

/**
 * Genereer een PDF-arraybuffer van een PNG-dataURL.
 * @param {string} dataUrl  – image/png Data-URL van het canvas
 * @param {number} width    – breedte in pixels
 * @param {number} height   – hoogte in pixels
 * @returns {ArrayBuffer}   – PDF als arraybuffer
 */
export function generatePdfFromImage(dataUrl, width, height) {
	// Maak een jsPDF document aan met pixel-eenheden en het formaat [width, height]
	const pdf = new jsPDF({
		unit: "px",
		format: [width, height],
	});
	// Voeg de afbeelding toe op positie (0,0) met de volledige canvas-afmetingen
	pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
	return pdf.output("arraybuffer");
}
