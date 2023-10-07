export default /* glsl */`
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;


void main() {
	vPosition = position;
	vNormal = normal;
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

// ModelMatrix: position, rotation, scale of modelViewMatrix
// viewMatrix: position, orientation of camera
// projectionMatrix: aspect ratio and perspective of camera