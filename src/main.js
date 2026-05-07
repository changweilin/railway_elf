// Vite-managed entry. The full app graph (rail-data, app-core, app-map) is
// imported here so Vite bundles every source module. Leaflet's stylesheet is
// pulled in via npm so we no longer hit unpkg.
import React from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import { App } from "./app-core.js";

createRoot(document.getElementById("app")).render(React.createElement(App));
