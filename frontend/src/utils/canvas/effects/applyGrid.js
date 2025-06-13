/**
 * applyGrid util
 *
 * Tekent een grid-overlay op de vorm in het canvas.
 * Gebruikt een off-screen buffer om te bepalen waar de vorm aanwezig is,
 * en tekent in die cellen een gekleurde rechthoek van de gridSize.
 *
 * Stappen:
 * 1) Stop als gridSize ≤ 10 (grid uitgeschakeld).
 * 2) Maak een p5.Graphics buffer en teken de vorm om kleur/opaciteit per pixel te lezen.
 * 3) Bereken de grootte van elke grid-cel (width/gridSize).
 * 4) Loop over alle cellen, lees in de buffer de blauwe component (b) als indicator,
 *    en teken een rechthoek in cellen waar de vorm aanwezig is.
 *
 * @param {object} p - p5.js instantie met properties: width, height, gridSize, shapeColor
 * @param {Array<{x:number,y:number}>} points - Array met contourpunten van de vorm
 */
// src/utils/canvas/effects/applyGrid.js
export function applyGrid(p, points) {
	// 1) Grid alleen tekenen als gridSize > 10
	if (p.gridSize <= 10) return;

	// 2) Off-screen buffer maken voor vormdetectie
	const pg = p.createGraphics(p.width, p.height);
	pg.pixelDensity(1);
	pg.push();
	// Centreer buffer-coördinaten
	pg.translate(p.width / 2, p.height / 2);
	pg.fill("#2807FF");
	pg.noStroke();
	pg.beginShape();
	points.forEach((pt) => pg.vertex(pt.x, pt.y));
	pg.endShape(pg.CLOSE);
	pg.pop();

	// 3) Bereken celgrootte op basis van gridSize
	const cell = p.width / p.gridSize;

	// 4) Loop over cellen en teken waar de buffer-form aanwezig is
	p.push();
	p.translate(-p.width / 2, -p.height / 2);
	for (let yy = 0; yy < p.height; yy += cell) {
		for (let xx = 0; xx < p.width; xx += cell) {
			// Cel-midden bepalen
			const cx = Math.floor(xx + cell / 2);
			const cy = Math.floor(yy + cell / 2);
			const col = pg.get(cx, cy);
			// col[2] > 0 betekent dat de vorm daar aanwezig is
			if (col[2] > 0) {
				p.noStroke();
				p.fill(p.shapeColor ?? "#2807FF");
				// Teken rechthoek voor deze grid-cel
				p.rect(xx, yy, cell, cell);
			}
		}
	}
	p.pop();
}
