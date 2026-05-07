// Vite-managed entry. Pulls React, ReactDOM, and Leaflet from npm so the
// production build no longer depends on unpkg, then exposes them on the
// global object so the existing classic-style scripts in public/assets
// (rail-data.js, rail-data.generated.js, app-core.js, app-map.js) can keep
// using bare `React` / `ReactDOM` / `L` references during their incremental
// migration to ES modules.
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

window.React = React;
window.ReactDOM = ReactDOMClient;
window.L = L;
