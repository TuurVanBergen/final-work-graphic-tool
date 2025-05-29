import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Tool1 from "./pages/Tool1";
import Tool2 from "./pages/Tool2";
import Gallerij from "./pages/Gallerij";
import PosterEditor from "./pages/PosterEditor";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
	return (
		<Router>
			<NavBar />
			<Routes>
				<Route path="/" element={<Home />} />{" "}
				<Route path="/tool1" element={<Tool1 />} />
				<Route path="/tool2" element={<Tool2 />} />
				<Route path="/gallerij" element={<Gallerij />} />
				<Route path="/poster" element={<PosterEditor />} />
			</Routes>
		</Router>
	);
}
