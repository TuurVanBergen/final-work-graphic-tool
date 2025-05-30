import React, { useState, useRef } from "react";
import Canvas from "../components/Canvas";
import TransformSliderPanel from "../components/TransformSliderPanel";
import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG";

const DEFAULT_SLIDERS = Object.fromEntries(
	SLIDER_CONFIG.map(({ id, default: def }) => [id, def])
);

export default function Tool1() {
	const [sliders, setSliders] = useState(DEFAULT_SLIDERS);
	const canvasRef = useRef(null);

	return (
		<div className="Tool1Wrapper">
			<div className="canvas">
				<Canvas ref={canvasRef} char="A" fontSize={650} {...sliders} />
			</div>
			<div className="transformSliderPanel">
				<TransformSliderPanel values={sliders} onChange={setSliders} />
			</div>
		</div>
	);
}
