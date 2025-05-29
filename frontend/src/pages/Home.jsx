import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
	return (
		<div className="home-container">
			<div className="grid-container">
				<Link to="/tool1" className="grid-item-link">
					<div className="grid-item">
						<div className="top-link">LETTERATELIER</div>
						<div className="bottom-letter">A.</div>
					</div>
				</Link>
				<Link to="/tool2" className="grid-item-link">
					<div className="grid-item">
						<div className="top-link">RASTERATELIER</div>
						<div className="bottom-letter">B.</div>
					</div>
				</Link>
				<Link to="/gallerij" className="grid-item-link">
					<div className="grid-item">
						<div className="top-link">ONTDEK & INSPIREER</div>
						<div className="bottom-letter">C.</div>
					</div>
				</Link>
			</div>
		</div>
	);
}
