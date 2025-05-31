import React from "react";
import "../styles/Tool2.css";

export default function FrameImage({ src, alt }) {
	return <img src={src} alt={alt} className="frame-image" />;
}
