// src/components/Canvas.jsx
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import p5 from "p5";
import "../styles/Canvas.css";
import { drawGrid } from "../utils/canvas/drawHelpers.js";
import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG";
import { applyEffects } from "../utils/canvas/applyEffects";
import { applyGrid } from "../utils/canvas/effects/applyGrid";
import { applyHalftone } from "../utils/canvas/effects/applyHalftone";

const SLIDER_KEYS = SLIDER_CONFIG.map((s) => s.id);

const CANVAS_W = 636;
const CANVAS_H = 900;

export default forwardRef(function Canvas(props, ref) {
	const containerRef = useRef(null);
	const p5Instance = useRef(null);

	useImperativeHandle(ref, () => ({
		redraw: () => p5Instance.current?.redraw(),
	}));

	// Sync props naar p5 instance
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

	// Init canvas
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current
				.querySelectorAll("canvas")
				.forEach((c) => c.remove());
		}
		p5Instance.current?.remove();

		const instance = new p5((p) => {
			let font;

			p.char = props.char;
			p.fontSize = props.fontSize;
			SLIDER_KEYS.forEach((key) => {
				p[key] = props[key];
			});

			p.rawPts = [];
			p.bounds = { x: 0, y: 0, w: 0, h: 0 };
			p.fontLoaded = false;

			p.setup = () => {
				p.createCanvas(CANVAS_W, CANVAS_H);
				p.noLoop();
				p.loadFont("/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf", (f) => {
					font = f;
					p.textFont(font);
					p.textSize(p.fontSize);
					p.fontLoaded = true;

					// Update points bij letterwijziging
					p.bounds = font.textBounds(p.char, 0, 0, p.fontSize);
					p.rawPts = font.textToPoints(p.char, 0, 0, p.fontSize);

					p.redraw();
				});
			};

			p.draw = () => {
				p.background(255);
				p.push();

				drawGrid(p, { width: p.width, height: p.height });
				if (p.fontLoaded) {
					p.bounds = font.textBounds(p.char, 0, 0, p.fontSize);
					p.rawPts = font.textToPoints(p.char, 0, 0, p.fontSize);
				}
				if (!p.fontLoaded) {
					p.fill(150);
					p.textAlign(p.CENTER, p.CENTER);
					p.textSize(16);
					p.text("Loading…", p.width / 2, p.height / 2);
					p.pop();
					return;
				}
				if (!Array.isArray(p.rawPts) || p.rawPts.length === 0) {
					p.fill("#2807FF");
					p.noStroke();
					p.textAlign(p.CENTER, p.CENTER);
					p.text(p.char, p.width / 2, p.height / 2);
					p.pop();
					return;
				}

				// Center shape op eigen zwaartepunt
				const cx = p.bounds.x + p.bounds.w / 2;
				const cy = p.bounds.y + p.bounds.h / 2;
				const basePts = p.rawPts.map((pt) => ({
					x: pt.x - cx,
					y: pt.y - cy,
				}));

				// Translate pas NA correct gecentreerd
				p.translate(p.width / 2, p.height / 2);
				p.scale(p.scaleX ?? 1, 1);

				// Pas effecten toe
				const finalPts = applyEffects(p, basePts);

				// --- Halftone en grid combineren
				const doGrid = p.gridSize > 10;
				const doHalftone = p.halftoneCount > 0;

				if (doGrid && doHalftone) {
					applyHalftone(p, finalPts);
					applyGrid(p, finalPts);
				} else if (doHalftone) {
					applyHalftone(p, finalPts);
				} else if (doGrid) {
					applyGrid(p, finalPts);
				} else {
					p.fill("#2807FF");
					p.noStroke();
					p.beginShape();
					finalPts.forEach((pt) => p.vertex(pt.x, pt.y));
					p.endShape(p.CLOSE);
				}

				p.pop();
			};
		}, containerRef.current);

		p5Instance.current = instance;

		return () => {
			p5Instance.current?.remove();
			containerRef.current?.replaceChildren();
		};
	}, []);

	return <div className="canvas-wrapper" ref={containerRef}></div>;
});
