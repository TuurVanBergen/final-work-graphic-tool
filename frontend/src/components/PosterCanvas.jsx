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
import { drawPosterBase } from "../utils/posterCanvas/drawHelpersPoster";
import { applyInkBleed } from "../utils/posterCanvas/effects/applyInkBleed";

import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG"; // Tool1-sliders (grid, halftone, etc.)
import { SLIDER_CONFIG_POSTER } from "../config/SLIDER_CONFIG_POSTER"; // Poster-sliders (scale, fillHue, bgHue, texture, inkBleed, blend)

const TOOL1_KEYS = SLIDER_CONFIG.map((s) => s.id);
const CANVAS_W = 814;
const CANVAS_H = 1021;

export default forwardRef(function PosterCanvas(
	{ char, originalSliders, design, fontSize },
	ref
) {
	const containerRef = useRef(null);
	const p5Instance = useRef(null);

	// Exposeer een 'redraw' methode zodat parent (PosterEditor) p5 kan hertekenen
	useImperativeHandle(ref, () => ({
		redraw: () => p5Instance.current?.redraw(),
	}));

	// Sync props in p5-instance
	useEffect(() => {
		const p = p5Instance.current;
		if (!p) return;

		// Zet letter en fontSize
		p.char = char;
		p.fontSize = fontSize;

		// Kopieer ALLE Tool1-sliders (gridSize, halftoneCount, etc.)
		TOOL1_KEYS.forEach((key) => {
			p[key] = originalSliders[key];
		});

		// Poster-specifieke instellingen
		p.design = design; // bevat posterScale, fillHue, bgHue, texture, inkBleed, blend
		p.redraw();
	}, [char, fontSize, originalSliders, design]);

	// Initialiseer p5
	useEffect(() => {
		if (containerRef.current) {
			// Verwijder oude canvas-elementen (bij HMR / router-switch)
			containerRef.current
				.querySelectorAll("canvas")
				.forEach((c) => c.remove());
		}
		p5Instance.current?.remove();

		const instance = new p5((p) => {
			let font;

			// Achtergrond‐ en voorgrond‐palettes
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

			// Init props in p5
			p.char = char;
			p.fontSize = fontSize;
			p.design = design;
			TOOL1_KEYS.forEach((key) => (p[key] = originalSliders[key]));
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

				// 1) Achtergrond (bgHue)
				const bgIdx = Math.min(
					Math.max(Math.floor(p.design.bgHue), 0),
					bgPalette.length - 1
				);
				p.background(bgPalette[bgIdx]);

				p.push();

				// 2) Poster-transformaties (positionX, positionY, rotation, posterScale)
				p.translate(
					p.width / 2 + p.design.positionX,
					p.height / 2 + p.design.positionY
				);
				p.rotate((p.design.rotation * Math.PI) / 180);
				p.scale(p.design.posterScale);

				// 3) Tool1-transformaties (stretch/slant/…)
				p.scale(p.scaleX || 1, 1);

				// 4) Letter naar punten omzetten
				const bounds = font.textBounds(p.char, 0, 0, p.fontSize);
				const rawPts = font.textToPoints(p.char, 0, 0, p.fontSize);
				const cx = bounds.x + bounds.w / 2;
				const cy = bounds.y + bounds.h / 2;
				const basePts = rawPts.map((pt) => ({
					x: pt.x - cx,
					y: pt.y - cy,
				}));

				// 5) Pas “applyEffects” toe (jitter, stretch, enz.)
				const finalPts = applyEffects(p, basePts);

				// 6) Kies voorgrondkleur (fillHue)
				const fillIdx = Math.min(
					Math.max(Math.floor(p.design.fillHue), 0),
					fillPalette.length - 1
				);
				const fillColor = fillPalette[fillIdx];

				// 7) Outline‐dikte
				const outlineW = p.design.outlineWidth;

				// 8) Teken basisvorm mét blendMode
				drawPosterBase(
					p,
					finalPts,
					fillColor,
					outlineW,
					p.design.blend // slider-waarde voor blend (0..100)
				);

				// 9) Ink-Bleed over dezelfde contour
				applyInkBleed(
					p,
					finalPts,
					fillColor,
					p.design.inkBleed, // slider-waarde (0..20)
					font,
					p.fontSize
				);

				p.pop();
			};
		}, containerRef.current);

		p5Instance.current = instance;
		return () => instance.remove();
	}, []);

	return <div className="poster-canvas-wrapper" ref={containerRef} />;
});
