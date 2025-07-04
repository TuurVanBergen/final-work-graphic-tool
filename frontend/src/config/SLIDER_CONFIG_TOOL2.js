/**
 * Configuratie voor Tool2-sliders in de Tool2-pagina
 *
 * Elke slider heeft:
 * - id: unieke key die overeenkomt met state-property
 * - label: tekst om naast de slider weer te geven
 * - min: minimale waarde
 * - max: maximale waarde
 * - step: stapgrootte bij verplaatsing
 */
// src/config/SLIDER_CONFIG_TOOL2.js
export const SLIDER_CONFIG_TOOL2 = [
	{ id: "slider1", label: "Frame Top", min: 0, max: 3, step: 1 },
	{ id: "slider2", label: "Frame Middle", min: 0, max: 3, step: 1 },
	{ id: "slider3", label: "Frame Bottom", min: 0, max: 3, step: 1 },
	{ id: "slider4", label: "Small Top", min: 0, max: 3, step: 1 },
	{ id: "slider5", label: "Small Bottom", min: 0, max: 3, step: 1 },
	{ id: "slider6", label: "Small Lower Top", min: 0, max: 3, step: 1 },
];
