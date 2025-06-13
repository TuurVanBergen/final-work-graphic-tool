/**
 * Tool2 pagina
 *
 * Toont een kader met meerdere afbeeldingen en een slider-paneel om
 * via potentiometer- of muis-input de selectie te wijzigen.
 * Ondersteunt opslag/reset van sliderwaarden en terug-navigatie
 * met bevestiging via hardware-knoppen.
 */
// src/pages/Tool2.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SliderPanel from "../components/Tool2SliderPanel";
import FrameImage from "../components/FrameImage";
import { SLIDER_CONFIG_TOOL2 } from "../config/SLIDER_CONFIG_TOOL2";
import "../styles/Tool2.css";
import useHardwareButtons from "../hooks/useHardwareButtons";
import { navigateWithCooldown } from "../utils/navigationCooldown";

// Predefined afbeeldingen per framepositie
const IMAGES = {
	top: [
		"/images/000013.jpg",
		"/images/000014.jpg",
		"/images/000017.jpg",
		"/images/000018.jpg",
	],
	middle: [
		"/images/000013.jpg",
		"/images/000014.jpg",
		"/images/000017.jpg",
		"/images/000018.jpg",
	],
	bottom: [
		"/images/000013.jpg",
		"/images/000014.jpg",
		"/images/000017.jpg",
		"/images/000018.jpg",
	],
	smallTop: [
		"/images/000013.jpg",
		"/images/000014.jpg",
		"/images/000017.jpg",
		"/images/000018.jpg",
	],
	smallBottom: [
		"/images/000013.jpg",
		"/images/000014.jpg",
		"/images/000017.jpg",
		"/images/000018.jpg",
	],
	smallLowerTop: [
		"/images/000013.jpg",
		"/images/000014.jpg",
		"/images/000017.jpg",
		"/images/000018.jpg",
	],
};

export default function Tool2() {
	const navigate = useNavigate();

	// Initialiseer sliderwaarden op de minimumwaarden uit config
	const initial = SLIDER_CONFIG_TOOL2.reduce(
		(acc, { id, min }) => ({ ...acc, [id]: min }),
		{}
	);
	const [values, setValues] = useState(initial); // State voor huidige sliderwaarden
	const initialRef = useRef(initial); // Ref om initiële waarden te bewaren voor dirty-check
	const [showConfirm, setShowConfirm] = useState(false); // State voor bevestigingsmodal

	// Handlers voor bevestiging
	const confirmYes = () => {
		setShowConfirm(false);
		navigateWithCooldown(() => navigate(-1)); // Navigeer terug met cooldown
	};
	const save = () => {
		initialRef.current = { ...values }; // Sla actuele waarden op als nieuwe initiële waarden
	};
	const reset = () => setValues(initial); // Reset sliders naar initiële waarden
	const isDirty = () =>
		// Controleer of waarden gewijzigd zijn
		Object.keys(initialRef.current).some(
			(k) => initialRef.current[k] !== values[k]
		);
	const back = () => (isDirty() ? setShowConfirm(true) : navigate(-1));

	const getIdx = (key) => {
		// Bepaal index per framekey op basis van sliderwaarde
		const idxMap = {
			top: 1,
			middle: 2,
			bottom: 3,
			smallTop: 4,
			smallBottom: 5,
			smallLowerTop: 6,
		};
		const num = parseInt(values[`slider${idxMap[key]}`], 10);
		const valid = isNaN(num) ? 0 : num;
		return Math.max(0, Math.min(IMAGES[key].length - 1, valid));
	};
	// Refs voor potentiometer-data
	const latestRawPotsRef = useRef(null);
	const lastMappedRef = useRef(values);

	// Configureer hardware-knoppen A=save, B=reset, C=back
	useHardwareButtons({
		onA: () => {
			if (showConfirm) return confirmYes();
			save();
		},
		onB: () => {
			if (showConfirm) return setShowConfirm(false);
			reset();
		},
		onC: () => back(),
		enabledOn: ["/tool2"],
	});
	// Luister naar Arduino-data via preload API
	useEffect(() => {
		if (!window.electronAPI?.onArduinoData) return;

		const unsub = window.electronAPI.onArduinoData((line) => {
			const parts = line.trim().split(",").map(Number);
			latestRawPotsRef.current = parts.slice(-SLIDER_CONFIG_TOOL2.length);
		});

		return () => unsub();
	}, []);
	// Vertaal ruwe potmeterwaarden naar sliderwaarden en update state
	useEffect(() => {
		const interval = setInterval(() => {
			const raw = latestRawPotsRef.current;
			if (!raw) return;

			let hasChange = false;
			setValues((prev) => {
				const next = { ...prev };
				SLIDER_CONFIG_TOOL2.forEach(({ id, min, max, step }, i) => {
					// normaliseer (0-1023 naar min-max), ronde af op step,
					const norm = raw[i] / 1023;
					let mapped = min + norm * (max - min);
					mapped =
						step >= 1 ? Math.round(mapped) : Math.round(mapped / step) * step;
					// update alleen als verandering groot geneog zijn

					if (Math.abs(mapped - lastMappedRef.current[id]) >= step) {
						next[id] = mapped;
						lastMappedRef.current[id] = mapped;
						hasChange = true;
					}
				});
				return hasChange ? next : prev;
			});
		}, 60);

		return () => clearInterval(interval);
	}, []);

	return (
		<div
			id="tool-layout"
			style={{ pointerEvents: showConfirm ? "none" : "auto" }}
		>
			{/* Frame met verschillende afbeeldingen */}
			<div id="frame">
				<div id="inner-frame-top">
					<FrameImage src={IMAGES.top[getIdx("top")]} alt="Top" />
				</div>
				<div id="inner-frame-middle">
					<FrameImage src={IMAGES.middle[getIdx("middle")]} alt="Middle" />
				</div>
				<div id="inner-frame-bottom">
					<FrameImage src={IMAGES.bottom[getIdx("bottom")]} alt="Bottom" />
				</div>
				<div id="inner-frame-small-top">
					<FrameImage
						src={IMAGES.smallTop[getIdx("smallTop")]}
						alt="SmallTop"
					/>
				</div>
				<div id="inner-frame-small-bottom">
					<FrameImage
						src={IMAGES.smallBottom[getIdx("smallBottom")]}
						alt="SmallBottom"
					/>
				</div>
				<div id="inner-frame-small-lower-top">
					<FrameImage
						src={IMAGES.smallLowerTop[getIdx("smallLowerTop")]}
						alt="SmallLowerTop"
					/>
				</div>
			</div>
			{/* Opdrachttekst of taakbeschrijving */}
			<div className="task">
				<h2>DIT IS EEN OPDRACHT</h2>
			</div>
			{/* Sidebar met sliders en knoppen */}
			<div className="sidebar">
				<SliderPanel
					config={SLIDER_CONFIG_TOOL2}
					values={values}
					onChange={setValues}
				/>
				<div className="button-panel">
					<button onClick={save}>Opslaan</button>
					<button onClick={reset}>Reset</button>
					<button onClick={back}>Terug</button>
				</div>
			</div>
			{/* Confirmatie-overlay bij back zonder opslaan */}
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
									setShowConfirm(false);
									navigate(-1);
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
