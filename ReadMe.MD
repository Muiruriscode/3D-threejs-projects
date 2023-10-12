# ADD Object by clicking the mouse

This involves using an invusible plane that can be clicked on using a mouse.

## Create an invisible plane

```js
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();

//copy plane normal position to the camera an normalize it
planeNormal.copy(camera.position).normalize();
plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
```

## Use raycaster to get clickrd coordinates

```js
// get mouse positions
mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

//get mouse intersect point using raycater
raycaster.setFromCamera(mouse, camera);
raycaster.ray.intersectPlane(plane, intersectionPoint);
```

### Add sphere on click

```js
window.addEventListener("click", function (e) {
  const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    metalness: 0.2,
    roughness: 0,
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphereMesh);
  //copy intersection point to sphere position
  sphereMesh.position.copy(intersectionPoint);
});
```
