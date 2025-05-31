import React, {
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import p5 from "p5";
import "../styles/PosterCanvas.css";
import "../index.css";
import { applyEffects } from "../utils/canvas/applyEffects";
import { applyGrid } from "../utils/canvas/effects/applyGrid";
import { applyHalftone } from "../utils/canvas/effects/applyHalftone";
import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG";

const SLIDER_KEYS = SLIDER_CONFIG.map((s) => s.id);
const CANVAS_W = 814;
const CANVAS_H = 1021;

export default forwardRef(function PosterCanvas(
	{ char, originalSliders, design, fontSize },
	ref
) {
	const containerRef = useRef(null);
	const p5Instance = useRef(null);

	useImperativeHandle(ref, () => ({
		redraw: () => p5Instance.current?.redraw(),
	}));

	// Sync props into p5
	useEffect(() => {
		const p = p5Instance.current;
		if (!p) return;
		p.char = char;
		p.fontSize = fontSize;
		SLIDER_KEYS.forEach((key) => {
			p[key] = originalSliders[key];
		});
		p.design = design;
		p.redraw();
	}, [char, fontSize, originalSliders, design]);

	// Init p5 instance
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current
				.querySelectorAll("canvas")
				.forEach((c) => c.remove());
		}
		p5Instance.current?.remove();

		const instance = new p5((p) => {
			let font;
			// palettes
			const bgPalette = [
				"#ffffff",
				"#ffcccc",
				"#ffe5b4",
				"#ffffcc",
				"#ccffcc",
				"#ccffff",
				"#ccccff",
				"#ffccff",
				"#f0f0f0",
				"#000000",
			];
			const fillPalette = [
				"#2807FF",
				"#001F3F",
				"#0074D9",
				"#7FDBFF",
				"#39CCCC",
				"#3D9970",
				"#2ECC40",
				"#01FF70",
				"#FFDC00",
				"#FF851B",
			];

			// init props
			p.char = char;
			p.fontSize = fontSize;
			p.design = design;
			SLIDER_KEYS.forEach((key) => (p[key] = originalSliders[key]));
			p.fontLoaded = false;

			p.setup = () => {
				p.createCanvas(CANVAS_W, CANVAS_H);
				p.noLoop();
				p.loadFont("/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf", (f) => {
					font = f;
					p.textFont(font);
					p.textSize(fontSize);
					p.fontLoaded = true;
					p.redraw();
				});
			};

			p.draw = () => {
				if (!p.fontLoaded) return;
				// background
				const bgIdx = Math.min(
					Math.max(Math.floor(p.design.bgHue), 0),
					bgPalette.length - 1
				);
				p.background(bgPalette[bgIdx]);

				p.push();
				// poster transforms
				p.translate(
					p.width / 2 + p.design.positionX,
					p.height / 2 + p.design.positionY
				);
				p.rotate((p.design.rotation * Math.PI) / 180);
				p.scale(p.design.scale);
				// tool1 transforms
				p.scale(p.scaleX || 1, 1);

				// compute points
				const bounds = font.textBounds(p.char, 0, 0, p.fontSize);
				const rawPts = font.textToPoints(p.char, 0, 0, p.fontSize);
				const cx = bounds.x + bounds.w / 2;
				const cy = bounds.y + bounds.h / 2;
				const basePts = rawPts.map((pt) => ({ x: pt.x - cx, y: pt.y - cy }));
				const finalPts = applyEffects(p, basePts);

				// select fill color
				const fillIdx = Math.min(
					Math.max(Math.floor(p.design.fillHue), 0),
					fillPalette.length - 1
				);
				const fillColor = fillPalette[fillIdx];
				// outline
				const outlineW = p.design.outlineWidth;

				if (p.gridSize > 10) {
					// pixelize
					applyGrid(p, finalPts).forEach((cell) => {
						p.noStroke();
						p.fill(fillColor);
						p.rect(cell.x, cell.y, cell.w, cell.h);
					});
				} else if (p.halftoneCount > 0) {
					// halftone
					applyHalftone(p, finalPts).forEach((dot) => {
						p.noStroke();
						p.fill(fillColor);
						p.ellipse(dot.x, dot.y, dot.r, dot.r);
					});
				} else {
					// standaard vorm
					if (outlineW > 0) {
						p.noFill();
						p.stroke(fillColor);
						p.strokeWeight(outlineW);
					} else {
						p.fill(fillColor);
						p.noStroke();
					}
					p.beginShape();
					finalPts.forEach((pt) => p.vertex(pt.x, pt.y));
					p.endShape(p.CLOSE);
				}

				p.pop();
			};
		}, containerRef.current);

		p5Instance.current = instance;
		return () => instance.remove();
	}, []);

	return <div className="poster-canvas-wrapper" ref={containerRef} />;
});
