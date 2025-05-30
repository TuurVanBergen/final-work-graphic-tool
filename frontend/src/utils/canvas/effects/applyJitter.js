export function applyJitter(p, points) {
	const er = typeof p.edgeRoughness === "number" ? p.edgeRoughness : 0;
	if (er <= 0) return points;

	const maxJit = p.map(er, 0, 100, 0, 10);
	return points.map((pt) => ({
		x: pt.x + p.random(-maxJit, maxJit),
		y: pt.y + p.random(-maxJit, maxJit),
	}));
}
