/**
 * GallerijList component
 *
 * Toont een carrousel van afbeeldingen uit de opgegeven gallerij (letters of posters).
 * Maakt gebruik van Electron API om bestanden te laden en hardware-knoppen voor navigatie.
 */
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/GallerijList.css";
import useHardwareButtons from "../hooks/useHardwareButtons";

export default function GallerijList() {
	const { type } = useParams(); // 'letter' of 'poster' uit URL
	const navigate = useNavigate(); // Functie om te navigeren
	const [files, setFiles] = useState([]); // Lijst van bestands-URL's
	const viewportRef = useRef(null);
	const [index, setIndex] = useState(0); // Huidige positie in de lijst

	// Haal bij initialisatie of type-wijziging de bestandslijst op via Electron
	useEffect(() => {
		window.electronAPI
			.listGalleryFiles(type)
			.then((list) => {
				setFiles(list); // Sla resultaat op in state
			})
			.catch(console.error);
	}, [type]); // Herhaal wanneer 'type' verandert

	// Bereken maximale scroll-index zodat je niet voorbij einde scrolt
	const maxIndex = Math.max(0, files.length - 3);
	// 40% van viewport-breedte per scroll-beweging
	const scrollBy = () => viewportRef.current.clientWidth * 0.4;

	// Ga naar vorige item
	const prev = () =>
		setIndex((i) => {
			const next = i > 0 ? i - 1 : maxIndex;
			viewportRef.current.scrollBy({ left: -scrollBy(), behavior: "smooth" });
			return next;
		});

	// Ga naar volgende item
	const next = () =>
		setIndex((i) => {
			const next = i < maxIndex ? i + 1 : 0;
			viewportRef.current.scrollBy({ left: scrollBy(), behavior: "smooth" });
			return next;
		});

	// Hardware-knoppen A, B, C, D configureren
	useHardwareButtons({
		onA: prev, // A => vorige
		onB: next, // B => volgende
		onC: () => navigate(-1), //C => terug in geschiedenis
		onD: () => {
			// D => selecteer (mogelijke detail-weergave)
			console.log("Selecteer-knop (D) ingedrukt");
		},
		enabledOn: ["/gallerij/letter", "/gallerij/poster"], // Alleen op deze routes
	});
	return (
		<div className="gallerij-list">
			<div className="carousel-container">
				{/* Viewport voor horizontale scroll */}
				<div className="carousel-viewport" ref={viewportRef}>
					<div className="carousel-track">
						{/* Render elk bestand als thumbnail */}
						{files.map((fp) => (
							<div key={fp} className="carousel-item">
								<img src={`file://${fp}`} className="carousel-thumb" />
							</div>
						))}
					</div>
				</div>
				{/* Overlay knoppen voor A (vorige) en B (volgende) */}
				<button className="overlay-btn overlay-prev" onClick={prev}>
					A. Vorige
				</button>
				<button className="overlay-btn overlay-next" onClick={next}>
					B. Volgende
				</button>
				{/* Overlay-acties voor C (terug) en D (selecteer) */}
				<div className="overlay-actions">
					<button className="overlay-btn" onClick={() => navigate(-1)}>
						C. Terug
					</button>
					<button className="overlay-btn">D. Selecteer</button>
				</div>
			</div>
		</div>
	);
}
