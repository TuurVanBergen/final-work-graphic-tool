// src/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div style={{ textAlign: "center", marginTop: "4rem" }}>
			<h1>Welkom</h1>
			<p>Kies een tool:</p>
			<div style={{ display: "inline-flex", gap: "1rem" }}>
				<Link to="/tool1">
					<button>Tool 1: Glyph & Text</button>
				</Link>
			</div>
		</div>
	);
}
