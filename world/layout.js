// 1 block = 1 m. x east, z south, y up.
// Site layout: a big house with four rooms, a swimming pool and the original
// mailbox / portal. Only data lives here; world/house.js builds the shell and
// world/rooms.js builds the furniture.
export const ISLAND = { x0: -36, x1: 38, z0: -26, z1: 31 };
export const SPAWN = { x: 0.5, z: 18, heading: Math.PI };

// The house: 32 x 24 m, 8 m tall, one walkable level plus a walkable roof.
export const HOUSE = { x0: -16, x1: 16, z0: -18, z1: 6, height: 8 };
export const SHELL = { x0: HOUSE.x0 - 1, x1: HOUSE.x1 + 1, z0: HOUSE.z0 - 1, z1: HOUSE.z1 + 1 };
export const ENTRANCE = { x0: -1, x1: 1 };
export const TERRACE = { x0: -17, x1: 17, z0: 6, z1: 9 };

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
];

export const MAILBOX = { x: 0.5, z: 25.5, yaw: Math.PI };
export const PORTAL = { x: 8, z: 25.5, yaw: Math.PI };

export const TREES = [[30, -12], [-26, 14], [28, 14]];

// Indoor take-off exits toward the front terrace. Harmless when unused.
export const DOORWAY = [{ x: 0.5, y: 1, z: 5 }, { x: 0.5, y: 1.2, z: 8 }];
export const EXIT = { x: 0.5, z: 9 };
