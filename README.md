# 3D Portfolio Room (React + React‑Three‑Fiber)

Interactive portfolio built with **React**, **React‑Three‑Fiber/Three.js**, and **Vite**. Uses a “room” scene to showcase projects; cards and modals bridge 3D and HTML UI.

## Highlights
- Scene graph with reusable components (lights, camera rigs, models)
- HTML overlays for accessibility (no info locked in 3D only)
- Performance tuned: useMemo/useFrame, compressed textures, GLTF/DRACO
- Deployed as a static site (Netlify/Vercel)

## Tech Stack
- **UI:** React, R3F, drei
- **Routing:** React Router
- **Build:** Vite
- **Styling:** CSS modules or Tailwind (optional)
- **Tooling:** ESLint/Prettier

## Structure
```
src/
  components/
    3d/        # Model loaders, lights, controls
    ui/        # Cards, modals, nav
  assets/
  App.jsx
  main.jsx
public/
```

## Getting Started
```bash
npm i
npm run dev
```
Open `http://localhost:5173`.

## Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Accessibility & Performance
- Keyboard navigation for all links/buttons
- Fallback HTML content for key info
- `useGLTF` caching + draco compression
- `Suspense` + lazy for heavy routes
- Measure with Lighthouse/React Profiler

## What I built
- Project “shelves” mapped to routes
- Modal detail views with repo + live links
- Simple state store for camera focus targets

## What I’d do next
- Add tests for camera logic and route guards
- Add CMS (content JSON or headless) to update projects
- Add “performance mode” toggle for low‑end devices

## License
MIT
