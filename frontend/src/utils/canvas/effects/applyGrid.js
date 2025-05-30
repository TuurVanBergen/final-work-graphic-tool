export function applyGrid(p, points) {
	if (p.gridSize <= 10) return points;

	const pg = p.createGraphics(p.width, p.height);
	pg.pixelDensity(1);
	pg.push();
	pg.translate(p.width / 2, p.height / 2);
	pg.noFill();
	pg.stroke("#2807FF");
	pg.beginShape();
	points.forEach((pt) => pg.vertex(pt.x, pt.y));
	pg.endShape(p.CLOSE);
	pg.pop();

	const cell = p.width / p.gridSize;
	const result = [];
	for (let yy = 0; yy < p.height; yy += cell) {
		for (let xx = 0; xx < p.width; xx += cell) {
			const cx = Math.floor(xx + cell / 2);
			const cy = Math.floor(yy + cell / 2);
			const col = pg.get(cx, cy);
			if (col[2] > 0) {
				// bewaar elk cell als rect voor later tekenen
				result.push({ x: xx, y: yy, w: cell, h: cell });
			}
		}
	}
	return result;
}
