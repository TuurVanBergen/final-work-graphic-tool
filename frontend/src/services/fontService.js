import opentype from "opentype.js";

/**
 * Laadt een lokaal fontbestand en geeft een opentype.Font object terug.
 *
 * @async
 * @function
 * @returns {Promise<opentype.Font>} Het ingeladen font.
 * @throws {Error} Als het font niet kan worden geladen of geparsed.
 */
// 		// const response = await fetch("/fonts/Almendra-Bold.ttf");
// 		// const response = await fetch("/fonts/Tagesschrift-Regular.ttf");
// 		// const response = await fetch("/fonts/MajorMonoDisplay-Regular.ttf");
export async function loadLocalFont(path = "fonts/Helvetica/Helvetica.ttf") {
	const res = await fetch(path);
	if (!res.ok) throw new Error(`Font laden mislukt: ${res.status}`);
	const buf = await res.arrayBuffer();
	const parsed = opentype.parse(buf);
	console.log("Font (parse) unitsPerEm:", parsed.unitsPerEm);
	return { font: parsed, url: path };
}
