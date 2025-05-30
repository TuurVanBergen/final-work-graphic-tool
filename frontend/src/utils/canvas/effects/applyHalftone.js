export function applyHalftone(p, points) {
	if (p.halftoneCount <= 0) return;

	const cols = p.halftoneCount;
	const rows = Math.ceil((p.height / p.width) * cols);
	const cellW = p.width / cols;
	const cellH = p.height / rows;
	const sizeFactor = p.map(p.halftoneCount, 0, 100, 0.5, 3);

	// Maak buffer met lettervorm
	const pg = p.createGraphics(p.width, p.height);
	pg.pixelDensity(1);
	pg.push();
	pg.translate(p.width / 2, p.height / 2);
	pg.beginShape();
	points.forEach((pt) => pg.vertex(pt.x, pt.y));
	pg.endShape(p.CLOSE);
	pg.pop();

	// Teken halftone dots
	p.push();
	p.translate(-p.width / 2, -p.height / 2);
	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < cols; i++) {
			const cx = Math.floor(i * cellW + cellW / 2);
			const cy = Math.floor(j * cellH + cellH / 2);
			const alpha = pg.get(cx, cy)[3] / 255;
			if (alpha > 0) {
				const r = Math.min(cellW, cellH) * sizeFactor * alpha;
				p.noStroke();
				p.fill(p.shapeColor ?? "#2807FF");

				p.ellipse(cx, cy, r, r);
			}
		}
	}
	p.pop();
}
