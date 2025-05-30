import { applyStretch } from "./effects/applyStretch";
import { applyJitter } from "./effects/applyJitter";

export function applyEffects(p, pts) {
	let transformed = applyStretch(p, pts);
	transformed = applyJitter(p, transformed);
	return transformed;
}
