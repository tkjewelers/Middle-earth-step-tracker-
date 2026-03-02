# Middle Earth Journey Tracker

A 3D interactive map that tracks your real-world walking progress through Middle Earth, following Frodo and Sam's journey from the Shire to Mordor and back home.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

## Current Status (Feb 28, 2026)

| Metric | Value |
|--------|-------|
| Miles walked | 170.0 |
| Journey % | 9.6% of 1,779 mi |
| Current segment | Rivendell → West-gate of Moria |
| Last milestone | Rivendell (160 mi, ~Feb 23) |
| Next milestone | Moria West-gate (200 mi) |

## Tech Stack

- React 18 + Vite + TypeScript
- Three.js via React Three Fiber + Drei
- Zustand (state) + localStorage (persistence)
- Tailwind CSS

## Development Phases

1. ✅ Project Setup
2. ✅ Basic 3D Scene (R3F canvas, OrbitControls, lighting)
3. 🔲 Terrain System (procedural heightmap, vertex coloring)
4. 🔲 Geographic Features (water, forests, mountains)
5. 🔲 Journey Path (CatmullRom curve, completed/remaining)
6. 🔲 Hobbit Characters (models, interpolation, animation)
7. 🔲 Region Labels (billboard text)
8. 🔲 Mordor Effects (volcano, Eye of Sauron, particles)
9. 🔲 UI Components (progress input, stats, journey log)
10. 🔲 Polish (camera animations, mobile, performance)

## Working with Claude Code

See `CLAUDE.md` for full project context including coordinates, segment data, color palette, and development guidelines.

### Example prompts:

```
"Let's start Phase 3. Create the Terrain.tsx component with a procedural
heightmap using the coordinate system and region definitions from CLAUDE.md."

"Add the journey path visualization. Use CatmullRomCurve3 for smooth
interpolation between waypoints, with a gold completed section and
dimmed remaining section."

"The terrain colors aren't matching — the Shire should be greener.
Check the vertex color logic in Terrain.tsx."
```

## Project Structure

```
src/
├── components/three/  # 3D scene components
├── components/ui/     # 2D overlay components
├── data/              # Journey segments, locations, terrain config
├── stores/            # Zustand state management
├── hooks/             # Custom React hooks
├── utils/             # Noise, interpolation, coordinates
├── types/             # TypeScript interfaces
└── styles/            # Global CSS + Tailwind
```

## License

Personal project — not for redistribution. Tolkien content referenced for educational/personal use.
