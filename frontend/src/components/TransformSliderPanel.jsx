/**
 * TransformSliderPanel component
 *
 * Toont een set schuifregelaars gebaseerd op SLIDER_CONFIG voor transformaties
 * (bijvoorbeeld stretch, slant, enz.).
 * Bij wijziging van een slider wordt de onChange-callback aangeroepen met
 * de bijgewerkte waarden.
 */
// src/components/TransformSliderPanel.jsx
import React from "react";
import "../styles/TransformSliderPanel.css";
import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG";

export default function TransformSliderPanel({ values, onChange }) {
	/**
	 * Genereert een handler voor slider-wijzigingen
	 * @param {string} id - unieke identifier van de slider
	 * @param {number} step - stapgrootte van de slider (bepaalt integer of float parsing)
	 * @param {string} rawValue - waarde als string uit het event
	 */
	const handleChange = (id, step, rawValue) => {
		// Bepaal of de waarde een integer of float moet worden
		const parsed =
			step % 1 === 0 ? parseInt(rawValue, 10) : parseFloat(rawValue);
		// Werk de waarden bij en roep onChange aan met de nieuwe state
		onChange({ ...values, [id]: parsed });
	};

	return (
		<div className="transform-panel">
			<h3>TRANSFORM SLIDERS</h3>
			{/* Loop door alle slider-configuraties */}
			{SLIDER_CONFIG.map(({ id, label, min, max, step }) => (
				<div key={id} className="slider-row">
					<label htmlFor={id}>
						{/* Toon label en huidige waarde met het juiste aantal decimalen */}
						{label}: {values[id]?.toFixed(step < 1 ? 2 : 0)}
					</label>
					<input
						id={id}
						type="range"
						min={min}
						max={max}
						step={step}
						value={values[id]}
						onChange={(e) => handleChange(id, step, e.target.value)} // Wijzigings-handler
					/>
				</div>
			))}
		</div>
	);
}
