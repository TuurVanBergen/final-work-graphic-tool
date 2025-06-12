import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/GallerijList.css";

export default function GallerijList() {
	const { type } = useParams();
	const navigate = useNavigate();
	const [files, setFiles] = useState([]);
	const viewportRef = useRef(null);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		window.electronAPI
			.listGalleryFiles(type)
			.then((list) => {
				setFiles(list);
			})
			.catch(console.error);
	}, [type]);

	const maxIndex = Math.max(0, files.length - 3);
	const scrollBy = () => viewportRef.current.clientWidth * 0.4;

	const prev = () =>
		setIndex((i) => {
			const next = i > 0 ? i - 1 : maxIndex;
			viewportRef.current.scrollBy({ left: -scrollBy(), behavior: "smooth" });
			return next;
		});
	const next = () =>
		setIndex((i) => {
			const next = i < maxIndex ? i + 1 : 0;
			viewportRef.current.scrollBy({ left: scrollBy(), behavior: "smooth" });
			return next;
		});

	return (
		<div className="gallerij-list">
			<div className="carousel-container">
				<div className="carousel-viewport" ref={viewportRef}>
					<div className="carousel-track">
						{files.map((fp) => (
							<div key={fp} className="carousel-item">
								<img src={`file://${fp}`} className="carousel-thumb" />
							</div>
						))}
					</div>
				</div>

				<button className="overlay-btn overlay-prev" onClick={prev}>
					A. Vorige
				</button>
				<button className="overlay-btn overlay-next" onClick={next}>
					B. Volgende
				</button>
				<div className="overlay-actions">
					<button className="overlay-btn" onClick={() => navigate(-1)}>
						C. Terug
					</button>
					<button className="overlay-btn">D. Selecteer</button>
				</div>
			</div>
		</div>
	);
}
