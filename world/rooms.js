// Furniture for the five new scenes. Everything is static and goes into one
// BoxBatch, so the whole interior costs only a few draw calls. Baked lights,
// collision footprints and station hotspots are collected here too.
import * as THREE from 'three';
import { BoxBatch } from '@engine/world/blocks.js';
import { HOUSE, POOL, POOL_LADDER, POOL_LAMPS } from './layout.js?v=20261113b';

const L = {
  wood: { tex: 'wood_panel' },
  panel: { tex: 'wood_panel' },
  marble: { tex: 'prada_marble' },
  steel: { tex: 'steel' },
  linen: { tex: 'linen' },
  books: { tex: 'bookshelf', top: 'wood_panel' },
  paint: tint => ({ tex: 'paint', tint }),
  light: (tint, emissive = 1) => ({ tex: 'paint', tint, emissive }),
};

export function furnishRooms({ layer }) {
  // A single batch for every piece of furniture. Grid walls already live in
  // their own groups (wallN/S/E/W, roof) via grid.set's group argument.
  const B = new BoxBatch(layer);
  const obstacles = [], hotspots = [], bakes = [];
  const bake = (id, x, y, z, power, radius, direction = null) =>
    bakes.push({ id, position: [x, y, z], power, radius, direction });
  const foot = (x, z, w, d, level = 0) =>
    obstacles.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2, level });
  const hot = (id, x, y, z, w, h, d) =>
    hotspots.push({ id, box: new THREE.Box3(
      new THREE.Vector3(x - w / 2, y, z - d / 2),
      new THREE.Vector3(x + w / 2, y + h, z + d / 2),
    ) });

  // Pendant lamps hang from the ceiling but stay in the static batch: the
  // engine hides the 'roof' group while the player is indoors.
  const pendant = (x, z, y = 5.2) => {
    B.box(x, y + 0.62, z, 0.04, HOUSE.height - y - 0.62, 0.04, L.steel);
    for (const dx of [-0.19, 0.19]) for (const dz of [-0.19, 0.19])
      B.box(x + dx, y, z + dz, 0.035, 0.62, 0.035, L.steel);
    for (const dy of [0, 0.58]) B.box(x, y + dy, z, 0.42, 0.04, 0.42, L.steel);
    B.box(x, y + 0.06, z, 0.3, 0.48, 0.3, L.light(0xffdfa8));
    bake(`pendant-${x}-${z}`, x, y + 0.2, z, 2.2, 10, [0, -1, 0]);
  };

  // ── The House: entrance, hall and lounge ────────────────────────────────
  for (const x of [-1.05, 1.05]) B.box(x, 0, 6.12, 0.1, 3.1, 0.16, L.steel);
  B.box(0, 3.0, 6.12, 2.2, 0.12, 0.16, L.steel);
  B.box(0, 0.01, 3.2, 5.2, 0.02, 3.0, L.paint(0x8a5a44));
  B.box(0, 0, 4.4, 1.8, 0.85, 0.45, L.wood);
  B.box(0, 0.85, 4.4, 1.9, 0.06, 0.5, L.marble);
  foot(0, 4.4, 2.0, 0.55);
  for (const x of [-13.5, 13.5]) for (const z of [-2, 3]) {
    B.box(x, 0, z, 0.35, HOUSE.height, 0.35, L.steel);
    foot(x, z, 0.4, 0.4);
  }
  // Lounge on the east half of the living floor.
  B.box(9, 0, 0, 3.6, 0.45, 1.2, L.paint(0x2a2d31));
  B.box(9, 0.45, 0.55, 3.6, 0.7, 0.25, L.paint(0x2a2d31));
  for (const x of [7.35, 10.65]) B.box(x, 0.45, 0, 0.25, 0.25, 1.2, L.paint(0x2a2d31));
  foot(9, 0, 3.8, 1.4);
  B.box(9, 0.4, -1.9, 2.0, 0.08, 1.0, L.marble);
  for (const x of [8.2, 9.8]) B.box(x, 0, -1.9, 0.1, 0.4, 0.9, L.steel);
  foot(9, -1.9, 2.1, 1.1);
  B.box(9, 0.6, -4.5, 3.4, 1.8, 0.12, L.light(0x9fd3ff, 0.7));
  bake('lounge-screen', 9, 1.4, -4.3, 0.8, 5, [0, 0, 1]);
  for (const x of [-1.3, 2.3]) {
    B.box(x, 2.28, 6.34, 0.18, 0.52, 0.17, L.steel);
    B.box(x, 2.27, 6.36, 0.13, 0.025, 0.13, L.light(0xffe4ba));
    bake(`entry-sconce-${x}`, x, 2.22, 6.45, 0.85, 5, [0, -1, 0.3]);
  }
  pendant(0, 1.5);
  bake('hall', 0, 3.0, 2.0, 1.6, 10, [0, -1, 0]);
  hot('house', 0, 0, 6.4, 8, 3.4, 1.2);

  // ── Billiards room: table, cue rack, bar counter ───────────────────────
  const tx = -8, tz = 0;
  B.box(tx, 0.75, tz, 4.4, 0.12, 2.4, L.paint(0x2f7d4b));
  for (const z of [tz - 1.18, tz + 1.18]) B.box(tx, 0.87, z, 4.6, 0.1, 0.14, L.wood);
  for (const x of [tx - 2.25, tx + 2.25]) B.box(x, 0.87, tz, 0.14, 0.1, 2.4, L.wood);
  for (const x of [tx - 1.9, tx + 1.9]) for (const z of [tz - 0.9, tz + 0.9])
    B.box(x, 0, z, 0.24, 0.75, 0.24, L.wood);
  foot(tx, tz, 4.8, 2.6);
  for (const x of [tx - 2.2, tx, tx + 2.2]) for (const z of [tz - 1.2, tz + 1.2])
    B.box(x, 0.87, z, 0.24, 0.03, 0.24, L.paint(0x101010));
  const balls = [
    [tx - 1.0, tz, 0xf2c14e], [tx - 0.75, tz - 0.14, 0x2f5d9e], [tx - 0.75, tz + 0.14, 0xb5453c],
    [tx - 0.5, tz - 0.28, 0x6b4a9c], [tx - 0.5, tz, 0xd8802f], [tx - 0.5, tz + 0.28, 0x2c7a55],
    [tx + 0.9, tz + 0.3, 0xf5f2e8],
  ];
  for (const [x, z, c] of balls) B.box(x, 0.88, z, 0.14, 0.14, 0.14, L.light(c, 0.25));
  B.box(-14.2, 0, 2.6, 0.7, 1.7, 0.7, L.panel);
  for (const dx of [-0.2, 0, 0.2]) B.box(-14.2 + dx, 1.5, 2.6, 0.045, 1.3, 0.045, L.wood, { rz: 0.12 });
  foot(-14.2, 2.6, 0.8, 0.8);
  B.box(-14.2, 0, -3.0, 1.0, 1.05, 3.6, L.wood);
  B.box(-14.2, 1.05, -3.0, 1.1, 0.06, 3.7, L.marble);
  foot(-14.2, -3.0, 1.1, 3.7);
  for (const z of [-4.0, -2.0]) {
    B.box(-12.9, 0, z, 0.55, 0.75, 0.55, L.paint(0x1c1f21));
    foot(-12.9, z, 0.6, 0.6);
  }
  pendant(tx, tz);
  bake('billiards', tx, 2.8, tz, 1.2, 7, [0, -1, 0]);
  hot('billiards', tx, 0, tz, 5.0, 1.3, 3.0);

  // ── Bedroom: bed, bedside tables, wardrobe ─────────────────────────────
  const bedX = -8, bedZ = -12;
  B.box(bedX, 0.01, bedZ, 6.4, 0.02, 5.4, L.linen);
  B.box(bedX, 0, bedZ, 3.25, 0.28, 3.15, L.panel);
  B.box(bedX, 0.28, bedZ, 3.1, 0.28, 3.0, L.linen);
  B.box(bedX, 0, bedZ - 1.52, 3.4, 1.02, 0.15, L.paint(0x4a514b));
  B.box(bedX, 0.56, bedZ + 0.38, 3.1, 0.1, 2.05, L.paint(0xbab2a5));
  for (const x of [bedX - 0.76, bedX + 0.76])
    B.box(x, 0.56, bedZ - 0.9, 1.05, 0.17, 0.58, L.linen);
  foot(bedX, bedZ, 3.45, 3.3);
  for (const x of [bedX - 2.4, bedX + 2.4]) {
    B.box(x, 0, bedZ - 0.64, 0.85, 0.64, 0.8, L.panel);
    B.box(x, 0.64, bedZ - 0.64, 0.9, 0.055, 0.85, L.marble);
    B.box(x, 0.7, bedZ - 0.64, 0.11, 0.38, 0.11, L.steel);
    B.box(x, 1.03, bedZ - 0.64, 0.3, 0.11, 0.3, L.light(0xffdfa8));
    foot(x, bedZ - 0.64, 0.95, 0.9);
    bake(`bedside-${x}`, x, 1.06, bedZ - 0.64, 0.75, 3.5);
  }
  B.box(-14.4, 0, -9.0, 1.1, 2.6, 3.4, L.books);
  B.box(-14.4, 2.6, -9.0, 1.2, 0.06, 3.5, L.steel);
  foot(-14.4, -9.0, 1.2, 3.5);
  pendant(bedX, bedZ);
  bake('bedroom', bedX, 2.6, bedZ, 1.0, 6, [0, -1, 0]);
  hot('bedroom', bedX, 0, bedZ, 4.2, 1.4, 3.6);

  // ── Study: desk, monitor, bookshelves, reading corner ───────────────────
  const deskX = 8, deskZ = -12;
  B.box(deskX, 0.01, deskZ + 0.8, 6.0, 0.02, 4.2, L.paint(0x3b4a52));
  B.box(deskX, 0.74, deskZ, 4.2, 0.1, 1.6, L.wood);
  for (const x of [deskX - 1.9, deskX + 1.9]) B.box(x, 0, deskZ, 0.12, 0.74, 1.4, L.steel);
  foot(deskX, deskZ, 4.3, 1.7);
  B.box(deskX, 0.84, deskZ - 0.5, 1.5, 0.9, 0.08, L.light(0x9fd3ff, 0.6));
  B.box(deskX, 0.84, deskZ - 0.5, 1.5, 0.06, 0.1, L.paint(0x1c1f21));
  B.box(deskX, 0.85, deskZ + 0.25, 1.2, 0.03, 0.35, L.paint(0x1f2224));
  B.box(deskX + 1.4, 0.84, deskZ + 0.1, 0.5, 0.08, 0.7, L.paint(0xb5453c));
  B.box(deskX, 0, deskZ + 1.6, 0.7, 0.45, 0.7, L.paint(0x1c1f21));
  B.box(deskX, 0.45, deskZ + 1.92, 0.7, 0.7, 0.12, L.paint(0x1c1f21));
  foot(deskX, deskZ + 1.6, 0.8, 0.8);
  B.box(deskX - 1.6, 0.84, deskZ - 0.4, 0.12, 0.5, 0.12, L.steel);
  B.box(deskX - 1.6, 1.32, deskZ - 0.4, 0.34, 0.1, 0.34, L.light(0xffdfa8));
  bake('desk-lamp', deskX - 1.6, 1.34, deskZ - 0.4, 0.8, 3.5);
  for (const x of [2, 4.2, 6.4, 12.6, 14.8]) {
    B.box(x, 0, -17.2, 1.7, 2.8, 0.65, L.books);
    B.box(x, 2.8, -17.2, 1.8, 0.06, 0.7, L.steel);
    foot(x, -17.2, 1.8, 0.7);
  }
  B.box(13.2, 0.72, -7.6, 1.1, 0.08, 1.1, L.wood);
  B.box(13.2, 0, -7.6, 0.12, 0.72, 0.12, L.steel);
  B.box(14.6, 0, -7.6, 0.9, 0.45, 0.9, L.paint(0x2a2d31));
  B.box(14.6, 0.45, -7.2, 0.9, 0.6, 0.14, L.paint(0x2a2d31));
  foot(14.6, -7.6, 1.0, 1.0);
  pendant(deskX, deskZ);
  bake('study', deskX, 2.6, deskZ, 1.0, 6, [0, -1, 0]);
  hot('study', deskX, 0, deskZ, 4.6, 1.8, 3.2);

  // ── Pool: underwater lamps, ladder, loungers, parasol ──────────────────
  const cx = (POOL.x0 + POOL.x1) / 2, cz = (POOL.z0 + POOL.z1) / 2;
  for (const x of POOL_LAMPS.xs)
    B.box(x, POOL_LAMPS.y - 0.11, POOL.z0 + 0.015, 0.36, 0.22, 0.03, L.light(0xdffcff));
  const silver = L.paint(0xb3c1c3), ladderZ = POOL.z0, ladderX = (POOL_LADDER.x0 + POOL_LADDER.x1) / 2;
  for (const x of [POOL_LADDER.x0, POOL_LADDER.x1]) {
    B.box(x, 0, ladderZ - 0.45, 0.065, 0.9, 0.065, silver);
    B.box(x, 0.87, ladderZ - 0.08, 0.065, 0.065, 0.8, silver);
    B.box(x, -1.65, ladderZ + 0.3, 0.065, 2.52, 0.065, silver);
    B.box(x, -1.7, ladderZ + 0.2, 0.065, 0.08, 0.24, silver);
  }
  for (const y of [-0.15, -0.55, -0.95, -1.35])
    B.box(ladderX, y, ladderZ + 0.3, 0.78, 0.07, 0.13, silver);
  foot(ladderX, ladderZ - 0.45, 0.9, 0.12);
  for (const x of [-11, -5]) {
    B.box(x, 0.1, 19.6, 0.95, 0.35, 2.0, L.paint(0xe8e2d5));
    B.box(x, 0.45, 20.3, 0.95, 0.12, 0.6, L.paint(0xe8e2d5));
    for (const z of [18.9, 20.3]) B.box(x, 0, z, 0.08, 0.1, 1.9, L.steel);
    foot(x, 19.6, 1.0, 2.1);
  }
  B.box(-16, 0, 14, 0.1, 2.6, 0.1, L.steel);
  B.box(-16, 2.55, 14, 3.2, 0.12, 3.2, L.paint(0xe0a96d));
  foot(-16, 14, 0.2, 0.2);
  B.box(-8, 0.7, 19.6, 0.7, 0.06, 0.7, L.wood);
  B.box(-8, 0, 19.6, 0.12, 0.7, 0.12, L.steel);
  foot(-8, 19.6, 0.8, 0.8);
  bake('pool-deck', cx, 1.8, 9.4, 0.8, 6, [0, -1, 0]);
  hot('pool', cx, -0.3, cz, POOL.x1 - POOL.x0, 0.6, POOL.z1 - POOL.z0);

  return { batches: { static: B }, obstacles, hotspots, bakes };
}
