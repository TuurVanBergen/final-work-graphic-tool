import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Tool1 from "./pages/Tool1";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
	return (
		<Router>
			<NavBar />
			<Routes>
				<Route path="/" element={<Home />} />{" "}
				<Route path="/tool1" element={<Tool1 />} />
			</Routes>
		</Router>
	);
}
