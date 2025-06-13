import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Render de hoofdapplicatie.
 */
// Oplossing dubbele canvassen - Strict mode uitzetten.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
