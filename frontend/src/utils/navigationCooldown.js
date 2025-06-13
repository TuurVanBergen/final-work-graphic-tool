/**
 * navigationCooldown util
 *
 * Biedt een functie om navigatiefuncties uit te voeren met een cooldown-periode,
 * zodat herhaalde navigatie-aanroepen binnen een korte tijd worden genegeerd.
 */
// src/utils/navigationCooldown.js

// Houdt bij of er momenteel een cooldown actief is
let cooldownActive = false;

/**
 * Voert een navigatiefunctie uit als er geen cooldown actief is,
 * en start vervolgens een cooldown-timer.
 *
 * @param {Function} navigateFn - De functie om navigatie uit te voeren
 * @param {number} [cooldownMs=1000] - Duur van de cooldown in milliseconden (default 1000ms)
 */
export function navigateWithCooldown(navigateFn, cooldownMs = 1000) {
	// Als er al een cooldown loopt, negeer de navigatie-aanroep
	if (cooldownActive) return;

	// Voer de navigatiefunctie uit
	navigateFn();
	// Zet de cooldown-flag
	cooldownActive = true;

	// Na de opgegeven tijd, reset de cooldown
	setTimeout(() => {
		cooldownActive = false;
	}, cooldownMs);
}
