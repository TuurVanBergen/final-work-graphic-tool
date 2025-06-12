// src/pages/Gallerij.jsx
import { Link, useNavigate } from "react-router-dom";
import "../styles/Gallerij.css";
import useHardwareButtons from "../hooks/useHardwareButtons";
import { navigateWithCooldown } from "../utils/navigationCooldown";
export default function Gallerij() {
	const navigate = useNavigate();
	useHardwareButtons({
		onA: () => navigate("/gallerij/letter"),
		onB: () => navigate("/gallerij/poster"),
		onC: () => navigateWithCooldown(() => navigate(-1)),
		enabledOn: ["/gallerij"],
	});

	return (
		<div className="gallery-container">
			<div className="gallery-grid">
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

			{/* C. Terug-knop als overlay */}
			<button
				className="overlay-btn gallery-back-btn"
				onClick={() => navigate(-1)}
			>
				C. Terug
			</button>
		</div>
	);
}
