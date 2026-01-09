// ==================================================
// Day 85 – Terrain Flyover (Polished)
// ==================================================

/*
  Procedural terrain generated via vertex displacement.
  A smooth camera flyover creates a cinematic sense of scale.
*/

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0a0a0a, 10, 80);

// Camera
const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 200
);
camera.position.set(0, 12, 18);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.45));
const sun = new THREE.DirectionalLight(0xffffff, 0.85);
sun.position.set(10, 30, 10);
scene.add(sun);

// --------------------------------------------------
// Terrain Geometry
// --------------------------------------------------

const WIDTH = 80;
const DEPTH = 80;
const SEGMENTS = 200;

const geometry = new THREE.PlaneGeometry(
  WIDTH, DEPTH, SEGMENTS, SEGMENTS
);
geometry.rotateX(-Math.PI / 2);

// Simple coherent noise using layered sine waves
function heightAt(x, z) {
  return (
    Math.sin(x * 0.15) * 1.2 +
    Math.cos(z * 0.18) * 1.0 +
    Math.sin((x + z) * 0.08) * 1.5
  );
}

// Displace vertices
const pos = geometry.attributes.position;
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i);
  const z = pos.getZ(i);
  const y = heightAt(x, z);
  pos.setY(i, y);
}
pos.needsUpdate = true;
geometry.computeVertexNormals();

// Terrain material
const material = new THREE.MeshStandardMaterial({
  color: 0x2e7d32,
  roughness: 0.9,
  metalness: 0.0,
});

const terrain = new THREE.Mesh(geometry, material);
scene.add(terrain);

// --------------------------------------------------
// Camera Flyover
// --------------------------------------------------

let t = 0;
function animate() {
  requestAnimationFrame(animate);

  t += 0.002;

  // Smooth forward motion
  camera.position.x = Math.sin(t) * 10;
  camera.position.z = 18 - t * 8;
  camera.position.y = 8 + Math.sin(t * 2) * 1.2;

  camera.lookAt(
    camera.position.x * 0.3,
    0,
    camera.position.z - 10
  );

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
