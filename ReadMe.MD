# Create Grid and Add Objects on Click

Create a grid and and add an objects upon clicking witj a mouse.

## Create a grid

```js
const geometry = new THREE.PlaneGeometry(20, 20);
const material = new THREE.MeshBasicMaterial({
  color: 0x444444,
  side: THREE.DoubleSide,
  visible: false, // make grid invisible
});
const mesh = new THREE.Mesh(geometry, material);

//Add grid helper
const grid = new THREE.GridHelper(20, 20);
scene.add(grid);
```

## ADD Highlight Square

```js
const highlightSquare = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    transparent: true,
  })
  highlightSquare.position.set(0.5, 0, 0.5); // Move to the center of squre  in grid
);

```

## Raycaster

Use the raycaster to get intersect point on the plane

```js
raycaster.setFromCamera(mousePosition, camera);
intersects = raycaster.intersectObjects(scene.children);
```

## Clone objects on mouse click

Clone Sphere upon clicking with a mouse

```js
const sphereClone = sphereMesh.clone();
sphereClone.position.copy(highlightSquare.position);
scene.add(sphereClone);
```
