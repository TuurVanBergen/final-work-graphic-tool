import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import useHardwareButtons from "../hooks/useHardwareButtons";
import { navigateWithCooldown } from "../utils/navigationCooldown";

export const ALPHABET = [
	...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // A–Z
	...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)), // a–z
	...Array.from({ length: 10 }, (_, i) => String(i)), // 0–9
	",",
	"?",
	".",
	"!",
];

export default function Home() {
	const navigate = useNavigate();
	const location = useLocation(); // <-- verander deze lijn

	const nextChar = location.state?.char ?? ALPHABET[0];
	// A = naar Tool1, B = naar Tool2, C = naar Gallerij
	useHardwareButtons({
		onA: () =>
			navigateWithCooldown(() =>
				navigate("/tool1", { state: { char: nextChar } })
			),
		onB: () =>
			navigateWithCooldown(() =>
				navigate("/tool2", { state: { char: nextChar } })
			),
		onC: () => navigateWithCooldown(() => navigate("/gallerij")),
		enabledOn: ["/"],
	});
	return (
		<div className="home-container">
			<div className="grid-container">
				<Link to="/tool1" state={{ char: nextChar }} className="grid-item-link">
					<div className="grid-item">
						<div className="top-group">
							<div className="top-link">LETTERATELIER</div>
							<div className="sub-link">letterontwerp + print</div>
						</div>
						<div className="bottom-letter">A.</div>
					</div>
				</Link>
				<Link to="/tool2" className="grid-item-link">
					<div className="grid-item">
						<div className="top-group">
							<div className="top-link">KARAKTERATELIER</div>
							<div className="sub-link">Ontwerp je eigen personage</div>
						</div>
						<div className="bottom-letter">B.</div>
					</div>
				</Link>
				<Link to="/gallerij" className="grid-item-link">
					<div className="grid-item">
						<div className="top-group">
							<div className="top-link">GALLERIJ</div>
						</div>
						<div className="bottom-letter">C.</div>
					</div>
				</Link>
			</div>
		</div>
	);
}
