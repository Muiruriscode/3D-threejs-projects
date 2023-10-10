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
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const loadingManager = new THREE.LoadingManager();

scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 2, 0);
light.castShadow = true;
scene.add(light);

light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;

const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(0, 2, 0);
spotLight.intensity = 1.0;
spotLight.angle = 0.45;
spotLight.penumbra = 0.7;

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

const fbxfloader = new FBXLoader(loadingManager);

let mixer;
fbxfloader.load("/model3/Run.fbx", function (model) {
  model.scale.set(0.005, 0.005, 0.005);

  model.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
    }
  });

  mixer = new THREE.AnimationMixer(model);
  const clips = model.animations;
  const clip = THREE.AnimationClip.findByName(clips, "mixamo.com");
  const action = mixer.clipAction(clip);
  action.play();
  scene.add(model);
});

const geometry = new THREE.PlaneGeometry(20, 20, 32, 32);
const material = new THREE.MeshStandardMaterial({
  color: 0x444444,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

const clock = new THREE.Clock();
function animate() {
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
