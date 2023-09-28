import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00ffff);
document.body.append(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 1));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);

light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.right = 2;
light.shadow.camera.left = -2;
light.shadow.camera.top = 2;
light.shadow.camera.bottom = -2;

scene.add(light);

const Helicoid = (u, v, target) => {
  let alpha = Math.PI * 2 * (u - 0.5);
  let theta = Math.PI * 2 * (v - 0.5);
  let t = 5;
  let bottom = 1 + Math.cosh(alpha) * Math.cosh(theta);

  let x = (Math.sinh(alpha) * Math.cos(t * theta)) / bottom;
  let z = (Math.sinh(alpha) * Math.sin(t * theta)) / bottom;
  let y = (1.5 * Math.cosh(alpha) * Math.sinh(theta)) / bottom;

  target.set(x, y, z);
};

function getMaterial() {
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0,
    metalness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.5,
    side: THREE.DoubleSide,
  });

  material.onBeforeCompile = function (shader) {
    shader.uniforms.playhead = { value: 0 };

    shader.fragmentShader =
      `uniform float playhead;\n ` + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <logdepthbuf_fragment>",
      `
      float diff = dot(vec3(1.), vNormal);

      vec3 a = vec3(0.8, 0.5, 0.4);
      vec3 b = vec3(0.2, 0.5, 0.5);
      vec3 c = vec3(2.0, 1.0, 1.0);
      vec3 d = vec3(0.00, 0.25, 0.25);

      vec3 cc = a + b*cos(2.*3.141592*(c*diff+d + playhead));

      diffuseColor.rgb = cc;
      ` + "#include <logdepthbuf_fragment>"
    );
    material.userData.shader = shader;
  };

  return material;
}
let geometry = new ParametricGeometry(Helicoid, 300, 300);
let material = getMaterial();
const mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = mesh.receiveShadow = true;
scene.add(mesh);

let ballGeomertry = new THREE.IcosahedronGeometry(0.27, 5);
const ballMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff6622,
  metalness: 1,
  roughness: 0.5,
});

let ball = new THREE.Mesh(ballGeomertry, ballMaterial);
let ball2 = new THREE.Mesh(ballGeomertry, ballMaterial);

ball.castShadow = ball.receiveShadow = true;
ball2.castShadow = ball2.receiveShadow = true;

scene.add(ball);
scene.add(ball2);

function animate(playhead) {
  requestAnimationFrame(animate);

  mesh.rotation.y = (playhead / 3000) * Math.PI * 2;

  if (ball && ball2) {
    let theta = (playhead / 1500) * Math.PI;
    let theta1 = (playhead / 1500) * Math.PI + Math.PI;

    ball.position.x = 0.5 * Math.sin(theta);
    ball.position.z = 0.5 * Math.cos(theta);

    ball2.position.x = 0.5 * Math.sin(theta1);
    ball2.position.z = 0.5 * Math.cos(theta1);
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
