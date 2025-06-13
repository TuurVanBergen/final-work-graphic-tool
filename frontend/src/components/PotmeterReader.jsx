/**
 * PotmeterReader component
 *
 * Leest via Electron de potentiometerwaarde van een Arduino in
 * en toont deze real-time in de UI.
 */
import React, { useEffect, useState } from "react";

export default function PotmeterReader() {
	const [value, setValue] = useState(null);

	useEffect(() => {
		// Controleer of de Electron-API beschikbaar is
		if (window.electronAPI && window.electronAPI.onArduinoData) {
			// Register callback voor inkomende Arduino-data

			window.electronAPI.onArduinoData((line) => {
				// Zoek het eerste getal in de ontvangen string

				const match = line.match(/\d+/);
				if (match) {
					// Parse en update de state met de gevonden waarde

					setValue(parseInt(match[0], 10));
				}
			});
		}
	}, []);

	return (
		<div>
			<p>Huidige potmeter‐waarde: {value !== null ? value : "—"}</p>
		</div>
	);
}
