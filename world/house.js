// The house shell, the pool basin, the island surface and the east lagoon,
// built from blocks. The island itself comes from the engine
// (@engine/world/terrain.js).
import { HOUSE, SHELL, ENTRANCE, TERRACE, POOL, POOL_DECK, PLAZA,
  LAGOON, ISLET, BRIDGE, ROAD, BUS_STOP } from './layout.js?v=20261113b';
import { inRect } from '@engine/world/terrain.js';

export function defineBlocks(grid) {
  const interior = (x, z) => x >= HOUSE.x0 && x < HOUSE.x1 && z >= HOUSE.z0 && z < HOUSE.z1;
  // Blackened metal outside, warm wood panelling inside, steel on top.
  const wallTex = (face, x, y, z) => {
    if (face.n[1] === 1) return 'steel';
    if (face.n[1] === -1) return 'black_metal';
    return interior(x + face.n[0], z + face.n[2]) ? 'wood_panel' : 'black_metal';
  };
  grid.define('wood_floor', { tex: { all: 'greige_floor' }, merge: true });
  grid.define('pool_tile', { tex: { all: 'pool_tile' } });
  grid.define('pool_deep', { tex: { all: 'pool_deep' } });
  grid.define('coping', { tex: { top: 'travertine', side: 'pool_tile', bottom: 'pool_tile' } });
  grid.define('wall', { tex: wallTex, merge: true });
  grid.define('roof', { tex: { top: 'roof', side: 'black_metal', bottom: 'wood_panel' }, merge: true });
  grid.define('parapet', { tex: { top: 'steel', side: 'black_metal', bottom: 'black_metal' } });
  grid.define('partition', { tex: { all: 'wood_panel' }, merge: true });
}

// What tops each column of the island: floors, decks, paving, sand and a
// plank bridge, else grass. The lagoon's water cells are cleared afterwards.
export function surfaceAt(x, z) {
  if (inRect(SHELL, x, z)) return 'wood_floor';
  if (inRect(TERRACE, x, z)) return 'deck';
  if (inRect(POOL_DECK, x, z)) return 'travertine';
  if (inRect(ISLET, x, z)) return 'sand';
  if (inRect(BRIDGE, x, z)) return 'deck';
  if (inRect(PLAZA, x, z)) return 'concrete';
  if (inRect(ROAD, x, z) || inRect(BUS_STOP, x, z)) return 'pavers';
  if (x >= -2 && x < 3 && z >= 6 && z < 24) return 'pavers';
  return 'grass';
}

export function buildPool(grid) {
  for (let x = POOL.x0 - 1; x <= POOL.x1; x++) for (let z = POOL.z0 - 1; z <= POOL.z1; z++) {
    const inside = x >= POOL.x0 && x < POOL.x1 && z >= POOL.z0 && z < POOL.z1;
    for (let y = POOL.bed - 2; y < 0; y++) {
      if (inside) grid.set(x, y, z, y < POOL.bed ? 'pool_deep' : null);
      else grid.set(x, y, z, y === -1 ? 'coping' : 'pool_tile');
    }
  }
}

// Carve the lagoon out of the island so the engine's sea sheet (y = -1.08)
// shows through. The islet keeps its column; the bridge keeps only its top
// deck block so nav.js still sees solid ground at y = -1 and water below.
export function buildLagoon(grid) {
  for (let x = LAGOON.x0; x < LAGOON.x1; x++) for (let z = LAGOON.z0; z < LAGOON.z1; z++) {
    if (inRect(ISLET, x, z)) continue;
    const deck = inRect(BRIDGE, x, z);
    for (let y = deck ? -2 : -1; y >= -8; y--) grid.set(x, y, z, null);
  }
}

// A band of glazing at y = 3..5, with a 2 m wide, 3 m tall front door.
const pane = (i, y) => y >= 3 && y < 6 && i % 5 !== 0;

function northWall(x, y) {
  return pane(x, y) && x > HOUSE.x0 + 1 && x < HOUSE.x1 - 1 ? 'glass' : 'wall';
}
function westWall(z, y) {
  return pane(z, y) && z > HOUSE.z0 + 1 && z < HOUSE.z1 - 1 ? 'glass' : 'wall';
}
function eastWall(z, y) {
  return pane(z, y) && z > HOUSE.z0 + 1 && z < HOUSE.z1 - 1 ? 'glass' : 'wall';
}
function southWall(x, y) {
  if (x >= ENTRANCE.x0 && x < ENTRANCE.x1 && y < 3) return null;
  return pane(x, y) && x > HOUSE.x0 + 1 && x < HOUSE.x1 - 1 ? 'glass' : 'wall';
}

export function buildShell(grid) {
  const { x0, x1, z0, z1, height } = HOUSE;
  // Four walls, each its own group so the engine can hide whichever one is
  // between the camera and the player. Groups starting with "wall" keep their
  // glass visible when hidden.
  for (let y = 0; y < height; y++) {
    for (let x = x0 - 1; x <= x1; x++) {
      grid.set(x, y, z0 - 1, northWall(x, y), 'wallN');
      grid.set(x, y, z1, southWall(x, y), 'wallS');
    }
    for (let z = z0; z < z1; z++) {
      grid.set(x0 - 1, y, z, westWall(z, y), 'wallW');
      grid.set(x1, y, z, eastWall(z, y), 'wallE');
    }
  }

  // Walkable roof with a solid perimeter parapet.
  for (let x = x0 - 1; x <= x1; x++) for (let z = z0 - 1; z <= z1; z++) {
    grid.set(x, height, z, 'roof', 'roof');
    const rim = x === x0 - 1 || x === x1 || z === z0 - 1 || z === z1;
    if (rim) grid.set(x, height + 1, z, 'parapet', 'roof');
  }

  // Two partitions split the floor plan:
  //   z = -5  -> bedroom / study behind, living floor in front (two doorways)
  //   x =  0  -> bedroom west, study east (one connecting doorway)
  for (let y = 0; y < 4; y++) {
    for (let x = x0; x < x1; x++) {
      const door = (x >= -8 && x < -6) || (x >= 6 && x < 8);
      grid.set(x, y, -5, door && y < 3 ? null : 'partition');
    }
    for (let z = z0; z < -5; z++) {
      const door = z >= -12 && z < -10;
      grid.set(0, y, z, door && y < 3 ? null : 'partition');
    }
  }
}
