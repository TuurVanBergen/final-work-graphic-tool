/**
 * Configuratie voor transform-sliders in Tool1 en Canvas
 *
 * Elke slider bevat:
 * - id: unieke key die overeenkomt met state-property
 * - label: tekst om naast de slider weer te geven
 * - min: minimale waarde
 * - max: maximale waarde
 * - step: stapgrootte bij verplaatsing
 * - default: beginwaarde bij initialisatie
 */
// src/config/SLIDER_CONFIG.js
export const SLIDER_CONFIG = [
	{
		id: "scaleX",
		label: "COMPRESSIE X",
		min: 0.1,
		max: 2,
		step: 0.01,
		default: 1,
	},
	{
		id: "gridSize",
		label: "PIXELIZE",
		min: 10,
		max: 75,
		step: 1,
		default: 0,
	},
	{
		id: "proportion",
		label: "TOP PROPORTIE",
		min: -1,
		max: 1,
		step: 0.01,
		default: 0,
	},
	{
		id: "bottomProportion",
		label: "BOTTOM PROPORTIE",
		min: -1,
		max: 1,
		step: 0.01,
		default: 0,
	},
	{
		id: "halftoneCount",
		label: "HALFTONE",
		min: 0,
		max: 100,
		step: 1,
		default: 0,
	},
	{
		id: "edgeRoughness",
		label: "ROUGHNESS",
		min: 0,
		max: 100,
		step: 1,
		default: 0,
	},
];
