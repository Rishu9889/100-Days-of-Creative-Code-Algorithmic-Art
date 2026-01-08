// ==================================================
// Generative Music Video — Days 94–96 (POLISHED)
// ==================================================

let scene, camera, renderer;
let analyser, dataArray;
let audioStarted = false;

scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 15, 80);

// Camera
camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.z = 20;

// Renderer with trails
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = false;
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const light = new THREE.PointLight(0x88ccff, 2, 100);
light.position.set(0, 10, 10);
scene.add(light);

// --------------------------------------------------
// Core Geometry (Deformable Orb)
// --------------------------------------------------

const baseGeometry = new THREE.IcosahedronGeometry(4, 4);
const geometry = baseGeometry.clone();

const material = new THREE.MeshStandardMaterial({
  color: 0x3366ff,
  roughness: 0.25,
  metalness: 0.4,
  wireframe: false
});

const orb = new THREE.Mesh(geometry, material);
scene.add(orb);

// --------------------------------------------------
// Particle Layer (High frequencies)
// --------------------------------------------------

const particleCount = 500;
const pGeom = new THREE.BufferGeometry();
const pPos = [];

for (let i = 0; i < particleCount; i++) {
  pPos.push(
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 40
  );
}

pGeom.setAttribute("position", new THREE.Float32BufferAttribute(pPos, 3));

const pMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.08,
  transparent: true,
  opacity: 0.6
});

const particles = new THREE.Points(pGeom, pMat);
scene.add(particles);

// --------------------------------------------------
// Audio Setup
// --------------------------------------------------

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
analyser = audioContext.createAnalyser();
analyser.fftSize = 512;

const bufferLength = analyser.frequencyBinCount;
dataArray = new Uint8Array(bufferLength);

window.addEventListener("click", async () => {
  if (audioStarted) return;
  audioStarted = true;
  document.getElementById("hint").remove();

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
});

// --------------------------------------------------
// Animation Loop
// --------------------------------------------------

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  // Fade for trails
  renderer.setClearColor(0x000000, 0.12);
  renderer.clear();

  if (audioStarted) {
    analyser.getByteFrequencyData(dataArray);

    // Frequency bands
    const bass = avg(dataArray.slice(0, bufferLength * 0.15));
    const mid = avg(dataArray.slice(bufferLength * 0.15, bufferLength * 0.5));
    const high = avg(dataArray.slice(bufferLength * 0.5));

    const b = bass / 255;
    const m = mid / 255;
    const h = high / 255;

    // Scale (bass)
    orb.scale.setScalar(1 + b * 1.8);

    // Geometry deformation (mids)
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(
        baseGeometry.attributes.position.getX(i),
        baseGeometry.attributes.position.getY(i),
        baseGeometry.attributes.position.getZ(i)
      );
      v.normalize().multiplyScalar(4 + m * 2 * Math.sin(time + i));
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true;

    // Color (energy)
    material.color.setHSL(
      0.6 - b * 0.4,
      0.8,
      0.5
    );

    // Particle motion (highs)
    const pp = pGeom.attributes.position.array;
    for (let i = 0; i < pp.length; i += 3) {
      pp[i + 1] += h * 0.3;
      if (pp[i + 1] > 20) pp[i + 1] = -20;
    }
    pGeom.attributes.position.needsUpdate = true;

    // Camera breathing
    camera.position.z = 20 - b * 8;
  }

  // Slow rotation
  orb.rotation.x += 0.002;
  orb.rotation.y += 0.003;

  renderer.render(scene, camera);
}

animate();

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
