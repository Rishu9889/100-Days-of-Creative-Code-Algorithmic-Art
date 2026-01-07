// ==================================================
// Day 90 – Hypercube (4D → 3D Projection)
// ==================================================

/*
  A tesseract (4D cube) has 16 vertices.
  We rotate it in 4D space and project it into 3D,
  then render the edges using Three.js.
*/

// --------------------------------------------------
// Scene Setup
// --------------------------------------------------

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// --------------------------------------------------
// Generate 4D Hypercube Vertices
// --------------------------------------------------

const vertices4D = [];
const size = 1;

// 16 vertices: all combinations of ±1 in (x,y,z,w)
for (let x of [-1, 1]) {
  for (let y of [-1, 1]) {
    for (let z of [-1, 1]) {
      for (let w of [-1, 1]) {
        vertices4D.push({ x, y, z, w });
      }
    }
  }
}

// --------------------------------------------------
// 4D Rotation
// --------------------------------------------------

function rotate4D(v, angle) {
  // Rotate in X–W and Y–Z planes
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  let x = v.x * cos - v.w * sin;
  let w = v.x * sin + v.w * cos;

  let y = v.y * cos - v.z * sin;
  let z = v.y * sin + v.z * cos;

  return { x, y, z, w };
}

// --------------------------------------------------
// Projection 4D → 3D
// --------------------------------------------------

function project4Dto3D(v) {
  const distance = 3;
  const scale = distance / (distance - v.w);
  return new THREE.Vector3(
    v.x * scale,
    v.y * scale,
    v.z * scale
  );
}

// --------------------------------------------------
// Build Line Geometry
// --------------------------------------------------

const material = new THREE.LineBasicMaterial({
  color: 0x00ffff
});

const geometry = new THREE.BufferGeometry();
const line = new THREE.LineSegments(geometry, material);
scene.add(line);

// Edges: connect vertices differing by one coordinate
function isEdge(a, b) {
  let diff = 0;
  if (a.x !== b.x) diff++;
  if (a.y !== b.y) diff++;
  if (a.z !== b.z) diff++;
  if (a.w !== b.w) diff++;
  return diff === 1;
}

// --------------------------------------------------
// Animation Loop
// --------------------------------------------------

let angle = 0;

function animate() {
  requestAnimationFrame(animate);
  angle += 0.01;

  const points = [];

  // Rotate + project vertices
  const projected = vertices4D.map(v =>
    project4Dto3D(rotate4D(v, angle))
  );

  // Build edges
  for (let i = 0; i < projected.length; i++) {
    for (let j = i + 1; j < projected.length; j++) {
      if (isEdge(vertices4D[i], vertices4D[j])) {
        points.push(
          projected[i].x, projected[i].y, projected[i].z,
          projected[j].x, projected[j].y, projected[j].z
        );
      }
    }
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3)
  );

  renderer.render(scene, camera);
}

animate();

// --------------------------------------------------
// Resize
// --------------------------------------------------

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
