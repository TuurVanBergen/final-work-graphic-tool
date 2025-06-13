/**
 * drawGrid util
 *
 * Tekent een achtergrondraster op een p5.js canvas met zowel grote
 * als kleine lijnen. Handig voor hulplijnen en uitlijning.
 */
export function drawGrid(p, { width, height }) {
	const cols = 20,
		rows = 25,
		// Onderverdeling per grote cel voor kleine lijnen
		subdiv = 4;
	// Breedte en hoogte van grote cellen
	const largeW = width / cols;
	const largeH = height / rows;
	// Breedte en hoogte van kleine cellen binnen elke grote cel
	const smallW = largeW / subdiv;
	const smallH = largeH / subdiv;

	// Kleine lijnen
	p.stroke("#FFC9C9");
	p.strokeWeight(1);
	// Verticale kleine lijnen
	for (let i = 0; i <= cols * subdiv; i++) {
		// Bereken x-positie, of gebruik uiterste breedte voor laatste lijn
		const x = i < cols * subdiv ? i * smallW : width;
		p.line(x, 0, x, height);
	}
	// Horizontale kleine lijnen
	for (let i = 0; i <= rows * subdiv; i++) {
		const y = i < rows * subdiv ? i * smallH : height;
		p.line(0, y, width, y);
	}

	// Grote lijnen
	p.stroke("#D62323");
	p.strokeWeight(1);
	// Verticale grote lijnen
	for (let i = 0; i <= cols; i++) {
		const x = i < cols ? i * largeW : width;
		p.line(x, 0, x, height);
	}
	// Horizontale grote lijnen
	for (let i = 0; i <= rows; i++) {
		const y = i < rows ? i * largeH : height;
		p.line(0, y, width, y);
	}
}
