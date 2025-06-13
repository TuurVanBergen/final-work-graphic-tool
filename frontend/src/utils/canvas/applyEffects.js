/**
 * applyEffects util
 *
 * Past verschillende visuele effecten toe op een array van punten:
 * 1) Stretch (proportional scaling boven en onder middellijn)
 * 2) Jitter (edge roughness) met caching voor consistente offsets
 *
 * @param {object} p - p5.js instantie met slider-waarden als properties
 * @param {Array<{x:number,y:number}>} pts - Originele array van punten
 * @returns {Array<{x:number,y:number}>} - Nieuwe array met getransformeerde punten
 */
// src/utils/canvas/applyEffects.js
export function applyEffects(p, pts) {
	// Kopieer array om originele punten niet aan te passen
	let transformed = [...pts];

	// ----- 1) Stretch-effect -----
	// Controleer of beide proportie-sliders gedefinieerd zijn
	if (
		typeof p.proportion === "number" &&
		typeof p.bottomProportion === "number"
	) {
		const midY = 0; // Alles gecentreerd rond punt y=0
		// Bereken schaalfactoren boven en onder middellijn
		const sxTop = 1 + p.proportion * 0.8;
		const syTop = 1 - p.proportion * 0.8;
		const sxBot = 1 + p.bottomProportion * 0.8;
		const syBot = 1 - p.bottomProportion * 0.8;

		// Pas horizontale en verticale scaling toe op elk punt
		transformed = transformed.map(({ x, y }) =>
			y < midY ? { x: x * sxTop, y: y * syTop } : { x: x * sxBot, y: y * syBot }
		);
	}
	// ----- 2) Jitter (edge roughness) -----
	// Lees edge roughness-waarde of default 0
	const er = typeof p.edgeRoughness === "number" ? p.edgeRoughness : 0;

	// Initialiseer cache voor jitter-offsets als nog niet gedaan
	if (!Array.isArray(p._jitterOffsets)) {
		p._jitterOffsets = [];
		p._cachedEdgeRoughness = null;
		p._cachedPtsLength = 0;
	}

	// Herbereken offsets als edgeRoughness of lengte van punten veranderd is
	if (
		p._cachedEdgeRoughness !== er ||
		p._cachedPtsLength !== transformed.length
	) {
		p._jitterOffsets = [];
		if (er > 0) {
			// Map edgeRoughness (0–100) naar max jitter (0–10 pixels)
			const maxJit = p.map(er, 0, 100, 0, 10);
			for (let i = 0; i < transformed.length; i++) {
				// Genereer willekeurige offset per punt
				p._jitterOffsets[i] = {
					dx: p.random(-maxJit, maxJit),
					dy: p.random(-maxJit, maxJit),
				};
			}
		}
		// Sla huidige instellingen op in cache
		p._cachedEdgeRoughness = er;
		p._cachedPtsLength = transformed.length;
	}

	// Pas jitter-offsets toe als edgeRoughness > 0
	if (er > 0) {
		transformed = transformed.map((pt, i) => ({
			x: pt.x + (p._jitterOffsets[i]?.dx || 0),
			y: pt.y + (p._jitterOffsets[i]?.dy || 0),
		}));
	}

	return transformed;
}
