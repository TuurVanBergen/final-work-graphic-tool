/**
 * applyJitter
 *
 * Past een jitter-effect (edge roughness) toe op een array punten,
 * waarbij elk punt willekeurig wordt verplaatst binnen een bereik
 * dat bepaald wordt door de edgeRoughness-slider.
 *
 * @param {object} p - p5.js instantie met property edgeRoughness
 * @param {Array<{x:number,y:number}>} points - Originele punten
 * @returns {Array<{x:number,y:number}>} - Nieuwe punten met jitter toegepast
 */
// src/utils/canvas/applyJitter.js
export function applyJitter(p, points) {
	// Bepaal maximale jitter-afstand (pixels) op basis van slider (0–100 → 0–10px)
	const maxJit = p.map(p.edgeRoughness, 0, 100, 0, 10);

	// Pas voor elk punt een willekeurige offset toe in X en Y
	return points.map(({ x, y }) => ({
		x: x + p.random(-maxJit, maxJit),
		y: y + p.random(-maxJit, maxJit),
	}));
}
