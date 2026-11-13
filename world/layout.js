// 1 block = 1 m. x east, z south, y up.
// Site layout: a big house with four rooms, a swimming pool, the original
// mailbox / portal, and an east shore with a lagoon, a little island, a
// bridge, a bus stop and a bus. Only data lives here; world/house.js builds
// the ground, world/rooms.js and world/outdoors.js build the props.
export const ISLAND = { x0: -36, x1: 38, z0: -26, z1: 31 };
export const SPAWN = { x: 0.5, z: 18, heading: Math.PI };

// The house: 32 x 24 m, 8 m tall, one walkable level plus a walkable roof.
export const HOUSE = { x0: -16, x1: 16, z0: -18, z1: 6, height: 8 };
export const SHELL = { x0: HOUSE.x0 - 1, x1: HOUSE.x1 + 1, z0: HOUSE.z0 - 1, z1: HOUSE.z1 + 1 };
export const ENTRANCE = { x0: -1, x1: 1 };
export const TERRACE = { x0: -17, x1: 17, z0: 6, z1: 9 };

// A paved plaza just east of the spawn path. It gives the world something to
// look at the moment you land: a basketball court, lamps, benches, planters.
export const PLAZA = { x0: 5, x1: 17, z0: 10, z1: 21 };

// The pool is a real swimmable basin (engine/world/pool.js). bed must be an
// integer because it is used as a block-grid index.
export const POOL = { x0: -14, x1: -2, z0: 10, z1: 18, water: -0.22, bed: -3 };
export const POOL_DECK = { x0: POOL.x0 - 1, x1: POOL.x1 + 1, z0: POOL.z0 - 1, z1: POOL.z1 + 1 };
export const POOL_LADDER = { x0: -3.65, x1: -2.9, z: POOL.z0 + 0.3 };
export const POOL_LAMPS = { xs: [-12, -8, -4], y: -1.1 };

// Interior zones. Bedroom and study sit behind the z = -5 partition; the
// living floor (billiards + lounge) sits in front of it.
export const BEDROOM = { x0: -16, x1: 0, z0: -18, z1: -5 };
export const STUDY = { x0: 0, x1: 16, z0: -18, z1: -5 };
export const BILLIARDS = { x0: -16, x1: 16, z0: -5, z1: 6 };

// ── East shore ──────────────────────────────────────────────────────────────
// landscape.js draws one broad sea sheet at y = -1.08, so clearing the top
// blocks opens water. nav.js only trusts a solid block at y = -1, so the islet
// and the plank bridge keep theirs and stay walkable; the lagoon does not.
export const LAGOON = { x0: 19, x1: 32, z0: 10, z1: 26 };
export const ISLET = { x0: 24, x1: 29, z0: 15, z1: 21 };
export const BRIDGE = { x0: 18, x1: 24, z0: 17, z1: 19 };
export const ROAD = { x0: 18, x1: 34, z0: -6, z1: 0 };
export const BUS_STOP = { x0: 23, x1: 30, z0: -13, z1: -7 };
export const BUS = { x0: 21, x1: 33, z0: -5.6, z1: -2.2 };

// Stations: id must match index.html's data-station AND the hotspot id.
// `at` is where the player stands (about 1.5 m from the object), `look` is
// the point the camera turns toward.
export const STATIONS = [
  { id: 'house', name: '大房子', en: 'The House', icon: 'logo', at: [0.5, 9.2], look: [0.5, 6] },
  { id: 'pool', name: '游泳池', en: 'Pool', icon: 'pool', at: [-8, 8.4], look: [-8, 14] },
  { id: 'bedroom', name: '卧室', en: 'Bedroom', icon: 'heart', at: [-8, -9.4], look: [-8, -12] },
  { id: 'study', name: '书房', en: 'Study', icon: 'writing', at: [8, -9.4], look: [8, -12] },
  { id: 'billiards', name: '台球室', en: 'Billiards', icon: 'coffee', at: [-8, 3.4], look: [-8, 0] },
  { id: 'mailbox', name: '留言', en: 'Mailbox', icon: 'mail', at: [0.5, 23.9], look: [0.5, 25.5] },
  { id: 'portal', name: '传送门', en: 'Portal', icon: 'portal', at: [8, 23.1], look: [8, 25.5] },
  { id: 'island', name: '小岛', en: 'Little Island', icon: 'mountain', at: [26, 16.5], look: [26, 19] },
  { id: 'bridge', name: '桥梁', en: 'The Bridge', icon: 'map', at: [20, 18], look: [24, 18] },
  { id: 'busstop', name: '公交站', en: 'Bus Stop', icon: 'scroll', at: [26.5, -7.5], look: [26.5, -10] },
  { id: 'bus', name: '公交车', en: 'The Bus', icon: 'works', at: [27, -1.2], look: [27, -4] },
];

export const MAILBOX = { x: 0.5, z: 25.5, yaw: Math.PI };
export const PORTAL = { x: 8, z: 25.5, yaw: Math.PI };

// Moved off the east shore so the bus terminus and the lagoon stay clear.
// Two extra trees frame the plaza without blocking the court or the spawn.
export const TREES = [[-30, -10], [-26, 14], [-30, 24], [-24, 2], [-22, -20]];

// Indoor take-off exits toward the front terrace. Harmless when unused.
export const DOORWAY = [{ x: 0.5, y: 1, z: 5 }, { x: 0.5, y: 1.2, z: 8 }];
export const EXIT = { x: 0.5, z: 9 };
