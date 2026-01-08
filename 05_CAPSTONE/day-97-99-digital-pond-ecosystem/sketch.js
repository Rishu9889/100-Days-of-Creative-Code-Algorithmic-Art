// ==================================================
// Digital Pond Ecosystem — Days 97–99
// ==================================================

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x020b14, 10, 80);

// Camera
const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 200
);
camera.position.set(0, 15, 22);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Light
scene.add(new THREE.AmbientLight(0x88aaff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 0.6);
sun.position.set(10, 20, 10);
scene.add(sun);

// --------------------------------------------------
// Water Surface (Day 97)
// --------------------------------------------------

const waterGeom = new THREE.PlaneGeometry(40, 40, 120, 120);
waterGeom.rotateX(-Math.PI / 2);

const waterMat = new THREE.MeshStandardMaterial({
  color: 0x1e88e5,
  roughness: 0.7,
  metalness: 0.1,
  transparent: true,
  opacity: 0.85
});

const water = new THREE.Mesh(waterGeom, waterMat);
scene.add(water);

// Ripple state
const rippleCenters = [];

// Click → ripple
window.addEventListener("click", e => {
  const x = (Math.random() - 0.5) * 30;
  const z = (Math.random() - 0.5) * 30;
  rippleCenters.push({ x, z, t: 0 });
});

// --------------------------------------------------
// Fish Agents (Day 98)
// --------------------------------------------------

const fishGroup = new THREE.Group();
scene.add(fishGroup);

class Fish {
  constructor() {
    const geom = new THREE.ConeGeometry(0.3, 1, 8);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffcc80
    });
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.rotation.x = Math.PI / 2;

    this.pos = new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      0.2,
      (Math.random() - 0.5) * 20
    );
    this.vel = new THREE.Vector3(
      Math.random() - 0.5,
      0,
      Math.random() - 0.5
    ).normalize().multiplyScalar(0.05);

    fishGroup.add(this.mesh);
  }

  update() {
    this.pos.add(this.vel);

    // Boundary wrap
    if (this.pos.x > 20) this.pos.x = -20;
    if (this.pos.x < -20) this.pos.x = 20;
    if (this.pos.z > 20) this.pos.z = -20;
    if (this.pos.z < -20) this.pos.z = 20;

    // Gentle wandering
    this.vel.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      (Math.random() - 0.5) * 0.02
    );

    this.mesh.position.copy(this.pos);
    this.mesh.lookAt(this.pos.clone().add(this.vel));
  }
}

const fishes = [];
for (let i = 0; i < 20; i++) fishes.push(new Fish());

// --------------------------------------------------
// Lilypads (Day 99)
// --------------------------------------------------

const lilyGroup = new THREE.Group();
scene.add(lilyGroup);

for (let i = 0; i < 12; i++) {
  const geom = new THREE.CircleGeometry(
    1 + Math.random(), 16
  );
  const mat = new THREE.MeshStandardMaterial({
    color: 0x66bb6a
  });
  const lily = new THREE.Mesh(geom, mat);
  lily.rotation.x = -Math.PI / 2;
  lily.position.set(
    (Math.random() - 0.5) * 25,
    0.05,
    (Math.random() - 0.5) * 25
  );
  lilyGroup.add(lily);
}

// --------------------------------------------------
// Animation Loop
// --------------------------------------------------

let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.01;

  // Water ripples
  const pos = waterGeom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    let y = 0;

    rippleCenters.forEach(r => {
      const d = Math.hypot(x - r.x, z - r.z);
      y += Math.sin(d * 0.5 - r.t) * 0.2 * Math.exp(-d * 0.05);
      r.t += 0.02;
    });

    pos.setY(i, y);
  }
  pos.needsUpdate = true;
  waterGeom.computeVertexNormals();

  // Fish update
  fishes.forEach(f => f.update());

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
