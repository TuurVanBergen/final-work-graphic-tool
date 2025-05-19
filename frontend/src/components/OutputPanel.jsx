import React, { useRef, useEffect } from "react";
import p5 from "p5";
import "../styles/OutputPanel.css";

// Same dimensions as Canvas
const CANVAS_W = 541;
const CANVAS_H = 675;

export default function OutputPanel({
	font,
	selectedChar,
	modifiedPathData = [],
	rotation = 0,
	scaleX = 1,
	scaleY = 1,
}) {
	const containerRef = useRef(null);
	const p5Instance = useRef(null);

	useEffect(() => {
		// Clean up old instance
		if (p5Instance.current) {
			p5Instance.current.remove();
			p5Instance.current = null;
		}
		if (!font || !selectedChar) return;

		const sketch = (p) => {
			p.setup = () => {
				p.createCanvas(CANVAS_W, CANVAS_H).parent(containerRef.current);
				p.noLoop();
			};

			p.draw = () => {
				p.background(255);

				// Choose modified commands or default
				const glyph = font.charToGlyph(selectedChar);
				const defaultCommands = glyph.getPath(0, 0, font.unitsPerEm).commands;
				const commands =
					Array.isArray(modifiedPathData) && modifiedPathData.length
						? modifiedPathData
						: defaultCommands;

				// Compute center & auto-scale to 90% of panel
				const bb = glyph.getPath(0, 0, font.unitsPerEm).getBoundingBox();
				const centerX = (bb.x1 + bb.x2) / 2;
				const centerY = (bb.y1 + bb.y2) / 2;
				const glyphW = bb.x2 - bb.x1;
				const glyphH = bb.y2 - bb.y1;

				const maxW = CANVAS_W * 0.6;
				const maxH = CANVAS_H * 0.6;
				const autoScale = Math.min(maxW / glyphW, maxH / glyphH);
				const sx = scaleX * autoScale;
				const sy = scaleY * autoScale;

				p.push();
				p.translate(CANVAS_W / 2, CANVAS_H / 2);
				p.rotate((rotation * Math.PI) / 180);
				p.scale(sx, sy);
				p.translate(-centerX, -centerY);

				const ctx = p.drawingContext;
				ctx.beginPath();
				ctx.fillStyle = ctx.strokeStyle = "black";
				ctx.lineWidth = 1;

				for (let cmd of commands) {
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
		return () => p5Instance.current && p5Instance.current.remove();
	}, [font, selectedChar, modifiedPathData, rotation, scaleX, scaleY]);

	return <div className="output-panel" ref={containerRef} />;
}
