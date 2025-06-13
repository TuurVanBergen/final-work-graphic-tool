/**
 * SliderPanel component
 *
 * Deze component toont een set schuifregelaars op basis van de
 * meegegeven configuratie (config). Elke slider heeft een label,
 * minimum- en maximumwaarde en een stapgrootte. Bij wijziging
 * wordt via de onChange callback de bijgewerkte waardenlijst teruggegeven.
 */
import React from "react";
import "../styles/Tool2SliderPanel.css";

export default function SliderPanel({ config, values, onChange }) {
	/**
	 * Genereert een change-handler voor een specifieke slider
	 * @param {string} id - de unieke identifier van de slider
	 * @param {number} step - stapgrootte voor deze slider
	 * @returns {function} event handler
	 */
	const handleChange = (id, step) => (e) => {
		const raw = e.target.value;
		const parsed = step % 1 === 0 ? parseInt(raw, 10) : parseFloat(raw);
		onChange({ ...values, [id]: parsed });
	};

	return (
		<div className="slider-panel">
			<h3>PERSONAGE SLIDERS</h3>
			{config.map(({ id, label, min, max, step }) => (
				<div className="slider-row" key={id}>
					<label htmlFor={id}>
						{label}: {values[id]?.toFixed(step < 1 ? 2 : 0)}
					</label>
					<input
						id={id}
						type="range"
						min={min}
						max={max}
						step={step}
						value={values[id]}
						onChange={handleChange(id, step)}
					/>
				</div>
			))}
		</div>
	);
}
