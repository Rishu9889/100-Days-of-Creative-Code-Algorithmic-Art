// ==================================================
// Day 75 – Raymarching with Signed Distance Fields
// ==================================================

/*
  This sketch renders a 3D scene using raymarching.
  The scene is defined mathematically using Signed
  Distance Functions (SDFs) and rendered in a fragment
  shader.
*/

const scene = new THREE.Scene();

const camera = new THREE.Camera();
camera.position.z = 1;

// Fullscreen plane
const geometry = new THREE.PlaneGeometry(2, 2);

// Shader material
const material = new THREE.ShaderMaterial({
  uniforms: {
    u_time: { value: 0 },
    u_resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    }
  },

  vertexShader: `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    precision highp float;

    uniform float u_time;
    uniform vec2 u_resolution;

    // ---------------------------------------------
    // Signed Distance Functions
    // ---------------------------------------------

    float sdSphere(vec3 p, float r) {
      return length(p) - r;
    }

    float sceneSDF(vec3 p) {
      // Animate sphere position
      vec3 spherePos = vec3(sin(u_time) * 0.5, 0.0, 3.0);
      return sdSphere(p - spherePos, 1.0);
    }

    // ---------------------------------------------
    // Raymarching
    // ---------------------------------------------

    float rayMarch(vec3 ro, vec3 rd) {
      float t = 0.0;

      for (int i = 0; i < 64; i++) {
        vec3 p = ro + rd * t;
        float d = sceneSDF(p);
        if (d < 0.001) break;
        t += d;
        if (t > 20.0) break;
      }

      return t;
    }

    // ---------------------------------------------
    // Normal estimation
    // ---------------------------------------------

    vec3 getNormal(vec3 p) {
      float e = 0.001;
      vec2 h = vec2(e, 0.0);

      return normalize(vec3(
        sceneSDF(p + h.xyy) - sceneSDF(p - h.xyy),
        sceneSDF(p + h.yxy) - sceneSDF(p - h.yxy),
        sceneSDF(p + h.yyx) - sceneSDF(p - h.yyx)
      ));
    }

    // ---------------------------------------------
    // Main
    // ---------------------------------------------

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;

      vec3 ro = vec3(0.0, 0.0, -5.0);
      vec3 rd = normalize(vec3(uv, 1.0));

      float t = rayMarch(ro, rd);
      vec3 color = vec3(0.0);

      if (t < 20.0) {
        vec3 p = ro + rd * t;
        vec3 n = getNormal(p);
        vec3 lightDir = normalize(vec3(1.0, 1.0, -1.0));

        float diff = clamp(dot(n, lightDir), 0.0, 1.0);
        color = vec3(0.2, 0.8, 1.0) * diff;
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Animation loop
function animate(time) {
  material.uniforms.u_time.value = time * 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Handle resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  material.uniforms.u_resolution.value.set(
    window.innerWidth,
    window.innerHeight
  );
});
