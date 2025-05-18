import { Link, useLocation } from "react-router-dom";
import "../styles/NavBar.css";
/**
 * NavBar
 *
 * Een eenvoudige navigatiebalk voor de applicatie.
 * Toon huidige route en links naar Home, Tool1 en Tool2.
 */
export default function NavBar() {
	const { pathname } = useLocation();

	const links = [
		{ to: "/", label: "Home" },
		{ to: "/tool1", label: "Glyph Editor" },
		{ to: "/tool2", label: "Tool 2" },
	];

	return (
		<nav className="navbar">
			<Link to="/" className="home-link">
				BEELDLAB
			</Link>
			{links.map(({ to, label }) => (
				<Link
					key={to}
					to={to}
					className={`a-link${pathname === to ? " active" : ""}`}
				>
					{label}
				</Link>
			))}
		</nav>
	);
}
