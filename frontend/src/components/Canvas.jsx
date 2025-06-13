/**
 * Canvas component
 *
 * Deze component maakt een p5.js-canvas aan waarin een letter (props.char)
 * wordt getekend met verschillende visuele effecten (grid, halftoon, etc.).
 * Slider-waarden worden gesynchroniseerd met de p5-instantie en via forwardRef
 * wordt een redraw()-methode beschikbaar gesteld voor handmatige hertekeningen.
 */
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import p5 from "p5";
import "../styles/Canvas.css";
import { drawGrid } from "../utils/canvas/drawHelpers.js";
import { SLIDER_CONFIG } from "../config/SLIDER_CONFIG";
import { applyEffects } from "../utils/canvas/applyEffects";
import { applyGrid } from "../utils/canvas/effects/applyGrid";
import { applyHalftone } from "../utils/canvas/effects/applyHalftone";

// Haal alleen de slider-ID's op om props te synchroniseren met de p5-instantie
const SLIDER_KEYS = SLIDER_CONFIG.map((s) => s.id);

// Vaste afmetingen voor de canvas
const CANVAS_W = 636;
const CANVAS_H = 900;

// Gebruik forwardRef zodat de parentcomponent redraw() kan aanroepen
export default forwardRef(function Canvas(props, ref) {
	const containerRef = useRef(null);
	const p5Instance = useRef(null);

	//redraw-methode via de ref
	useImperativeHandle(ref, () => ({
		redraw: () => p5Instance.current?.redraw(),
	}));

	// Synchroniseer props met de p5-instantie en trigger een redraw
	useEffect(() => {
		const p = p5Instance.current;
		if (!p) return;

		// Werk karakter en lettergrootte bij
		p.char = props.char;
		p.fontSize = props.fontSize;

		// Werk alle slider-waarden bij
		SLIDER_KEYS.forEach((key) => {
			p[key] = props[key];
		});

		// Herteken het canvas met nieuwe parameters
		p.redraw();
	}, [props.char, props.fontSize, ...SLIDER_KEYS.map((key) => props[key])]);

	// Initialiseer de p5-canvas bij mount
	useEffect(() => {
		if (containerRef.current) {
			// Verwijder bestaande canvaselementen om duplicaten te voorkomen
			containerRef.current
				.querySelectorAll("canvas")
				.forEach((c) => c.remove());
		}
		// Verwijder vorige p5-instantie indien aanwezig
		p5Instance.current?.remove();

		// Maak een nieuwe p5-instantie en koppel aan de container
		const instance = new p5((p) => {
			let font;

			// Initialiseer p5-parameters
			p.char = props.char;
			p.fontSize = props.fontSize;
			SLIDER_KEYS.forEach((key) => {
				p[key] = props[key];
			});

			p.rawPts = []; // Ruwe punten van de tekst
			p.bounds = { x: 0, y: 0, w: 0, h: 0 }; // Tekstgrenzen
			p.fontLoaded = false; // Status lettertype geladen

			// Eenmalige setup bij aanmaak van de p5-instance
			p.setup = () => {
				p.createCanvas(CANVAS_W, CANVAS_H); // Canvas aanmaken
				p.noLoop(); // Zet automatische loop uit
				p.loadFont("/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf", (f) => {
					// Laad het lettertype asynchroon
					font = f;
					p.textFont(font);
					p.textSize(p.fontSize);
					p.fontLoaded = true;

					// Bereken grenzen en ruwe punten voor het initiële karakter
					p.bounds = font.textBounds(p.char, 0, 0, p.fontSize);
					p.rawPts = font.textToPoints(p.char, 0, 0, p.fontSize);

					// Herteken zodra het lettertype klaar is
					p.redraw();
				});
			};
			// Wordt aangeroepen bij elke redraw
			p.draw = () => {
				p.background(255);
				p.push(); // Sla de huidige tekenstatus op

				drawGrid(p, { width: p.width, height: p.height }); // Achtergrondraster tekenen

				// Update grenzen en punten als het lettertype geladen is
				if (p.fontLoaded) {
					p.bounds = font.textBounds(p.char, 0, 0, p.fontSize);
					p.rawPts = font.textToPoints(p.char, 0, 0, p.fontSize);
				}
				// Toon tijdelijke tekst als het lettertype nog niet geladen is
				if (!p.fontLoaded) {
					p.fill(150);
					p.textAlign(p.CENTER, p.CENTER);
					p.textSize(16);
					p.text("Loading…", p.width / 2, p.height / 2);
					p.pop();
					return;
				}
				// Fallback naar normale tekstweergave als er geen punten zijn

				if (!Array.isArray(p.rawPts) || p.rawPts.length === 0) {
					p.fill("#2807FF");
					p.noStroke();
					p.textAlign(p.CENTER, p.CENTER);
					p.text(p.char, p.width / 2, p.height / 2);
					p.pop();
					return;
				}

				// Centraal uitlijnen van de vorm op het zwaartepunt
				const cx = p.bounds.x + p.bounds.w / 2;
				const cy = p.bounds.y + p.bounds.h / 2;
				const basePts = p.rawPts.map((pt) => ({
					x: pt.x - cx,
					y: pt.y - cy,
				}));

				// Translate pas NA correct gecentreerd
				p.translate(p.width / 2, p.height / 2); // Verplaats naar midden canvas
				p.scale(p.scaleX ?? 1, 1); // Pas horizontale schaal toe

				// Pas de gekozen effecten toe
				const finalPts = applyEffects(p, basePts);

				// Bepaal welke effecten getekend worden

				// 1) Flags voor grid en halftone op basis van sliderwaarden
				const doGrid = p.gridSize > 10; // Grid actief wanneer grootte > 10
				const doHalftone = p.halftoneCount > 0; // Halftone actief wanneer teller > 0

				// 3) Keuze van tekenroutine op basis van actieve effecten
				if (doGrid && doHalftone) {
					// * Beide effecten actief: eerst halftone stippen, daarna grid-overlay
					applyHalftone(p, finalPts);
					applyGrid(p, finalPts);
				} else if (doHalftone) {
					// * Alleen halftone: teken halftone stippen over de vorm
					applyHalftone(p, finalPts);
				} else if (doGrid) {
					// * Alleen grid: teken effen rechthoeken per gridcel binnen de vorm
					applyGrid(p, finalPts);
				} else {
					// * Geen effecten: standaard contour of full-fill
					p.fill("#2807FF");
					p.noStroke();
					// Bouw en teken de shape via finalPts
					p.beginShape();
					finalPts.forEach((pt) => p.vertex(pt.x, pt.y));
					p.endShape(p.CLOSE);
				}

				p.pop(); // Herstel tekenstatus
			};
		}, containerRef.current);

		p5Instance.current = instance; // Sla instance op voor later

		// Opruimen bij unmount
		return () => {
			p5Instance.current?.remove();
			containerRef.current?.replaceChildren();
		};
	}, []); // Alleen bij eerste render uitvoeren

	// Render het wrapper-element voor de canvas
	return <div className="canvas-wrapper" ref={containerRef}></div>;
});
