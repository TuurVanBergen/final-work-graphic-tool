export function applyGrid(p, points) {
	if (p.gridSize <= 10) return;

	const pg = p.createGraphics(p.width, p.height);
	pg.pixelDensity(1);
	pg.push();
	pg.translate(p.width / 2, p.height / 2);
	pg.fill("#2807FF");
	pg.noStroke();
	pg.beginShape();
	points.forEach((pt) => pg.vertex(pt.x, pt.y));
	pg.endShape(pg.CLOSE);
	pg.pop();

	const cell = p.width / p.gridSize;
	p.push();
	p.translate(-p.width / 2, -p.height / 2);
	for (let yy = 0; yy < p.height; yy += cell) {
		for (let xx = 0; xx < p.width; xx += cell) {
			// Rond de pixel-coördinaten af naar integers
			const cx = Math.floor(xx + cell / 2);
			const cy = Math.floor(yy + cell / 2);
			const col = pg.get(cx, cy);
			if (col[2] > 0) {
				p.noStroke();
				p.fill(p.shapeColor ?? "#2807FF");
				p.rect(xx, yy, cell, cell);
			}
		}
	}
	p.pop();
}
