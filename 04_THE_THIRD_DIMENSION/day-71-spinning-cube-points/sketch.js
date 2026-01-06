// ==================================================
// Day 71 – Spinning Cube (Points)
// ==================================================

/*
  This sketch introduces 3D space using Three.js.

  A cube is represented as a cloud of points instead
  of solid faces, emphasizing structure and rotation
  without visual clutter.
*/

// --------------------------------------------------
// Scene, Camera, Renderer
// --------------------------------------------------

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,                         // field of view
  window.innerWidth / window.innerHeight,
  0.1,                        // near clipping plane
  1000                        // far clipping plane
);

camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// --------------------------------------------------
// Geometry: Cube as Points
// --------------------------------------------------

/*
  BoxGeometry generates vertices for a cube.
  We render only the vertices as points.
*/

const geometry = new THREE.BoxGeometry(2, 2, 2);

// Convert geometry to points
const material = new THREE.PointsMaterial({
  color: 0x00ffff,
  size: 0.05
});

const cube = new THREE.Points(geometry, material);
scene.add(cube);

// --------------------------------------------------
// Animation Loop
// --------------------------------------------------

function animate() {
  requestAnimationFrame(animate);

  // Rotate cube in 3D space
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.008;

  renderer.render(scene, camera);
}

animate();

// --------------------------------------------------
// Handle Resize
// --------------------------------------------------

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
