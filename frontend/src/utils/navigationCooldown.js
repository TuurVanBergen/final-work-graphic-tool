// src/utils/navigationCooldown.js
let cooldownActive = false;

export function navigateWithCooldown(navigateFn, cooldownMs = 1000) {
	if (cooldownActive) return;

	navigateFn();
	cooldownActive = true;

	setTimeout(() => {
		cooldownActive = false;
	}, cooldownMs);
}
