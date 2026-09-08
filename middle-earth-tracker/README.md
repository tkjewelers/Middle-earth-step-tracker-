# Middle-earth Walking Adventure

See the [repository README](../README.md) for setup, controls, data preservation, challenge distance rules, and verification commands.

`src/App.tsx` contains the tracker interface and route explorer. `src/components/three/JourneyScene.tsx` renders the procedural hobbits and regional scenes. `src/data/journey-segments.ts` retains the original story data and adapts return distances to the existing challenge target. Zustand persists walking progress in the original browser-storage key.
