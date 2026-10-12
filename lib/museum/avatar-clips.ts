import * as THREE from "three";

/** Portable in-place clips for the downloadable GLB. Runtime gameplay keeps
 * its speed-driven, interruptible pose controller and collision-aware movement. */
export function createAvatarClips(root: THREE.Object3D) {
  return (["Idle", "Walk", "Run", "Interact"] as const).map(name => {
    const duration = name === "Walk" ? .885 : name === "Run" ? .598 : 2;
    const count = 60, times = Array.from({ length: count + 1 }, (_, i) => i / count * duration);
    const tracks: THREE.KeyframeTrack[] = [];
    for (const side of ["L", "R"]) {
      const phaseOffset = side === "L" ? 0 : Math.PI;
      for (const part of ["Thigh", "Shin", "Foot", "UpperArm", "Forearm"]) {
        const node = root.getObjectByName(`${part}.${side}`);
        if (!node) continue;
        const values: number[] = [];
        for (const time of times) {
          const phase = time / duration * Math.PI * 2 + phaseOffset;
          const wave = Math.sin(phase), moving = name === "Walk" || name === "Run";
          const run = name === "Run", reach = name === "Interact" && side === "R" ? Math.sin(Math.PI * time / duration) ** 2 : 0;
          const amplitude = run ? .65 : .44;
          const x = part === "Thigh" ? moving ? wave * amplitude : 0
            : part === "Shin" ? moving ? Math.max(0, -wave) * (run ? 1.05 : .5) : 0
            : part === "Foot" ? moving ? -wave * amplitude * .25 - Math.max(0, -wave) * (run ? 1.05 : .5) * .38 : 0
            : part === "UpperArm" ? (moving ? -wave * amplitude * .7 : 0) - reach * .82
            : -.13 - (run ? .8 : 0) - reach * .65;
          const z = part === "UpperArm" ? (side === "L" ? -.055 : .055) : 0;
          const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, 0, z));
          values.push(q.x, q.y, q.z, q.w);
        }
        tracks.push(new THREE.QuaternionKeyframeTrack(`${node.uuid}.quaternion`, times, values));
      }
    }
    return new THREE.AnimationClip(name, duration, tracks);
  });
}
