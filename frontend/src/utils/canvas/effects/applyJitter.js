export function applyJitter(p, points) {
	const maxJit = p.map(p.edgeRoughness, 0, 100, 0, 10);
	return points.map(({ x, y }) => ({
		x: x + p.random(-maxJit, maxJit),
		y: y + p.random(-maxJit, maxJit),
	}));
}
