import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 50);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffff33);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);
directionalLight.position.set(0, 0, 50);

const controls = new OrbitControls(camera, renderer.domElement);

// For models use getObject by name
const geometry = new THREE.IcosahedronGeometry();
const material = new THREE.MeshPhongMaterial({
  color: 0xffea00,
});
const mesh = new THREE.InstancedMesh(geometry, material, 10000);
scene.add(mesh);

const dummy = new THREE.Object3D();
for (let i = 0; i < 10000; i++) {
  dummy.position.x = Math.random() * 40 - 20;
  dummy.position.y = Math.random() * 40 - 20;
  dummy.position.z = Math.random() * 40 - 20;

  dummy.rotation.x = Math.random() * 2 * Math.PI;
  dummy.rotation.y = Math.random() * 2 * Math.PI;
  dummy.rotation.z = Math.random() * 2 * Math.PI;

  dummy.scale.x = dummy.scale.y = dummy.scale.z = Math.random();

  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
  mesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff));
}

const matrix = new THREE.Matrix4();

function animate(time) {
  for (let i = 0; i < 10000; i++) {
    mesh.getMatrixAt(i, matrix);
    matrix.decompose(dummy.position, dummy.rotation, dummy.scale);
    dummy.rotation.x = ((i / 10000) * time) / 2000;
    dummy.rotation.y = ((i / 10000) * time) / 500;
    dummy.rotation.z = ((i / 10000) * time) / 1200;
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;

  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
