import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 7);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff);
scene.add(directionalLight);
directionalLight.position.set(0, 10, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x444444);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const fbxfloader = new FBXLoader();

let stag;
let clips;
fbxfloader.load("Punching.fbx", function (model) {
  model.scale.set(0.01, 0.01, 0.01);
  stag = model;

  clips = model.animations;
});

const geometry = new THREE.PlaneGeometry(10, 10);
const material = new THREE.MeshBasicMaterial({
  color: 0x444444,
  side: THREE.DoubleSide,
  visible: false,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

mesh.name = "ground";

const grid = new THREE.GridHelper(10, 10);
scene.add(grid);

const highlightSquare = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    transparent: true,
  })
);
highlightSquare.rotation.x = -Math.PI / 2;
scene.add(highlightSquare);
highlightSquare.position.set(0.5, 0, 0.5);

const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mousePosition, camera);
  intersects = raycaster.intersectObjects(scene.children);

  intersects.forEach(function (intersect) {
    if (intersect.object.name === "ground") {
      const highlightPos = new THREE.Vector3()
        .copy(intersect.point)
        .floor()
        .addScalar(0.5);
      highlightSquare.position.set(highlightPos.x, 0, highlightPos.z);

      const objectExists = checkObjectExists();

      !objectExists
        ? highlightSquare.material.color.setHex(0xffffff)
        : highlightSquare.material.color.setHex(0xff0000);
    }
  });
});

const objects = [];
const mixers = [];

function checkObjectExists() {
  const objectExists = objects.find(
    (object) =>
      object.position.x === highlightSquare.position.x &&
      object.position.z === highlightSquare.position.z
  );
  return objectExists;
}

window.addEventListener("mousedown", function (e) {
  const objectExists = checkObjectExists();

  if (!objectExists) {
    intersects.forEach(function (intersect) {
      if (intersect.object.name === "ground") {
        console.log("intersect");
        const stagClone = SkeletonUtils.clone(stag);
        stagClone.position.copy(highlightSquare.position);
        objects.push(stagClone);

        const mixer = new THREE.AnimationMixer(stagClone);
        const clip = THREE.AnimationClip.findByName(clips, "mixamo.com");
        const action = mixer.clipAction(clip);
        action.play();
        mixers.push(mixer);

        scene.add(stagClone);
      }
    });
    highlightSquare.material.color.setHex(0xff0000);
  }
});

const clock = new THREE.Clock();
function animate(time) {
  highlightSquare.material.opacity = 1 + Math.sin(time / 120);

  const delta = clock.getDelta();
  mixers.forEach(function (mixer) {
    mixer.update(delta);
  });
  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
