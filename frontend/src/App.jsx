import { useRef } from "react";
import Canvas from "./components/Canvas";

export default function App() {
	// voorbeeld: pas hier props aan of hou ref bij om redraw te triggeren
	const canvasRef = useRef(null);
	return (
		<div style={{ textAlign: "center", marginTop: "2rem" }}>
			<h1>Beeldlab Canvas</h1>
			<Canvas ref={canvasRef} rotation={15} scaleX={1} scaleY={1} />
		</div>
	);
}
