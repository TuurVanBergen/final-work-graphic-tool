// src/components/DesignSliderPanel.jsx
import React from "react";
import "../styles/DesignSliderPanel.css";
import { SLIDER_CONFIG_POSTER } from "../config/SLIDER_CONFIG_POSTER";

export default function DesignSliderPanel({ values, onChange }) {
	const handleChange = (id, step, rawValue) => {
		const parsed =
			step % 1 === 0 ? parseInt(rawValue, 10) : parseFloat(rawValue);
		onChange({ ...values, [id]: parsed });
	};

	return (
		<div className="design-slider-panel">
			<h3>POSTER SLIDERS</h3>
			{SLIDER_CONFIG_POSTER.map(({ id, label, min, max, step }) => (
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
