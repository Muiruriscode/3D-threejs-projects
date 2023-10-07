export default /* glsl */`
	varying vec3 vPosition;
	varying vec3 vNormal;
	varying vec2 vUv;

	float drawCircle(vec2 position, vec2 center, float radius){
		return step(radius, distance(position, center));
	}

	void main() {
	vec3 color = vec3(1,1,1);
	vec2 myVector = color.xx / vec2(1,1);
	vec2 uv = vUv;

	uv -= vec2(0.5);
	uv *= 2.0; 
	const float RADIUS = 0.4;

	vec3 viewDirection = normalize(cameraPosition - vPosition);
	float fresnel = dot(viewDirection, vNormal);

	vec3 vectorA = vec3(1.0);
	vec3 vectorB = vec3(0.0);
	float dotProduct = dot(vectorA, vectorB);
	
	const vec2 CENTER = vec2(0.5);

	gl_FragColor = vec4( vec3(pow(vUv.x, 2.)), 1.0 );
	gl_FragColor = vec4( vec3(step(0.7, vUv.x)), 1.0 );
	gl_FragColor = vec4( vec3(smoothstep(0.45, 0.55, vUv.x)), 1.0 );
	gl_FragColor = vec4( vec3(length(uv)), 1.0 );
	gl_FragColor = vec4( vec3(step(RADIUS,length(uv))), 1.0 );
	gl_FragColor = vec4( vec3(fract(vUv.x * 10.)), 1.0 );
	gl_FragColor = vec4( vec3(step(0.5, fract(vUv.x * 10.))), 1.0 );
	gl_FragColor = vec4( vec3(step(1., mod(vUv.x * 10., 2.))), 1.0 );
	gl_FragColor = vec4( vec3(mix(0.0, 0.5, vUv.x)), 1.0 );
	gl_FragColor = vec4( vec3(dotProduct), 1.0 );
	gl_FragColor = vec4( vec3(viewDirection), 1.0 );
	gl_FragColor = vec4( vec3(1.- fresnel), 1.0 );

	// line
	gl_FragColor = vec4( vec3(abs(vUv.x - 0.5)), 1.0 );
	gl_FragColor = vec4( vec3(step(0.99, 1.- abs(vUv.x - 0.5)) ), 1.0 );
	// circle
	gl_FragColor = vec4( vec3(1. - step(RADIUS,length(uv))), 1.0 );
	gl_FragColor = vec4( vec3(drawCircle(vUv, vec2(0.5), RADIUS)), 1.0 );
}
`;

// const newFloat = mod(color.x, 2.0)
// clamp(val, min, max)
// abs()
// sin, cos, tan, atan
// step, smoothstep, fract
// dot, cross
// bvec3 isEqual = equal(vec3(1.), vec3(1.));