// import { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import PosterCanvas from "../components/PosterCanvas";
// import DesignSliderPanel from "../components/DesignSliderPanel";
// import "../styles/PosterEditor.css";

// export default function PosterEditor() {
// 	const location = useLocation();
// 	const navigate = useNavigate();
// 	// Haal char, sliders en fontSize uit de state van Tool1
// 	const { char, sliders: originalSliders, fontSize } = location.state || {};

// 	// Design staat voor position/scale/rotation/sliders voor poster
// 	const [design, setDesign] = useState({
// 		positionX: 0,
// 		positionY: 0,
// 		scale: 1,
// 		rotation: 0,
// 		fillHue: 0,
// 		inkBleed: 5,
// 		outlineWidth: 0,
// 	});

// 	const canvasRef = useRef(null);

// 	// Als er geen data is, terug naar Tool1
// 	useEffect(() => {
// 		if (!char || !originalSliders) {
// 			navigate("/tool1");
// 		}
// 	}, [char, originalSliders, navigate]);

// 	const handleBack = () => {
// 		navigate("/tool1", { state: { char, sliders: originalSliders, fontSize } });
// 	};

// 	const handleDownload = () => {
// 		alert("Downloaden als PDF wordt later geïmplementeerd.");
// 	};

// 	return (
// 		<div className="PosterEditorWrapper">
// 			{/* Links: PosterCanvas */}
// 			<div className="poster-canvas">
// 				<PosterCanvas
// 					ref={canvasRef}
// 					char={char}
// 					originalSliders={originalSliders}
// 					design={design}
// 					fontSize={fontSize}
// 				/>
// 			</div>

// 			{/* Rechts: DesignSliderPanel + knoppen */}
// 			<div className="poster-transformSliderPanel">
// 				<DesignSliderPanel values={design} onChange={setDesign} />
// 				<div className="buttons">
// 					<button onClick={handleBack}>A. TERUG</button>
// 					<button onClick={handleDownload}>B. DOWNLOAD</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
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

	// Huidige ontwerpwaarden (positie, schaal, rotatie, etc.)
	const [design, setDesign] = useState({
		positionX: 0,
		positionY: 0,
		scale: 1,
		rotation: 0,
		fillHue: 0,
		inkBleed: 5,
		outlineWidth: 0,
	});

	// Ref om de “opgeslagen” ontwerpwaarden te onthouden
	const initialDesignRef = useRef(design);

	// Modal-states
	const [showBackConfirm, setShowBackConfirm] = useState(false);
	const [showSaveConfirm, setShowSaveConfirm] = useState(false);
	const [showCountdown, setShowCountdown] = useState(false);

	// Countdown-teller (start op 5, aftellen naar 1)
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
			// Als er wijzigingen zijn, toon de modal
			setShowBackConfirm(true);
		} else {
			// Geen wijzigingen: direct terug navigeren
			navigate("/tool1", {
				state: { char, sliders: originalSliders, fontSize },
			});
		}
	};

	const handleBackYes = () => {
		// Gebruiker bevestigt teruggaan (zonder opslaan)
		setShowBackConfirm(false);
		navigate("/tool1", { state: { char, sliders: originalSliders, fontSize } });
	};

	const handleBackNo = () => {
		// Gebruiker wil niet terug, sluit modal
		setShowBackConfirm(false);
	};

	// === HANDLE SAVE ===
	const handleSaveClick = () => {
		// Sla de huidige ontwerpwaarden altijd op
		initialDesignRef.current = { ...design };
		// Toon de modal: “Wil je afdrukken?”
		setShowSaveConfirm(true);
	};

	const handleSaveYes = () => {
		// Gebruiker wil printen: eerst opslaan, dan printen
		initialDesignRef.current = { ...design };
		window.print();
		setShowSaveConfirm(false);
		// Start de countdown-modal na een kleine vertraging (zodat printdialog opstart)
		setTimeout(() => {
			setShowCountdown(true);
			setCountdown(5);
		}, 500);
	};

	const handleSaveNo = () => {
		// Gebruiker wil niet printen: alleen opslaan
		initialDesignRef.current = { ...design };
		setShowSaveConfirm(false);
		alert("Ontwerp is opgeslagen (zonder afdrukken).");
		// Start de countdown-modal onmiddellijk (zonder print)
		setShowCountdown(true);
		setCountdown(5);
	};

	// === Countdown useEffect ===
	// Zodra showCountdown true wordt, beginnen we elke seconde de teller af te laten lopen.
	useEffect(() => {
		if (!showCountdown) return;

		// Start interval om elke 1 seconde countdown omlaag te doen
		const intervalId = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(intervalId);
					// Na afronding van de countdown, ga naar "/"
					navigate("/");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		// Cleanup: als de component onmount of showCountdown=false, clear interval
		return () => clearInterval(intervalId);
	}, [showCountdown, navigate]);

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

			{/* === Rechts: sliders en knoppen === */}
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

			{/* === Countdown‐modal (na opslaan/print) === */}
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
