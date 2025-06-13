// src/pages/Gallerij.jsx
/**
 * Gallerij pagina
 *
 * Toont een raster met links naar de subpagina's voor letters en posters.
 * Ondersteunt navigatie via fysieke hardware-knoppen (A, B, C) met cooldown.
 */
import { Link, useNavigate } from "react-router-dom";
import "../styles/Gallerij.css";
import useHardwareButtons from "../hooks/useHardwareButtons";
import { navigateWithCooldown } from "../utils/navigationCooldown";
export default function Gallerij() {
	// Hook om te navigeren
	const navigate = useNavigate();

	// Registreer hardware-knoppen: A => letter-gallerij, B => poster-gallerij, C => terug
	useHardwareButtons({
		onA: () => navigate("/gallerij/letter"),
		onB: () => navigate("/gallerij/poster"),
		onC: () => navigateWithCooldown(() => navigate(-1)),
		enabledOn: ["/gallerij"], // Alleen actief op de basis gallerij-route
	});

	return (
		<div className="gallery-container">
			<div className="gallery-grid">
				{/* Link naar LetterAtelier-gallerij */}
				<Link to="/gallerij/letter" className="gallery-item-link">
					<div className="gallery-item">
						<div className="gallery-top-group">
							<div className="gallery-top-link">Werken van LetterAtelier</div>
							<div className="gallery-sub-link">
								Hier vind je alle ontworpen letters
							</div>
						</div>
						<div className="gallery-bottom-letter">A.</div>
					</div>
				</Link>

				{/* Link naar KarakterAtelier-postergallerij */}
				<Link to="/gallerij/poster" className="gallery-item-link">
					<div className="gallery-item">
						<div className="gallery-top-group">
							<div className="gallery-top-link">Werken van KarakterAtelier</div>
							<div className="gallery-sub-link">
								Hier vind je alle ontworpen personages
							</div>
						</div>
						<div className="gallery-bottom-letter">B.</div>
					</div>
				</Link>
			</div>

			{/* Overlay-knop C voor terug-navigatie */}
			<button
				className="overlay-btn gallery-back-btn"
				onClick={() => navigate(-1)} // Ga één stap terug in de geschiedenis
			>
				C. Terug
			</button>
		</div>
	);
}
