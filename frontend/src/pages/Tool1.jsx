import { useState, useRef } from "react";
import Canvas from "../components/Canvas.jsx";
import TransformSliderPanel from "../components/TransformSliderPanel";
import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG";
import { useNavigate } from "react-router-dom";
import "../styles/Tool1.css";

const ALPHABET = [
	...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
	...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)),
	...Array.from({ length: 10 }, (_, i) => String(i)),
	",",
	"?",
	".",
	"!",
];

const DEFAULT_SLIDERS = Object.fromEntries(
	SLIDER_CONFIG.map(({ id, default: def }) => [id, def])
);

export default function Tool1() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [sliders, setSliders] = useState(DEFAULT_SLIDERS);
	const canvasRef = useRef(null);

	// om te weten wat de initiale waren:
	const initialSlidersRef = useRef(DEFAULT_SLIDERS);

	// modal-state
	const [showConfirm, setShowConfirm] = useState(false);

	// compacte helper om te checken of er iets veranderd is
	const isDirty = () => {
		const init = initialSlidersRef.current;
		return Object.keys(init).some((k) => init[k] !== sliders[k]);
	};

	const navigate = useNavigate();

	// nieuwe handleBack
	const handleBack = () => {
		if (isDirty()) {
			// toon modal in plaats van navigeren
			setShowConfirm(true);
		} else {
			// geen wijzigingen, gewoon terug
			navigate("/", {
				state: { char: ALPHABET[currentIndex], sliders },
			});
		}
	};

	const handleNext = () => {
		navigate("/poster", {
			state: {
				char: ALPHABET[currentIndex],
				sliders: sliders,
				fontSize: 650,
			},
		});
	};

	return (
		<div
			className="tool1‐content"
			style={{
				pointerEvents: showConfirm ? "none" : "auto",
				userSelect: showConfirm ? "none" : "auto",
			}}
		>
			<div className="Tool1Wrapper">
				<div className="canvas">
					<Canvas
						ref={canvasRef}
						char={ALPHABET[currentIndex]}
						fontSize={650}
						{...sliders}
						title="LETTER-BEWERKER"
					/>
				</div>
				<div className="transformSliderPanel">
					<TransformSliderPanel values={sliders} onChange={setSliders} />
					<div className="buttons">
						<button onClick={handleBack} style={{ marginLeft: "16px" }}>
							A. TERUG
						</button>
						<button onClick={handleNext} style={{ borderLeft: "none" }}>
							B. VERDER
						</button>
					</div>
				</div>
			</div>
			{/* Confirmation-modal */}
			{showConfirm && (
				<div className="confirm-overlay">
					<div className="confirm-modal">
						<p>
							Weet je zeker dat je terug wil?
							<br />
							Niet-opgeslagen werk gaat verloren.
						</p>
						<div className="confirm-buttons">
							<button
								onClick={() => {
									// gebruiker bevestigt: navigeer alsnog terug
									navigate("/", {
										state: { char: ALPHABET[currentIndex], sliders },
									});
								}}
							>
								A. JA
							</button>
							<button onClick={() => setShowConfirm(false)}>B. NEE</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
