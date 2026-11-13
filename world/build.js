// World assembly: island -> lagoon -> pool basin -> house shell -> trees ->
// indoor furniture -> outdoor scenery. All fields returned by build() are
// optional; we merge the indoor and outdoor scene parts into one set.
import { buildIsland } from '@engine/world/terrain.js';
import { buildForest } from '@engine/world/landscape.js';
import { ISLAND, TREES } from './layout.js?v=20261113b';
import { defineBlocks, surfaceAt, buildLagoon, buildPool, buildShell } from './house.js?v=20261113b';
import { furnishRooms } from './rooms.js?v=20261113b';
import { furnishOutdoors } from './outdoors.js?v=20261113b';

export function build({ grid, layer }) {
  defineBlocks(grid);
  buildIsland(grid, ISLAND, { surfaceAt, corner: 10, wobble: 0 });
  buildLagoon(grid);
  buildPool(grid);
  buildShell(grid);
  const forest = buildForest(grid, layer, TREES);
  const rooms = furnishRooms({ layer });
  const outdoors = furnishOutdoors({ layer });
  return {
    batches: { ...rooms.batches, ...outdoors.batches },
    obstacles: [...rooms.obstacles, ...outdoors.obstacles],
    hotspots: [...rooms.hotspots, ...outdoors.hotspots],
    bakes: [...rooms.bakes, ...outdoors.bakes],
    forest,
  };
}
