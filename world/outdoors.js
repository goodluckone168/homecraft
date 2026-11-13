// East-side outdoor scenes: a plank bridge across the lagoon, a sand islet,
// a bus shelter and a parked city bus. Everything shares one BoxBatch, so the
// whole extension only adds a handful of draw calls.
import * as THREE from 'three';
import { BoxBatch } from '@engine/world/blocks.js';
import { ISLET, BRIDGE, BUS_STOP, BUS, PLAZA } from './layout.js?v=20261113b';

const C = (a, b) => (a + b) / 2;

const L = {
  wood: { tex: 'wood_panel' },
  steel: { tex: 'steel' },
  paint: tint => ({ tex: 'paint', tint }),
  light: (tint, emissive = 1) => ({ tex: 'paint', tint, emissive }),
  glass: (tint = 0x9fd3ff) => ({ tex: 'paint', tint, emissive: 0.25 }),
  rubber: { tex: 'rubber' },
  chrome: { tex: 'chrome' },
  log: { tex: 'log', top: 'log_top' },
  palm: { tex: 'palm' },
  leaves: { tex: 'leaves' },
};

export function furnishOutdoors({ layer }) {
  const B = new BoxBatch(layer);
  const obstacles = [], hotspots = [], bakes = [];
  const foot = (x, z, w, d, level = 0) =>
    obstacles.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2, level });
  const hot = (id, x, y, z, w, h, d) =>
    hotspots.push({ id, box: new THREE.Box3(
      new THREE.Vector3(x - w / 2, y, z - d / 2),
      new THREE.Vector3(x + w / 2, y + h, z + d / 2)) });
  const bake = (id, x, y, z, power, radius) =>
    bakes.push({ id, position: [x, y, z], power, radius, direction: null });

  // ---- Plaza (visible from the spawn point) -------------------------------
  // The concrete comes from surfaceAt() in house.js. These are the props that
  // make the landing area feel built: a basketball court, four lamp posts,
  // benches, planters and a pixel welcome sign. Thin painted lines sit just
  // above y = 0 and carry no collision, so the player can still cross freely.
  const PX = C(PLAZA.x0, PLAZA.x1), PZ = C(PLAZA.z0, PLAZA.z1);
  const chalk = L.light(0xf3ece0, 0.12);
  const court = { x0: 7, x1: 15, z0: 12, z1: 19 };

  // A thin coloured court slab plus painted boundary / centre / key lines.
  B.box(C(court.x0, court.x1), 0.012, C(court.z0, court.z1),
    court.x1 - court.x0, 0.024, court.z1 - court.z0, L.paint(0x9c5f43));
  for (const z of [court.z0 + 0.12, court.z1 - 0.12]) {
    B.box(C(court.x0, court.x1), 0.026, z, court.x1 - court.x0 - 0.2, 0.012, 0.1, chalk);
  }
  for (const x of [court.x0 + 0.12, court.x1 - 0.12, C(court.x0, court.x1)]) {
    B.box(x, 0.026, C(court.z0, court.z1), 0.1, 0.012, court.z1 - court.z0 - 0.2, chalk);
  }
  B.box(C(court.x0, court.x1), 0.026, C(court.z0, court.z1), 1.9, 0.012, 0.09, chalk);
  B.box(C(court.x0, court.x1), 0.026, C(court.z0, court.z1), 0.09, 0.012, 1.9, chalk);

  // Two hoops with a backboard, rim and a short support pole.
  for (const [hx, dir] of [[court.x0 - 0.35, 1], [court.x1 + 0.35, -1]]) {
    B.box(hx, 0, PZ, 0.18, 3.1, 0.18, L.steel);
    B.box(hx + dir * 0.42, 2.65, PZ, 0.1, 0.85, 1.5, L.light(0xf3ece0, 0.18));
    B.box(hx + dir * 0.75, 2.62, PZ, 0.07, 0.07, 0.62, L.paint(0xe2623f));
    for (const dz of [-0.3, 0.3]) B.box(hx + dir * 0.6, 2.62, PZ + dz, 0.36, 0.07, 0.07, L.paint(0xe2623f));
    B.box(hx + dir * 1.05, 2.6, PZ, 0.06, 0.06, 0.5, L.light(0xe8775a, 0.55));
    foot(hx, PZ, 0.5, 0.5);
  }

  // Four lamp posts around the plaza edge.
  for (const [lx, lz] of [[5.4, 11.2], [16.6, 11.2], [5.4, 20.6], [16.6, 20.6]]) {
    B.box(lx, 0, lz, 0.16, 3.5, 0.16, L.steel);
    B.box(lx, 3.5, lz, 0.52, 0.32, 0.52, L.light(0xffdfa8, 0.9));
    bake('plaza-lamp-' + lx + '-' + lz, lx, 3.6, lz, 0.6, 8);
    foot(lx, lz, 0.4, 0.4);
  }

  // Two benches and two planters with low greenery.
  for (const [bx, bz, ry] of [[6.1, PZ, Math.PI / 2], [15.9, PZ, -Math.PI / 2]]) {
    B.box(bx, 0.42, bz, 1.9, 0.13, 0.6, L.wood, { ry });
    B.box(bx, 0.55, bz, 1.9, 0.5, 0.12, L.wood, { ry });
    for (const off of [-0.75, 0.75]) B.box(bx + off * Math.cos(ry), 0, bz - off * Math.sin(ry), 0.12, 0.42, 0.55, L.steel);
    foot(bx, bz, 2.1, 0.8);
  }
  for (const [fx, fz] of [[PLAZA.x0 + 0.9, PLAZA.z0 + 0.9], [PLAZA.x1 - 0.9, PLAZA.z1 - 0.9]]) {
    B.box(fx, 0, fz, 1.1, 0.5, 1.1, L.paint(0x8b6a4b));
    B.box(fx, 0.5, fz, 0.95, 0.12, 0.95, L.paint(0x4c6b3a));
    B.box(fx, 0.62, fz, 0.85, 0.85, 0.85, L.leaves);
    B.box(fx + 0.2, 1.47, fz - 0.15, 0.28, 0.28, 0.28, L.paint(0xe26b6b));
    foot(fx, fz, 1.2, 1.2);
  }

  // A pixel welcome sign facing the spawn path (x ≈ 0.5, z ≈ 18).
  B.box(4.3, 0, 18, 0.18, 2.6, 0.18, L.steel);
  B.box(5.2, 0, 18, 0.18, 2.6, 0.18, L.steel);
  B.box(4.75, 1.9, 18, 2.0, 1.05, 0.16, L.paint(0x245b43));
  for (const [i, ox] of [-0.66, -0.22, 0.22, 0.66].entries()) {
    B.box(4.75 + ox, 2.16, 17.9, 0.3, 0.42 + (i % 2) * 0.2, 0.05, L.light(0xebc775, 0.8));
  }
  B.box(4.75, 1.98, 17.9, 1.6, 0.09, 0.05, L.light(0xf3ece0, 0.6));
  foot(4.75, 18, 2.2, 0.5);
  bake('plaza-sign', 4.75, 2.4, 18, 0.4, 6);

  // ---- Bridge ------------------------------------------------------------
  // The deck block itself lives at y = -1 in the voxel grid (see buildLagoon).
  // Here we add railings, two lamp posts and the clickable hotspot.
  const rz0 = BRIDGE.z0 + 0.14, rz1 = BRIDGE.z1 - 0.14, bridgeLen = BRIDGE.x1 - BRIDGE.x0;
  for (const z of [rz0, rz1]) {
    for (let x = BRIDGE.x0 + 0.3; x < BRIDGE.x1 - 0.1; x += 1.5) B.box(x, 0, z, 0.16, 1.15, 0.16, L.wood);
    B.box(C(BRIDGE.x0, BRIDGE.x1), 1.02, z, bridgeLen - 0.1, 0.12, 0.12, L.wood);
    B.box(C(BRIDGE.x0, BRIDGE.x1), 0.52, z, bridgeLen - 0.1, 0.09, 0.09, L.wood);
  }
  for (const x of [BRIDGE.x0 + 0.45, BRIDGE.x1 - 0.45]) {
    B.box(x, 0, rz0, 0.12, 2.5, 0.12, L.steel);
    B.box(x, 2.5, rz0, 0.36, 0.3, 0.36, L.light(0xffdfa8, 0.85));
    bake('bridge-lamp-' + x, x, 2.6, rz0, 0.55, 7);
  }
  hot('bridge', C(BRIDGE.x0, BRIDGE.x1), 0, C(BRIDGE.z0, BRIDGE.z1), bridgeLen, 1.5, BRIDGE.z1 - BRIDGE.z0);

  // ---- Little island -----------------------------------------------------
  const palm = (x, z, h) => {
    B.box(x, 0, z, 0.4, h, 0.4, L.log);
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      B.box(x + Math.cos(a) * 0.85, h - 0.12, z + Math.sin(a) * 0.85,
        1.7, 0.13, 0.46, L.palm, { ry: -a });
    }
    B.box(x, h - 0.1, z, 0.5, 0.3, 0.5, L.leaves);
    foot(x, z, 0.6, 0.6);
  };
  palm(27.4, 19.7, 3.5);
  palm(25.1, 20.3, 2.8);

  // Bench, parasol, crates and a small beacon. The landing point of the
  // station (26, 16.5) is deliberately kept clear.
  B.box(26, 0, 20.6, 2.2, 0.12, 0.6, L.wood);
  B.box(26, 0.12, 20.34, 2.2, 0.48, 0.1, L.wood);
  for (const x of [25.1, 26.9]) B.box(x, 0, 20.6, 0.12, 0.42, 0.5, L.steel);
  foot(26, 20.6, 2.4, 0.8);

  B.box(28.1, 0, 17.2, 0.14, 2.35, 0.14, L.steel);
  B.box(28.1, 2.35, 17.2, 2.3, 0.16, 2.3, L.paint(0xe8775a));
  B.box(28.1, 2.51, 17.2, 0.3, 0.12, 0.3, L.light(0xffd9a0, 0.5));
  foot(28.1, 17.2, 0.4, 0.4);

  B.box(24.7, 0, 15.9, 0.9, 0.9, 0.9, L.wood);
  B.box(25.0, 0.9, 15.7, 0.6, 0.6, 0.6, L.wood);
  foot(24.8, 15.8, 1.2, 1.2);

  B.box(28.4, 0, 20.2, 0.16, 4.0, 0.16, L.steel);
  B.box(28.4, 4.0, 20.2, 0.5, 0.5, 0.5, L.light(0xffe8b0, 1));
  bake('island-beacon', 28.4, 4.1, 20.2, 0.9, 9);
  hot('island', C(ISLET.x0, ISLET.x1), 0, C(ISLET.z0, ISLET.z1),
    ISLET.x1 - ISLET.x0, 4.4, ISLET.z1 - ISLET.z0);

  // ---- Bus stop ----------------------------------------------------------
  const S = BUS_STOP, sx = C(S.x0, S.x1), sz = C(S.z0, S.z1);
  for (const x of [S.x0 + 0.35, S.x1 - 0.35]) for (const z of [S.z0 + 0.35, S.z1 - 0.35]) {
    B.box(x, 0, z, 0.16, 2.7, 0.16, L.steel);
    foot(x, z, 0.3, 0.3);
  }
  B.box(sx, 2.7, sz, S.x1 - S.x0, 0.18, S.z1 - S.z0, L.paint(0x3f6f8f));
  B.box(sx, 2.9, sz, S.x1 - S.x0 + 0.3, 0.1, S.z1 - S.z0 + 0.3, L.paint(0x2d5570));
  B.box(sx, 0.2, S.z0 + 0.2, S.x1 - S.x0 - 0.9, 2.1, 0.08, L.glass(0xbfe3f2));
  B.box(S.x1 - 1.2, 0.6, S.z0 + 0.3, 1.2, 1.6, 0.1, L.light(0x9fd3ff, 0.4));
  B.box(sx, 0.42, S.z0 + 1.15, 3.2, 0.12, 0.55, L.wood);
  B.box(sx, 0.54, S.z0 + 0.9, 3.2, 0.48, 0.1, L.wood);
  foot(sx, S.z0 + 1.05, 3.4, 0.8);
  B.box(S.x0 + 0.65, 0, S.z1 - 0.45, 0.12, 3.2, 0.12, L.steel);
  B.box(S.x0 + 0.65, 2.5, S.z1 - 0.45, 0.85, 0.62, 0.1, L.light(0x2f7fd0, 0.75));
  B.box(S.x0 + 0.65, 2.7, S.z1 - 0.39, 0.5, 0.1, 0.02, L.light(0xffffff, 1));
  B.box(sx, 2.5, sz, 0.7, 0.1, 0.7, L.light(0xffe8b0, 0.9));
  bake('busstop-lamp', sx, 2.5, sz, 0.8, 8);
  hot('busstop', sx, 0, sz, S.x1 - S.x0, 3.3, S.z1 - S.z0);

  // ---- City bus ----------------------------------------------------------
  const U = BUS, ux = C(U.x0, U.x1), uz = C(U.z0, U.z1), busLen = U.x1 - U.x0, busWide = U.z1 - U.z0;
  for (const x of [U.x0 + 1.3, ux, U.x1 - 1.3]) for (const z of [U.z0 + 0.12, U.z1 - 0.12]) {
    B.box(x, 0.1, z, 0.95, 0.78, 0.3, L.rubber);
    B.box(x, 0.3, z, 0.4, 0.4, 0.32, L.chrome);
  }
  B.box(ux, 0.55, uz, busLen, 1.0, busWide, L.paint(0xe0a12e));
  B.box(ux, 1.55, uz, busLen, 1.1, busWide, L.paint(0xf2c14e));
  B.box(ux, 2.65, uz, busLen, 0.16, busWide - 0.12, L.paint(0xd98c22));
  for (const z of [U.z0 + 0.05, U.z1 - 0.05]) {
    for (let x = U.x0 + 1.0; x < U.x1 - 0.7; x += 1.65) B.box(x, 1.78, z, 1.4, 0.72, 0.06, L.glass());
  }
  B.box(U.x1 - 0.05, 1.75, uz, 0.06, 0.85, 2.6, L.glass(0xcbe9ff));
  for (const z of [U.z0 + 0.5, U.z1 - 0.5]) B.box(U.x1 + 0.02, 1.0, z, 0.08, 0.28, 0.4, L.light(0xfff3c4, 1));
  B.box(U.x1 - 0.04, 2.32, uz, 0.08, 0.34, 1.7, L.light(0xffd166, 0.8));
  B.box(U.x0 + 2.3, 1.05, U.z1 + 0.02, 1.35, 1.9, 0.06, L.paint(0x2f6f9f));
  B.box(U.x0 + 2.3, 1.75, U.z1 + 0.05, 1.15, 0.68, 0.04, L.glass());
  for (const z of [U.z0 + 0.5, U.z1 - 0.5]) B.box(U.x0 - 0.02, 1.0, z, 0.08, 0.28, 0.35, L.light(0xd64545, 0.9));
  foot(ux, uz, busLen, busWide);
  bake('bus-head', U.x1 + 0.5, 1.2, uz, 0.5, 7);
  hot('bus', ux, 0, uz, busLen, 3.0, busWide + 2.6);

  return { batches: { outdoor: B }, obstacles, hotspots, bakes };
}
