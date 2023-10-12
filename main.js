import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 2, 2);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x111114);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const geometry = new THREE.BufferGeometry();
const particlesCount = 50000;
const particlesArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  particlesArray[i] = Math.random() * 10;
}
geometry.setAttribute("position", new THREE.BufferAttribute(particlesArray, 3));

const material = new THREE.PointsMaterial({ size: 0.005 });
const mesh = new THREE.Points(geometry, material);
scene.add(mesh);

const clock = new THREE.Clock();
function animate() {
  window.requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
