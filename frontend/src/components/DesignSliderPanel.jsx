/**
 * DesignSliderPanel component
 *
 * Deze component rendert een paneel met sliders gebaseerd op
 * de configuratie in SLIDER_CONFIG_POSTER. Gebruikers kunnen waarden aanpassen,
 * en via de onChange-callback worden de bijgewerkte sliderwaarden teruggegeven.
 */
import React from "react";
import "../styles/DesignSliderPanel.css";
import { SLIDER_CONFIG_POSTER } from "../config/SLIDER_CONFIG_POSTER";

export default function DesignSliderPanel({ values, onChange }) {
	/**
	 * Handler voor wijzigingen in de slider
	 * @param {string} id - de sleutel van de slider uit de configuratie
	 * @param {number} step - stapgrootte van de slider, bepaalt parsing
	 * @param {string} rawValue - de ruwe waarde van het input event
	 */
	const handleChange = (id, step, rawValue) => {
		// Als step een geheel getal is, parseInt, anders parseFloat

		const parsed =
			step % 1 === 0 ? parseInt(rawValue, 10) : parseFloat(rawValue);
		// Roep de onChange callback aan met bijgewerkte waarden

		onChange({ ...values, [id]: parsed });
	};

	return (
		<div className="design-slider-panel">
			<h3>POSTER SLIDERS</h3>
			{/* Loop door alle slider-configuraties en render per slider een rij */}

			{SLIDER_CONFIG_POSTER.map(({ id, label, min, max, step }) => (
				<div key={id} className="slider-row">
					<label htmlFor={id}>
						{/* Toon label en actuele waarde, met 2 decimalen als step < 1, anders geen decimalen */}
						{label}: {values[id]?.toFixed(step < 1 ? 2 : 0)}
					</label>
					<input
						id={id}
						type="range"
						min={min}
						max={max}
						step={step}
						// Gebruik huidige waarde of fallback naar minimum

						value={values[id] ?? min}
						// Bij verandering, voer handleChange uit

						onChange={(e) => handleChange(id, step, e.target.value)}
					/>
				</div>
			))}
		</div>
	);
}
