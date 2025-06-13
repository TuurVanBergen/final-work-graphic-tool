/**
 * Configuratie voor poster-sliders in de PosterEditor
 *
 * Elke slider heeft:
 * - id: unieke key die overeenkomt met state-property
 * - label: tekst om naast de slider weer te geven
 * - min: minimale waarde
 * - max: maximale waarde
 * - step: stapgrootte bij verplaatsing
 */
// src/config/SLIDER_CONFIG_POSTER.js
export const SLIDER_CONFIG_POSTER = [
	{
		id: "posterScale",
		label: "SCHAAL",
		min: 0.1,
		max: 3,
		step: 0.01,
	},
	{
		id: "fillHue",
		label: "VOORGRONDKLEUR",
		min: 0,
		max: 9,
		step: 1,
	},
	{
		id: "bgHue",
		label: "ACHTERGRONDKLEUR",
		min: 0,
		max: 9,
		step: 1,
	},
	{
		id: "verticalOffset",
		label: "VERTICALE OFFSET",
		min: -200,
		max: 200,
		step: 1,
	},
	{
		id: "horizontalOffset",
		label: "HORIZONTALE OFFSET",
		min: -200,
		max: 200,
		step: 1,
	},
	{
		id: "blend",
		label: "BLEND",
		min: 0,
		max: 10,
		step: 1,
	},
];
