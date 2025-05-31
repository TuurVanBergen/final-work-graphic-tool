import React from "react";
import "../styles/Tool2SliderPanel.css";

export default function SliderPanel({ config, values, onChange }) {
	const handleChange = (id, step) => (e) => {
		const raw = e.target.value;
		const parsed = step % 1 === 0 ? parseInt(raw, 10) : parseFloat(raw);
		onChange({ ...values, [id]: parsed });
	};

	return (
		<div className="slider-panel">
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
