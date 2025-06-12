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

import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG";
import { SLIDER_CONFIG_POSTER } from "../config/SLIDER_CONFIG_POSTER";

const TOOL1_KEYS = SLIDER_CONFIG.map((s) => s.id);
const CANVAS_W = 636;
const CANVAS_H = 900;

export default forwardRef(function PosterCanvas(
	{ char, originalSliders, design, fontSize },
	ref
) {
	const containerRef = useRef(null);
	const p5Instance = useRef(null);

	useImperativeHandle(ref, () => ({
		redraw: () => p5Instance.current?.redraw(),
	}));

	// Sync props met p5‐instance
	useEffect(() => {
		const p = p5Instance.current;
		if (!p) return;
		p.char = char;
		p.fontSize = fontSize;
		TOOL1_KEYS.forEach((key) => (p[key] = originalSliders[key]));
		p.design = design;
		p.redraw();
	}, [char, fontSize, originalSliders, design]);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current
				.querySelectorAll("canvas")
				.forEach((c) => c.remove());
		}
		p5Instance.current?.remove();

		const instance = new p5((p) => {
			let font;

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

				// 1) Achtergrond
				const bgIdx = Math.min(
					Math.max(Math.floor(p.design.bgHue), 0),
					bgPalette.length - 1
				);
				p.background(bgPalette[bgIdx]);

				// === START EEN ENKELE PUSH/POP-SPAN ===
				p.push();

				// 2) Externe transformaties: posX/posY + slider‐offsets
				const totalX =
					p.width / 2 + p.design.positionX + p.design.horizontalOffset; // horizontale offset
				const totalY =
					p.height / 2 + p.design.positionY + p.design.verticalOffset; // verticale offset
				p.translate(totalX, totalY);

				p.rotate((p.design.rotation * Math.PI) / 180);
				p.scale(p.design.posterScale);

				// 3) Tool1‐transformaties (stretch/slant e.d.)
				p.scale(p.scaleX || 1, 1);

				// 4) Bereken contourpunten en pas applyEffects toe
				const bounds = font.textBounds(p.char, 0, 0, p.fontSize);
				const rawPts = font.textToPoints(p.char, 0, 0, p.fontSize);
				const cx = bounds.x + bounds.w / 2;
				const cy = bounds.y + bounds.h / 2;
				const basePts = rawPts.map((pt) => ({
					x: pt.x - cx,
					y: pt.y - cy,
				}));
				const finalPts = applyEffects(p, basePts);

				// 5) Kies voorgrondkleur & outline‐dikte
				const fillIdx = Math.min(
					Math.max(Math.floor(p.design.fillHue), 0),
					fillPalette.length - 1
				);
				const fillColor = fillPalette[fillIdx];
				const outlineW = p.design.outlineWidth;

				// 6) Teken de basis (grid/halftone/contour/fill) WÉL met blend-mode
				drawPosterBase(p, finalPts, fillColor, outlineW, p.design.blend);

				// 7) Als er géén grid/halftone actief is, teken “gewone” fill of outline:
				const doGrid = p.gridSize > 10;
				const doHalftone = p.halftoneCount > 0;
				if (!doGrid && !doHalftone) {
					if (outlineW > 0) {
						p.noFill();
						p.stroke(fillColor);
						p.strokeWeight(outlineW);
						p.beginShape();
						finalPts.forEach((pt) => p.vertex(pt.x, pt.y));
						p.endShape(p.CLOSE);
					} else {
						p.fill(fillColor);
						p.noStroke();
						p.beginShape();
						finalPts.forEach((pt) => p.vertex(pt.x, pt.y));
						p.endShape(p.CLOSE);
					}
				}

				// 8) Sluit de PUSH af
				p.pop();

				// 9) **Reset blendMode pas hier (buiten push/pop) naar BLEND**
				p.blendMode(p.BLEND);
			};
		}, containerRef.current);

		p5Instance.current = instance;
		return () => instance.remove();
	}, []);

	return <div className="poster-canvas-wrapper" ref={containerRef} />;
});
