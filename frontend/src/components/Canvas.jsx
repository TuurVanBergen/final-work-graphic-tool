import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import p5 from "p5";
import { drawGrid } from "../utils/canvas/drawHelpers";
import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG";
const SLIDER_KEYS = SLIDER_CONFIG.map((s) => s.id);

const CANVAS_W = 814;
const CANVAS_H = 1021;

export default forwardRef(function Canvas(props, ref) {
	const containerRef = useRef(null);
	const p5Instance = useRef(null);

	useEffect(() => {
		const p = p5Instance.current;
		if (!p) return;
		p.char = props.char;
		p.fontSize = props.fontSize;
		SLIDER_KEYS.forEach((key) => {
			p[key] = props[key];
		});
		p.redraw();
	}, [props.char, props.fontSize, ...SLIDER_KEYS.map((key) => props[key])]);

	useImperativeHandle(ref, () => ({
		redraw: () => p5Instance.current?.redraw(),
	}));

	useEffect(() => {
		const sketch = (p) => {
			p.setup = () => {
				p.createCanvas(CANVAS_W, CANVAS_H).parent(containerRef.current);
				p.noLoop();
			};
			p.draw = () => {
				p.background(255);
				drawGrid(p, { width: CANVAS_W, height: CANVAS_H });
				// toekomstige glyph-rendering komt hier
			};
		};
		p5Instance.current = new p5(sketch);
		return () => p5Instance.current?.remove();
	}, []);

	return (
		<div ref={containerRef} style={{ width: CANVAS_W, height: CANVAS_H }} />
	);
});
