# Instancing objects

Create multiple objects using instancing. This enables the objects to be renderd faster as the cpu only gives one command and the GPU renders multiple obljects of the same object.

## Mesh

Use te instanced mesh instead ot the mesh in object creation

```js
const mesh = new THREE.InstancedMesh(geometry, material, 10000);
```

Create multiple instances of the object

```js
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
```
