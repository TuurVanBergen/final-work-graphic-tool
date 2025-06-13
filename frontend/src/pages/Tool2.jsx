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
import html2canvas from "html2canvas";
const TASKS = [
	"BEDENK EEN KLEURRIJKE STRAATARTIEST DIE ZIJN PUBLIEK BETOVERT MET MUZIEK.",
	"ONTWERP EEN GEVAARLIJKE PIRAAT DIE DE WOELIGE BAREN TROTSEERT.",
	"ONTWERP EEN PERSONAGE VOOR EEN KINDERBOEK DAT VROLIJKHEID UITSTRAALT.",
	"ONTWERP EEN VROLIJKE MARKTKRAMER OP EEN ZONNIGE LENTEDAG, DIE VOORBIJGAANDERS MET ZIJN GLIMLACH BETOVERT.",
	"ONTWERP EEN PERSONAGE DAT OP CARNAVAL VERKLEED IS ALS HAAR FAVORIETE DIER.",
	"ONTWERP EEN MASCOTTE VOOR EEN VERKEERSVEILIGHEIDSCAMPAGNE.",
	"ONTWERP EEN KARAKTER VAN HOE JIJ JE OVER 20 JAAR ZIET.",
	"ONTWERP EEN AVONTUURLIJKE ARCHEOLOOG OP ZOEK NAAR VERGETEN SCHATTEN",
];
// Predefined afbeeldingen per framepositie
const IMAGES = {
	top: [
		"/images/Hoofd1.svg",
		"/images/Hoofd2.svg",
		"/images/Hoofd3.svg",
		"/images/Hoofd4.svg",
	],
	middle: [
		"/images/Torso1.svg",
		"/images/Torso2.svg",
		"/images/Torso3.svg",
		"/images/Torso4.svg",
	],
	bottom: [
		"/images/Benen1.svg",
		"/images/Benen2.svg",
		"/images/Benen3.svg",
		"/images/Benen4.svg",
	],
	smallTop: [
		"/images/Neus1.svg",
		"/images/Neus2.svg",
		"/images/Neus3.svg",
		"/images/Neus4.svg",
	],
	smallBottom: [
		"/images/Mond1.svg",
		"/images/Mond2.svg",
		"/images/Mond3.svg",
		"/images/Mond4.svg",
	],
	smallLowerTop: [
		"/images/Armen1.svg",
		"/images/Armen2.svg",
		"/images/Armen3.svg",
		"/images/Armen4.svg",
	],
};

export default function Tool2() {
	const navigate = useNavigate();
	// Kies bij eerste render een willekeurige opdracht
	const [currentTask] = useState(() => {
		const i = Math.floor(Math.random() * TASKS.length);
		return TASKS[i];
	});
	// Initialiseer sliderwaarden op de minimumwaarden uit config
	const initial = SLIDER_CONFIG_TOOL2.reduce(
		(acc, { id, min }) => ({ ...acc, [id]: min }),
		{}
	);
	const [values, setValues] = useState(initial); // State voor huidige sliderwaarden
	const initialRef = useRef(initial); // Ref om initiële waarden te bewaren voor dirty-check
	const [showConfirm, setShowConfirm] = useState(false); // State voor bevestigingsmodal
	// === Save/print flow state
	const [showSaveConfirm, setShowSaveConfirm] = useState(false);
	const [showCountdown, setShowCountdown] = useState(false);
	const [countdown, setCountdown] = useState(5);
	// Ref om het frame te capturen
	const wrapperRef = useRef(null);
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
	// ==== SAVE HANDLERS (PNG + silent print) ====
	const handleSaveClick = async () => {
		if (!wrapperRef.current) return;
		const canvas = await html2canvas(wrapperRef.current);
		const dataUrl = canvas.toDataURL("image/png");
		const base64 = dataUrl.split(",")[1];
		const imgName = `tool2_${Date.now()}.png`;
		try {
			await window.electronAPI.saveImage(base64, imgName);
		} catch (err) {
			console.error("Opslaan PNG mislukt:", err);
		}
		setShowSaveConfirm(true);
	};
	const handleSaveYes = () => {
		if (window.electronAPI?.printSilent) {
			window.electronAPI.printSilent();
		}
		setShowSaveConfirm(false);
		setShowCountdown(true);
		setCountdown(5);
	};
	const handleSaveNo = () => {
		setShowSaveConfirm(false);
		setShowCountdown(true);
		setCountdown(5);
	};
	// ==== COUNTDOWN EFFECT ====
	useEffect(() => {
		if (!showCountdown) return;
		const id = setInterval(() => {
			setCountdown((c) => {
				if (c <= 1) {
					clearInterval(id);
					return 0;
				}
				return c - 1;
			});
		}, 1000);
		return () => clearInterval(id);
	}, [showCountdown]);
	// Configureer hardware-knoppen A=save, B=reset, C=back
	useHardwareButtons({
		onA: () => {
			if (showConfirm) return confirmYes();
			save();
		},
		onB: () => back(),
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
		<div id="tool-layout">
			{/* Frame met verschillende afbeeldingen */}
			<div id="frame" ref={wrapperRef}>
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
				<h2>{currentTask}</h2>
			</div>
			{/* Sidebar met sliders en knoppen */}
			<div className="sidebar">
				<SliderPanel
					config={SLIDER_CONFIG_TOOL2}
					values={values}
					onChange={setValues}
				/>
				<div className="button-panel">
					<button onClick={back}>B. TERUG</button>
					<button onClick={save}>A. OPSLAAN</button>
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
			{/* === Save-confirm modal === */}
			{showSaveConfirm && (
				<div className="confirm-overlay">
					<div className="confirm-modal">
						<p>
							Wil je je ontwerp afdrukken?
							<br />
							(Het is al opgeslagen.)
						</p>
						<div className="confirm-buttons">
							<button onClick={handleSaveYes}>A. JA</button>
							<button onClick={handleSaveNo}>B. NEE</button>
						</div>
					</div>
				</div>
			)}
			{/* === Countdown-modal === */}
			{showCountdown && (
				<div className="confirm-overlay">
					<div className="confirm-modal">
						<p>Je ontwerp komt eraan — kijk naar de printer.</p>
						<p style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
							Terug in: {countdown}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
