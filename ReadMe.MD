# Hyperbolic Helicoid

Coded using three.js using the parametric geomery to initiate the hyperbolic function

```js
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
let geometry = new ParametricGeometry(Helicoid, 300, 300);
```

[![watch video](/public/hyperbolic.mp4)]
