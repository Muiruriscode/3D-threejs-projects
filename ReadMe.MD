# THREE JS MODEL Clone With Animation

An FBX model is used which has animations and is cloned on a plane. Raycaster class is used to enable one to click on a plane an a clone of the model is created.

## Import Model

```js
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
const fbxfloader = new FBXLoader();
bxfloader.load("Punching.fbx", function (model) {});
```

## Get Animation

Get the animations from the model

```js
clips = model.animations;
const mixer = new THREE.AnimationMixer(stagClone);
const clip = THREE.AnimationClip.findByName(clips, "mixamo.com");
const action = mixer.clipAction(clip);
action.play();
```

## Raycaster

Use the raycaster to get intersect point on the plane

```js
raycaster.setFromCamera(mousePosition, camera);
intersects = raycaster.intersectObjects(scene.children);
```

## Clone the model

Clone the model using skeleton utils utility class

```js
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
const stagClone = SkeletonUtils.clone(stag);
```
