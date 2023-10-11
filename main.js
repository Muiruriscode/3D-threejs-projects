import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 15);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x111114);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const geometry = new THREE.PlaneGeometry(20, 20);
const material = new THREE.MeshBasicMaterial({
  color: 0x444444,
  side: THREE.DoubleSide,
  visible: false,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

mesh.name = "ground";

const grid = new THREE.GridHelper(20, 20);
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

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 4, 2),
  new THREE.MeshBasicMaterial({
    color: 0xffea000,
    wireframe: true,
  })
);

const objects = [];

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
        const sphereClone = sphereMesh.clone();
        sphereClone.position.copy(highlightSquare.position);
        objects.push(sphereClone);
        scene.add(sphereClone);
      }
    });
    highlightSquare.material.color.setHex(0xff0000);
  }
});

function rotateSphere(time) {
  objects.forEach(function (object) {
    object.rotation.x = time / 1000;
    object.rotation.z = time / 1000;
    object.position.y = 0.5 + 0.5 + Math.abs(Math.sin(time / 1000));
  });
}

function animate(time) {
  highlightSquare.material.opacity = 1 + Math.sin(time / 120);
  controls.update();
  rotateSphere(time);
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
