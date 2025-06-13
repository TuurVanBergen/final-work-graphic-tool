/**
 * applyHalftone util
 *
 * Tekent een halftone-effect van de contourpunten
 * op een p5.js canvas. Gebruikt een off-screen buffer om de
 * alpha-waarde van de lettervorm te bepalen per cel.
 *
 * Stappen:
 * 1) Bereken aantal kolommen/rijen op basis van halftoneCount
 * 2) Maak een p5.Graphics buffer en teken de vorm om alpha per pixel te lezen
 * 3) Loop over cellen, lees alpha in cel-midden en teken een cirkel
 *    met diameter afhankelijk van alpha en sizeFactor
 *
 * @param {object} p - p5.js instantie met properties: width, height, halftoneCount, shapeColor
 * @param {Array<{x:number,y:number}>} points - Array met contourpunten van de vorm
 */
// src/utils/canvas/effects/applyHalftone.js
export function applyHalftone(p, points) {
	// Stop als er geen halftoneCount is
	if (p.halftoneCount <= 0) return;

	// 1) Bereken kolommen en rijen voor het halftone raster
	const cols = p.halftoneCount;
	const rows = Math.ceil((p.height / p.width) * cols);
	const cellW = p.width / cols;
	const cellH = p.height / rows;
	// Size factor map van slider (0–100) naar schaal (0.5–3)
	const sizeFactor = p.map(p.halftoneCount, 0, 100, 0.5, 3);

	// 2) Maak buffer om vorm te tekenen en alpha te lezen
	const pg = p.createGraphics(p.width, p.height);
	pg.pixelDensity(1);
	pg.push();
	// Centreer de buffer-context op canvas-midden
	pg.translate(p.width / 2, p.height / 2);
	pg.beginShape();
	// Teken de contour van de vorm in buffer
	points.forEach((pt) => pg.vertex(pt.x, pt.y));
	pg.endShape(p.CLOSE);
	pg.pop();

	// 3) Teken de stippen op basis van alpha-waarde per cel
	p.push();
	// Zet origin terug naar (0,0)
	p.translate(-p.width / 2, -p.height / 2);
	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < cols; i++) {
			// Cel-midden bepalen
			const cx = Math.floor(i * cellW + cellW / 2);
			const cy = Math.floor(j * cellH + cellH / 2);
			// Lees alpha-kanaal in buffer (0–255) en normaliseer
			const alpha = pg.get(cx, cy)[3] / 255;
			if (alpha > 0) {
				// Bereken straal: cellMaat * sizeFactor * alpha
				const r = Math.min(cellW, cellH) * sizeFactor * alpha;
				p.noStroke();
				p.fill(p.shapeColor ?? "#2807FF");
				// Teken stip
				p.ellipse(cx, cy, r, r);
			}
		}
	}
	p.pop();
}
