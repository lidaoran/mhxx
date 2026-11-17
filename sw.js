/* MHXX 图鉴 —— 离线缓存 */
const VERSION = 'mhxx-dex-v2.2';

// 页面骨架 + 全部数据（约 4MB，一次下载后完全离线）
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/data.js',
  './js/app.js',

  './data/meta.json',
  './data/labels.json',
  './data/dex_extra.json',
  './data/item_icons.json',
  './data/weapons.json',
  './data/weapon_upg.json',
  './data/wpn_songs.json',
  './data/wpn_gun.json',
  './data/armor.json',
  './data/skills.json',
  './data/jewels.json',
  './data/items.json',
  './data/item_src.json',
  './data/item_use.json',
  './data/recipes.json',
  './data/combo.json',
  './data/quests.json',
  './data/quest_rewards.json',
  './data/monsters.json',
  './data/mon_drops.json',
  './data/maps.json',
  './data/medals.json',
  './data/hhsongs.json',
  './data/bowgun.json',
  './data/kinsects.json',
  './data/peli_weapons.json',
  './data/peli_armor.json',
  './data/peliteam.json',
  './data/hfh.json',
  './data/veggie.json',
  './data/arena.json',
  './data/extra_links.json',

  './img/icon/items.png',
  './img/icon/app-192.png',
  './img/icon/app-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      // 逐个加，单个文件缺失不至于让整个安装失败
      .then(c => Promise.all(CORE.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // 图片量太大（上千张），不做预缓存：用到才存，之后离线可用
  if (/\/img\//.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit))
    );
    return;
  }

  // 其余：缓存优先，缺失则网络并回填
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
