# MCP Lifecycle

A small static web app that explains how a Model Context Protocol (MCP) client and server establish a session, exchange capabilities, and shut down — through a reference guide and an interactive conversation simulator.

## Pages

- **[index.html](index.html)** — home page with links to the guide, the simulator, the official MCP docs, and the MCPJam inspector.
- **[src/pages/guide.html](src/pages/guide.html)** — a sidebar-navigated reference guide covering initialization, capability negotiation, operation, transport, shutdown, and special cases (pings, errors, timeouts, cancellation, progress notifications).
- **[src/pages/simulator.html](src/pages/simulator.html)** — step through (or auto-play) a simulated client–server JSON-RPC conversation, message by message.

## Project structure

```
MCP Lifecycle/
├── index.html            # entry point / home page
└── src/
    ├── pages/             # guide.html, simulator.html
    ├── css/                # variables.css (shared tokens) + one stylesheet per page
    ├── js/                  # guide.js, simulator.js
    └── img/                  # favicon.svg
```

## Running locally

No build step or dependencies — just open `index.html` in a browser, or serve the folder with any static file server, e.g.:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.
