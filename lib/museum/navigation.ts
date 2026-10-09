export type Waypoint = { x: number; z: number };

/** A small occupancy grid routes visitors around plinths instead of through them. */
export function museumPath(start: Waypoint, end: Waypoint, blocked: (x: number, z: number) => boolean): Waypoint[] {
  const step = .5, minX = -11, minZ = -29, width = 45, depth = 81;
  const point = (id: number): Waypoint => ({ x: minX + (id % width) * step, z: minZ + Math.floor(id / width) * step });
  const idAt = (p: Waypoint) => Math.max(0, Math.min(depth - 1, Math.round((p.z - minZ) / step))) * width + Math.max(0, Math.min(width - 1, Math.round((p.x - minX) / step)));
  function nearest(p: Waypoint) {
    const first = idAt(p); if (!blocked(point(first).x, point(first).z)) return first;
    let best = first, distance = Infinity;
    for (let id = 0; id < width * depth; id++) {
      const candidate = point(id), d = Math.hypot(candidate.x - p.x, candidate.z - p.z);
      if (d < distance && !blocked(candidate.x, candidate.z)) { best = id; distance = d; }
    }
    return best;
  }
  const origin = nearest(start), goal = nearest(end);
  const open = new Set([origin]), previous = new Map<number, number>(), scores = new Map([[origin, 0]]);
  const heuristic = (id: number) => Math.hypot(point(id).x - point(goal).x, point(id).z - point(goal).z);
  let iterations = 0;
  while (open.size && iterations++ < width * depth) {
    let current = origin, best = Infinity;
    for (const id of open) { const score = (scores.get(id) ?? Infinity) + heuristic(id); if (score < best) { current = id; best = score; } }
    if (current === goal) {
      const path: Waypoint[] = [point(goal)];
      while (previous.has(current)) { current = previous.get(current)!; path.unshift(point(current)); }
      path.shift();
      if (!blocked(end.x, end.z)) path.push(end);
      return path;
    }
    open.delete(current);
    const p = point(current), column = current % width, row = Math.floor(current / width);
    for (const [dx, dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]) {
      const c = column + dx, r = row + dz;
      if (c < 0 || c >= width || r < 0 || r >= depth) continue;
      const next = r * width + c, q = point(next);
      if (blocked(q.x, q.z) || blocked((p.x + q.x) / 2, (p.z + q.z) / 2) || (dx && dz && (blocked(p.x + dx * step, p.z) || blocked(p.x, p.z + dz * step)))) continue;
      const score = (scores.get(current) ?? Infinity) + Math.hypot(dx, dz) * step;
      if (score >= (scores.get(next) ?? Infinity)) continue;
      previous.set(next, current); scores.set(next, score); open.add(next);
    }
  }
  return [];
}
