/**
 * Hoofdcomponent van de applicatie
 *
 * Stelt de router in met navigatie- en route-definities:
 * • NavBar: toont navigatiebalk waar van toepassing
 * • Routes: Home, Tool1, Tool2, Gallerij, GallerijList, PosterEditor
 */
// src/App.jsx
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Tool1 from "./pages/Tool1";
import Tool2 from "./pages/Tool2";
import Gallerij from "./pages/Gallerij";
import PosterEditor from "./pages/PosterEditor";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GallerijList from "./pages/GallerijList";

export default function App() {
	return (
		<Router>
			{/* NavBar wordt op de meeste routes weergegeven */}
			<NavBar />
			<Routes>
				{/* Route-configuratie voor alle pagina's */}
				<Route path="/" element={<Home />} />{" "}
				<Route path="/tool1" element={<Tool1 />} />
				<Route path="/tool2" element={<Tool2 />} />
				<Route path="/gallerij" element={<Gallerij />} />
				{/* GallerijList toont bestanden van type letter of poster */}
				<Route path="/gallerij/:type" element={<GallerijList />} />
				{/* Poster-editor route */}
				<Route path="/poster" element={<PosterEditor />} />
			</Routes>
		</Router>
	);
}
