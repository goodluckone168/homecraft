export default {
  name: '',
  // 64×64 PNG, 4px arms, ≤ 18000 bytes. docs/avatar.md
  skin: '',
  languages: ['zh', 'en'],
  // weather: { city: '上海', cityEn: 'Shanghai', latitude: 31.23, longitude: 121.47, timezone: 'Asia/Shanghai' },
  weather: null,
  // The Dock, in order: ids of the pages in index.html (data-station), and 'phone'.
  // Eight navigation rooms (modelled on hbljx.github.io) plus one card that
  // links back into every 3D scene. All older cards are still reachable by F
  // in the world and by the data-open links on the "world" card.
  dock: ['navall', 'navdaily', 'navai', 'navlib', 'navmusic', 'navtools', 'navmarket', 'navcommunity', 'world'],
  mailbox: { endpoint: '', email: '', turnstileSitekey: '' },
  badge: true,
};
