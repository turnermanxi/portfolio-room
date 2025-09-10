// ZoomTargets.js
export const ZOOM_TARGETS = {
  overview: { 
    x: 50, y: 95, z: 99,
    lookAt: { x: 0, y: 0, z: 0 },
  },
monitor: {
  x: -97, y: 1.93, z: -12.63, // Pull the camera back in front of the monitor
  lookAt: { x: -111.05, y: 1.93, z: -12.63 }, // Look at the center of the monitor mesh
},
  shelf: { 
    x: -5, y: 3, z: 20,
      lookAt: { x: 0, y: -1, z: 0 }, // Target the center of the monitor mesh
 },
};
