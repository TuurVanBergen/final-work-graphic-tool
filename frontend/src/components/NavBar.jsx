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
	// Verberg navbar op Tool2 route
	if (pathname == "/tool2") {
		return null;
	}
	if (pathname == "/tool1") {
		return null;
	}

	const links = [{ to: "/", label: "Home" }];

	return (
		<nav className="navbar">
			<Link to="/" className="home-link">
				BEELDLAB
			</Link>
		</nav>
	);
}
