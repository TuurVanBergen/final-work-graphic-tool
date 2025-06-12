// src/hooks/useHardwareButtons.js
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function useHardwareButtons({
	onA = () => {},
	onB = () => {},
	onC = () => {},
	onD = () => {},
	cooldownMs = 2000, // <— hier stel je in hoe lang je wilt wachten
	enabledOn = [], // array van paden waar de buttons mogen werken
}) {
	const lastStates = useRef([1, 1, 1, 1]);
	const cooling = useRef([false, false, false, false]);
	const { pathname } = useLocation();

	useEffect(() => {
		if (!window.electronAPI?.onArduinoData) return;
		if (!enabledOn.includes(pathname)) return;

		const unsub = window.electronAPI.onArduinoData((line) => {
			const parts = line.trim().split(",").map(Number);
			const buttons = parts.slice(0, 4);

			buttons.forEach((state, idx) => {
				const prev = lastStates.current[idx];

				// 1→0 én niet in cooldown
				if (prev === 1 && state === 0 && !cooling.current[idx]) {
					// call callback
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
					// start cooldown
					cooling.current[idx] = true;
					setTimeout(() => {
						cooling.current[idx] = false;
					}, cooldownMs);
				}

				lastStates.current[idx] = state;
			});
		});

		return () => unsub();
	}, [pathname, enabledOn, onA, onB, onC, onD, cooldownMs]);
}
