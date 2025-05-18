import Canvas from "./components/Canvas";
import { useFontLoader } from "./hooks/useFontLoader";

export default function App() {
	const { font, loading } = useFontLoader("/fonts/Helvetica/Helvetica.ttf");

	if (loading) return <p>Font wordt geladen…</p>;

	return (
		<div style={{ padding: "2rem" }}>
			{/* Geef Canvas het geladen font en een test-letter */}
			<Canvas font={font} selectedChar="A" />
		</div>
	);
}
