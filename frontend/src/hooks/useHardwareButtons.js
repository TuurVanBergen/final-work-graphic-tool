/**
 * Custom React hook: useHardwareButtons
 *
 * Verbindt hardware-knoppen via Arduino-data met React-callbacks,
 * met per-knop cooldown en route-afhankelijke inschakeling.
 *
 * @param {object} options
 * @param {function} options.onA - Callback voor knop A (index 3)
 * @param {function} options.onB - Callback voor knop B (index 2)
 * @param {function} options.onC - Callback voor knop C (index 1)
 * @param {function} options.onD - Callback voor knop D (index 0)
 * @param {number} [options.cooldownMs=2000] - Cooldownduur in ms om herhaalde triggers te blokkeren
 * @param {string[]} [options.enabledOn=[]] - Array van paden waarop de hook actief is
 */
// src/hooks/useHardwareButtons.js
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function useHardwareButtons({
	onA = () => {},
	onB = () => {},
	onC = () => {},
	onD = () => {},
	cooldownMs = 2000, // Standaard cooldown na knopdruk (ms)
	enabledOn = [], // Routes waarop knoppen actief mogen zijn
}) {
	// Houdt de vorige states bij (1 = niet ingedrukt, 0 = ingedrukt)
	const lastStates = useRef([1, 1, 1, 1]);
	// Cooldown-flags per knop om snelle herhaalde triggers te voorkomen
	const cooling = useRef([false, false, false, false]);
	const { pathname } = useLocation(); // Huidige browser-route

	useEffect(() => {
		// Alleen luisteren als de preload API beschikbaar is en de huidige route in enabledOn zit
		if (!window.electronAPI?.onArduinoData) return;
		if (!enabledOn.includes(pathname)) return;

		const unsub = window.electronAPI.onArduinoData((line) => {
			const parts = line.trim().split(",").map(Number);
			// Eerste vier waarden zijn de states vd knoppen
			const buttons = parts.slice(0, 4);

			buttons.forEach((state, idx) => {
				const prev = lastStates.current[idx];

				// Detecteer overgang 1 naar 0 én geen actieve cooldown
				if (prev === 1 && state === 0 && !cooling.current[idx]) {
					// Roep de juiste callback aan op basis van index
					switch (idx) {
						case 3:
							onA();
							break;
						case 2:
							onB();
							break;
						case 1:
							onC();
							break;
						case 0:
							onD();
							break;
					}
					// Zet cooldown voor deze knop
					cooling.current[idx] = true;
					setTimeout(() => {
						cooling.current[idx] = false;
					}, cooldownMs);
				}
				// Werk vorige staat bij
				lastStates.current[idx] = state;
			});
		});
		// Opruimen: unsubscriber aanroepen
		return () => unsub();
	}, [pathname, enabledOn, onA, onB, onC, onD, cooldownMs]);
}
