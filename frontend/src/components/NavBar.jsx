import { Link, useLocation } from "react-router-dom";
import "../styles/NavBar.css";
/**
 * NavBar component
 *
 * Navigatiebalk voor de applicatie.
 * Verbergt zichzelf op bepaalde routes (Tool1, Tool2, Poster).
 * Toont anders een link naar de homepagina.
 */
export default function NavBar() {
	const { pathname } = useLocation(); // Haal de huidige route op
	// Verberg de navbar op specifieke routes
	if (pathname == "/tool2") {
		return null;
	}
	if (pathname == "/tool1") {
		return null;
	}
	if (pathname == "/poster") {
		return null;
	}
	// Definieer navigatielinks
	const links = [{ to: "/", label: "Home" }];

	return (
		<nav className="navbar">
			<Link to="/" className="home-link">
				BEELDBOX
			</Link>
		</nav>
	);
}
