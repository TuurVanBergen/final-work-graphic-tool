import { useState, useEffect } from "react";
import { useFontLoader } from "../hooks/useFontLoader.js";
import Canvas from "../components/Canvas.jsx";
import TransformSliderPanel from "../components/TransformSliderPanel";
import { applySliderMappings } from "../utils/sliderLogic";

const ALPHABET =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,?.!".split(
		""
	);
// Slider defaults
const defaultSliderValues = {
	cornerRadius: 0,
	pixelate: 0,
	glitch: 0,
	gridSize: 0,
	brailleDots: 0,
	specialParam1: 0,
	specialParam2: 0,
};

export default function Tool1() {
	const [sliderValues, setSliderValues] = useState(defaultSliderValues);
	const [modifiedGlyph, setModifiedGlyph] = useState([]);
	const { font, loading } = useFontLoader("/fonts/Helvetica/Helvetica.ttf");
	const [currentIndex, setCurrentIndex] = useState(0);

	// Bij laden: laad huidige index uit localStorage, maar verhoog niet automatisch
	useEffect(() => {
		const stored = parseInt(localStorage.getItem("tool1Index"), 10);
		setCurrentIndex(isNaN(stored) ? 0 : stored);
	}, []);

	// Bereken gemapte glyph commands wanneer font, selectedChar of sliders veranderen
	useEffect(() => {
		if (!font) return;
		const baseCommands = font
			.charToGlyph(ALPHABET[currentIndex])
			.getPath(0, 0, font.unitsPerEm).commands;
		setModifiedGlyph(applySliderMappings(baseCommands, sliderValues));
	}, [font, currentIndex, sliderValues]);
	if (loading) return <p>Font wordt geladen…</p>;
	// Pas verder naar de volgende glyph bij opslaan
	const handleSave = () => {
		// Volgende glyph index berekenen
		const next = currentIndex === ALPHABET.length - 1 ? 0 : currentIndex + 1;
		// State en localStorage bijwerken
		setCurrentIndex(next);
		localStorage.setItem("tool1Index", next);
		// Sliders resetten naar de standaardwaarden
		setSliderValues(defaultSliderValues);
	};

	const selectedChar = ALPHABET[currentIndex];

	return (
		<div style={{ padding: "2rem", textAlign: "center" }}>
			<h2>Glyph Viewer</h2>
			<Canvas
				font={font}
				selectedChar={selectedChar}
				modifiedPathData={modifiedGlyph}
			/>

			<TransformSliderPanel values={sliderValues} onChange={setSliderValues} />
			<button onClick={handleSave}>Opslaan</button>
		</div>
	);
}
