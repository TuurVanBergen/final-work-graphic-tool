import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PosterCanvas from "../components/PosterCanvas";
import DesignSliderPanel from "../components/DesignSliderPanel";
import "../styles/PosterEditor.css";
import { SLIDER_CONFIG_POSTER } from "../config/SLIDER_CONFIG_POSTER";
import useHardwareButtons from "../hooks/useHardwareButtons";

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
export default function PosterEditor() {
	const location = useLocation();
	const NUM_SLIDERS = SLIDER_CONFIG_POSTER.length;

	const navigate = useNavigate();
	const { char, sliders: originalSliders, fontSize } = location.state || {};

	const [design, setDesign] = useState({
		positionX: 0,
		positionY: 0,
		posterScale: 1,
		fillHue: 0,
		bgHue: 0,
		verticalOffset: 0,
		horizontalOffset: 0,
		blend: 0,
		rotation: 0,
		outlineWidth: 0,
	});

	//ontwerpwaarden onthouden
	const initialDesignRef = useRef({
		positionX: 0,
		positionY: 0,
		scale: 1,
		fillHue: 0,
		bgHue: 0,
		verticalOffset: 0,
		horizontalOffset: 0,
		blend: 0,
		rotation: 0,
		outlineWidth: 0,
	});

	// Modal‐states
	const [showBackConfirm, setShowBackConfirm] = useState(false);
	const [showSaveConfirm, setShowSaveConfirm] = useState(false);
	const [showCountdown, setShowCountdown] = useState(false);

	// Countdown‐teller
	const [countdown, setCountdown] = useState(5);

	const canvasRef = useRef(null);
	const lastButtonStatesRef = useRef([1, 1, 1, 1]);
	const buttonCooldownRef = useRef(false);
	const latestRawPotsRef = useRef(null);
	const lastMappedRef = useRef(design);
	const wrapperRef = useRef(null);
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
			init.fillHue !== design.fillHue ||
			init.bgHue !== design.bgHue ||
			init.verticalOffset !== design.verticalOffset ||
			init.horizontalOffset !== design.horizontalOffset ||
			init.blend !== design.blend
		);
	};

	// === HANDLE BACK ===
	const handleBack = () => {
		if (isDirty()) {
			setShowBackConfirm(true);
		} else {
			navigate(-1);
		}
	};

	const handleBackYes = () => {
		setShowBackConfirm(false);
		navigate(-1);
	};

	const handleBackNo = () => {
		setShowBackConfirm(false);
	};

	// === HANDLE SAVE ===
	const handleSaveClick = async () => {
		initialDesignRef.current = { ...design };
		const timestamp = Date.now();

		// 1) pak canvas en DataURL
		const p5canvas = wrapperRef.current?.querySelector("canvas");
		if (!p5canvas) {
			console.error("Canvas niet gevonden voor export.");
			setShowSaveConfirm(false);
			return;
		}
		const pngDataUrl = p5canvas.toDataURL("image/png");
		const base64 = pngDataUrl.split(",")[1];
		const imgName = `letter_${timestamp}.png`;

		// 2) sla PNG op
		try {
			const savedPath = await window.electronAPI.saveImage(base64, imgName);
			console.log("Afbeelding opgeslagen op:", savedPath);
		} catch (err) {
			console.error("Opslaan PNG mislukt:", err);
		}
		setShowSaveConfirm(true);
	};

	const handleSaveYes = async () => {
		initialDesignRef.current = { ...design };

		// 3) optioneel stille print
		if (window.electronAPI?.printSilent) {
			window.electronAPI.printSilent();
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
		setShowCountdown(true);
		setCountdown(5);
	};
	const isAnyModalOpen = showBackConfirm || showSaveConfirm;

	useHardwareButtons({
		onA: () => {
			if (showBackConfirm) return handleBackYes();
			if (showSaveConfirm) return handleSaveYes();
			if (!isAnyModalOpen && isDirty()) return setShowBackConfirm(true);
			if (!isAnyModalOpen) return handleBack();
		},
		onB: () => {
			if (showBackConfirm) return handleBackNo();
			if (showSaveConfirm) return handleSaveNo();
			if (!isAnyModalOpen) return navigateWithCooldown(() => handleSaveClick());
		},
		enabledOn: ["/poster"],
	});

	// === Countdown useEffect ===
	useEffect(() => {
		if (!showCountdown) return;

		const intervalId = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(intervalId);
					const idx = ALPHABET.indexOf(char);
					const nextIdx = idx >= 0 ? (idx + 1) % ALPHABET.length : 0;
					const nextChar = ALPHABET[nextIdx];
					navigate("/", { state: { char: nextChar } });
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, [showCountdown, navigate]);
	// useEffect voor inkomende Arduino-data
	useEffect(() => {
		if (!window.electronAPI?.onArduinoData) return;

		const unsub = window.electronAPI.onArduinoData((line) => {
			const parts = line.trim().split(",").map(Number);
			const pots = parts.slice(4, 4 + NUM_SLIDERS); // enkel potmeters

			latestRawPotsRef.current = pots;
			// ... rest blijft zoals je al had
		});

		return () => unsub();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			const raw = latestRawPotsRef.current;
			if (!raw) return;

			let hasChange = false;
			setDesign((prev) => {
				const next = { ...prev };
				SLIDER_CONFIG_POSTER.forEach(({ id, min, max, step }, i) => {
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
		<div className="PosterEditorWrapper">
			{/* === Links: PosterCanvas === */}
			<div className="poster-canvas" ref={wrapperRef}>
				<PosterCanvas
					ref={canvasRef}
					char={char}
					originalSliders={originalSliders}
					design={design}
					fontSize={fontSize}
				/>
			</div>
			{/* === Stappenbalk === */}
			<div className="steps">
				<div className="step completed">
					<span className="box" />
					ONTWERP JE LETTER
				</div>
				<div className="step completed">
					<span className="box" />
					ONTWERP DE POSTER
				</div>
				<div className="step">
					<span className="box" />
					OPSLAAN/PRINT
				</div>
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
