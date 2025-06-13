/**
 * Tool1 pagina
 *
 * Hiermee kan de gebruiker een letter vormgeven met verschillende transform-sliders,
 * gekoppeld aan hardware-potmeters of handmatige sliders.
 * Biedt navigatie naar de PosterEditor of terug naar Home,
 * met bevestiging wanneer er niet-opgeslagen wijzigingen zijn.
 */
// src/pages/Tool1.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Canvas from "../components/Canvas.jsx";
import TransformSliderPanel from "../components/TransformSliderPanel";
import useHardwareButtons from "../hooks/useHardwareButtons";
import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG";
import "../styles/Tool1.css";
import { navigateWithCooldown } from "../utils/navigationCooldown";

// Alfabet, cijfers en leestekens voor keuzefunctie
const ALPHABET = [
	...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
	...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)),
	...Array.from({ length: 10 }, (_, i) => String(i)),
	",",
	"?",
	".",
	"!",
];

// Standaard sliderwaarden (defaults uit de SLIDER_CONFIG)
const DEFAULT_SLIDERS = Object.fromEntries(
	SLIDER_CONFIG.map(({ id, default: def }) => [id, def])
);

export default function Tool1() {
	const navigate = useNavigate(); // Navigatiefunctie
	const location = useLocation(); // Huidige locatie, inclusief state

	// === Karakter- en indexbepaling ===
	const incomingChar = location.state?.char;
	const initialIdx = incomingChar ? ALPHABET.indexOf(incomingChar) : 0;
	const [currentIndex] = useState(initialIdx >= 0 ? initialIdx : 0); // Geselecteerde index in ALPHABET

	// === Slider-State initiëren ===
	const slidersFromState = location.state?.sliders; // Mogelijke sliders uit vorige stap
	const [sliders, setSliders] = useState(slidersFromState ?? DEFAULT_SLIDERS); // Gebruik doorgegeven of default waarden

	// === Refs voor canvas en potmeterdata ===
	const canvasRef = useRef(null); // Referentie naar Canvas-component om redraw() te kunnen aanroepen
	const latestRawPotsRef = useRef(null);
	const lastMappedRef = useRef(sliders); // Laatst toegepaste sliderwaarden bij mapping

	// === Modal-state voor confirm bij terug ===
	const [showConfirm, setShowConfirm] = useState(false);
	const initialSlidersRef = useRef(DEFAULT_SLIDERS); // Bewaar originele sliderwaarden voor dirty-check
	const isDirty = () => {
		// Controleer op niet-opgeslagen wijziginge
		const init = initialSlidersRef.current;
		return Object.keys(init).some((k) => init[k] !== sliders[k]);
	};
	// === Navigatiehandlers ===
	const handleNext = () => {
		// Volgende stap: PosterEditor, geef char en sliders door
		navigate("/poster", {
			state: { char: ALPHABET[currentIndex], sliders, fontSize: 500 },
		});
	};

	// === Handlers ===
	const handleBack = () => {
		// Terug naar Home, of toon confirm modal als dirty
		if (isDirty()) setShowConfirm(true);
		else navigate("/", { state: { char: ALPHABET[currentIndex], sliders } });
	};

	const handleConfirmYes = () => {
		// Bevestig terug zonder opslaan
		setShowConfirm(false);
		navigate("/", { state: { char: ALPHABET[currentIndex], sliders } });
	};
	const handleConfirmNo = () => setShowConfirm(false);

	// Handmatige slider-wijziging via paneel
	const handleManualChange = (newValues) => {
		setSliders(newValues);
		// Update caching om dubbele redraws te voorkomen
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
		enabledOn: ["/tool1"], // Alleen actief op deze route
	});
	// === Arduino potmeters → sliders ===
	useEffect(() => {
		if (!window.electronAPI?.onArduinoData) return;
		const handler = (line) => {
			const parts = line.trim().split(",").map(Number);
			// Neem de laatste N waarden (N = aantal sliders)
			latestRawPotsRef.current = parts.slice(-SLIDER_CONFIG.length);
		};
		window.electronAPI.onArduinoData(handler);
		return () => {
			/* cleanup */
		};
	}, []);

	useEffect(() => {
		// Interval om ruwe waarden te mappen naar sliderwaarden
		const interval = setInterval(() => {
			const raw = latestRawPotsRef.current;
			if (!raw) return;
			let hasChange = false;
			setSliders((prev) => {
				const next = { ...prev };
				SLIDER_CONFIG.forEach(({ id, min, max, step }, i) => {
					// Normaliseer en map naar range [min,max]
					const norm = raw[i] / 1023;
					let mapped = min + norm * (max - min);
					mapped =
						step >= 1 ? Math.round(mapped) : Math.round(mapped / step) * step;
					// Pas alleen toe als verandering >= stapgrootte
					if (Math.abs(mapped - lastMappedRef.current[id]) >= step) {
						next[id] = mapped;
						lastMappedRef.current[id] = mapped;
						hasChange = true;
					}
				});
				return hasChange ? next : prev;
			});
			// Trigger redraw in Canvas indien veranderd
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
					{/* Canvas-gedeelte */}
					<Canvas
						ref={canvasRef}
						char={ALPHABET[currentIndex]}
						fontSize={500}
						{...sliders}
						title="LETTER-BEWERKER"
					/>
				</div>
				{/* Stappenbalk */}
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
				{/* Slider-paneel en knoppen */}
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
			{/* Confirmatie-overlay bij terug zonder opslaan */}
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
