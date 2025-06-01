import React, { useEffect, useState } from "react";

export default function PotmeterReader() {
	const [value, setValue] = useState(null);

	useEffect(() => {
		// Zodra “arduino-data” binnenkomt, update de state
		if (window.electronAPI && window.electronAPI.onArduinoData) {
			window.electronAPI.onArduinoData((line) => {
				const match = line.match(/\d+/);
				if (match) {
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
