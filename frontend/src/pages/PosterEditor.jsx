import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PosterCanvas from "../components/PosterCanvas";
import DesignSliderPanel from "../components/DesignSliderPanel";
import "../styles/PosterEditor.css";

export default function PosterEditor() {
	const location = useLocation();
	const navigate = useNavigate();
	// Haal char, sliders en fontSize uit de state van Tool1
	const { char, sliders: originalSliders, fontSize } = location.state || {};

	// Design staat voor position/scale/rotation/sliders voor poster
	const [design, setDesign] = useState({
		positionX: 0,
		positionY: 0,
		scale: 1,
		rotation: 0,
		fillHue: 0,
		inkBleed: 5,
		outlineWidth: 0,
	});

	const canvasRef = useRef(null);

	// Als er geen data is, terug naar Tool1
	useEffect(() => {
		if (!char || !originalSliders) {
			navigate("/tool1");
		}
	}, [char, originalSliders, navigate]);

	const handleBack = () => {
		navigate("/tool1", { state: { char, sliders: originalSliders, fontSize } });
	};

	const handleDownload = () => {
		alert("Downloaden als PDF wordt later geïmplementeerd.");
	};

	return (
		<div className="PosterEditorWrapper">
			{/* Links: PosterCanvas */}
			<div className="poster-canvas">
				<PosterCanvas
					ref={canvasRef}
					char={char}
					originalSliders={originalSliders}
					design={design}
					fontSize={fontSize}
				/>
			</div>

			{/* Rechts: DesignSliderPanel + knoppen */}
			<div className="poster-transformSliderPanel">
				<DesignSliderPanel values={design} onChange={setDesign} />
				<div className="buttons">
					<button onClick={handleBack}>A. TERUG</button>
					<button onClick={handleDownload}>B. DOWNLOAD</button>
				</div>
			</div>
		</div>
	);
}
