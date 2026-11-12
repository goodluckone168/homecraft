// World assembly: island -> pool basin -> house shell -> trees -> furniture.
// Everything the engine needs comes back in one object; all fields are
// optional, so this world only returns the ones it uses.
import { buildIsland } from '@engine/world/terrain.js';
import { buildForest } from '@engine/world/landscape.js';
import { ISLAND, TREES } from './layout.js';
import { defineBlocks, surfaceAt, buildPool, buildShell } from './house.js';
import { furnishRooms } from './rooms.js';

export function build({ grid, layer }) {
  defineBlocks(grid);
  buildIsland(grid, ISLAND, { surfaceAt, corner: 10, wobble: 0 });
  buildPool(grid);
  buildShell(grid);
  const forest = buildForest(grid, layer, TREES);
  const rooms = furnishRooms({ layer });
  return {
    batches: rooms.batches,
    obstacles: rooms.obstacles,
    hotspots: rooms.hotspots,
    bakes: rooms.bakes,
    forest,
  };
}
