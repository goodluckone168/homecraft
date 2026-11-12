export default {
  name: '',
  // 64×64 PNG, 4px arms, ≤ 18000 bytes. docs/avatar.md
  skin: '',
  languages: ['zh', 'en'],
  // weather: { city: '上海', cityEn: 'Shanghai', latitude: 31.23, longitude: 121.47, timezone: 'Asia/Shanghai' },
  weather: null,
  // The Dock, in order: ids of the pages in index.html (data-station), and 'phone'.
  dock: ['blog', 'about', 'house', 'pool', 'bedroom', 'study', 'billiards', 'mailbox', 'phone'],
  mailbox: { endpoint: '', email: '', turnstileSitekey: '' },
  badge: true,
};
