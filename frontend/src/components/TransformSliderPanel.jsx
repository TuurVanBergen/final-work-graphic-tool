import React from "react";
import "../styles/TransformSliderPanel.css";

// Slider-configuratie
const SLIDERS = [
	{ id: "cornerRadius", label: "CORNER RADIUS", min: 0, max: 100, step: 1 },
	{ id: "pixelate", label: "PIXELATE", min: 0, max: 32, step: 1 },
	{ id: "glitch", label: "GLITCH", min: 0, max: 200, step: 1 },
	{ id: "gridSize", label: "GRID SIZE", min: 0, max: 50, step: 1 },
	{ id: "brailleDots", label: "BRAILLE DOTS", min: 0, max: 100, step: 1 },
	{ id: "specialParam1", label: "SPECIAL PARAM 1", min: 0, max: 100, step: 1 },
	{ id: "specialParam2", label: "SPECIAL PARAM 2", min: 0, max: 100, step: 1 },
];

export default function TransformSliderPanel({ values, onChange }) {
	const handleChange = (id, raw) => {
		const parsed = id === "pixelate" ? parseInt(raw, 10) : parseFloat(raw);
		onChange({ ...values, [id]: parsed });
	};

	return (
		<div className="transform-panel">
			<h3>GLYPH SLIDERS</h3>
			{SLIDERS.map(({ id, label, min, max, step }) => (
				<div className="slider-row" key={id}>
					<label htmlFor={id}>
						{label}: {values[id].toFixed(id === "pixelate" ? 0 : 2)}
					</label>
					<input
						id={id}
						type="range"
						min={min}
						max={max}
						step={step}
						value={values[id]}
						onChange={(e) => handleChange(id, e.target.value)}
					/>
				</div>
			))}
		</div>
	);
}
