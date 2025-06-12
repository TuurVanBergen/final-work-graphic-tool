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
	const pdf = new jsPDF({
		unit: "px",
		format: [width, height],
	});
	pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
	return pdf.output("arraybuffer");
}
