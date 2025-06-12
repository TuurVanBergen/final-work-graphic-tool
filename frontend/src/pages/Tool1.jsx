// src/pages/Tool1.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Canvas from "../components/Canvas.jsx";
import TransformSliderPanel from "../components/TransformSliderPanel";
import useHardwareButtons from "../hooks/useHardwareButtons";
import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG";
import "../styles/Tool1.css";
import { navigateWithCooldown } from "../utils/navigationCooldown";
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

	// === Refs voor p5 & potmeters ===
	const canvasRef = useRef(null);
	const latestRawPotsRef = useRef(null);
	const lastMappedRef = useRef(sliders);

	// === Modal‐state ===
	const [showConfirm, setShowConfirm] = useState(false);
	const initialSlidersRef = useRef(DEFAULT_SLIDERS);
	const isDirty = () => {
		const init = initialSlidersRef.current;
		return Object.keys(init).some((k) => init[k] !== sliders[k]);
	};
	const handleNext = () => {
		navigate("/poster", {
			state: { char: ALPHABET[currentIndex], sliders, fontSize: 500 },
		});
	};

	// === Handlers ===
	const handleBack = () => {
		if (isDirty()) setShowConfirm(true);
		else navigate("/", { state: { char: ALPHABET[currentIndex], sliders } });
	};

	const handleConfirmYes = () => {
		setShowConfirm(false);
		navigate("/", { state: { char: ALPHABET[currentIndex], sliders } });
	};
	const handleConfirmNo = () => setShowConfirm(false);

	const handleManualChange = (newValues) => {
		setSliders(newValues);
		Object.entries(newValues).forEach(([id, val]) => {
			lastMappedRef.current[id] = val;
		});
	};

	// === Hardware knoppen ===
	useHardwareButtons({
		onA: () =>
			navigateWithCooldown(() =>
				navigate("/", { state: { char: ALPHABET[currentIndex], sliders } })
			),
		onB: () => navigateWithCooldown(handleNext),
		enabledOn: ["/tool1"],
	});
	// === Arduino potmeters → sliders ===
	useEffect(() => {
		if (!window.electronAPI?.onArduinoData) return;
		const handler = (line) => {
			const parts = line.trim().split(",").map(Number);
			latestRawPotsRef.current = parts.slice(-SLIDER_CONFIG.length);
		};
		window.electronAPI.onArduinoData(handler);
		return () => {
			/* cleanup */
		};
	}, []);

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
			style={{ pointerEvents: showConfirm ? "none" : "auto" }}
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
						<button onClick={handleBack}>A. TERUG</button>
						<button onClick={handleNext}>B. VERDER</button>
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
