// src/utils/canvas/applyEffects.js
export function applyEffects(p, pts) {
	let transformed = [...pts]; // Stretch eerst

	// 1) Stretch (proportion & bottomProportion)
	if (
		typeof p.proportion === "number" &&
		typeof p.bottomProportion === "number"
	) {
		const midY = 0; // Alles is al gecentreerd
		const sxTop = 1 + p.proportion * 0.8;
		const syTop = 1 - p.proportion * 0.8;
		const sxBot = 1 + p.bottomProportion * 0.8;
		const syBot = 1 - p.bottomProportion * 0.8;

		transformed = transformed.map(({ x, y }) =>
			y < midY ? { x: x * sxTop, y: y * syTop } : { x: x * sxBot, y: y * syBot }
		);
	}

	// 2) Jitter: cache offsets per point, hergebruik bij proportie- of andere wijzigingen
	const er = typeof p.edgeRoughness === "number" ? p.edgeRoughness : 0;
	// Initialize cache structures
	if (!Array.isArray(p._jitterOffsets)) {
		p._jitterOffsets = [];
		p._cachedEdgeRoughness = null;
		p._cachedPtsLength = 0;
	}

	// Als edgeRoughness veranderd of aantal punten anders, recalc offsets
	if (
		p._cachedEdgeRoughness !== er ||
		p._cachedPtsLength !== transformed.length
	) {
		p._jitterOffsets = [];
		if (er > 0) {
			const maxJit = p.map(er, 0, 100, 0, 10);
			for (let i = 0; i < transformed.length; i++) {
				p._jitterOffsets[i] = {
					dx: p.random(-maxJit, maxJit),
					dy: p.random(-maxJit, maxJit),
				};
			}
		}
		p._cachedEdgeRoughness = er;
		p._cachedPtsLength = transformed.length;
	}

	// Pas cached offsets toe
	if (er > 0) {
		transformed = transformed.map((pt, i) => ({
			x: pt.x + (p._jitterOffsets[i]?.dx || 0),
			y: pt.y + (p._jitterOffsets[i]?.dy || 0),
		}));
	}

	return transformed;
}
