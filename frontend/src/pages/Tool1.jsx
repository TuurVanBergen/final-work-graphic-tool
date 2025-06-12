import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Canvas from "../components/Canvas.jsx";
import TransformSliderPanel from "../components/TransformSliderPanel";
import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG";
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
	const navigate = useNavigate();
	const location = useLocation();

	// === Char + navigatie ===
	const incomingChar = location.state?.char;
	const initialIdx = incomingChar ? ALPHABET.indexOf(incomingChar) : 0;
	const [currentIndex] = useState(initialIdx >= 0 ? initialIdx : 0);

	// === Slider‐state ===
	const slidersFromState = location.state?.sliders;
	const [sliders, setSliders] = useState(slidersFromState ?? DEFAULT_SLIDERS);

	// === Refs voor p5, potmeters & knoppen ===
	const canvasRef = useRef(null);
	const latestRawPotsRef = useRef(null);
	const lastMappedRef = useRef(sliders);
	const lastButtonStatesRef = useRef([1, 1, 1, 1]); // HIGH=1, LOW=0

	// Modal‐state
	const [showConfirm, setShowConfirm] = useState(false);
	const initialSlidersRef = useRef(DEFAULT_SLIDERS);
	const isDirty = () => {
		const init = initialSlidersRef.current;
		return Object.keys(init).some((k) => init[k] !== sliders[k]);
	};

	// Handlers
	const handleBack = () => {
		if (isDirty()) setShowConfirm(true);
		else
			navigate("/", {
				state: { char: ALPHABET[currentIndex], sliders },
			});
	};
	const handleNext = () => {
		navigate("/poster", {
			state: {
				char: ALPHABET[currentIndex],
				sliders,
				fontSize: 500,
			},
		});
	};
	const handleConfirmYes = () => {
		// “JA” in modal → do the Back navigation
		navigate("/", {
			state: { char: ALPHABET[currentIndex], sliders },
		});
	};
	const handleConfirmNo = () => {
		// “NEE” in modal → sluit modal
		setShowConfirm(false);
	};

	// Muishandler: update zowel state als ref
	const handleManualChange = (newValues) => {
		setSliders(newValues);
		Object.entries(newValues).forEach(([id, val]) => {
			lastMappedRef.current[id] = val;
		});
	};

	useEffect(() => {
		if (!window.electronAPI?.onArduinoData) return;

		window.electronAPI.onArduinoData((line) => {
			const parts = line.trim().split(",").map(Number);
			const buttons = parts.slice(0, 4); // [btn0, btn1, btn2, btn3]
			const pots = parts.slice(-6);

			latestRawPotsRef.current = pots;

			// detecteer HIGH->LOW edge (knopgedruk)
			buttons.forEach((state, idx) => {
				const prev = lastButtonStatesRef.current[idx];
				if (prev === 1 && state === 0) {
					switch (idx) {
						case 3: // hardware-knop 4 = A
							showConfirm ? handleConfirmYes() : handleBack();
							break;
						case 2: // hardware-knop 3 = B
							showConfirm ? handleConfirmNo() : handleNext();
							break;
						case 1: // hardware-knop 2 = C
							console.log("Knop C gedrukt – voeg hier je C-logica toe");
							break;
						case 0: // hardware-knop 1 = D
							console.log("Knop D gedrukt – voeg hier je D-logica toe");
							break;
					}
				}
			});

			lastButtonStatesRef.current = buttons;
		});
	}, [showConfirm]);

	// 2) Potmeter‐throttle (60ms) → mapping → state → redraw
	useEffect(() => {
		const interval = setInterval(() => {
			const raw = latestRawPotsRef.current;
			if (!raw) return;

			let hasChange = false;
			setSliders((prev) => {
				const next = { ...prev };
				SLIDER_CONFIG.forEach(({ id, min, max, step }, i) => {
					const norm = raw[i] / 1023;
					let mapped = min + norm * (max - min);
					mapped =
						step >= 1 ? Math.round(mapped) : Math.round(mapped / step) * step;

					if (Math.abs(mapped - lastMappedRef.current[id]) >= step) {
						next[id] = mapped;
						lastMappedRef.current[id] = mapped;
						hasChange = true;
					}
				});
				return hasChange ? next : prev;
			});

			if (hasChange) canvasRef.current?.redraw();
		}, 60);
		return () => clearInterval(interval);
	}, []);

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
						fontSize={500}
						{...sliders}
						title="LETTER-BEWERKER"
					/>
				</div>
				{/* === Stappenbalk === */}
				<div className="steps">
					<div className="step completed">
						<span className="box" />
						ONTWERP JE LETTER
					</div>
					<div className="step">
						<span className="box" />
						ONTWERP DE POSTER
					</div>
					<div className="step">
						<span className="box" />
						OPSLAAN/PRINT
					</div>
				</div>
				<div className="transformSliderPanel">
					<TransformSliderPanel
						values={sliders}
						onChange={handleManualChange}
					/>
					<div className="buttons">
						<button onClick={handleBack} style={{ marginLeft: 16 }}>
							A. TERUG
						</button>
						<button onClick={handleNext} style={{ borderLeft: "none" }}>
							B. VERDER
						</button>
					</div>
				</div>
			</div>

			{showConfirm && (
				<div className="confirm-overlay">
					<div className="confirm-modal">
						<p>
							Weet je zeker dat je terug wil?
							<br />
							Niet-opgeslagen werk gaat verloren.
						</p>
						<div className="confirm-buttons">
							<button onClick={handleConfirmYes}>A. JA</button>
							<button onClick={handleConfirmNo}>B. NEE</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
