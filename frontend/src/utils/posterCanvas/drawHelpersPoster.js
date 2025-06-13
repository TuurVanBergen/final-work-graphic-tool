import { applyGrid } from "../canvas/effects/applyGrid";
import { applyHalftone } from "../canvas/effects/applyHalftone";
import { applyBlendMode } from "../posterCanvas/effects/applyBlendMode";

/**
 * drawPosterBase util
 *
 * Teken de basisvorm van de letter in het poster-canvas, inclusief
 * blend-modus, grid en halftone-effecten.
 *
 * Stappen:
 * 0) Stel de blend-modus in op basis van de sliderwaarde.
 * 1) Bepaal of grid en/of halftone actief zijn.
 * 2) Zet de vormkleur klaar voor de grid/halftone functies.
 * 3) Voer het juiste tekenpad uit:
 *    - Grid + halftone
 *    - Alleen halftone
 *    - Alleen grid
 *    - Of een gewone outline of fill van de contour.
 *
 * @param {object} p         - De p5.js instantie
 * @param {Array<{x:number,y:number}>} finalPts - Array met contourpunten
 * @param {string} fillColor - Hex- of CSS-kleurcode voor vulling/outline
 * @param {number} outlineW  - Lijngewicht voor outline (0 = geen outline)
 * @param {number} blendVal  - Blend-sliderwaarde (0..10)
 */
export function drawPosterBase(p, finalPts, fillColor, outlineW, blendVal) {
	// 0) Blend mode instellen
	applyBlendMode(p, blendVal);

	// 1) Controleren of grid en/of halftone actief is
	const doGrid = p.gridSize > 10;
	const doHalftone = p.halftoneCount > 0;

	// 2) Kies vormkleur voor de grid/halftone routines
	p.shapeColor = fillColor;

	// 2) Kies vormkleur voor de grid/halftone routines
	if (doGrid && doHalftone) {
		// Eerst halftone, dan grid eroverheen
		applyHalftone(p, finalPts);
		applyGrid(p, finalPts);
		// Alleen halftone
	} else if (doHalftone) {
		// Alleen halftone
		applyHalftone(p, finalPts);
	} else if (doGrid) {
		// Alleen grid
		applyGrid(p, finalPts);
	} else {
		// Geen effecten: teken eenvoudige outline of fill
		if (outlineW > 0) {
			// Outline-modus
			p.noFill();
			p.stroke(fillColor);
			p.strokeWeight(outlineW);
		} else {
			// Fill-modus zonder stroke
			p.fill(fillColor);
			p.noStroke();
		}
		// Bouw de shape op basis van finalPts
		p.beginShape();
		finalPts.forEach((pt) => p.vertex(pt.x, pt.y));
		p.endShape(p.CLOSE);
	}
}
