/* ==========================================================================
   MHXX DEX — 数据层
   直接读取 web/data 下的原始 JSON，构造索引与各功能模块的行数据。
   与旧版页面完全独立，不改动任何已有文件。
   ========================================================================== */
window.D = (function () {
  'use strict';

  var FILES = [
    'weapons', 'armor', 'jewels', 'items', 'quests', 'monsters', 'skills',
    'recipes', 'weapon_upg', 'quest_rewards', 'mon_drops', 'maps', 'medals',
    'hhsongs', 'bowgun', 'kinsects', 'peli_weapons', 'peli_armor', 'hfh',
    'peliteam', 'veggie', 'arena', 'combo', 'item_src', 'item_use',
    'item_icons', 'labels', 'wpn_gun', 'wpn_songs', 'extra_links', 'meta',
    'dex_extra'
  ];

  var raw = {};
  var X = {};                      // 枚举与补充映射
  var IX = {};                     // id -> 原始行
  var NM = {};                     // id -> 名称
  var cache = {};                  // 模块行缓存
  var ready = false;

  /* ---------------- 载入 ---------------- */
  function loadAll() {
    return Promise.all(FILES.map(function (f) {
      return fetch('data/' + f + '.json', { cache: 'no-cache' })
        .then(function (r) {
          if (!r.ok) throw new Error(f + ' HTTP ' + r.status);
          return r.json();
        })
        .then(function (j) { raw[f] = j; });
    }));
  }

  function index() {
    X = raw.dex_extra || {};
    X.wpnType = X.wpnType || {};
    X.amrPart = X.amrPart || {};
    X.statName = X.statName || {};
    X.getType = X.getType || {};
    X.locGetType = X.locGetType || {};
    X.peliWpnName = X.peliWpnName || {};
    NM.loc = raw.labels.loc || {};
    NM.elem = raw.labels.elem || {};
    NM.skillType = raw.labels.skillType || {};

    function put(key, arr, idAt, nameAt) {
      var m = new Map(), nm = {};
      for (var i = 0; i < arr.length; i++) {
        var r = arr[i], id = r[idAt];
        if (id == null || id <= 0) continue;
        m.set(id, r);
        if (nameAt != null) nm[id] = r[nameAt];
      }
      IX[key] = m; NM[key] = nm;
    }
    put('wpn', raw.weapons, 0, 2);
    put('armor', raw.armor, 0, 2);
    put('jew', raw.jewels, 0, 1);
    put('itm', raw.items, 0, 1);
    put('qst', raw.quests, 0, 1);
    put('mon', raw.monsters, 0, 1);
    put('song', raw.hhsongs, 0, null);
    put('kin', raw.kinsects, 0, 1);
    put('medal', raw.medals, 0, 1);
    put('peliWpn', raw.peli_weapons, 0, null);
    put('peliAmr', raw.peli_armor, 0, 2);
    put('hfh', raw.hfh, 0, 1);
    put('ara', raw.arena, 0, null);
    IX.skl = new Map();
    NM.skl = {};
    for (var i = 0; i < raw.skills.trees.length; i++) {
      var tr = raw.skills.trees[i];
      IX.skl.set(tr[0], tr);
      NM.skl[tr[0]] = tr[1];
    }
  }

  /* ---------------- 图标 ---------------- */
  var SPR = null;
  function sprite() {
    if (!SPR) {
      var ic = raw.item_icons || { cols: 32, cell: 32, index: {} };
      SPR = { cols: ic.cols || 32, cell: ic.cell || 32, index: ic.index || {} };
    }
    return SPR;
  }

  var icon = {
    item: function (id, size) {
      size = size || 24;
      var s = sprite(), idx = s.index[id];
      if (idx == null) return '<i class="placeholder" style="width:' + size + 'px;height:' + size + 'px"></i>';
      var c = idx % s.cols, r = Math.floor(idx / s.cols);
      var k = size / s.cell;
      return '<i class="spr" style="width:' + size + 'px;height:' + size + 'px;' +
        'background-image:url(img/icon/items.png);' +
        'background-size:' + (s.cols * s.cell * k) + 'px auto;' +
        'background-position:' + (-c * s.cell * k) + 'px ' + (-r * s.cell * k) + 'px"></i>';
    },
    wpn: function (w, size, cls) {
      size = size || 24;
      var f = w && w[10];
      if (!f) return '<i class="placeholder" style="width:' + size + 'px;height:' + size + 'px"></i>';
      return '<img class="ic-img ' + (cls || 'w') + '" src="img/w/' + f + '.webp" alt="" loading="lazy" ' +
        'style="width:' + size + 'px;height:' + size + 'px">';
    },
    arm: function (idOrRow, size, cls) {
      size = size || 24;
      var row = Array.isArray(idOrRow) ? idOrRow : IX.armor.get(idOrRow);
      var f = row && row[10];
      if (!f) return '<i class="placeholder" style="width:' + size + 'px;height:' + size + 'px"></i>';
      var w = cls === 'a' ? Math.round(size * .72) : size;
      return '<img class="ic-img ' + (cls || '') + '" src="img/a/' + f + '.webp" alt="" loading="lazy" ' +
        'style="width:' + w + 'px;height:' + size + 'px">';
    },
    mon: function (id, size, cls) {
      size = size || 24;
      return '<img class="ic-img ' + (cls || 'm') + '" src="img/m/' + id + '.webp" alt="" loading="lazy" ' +
        'style="width:' + Math.round(size * 1.15) + 'px;height:' + size + 'px" ' +
        'onerror="this.style.visibility=\'hidden\'">';
    },
    kin: function (k, size, cls) {
      size = size || 24;
      var f = k && k[4];
      if (!f) return '<i class="placeholder" style="width:' + size + 'px;height:' + size + 'px"></i>';
      return '<img class="ic-img ' + (cls || '') + '" src="img/k/' + f + '.webp" alt="" loading="lazy" ' +
        'style="width:' + size + 'px;height:' + size + 'px">';
    },
    pw: function (p, size, cls) {
      size = size || 24;
      var f = p && p[4];
      if (!f) return '<i class="placeholder" style="width:' + size + 'px;height:' + size + 'px"></i>';
      return '<img class="ic-img ' + (cls || '') + '" src="img/pw/' + f + '.webp" alt="" loading="lazy" ' +
        'style="width:' + size + 'px;height:' + size + 'px">';
    },
    pa: function (p, size, cls) {
      size = size || 24;
      var f = p && p[6];
      if (!f) return '<i class="placeholder" style="width:' + size + 'px;height:' + size + 'px"></i>';
      return '<img class="ic-img ' + (cls || '') + '" src="img/pa/' + f + '.webp" alt="" loading="lazy" ' +
        'style="width:' + Math.round(size * .78) + 'px;height:' + size + 'px">';
    },
    medal: function (id, size) {
      size = size || 24;
      return '<img class="ic-img" src="img/i/Awd_' + pad(id, 3) + '.png" alt="" loading="lazy" ' +
        'style="width:' + size + 'px;height:' + size + 'px">';
    },
    stat: function (id, size) {
      size = size || 16;
      if (id === 12) return '<i class="placeholder" style="width:' + size + 'px;height:' + size + 'px"></i>';
      return '<img class="ic-img" src="img/i/Stat_' + pad(id, 2) + '.png" alt="" ' +
        'style="width:' + size + 'px;height:' + size + 'px" onerror="this.style.visibility=\'hidden\'">';
    },
    qst: function (typeId, size) {
      size = size || 16;
      return '<img class="ic-img" src="img/i/Qst_Type_' + typeId + '.png" alt="" ' +
        'style="width:' + size + 'px;height:' + size + 'px" onerror="this.style.visibility=\'hidden\'">';
    },
    note: function (id, size) {
      size = size || 14;
      if (!id || id < 0) return '';
      return '<img class="ic-img" src="img/i/HHNote_' + id + '.png" alt="" ' +
        'style="width:' + size + 'px;height:' + size + 'px">';
    },
    loc: function (id, size) {
      size = size || 32;
      return '<img class="ic-img" src="img/i/Loc_' + pad(id, 2) + '.png" alt="" loading="lazy" ' +
        'style="width:' + size + 'px;height:' + size + 'px">';
    }
  };

  /* ---------------- 工具 ---------------- */
  function pad(n, w) {
    var s = String(n);
    while (s.length < w) s = '0' + s;
    return s;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function fmt(n) {
    if (n == null || n === '' || isNaN(n)) return '—';
    return Number(n).toLocaleString('zh-CN');
  }
  function stripLv(name) {
    return String(name).replace(/\s*-\s*Lv\.\d+$/, '');
  }
  function lvOf(name) {
    var m = String(name).match(/Lv\.(\d+)\s*$/);
    return m ? +m[1] : 0;
  }

  /* 名称 */
  function nameOf(kind, id) {
    if (kind === 'wpn') { var w = IX.wpn.get(id); return w ? w[2] : '#' + id; }
    if (kind === 'peliWpn') {
      return (X.peliWpnName || {})[id] || ('随从武器 #' + id);
    }
    return (NM[kind] && NM[kind][id]) || ('#' + id);
  }

  /* 技能等级：正阈值数组决定等级，负阈值表示负面技能 */
  function skillLevel(tid, pts) {
    var t = IX.skl.get(tid);
    if (!t) return { lv: 0, name: '', pts: pts };
    var pos = t[2].filter(function (x) { return x > 0; });
    var lv = 0;
    for (var i = 0; i < pos.length; i++) if (pts >= pos[i]) lv = i + 1;
    var nm = t[3][lv - 1] || '';
    if (lv === 0 && pts < 0) {
      var neg = t[2].filter(function (x) { return x < 0; }).length;
      var nlv = 0;
      for (var j = 0; j < neg; j++) if (pts <= t[2][j]) nlv = j + 1;
      if (nlv) return { lv: -nlv, name: '负面技能', pts: pts };
    }
    return { lv: lv, name: nm, pts: pts };
  }

  /* 斩味条：14 字符 = 7 段 × 2，顺序紫白蓝绿黄橙赤，显示从赤到紫 */
  var SHARP_COLOR = ['#a878c8', '#e9e6dc', '#4a86cf', '#4fa05a', '#ddc14a', '#dd8b3c', '#c0483c'];
  function sharpBar(s, plus, p1) {
    s = String(s || '');
    if (s.length < 14) return '';
    var vals = [];
    for (var i = 0; i < 7; i++) vals.push((+s.substr(i * 2, 2)) || 0);
    // 匠：把加成加在最顶端已有颜色的下一段
    if (plus > 0 && p1 === 1) {
      var top = 0;
      while (top < 7 && !vals[top]) top++;
      if (top < 7) vals[top] += plus * 10;
      else vals[0] = plus * 10;
    }
    var total = vals.reduce(function (a, b) { return a + b; }, 0) || 1;
    var h = '<div class="sharp">';
    for (var k = 6; k >= 0; k--) {
      if (!vals[k]) continue;
      h += '<i style="width:' + (vals[k] / total * 100).toFixed(2) + '%;background:' + SHARP_COLOR[k] + '"></i>';
    }
    h += '</div>';
    return h;
  }

  function slotDots(n) {
    n = +n || 0;
    if (!n) return '<span class="dim2">—</span>';
    var h = '<span class="slotdots">';
    for (var i = 0; i < n; i++) h += '<i class="f"></i>';
    h += '</span>';
    return h;
  }

  function elemText(elems, raw2) {
    if (!elems || !elems.length) return '';
    return elems.map(function (e) {
      var nm = NM.elem[e[0]] || ('属性' + e[0]);
      return nm + (e[1] ? ' ' + e[1] : '');
    }).join(' / ');
  }

  function elemText2(id, pt) {
    if (!id || id < 0) return '';
    var nm = NM.elem[id] || ('属性' + id);
    return nm + (pt ? ' ' + pt : '');
  }

  /* 防具部位 / 性别 */
  function partName(p) { return X.amrPart[p] || ('部位' + p); }
  function bogName(v) { return v === 1 ? '剑士' : v === 2 ? '枪手' : '共通'; }
  function mofName(v) { return v === 1 ? '男性' : v === 2 ? '女性' : '共通'; }

  /* ---------------- 行构造 ---------------- */
  function build(key) {
    if (cache[key]) return cache[key];
    var rows = BUILD[key] ? BUILD[key]() : [];
    cache[key] = rows;
    return rows;
  }

  var BUILD = {};

  /* 武器 */
  BUILD.wpn = function () {
    var out = [];
    for (var i = 0; i < raw.weapons.length; i++) {
      var w = raw.weapons[i];
      var base = stripLv(w[2]), lv = lvOf(w[2]);
      var elems = (w[5] || []).map(function (e) { return [e[0], e[1]]; });
      out.push({
        _k: 'wpn', id: w[0], type: w[1], name: w[2], base: base, lv: lv,
        rare: w[3], atk: w[4], elems: elems, aff: w[6], def: w[7], slot: w[8],
        sharp: w[9], img: w[10], child: w[11], gl: w[12], axe: w[13],
        notes: w[14] || [], kin: w[15], bow: w[16], bowTypes: w[17] || [],
        reload: w[18], steady: w[19], recoil: w[20], pro: w[21], lvup: w[22],
        p1: w[23], _raw: w,
        hay: (w[2] + ' ' + ((X.wpnType || {})[w[1]] || '') + ' ' + elemText(elems) + ' #' + w[0]).toLowerCase()
      });
    }
    return out;
  };

  /* 防具 */
  BUILD.amr = function () {
    var out = [];
    for (var i = 0; i < raw.armor.length; i++) {
      var a = raw.armor[i];
      var sk = (a[12] || []).map(function (s) {
        return { t: s[0], p: s[1], n: nameOf('skl', s[0]) };
      });
      out.push({
        _k: 'amr', id: a[0], part: a[1], name: a[2], rare: a[3], slot: a[4],
        def: a[5], maxdef: a[6], res: a[7], bog: a[8], mof: a[9],
        img: a[10], price: a[11], skills: sk, _raw: a,
        hay: (a[2] + ' ' + partName(a[1]) + ' ' + bogName(a[8]) + ' ' + mofName(a[9]) + ' ' +
          sk.map(function (x) { return x.n; }).join(' ') + ' #' + a[0]).toLowerCase()
      });
    }
    return out;
  };

  /* 装饰品 */
  BUILD.jew = function () {
    return raw.jewels.map(function (j) {
      var sk = (j[4] || []).map(function (s) {
        return { t: s[0], p: s[1], n: nameOf('skl', s[0]) };
      });
      return {
        _k: 'jew', id: j[0], name: j[1], slot: j[2], price: j[3], skills: sk, _raw: j,
        hay: (j[1] + ' ' + sk.map(function (x) { return x.n; }).join(' ') + ' #' + j[0]).toLowerCase()
      };
    });
  };

  /* 道具 */
  BUILD.itm = function () {
    return raw.items.map(function (t) {
      return {
        _k: 'itm', id: t[0], name: t[1], rare: t[2], max: t[3],
        sell: t[4], buy: t[5], hex: t[6], _raw: t,
        hay: (t[1] + ' ' + t[6] + ' #' + t[0]).toLowerCase()
      };
    });
  };

  /* 调和 */
  BUILD.cbo = function () {
    return raw.combo.map(function (c) {
      return {
        _k: 'cbo', id: c[0], res: c[1], a: c[2], b: c[3], succ: c[4], qty: c[5], _raw: c,
        hay: (nameOf('itm', c[1]) + ' ' + nameOf('itm', c[2]) + ' ' + nameOf('itm', c[3])).toLowerCase()
      };
    });
  };

  /* 技能 */
  BUILD.skl = function () {
    return raw.skills.trees.map(function (t) {
      return {
        _k: 'skl', id: t[0], name: t[1], levels: t[2] || [], eff: t[3] || [],
        desc: (raw.skills.desc || {})[String(t[0])] || '',
        comp: (raw.skills.comp || {})[String(t[0])] || [],
        _raw: t, hay: (t[1] + ' ' + (t[3] || []).join(' ')).toLowerCase()
      };
    });
  };

  /* 任务 */
  BUILD.qst = function () {
    return raw.quests.map(function (q) {
      return {
        _k: 'qst', id: q[0], name: q[1], lv: q[2], type: q[3], key: q[4], loc: q[5],
        goal: q[6], mons: q[7] || [], fee: q[8], time: q[9], reward: q[10],
        hrp: q[11], goal2: q[12], _raw: q,
        hay: (q[1] + ' ' + q[2] + ' ' + q[3] + ' ' + q[5] + ' ' + q[6] + ' #' + q[0]).toLowerCase()
      };
    });
  };

  /* 怪物 */
  BUILD.mon = function () {
    return raw.monsters.map(function (m) {
      return {
        _k: 'mon', id: m[0], name: m[1], weak: m[2] || [], ail: m[3] || [],
        trap: m[4] || [], _raw: m, hay: (m[1] + ' #' + m[0]).toLowerCase()
      };
    });
  };

  /* 地图 */
  BUILD.loc = function () {
    var seen = {}, out = [];
    for (var k in NM.loc) {
      var id = +k;
      out.push({ _k: 'loc', id: id, name: NM.loc[k], _raw: [id], hay: NM.loc[k].toLowerCase() });
      seen[id] = 1;
    }
    out.sort(function (a, b) { return a.id - b.id; });
    return out;
  };

  /* 笛旋律 */
  BUILD.song = function () {
    return raw.hhsongs.map(function (s) {
      return {
        _k: 'song', id: s[0], rank: s[1], notes: s[2] || [], eff: s[3],
        dur: s[4], durM: s[5], eff2: s[6], rel: s[7], relM: s[8],
        cat1: s[9], cat2: s[10], _raw: s,
        hay: (s[3] + ' ' + (s[6] || '') + ' ' + (s[9] || '') + ' #' + s[0]).toLowerCase()
      };
    });
  };

  /* 装填弹药：以武器为单位 */
  BUILD.ammo = function () {
    var out = [];
    var gun = raw.wpn_gun || {};
    for (var k in gun) {
      var w = IX.wpn.get(+k);
      if (!w) continue;
      var list = gun[k].map(function (g) {
        return {
          itm: g[0], load: g[1], loadP: g[2], max: g[3],
          sp: g[4], gap: g[5], name: nameOf('itm', g[0])
        };
      });
      out.push({
        _k: 'ammo', id: +k, w: w, name: w[2], gun: list, _raw: [w],
        hay: (w[2] + ' ' + list.map(function (x) { return x.name; }).join(' ')).toLowerCase()
      });
    }
    out.sort(function (a, b) { return a.id - b.id; });
    return out;
  };

  /* 猎虫 */
  BUILD.kinsect = function () {
    return raw.kinsects.map(function (k) {
      return {
        _k: 'kinsect', id: k[0], name: k[1], type: k[2], rare: k[3], img: k[4],
        bugs: k[5] || [], mats: k[6] || [], ext: k[7] || [], _raw: k,
        hay: (k[1] + ' ' + (k[5] || []).join(' ') + ' #' + k[0]).toLowerCase()
      };
    });
  };

  /* 随从武器 */
  BUILD.peliwpn = function () {
    return raw.peli_weapons.map(function (p) {
      var nm = (X.peliWpnName || {})[p[0]] || ('随从武器 #' + p[0]);
      return {
        _k: 'peliwpn', id: p[0], part: p[1], type: p[2], rare: p[3], img: p[4],
        atkD: p[5], affD: p[6], eleD: p[7], atkI: p[8], affI: p[9], eleI: p[10],
        def: p[11], price: p[12], sharp: p[13], ele: p[14], name: nm, _raw: p,
        hay: (nm + ' ' + p[2] + ' #' + p[0]).toLowerCase()
      };
    });
  };

  /* 随从防具 */
  BUILD.peliamr = function () {
    return raw.peli_armor.map(function (p) {
      return {
        _k: 'peliamr', id: p[0], part: p[1], name: p[2], rare: p[3], def: p[4],
        res: p[5] || [], img: p[6], _raw: p,
        hay: (p[2] + ' #' + p[0]).toLowerCase()
      };
    });
  };

  /* 猛喵队：按 地带 × 等级 展开道具 */
  BUILD.peliteam = function () {
    var out = [], data = (raw.peliteam && raw.peliteam.data) || {};
    var zn = {};
    (raw.peliteam && raw.peliteam.zones || []).forEach(function (z) { zn[z[0]] = z[1]; });
    for (var z in data) {
      for (var rk in data[z]) {
        var arr = data[z][rk] || [];
        for (var i = 0; i < arr.length; i++) {
          var e = arr[i], nm = zn[z] || ('地带' + z);
          out.push({
            _k: 'peliteam', id: '' + z + '-' + rk + '-' + i, zone: z, zoneName: nm,
            rank: rk, itm: e[0], qty: e[1], pct: e[2],
            hay: (nm + ' ' + nameOf('itm', e[0]) + ' ' + rankName(rk)).toLowerCase()
          });
        }
      }
    }
    return out;
  };

  /* 游荡猎人 */
  BUILD.hfh = function () {
    return raw.hfh.map(function (h) {
      return {
        _k: 'hfh', id: h[0], name: h[1], lv: h[2], loc: h[3], succ: h[4], big: h[5],
        fee: h[6], margin: h[7], mons: h[8] || [], items: h[9] || [], _raw: h,
        hay: (h[1] + ' ' + h[2] + ' ' + h[3] + ' #' + h[0]).toLowerCase()
      };
    });
  };

  /* 山菜爷爷 */
  BUILD.vet = function () {
    return raw.veggie.map(function (v, i) {
      return {
        _k: 'vet', id: i + 1, out: v[0], inn: v[1], pct: v[2], loc: v[3], _raw: v,
        hay: (nameOf('itm', v[0]) + ' ' + nameOf('itm', v[1])).toLowerCase()
      };
    });
  };

  /* 斗技大会 */
  BUILD.ara = function () {
    return raw.arena.map(function (a) {
      return {
        _k: 'ara', id: a[0], loc: a[1], reward: a[2], player: a[3],
        tS: a[4], tA: a[5], tB: a[6], mons: a[7] || [], wpns: a[8] || [],
        amrs: a[9] || [], items: a[10] || [], box: a[11] || [], _raw: a,
        hay: (a[1] + ' 斗技 ' + (a[7] || []).map(function (m) { return nameOf('mon', m); }).join(' ')).toLowerCase()
      };
    });
  };

  /* 勋章 */
  BUILD.awd = function () {
    return raw.medals.map(function (m) {
      return { _k: 'awd', id: m[0], name: m[1], desc: m[2], _raw: m, hay: (m[1] + ' ' + m[2]).toLowerCase() };
    });
  };

  /* 等级名 */
  function rankName(rk) {
    return ({ '1': '下位', '2': '上位', '3': 'G级' })[rk] || ('等级 ' + rk);
  }

  /* ---------------- 武器派生关系 ----------------
     weapons.json 是「深度优先前序」序列：w[11] (child) 恰为该节点的直接子节点数。
     用栈回溯即可 100% 精确重建派生树，无需再依据名称里的 Lv 猜测。
     每种武器类型包含若干棵互相独立的派生树；根节点通常可直接生产 (pro > 0)。
     ------------------------------------------------ */
  var WPN_TREE = null;
  function wpnTree() {
    if (WPN_TREE) return WPN_TREE;
    var byType = {};
    raw.weapons.forEach(function (w) {
      (byType[w[1]] = byType[w[1]] || []).push(w);
    });
    var parent = new Map(), kids = new Map(), depth = new Map(),
        last = new Set(), top = new Map(), treeSize = new Map(),
        byId = new Map(), roots = [], trees = {};

    Object.keys(byType).map(Number).sort(function (a, b) { return a - b; }).forEach(function (tp) {
      var arr = byType[tp].slice().sort(function (a, b) { return a[0] - b[0]; });
      var stack = [], rs = [], curRoot = 0;
      arr.forEach(function (w) {
        var id = w[0], c = Math.max(0, w[11] || 0), d;
        byId.set(id, {
          id: id, type: tp, name: w[2], base: stripLv(w[2]), lv: lvOf(w[2]),
          rare: w[3], atk: w[4], elems: w[5] || [], aff: w[6], slot: w[8],
          img: w[10], child: c, pro: w[21], _raw: w
        });
        if (!stack.length) {
          curRoot = id; rs.push(id); roots.push(id);
          parent.set(id, 0); depth.set(id, 0); top.set(id, id);
        } else {
          var p = stack[stack.length - 1];
          parent.set(id, p.id); depth.set(id, p.d + 1); top.set(id, curRoot);
          if (!kids.has(p.id)) kids.set(p.id, []);
          kids.get(p.id).push(id);
          p.left--;
        }
        treeSize.set(curRoot, (treeSize.get(curRoot) || 0) + 1);
        d = depth.get(id);
        if (c > 0) stack.push({ id: id, d: d, left: c });
        while (stack.length && stack[stack.length - 1].left === 0) stack.pop();
      });
      trees[tp] = rs;
    });
    kids.forEach(function (a) { if (a.length) last.add(a[a.length - 1]); });

    // 缩进连线：返回 length = depth-1 的布尔数组，true 表示该层祖先之后仍有兄弟，需画竖线「│」
    function guidesOf(id) {
      var chain = [], x = parent.get(id), g = [];
      while (x) { chain.unshift(x); x = parent.get(x); }
      for (var i = 1; i < chain.length; i++) g.push(!last.has(chain[i]));
      return g;
    }

    WPN_TREE = {
      parent: parent, kids: kids, depth: depth, last: last,
      roots: roots, trees: trees, byId: byId, treeSize: treeSize,
      childrenOf: function (id) { return kids.get(id) || []; },
      isLast: function (id) { return last.has(id); },
      rootOf: function (id) { return top.get(id) || 0; },
      guidesOf: guidesOf
    };
    return WPN_TREE;
  }

  /* ---------------- 各模块统计 ---------------- */
  function stats() {
    return {
      wpn: raw.weapons.length, amr: raw.armor.length, jew: raw.jewels.length,
      itm: raw.items.length, cbo: raw.combo.length, skl: raw.skills.trees.length,
      qst: raw.quests.length, mon: raw.monsters.length, loc: Object.keys(NM.loc).length,
      song: raw.hhsongs.length, ammo: Object.keys(raw.wpn_gun || {}).length,
      kinsect: raw.kinsects.length, peliwpn: raw.peli_weapons.length,
      peliamr: raw.peli_armor.length, peliteam: 0, hfh: raw.hfh.length,
      vet: raw.veggie.length, ara: raw.arena.length, awd: raw.medals.length,
      asb: 0, asf: 0
    };
  }

  /* ---------------- 对外 ---------------- */
  var api = {
    get raw() { return raw; },
    get X() { return X; },
    get IX() { return IX; },
    get ready() { return ready; },
    load: function () {
      return loadAll().then(function () {
        index();
        ready = true;
        return api;
      });
    },
    rows: build,
    name: nameOf,
    icon: icon,
    esc: esc,
    fmt: fmt,
    pad: pad,
    skillLevel: skillLevel,
    sharpBar: sharpBar,
    slotDots: slotDots,
    elemText: elemText,
    elemText2: elemText2,
    partName: partName,
    bogName: bogName,
    mofName: mofName,
    rankName: rankName,
    stripLv: stripLv,
    lvOf: lvOf,
    wpnTree: wpnTree,
    stats: stats,
    labels: function () { return raw.labels; },
    itemIcon: function (id, size) { return icon.item(id, size); },
    // 详情用的小表
    questRewards: function (qid) { return (raw.quest_rewards || {})[String(qid)] || {}; },
    monDrops: function (mid) { return (raw.mon_drops || {})[String(mid)] || {}; },
    mapData: function (lid, rk) {
      var m = (raw.maps && raw.maps.data) || {};
      return (m[String(lid)] || {})[String(rk)] || {};
    },
    itemUse: function (id) { return (raw.item_use || {})[String(id)] || {}; },
    itemSrc: function (id) { return (raw.item_src || {})[String(id)] || {}; },
    recipes: function (prefix, id) { return (raw.recipes || {})[prefix + id] || []; },
    wpnSongs: function (id) { return (raw.wpn_songs || {})[String(id)] || []; },
    wpnGun: function (id) { return (raw.wpn_gun || {})[String(id)] || []; },
    extraLinks: function () { return raw.extra_links || {}; }
  };
  return api;
})();
