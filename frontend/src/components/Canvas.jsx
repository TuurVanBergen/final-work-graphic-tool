import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import p5 from "p5";
import { drawGrid } from "../utils/canvas/drawHelpers.js";
import "../styles/Canvas.css";

const CANVAS_W = 541;
const CANVAS_H = 675;

export default forwardRef(function Canvas(
	{
		font,
		selectedChar,
		modifiedPathData = [],
		translateX = 0,
		translateY = 0,
		rotation = 0,
		scaleX = 1,
		scaleY = 1,
		gridSize = { width: CANVAS_W, height: CANVAS_H },
	},
	ref
) {
	const containerRef = useRef(null);
	const p5Instance = useRef(null);

	// refs for props & data
	const fontRef = useRef(font);
	const charRef = useRef(selectedChar);
	const pathDataRef = useRef([]);
	const centerRef = useRef({ x: 0, y: 0 });
	const rotationRef = useRef(rotation);
	const scaleXRef = useRef(scaleX);
	const scaleYRef = useRef(scaleY);

	// expose redraw
	useImperativeHandle(ref, () => ({
		redraw: () => p5Instance.current && p5Instance.current.redraw(),
	}));

	// update pathData & center when font/char/data change
	useEffect(() => {
		fontRef.current = font;
		charRef.current = selectedChar;
		if (!font || !selectedChar) {
			pathDataRef.current = [];
			return;
		}
		if (Array.isArray(modifiedPathData) && modifiedPathData.length) {
			pathDataRef.current = modifiedPathData.map((c) => ({ ...c }));
		} else {
			const glyph = font.charToGlyph(selectedChar);
			const path = glyph?.getPath(0, 0, font.unitsPerEm);
			pathDataRef.current = path ? path.commands.map((c) => ({ ...c })) : [];
		}
		if (pathDataRef.current.length) {
			const path = font
				.charToGlyph(selectedChar)
				.getPath(0, 0, font.unitsPerEm);
			const bb = path.getBoundingBox();
			centerRef.current = { x: (bb.x1 + bb.x2) / 2, y: (bb.y1 + bb.y2) / 2 };
		}
		p5Instance.current && p5Instance.current.redraw();
	}, [font, selectedChar, modifiedPathData]);

	// update transform refs
	useEffect(() => {
		rotationRef.current = rotation;
		scaleXRef.current = scaleX;
		scaleYRef.current = scaleY;
		p5Instance.current && p5Instance.current.redraw();
	}, [rotation, scaleX, scaleY]);

	// init p5 sketch
	useEffect(() => {
		if (p5Instance.current) return;
		const sketch = (p) => {
			p.setup = () => {
				p.createCanvas(CANVAS_W, CANVAS_H).parent(containerRef.current);
				p.noLoop();
			};

			p.draw = () => {
				const f = fontRef.current;
				const c = charRef.current;
				if (!f || !c) return;

				p.background(255);
				drawGrid(p, gridSize);

				// auto-scale glyph
				const rawPath = f.charToGlyph(c).getPath(0, 0, f.unitsPerEm);
				const bb = rawPath.getBoundingBox();
				const glyphW = bb.x2 - bb.x1;
				const glyphH = bb.y2 - bb.y1;
				const maxW = CANVAS_W * 0.6;
				const maxH = CANVAS_H * 0.6;
				const autoScale = Math.min(maxW / glyphW, maxH / glyphH);
				const sx = scaleXRef.current * autoScale;
				const sy = scaleYRef.current * autoScale;

				p.push();
				p.translate(CANVAS_W / 2, CANVAS_H / 2);
				p.rotate((rotationRef.current * Math.PI) / 180);
				p.scale(sx, sy);
				p.translate(-centerRef.current.x, -centerRef.current.y);

				const ctx = p.drawingContext;
				ctx.beginPath();
				ctx.fillStyle = ctx.strokeStyle = "#2807FF";
				ctx.lineWidth = 1;

				for (let cmd of pathDataRef.current) {
					switch (cmd.type) {
						case "M":
							ctx.moveTo(cmd.x, cmd.y);
							break;
						case "L":
							ctx.lineTo(cmd.x, cmd.y);
							break;
						case "Q":
							ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
							break;
						case "C":
							ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
							break;
						case "Z":
							ctx.closePath();
							break;
						default:
							break;
					}
				}
				ctx.fill("evenodd");
				ctx.stroke();
				p.pop();
			};
		};
		p5Instance.current = new p5(sketch);
	}, []);

	return <div className="canvas-wrapper" ref={containerRef} />;
});
