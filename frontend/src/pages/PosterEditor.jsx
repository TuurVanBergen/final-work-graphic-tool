// src/pages/PosterEditor.jsx

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PosterCanvas from "../components/PosterCanvas";
import DesignSliderPanel from "../components/DesignSliderPanel";
import "../styles/PosterEditor.css";

export default function PosterEditor() {
	const location = useLocation();
	const navigate = useNavigate();
	const { char, sliders: originalSliders, fontSize } = location.state || {};

	const [design, setDesign] = useState({
		positionX: 0,
		positionY: 0,
		scale: 1,
		rotation: 0,
		fillHue: 0,
		inkBleed: 5,
		outlineWidth: 0,
	});

	//ontwerpwaarden onthouden
	const initialDesignRef = useRef(design);

	// Modal‐states
	const [showBackConfirm, setShowBackConfirm] = useState(false);
	const [showSaveConfirm, setShowSaveConfirm] = useState(false);
	const [showCountdown, setShowCountdown] = useState(false);

	// Countdown‐teller
	const [countdown, setCountdown] = useState(5);

	const canvasRef = useRef(null);

	// Als er geen data is (char of originalSliders ontbreekt), terug naar Tool1
	useEffect(() => {
		if (!char || !originalSliders) {
			navigate("/tool1");
		}
	}, [char, originalSliders, navigate]);

	// Check of er wijzigingen zijn t.o.v. last saved design
	const isDirty = () => {
		const init = initialDesignRef.current;
		return (
			init.positionX !== design.positionX ||
			init.positionY !== design.positionY ||
			init.scale !== design.scale ||
			init.rotation !== design.rotation ||
			init.fillHue !== design.fillHue ||
			init.inkBleed !== design.inkBleed ||
			init.outlineWidth !== design.outlineWidth
		);
	};

	// === HANDLE BACK ===
	const handleBack = () => {
		if (isDirty()) {
			setShowBackConfirm(true);
		} else {
			navigate("/tool1", {
				state: { char, sliders: originalSliders, fontSize },
			});
		}
	};

	const handleBackYes = () => {
		setShowBackConfirm(false);
		navigate("/tool1", { state: { char, sliders: originalSliders, fontSize } });
	};

	const handleBackNo = () => {
		setShowBackConfirm(false);
	};

	// === HANDLE SAVE ===
	const handleSaveClick = () => {
		initialDesignRef.current = { ...design };
		setShowSaveConfirm(true);
	};

	const handleSaveYes = () => {
		initialDesignRef.current = { ...design };

		console.log("renderer: window.electronAPI = ", window.electronAPI);

		if (window.electronAPI && window.electronAPI.printSilent) {
			window.electronAPI.printSilent();
		} else {
			console.error("electronAPI niet gevonden! Silent print faalt.");
		}

		setShowSaveConfirm(false);

		setTimeout(() => {
			setShowCountdown(true);
			setCountdown(5);
		}, 500);
	};

	const handleSaveNo = () => {
		initialDesignRef.current = { ...design };
		setShowSaveConfirm(false);
		alert("Ontwerp is opgeslagen (zonder afdrukken).");

		setShowCountdown(true);
		setCountdown(5);
	};

	// === Countdown useEffect ===
	useEffect(() => {
		if (!showCountdown) return;

		const intervalId = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(intervalId);
					navigate("/");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, [showCountdown, navigate]);
	// useEffect voor inkomende Arduino-data
	useEffect(() => {
		if (window.electronAPI && window.electronAPI.onArduinoData) {
			window.electronAPI.onArduinoData((line) => {
				// Log de volledige ontvangen string in de console
				console.log(" Ontvangen van Arduino:", line);
			});
		} else {
			console.warn("electronAPI.onArduinoData is niet beschikbaar");
		}
	}, []);
	return (
		<div className="PosterEditorWrapper">
			{/* === Links: PosterCanvas === */}
			<div className="poster-canvas">
				<PosterCanvas
					ref={canvasRef}
					char={char}
					originalSliders={originalSliders}
					design={design}
					fontSize={fontSize}
				/>
			</div>
			{/* === Rechts: sliders en knoppen === */}{" "}
			<div className="poster-transformSliderPanel">
				<DesignSliderPanel values={design} onChange={setDesign} />
				<div className="buttons">
					<button onClick={handleBack}>A. TERUG</button>
					<button onClick={handleSaveClick}>B. OPSLAAN</button>
				</div>
			</div>
			{/* === Modal: “Wil je terug?” === */}
			{showBackConfirm && (
				<div className="confirm-overlay">
					<div className="confirm-modal">
						<p>
							Als je teruggaat, gaat je voorontwikkeling in de PosterEditor
							verloren.
							<br />
							Weet je het zeker?
						</p>
						<div className="confirm-buttons">
							<button onClick={handleBackYes}>A. JA</button>
							<button onClick={handleBackNo}>B. NEE</button>
						</div>
					</div>
				</div>
			)}
			{/* === Modal: “Wil je afdrukken?” === */}
			{showSaveConfirm && (
				<div className="confirm-overlay">
					<div className="confirm-modal">
						<p>
							Wil je jouw ontwerp afdrukken?
							<br />
							(Het ontwerp is al opgeslagen.)
						</p>
						<div className="confirm-buttons">
							<button onClick={handleSaveYes}>A. JA</button>
							<button onClick={handleSaveNo}>B. NEE</button>
						</div>
					</div>
				</div>
			)}
			{/* === Countdown-modal (na opslaan/print) === */}
			{showCountdown && (
				<div className="confirm-overlay">
					<div className="confirm-modal">
						<p>
							Je ontwerp komt eraan — kijk naar de printer.
							<br />
							Je kan je ontwerp terugvinden in de gallerij.
						</p>
						<p style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
							Terug naar de home pagina over: {countdown}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
