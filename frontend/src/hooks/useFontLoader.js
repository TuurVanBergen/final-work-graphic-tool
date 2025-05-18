// src/hooks/useFontLoader.js

import { useState, useEffect } from "react";
import { loadLocalFont } from "../services/fontService";

/**
 * Hook to load a local font and extract its glyphs, given a font file path.
 *
 * @param {string} fontPath — URL relative to public/ (e.g. "/fonts/MyFont.ttf")
 * @returns {{
 *   glyphs: string[],
 *   loading: boolean,
 *   fontFamily: string,
 *   font: import("opentype.js").Font | null
 * }}
 */
export function useFontLoader(fontPath) {
	const [fontData, setFontData] = useState(null);
	const [glyphs, setGlyphs] = useState([]);
	const [loading, setLoading] = useState(true);

	// Derive a CSS-safe fontFamily from the filename (e.g. "MyFont")
	const fontFamily = fontPath
		.split("/")
		.pop()
		.replace(/\.[^.]+$/, "");

	useEffect(() => {
		let isCancelled = false;

		async function fetchFont() {
			try {
				// loadLocalFont now takes the path and returns { font, url }
				const { font, url } = await loadLocalFont(fontPath);
				if (isCancelled) return;

				setFontData(font);

				// extract all Unicode glyphs
				const chars = [];
				for (let i = 0; i < font.numGlyphs; i++) {
					const g = font.glyphs.get(i);
					if (g.unicode) chars.push(String.fromCharCode(g.unicode));
				}
				setGlyphs(chars);

				// register the font in the browser
				const face = new FontFace(fontFamily, `url(${url}) format('truetype')`);
				await face.load();
				if (isCancelled) return;
				document.fonts.add(face);
				console.log("Font in browser toegevoegd:", fontFamily);
			} catch (err) {
				console.error("useFontLoader error:", err);
			} finally {
				if (!isCancelled) setLoading(false);
			}
		}

		fetchFont();

		return () => {
			isCancelled = true;
		};
	}, [fontPath, fontFamily]);

	console.log("useFontLoader:", glyphs, loading, fontFamily, fontData);
	return {
		glyphs,
		loading,
		fontFamily,
		font: fontData,
	};
}
