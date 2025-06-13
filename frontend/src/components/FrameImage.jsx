/**
 * FrameImage component
 *
 * Deze component toont een afbeelding
 * De afbeelding wordt weergegeven via een <img>-element met de opgegeven src en alt attributen.
 */
import React from "react";
import "../styles/Tool2.css";

export default function FrameImage({ src, alt }) {
	return <img src={src} alt={alt} className="frame-image" />;
}
