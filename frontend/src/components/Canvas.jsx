import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import p5 from "p5";

const CANVAS_W = 814;
const CANVAS_H = 1021;

export default forwardRef(function Canvas(props, ref) {
	const containerRef = useRef(null);
	const p5Instance = useRef(null);

	useImperativeHandle(ref, () => ({
		redraw: () => p5Instance.current?.redraw(),
	}));

	// (props→p5 sync volgt in volgende stap)

	useEffect(() => {
		// Basis setup: maak canvas aan en geen loop
		const sketch = (p) => {
			p.setup = () => {
				p.createCanvas(CANVAS_W, CANVAS_H).parent(containerRef.current);
				p.noLoop();
			};
			p.draw = () => {
				p.background(255);
				// grid & glyph-rendering voegen we later toe
			};
		};
		p5Instance.current = new p5(sketch);
		return () => p5Instance.current?.remove();
	}, []);

	return (
		<div ref={containerRef} style={{ width: CANVAS_W, height: CANVAS_H }} />
	);
});
