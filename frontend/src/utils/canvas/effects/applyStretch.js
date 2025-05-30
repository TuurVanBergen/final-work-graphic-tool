export function applyStretch(p, points) {
	const midY = p.bounds.y + p.bounds.h * 0.55 - (p.bounds.y + p.bounds.h / 2);

	const sxTop = 1 + p.proportion * 0.8;
	const syTop = 1 - p.proportion * 0.8;
	const sxBot = 1 + p.bottomProportion * 0.8;
	const syBot = 1 - p.bottomProportion * 0.8;

	return points.map(({ x, y }) =>
		y < midY ? { x: x * sxTop, y: y * syTop } : { x: x * sxBot, y: y * syBot }
	);
}
