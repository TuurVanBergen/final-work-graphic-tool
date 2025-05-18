import { useRef, useEffect } from "react";
import p5 from "p5";
import { drawGrid } from "../utils/canvas/drawHelpers";
import "../styles/Canvas.css";

export default function Canvas() {
	const containerRef = useRef(null);

	useEffect(() => {
		// p5 sketch
		const sketch = (p) => {
			p.setup = () => {
				p.createCanvas(541, 675).parent(containerRef.current);
				p.noLoop();
			};
			p.draw = () => {
				p.background(255);
				drawGrid(p, { width: 541, height: 675 });
			};
		};
		const instance = new p5(sketch);
		return () => instance.remove();
	}, []);

	return <div className="canvas-wrapper" ref={containerRef} />;
}
