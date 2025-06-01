import { applyGrid } from "../canvas/effects/applyGrid";
import { applyHalftone } from "../canvas/effects/applyHalftone";
import { applyBlendMode } from "../posterCanvas/effects/applyBlendMode";

/**
 * Teken de “basis” van de letter in het poster-canvas:
 * - Óf grid+halftone
 * - Óf alleen halftone
 * - Óf alleen grid
 * - Óf standaard lettercontour (outline of fill)
 *
 * Hierbij passen we ook de blendMode toe op basis van blendVal.
 *
 * @param {object} p         p5 instance
 * @param {Array<{x:number,y:number}>} finalPts  punten van de contour (geapplyde Effects)
 * @param {string} fillColor kleurcode voor vulling / stroke
 * @param {number} outlineW  lijngewicht (0 = geen outline → dan fill)
 * @param {number} blendVal  waarde van de blend-slider (0..10)
 */
export function drawPosterBase(p, finalPts, fillColor, outlineW, blendVal) {
	// 0) Zet blend mode op basis van slider
	applyBlendMode(p, blendVal);

	// 1) grid & halftone flags:
	const doGrid = p.gridSize > 10;
	const doHalftone = p.halftoneCount > 0;

	// 2) Zet kleur klaar voor applyGrid / applyHalftone
	p.shapeColor = fillColor;

	if (doGrid && doHalftone) {
		applyHalftone(p, finalPts);
		applyGrid(p, finalPts);
	} else if (doHalftone) {
		applyHalftone(p, finalPts);
	} else if (doGrid) {
		applyGrid(p, finalPts);
	} else {
		// Normale contour (outline of fill)
		if (outlineW > 0) {
			p.noFill();
			p.stroke(fillColor);
			p.strokeWeight(outlineW);
		} else {
			p.fill(fillColor);
			p.noStroke();
		}
		p.beginShape();
		finalPts.forEach((pt) => p.vertex(pt.x, pt.y));
		p.endShape(p.CLOSE);
	}
}
