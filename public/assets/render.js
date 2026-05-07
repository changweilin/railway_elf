"use strict";
// Final entry: must run AFTER rail-data, rail-data.generated, app-core, and
// app-map have all populated their globals on `window`. Lives in public/ so
// Vite serves it as-is rather than bundling it with src/main.js (which would
// hoist it to the top of <head> and break the load order).
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(React.createElement(App));
