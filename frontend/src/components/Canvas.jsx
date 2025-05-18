import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import p5 from "p5";
import { drawGrid } from "../utils/canvas/drawHelpers";
import "../styles/Canvas.css";

// Canvas-dimensies
const CANVAS_W = 541;
const CANVAS_H = 675;

export default forwardRef(function Canvas(
	{ translateX = 0, translateY = 0, rotation = 0, scaleX = 1, scaleY = 1 },
	ref
) {
	const containerRef = useRef(null);
	const p5Instance = useRef(null);

	// expose redraw via ref
	useImperativeHandle(ref, () => ({
		redraw: () => p5Instance.current?.redraw(),
	}));

	// rerender on prop changes
	useEffect(() => {
		p5Instance.current?.redraw();
	}, [translateX, translateY, rotation, scaleX, scaleY]);

	useEffect(() => {
		const sketch = (p) => {
			p.setup = () => {
				p.createCanvas(CANVAS_W, CANVAS_H).parent(containerRef.current);
				p.noLoop();
			};
			p.draw = () => {
				p.background(255);
				drawGrid(p, { width: CANVAS_W, height: CANVAS_H });

				p.push();
				p.translate(CANVAS_W / 2 + translateX, CANVAS_H / 2 + translateY);
				p.rotate((rotation * Math.PI) / 180);
				p.scale(scaleX, scaleY);
				// hier komt je glyph-rendering
				p.pop();
			};
		};
		p5Instance.current = new p5(sketch);
		return () => p5Instance.current.remove();
	}, []);

	return <div className="canvas-wrapper" ref={containerRef} />;
});
