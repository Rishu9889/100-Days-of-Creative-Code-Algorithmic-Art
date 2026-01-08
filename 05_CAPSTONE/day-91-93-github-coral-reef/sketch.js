// ==================================================
// GitHub Coral Reef — Days 91–93 (Capstone)
// ==================================================

/*
  This visualization represents open-source ecosystems
  as a living coral reef.

  - Coral branches grow recursively (repos & commits)
  - Gentle sway simulates underwater motion
  - Floating particles represent contributors/activity
  - Color & scale encode "activity intensity"
*/

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x020b14, 10, 60);

// --------------------------------------------------
// Camera & Renderer
// --------------------------------------------------

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.set(0, 8, 22);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// --------------------------------------------------
// Lighting (Underwater Feel)
// --------------------------------------------------

scene.add(new THREE.AmbientLight(0x6688aa, 0.6));

const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(10, 30, 10);
scene.add(light);

// --------------------------------------------------
// Coral Material
// --------------------------------------------------

function coralMaterial(activity) {
  // Activity ∈ [0,1]
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(
      0.02 + activity * 0.05,   // hue shift
      0.7,
      0.55
    ),
    roughness: 0.85,
    metalness: 0.0
  });
}

// --------------------------------------------------
// Recursive Coral Growth (Day 91)
// --------------------------------------------------

const coralGroup = new THREE.Group();
scene.add(coralGroup);

function growCoral(pos, dir, length, depth, activity) {
  if (depth <= 0) return;

  const geom = new THREE.CylinderGeometry(
    0.08 * depth,
    0.12 * depth,
    length,
    6
  );

  const branch = new THREE.Mesh(
    geom,
    coralMaterial(activity)
  );

  branch.position.copy(pos);
  branch.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );

  branch.position.add(dir.clone().multiplyScalar(length / 2));
  branch.userData = {
    swayOffset: Math.random() * Math.PI * 2,
    swayStrength: 0.15 / depth
  };

  coralGroup.add(branch);

  const newPos = branch.position.clone().add(
    dir.clone().multiplyScalar(length / 2)
  );

  const children = 2 + Math.floor(Math.random() * 2);

  for (let i = 0; i < children; i++) {
    const newDir = dir.clone()
      .applyAxisAngle(
        new THREE.Vector3(
          Math.random(),
          Math.random(),
          Math.random()
        ).normalize(),
        (Math.random() - 0.5) * 0.7
      )
      .normalize();

    growCoral(
      newPos,
      newDir,
      length * 0.75,
      depth - 1,
      activity
    );
  }
}

// Seed multiple coral colonies (Day 93 meaning layer)
for (let i = -2; i <= 2; i++) {
  const activity = Math.random(); // mock repo activity
  growCoral(
    new THREE.Vector3(i * 4, -4, 0),
    new THREE.Vector3(0, 1, 0),
    3 + activity * 2,
    5,
    activity
  );
}

// --------------------------------------------------
// Particles (Contributors / Activity) — Day 92
// --------------------------------------------------

const particleCount = 300;
const particleGeom = new THREE.BufferGeometry();
const positions = [];

for (let i = 0; i < particleCount; i++) {
  positions.push(
    (Math.random() - 0.5) * 40,
    Math.random() * 20,
    (Math.random() - 0.5) * 40
  );
}

particleGeom.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

const particleMat = new THREE.PointsMaterial({
  color: 0x88ccff,
  size: 0.08,
  transparent: true,
  opacity: 0.7
});

const particles = new THREE.Points(particleGeom, particleMat);
scene.add(particles);

// --------------------------------------------------
// Animation Loop (Motion & Life)
// --------------------------------------------------

let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.01;

  // Coral sway (gentle underwater motion)
  coralGroup.children.forEach(branch => {
    branch.rotation.z =
      Math.sin(t + branch.userData.swayOffset) *
      branch.userData.swayStrength;
  });

  // Particle drift
  const p = particleGeom.attributes.position.array;
  for (let i = 0; i < p.length; i += 3) {
    p[i + 1] += Math.sin(t + i) * 0.002;
    if (p[i + 1] > 20) p[i + 1] = 0;
  }
  particleGeom.attributes.position.needsUpdate = true;

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
