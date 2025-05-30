import { applyStretch } from "./effects/applyStretch.js";

export function applyEffects(p, pts) {
	// Pas eerst stretch toe; verdere effecten volgen in latere stappen
	return applyStretch(p, pts);
}
