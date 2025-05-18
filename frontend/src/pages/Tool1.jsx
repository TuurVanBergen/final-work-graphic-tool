import React, { useState, useEffect } from "react";
import { useFontLoader } from "../hooks/useFontLoader";
import Canvas from "../components/Canvas";

const ALPHABET =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,?.!".split(
		""
	);

export default function Tool1() {
	const { font, loading } = useFontLoader("/fonts/Helvetica/Helvetica.ttf");
	const [currentIndex, setCurrentIndex] = useState(0);

	// Bij laden: laad huidige index uit localStorage, maar verhoog niet automatisch
	useEffect(() => {
		const stored = parseInt(localStorage.getItem("tool1Index"), 10);
		setCurrentIndex(isNaN(stored) ? 0 : stored);
	}, []);

	if (loading) return <p>Font wordt geladen…</p>;
	// Pas verder naar de volgende glyph bij opslaan
	const handleSave = () => {
		const next = currentIndex === ALPHABET.length - 1 ? 0 : currentIndex + 1;
		setCurrentIndex(next);
		localStorage.setItem("tool1Index", next);
	};

	const selectedChar = ALPHABET[currentIndex];

	return (
		<div style={{ padding: "2rem", textAlign: "center" }}>
			<h2>Glyph Viewer</h2>
			<Canvas font={font} selectedChar={selectedChar} />
			<p>
				Huidige glyph: <strong>{selectedChar}</strong>
			</p>
			<button onClick={handleSave}>Opslaan</button>
		</div>
	);
}
