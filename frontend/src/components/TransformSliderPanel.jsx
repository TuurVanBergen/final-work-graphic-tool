import React from "react";
import "../styles/TransformSliderPanel.css";
import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG";

export default function TransformSliderPanel({ values, onChange }) {
	const handleChange = (id, step, rawValue) => {
		const parsed =
			step % 1 === 0 ? parseInt(rawValue, 10) : parseFloat(rawValue);
		onChange({ ...values, [id]: parsed });
	};

	return (
		<div className="transform-panel">
			<h3>TRANSFORM SLIDERS</h3>
			{SLIDER_CONFIG.map(({ id, label, min, max, step }) => (
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
						value={values[id]}
						onChange={(e) => handleChange(id, step, e.target.value)}
					/>
				</div>
			))}
		</div>
	);
}
