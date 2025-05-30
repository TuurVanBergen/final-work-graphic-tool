import React from "react";
import "../styles/DesignSliderPanel.css";

export default function DesignSliderPanel({ values, onChange }) {
	const sliders = [
		{ id: "rotation", label: "Rotatie", min: -180, max: 180, step: 1 },
		{ id: "scale", label: "Schaal", min: 0.1, max: 3, step: 0.01 },
		{ id: "bgHue", label: "Achtergrondkleur", min: 0, max: 9, step: 1 },
		{ id: "fillHue", label: "Vulling Hue", min: 0, max: 9, step: 1 },
		{ id: "outlineWidth", label: "Outline Dikte", min: 0, max: 20, step: 1 },
		{ id: "paletteIndex", label: "Palet Index", min: 0, max: 10, step: 1 },
		{ id: "inkBleed", label: "Ink Bleed", min: 0, max: 20, step: 1 },
	];

	const handleChange = (id, step, rawValue) => {
		const parsed =
			step % 1 === 0 ? parseInt(rawValue, 10) : parseFloat(rawValue);
		onChange({ ...values, [id]: parsed });
	};

	return (
		<div className="design-slider-panel">
			<h3>POSTER SLIDERS</h3>
			{sliders.map(({ id, label, min, max, step }) => (
				<div key={id} className="slider-row">
					<label htmlFor={id}>
						{label}: {values[id]?.toFixed(step < 1 ? 2 : 0)}
					</label>
					<input
						id={id}
						type="range"
						min={min}
						max={max}
						step={step}
						value={values[id] ?? min}
						onChange={(e) => handleChange(id, step, e.target.value)}
					/>
				</div>
			))}
		</div>
	);
}
