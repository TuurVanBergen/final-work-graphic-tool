/**
 * Map een slider‐waarde (0…10) naar een p5-blendMode-constant.
 *
 * @param {object} p         p5 instance
 * @param {number} blendValue waarde van slider (0..10, step 1)
 */
export function applyBlendMode(p, blendValue) {
	// Lijst met p5 blendMode-constants
	const modes = [
		p.BLEND,
		p.ADD,
		p.MULTIPLY,
		p.SCREEN,
		p.OVERLAY,
		p.HARD_LIGHT,
		p.SOFT_LIGHT,
		p.DODGE,
		p.BURN,
		p.DIFFERENCE,
	];

	const idx = Math.min(blendValue, modes.length - 1);

	p.blendMode(modes[idx]);
}
