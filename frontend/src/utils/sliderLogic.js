// Units per em van het font
const UNITS_PER_EM = 1000;

/**
 * Pixelate effect: snap coordinates to font-unit grid
 */
export function applyGridSnap(commands, gridCount) {
	if (gridCount <= 0) return commands;
	const gridSize = UNITS_PER_EM / gridCount;
	return commands.map((cmd) => {
		const out = { ...cmd };
		["x", "x1", "x2"].forEach((p) => {
			if (out[p] != null) out[p] = Math.round(out[p] / gridSize) * gridSize;
		});
		["y", "y1", "y2"].forEach((p) => {
			if (out[p] != null) out[p] = Math.round(out[p] / gridSize) * gridSize;
		});
		return out;
	});
}

/**
 * Corner rounding: move each point toward midpoint of neighbors
 */
export function applyCornerRadius(commands, radius) {
	const t = Math.pow(Math.max(0, Math.min(radius / 100, 1)), 2);
	if (t === 0) return commands;
	const newCmds = commands.map((c) => ({ ...c }));
	for (let i = 1; i < newCmds.length - 1; i++) {
		const prev = newCmds[i - 1],
			curr = newCmds[i],
			next = newCmds[i + 1];
		if (prev.x != null && curr.x != null && next.x != null) {
			const midX = (prev.x + next.x) / 2,
				midY = (prev.y + next.y) / 2;
			curr.x = curr.x * (1 - t) + midX * t;
			curr.y = curr.y * (1 - t) + midY * t;
		}
	}
	return newCmds;
}

/**
 * Simple glitch: horizontal random shifts per contour slice
 */
export function applyGlitch(commands, amount = 0) {
	if (amount <= 0) return commands;
	// (Implement basic glitch or leave as no-op until refined)
	return commands;
}

/**
 * Braille dot effect: add tiny circle commands around each corner
 */
export function applyBrailleDots(commands, amount = 0) {
	if (amount <= 0) return commands;
	const maxDot = 0.1 * UNITS_PER_EM;
	const dotSize = (amount / 100) * maxDot;
	const out = commands.map((c) => ({ ...c }));
	commands.forEach((cmd) => {
		if (cmd.x != null && cmd.y != null) {
			out.push({ type: "CIRCLE", x: cmd.x, y: cmd.y, r: dotSize });
		}
	});
	return out;
}

/**
 * Master function: applies all slider mappings in order
 */
export function applySliderMappings(pathData, sliderValues) {
	let cmds = pathData.map((c) => ({ ...c }));
	cmds = applyGridSnap(cmds, sliderValues.gridSize);
	cmds = applyCornerRadius(cmds, sliderValues.cornerRadius);
	cmds = applyGlitch(cmds, sliderValues.glitch);
	cmds = applyBrailleDots(cmds, sliderValues.brailleDots);
	// pixelate uses `pixelate` slider as gridCount as well
	cmds = applyGridSnap(cmds, sliderValues.pixelate);
	return cmds;
}
