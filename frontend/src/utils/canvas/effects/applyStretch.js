export function applyStretch(p, points) {
	// Verdeelt de punten boven en onder het midden en schaalt ze anders
	const midY = 0; // punten zijn al gecentreerd
	const topScaleX = 1 + (p.proportion ?? 0) * 0.8;
	const topScaleY = 1 - (p.proportion ?? 0) * 0.8;
	const botScaleX = 1 + (p.bottomProportion ?? 0) * 0.8;
	const botScaleY = 1 - (p.bottomProportion ?? 0) * 0.8;

	return points.map((pt) =>
		pt.y < midY
			? { x: pt.x * topScaleX, y: pt.y * topScaleY }
			: { x: pt.x * botScaleX, y: pt.y * botScaleY }
	);
}
