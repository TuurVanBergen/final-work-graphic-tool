export function drawGrid(p, { width, height }) {
	const cols = 20,
		rows = 25,
		subdiv = 4;
	const largeW = width / cols;
	const largeH = height / rows;
	const smallW = largeW / subdiv;
	const smallH = largeH / subdiv;

	// Kleine lijnen
	p.stroke("#FFC9C9");
	p.strokeWeight(1);
	for (let i = 0; i <= cols * subdiv; i++) {
		const x = i < cols * subdiv ? i * smallW : width;
		p.line(x, 0, x, height);
	}
	for (let i = 0; i <= rows * subdiv; i++) {
		const y = i < rows * subdiv ? i * smallH : height;
		p.line(0, y, width, y);
	}

	// Grote lijnen
	p.stroke("#D62323");
	p.strokeWeight(1);
	for (let i = 0; i <= cols; i++) {
		const x = i < cols ? i * largeW : width;
		p.line(x, 0, x, height);
	}
	for (let i = 0; i <= rows; i++) {
		const y = i < rows ? i * largeH : height;
		p.line(0, y, width, y);
	}
}
