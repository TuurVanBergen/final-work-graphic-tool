/**
 * applyStretch util
 *
 * Past een stretch-effect toe op een array punten, waarbij punten boven
 * en onder een middellijn verschillend geschaald worden op basis van
 * proportion- en bottomProportion-sliders.
 *
 * @param {object} p - p5.js instance met properties: bounds, proportion, bottomProportion
 * @param {Array<{x:number,y:number}>} points - Array van origineel gecentreerde punten
 * @returns {Array<{x:number,y:number}>} - Array van geschaalde punten
 */
// src/utils/canvas/applyStretch.js
export function applyStretch(p, points) {
	// Bepaal de Y-waarde van de middellijn in canvas-coördinaten
	// p.bounds geeft oorspronkelijke tekstgrenzen
	const midY = p.bounds.y + p.bounds.h * 0.55 - (p.bounds.y + p.bounds.h / 2);

	// Bereken schaalfactoren voor boven- en onderkant
	const sxTop = 1 + p.proportion * 0.8; // Horizontale stretch boven middellijn
	const syTop = 1 - p.proportion * 0.8; // Verticale compressie boven middellijn
	const sxBot = 1 + p.bottomProportion * 0.8; // Horizontale stretch onder middellijn
	const syBot = 1 - p.bottomProportion * 0.8; // Verticale compressie onder middellijn

	// Pas de schaal toe op elk punt
	return points.map(({ x, y }) =>
		y < midY ? { x: x * sxTop, y: y * syTop } : { x: x * sxBot, y: y * syBot }
	);
}
