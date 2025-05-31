import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SliderPanel from "../components/Tool2SliderPanel";
import FrameImage from "../components/FrameImage";
import { SLIDER_CONFIG_TOOL2 } from "../config/SLIDER_CONFIG_TOOL2";
import "../styles/Tool2.css";

const IMAGES = {
	top: [
		"/images/000013.jpg",
		"/images/000014.jpg",
		"/images/000017.jpg",
		"/images/000018.jpg",
	],
	middle: [
		"/images/000013.jpg",
		"/images/000014.jpg",
		"/images/000017.jpg",
		"/images/000018.jpg",
	],
	bottom: [
		"/images/000013.jpg",
		"/images/000014.jpg",
		"/images/000017.jpg",
		"/images/000018.jpg",
	],
	smallTop: [
		"/images/000013.jpg",
		"/images/000014.jpg",
		"/images/000017.jpg",
		"/images/000018.jpg",
	],
	smallBottom: [
		"/images/000013.jpg",
		"/images/000014.jpg",
		"/images/000017.jpg",
		"/images/000018.jpg",
	],
	smallLowerTop: [
		"/images/000013.jpg",
		"/images/000014.jpg",
		"/images/000017.jpg",
		"/images/000018.jpg",
	],
};

export default function Tool2() {
	const navigate = useNavigate();
	const initial = SLIDER_CONFIG_TOOL2.reduce(
		(acc, { id, min }) => ({ ...acc, [id]: min }),
		{}
	);
	const [values, setValues] = useState(initial);
	const initialRef = useRef(initial);
	const [showConfirm, setShowConfirm] = useState(false);

	const save = () => {
		initialRef.current = { ...values };
	};
	const reset = () => setValues(initial);
	const isDirty = () =>
		Object.keys(initialRef.current).some(
			(k) => initialRef.current[k] !== values[k]
		);
	const back = () => (isDirty() ? setShowConfirm(true) : navigate(-1));

	const getIdx = (key) => {
		const idxMap = {
			top: 1,
			middle: 2,
			bottom: 3,
			smallTop: 4,
			smallBottom: 5,
			smallLowerTop: 6,
		};
		const num = parseInt(values[`slider${idxMap[key]}`], 10);
		const valid = isNaN(num) ? 0 : num;
		return Math.max(0, Math.min(IMAGES[key].length - 1, valid));
	};

	return (
		<div
			id="tool-layout"
			style={{ pointerEvents: showConfirm ? "none" : "auto" }}
		>
			<div id="frame">
				<div id="inner-frame-top">
					<FrameImage src={IMAGES.top[getIdx("top")]} alt="Top" />
				</div>
				<div id="inner-frame-middle">
					<FrameImage src={IMAGES.middle[getIdx("middle")]} alt="Middle" />
				</div>
				<div id="inner-frame-bottom">
					<FrameImage src={IMAGES.bottom[getIdx("bottom")]} alt="Bottom" />
				</div>
				<div id="inner-frame-small-top">
					<FrameImage
						src={IMAGES.smallTop[getIdx("smallTop")]}
						alt="SmallTop"
					/>
				</div>
				<div id="inner-frame-small-bottom">
					<FrameImage
						src={IMAGES.smallBottom[getIdx("smallBottom")]}
						alt="SmallBottom"
					/>
				</div>
				<div id="inner-frame-small-lower-top">
					<FrameImage
						src={IMAGES.smallLowerTop[getIdx("smallLowerTop")]}
						alt="SmallLowerTop"
					/>
				</div>
			</div>
			<div className="sidebar">
				<SliderPanel
					config={SLIDER_CONFIG_TOOL2}
					values={values}
					onChange={setValues}
				/>
				<div className="button-panel">
					<button onClick={save}>Opslaan</button>
					<button onClick={reset}>Reset</button>
					<button onClick={back}>Terug</button>
				</div>
			</div>
			{showConfirm && (
				<div className="confirm-overlay">
					<div className="confirm-modal">
						<p>
							Weet je zeker dat je terug wil?
							<br />
							Niet-opgeslagen werk gaat verloren.
						</p>
						<div className="confirm-buttons">
							<button
								onClick={() => {
									setShowConfirm(false);
									navigate(-1);
								}}
							>
								A. JA
							</button>
							<button onClick={() => setShowConfirm(false)}>B. NEE</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
