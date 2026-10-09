import * as THREE from "three";

/** Bounded, static-density light scattering. This is a lightweight cinematic
 * approximation, not a physical participating-media simulation. No fullscreen
 * filters or animation timers are required, including under reduced motion. */
export function createLightShaft(origin: THREE.Vector3, end: THREE.Vector3, radius: number, mobile: boolean) {
  const length = origin.distanceTo(end);
  const material = new THREE.ShaderMaterial({
    uniforms: { inverseWorld: { value: new THREE.Matrix4() }, extent: { value: new THREE.Vector3(radius, length / 2, radius) }, intensity: { value: .65 }, lightColor: { value: new THREE.Color("#f5c58b") } },
    vertexShader: `varying vec3 worldPoint;
      void main() { vec4 world = modelMatrix * vec4(position, 1.0); worldPoint = world.xyz; gl_Position = projectionMatrix * viewMatrix * world; }`,
    fragmentShader: `uniform mat4 inverseWorld; uniform vec3 extent; uniform float intensity; uniform vec3 lightColor; varying vec3 worldPoint;
      void main() {
        vec3 origin = (inverseWorld * vec4(cameraPosition, 1.0)).xyz;
        vec3 direction = normalize((inverseWorld * vec4(normalize(worldPoint - cameraPosition), 0.0)).xyz);
        vec3 inverseDirection = 1.0 / (direction + vec3(0.00001));
        vec3 t0 = (-extent - origin) * inverseDirection, t1 = (extent - origin) * inverseDirection;
        vec3 nearT = min(t0, t1), farT = max(t0, t1);
        float start = max(0.0, max(nearT.x, max(nearT.y, nearT.z)));
        float finish = min(farT.x, min(farT.y, farT.z));
        if (finish <= start) discard;
        float stepSize = (finish - start) / float(STEPS), density = 0.0;
        for (int i = 0; i < STEPS; i++) {
          vec3 p = origin + direction * (start + (float(i) + 0.5) * stepSize);
          float along = clamp((extent.y - p.y) / (extent.y * 2.0), 0.0, 1.0);
          float width = extent.x * (0.19 + along * 0.81);
          float radial = length(p.xz) / width;
          float falloff = exp(-radial * radial * 3.5) * (1.0 - smoothstep(0.55, 1.0, radial));
          float feather = smoothstep(0.0, 0.09, along) * (1.0 - smoothstep(0.76, 1.0, along));
          float variation = 0.94 + 0.06 * sin(p.x * 6.0 + p.y * 2.5 + p.z * 4.0);
          density += falloff * feather * variation * stepSize * 0.027;
        }
        float alpha = clamp(density * intensity, 0.0, 0.22);
        gl_FragColor = vec4(lightColor, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    defines: { STEPS: mobile ? 8 : 16 }, transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(radius * 2, length, radius * 2), material);
  mesh.position.copy(origin).add(end).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), origin.clone().sub(end).normalize());
  mesh.updateMatrixWorld(true); material.uniforms.inverseWorld.value.copy(mesh.matrixWorld).invert();
  return mesh;
}
