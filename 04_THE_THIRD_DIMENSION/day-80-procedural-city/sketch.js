// ==================================================
// Day 80 – Procedural City
// ==================================================

/*
  This sketch generates a simple procedural city
  using a grid of buildings. Each building's height
  and color are determined algorithmically.
*/

// --------------------------------------------------
// Scene Setup
// --------------------------------------------------

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(15, 20, 25);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// --------------------------------------------------
// Lighting
// --------------------------------------------------

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// --------------------------------------------------
// City Parameters
// --------------------------------------------------

const GRID_SIZE = 12;     // number of blocks per side
const BLOCK_SIZE = 1;    // width/depth of each building
const MAX_HEIGHT = 8;    // max building height

// --------------------------------------------------
// Generate City
// --------------------------------------------------

for (let x = -GRID_SIZE / 2; x < GRID_SIZE / 2; x++) {
  for (let z = -GRID_SIZE / 2; z < GRID_SIZE / 2; z++) {

    // Random building height
    const height = Math.random() * MAX_HEIGHT + 0.5;

    const geometry = new THREE.BoxGeometry(
      BLOCK_SIZE,
      height,
      BLOCK_SIZE
    );

    // Simple grayscale variation
    const shade = 0.3 + Math.random() * 0.7;
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(shade, shade, shade)
    });

    const building = new THREE.Mesh(geometry, material);

    // Position building so it grows upward
    building.position.set(
      x * (BLOCK_SIZE + 0.2),
      height / 2,
      z * (BLOCK_SIZE + 0.2)
    );

    scene.add(building);
  }
}

// --------------------------------------------------
// Animation Loop
// --------------------------------------------------

function animate() {
  requestAnimationFrame(animate);
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
