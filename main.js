import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0.5, 2);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x111114);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById("progress-bar");
const container = document.getElementById("container");

loadingManager.onStart = function (url, item, total) {
  console.log("started");
};
loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
};
loadingManager.onLoad = function () {
  container.style.display = "none";
};
loadingManager.onError = function () {
  console.error("Error");
};

const gltfloader = new FBXLoader(loadingManager);

let mixer;
gltfloader.load("/model3/Run.fbx", function (gltf) {
  gltf.scale.set(0.005, 0.005, 0.005);
  mixer = new THREE.AnimationMixer(gltf);
  const clips = gltf.animations;
  const clip = THREE.AnimationClip.findByName(clips, "mixamo.com");
  const action = mixer.clipAction(clip);
  action.play();
  scene.add(gltf);
});

scene.add(new THREE.AmbientLight(0xffffff, 1.0));
const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(0, 10, 10);
scene.add(light);

const geometry = new THREE.PlaneGeometry(5, 5);
const material = new THREE.MeshBasicMaterial({ color: 0x222222 });
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

const clock = new THREE.Clock();
function animate(time) {
  window.requestAnimationFrame(animate);
  if (mixer) mixer.update(clock.getDelta() / 5);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
