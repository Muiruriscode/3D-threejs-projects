# Load a model with Animation

Load an FBX model from [Mixamo](https://mixamo.com)

## Set Loading Page

Because the model is big in size a model page is created before the model fully loads

```js
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
```

## Load Model

```js
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

fbxfloader.load("/model3/Run.fbx", function (model) {
  model.scale.set(0.005, 0.005, 0.005); //scale down the model
  //..
});
```

## ADD Animation

```js
mixer = new THREE.AnimationMixer(model);
const clips = model.animations;
const clip = THREE.AnimationClip.findByName(clips, "mixamo.com");
const action = mixer.clipAction(clip);
action.play();
scene.add(model);
```
