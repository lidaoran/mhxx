/* ==========================================================================
   MHXX DEX — 界面层
   左侧 21 项主目录（对应原 exe 主窗体 21 个按钮），右侧列表 + 详情。
   ========================================================================== */
(function () {
  'use strict';

  var D = window.D;
  var esc = D.esc, fmt = D.fmt, icon = D.icon;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ======================================================================
     目录图标（线性 SVG，统一 24 视窗）
     ====================================================================== */
  var I = {
    wpn: '<path d="M4 20l9-9M14 4l6 6-3 3-6-6z"/><path d="M7 17l-2 2M17 7l-3 3"/>',
    amr: '<path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    jew: '<path d="M6 4h12l3 6-9 10L3 10z"/><path d="M3 10h18M9 4l-3 6 6 10 6-10-3-6"/>',
    itm: '<path d="M9 3h6v4l3 4v9a1 1 0 01-1 1H7a1 1 0 01-1-1v-9l3-4z"/><path d="M8 14h8"/>',
    cbo: '<path d="M8 3h8M9 3v5l-4 9a3 3 0 002.7 4h8.6A3 3 0 0019 17l-4-9V3"/><path d="M7 14h10"/>',
    skl: '<path d="M12 3l2.6 5.6 6.4.8-4.7 4.3 1.3 6.3L12 17.2 6.4 20l1.3-6.3L3 9.4l6.4-.8z"/>',
    qst: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 11h6M9 15h6M9 7h2"/>',
    mon: '<path d="M5 9c0-3 2-5 5-5 1.4 0 2.4.5 3 1 .6-.5 1.6-1 3-1 3 0 4 2 4 5 0 5-2 9-5 9-1 0-1.5-.6-2-1.4-.5.8-1 1.4-2 1.4-3 0-6-4-6-9z"/><path d="M9 10h.01M15 10h.01M12 13c-1 0-1.5.6-1.5 1.2"/>',
    loc: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    song: '<path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>',
    ammo: '<path d="M8 21V9l4-6 4 6v12z"/><path d="M8 13h8M8 17h8"/>',
    kinsect: '<ellipse cx="10" cy="14" rx="4" ry="6"/><path d="M10 8V4M10 20v-1"/><path d="M6 11L3 8M14 11l3-3M6 17l-3 3M14 17l3 3"/><circle cx="18" cy="6" r="2"/>',
    peliwpn: '<path d="M4 19l7-7M12 4l5 5-4 4-5-5z"/><path d="M5 9c-1 1-1 3 0 4M9 5c1-1 3-1 4 0"/>',
    peliamr: '<path d="M12 3l6 2.6v5.6c0 3.8-2.6 6.6-6 7.8-3.4-1.2-6-4-6-7.8V5.6z"/><path d="M12 8v6M9 11h6"/>',
    peliteam: '<path d="M12 4c3.5 0 6 2.3 6 5.5V12c0 4-2.7 7-6 7s-6-3-6-7V9.5C6 6.3 8.5 4 12 4z"/><path d="M7 6L4 3M17 6l3-3M9.5 11h.01M14.5 11h.01M12 14l-1 1h2z"/>',
    hfh: '<path d="M4 13h16M6 13l1-5h10l1 5"/><path d="M8 13v4a2 2 0 002 2h4a2 2 0 002-2v-4"/><path d="M9 8V6a3 3 0 016 0v2"/>',
    vet: '<path d="M5 9h14l-1.5 10h-11z"/><path d="M9 9V7a3 3 0 016 0v2M9 13h6"/>',
    ara: '<path d="M7 4h10v3a5 5 0 01-10 0z"/><path d="M7 5H4v2a3 3 0 003 3M17 5h3v2a3 3 0 01-3 3"/><path d="M12 12v5M9 21h6M10 17h4"/>',
    awd: '<circle cx="12" cy="9" r="5"/><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5"/>',
    asb: '<path d="M4 8l8-4 8 4-8 4z"/><path d="M4 8v8l8 4 8-4V8"/><path d="M12 12v8"/>',
    asf: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>'
  };
  function ic(k, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">' + (I[k] || I.itm) + '</svg>';
  }

  /* ======================================================================
     目录结构：3 列 × 7 项，对应原 exe 主窗体按钮阵列
     ====================================================================== */
  var NAV = [
    {
      g: '图鉴', g2: 'CODEX', keys: ['wpn', 'amr', 'jew', 'itm', 'cbo', 'skl', 'qst']
    },
    {
      g: '狩猎', g2: 'HUNT', keys: ['mon', 'loc', 'song', 'ammo', 'kinsect', 'peliwpn', 'peliamr']
    },
    {
      g: '随从与配装', g2: 'SUPPORT', keys: ['peliteam', 'hfh', 'vet', 'ara', 'awd', 'asb', 'asf']
    }
  ];

  /* ======================================================================
     状态
     ====================================================================== */
  var S = {};
  function st(k) {
    if (!S[k]) S[k] = {
      q: '', f: {}, sel: null, show: 140, sort: null, dir: 1,
      view: k === 'wpn' ? 'tree' : 'table',   // 武器列表默认展示派生树
      treePage: 1, fold: {}, focusRoot: 0
    };
    return S[k];
  }

  var CUR = 'wpn';
  var MODS = {};

  /* ======================================================================
     通用片段
     ====================================================================== */
  function sec(title, body, n) {
    if (!body) return '';
    return '<div class="d-sec"><h4>' + esc(title) +
      (n != null ? '<span class="n">' + n + '</span>' : '') + '</h4>' + body + '</div>';
  }

  function kv(pairs) {
    return '<div class="kvs">' + pairs.map(function (p) {
      var cls = p[2] ? ' ' + p[2] : '';
      return '<div><div class="k">' + esc(p[0]) + '</div><div class="v' + cls + '">' +
        (p[1] == null || p[1] === '' ? '—' : p[1]) + '</div></div>';
    }).join('') + '</div>';
  }

  function hero(o) {
    return '<div class="d-hero">' +
      '<div class="fig' + (o.cls ? ' ' + o.cls : '') + '">' + (o.fig || '') + '</div>' +
      '<div class="meta">' +
      (o.kicker ? '<div class="kicker">' + esc(o.kicker) + '</div>' : '') +
      '<h2>' + esc(o.name || '') + '</h2>' +
      (o.sub ? '<div class="sub">' + o.sub + '</div>' : '') +
      (o.badges && o.badges.length ? '<div class="badges">' + o.badges.map(function (b) {
        if (typeof b !== 'string') return b;
        return b.trim().charAt(0) === '<' ? b : '<span class="badge">' + esc(b) + '</span>';
      }).join('') + '</div>' : '') +
      '</div></div>';
  }

  function relBtn(opt) {
    var tag = opt.tag;
    if (tag != null) tag = String(tag).trim().charAt(0) === '<' ? tag : '<span class="tagn">' + esc(tag) + '</span>';
    return '<button class="rel" data-jump="' + opt.jump + '">' +
      (opt.icon || '') +
      '<span class="nm">' + esc(opt.name) + '</span>' +
      (tag || '') +
      (opt.right != null ? '<span class="qty">' + opt.right + '</span>' : '') +
      '</button>';
  }

  function mini(head, rows, cls) {
    var h = '<table class="mini' + (cls ? ' ' + cls : '') + '"><thead><tr>' + head.map(function (x) {
      return '<th>' + esc(x) + '</th>';
    }).join('') + '</tr></thead><tbody>';
    h += rows.join('');
    h += '</tbody></table>';
    return h;
  }

  function itemRow(itmId, qty, pct) {
    // 素材名称可点击进入道具独立详情页；'#N' 表示该 id 在 items.json 中无对应条目，不做跳转
    var nm = D.name('itm', itmId);
    var link = String(nm).charAt(0) !== '#';
    return '<tr' + (link ? ' class="lnk" data-jump="itm:' + esc(itmId) + '"' : '') + '>' +
      '<td class="ic">' + icon.item(itmId, 18) + '</td>' +
      '<td>' + (link ? '<span class="lnk-tx">' + esc(nm) + '<span class="lnk-ar">›</span></span>' : esc(nm)) + '</td>' +
      (qty != null ? '<td>' + qty + '</td>' : '') +
      (pct != null ? '<td class="numw">' + pct + '%</td>' : '') + '</tr>';
  }

  function sharpBlock(row) {
    var bar = D.sharpBar(row.sharp, row.slot && row.sharp ? 0 : 0, row.p1);
    if (!bar) return '';
    return '<div style="padding:2px 0 4px">' + bar + '</div>';
  }

  /* ======================================================================
     模块定义
     ====================================================================== */

  /* ---------------------------- 武器 ---------------------------- */
  MODS.wpn = {
    title: '武器', en: 'WEAPONS', icon: 'wpn',
    mcols: ['img', 'name', 'rare', 'atk', 'elems'],
    desc: '14 种武器全派生形态 · 攻击 / 属性 / 会心 / 斩味 / 孔位 / 生产与强化素材',
    cols: [
      { k: 'img', h: '', w: 38, th: 'th-icon', img: function (r) { return icon.wpn(r._raw, 32); } },
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'name', h: '武器', w: 210, cls: 'nm' },
      {
        k: 'deriv', h: '派生', w: 96, sort: false, cell: function (r) {
          var T = D.wpnTree(), d = T.depth.get(r.id) || 0;
          return '<span class="pill">' + (d === 0 ? '起点' : '第 ' + (d + 1) + ' 层') + '</span>' +
            (r.child > 1 ? ' <span class="dim2">· ' + r.child + ' 分支</span>' : '');
        }
      },
      { k: 'rare', h: '稀有', w: 42, cls: 'num' },
      { k: 'atk', h: '威力', w: 48, cls: 'num' },
      {
        k: 'elems', h: '属性', w: 90, cell: function (r) {
          var t = D.elemText(r.elems);
          return t ? '<span class="gold">' + esc(t) + '</span>' : '<span class="dim2">无</span>';
        }
      },
      {
        k: 'aff', h: '会心', w: 48, cls: 'num', cell: function (r) {
          return r.aff ? (r.aff > 0 ? '+' : '') + r.aff + '%' : '0%';
        }
      },
      { k: 'def', h: '防御', w: 44, cls: 'num' },
      { k: 'slot', h: '孔', w: 44, cell: function (r) { return D.slotDots(r.slot); } },
      { k: 'sharp', h: '斩味', w: 96, cell: function (r) { return D.sharpBar(r.sharp, 0, r.p1) || '<span class="dim2">—</span>'; } },
      { k: 'pro', h: '生产价', w: 62, cls: 'num' }
    ],
    filters: [
      {
        k: 'type', label: '类型', all: '全部',
        opts: function () {
          var t = D.X.wpnType, out = [];
          for (var i = 1; i <= 14; i++) out.push([String(i), t[i] || ('类型' + i)]);
          return out;
        }
      },
      {
        k: 'final', label: '', all: null, toggle: true,
        opts: function () { return [['1', '仅最终形态']]; }
      }
    ],
    match: function (r, f) {
      if (f.type && r.type !== +f.type) return false;
      if (f.final && r.child !== 0) return false;
      return true;
    },
    detail: detailWpn
  };

  function detailWpn(r) {
    var w = r._raw;
    var tname = D.X.wpnType[r.type] || '';
    var badges = [
      '<span class="badge gold">' + esc(tname) + '</span>',
      '<span class="badge">孔 ' + (r.slot || 0) + '</span>'
    ];
    var body = hero({
      fig: icon.wpn(w, 150), kicker: tname + ' · ' + (r.base || ''), name: r.name,
      sub: 'Lv.' + r.lv + ' · 稀有度 ' + r.rare,
      badges: badges
    });

    var props = [
      ['攻击力', r.atk, 'gold'],
      ['属性', D.elemText(r.elems) || '无属性'],
      ['会心率', (r.aff ? (r.aff > 0 ? '+' : '') + r.aff : '0') + '%'],
      ['防御力', r.def || 0],
      ['孔位', D.slotDots(r.slot)],
      ['生产价', fmt(r.pro)]
    ];
    if (r.type === 8) props.push(['炮击类型', D.labels().shotType[r.gl] || '—']);
    if (r.type === 9 || r.type === 10) props.push(['装着瓶', D.labels().axePhial[r.axe] || '—']);
    if (r.type === 11) props.push(['猎虫类型', D.labels().kinsectType[r.kin - 30] || '—']);
    if (r.type === 12 || r.type === 13) {
      props.push(['装填速度', D.labels().reload[r.reload] || '—']);
      props.push(['后坐力', D.labels().recoil[r.recoil] || '—']);
      props.push(['摇晃', D.labels().steadiness[r.steady] || '—']);
    }
    if (r.type === 14) props.push(['曲射', D.labels().bowShot[r.bow] || '—']);
    body += sec('基本性能', kv(props));

    if (r.sharp) {
      body += sec('斩味', sharpBlock(r) +
        '<div class="sharp-legend"><span>赤</span><span>橙</span><span>黄</span><span>绿</span>' +
        '<span>蓝</span><span>白</span><span>紫</span></div>');
    }

    if (r.type === 6 && r.notes && r.notes[0] > 0) {
      body += sec('音符', '<div style="display:flex;gap:6px;align-items:center">' +
        r.notes.filter(function (n) { return n > 0; }).map(function (n) { return icon.note(n, 26); }).join('') +
        '</div>');
      var songs = D.wpnSongs(r.id);
      if (songs.length) {
        body += sec('可演奏旋律', '<div class="rel-list">' + songs.slice(0, 10).map(function (s) {
          var row = D.IX.song.get(s[0]);
          if (!row) return '';
          return relBtn({
            jump: 'song:' + s[0], icon: icon.note(1, 14),
            name: row[3] || ('旋律 #' + s[0]), tag: row[9] || ''
          });
        }).join('') + '</div>', songs.length);
      }
    }

    if (r.type === 12 || r.type === 13) {
      var gun = D.wpnGun(r.id);
      if (gun.length) {
        body += sec('装填弹药', '<div class="rel-list">' + gun.slice(0, 12).map(function (g) {
          return '<div class="rel"><span class="nm">' + esc(D.name('itm', g[0])) + '</span>' +
            '<span class="qty">装填 ' + g[1] + (g[2] ? ' <span class="gold">+' + g[2] + '</span>' : '') + '</span></div>';
        }).join('') + '</div>', gun.length);
      }
    }

    var mats = D.recipes('w', r.id);
    if (mats.length) {
      body += sec('生产素材', mini(['', '素材', '数量'],
        mats.map(function (m) { return itemRow(m[0], m[1], null); })), mats.length);
    }
    var useUp = (D.raw.weapon_upg || {})[String(r.id)] || [];
    if (useUp.length) {
      body += sec('强化素材', mini(['', '素材', '数量'],
        useUp.map(function (m) { return itemRow(m[0], m[1], null); })), useUp.length);
    }

    // 前后形态（来自精确父子结构）
    var tree = D.wpnTree();
    var p = tree.parent.get(r.id) || 0;
    var kids = tree.childrenOf(r.id);
    var links = [];
    if (p) {
      var pw = tree.byId.get(p);
      if (pw) links.push(relBtn({ jump: 'wpn:' + p, icon: icon.wpn(pw._raw, 20), name: '← ' + pw.name, tag: '前置' }));
    }
    kids.forEach(function (k) {
      var kw = tree.byId.get(k);
      if (kw) links.push(relBtn({ jump: 'wpn:' + k, icon: icon.wpn(kw._raw, 20), name: kw.name, tag: '派生' }));
    });
    if (links.length) body += sec('前后形态', '<div class="rel-list">' + links.join('') + '</div>', links.length);

    return body;
  }

  /* ---------------------------- 防具 ---------------------------- */
  MODS.amr = {
    title: '防具', en: 'ARMOR', icon: 'amr',
    mcols: ['img', 'name', 'part', 'def', 'slot'],
    desc: '头 / 胴 / 腕 / 腰 / 脚 五个部位 · 防御 / 耐性 / 孔位 / 技能点 / 生产素材',
    cols: [
      { k: 'img', h: '', w: 34, th: 'th-icon', img: function (r) { return icon.arm(r.id, 30, 'a'); } },
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'name', h: '防具', w: 200, cls: 'nm' },
      { k: 'part', h: '部位', w: 50, cell: function (r) { return '<span class="pill">' + D.partName(r.part) + '</span>'; } },
      { k: 'rare', h: '稀有', w: 42, cls: 'num' },
      { k: 'slot', h: '孔', w: 42, cell: function (r) { return D.slotDots(r.slot); } },
      { k: 'def', h: '防御', w: 48, cls: 'num' },
      { k: 'maxdef', h: '满防', w: 48, cls: 'num' },
      {
        k: 'res', h: '火/水/雷/冰/龙', w: 128, cell: function (r) {
          return (r.res || []).map(function (v) {
            return '<span class="' + (v > 0 ? 'gold' : v < 0 ? 'dim2' : '') + '">' + (v > 0 ? '+' : '') + v + '</span>';
          }).join(' ');
        }
      },
      { k: 'price', h: '生产价', w: 62, cls: 'num' }
    ],
    filters: [
      {
        k: 'part', label: '部位', all: '全部',
        opts: function () { return [['1', '头'], ['2', '胴'], ['3', '腕'], ['4', '腰'], ['5', '脚']]; }
      },
      {
        k: 'bog', label: '类型', all: '全部',
        opts: function () { return [['1', '剑士'], ['2', '枪手']]; }
      },
      {
        k: 'mof', label: '性别', all: '全部',
        opts: function () { return [['1', '男性'], ['2', '女性']]; }
      }
    ],
    match: function (r, f) {
      if (f.part && r.part !== +f.part) return false;
      if (f.bog && r.bog !== +f.bog) return false;
      if (f.mof && r.mof !== +f.mof) return false;
      return true;
    },
    detail: detailAmr
  };

  function detailAmr(r) {
    var body = hero({
      fig: icon.arm(r.id, 184, 'a'), kicker: D.partName(r.part) + '防具', name: r.name,
      sub: '稀有度 ' + r.rare + ' · ' + D.bogName(r.bog) + ' / ' + D.mofName(r.mof),
      badges: ['<span class="badge">孔 ' + (r.slot || 0) + '</span>',
        '<span class="badge green">防御 ' + r.def + '</span>']
    });
    body += sec('性能', kv([
      ['防御力', r.def, 'gold'],
      ['最大防御', r.maxdef],
      ['孔位', D.slotDots(r.slot)],
      ['生产价', fmt(r.price)],
      ['火耐性', resNum(r.res[0])],
      ['水耐性', resNum(r.res[1])],
      ['雷耐性', resNum(r.res[2])],
      ['冰耐性', resNum(r.res[3])],
      ['龙耐性', resNum(r.res[4])]
    ]));

    if (r.skills.length) {
      body += sec('技能点', '<div class="rel-list">' + r.skills.map(function (s) {
        var lv = D.skillLevel(s.t, s.p);
        return relBtn({
          jump: 'skl:' + s.t, name: s.n,
          tag: (s.p > 0 ? '+' : '') + s.p + (lv.lv ? ' · ' + lv.name : ''),
          right: s.p > 0 ? '<span class="gold">' + (lv.lv || 0) + '</span>' : ''
        });
      }).join('') + '</div>');
    }

    var mats = D.recipes('a', r.id);
    if (mats.length) {
      body += sec('生产素材', mini(['', '素材', '数量'],
        mats.map(function (m) { return itemRow(m[0], m[1], null); })), mats.length);
    }
    return body;
  }

  function resNum(v) {
    if (v == null) return '—';
    return '<span class="' + (v > 0 ? 'green' : v < 0 ? 'red' : '') + '">' + (v > 0 ? '+' : '') + v + '</span>';
  }

  // 负值 / 缺失值统一显示为 —
  function nz(v) {
    return (v == null || v < 0) ? '<span class="dim2">—</span>' : v;
  }

  /* ---------------------------- 装饰品 ---------------------------- */
  MODS.jew = {
    title: '装饰品', en: 'DECORATIONS', icon: 'jew',
    mcols: ['img', 'name', 'slot', 'skills'],
    desc: '全部装饰珠 · 可镶嵌孔位 / 技能点数 / 生产素材',
    cols: [
      { k: 'img', h: '', w: 32, th: 'th-icon', img: function (r) { return icon.item(r.id, 24); } },
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'name', h: '装饰品', w: 210, cls: 'nm' },
      { k: 'slot', h: '孔', w: 56, cell: function (r) { return D.slotDots(r.slot); } },
      { k: 'price', h: '买价', w: 64, cls: 'num' },
      {
        k: 'skills', h: '技能', w: 240, cell: function (r) {
          return r.skills.map(function (s) {
            return esc(s.n) + ' <span class="gold">' + (s.p > 0 ? '+' : '') + s.p + '</span>';
          }).join('　');
        }
      }
    ],
    filters: [
      {
        k: 'slot', label: '孔位', all: '全部',
        opts: function () { return [['1', '1 孔'], ['2', '2 孔'], ['3', '3 孔']]; }
      }
    ],
    match: function (r, f) { return !f.slot || r.slot === +f.slot; },
    detail: function (r) {
      var body = hero({
        fig: icon.item(r.id, 72), kicker: '装饰珠', name: r.name,
        sub: '需要 ' + r.slot + ' 孔 · 买价 ' + fmt(r.price),
        badges: ['<span class="badge gold">' + r.slot + ' 孔</span>']
      });
      body += sec('技能', '<div class="rel-list">' + r.skills.map(function (s) {
        return relBtn({
          jump: 'skl:' + s.t, name: s.n,
          tag: '<span class="' + (s.p > 0 ? 'gold' : 'dim2') + '">' + (s.p > 0 ? '+' : '') + s.p + '</span>'
        });
      }).join('') + '</div>', r.skills.length);
      var mats = D.recipes('j', r.id);
      if (mats.length) {
        body += sec('生产素材', mini(['', '素材', '数量'],
          mats.map(function (m) { return itemRow(m[0], m[1], null); })), mats.length);
      }
      return body;
    }
  };

  /* ---------------------------- 道具 ---------------------------- */
  MODS.itm = {
    title: '道具', en: 'ITEMS', icon: 'itm',
    mcols: ['img', 'name', 'rare', 'max'],
    desc: '全部道具与素材 · 图标 / 稀有度 / 上限 / 买卖价 / 用途与全部获取途径',
    cols: [
      { k: 'img', h: '', w: 32, th: 'th-icon', img: function (r) { return icon.item(r.id, 24); } },
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'name', h: '道具', w: 240, cls: 'nm' },
      { k: 'rare', h: '稀有', w: 42, cls: 'num' },
      { k: 'max', h: '上限', w: 46, cls: 'num' },
      { k: 'sell', h: '卖价', w: 56, cls: 'num' },
      { k: 'buy', h: '买价', w: 56, cls: 'num' }
    ],
    filters: [
      {
        k: 'rare', label: '稀有度', all: '全部',
        opts: function () {
          return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return [String(n), String(n)]; });
        }
      },
      {
        k: 'use', label: '用途', all: '全部',
        opts: function () { return [['w', '可造武器'], ['a', '可造防具'], ['j', '可造装饰珠']]; }
      }
    ],
    match: function (r, f) {
      if (f.rare && r.rare !== +f.rare) return false;
      if (f.use) {
        var u = D.itemUse(r.id);
        if (!(u[f.use] || []).length) return false;
      }
      return true;
    },
    detail: detailItm
  };

  function detailItm(r) {
    var u = D.itemUse(r.id), s = D.itemSrc(r.id);
    var body = hero({
      fig: icon.item(r.id, 68), kicker: '道具', name: r.name,
      sub: '稀有度 ' + r.rare + ' · 持有上限 ' + r.max,
      badges: [
        r.sell ? '<span class="badge">卖 ' + fmt(r.sell) + 'z</span>' : '',
        r.buy ? '<span class="badge">买 ' + fmt(r.buy) + 'z</span>' : ''
      ].filter(Boolean)
    });
    body += sec('基本', kv([
      ['稀有度', r.rare], ['持有上限', r.max],
      ['卖价', fmt(r.sell)], ['买价', fmt(r.buy)]
    ]));

    // 用途：造装备
    var uses = [];
    (u.w || []).forEach(function (x) { uses.push(['wpn', x[0], x[1]]); });
    (u.a || []).forEach(function (x) { uses.push(['amr', x[0], x[1]]); });
    (u.j || []).forEach(function (x) { uses.push(['jew', x[0], x[1]]); });
    if (uses.length) {
      body += sec('用途 · 生产装备', '<div class="rel-list">' + uses.slice(0, 14).map(function (x) {
        var kind = x[0], id = +String(x[1]).replace(/\D/g, '');
        var nm = kind === 'wpn' ? D.name('wpn', id) : kind === 'amr' ? D.name('armor', id) : D.name('jew', id);
        var ic2 = kind === 'wpn' ? icon.wpn(D.IX.wpn.get(id), 20)
          : kind === 'amr' ? icon.arm(id, 20, 'a') : icon.item(id, 18);
        return relBtn({ jump: kind + ':' + id, icon: ic2, name: nm, tag: kind === 'wpn' ? '武器' : kind === 'amr' ? '防具' : '装饰珠' });
      }).join('') + '</div>', uses.length);
    }

    // 来源：怪物
    if ((s.m || []).length) {
      var monRows = {};
      (s.m || []).forEach(function (x) {
        var k = x[0] + '|' + x[1];
        if (!monRows[k] || monRows[k].pct < x[3]) monRows[k] = { mon: x[0], rank: x[1], way: x[2], pct: x[3] };
      });
      var list = Object.keys(monRows).map(function (k) { return monRows[k]; })
        .sort(function (a, b) { return b.pct - a.pct; }).slice(0, 10);
      body += sec('来源 · 怪物', '<div class="rel-list">' + list.map(function (x) {
        return relBtn({
          jump: 'mon:' + x.mon, icon: icon.mon(x.mon, 18, 'm'),
          name: D.name('mon', x.mon), tag: D.rankName(x.rank) + ' · ' + (D.X.getType[x.way] || ''),
          right: '<span class="pct">' + x.pct + '%</span>'
        });
      }).join('') + '</div>', (s.m || []).length);
    }

    if ((s.l || []).length) {
      var seen = {};
      var rows = (s.l || []).filter(function (x) {
        var k = x[0]; if (seen[k]) return false; seen[k] = 1; return true;
      }).slice(0, 8);
      body += sec('来源 · 地图采集', '<div class="rel-list">' + rows.map(function (x) {
        return relBtn({
          jump: 'loc:' + x[0], icon: icon.loc(x[0], 20),
          name: D.name('loc', x[0]), tag: D.rankName(x[2]) + ' · 区域 ' + x[1]
        });
      }).join('') + '</div>', (s.l || []).length);
    }

    if ((s.q || []).length) {
      body += sec('来源 · 任务', '<div class="rel-list">' + (s.q || []).slice(0, 8).map(function (qid) {
        var q = D.IX.qst.get(qid);
        return relBtn({ jump: 'qst:' + qid, icon: icon.qst(1, 16), name: q ? q[1] : '#' + qid, tag: q ? q[2] : '' });
      }).join('') + '</div>', (s.q || []).length);
    }

    if ((s.c || []).length) {
      body += sec('调和', '<div class="rel-list">' + (s.c || []).slice(0, 6).map(function (cid) {
        var c = D.IX.itm.get(cid), cb = null;
        D.rows('cbo').some(function (x) { if (x.id === cid) { cb = x; return true; } return false; });
        return relBtn({
          jump: 'cbo:' + cid, icon: icon.item(cid, 18),
          name: cb ? (D.name('itm', cb.res) + ' = ' + D.name('itm', cb.a) + ' + ' + D.name('itm', cb.b)) : ('调和 #' + cid)
        });
      }).join('') + '</div>', (s.c || []).length);
    }

    var other = [];
    if ((s.v || []).length) other.push(['v', '山菜爷爷交换', s.v]);
    if ((s.h || []).length) other.push(['h', '游荡猎人报酬', s.h]);
    if ((s.p || []).length) other.push(['p', '猛喵队报酬', s.p]);
    if ((s.a || []).length) other.push(['a', '斗技大会报酬', s.a]);
    if (other.length) {
      body += sec('其他获取途径', '<div class="rel-list">' + other.map(function (o) {
        return '<div class="rel"><span class="nm">' + o[1] + '</span><span class="qty">' + o[2].length + ' 条</span></div>';
      }).join('') + '</div>');
    }

    if (!uses.length && !(s.m || []).length && !(s.l || []).length) {
      body += sec('说明', '<div style="font-size:11.5px;color:#8b8677;line-height:1.7">' +
        '该道具没有生产用途与采集来源记录，通常为任务专用道具、缴纳品或装饰性物品。</div>');
    }
    return body;
  }

  /* ---------------------------- 调和 ---------------------------- */
  MODS.cbo = {
    title: '调和', en: 'COMBINING', icon: 'cbo',
    mcols: ['img', 'resn', 'succ'],
    desc: '全部调和配方 · 结果 / 材料 A / 材料 B / 成功率 / 产出数量',
    cols: [
      { k: 'res', h: '', w: 32, th: 'th-icon', img: function (r) { return icon.item(r.res, 24); } },
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'resn', h: '结果', w: 220, cls: 'nm', cell: function (r) { return esc(D.name('itm', r.res)); } },
      { k: 'a', h: '材料 A', w: 210, cell: function (r) { return matCell(r.a); } },
      { k: 'b', h: '材料 B', w: 210, cell: function (r) { return matCell(r.b); } },
      { k: 'succ', h: '成功率', w: 62, cls: 'num', cell: function (r) { return '<span class="gold">' + r.succ + '%</span>'; } },
      { k: 'qty', h: '数量', w: 48, cls: 'num' }
    ],
    filters: [],
    match: function () { return true; },
    detail: function (r) {
      var body = hero({
        fig: icon.item(r.res, 68), kicker: '调和配方', name: D.name('itm', r.res),
        sub: '成功率 ' + r.succ + '% · 产出 ' + r.qty + ' 个',
        badges: ['<span class="badge gold">' + r.succ + '%</span>']
      });
      body += sec('材料', '<div class="rel-list">' + [
        relBtn({ jump: 'itm:' + r.a, icon: icon.item(r.a, 24), name: D.name('itm', r.a), tag: '材料 A' }),
        relBtn({ jump: 'itm:' + r.b, icon: icon.item(r.b, 24), name: D.name('itm', r.b), tag: '材料 B' })
      ].join('') + '</div>');
      body += sec('产出', '<div class="rel-list">' + relBtn({
        jump: 'itm:' + r.res, icon: icon.item(r.res, 24), name: D.name('itm', r.res),
        tag: '结果', right: '×' + r.qty
      }) + '</div>');
      return body;
    }
  };

  function matCell(id) {
    return '<span style="display:inline-flex;align-items:center;gap:5px">' +
      icon.item(id, 16) + esc(D.name('itm', id)) + '</span>';
  }

  /* ---------------------------- 技能 ---------------------------- */
  MODS.skl = {
    title: '技能', en: 'SKILLS', icon: 'skl',
    mcols: ['name', 'eff'],
    desc: '技能系统与等级效果 · 发动该技能的防具、装饰珠与冲突技能',
    cols: [
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'name', h: '技能系统', w: 220, cls: 'nm' },
      {
        k: 'lv', h: '等级阈值', w: 190, cell: function (r) {
          var pos = r.levels.filter(function (x) { return x > 0; });
          if (!pos.length) return '<span class="dim2">—</span>';
          return pos.map(function (v, i) {
            return '<span class="pill' + (i === 0 ? ' key' : '') + '">' + v + '</span>';
          }).join(' ');
        }
      },
      {
        k: 'eff', h: '效果', w: 300, cell: function (r) {
          return esc(r.eff.join('　/　')) || '<span class="dim2">—</span>';
        }
      }
    ],
    filters: [],
    match: function () { return true; },
    detail: detailSkl
  };

  function detailSkl(r) {
    var pos = r.levels.filter(function (x) { return x > 0; });
    var neg = r.levels.filter(function (x) { return x < 0; });
    var body = hero({
      fig: ic('skl').replace('<svg', '<svg style="width:34px;height:34px"'),
      kicker: '技能系统', name: r.name, sub: r.desc || '',
      badges: ['<span class="badge">最大 Lv.' + pos.length + '</span>']
    });

    var rows = [];
    if (neg.length) {
      rows.push('<tr><td>负面</td><td class="numw">' + neg.join(' / ') + '</td><td>' +
        esc(r.eff[0] || '') + '</td></tr>');
    }
    pos.forEach(function (v, i) {
      rows.push('<tr><td>Lv.' + (i + 1) + '</td><td class="numw">' + v + '</td><td>' +
        esc(r.eff[i] || '') + '</td></tr>');
    });
    body += sec('等级效果', mini(['等级', '所需点数', '效果'], rows));

    // 拥有该技能的防具
    var arm = D.rows('amr').filter(function (a) {
      return a.skills.some(function (s) { return s.t === r.id && s.p > 0; });
    });
    if (arm.length) {
      body += sec('发动防具', '<div class="rel-list">' + arm.slice(0, 12).map(function (a) {
        var sp = a.skills.filter(function (s) { return s.t === r.id; })[0];
        return relBtn({
          jump: 'amr:' + a.id, icon: icon.arm(a.id, 22, 'a'), name: a.name,
          tag: D.partName(a.part) + ' · +' + sp.p
        });
      }).join('') + '</div>', arm.length);
    }

    var jew = D.rows('jew').filter(function (j) {
      return j.skills.some(function (s) { return s.t === r.id && s.p > 0; });
    });
    if (jew.length) {
      body += sec('装饰珠', '<div class="rel-list">' + jew.slice(0, 10).map(function (j) {
        var sp = j.skills.filter(function (s) { return s.t === r.id; })[0];
        return relBtn({
          jump: 'jew:' + j.id, icon: icon.item(j.id, 18), name: j.name,
          tag: j.slot + ' 孔 · +' + sp.p
        });
      }).join('') + '</div>', jew.length);
    }

    if (r.comp.length) {
      body += sec('冲突技能', '<div class="rel-list">' + r.comp.slice(0, 8).map(function (t) {
        return relBtn({ jump: 'skl:' + t, name: D.name('skl', t), tag: '不可共存' });
      }).join('') + '</div>');
    }
    return body;
  }

  /* ---------------------------- 任务 ---------------------------- */
  MODS.qst = {
    title: '任务', en: 'QUESTS', icon: 'qst',
    mcols: ['name', 'lv', 'type', 'reward'],
    desc: '全部任务 · 等级 / 类型 / 地图 / 目标 / 报酬金 / 报酬素材 / 出现怪物',
    cols: [
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      {
        k: 'lv', h: '等级', w: 68, cell: function (r) {
          return '<span class="pill">' + esc(r.lv) + '</span>';
        }
      },
      { k: 'name', h: '任务', w: 220, cls: 'nm' },
      {
        k: 'key', h: '关键', w: 54, cell: function (r) {
          return r.key === '关键' ? '<span class="pill key">关键</span>' : '<span class="dim2">—</span>';
        }
      },
      {
        k: 'type', h: '类型', w: 76, cell: function (r) {
          var t = qTypeId(r.type);
          return (t ? icon.qst(t, 13) + ' ' : '') + '<span class="dim2">' + esc(r.type) + '</span>';
        }
      },
      { k: 'loc', h: '地图', w: 120 },
      { k: 'goal', h: '目标', w: 240 },
      { k: 'reward', h: '报酬金', w: 62, cls: 'num' },
      { k: 'time', h: '时间', w: 48, cls: 'num' }
    ],
    filters: [
      {
        k: 'rank', label: '等级', all: '全部',
        opts: function () {
          return [['村', '村'], ['集', '集会所'], ['DLC', 'DLC'], ['特', '特殊许可']];
        }
      },
      {
        k: 'type', label: '类型', all: '全部',
        opts: function () {
          return [['采集', '采集'], ['讨伐', '讨伐'], ['狩猎', '狩猎'], ['捕获', '捕获'],
            ['特殊', '特殊'], ['连续狩猎', '连续狩猎'], ['大连续狩猎', '大连续']];
        }
      },
      {
        k: 'g', label: 'G级', all: '全部', toggle: true,
        opts: function () { return [['1', '仅 G 级']]; }
      }
    ],
    match: function (r, f) {
      if (f.rank && r.lv.indexOf(f.rank) < 0) return false;
      if (f.type && r.type !== f.type) return false;
      if (f.g && !/G/.test(r.lv)) return false;
      return true;
    },
    detail: detailQst
  };

  function qTypeId(t) {
    return ({ '采集': 1, '讨伐': 2, '狩猎': 3, '捕获': 4, '特殊': 5, '连续狩猎': 6, '大连续狩猎': 7 })[t] || 0;
  }

  function detailQst(r) {
    var body = hero({
      fig: ic('qst').replace('<svg', '<svg style="width:34px;height:34px"'),
      kicker: r.lv + ' · ' + r.type, name: r.name,
      sub: r.loc || '—',
      badges: [
        r.key === '关键' ? '<span class="badge gold">关键任务</span>' : '',
        '<span class="badge">' + fmt(r.reward) + 'z</span>',
        r.time ? '<span class="badge">' + esc(r.time) + ' 分</span>' : ''
      ].filter(Boolean)
    });

    body += sec('任务信息', kv([
      ['目标', r.goal || '—'],
      ['副目标', r.goal2 || '—'],
      ['受理费', fmt(r.fee)],
      ['报酬金', fmt(r.reward)],
      ['HRP', r.hrp || '—'],
      ['地图', r.loc || '—']
    ]));

    if (r.mons.length) {
      body += sec('出现怪物', '<div class="rel-list">' + r.mons.map(function (m) {
        return relBtn({ jump: 'mon:' + m, icon: icon.mon(m, 20, 'm'), name: D.name('mon', m) });
      }).join('') + '</div>');
    }

    var rw = D.questRewards(r.id);
    var keys = ['A', 'B', 'C', 'D', 'E'];
    var labels = { A: '基本报酬', B: '追加报酬 A', C: '追加报酬 B', D: '破坏报酬', E: '捕获报酬' };
    keys.forEach(function (k) {
      var arr = rw[k];
      if (!arr || !arr.length) return;
      body += sec(labels[k] || k, '<div class="rel-list">' + arr.slice(0, 8).map(function (x) {
        return '<div class="rel" style="cursor:default">' +
          icon.item(x[0], 20) +
          '<span class="nm">' + esc(D.name('itm', x[0])) + '</span>' +
          '<span class="qty">×' + x[1] + '</span>' +
          '<span class="pct">' + x[2] + '%</span></div>';
      }).join('') + '</div>', arr.length);
    });
    return body;
  }

  /* ---------------------------- 怪物 ---------------------------- */
  MODS.mon = {
    title: '怪物', en: 'MONSTERS', icon: 'mon',
    mcols: ['img', 'name', 'weakest'],
    desc: '全部大型怪物 · 部位肉质 / 属性弱点 / 异常耐性 / 陷阱效果 / 各等级掉落素材',
    cols: [
      { k: 'img', h: '', w: 34, th: 'th-icon', img: function (r) { return icon.mon(r.id, 26); } },
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'name', h: '怪物', w: 220, cls: 'nm' },
      {
        k: 'partn', h: '部位', w: 52, cls: 'num', cell: function (r) { return r.weak.length; }
      },
      {
        k: 'weakest', h: '弱点属性', w: 140, cell: function (r) {
          var best = null, bi = -1;
          r.weak.forEach(function (w) {
            (w[5] || []).forEach(function (v, i) {
              if (v > bi) { bi = v; best = i; }
            });
          });
          if (bi <= 0) return '<span class="dim2">—</span>';
          return '<span class="gold">' + (['火', '水', '冰', '雷', '龙'][best] || '') + ' ' + bi + '</span>';
        }
      },
      {
        k: 'best', h: '最高肉质', w: 72, cls: 'num', cell: function (r) {
          var m = 0;
          r.weak.forEach(function (w) { m = Math.max(m, w[2] || 0, w[3] || 0, w[4] || 0); });
          return m || '<span class="dim2">—</span>';
        }
      },
      {
        k: 'drop', h: '掉落素材', w: 60, cls: 'num', cell: function (r) {
          var d = D.monDrops(r.id), n = 0;
          for (var k in d) n += d[k].length;
          return n || '<span class="dim2">—</span>';
        }
      }
    ],
    filters: [],
    match: function () { return true; },
    detail: detailMon
  };

  var ELEM5 = ['火', '水', '冰', '雷', '龙'];

  function detailMon(r) {
    var body = hero({
      fig: icon.mon(r.id, 84), kicker: '大型怪物', name: r.name,
      sub: r.weak.length + ' 个部位 · ' + r.ail.length + ' 种异常 · ' + r.trap.length + ' 种陷阱',
      badges: []
    });

    if (r.weak.length) {
      var rows = r.weak.map(function (w) {
        var res = (w[5] || []).map(function (v, i) {
          return '<td class="' + (v >= 45 ? 'numw' : v >= 25 ? '' : 'w0') + '">' + (v || '—') + '</td>';
        }).join('');
        return '<tr><td>' + esc(w[1] || ('部位' + w[0])) + '</td>' +
          '<td>' + (w[2] || '—') + '</td><td>' + (w[3] || '—') + '</td><td>' + (w[4] || '—') + '</td>' +
          res + '<td>' + (w[6] || '—') + '</td></tr>';
      });
      body += sec('部位肉质', '<div style="overflow-x:auto">' + mini(
        ['部位', '斩', '打', '射'].concat(ELEM5).concat(['气绝']), rows) + '</div>', r.weak.length);
    }

    if (r.ail.length) {
      var ar = r.ail.map(function (a) {
        return '<tr><td style="display:flex;align-items:center;gap:4px">' + icon.stat(a[0], 14) +
          '<span>' + (D.X.statName[a[0]] || ('异常' + a[0])) + '</span></td>' +
          '<td>' + nz(a[1]) + '</td><td>' + nz(a[2]) + '</td><td>' + nz(a[3]) + '</td>' +
          '<td>' + nz(a[4]) + '</td><td class="numw">' + nz(a[5]) + '</td></tr>';
      });
      body += sec('异常耐性', mini(['异常', '初始', '增量', '最大', '持续', '总伤害'], ar));
    }

    if (r.trap.length) {
      var tr = r.trap.map(function (t) {
        return '<tr><td>' + (t[1] === 1 ? '<span class="gold">有效</span>' : '<span class="dim2">无效</span>') + '</td>' +
          '<td>' + nz(t[2]) + '</td><td>' + nz(t[3]) + '</td><td>' + nz(t[4]) + '</td></tr>';
      });
      body += sec('陷阱效果', mini(['效果', '持续', '愤怒时', '疲劳时'], tr));
    }

    var drops = D.monDrops(r.id);
    [3, 2, 1].forEach(function (rk) {
      var arr = drops[String(rk)];
      if (!arr || !arr.length) return;
      var seen = {}, list = [];
      arr.forEach(function (d) {
        if (!seen[d[0]]) { seen[d[0]] = 1; list.push(d); }
      });
      body += sec('掉落 · ' + D.rankName(rk), '<div class="rel-list">' + list.slice(0, 10).map(function (d) {
        return '<div class="rel" style="cursor:default">' + icon.item(d[0], 22) +
          '<span class="nm">' + esc(D.name('itm', d[0])) + '</span>' +
          '<span class="qty">' + (D.X.getType[d[3]] || '') + '</span></div>';
      }).join('') + '</div>', arr.length);
    });

    return body;
  }

  /* ---------------------------- 地图 ---------------------------- */
  MODS.loc = {
    title: '地图', en: 'LOCATIONS', icon: 'loc',
    mcols: ['img', 'name', 'n3'],
    desc: '35 张狩猎场 · 各区域采集素材 / 鱼获 / 矿脉 / 虫点 · 下位 / 上位 / G 级',
    cols: [
      { k: 'img', h: '', w: 56, th: 'th-icon', img: function (r) { return icon.loc(r.id, 42); } },
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'name', h: '地图', w: 240, cls: 'nm' },
      {
        k: 'n1', h: '下位区', w: 64, cls: 'num', cell: function (r) { return areaCount(r.id, 1); }
      },
      {
        k: 'n2', h: '上位区', w: 64, cls: 'num', cell: function (r) { return areaCount(r.id, 2); }
      },
      {
        k: 'n3', h: 'G级区', w: 64, cls: 'num', cell: function (r) { return areaCount(r.id, 3); }
      }
    ],
    filters: [],
    match: function () { return true; },
    detail: detailLoc
  };

  function areaCount(id, rk) {
    var d = D.mapData(id, rk);
    var n = d && d.length ? d.length : 0;
    return n || '<span class="dim2">—</span>';
  }

  function detailLoc(r) {
    var body = hero({
      fig: '<img src="img/i/Loc_' + D.pad(r.id, 2) + '.png" style="width:158px;height:158px;max-width:100%;object-fit:contain" alt="">',
      kicker: '狩猎场', name: r.name,
      sub: '',
      badges: ['<span class="badge">下位 ' + areaCount(r.id, 1) + ' 区</span>',
        '<span class="badge">上位 ' + areaCount(r.id, 2) + ' 区</span>',
        '<span class="badge gold">G级 ' + areaCount(r.id, 3) + ' 区</span>']
    });

    [3, 2, 1].forEach(function (rk) {
      var arr = D.mapData(r.id, rk) || [];
      if (!arr.length) return;
      var h = '';
      arr.slice(0, 12).forEach(function (area) {
        var num = area[0], list = area[1] || [];
        h += '<div style="margin-bottom:7px;background:#fcfbf7;border:1px solid #f1eee4;border-radius:7px;padding:7px 9px">' +
          '<div style="display:flex;align-items:baseline;gap:6px;margin-bottom:5px">' +
          '<span style="font-size:10px;letter-spacing:.6px;color:#a8762a;font-weight:600">区域 ' + num + '</span>' +
          '<span style="font-size:9px;color:#b7b2a4">' + list.length + ' 种</span></div>' +
          '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:2px 8px">' +
          list.slice(0, 10).map(function (x) {
            var way = D.X.locGetType[x[1]] || '';
            return '<span title="' + esc(way) + '" style="display:flex;align-items:center;gap:4px;' +
              'font-size:10.5px;color:#4e4a42;min-width:0">' +
              icon.item(x[0], 15) +
              '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' +
              esc(D.name('itm', x[0])) + '</span></span>';
          }).join('') + '</div></div>';
      });
      body += sec('采集 · ' + D.rankName(rk), h, arr.length + ' 区');
    });
    return body;
  }

  /* ---------------------------- 笛旋律 ---------------------------- */
  MODS.song = {
    title: '笛旋律', en: 'HUNTING HORN', icon: 'song',
    mcols: ['notes', 'eff', 'dur'],
    desc: '狩猎笛旋律 · 音符组合 / 效果 / 持续时间 / 吹笛名人加成 / 重奏效果',
    cols: [
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      {
        k: 'notes', h: '音符', w: 92, cell: function (r) {
          return r.notes.filter(function (n) { return n > 0; }).map(function (n) {
            return icon.note(n, 16);
          }).join(' ') || '<span class="dim2">—</span>';
        }
      },
      { k: 'eff', h: '旋律效果', w: 260, cls: 'nm' },
      { k: 'dur', h: '时长', w: 54, cls: 'num' },
      { k: 'durM', h: '吹笛名人', w: 66, cls: 'num' },
      { k: 'eff2', h: '重奏效果', w: 240 },
      { k: 'rel', h: '重奏时长', w: 66, cls: 'num' },
      { k: 'cat1', h: '分类', w: 62, cell: function (r) { return '<span class="pill">' + esc(r.cat1) + '</span>'; } }
    ],
    filters: [
      {
        k: 'cat', label: '分类', all: '全部',
        opts: function () { return [['攻击类', '攻击'], ['防御类', '防御'], ['回复类', '回复'], ['自身类', '自身'], ['其他类', '其他']]; }
      }
    ],
    match: function (r, f) { return !f.cat || r.cat1 === f.cat; },
    detail: function (r) {
      var body = hero({
        fig: r.notes.filter(function (n) { return n > 0; }).map(function (n) {
          return '<img src="img/i/HHNote_' + n + '.png" style="width:26px;height:26px;margin:1px" alt="">';
        }).join(''),
        kicker: r.cat1 + '旋律', name: r.eff,
        sub: '持续 ' + r.dur + ' 秒 · 吹笛名人 ' + r.durM + ' 秒',
        badges: ['<span class="badge gold">' + r.cat1 + '</span>']
      });
      body += sec('效果', kv([
        ['旋律效果', r.eff],
        ['持续时间', r.dur + ' 秒'],
        ['吹笛名人', r.durM + ' 秒'],
        ['重奏效果', r.eff2 || '—'],
        ['重奏时长', r.rel + ' 秒'],
        ['重奏 · 吹笛名人', r.relM + ' 秒']
      ]));
      var links = (D.extraLinks().song_wpn || {})[String(r.id)] || [];
      if (links.length) {
        body += sec('可用武器', '<div class="rel-list">' + links.slice(0, 12).map(function (x) {
          var w = D.IX.wpn.get(x[0]);
          return relBtn({ jump: 'wpn:' + x[0], icon: w ? icon.wpn(w, 20) : '', name: w ? w[2] : '#' + x[0] });
        }).join('') + '</div>', links.length);
      }
      return body;
    }
  };

  /* ---------------------------- 弩弹药 ---------------------------- */
  MODS.ammo = {
    title: '弩弹药', en: 'BOWGUN AMMO', icon: 'ammo',
    mcols: ['img', 'name', 'n'],
    desc: '轻弩 / 重弩 / 弓 的装填弹药 · 装填数 / 追加装填 / 持有上限 / 特殊射击 / 速射间隔',
    cols: [
      { k: 'img', h: '', w: 32, th: 'th-icon', img: function (r) { return icon.wpn(r.w, 26); } },
      { k: 'id', h: '#', w: 52, cls: 'xs' },
      { k: 'name', h: '武器', w: 230, cls: 'nm' },
      {
        k: 'kind', h: '种类', w: 58, cell: function (r) {
          var t = r.w[1];
          return '<span class="pill">' + (D.X.wpnType[t] || '') + '</span>';
        }
      },
      { k: 'n', h: '弹药种数', w: 76, cls: 'num', cell: function (r) { return r.gun.length; } },
      {
        k: 'main', h: '主要弹药', w: 240, cell: function (r) {
          return r.gun.slice(0, 3).map(function (g) {
            return esc(g.name) + ' <span class="gold">' + g.load + '</span>';
          }).join('　');
        }
      }
    ],
    filters: [
      {
        k: 'type', label: '类型', all: '全部',
        opts: function () { return [['12', '轻弩'], ['13', '重弩'], ['14', '弓']]; }
      }
    ],
    match: function (r, f) { return !f.type || r.w[1] === +f.type; },
    detail: function (r) {
      var body = hero({
        fig: icon.wpn(r.w, 86), kicker: (D.X.wpnType[r.w[1]] || '') + ' · 弹药表', name: r.name,
        sub: r.gun.length + ' 种可装填弹药',
        badges: []
      });
      var rows = r.gun.map(function (g) {
        return '<tr><td class="ic">' + icon.item(g.itm, 18) + '</td>' +
          '<td>' + esc(g.name) + '</td>' +
          '<td>' + (g.load || '—') + '</td>' +
          '<td>' + (g.loadP || '—') + '</td>' +
          '<td>' + (g.max || '—') + '</td>' +
          '<td>' + (g.sp >= 0 ? g.sp : '—') + '</td>' +
          '<td>' + (g.gap > 0 ? (D.labels().rapidGap[g.gap] || g.gap) : '—') + '</td></tr>';
      });
      body += sec('装填弹药', mini(['弹药', '', '装填', '追加', '上限', '特殊', '间隔'], rows, 'wide1'), r.gun.length);
      return body;
    }
  };

  /* ---------------------------- 猎虫 ---------------------------- */
  MODS.kinsect = {
    title: '猎虫', en: 'KINSECTS', icon: 'kinsect',
    mcols: ['img', 'name', 'type'],
    desc: '操虫棍猎虫 · 切断 / 打击类型 · 精华技能 / 虫技能 / 强化素材',
    cols: [
      { k: 'img', h: '', w: 32, th: 'th-icon', img: function (r) { return icon.kin(r._raw, 26); } },
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'name', h: '猎虫', w: 220, cls: 'nm' },
      {
        k: 'type', h: '类型', w: 56, cell: function (r) {
          return '<span class="pill">' + (D.labels().kinsectType[r.type - 30] || r.type) + '</span>';
        }
      },
      { k: 'rare', h: '稀有', w: 48, cls: 'num' },
      {
        k: 'bug', h: '虫技能', w: 260, cell: function (r) {
          return r.bugs.length ? esc(r.bugs.join('、')) : '<span class="dim2">—</span>';
        }
      }
    ],
    filters: [
      {
        k: 'type', label: '类型', all: '全部',
        opts: function () { return [['31', '切断'], ['32', '打击']]; }
      }
    ],
    match: function (r, f) { return !f.type || r.type === +f.type; },
    detail: function (r) {
      var body = hero({
        fig: icon.kin(r._raw, 76), kicker: '猎虫 · ' + (D.labels().kinsectType[r.type - 30] || ''), name: r.name,
        sub: '稀有度 ' + r.rare,
        badges: ['<span class="badge gold">' + (D.labels().kinsectType[r.type - 30] || '') + '</span>']
      });
      if (r.ext.length) {
        body += sec('精华技能', '<div class="rel-list">' + r.ext.slice(0, 10).map(function (x) {
          return '<div class="rel" style="cursor:default"><span class="nm">' + esc(x) + '</span></div>';
        }).join('') + '</div>', r.ext.length);
      }
      if (r.bugs.length) {
        body += sec('虫技能', '<div class="rel-list">' + r.bugs.slice(0, 10).map(function (x) {
          return '<div class="rel" style="cursor:default"><span class="nm">' + esc(x) + '</span></div>';
        }).join('') + '</div>', r.bugs.length);
      }
      if (r.mats.length) {
        body += sec('强化素材', mini(['', '素材', '数量'],
          r.mats.map(function (m) { return itemRow(m[0], m[1], null); })), r.mats.length);
      }
      return body;
    }
  };

  /* ---------------------------- 随从武器 ---------------------------- */
  MODS.peliwpn = {
    title: '随从武器', en: 'PALICO WEAPONS', icon: 'peliwpn',
    mcols: ['img', 'name', 'part', 'atkD'],
    desc: '艾露猫武器 · 切断 / 打击 · 近战与远程攻击力 / 会心 / 属性 / 斩味 / 生产素材',
    cols: [
      { k: 'img', h: '', w: 38, th: 'th-icon', img: function (r) { return icon.pw(r._raw, 32); } },
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'name', h: '随从武器', w: 210, cls: 'nm' },
      {
        k: 'part', h: '类型', w: 52, cell: function (r) {
          return '<span class="pill">' + (D.X.peliPart[r.part] || r.part) + '</span>';
        }
      },
      { k: 'rare', h: '稀有', w: 42, cls: 'num' },
      { k: 'atkD', h: '近战', w: 48, cls: 'num' },
      { k: 'affD', h: '会心', w: 48, cls: 'num', cell: function (r) { return (r.affD > 0 ? '+' : '') + r.affD + '%'; } },
      { k: 'atkI', h: '远程', w: 48, cls: 'num' },
      { k: 'affI', h: '会心', w: 48, cls: 'num', cell: function (r) { return (r.affI > 0 ? '+' : '') + r.affI + '%'; } },
      { k: 'def', h: '防御', w: 44, cls: 'num' },
      { k: 'price', h: '生产价', w: 62, cls: 'num' }
    ],
    filters: [
      {
        k: 'part', label: '类型', all: '全部',
        opts: function () { return [['21', '切断'], ['22', '打击']]; }
      },
      {
        k: 'pt', label: '特性', all: '全部',
        opts: function () { return [['平衡', '平衡'], ['近战特化', '近战特化'], ['回力标特化', '回力标特化']]; }
      }
    ],
    match: function (r, f) {
      if (f.part && r.part !== +f.part) return false;
      if (f.pt && r.type !== f.pt) return false;
      return true;
    },
    detail: function (r) {
      var body = hero({
        fig: icon.pw(r._raw, 150), kicker: '随从武器 · ' + (D.X.peliPart[r.part] || ''), name: r.name,
        sub: '稀有度 ' + r.rare + ' · ' + r.type,
        badges: ['<span class="badge gold">' + esc(r.type) + '</span>']
      });
      body += sec('性能', kv([
        ['近战攻击', r.atkD, 'gold'],
        ['近战会心', (r.affD > 0 ? '+' : '') + r.affD + '%'],
        ['远程攻击', r.atkI],
        ['远程会心', (r.affI > 0 ? '+' : '') + r.affI + '%'],
        ['防御', r.def],
        ['生产价', fmt(r.price)],
        ['属性', D.elemText2(r.ele, r.eleD || r.eleI) || '无'],
        ['类型', D.X.peliPart[r.part] || '']
      ]));
      var mats = (D.extraLinks().peli_wpn || {})[String(r.id)] || [];
      if (mats.length) {
        body += sec('生产素材', mini(['', '素材', '数量'],
          mats.map(function (m) { return itemRow(m[0], m[1], null); })), mats.length);
      }
      return body;
    }
  };

  /* ---------------------------- 随从防具 ---------------------------- */
  MODS.peliamr = {
    title: '随从防具', en: 'PALICO ARMOR', icon: 'peliamr',
    mcols: ['img', 'name', 'part', 'def'],
    desc: '艾露猫防具 · 头 / 胴 / 腕 / 腰 / 脚 · 防御 / 五属性耐性 / 生产素材',
    cols: [
      { k: 'img', h: '', w: 36, th: 'th-icon', img: function (r) { return icon.pa(r._raw, 30); } },
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'name', h: '随从防具', w: 220, cls: 'nm' },
      {
        k: 'part', h: '部位', w: 52, cell: function (r) {
          var m = { 11: '头', 12: '胴', 13: '腕', 14: '腰', 15: '脚' };
          return '<span class="pill">' + (m[r.part] || r.part) + '</span>';
        }
      },
      { k: 'rare', h: '稀有', w: 42, cls: 'num' },
      { k: 'def', h: '防御', w: 48, cls: 'num' },
      {
        k: 'res', h: '火/水/雷/冰/龙', w: 128, cell: function (r) {
          return (r.res || []).map(function (v) {
            return '<span class="' + (v > 0 ? 'gold' : v < 0 ? 'dim2' : '') + '">' + (v > 0 ? '+' : '') + v + '</span>';
          }).join(' ');
        }
      }
    ],
    filters: [
      {
        k: 'part', label: '部位', all: '全部',
        opts: function () { return [['11', '头'], ['12', '胴'], ['13', '腕'], ['14', '腰'], ['15', '脚']]; }
      }
    ],
    match: function (r, f) { return !f.part || r.part === +f.part; },
    detail: function (r) {
      var m = { 11: '头', 12: '胴', 13: '腕', 14: '腰', 15: '脚' };
      var body = hero({
        fig: icon.pa(r._raw, 150), kicker: '随从防具 · ' + (m[r.part] || ''), name: r.name,
        sub: '稀有度 ' + r.rare,
        badges: ['<span class="badge green">防御 ' + r.def + '</span>']
      });
      body += sec('性能', kv([
        ['防御力', r.def, 'gold'],
        ['稀有度', r.rare],
        ['火耐性', resNum(r.res[0])],
        ['水耐性', resNum(r.res[1])],
        ['雷耐性', resNum(r.res[2])],
        ['冰耐性', resNum(r.res[3])],
        ['龙耐性', resNum(r.res[4])],
        ['部位', m[r.part] || '']
      ]));
      var mats = (D.extraLinks().peli_amr || {})[String(r.id)] || [];
      if (mats.length) {
        body += sec('生产素材', mini(['', '素材', '数量'],
          mats.map(function (m2) { return itemRow(m2[0], m2[1], null); })), mats.length);
      }
      return body;
    }
  };

  /* ---------------------------- 猛喵队 ---------------------------- */
  MODS.peliteam = {
    title: '猛喵队', en: 'PALICO TEAM', icon: 'peliteam',
    mcols: ['img', 'zoneName', 'itm', 'pct'],
    desc: '猛喵队探险报酬 · 6 个地带 × 3 个等级 · 素材 / 数量 / 概率',
    cols: [
      { k: 'img', h: '', w: 32, th: 'th-icon', img: function (r) { return icon.item(r.itm, 24); } },
      { k: 'zoneName', h: '地带', w: 96, cell: function (r) { return '<span class="pill">' + esc(r.zoneName) + '</span>'; } },
      { k: 'rank', h: '等级', w: 60, cls: 'num', cell: function (r) { return D.rankName(r.rank); } },
      { k: 'itm', h: '报酬道具', w: 260, cls: 'nm', cell: function (r) { return esc(D.name('itm', r.itm)); } },
      { k: 'qty', h: '数量', w: 52, cls: 'num' },
      { k: 'pct', h: '概率', w: 62, cls: 'num', cell: function (r) { return '<span class="gold">' + r.pct + '%</span>'; } }
    ],
    filters: [
      {
        k: 'zone', label: '地带', all: '全部',
        opts: function () {
          var z = D.raw.peliteam.zones || [];
          return z.map(function (x) { return [String(x[0]), x[1]]; });
        }
      },
      {
        k: 'rank', label: '等级', all: '全部',
        opts: function () { return [['1', '下位'], ['2', '上位'], ['3', 'G级']]; }
      }
    ],
    match: function (r, f) {
      if (f.zone && String(r.zone) !== f.zone) return false;
      if (f.rank && String(r.rank) !== f.rank) return false;
      return true;
    },
    detail: function (r) {
      var body = hero({
        fig: icon.item(r.itm, 68), kicker: r.zoneName + ' · ' + D.rankName(r.rank),
        name: D.name('itm', r.itm), sub: '猛喵队探险报酬',
        badges: ['<span class="badge gold">' + r.pct + '%</span>']
      });
      body += sec('报酬信息', kv([
        ['地带', r.zoneName], ['等级', D.rankName(r.rank)],
        ['数量', r.qty], ['概率', r.pct + '%']
      ]));
      var peers = D.rows('peliteam').filter(function (x) {
        return String(x.zone) === String(r.zone) && String(x.rank) === String(r.rank);
      });
      body += sec('同地带报酬', '<div class="rel-list">' + peers.slice(0, 10).map(function (x) {
        return relBtn({
          jump: 'itm:' + x.itm, icon: icon.item(x.itm, 18), name: D.name('itm', x.itm),
          right: x.pct + '%'
        });
      }).join('') + '</div>', peers.length);
      return body;
    }
  };

  /* ---------------------------- 游荡猎人 ---------------------------- */
  MODS.hfh = {
    title: '游荡猎人', en: 'TRADER', icon: 'hfh',
    mcols: ['name', 'lv', 'succ'],
    desc: '游荡猎人交易 · 任务 / 地图 / 成功率 / 大成功率 / 受理费 / 报酬素材',
    cols: [
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'lv', h: '等级', w: 64, cell: function (r) { return '<span class="pill">' + esc(r.lv) + '</span>'; } },
      { k: 'name', h: '任务', w: 220, cls: 'nm' },
      { k: 'loc', h: '地图', w: 130 },
      { k: 'succ', h: '成功率', w: 62, cls: 'num', cell: function (r) { return '<span class="gold">' + r.succ + '%</span>'; } },
      { k: 'big', h: '大成功', w: 62, cls: 'num', cell: function (r) { return r.big + '%'; } },
      { k: 'fee', h: '受理费', w: 62, cls: 'num' },
      { k: 'margin', h: '追加契约金', w: 82, cls: 'num' }
    ],
    filters: [
      {
        k: 'rank', label: '等级', all: '全部',
        opts: function () { return [['村', '村'], ['集', '集会所'], ['G', 'G级']]; }
      }
    ],
    match: function (r, f) { return !f.rank || r.lv.indexOf(f.rank) >= 0; },
    detail: function (r) {
      var body = hero({
        fig: ic('hfh').replace('<svg', '<svg style="width:34px;height:34px"'),
        kicker: r.lv + ' · ' + (r.loc || ''), name: r.name,
        sub: '成功率 ' + r.succ + '% · 大成功 ' + r.big + '%',
        badges: ['<span class="badge green">' + r.succ + '%</span>',
          '<span class="badge">' + fmt(r.fee) + 'z</span>']
      });
      body += sec('委托信息', kv([
        ['受理费', fmt(r.fee)], ['追加契约金', fmt(r.margin)],
        ['成功率', r.succ + '%'], ['大成功率', r.big + '%'],
        ['地图', r.loc || '—'], ['等级', r.lv]
      ]));
      if (r.mons.length) {
        body += sec('目标怪物', '<div class="rel-list">' + r.mons.map(function (m) {
          return relBtn({ jump: 'mon:' + m, icon: icon.mon(m, 20, 'm'), name: D.name('mon', m) });
        }).join('') + '</div>');
      }
      ['A', 'B', 'C'].forEach(function (tp) {
        var list = r.items.filter(function (x) { return x[3] === tp; });
        if (!list.length) return;
        body += sec(tp + ' 组报酬', '<div class="rel-list">' + list.slice(0, 8).map(function (x) {
          return '<div class="rel" style="cursor:default">' + icon.item(x[0], 20) +
            '<span class="nm">' + esc(D.name('itm', x[0])) + '</span>' +
            '<span class="qty">×' + x[1] + '</span><span class="pct">' + x[2] + '%</span></div>';
        }).join('') + '</div>', list.length);
      });
      return body;
    }
  };

  /* ---------------------------- 山菜爷爷 ---------------------------- */
  MODS.vet = {
    title: '山菜爷爷', en: 'VEGGIE ELDER', icon: 'vet',
    mcols: ['img', 'outn', 'inn', 'pct'],
    desc: '山菜爷爷交换 · 给出道具 / 入手道具 / 交换概率 / 出现地图',
    cols: [
      { k: 'out', h: '', w: 30, th: 'th-icon', img: function (r) { return icon.item(r.out, 22); } },
      { k: 'id', h: '#', w: 52, cls: 'xs' },
      { k: 'outn', h: '给出', w: 210, cls: 'nm', cell: function (r) { return esc(D.name('itm', r.out)); } },
      { k: 'inn', h: '入手', w: 210, cell: function (r) { return matCell(r.inn); } },
      { k: 'pct', h: '概率', w: 62, cls: 'num', cell: function (r) { return '<span class="gold">' + r.pct + '%</span>'; } },
      {
        k: 'loc', h: '地图', w: 120, cell: function (r) {
          return r.loc > 0 ? esc(D.name('loc', r.loc)) : '<span class="dim2">任意</span>';
        }
      }
    ],
    filters: [],
    match: function () { return true; },
    detail: function (r) {
      var body = hero({
        fig: icon.item(r.out, 68), kicker: '山菜爷爷交换', name: D.name('itm', r.out),
        sub: '交换为 ' + D.name('itm', r.inn),
        badges: ['<span class="badge gold">' + r.pct + '%</span>']
      });
      body += sec('交换', '<div class="rel-list">' +
        relBtn({ jump: 'itm:' + r.out, icon: icon.item(r.out, 24), name: D.name('itm', r.out), tag: '给出' }) +
        relBtn({ jump: 'itm:' + r.inn, icon: icon.item(r.inn, 24), name: D.name('itm', r.inn), tag: '入手' }) +
        '</div>');
      body += sec('条件', kv([
        ['概率', r.pct + '%'],
        ['地图', r.loc > 0 ? D.name('loc', r.loc) : '任意']
      ]));
      return body;
    }
  };

  /* ---------------------------- 斗技大会 ---------------------------- */
  MODS.ara = {
    title: '斗技大会', en: 'ARENA', icon: 'ara',
    mcols: ['id', 'loc', 'reward'],
    desc: '斗技大会任务 · 报酬金 / 人数 / S·A·B 评价时间 / 提供装备 / 报酬素材',
    cols: [
      { k: 'img', h: '', w: 32, th: 'th-icon', img: function (r) { return icon.qst(5, 20); } },
      { k: 'id', h: '#', w: 48, cls: 'xs' },
      { k: 'loc', h: '地图', w: 160, cls: 'nm' },
      { k: 'reward', h: '报酬金', w: 68, cls: 'num' },
      { k: 'player', h: '人数', w: 52, cls: 'num' },
      { k: 'tS', h: 'S', w: 56, cls: 'num', cell: function (r) { return '<span class="gold">' + r.tS + '</span>'; } },
      { k: 'tA', h: 'A', w: 56, cls: 'num' },
      { k: 'tB', h: 'B', w: 56, cls: 'num' },
      {
        k: 'mons', h: '怪物', w: 200, cell: function (r) {
          return r.mons.map(function (m) {
            return '<span style="display:inline-flex;align-items:center;gap:3px;margin-right:6px">' +
              icon.mon(m, 16, 'm') + esc(D.name('mon', m)) + '</span>';
          }).join('') || '<span class="dim2">—</span>';
        }
      }
    ],
    filters: [],
    match: function () { return true; },
    detail: function (r) {
      var body = hero({
        fig: ic('ara').replace('<svg', '<svg style="width:34px;height:34px"'),
        kicker: '斗技大会', name: r.loc + ' 斗技',
        sub: '报酬金 ' + fmt(r.reward) + 'z · ' + r.player + ' 人',
        badges: ['<span class="badge gold">S ' + r.tS + '</span>',
          '<span class="badge">A ' + r.tA + '</span>',
          '<span class="badge">B ' + r.tB + '</span>']
      });
      if (r.mons.length) {
        body += sec('出现怪物', '<div class="rel-list">' + r.mons.map(function (m) {
          return relBtn({ jump: 'mon:' + m, icon: icon.mon(m, 20, 'm'), name: D.name('mon', m) });
        }).join('') + '</div>');
      }
      ['A', 'B', 'C', 'D', 'E'].forEach(function (tp) {
        var wp = r.wpns.filter(function (x) { return x[1] === tp; });
        var am = r.amrs.filter(function (x) { return x[1] === tp; });
        if (!wp.length && !am.length) return;
        var h = '';
        if (wp.length) h += '<div style="font-size:10px;color:#b7b2a4;margin:2px 0 3px">武器</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:3px 8px">' + wp.slice(0, 8).map(function (x) {
            var w = D.IX.wpn.get(x[0]);
            return '<span style="display:inline-flex;align-items:center;gap:3px;font-size:10.5px">' +
              (w ? icon.wpn(w, 16) : '') + esc(w ? w[2] : '#' + x[0]) + '</span>';
          }).join('') + '</div>';
        if (am.length) h += '<div style="font-size:10px;color:#b7b2a4;margin:6px 0 3px">防具</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:3px 8px">' + am.slice(0, 8).map(function (x) {
            return '<span style="display:inline-flex;align-items:center;gap:3px;font-size:10.5px">' +
              icon.arm(x[0], 16, 'a') + esc(D.name('armor', x[0])) + '</span>';
          }).join('') + '</div>';
        body += sec('提供装备 · ' + tp + ' 组', h);
      });
      if (r.items.length) {
        body += sec('报酬素材', mini(['素材', '', '数量', '概率'],
          r.items.slice(0, 10).map(function (x) {
            return '<tr><td class="ic">' + icon.item(x[0], 18) + '</td><td>' +
              esc(D.name('itm', x[0])) + '</td><td>' + x[1] + '</td><td class="numw">' + x[2] + '%</td></tr>';
          })), r.items.length);
      }
      return body;
    }
  };

  /* ---------------------------- 勋章 ---------------------------- */
  MODS.awd = {
    title: '勋章', en: 'MEDALS', icon: 'awd',
    mcols: ['img', 'name'],
    desc: '132 枚勋章 · 图标 / 名称 / 获得说明',
    cols: [
      { k: 'img', h: '', w: 40, th: 'th-icon', img: function (r) { return icon.medal(r.id, 30); } },
      { k: 'id', h: '#', w: 52, cls: 'xs', cell: function (r) { return D.pad(r.id, 3); } },
      { k: 'name', h: '勋章', w: 200, cls: 'nm' },
      { k: 'desc', h: '获得说明', w: 460, cell: function (r) { return '<span style="white-space:normal">' + esc(r.desc) + '</span>'; } }
    ],
    filters: [],
    match: function () { return true; },
    detail: function (r) {
      var body = hero({
        fig: '<img src="img/i/Awd_' + D.pad(r.id, 3) + '.png" style="width:72px;height:72px;object-fit:contain" alt="">',
        kicker: '勋章', name: r.name,
        sub: '共 132 枚',
        badges: ['<span class="badge gold">已收录</span>']
      });
      body += sec('获得条件', '<div style="font-size:12px;line-height:1.8;color:#4e4a42">' + esc(r.desc) + '</div>');
      return body;
    }
  };

  /* ======================================================================
     套装模拟器
     ====================================================================== */
  var PARTS5 = ['头', '胴', '腕', '腰', '脚'];
  var ASB = { w: null, a: [null, null, null, null, null], active: 0, q: '', exp: false };

  MODS.asb = {
    title: '套装模拟器', en: 'SET BUILDER', icon: 'asb',
    desc: '组合武器与 5 部位防具 · 实时统计防御 / 孔位 / 发动技能 · 套装码导入导出',
    render: renderAsb
  };

  function asbGear(i) { return i < 0 ? ASB.w : ASB.a[i]; }

  function asbStats() {
    var def = 0, slots = 0, sk = {};
    ASB.a.forEach(function (a) {
      if (!a) return;
      def += a.def || 0;
      slots += a.slot || 0;
      a.skills.forEach(function (s) {
        sk[s.t] = (sk[s.t] || 0) + s.p;
      });
    });
    return { def: def, slots: slots, sk: sk };
  }

  function renderAsb(box) {
    box.innerHTML =
      '<div class="pbar">' +
      '<div class="q" style="flex:0 1 300px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>' +
      '<input id="asbq" placeholder="搜索' + (ASB.active < 0 ? '武器' : '防具') + '…" autocomplete="off"></div>' +
      '<div class="chips" id="asbparts"></div>' +
      '<div class="spacer"></div>' +
      '<div class="btnrow">' +
      '<button class="btn sm" id="asb-demo">示例配装</button>' +
      '<button class="btn sm" id="asb-clear">清空</button>' +
      '<button class="btn sm" id="asb-code">套装码</button>' +
      '</div></div>' +
      '<div class="builder">' +
      '<div class="panel"><div class="panel-h"><h3>当前配装</h3>' +
      '<span class="hint" id="asb-hint">点击槽位切换部位，再点右侧装备</span></div>' +
      '<div style="padding:12px"><div class="slots" id="asb-slots"></div>' +
      '<div class="statbox" id="asb-stats" style="margin-top:12px"></div>' +
      '<div id="asb-skills" style="margin-top:12px"></div></div></div>' +
      '<aside class="panel"><div class="panel-h"><h3 id="asb-pick-t">选择防具</h3>' +
      '<span class="hint" id="asb-pick-n"></span></div>' +
      '<div id="asb-list" style="max-height:calc(100vh - 300px);overflow:auto"></div></aside>' +
      '</div>';

    box.addEventListener('click', onAsb);
    var q = $('#asbq');
    q.addEventListener('input', function () {
      ASB.q = this.value;
      paintAsbList();
    });

    paintAsbParts();
    paintAsbSlots();
    paintAsbList();
    paintAsbStats();
    // 首次打开载入一套示例，避免空态看不出功能
    if (!ASB.init) {
      ASB.init = 1;
      asbDemo();
    }
  }

  function paintAsbParts() {
    var h = '<button class="chip' + (ASB.active < 0 ? ' on' : '') + '" data-ap="-1">武器</button>';
    PARTS5.forEach(function (p, i) {
      h += '<button class="chip' + (ASB.active === i ? ' on' : '') + '" data-ap="' + i + '">' + p + '</button>';
    });
    $('#asbparts').innerHTML = h;
    var t = $('#asb-pick-t');
    if (t) t.textContent = ASB.active < 0 ? '选择武器' : '选择' + PARTS5[ASB.active] + '防具';
  }

  function paintAsbSlots() {
    var h = '';
    h += '<button class="slot' + (ASB.active < 0 ? ' on' : '') + '" data-as="-1">' +
      '<div class="fig">' + (ASB.w ? icon.wpn(ASB.w._raw, 32) : ic('wpn').replace('<svg', '<svg style="width:18px;height:18px;opacity:.4"')) + '</div>' +
      '<div class="nm"><span class="lab">武器</span>' +
      (ASB.w ? esc(ASB.w.name) : '未选择') +
      '<span>' + (ASB.w ? (D.X.wpnType[ASB.w.type] || '') + ' · 攻 ' + ASB.w.atk : '点击选择') + '</span></div></button>';
    ASB.a.forEach(function (a, i) {
      h += '<button class="slot' + (ASB.active === i ? ' on' : '') + '" data-as="' + i + '">' +
        '<div class="fig">' + (a ? icon.arm(a.id, 30, 'a') : ic('amr').replace('<svg', '<svg style="width:18px;height:18px;opacity:.4"')) + '</div>' +
        '<div class="nm"><span class="lab">' + PARTS5[i] + '</span>' +
        (a ? esc(a.name) : '未装备') +
        '<span>' + (a ? '防御 ' + a.def + ' · 孔 ' + (a.slot || 0) : '点击选择') + '</span></div></button>';
    });
    $('#asb-slots').innerHTML = h;
  }

  function paintAsbStats() {
    var s = asbStats();
    $('#asb-stats').innerHTML =
      '<div><div class="k">总防御</div><div class="v">' + s.def + '</div></div>' +
      '<div><div class="k">孔位</div><div class="v">' + s.slots + '</div></div>' +
      '<div><div class="k">技能</div><div class="v">' + Object.keys(s.sk).length + '</div></div>';

    var list = Object.keys(s.sk).map(function (t) {
      return { t: +t, p: s.sk[t], n: D.name('skl', +t) };
    }).sort(function (a, b) { return Math.abs(b.p) - Math.abs(a.p); });

    var h = '<div style="font-size:9.5px;letter-spacing:1.1px;color:#8b8677;font-weight:600;margin-bottom:6px">发动技能</div>';
    if (!list.length) h += '<div style="font-size:11px;color:#b7b2a4">尚未装备防具</div>';
    list.slice(0, 14).forEach(function (x) {
      var lv = D.skillLevel(x.t, x.p);
      h += '<div class="skillrow"><span class="nm">' + esc(x.n) + '</span>' +
        (lv.lv ? '<span class="lv' + (lv.lv < 0 ? ' neg' : '') + '">' + (lv.lv > 0 ? 'Lv.' + lv.lv : '负面') + '</span>' : '') +
        '<span style="font-family:var(--num);font-size:10px;color:#8b8677">' + (x.p > 0 ? '+' : '') + x.p + '</span></div>';
    });
    $('#asb-skills').innerHTML = h;
  }

  function asbRows() {
    var q = ASB.q.trim().toLowerCase();
    var rows;
    if (ASB.active < 0) {
      rows = D.rows('wpn');
    } else {
      rows = D.rows('amr').filter(function (a) { return a.part === ASB.active + 1; });
    }
    if (q) rows = rows.filter(function (r) { return (r.hay || '').indexOf(q) >= 0; });
    rows = rows.slice();
    // 强的排前面，省得第一屏全是低级货
    if (ASB.active < 0) rows.sort(function (a, b) { return (b.atk - a.atk) || (b.rare - a.rare); });
    else rows.sort(function (a, b) { return (b.def - a.def) || (b.rare - a.rare); });
    return rows;
  }

  function paintAsbList() {
    var rows = asbRows();
    var box = $('#asb-list');
    if (!box) return;
    var h = '';
    rows.slice(0, 80).forEach(function (r, i) {
      var ic2 = ASB.active < 0 ? icon.wpn(r._raw, 24) : icon.arm(r.id, 24, 'a');
      var sub = ASB.active < 0
        ? (D.X.wpnType[r.type] || '') + ' · 攻 ' + r.atk
        : '防御 ' + r.def + ' · 孔 ' + (r.slot || 0);
      var sk = ASB.active < 0 ? '' : r.skills.slice(0, 2).map(function (s) {
        return s.n + ' ' + (s.p > 0 ? '+' : '') + s.p;
      }).join('　');
      h += '<button class="rel" data-pick="' + i + '" style="padding:8px 12px;border-radius:0;border-bottom:1px solid #f4f1e8">' +
        ic2 + '<span class="nm"><b style="font-weight:500">' + esc(r.name) + '</b>' +
        '<span style="display:block;font-size:9.5px;color:#8b8677">' + esc(sub) +
        (sk ? '　' + esc(sk) : '') + '</span></span>' +
        '<span class="qty">' + (ASB.active < 0 ? '' : '孔' + (r.slot || 0)) + '</span></button>';
    });
    if (!rows.length) h = '<div class="empty-row">没有匹配的' + (ASB.active < 0 ? '武器' : '防具') + '</div>';
    box.innerHTML = h;
    $('#asb-pick-n').textContent = rows.length + ' 件';
  }

  function onAsb(e) {
    var ap = e.target.closest('[data-ap]');
    if (ap) {
      ASB.active = +ap.dataset.ap;
      ASB.q = '';
      var q = $('#asbq');
      if (q) { q.value = ''; q.placeholder = '搜索' + (ASB.active < 0 ? '武器' : '防具') + '…'; }
      paintAsbParts(); paintAsbSlots(); paintAsbList();
      return;
    }
    var as = e.target.closest('[data-as]');
    if (as) {
      ASB.active = +as.dataset.as; ASB.q = '';
      var q2 = $('#asbq');
      if (q2) { q2.value = ''; q2.placeholder = '搜索' + (ASB.active < 0 ? '武器' : '防具') + '…'; }
      paintAsbParts(); paintAsbSlots(); paintAsbList();
      return;
    }
    var pick = e.target.closest('[data-pick]');
    if (pick) {
      var rows = asbRows();
      var r = rows[+pick.dataset.pick];
      if (!r) return;
      if (ASB.active < 0) ASB.w = r;
      else ASB.a[ASB.active] = r;
      paintAsbSlots(); paintAsbStats();
      toast('已装备：' + r.name);
      return;
    }
    if (e.target.closest('#asb-demo')) { asbDemo(); return; }
    if (e.target.closest('#asb-clear')) {
      ASB.w = null; ASB.a = [null, null, null, null, null];
      paintAsbSlots(); paintAsbStats(); toast('已清空配装');
      return;
    }
    if (e.target.closest('#asb-code')) { asbCode(); return; }
  }

  function asbDemo() {
    // 按名称前 2 字归组，取「5 部位齐全且合计防御最高」的一套
    var rows = D.rows('amr');
    var groups = {};
    rows.forEach(function (a) {
      var k = a.name.slice(0, 2);
      var g = groups[k] || (groups[k] = {});
      if (!g[a.part] || g[a.part].rare < a.rare) g[a.part] = a;
    });
    var best = null, bestDef = -1;
    Object.keys(groups).forEach(function (k) {
      var g = groups[k];
      if (!(g[1] && g[2] && g[3] && g[4] && g[5])) return;
      var def = g[1].def + g[2].def + g[3].def + g[4].def + g[5].def;
      if (def > bestDef) { bestDef = def; best = g; }
    });
    if (best) {
      ASB.a = [best[1], best[2], best[3], best[4], best[5]];
      toast('已载入「' + best[1].name.slice(0, 2) + '」套装 · 防御 ' + bestDef);
    } else {
      ASB.a = [null, null, null, null, null];
      rows.slice(0, 5).forEach(function (a) { ASB.a[a.part - 1] = a; });
    }

    // 配一把武器，避免武器槽空着（剑士套装配近战，枪手套装配远程）
    if (!ASB.w) {
      var bg = ASB.a[0] ? ASB.a[0].bog : 1;
      var ws = D.rows('wpn').filter(function (w) {
        return w.atk > 0 && (bg === 2 ? w.type >= 11 : w.type <= 10);
      });
      ws.sort(function (x, y) { return (y.atk * 100 + y.rare) - (x.atk * 100 + x.rare); });
      if (ws.length) ASB.w = ws[0];
    }

    paintAsbSlots(); paintAsbStats();
  }

  function asbCode() {
    var data = {
      w: ASB.w ? ASB.w.id : 0,
      a: ASB.a.map(function (x) { return x ? x.id : 0; })
    };
    var code = 'MHXX1-' + btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    var input = window.prompt('套装码（复制保存；粘贴其它套装码可导入）', code);
    if (input && input !== code && input.indexOf('MHXX1-') === 0) {
      try {
        var o = JSON.parse(decodeURIComponent(escape(atob(input.slice(6).trim()))));
        ASB.w = o.w ? (D.rows('wpn').filter(function (w) { return w.id === o.w; })[0] || null) : null;
        ASB.a = (o.a || []).map(function (id) {
          return id ? (D.rows('amr').filter(function (a) { return a.id === id; })[0] || null) : null;
        });
        while (ASB.a.length < 5) ASB.a.push(null);
        paintAsbSlots(); paintAsbStats();
        toast('已导入套装码');
      } catch (err) { toast('套装码无效'); }
    }
  }

  /* ======================================================================
     套装配装器
     ====================================================================== */
  var ASF = { goals: [], res: [], q: '', pick: null, limit: 40 };

  MODS.asf = {
    title: '套装配装器', en: 'SET FINDER', icon: 'asf',
    desc: '指定目标技能与等级 · 自动搜索 5 部位防具组合 · 计算技能达成与孔位余量',
    render: renderAsf
  };

  function renderAsf(box) {
    box.innerHTML =
      '<div style="padding:4px 26px 34px;max-width:1660px">' +
      '<div class="panel"><div class="panel-h"><h3>目标技能</h3>' +
      '<span class="hint">最多 6 个 · 点击等级调整</span></div>' +
      '<div style="padding:14px">' +
      '<div class="tag-input" id="asf-tags">' +
      '<input id="asf-q" placeholder="输入技能名添加，如「攻击」「耳塞」…" autocomplete="off">' +
      '</div>' +
      '<div id="asf-sug" style="margin-top:6px"></div>' +
      '<div class="btnrow" style="margin-top:12px">' +
      '<button class="btn pri" id="asf-run">搜索配装</button>' +
      '<button class="btn" id="asf-clear">清空条件</button>' +
      '<span style="font-size:11px;color:#8b8677;align-self:center" id="asf-state"></span>' +
      '</div></div></div>' +
      '<div class="panel" style="margin-top:14px"><div class="panel-h"><h3>搜索结果</h3>' +
      '<span class="hint" id="asf-n"></span></div>' +
      '<div id="asf-res"></div></div></div>';

    box.addEventListener('click', onAsf);
    $('#asf-tags').addEventListener('click', onAsfTag);
    var q = $('#asf-q');
    q.addEventListener('input', function () { asfSuggest(this.value); });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var first = $('#asf-sug .rel');
        if (first) first.click();
        else runAsf();
      }
    });
    paintAsfTags();
    asfEmpty();
  }

  /* 空状态：说明 + 常用技能快选（按防具出现频率动态生成） */
  function asfQuick() {
    if (ASF._quick) return ASF._quick;
    var cnt = {};
    D.rows('amr').forEach(function (a) {
      (a.skills || []).forEach(function (s) {
        if (s.p > 0) cnt[s.t] = (cnt[s.t] || 0) + 1;
      });
    });
    var arr = Object.keys(cnt).map(function (t) { return { t: +t, n: cnt[t] }; })
      .sort(function (a, b) { return b.n - a.n; });
    var out = [];
    for (var i = 0; i < arr.length && out.length < 8; i++) {
      var tr = D.IX.skl.get(arr[i].t);
      if (!tr) continue;
      // 只留有多级的主动技能，单级技能搜出来意义不大
      if ((tr[2] || []).filter(function (x) { return x > 0; }).length < 2) continue;
      out.push(arr[i].t);
    }
    ASF._quick = out;
    return out;
  }

  function asfEmpty() {
    var box = $('#asf-res');
    if (!box) return;
    var picks = asfQuick().map(function (t) {
      return '<button class="rel" data-quick="' + t + '" style="width:auto">' +
        '<span class="nm">' + esc(D.name('skl', t)) + '</span></button>';
    }).join('');
    box.innerHTML =
      '<div class="asf-empty">' +
      '<div class="ae-ic">' + ic('asf').replace('<svg', '<svg style="width:26px;height:26px"') + '</div>' +
      '<div class="ae-t">还没有目标技能</div>' +
      '<div class="ae-s">在上方输入技能名，或直接点下面的常用技能。' +
      '设定 1～3 个核心技能，往往就能搜到成套防具。</div>' +
      '<div class="ae-picks">' + picks + '</div>' +
      '</div>';
  }

  function asfSuggest(q) {
    q = (q || '').trim().toLowerCase();
    var box = $('#asf-sug');
    if (!q) { box.innerHTML = ''; return; }
    var hits = D.rows('skl').filter(function (s) {
      return s.name.toLowerCase().indexOf(q) >= 0 && !ASF.goals.some(function (g) { return g.t === s.id; });
    }).slice(0, 6);
    if (!hits.length) { box.innerHTML = '<div style="font-size:11px;color:#b7b2a4">无匹配技能</div>'; return; }
    box.innerHTML = hits.map(function (s) {
      return '<button class="rel" data-add="' + s.id + '">' +
        '<span class="nm">' + esc(s.name) + '</span>' +
        '<span class="tagn">最大 Lv.' + s.levels.filter(function (x) { return x > 0; }).length + '</span></button>';
    }).join('');
  }

  function paintAsfTags() {
    var box = $('#asf-tags');
    if (!box) return;
    var input = $('#asf-q');
    var h = ASF.goals.map(function (g, i) {
      return '<span class="tag"><b>' + esc(D.name('skl', g.t)) + '</b>' +
        '<button class="btn sm" data-gl="-" data-i="' + i + '" style="height:18px;padding:0 4px;border:none;background:none">−</button>' +
        '<span style="font-family:var(--num)">' + g.lv + '</span>' +
        '<button class="btn sm" data-gl="+" data-i="' + i + '" style="height:18px;padding:0 4px;border:none;background:none">+</button>' +
        '<span class="x" data-gd="' + i + '">×</span></span>';
    }).join('');
    box.innerHTML = h;
    if (input) box.appendChild(input);
  }

  function onAsfTag(e) {
    var gl = e.target.closest('[data-gl]');
    if (gl) {
      var i = +gl.dataset.i, g = ASF.goals[i];
      var max = (D.IX.skl.get(g.t)[2] || []).filter(function (x) { return x > 0; }).length;
      g.lv = Math.max(1, Math.min(max, g.lv + (gl.dataset.gl === '+' ? 1 : -1)));
      paintAsfTags();
      e.stopPropagation();
      return;
    }
    var gd = e.target.closest('[data-gd]');
    if (gd) {
      ASF.goals.splice(+gd.dataset.gd, 1);
      paintAsfTags();
      if (!ASF.goals.length) { ASF.res = []; asfEmpty(); $('#asf-state').textContent = ''; }
      e.stopPropagation();
    }
  }

  function onAsf(e) {
    var qk = e.target.closest('[data-quick]');
    if (qk) {
      var qid = +qk.dataset.quick;
      var qn = D.name('skl', qid);
      if (ASF.goals.some(function (g) { return g.t === qid; })) { toast('已添加「' + qn + '」'); return; }
      if (ASF.goals.length >= 6) { toast('最多 6 个目标技能'); return; }
      var mx = (D.IX.skl.get(qid)[2] || []).filter(function (x) { return x > 0; }).length;
      ASF.goals.push({ t: qid, lv: Math.max(1, mx) });
      paintAsfTags();
      runAsf();
      return;
    }
    var add = e.target.closest('[data-add]');
    if (add) {
      var tid = +add.dataset.add;
      if (ASF.goals.length >= 6) { toast('最多 6 个目标技能'); return; }
      var t = D.IX.skl.get(tid);
      var max = (t[2] || []).filter(function (x) { return x > 0; }).length;
      ASF.goals.push({ t: tid, lv: Math.min(max, 1) });
      var q = $('#asf-q'); if (q) q.value = '';
      $('#asf-sug').innerHTML = '';
      paintAsfTags();
      return;
    }
    if (e.target.closest('#asf-run')) { runAsf(); return; }
    if (e.target.closest('#asf-clear')) {
      ASF.goals = []; ASF.res = [];
      paintAsfTags(); paintAsfRes();
      $('#asf-state').textContent = '';
      return;
    }
    var card = e.target.closest('[data-res]');
    if (card) {
      var i = +card.dataset.res;
      ASF.pick = ASF.res[i] || null;
      paintAsfRes();
      toast('已选中该配装');
    }
  }

  function runAsf() {
    if (!ASF.goals.length) { toast('请先添加目标技能'); return; }
    var amr = D.rows('amr');
    var byPart = [[], [], [], [], []];
    amr.forEach(function (a) { if (a.part >= 1 && a.part <= 5) byPart[a.part - 1].push(a); });

    // 每个部位：有目标技能点数的防具优先，补高防 filler
    var goals = ASF.goals;
    var pools = byPart.map(function (list) {
      var scored = list.map(function (a) {
        var p = 0;
        a.skills.forEach(function (s) {
          goals.forEach(function (g) { if (g.t === s.t) p += s.p; });
        });
        return { a: a, p: p };
      });
      var hit = scored.filter(function (x) { return x.p > 0; })
        .sort(function (x, y) { return (y.p + y.a.def / 60) - (x.p + x.a.def / 60); })
        .slice(0, 55);
      var fill = scored.filter(function (x) { return x.p <= 0; })
        .sort(function (x, y) { return y.a.def - x.a.def; })
        .slice(0, 12);
      return hit.concat(fill);
    });

    var need = goals.map(function (g) {
      var pos = (D.IX.skl.get(g.t)[2] || []).filter(function (x) { return x > 0; });
      return pos[g.lv - 1] || 1;
    });
    var res = [], maxNode = 220000, node = 0;

    function dfs(i, pts, picked) {
      if (res.length >= ASF.limit || node > maxNode) return;
      node++;
      if (i === 5) {
        for (var k = 0; k < need.length; k++) if (pts[k] < need[k]) return;
        res.push({
          gear: picked.slice(),
          def: picked.reduce(function (s, x) { return s + (x.def || 0); }, 0),
          slots: picked.reduce(function (s, x) { return s + (x.slot || 0); }, 0),
          pts: pts.slice()
        });
        return;
      }
      var pool = pools[i];
      for (var j = 0; j < pool.length; j++) {
        var a = pool[j].a;
        var np = pts.slice(), ok = true;
        a.skills.forEach(function (s) {
          for (var g = 0; g < goals.length; g++) if (goals[g].t === s.t) np[g] += s.p;
        });
        // 剪枝：剩余部位最多 +6 点/技能
        for (var g = 0; g < need.length; g++) {
          if (np[g] + 6 * (5 - i - 1) < need[g]) { ok = false; break; }
        }
        if (!ok) continue;
        picked.push(a);
        dfs(i + 1, np, picked);
        picked.pop();
        if (res.length >= ASF.limit) return;
      }
    }
    dfs(0, goals.map(function () { return 0; }), []);

    ASF.res = res;
    ASF.pick = null;
    paintAsfRes();
    $('#asf-state').textContent = '搜索完成：找到 ' + res.length + ' 套';
  }

  function paintAsfRes() {
    var box = $('#asf-res');
    if (!box) return;
    $('#asf-n').textContent = ASF.res.length ? ASF.res.length + ' 套' : '';
    if (!ASF.res.length) {
      box.innerHTML = '<div class="empty-row">添加目标技能后点击「搜索配装」</div>';
      return;
    }
    var h = '';
    ASF.res.forEach(function (r, i) {
      var on = ASF.pick === r;
      h += '<div data-res="' + i + '" style="cursor:pointer;border-bottom:1px solid #f1eee4;padding:12px 14px;' +
        (on ? 'background:#fdf9ef' : '') + '">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">' +
        '<span style="font-family:var(--num);font-size:10px;color:#b7b2a4">#' + (i + 1) + '</span>' +
        '<b style="font-size:12.5px">防御 ' + r.def + ' · 孔位 ' + r.slots + '</b>' +
        '<span style="margin-left:auto;font-size:10.5px;color:#8b8677">' +
        ASF.goals.map(function (g, k) { return esc(D.name('skl', g.t)) + ' +' + r.pts[k]; }).join('　') + '</span>' +
        '</div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
        r.gear.map(function (a) {
          return '<span style="display:inline-flex;align-items:center;gap:4px;background:#fff;border:1px solid #e4e0d3;' +
            'border-radius:6px;padding:3px 7px;font-size:10.5px">' + icon.arm(a.id, 16, 'a') + esc(a.name) + '</span>';
        }).join('') +
        '</div>';
      if (on) {
        h += '<div style="margin-top:10px;border-top:1px dashed #e4e0d3;padding-top:8px">' +
          r.gear.map(function (a) {
            return '<div class="skillrow" style="font-size:10.5px"><span class="nm">' + D.partName(a.part) +
              '　' + esc(a.name) + '</span><span style="font-family:var(--num);font-size:9.5px;color:#8b8677">' +
              a.skills.map(function (s) { return s.n + (s.p > 0 ? '+' : '') + s.p; }).join(' / ') + '</span></div>';
          }).join('') +
          '<div style="margin-top:6px"><button class="btn sm" data-jump="amr:' + r.gear[1].id + '">查看防具详情</button></div>' +
          '</div>';
      }
      h += '</div>';
    });
    box.innerHTML = h;
    bindJumps(box);
  }

  /* ======================================================================
     MHXX DEX v2 — 移动端优先：路由 / 页面 / 组件
     保留上方 21 个模块定义、detail(r) 与配装器逻辑，仅替换渲染与导航
     ====================================================================== */
  var PAGE = $('#page'), TOPBAR = $('#topbar'), TABBAR = $('#tabbar');
  var LS_FAV = 'mhxx.fav.v1', LS_RECENT = 'mhxx.recent.v1';
  var ROUTE = { type: 'home' }, LAST_HASH = '';

  /* ---------------- 通用 SVG 图标（界面控件） ---------------- */
  var UI = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    home: '<path d="M4 11l8-7 8 7v8a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1z"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2z"/><path d="M4 17h15M8 7h7M8 11h5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 4-4 2 2-4z"/>',
    star: '<path d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z"/>',
    share: '<path d="M12 15V3m0 0L8 7m4-4l4 4"/><path d="M5 13v6a1 1 0 001 1h12a1 1 0 001-1v-6"/>',
    more: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    sort: '<path d="M7 4v16m0 0l-3-3m3 3l3-3M17 20V4m0 0l-3 3m3-3l3 3"/>',
    arrow: '<path d="M9 5l7 7-7 7"/>'
  };
  function ui(n, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (UI[n] || UI.more) + '</svg>';
  }

  /* ---------------- 本地存储：收藏 / 最近浏览 ---------------- */
  function readLS(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function favKey(k, id) { return k + ':' + id; }
  function favAll() { return readLS(LS_FAV, {}); }
  function isFav(k, id) { return !!favAll()[favKey(k, id)]; }
  function toggleFav(k, id, name) {
    var all = favAll(), key = favKey(k, id);
    if (all[key]) { delete all[key]; writeLS(LS_FAV, all); toast('已取消收藏'); }
    else { all[key] = { k: k, id: id, name: name, ts: Date.now() }; writeLS(LS_FAV, all); toast('已加入收藏'); }
    renderTopbar(); renderTabbar();
    return !!all[key];
  }
  function recentAll() { return readLS(LS_RECENT, []); }
  function addRecent(k, id, name) {
    var a = recentAll().filter(function (x) { return !(x.k === k && String(x.id) === String(id)); });
    a.unshift({ k: k, id: id, name: name, ts: Date.now() });
    writeLS(LS_RECENT, a.slice(0, 24));
  }

  /* ---------------- 行查找 / 缩略图 ---------------- */
  function findRow(k, id) {
    var rows = D.rows(k), i;
    for (i = 0; i < rows.length; i++) if (String(rows[i].id) === String(id)) return rows[i];
    return null;
  }
  function rowName(k, r) {
    return r.name || r.title || D.name(k, r.id) || ('#' + r.id);
  }
  function thumb(k, r) {
    var mod = MODS[k], c = (mod.cols || []).filter(function (x) { return x.k === 'img'; })[0];
    if (c && c.img) { try { return c.img(r); } catch (e) { } }
    return '<span style="width:22px;height:22px;color:var(--gold)">' + ic(k) + '</span>';
  }

  /* ---------------- Toast ---------------- */
  var tTimer = null;
  function toast(msg) {
    var el = $('#toast'); if (!el) return;
    el.textContent = msg; el.hidden = false;
    clearTimeout(tTimer); tTimer = setTimeout(function () { el.hidden = true; }, 1700);
  }

  /* ---------------- 路由 ---------------- */
  var TAB_KEYS = ['home', 'codex', 'search', 'fav'];
  function parseHash() {
    var h = (location.hash || '').replace(/^#\/?/, '') || 'home';
    var p = h.split('/');
    if (TAB_KEYS.indexOf(p[0]) >= 0) return { type: p[0] };
    if (p[0] === 'list' && MODS[p[1]]) return { type: 'list', key: p[1] };
    if (p[0] === 'detail' && MODS[p[1]]) return { type: 'detail', key: p[1], id: decodeURIComponent(p[2] || '') };
    if (p[0] === 'tool' && MODS[p[1]]) return { type: 'tool', key: p[1] };
    if (MODS[h]) return { type: 'list', key: h };          // 兼容旧版 #wpn
    return { type: 'home' };
  }
  function navTo(s) { if (location.hash === s) render(); else location.hash = s; }

  var JUMP_MAP = {
    armor: 'amr', wpn: 'wpn', amr: 'amr', jew: 'jew', itm: 'itm', mon: 'mon',
    qst: 'qst', skl: 'skl', song: 'song', loc: 'loc', cbo: 'cbo',
    kinsect: 'kinsect', ammo: 'ammo', peliwpn: 'peliwpn', peliamr: 'peliamr',
    awd: 'awd', vet: 'vet', ara: 'ara', peliteam: 'peliteam', hfh: 'hfh'
  };
  function goto(kind, id) {
    var k = JUMP_MAP[kind] || kind;
    if (!MODS[k]) { toast('暂无该分类'); return; }
    if (!findRow(k, id)) { toast('未找到对应条目'); return; }
    navTo('#detail/' + k + '/' + encodeURIComponent(String(id)));
  }
  function openDetail(k, id) { navTo('#detail/' + k + '/' + encodeURIComponent(String(id))); }
  function openList(k) { navTo(MODS[k].render ? '#tool/' + k : '#list/' + k); }

  /* ---------------- 顶栏 ---------------- */
  function menuBtn() { return '<button class="tb-icon" id="tb-menu" type="button" aria-label="打开目录">' + ui('menu') + '</button>'; }
  function titleHtml(t, sub) {
    return '<div class="tb-title"><b>' + esc(t) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div>';
  }
  function renderTopbar() {
    var t = ROUTE.type, h = '';
    if (t === 'home') {
      h = '<div class="tb-brand"><b>MHXX<span>DEX</span></b><small>MONSTER HUNTER DOUBLE CROSS</small></div>' +
        '<div style="flex:1"></div>' +
        '<button class="tb-icon" id="tb-search" type="button" aria-label="全局搜索">' + ui('search') + '</button>' + menuBtn();
    } else if (t === 'detail') {
      var r = findRow(ROUTE.key, ROUTE.id);
      var nm = r ? rowName(ROUTE.key, r) : '详情';
      h = '<button class="tb-icon" id="tb-back" type="button" aria-label="返回">' + ui('back') + '</button>' +
        titleHtml(nm, (MODS[ROUTE.key] || {}).title || '详情') +
        '<button class="tb-icon' + (isFav(ROUTE.key, ROUTE.id) ? ' on' : '') + '" id="tb-fav" type="button" aria-label="收藏">' + ui('star') + '</button>' +
        '<button class="tb-icon" id="tb-share" type="button" aria-label="分享">' + ui('share') + '</button>' +
        '<button class="tb-icon" id="tb-more" type="button" aria-label="更多">' + ui('more') + '</button>';
    } else {
      var titles = { codex: ['图鉴', '全部 21 个功能'], search: ['检索', '跨模块全局搜索'], fav: ['收藏', '我的条目'] };
      var lab = titles[t] || [(MODS[ROUTE.key] || {}).title || '', ROUTE.type === 'tool' ? '工具' : '列表'];
      h = menuBtn() + titleHtml(lab[0], lab[1]) +
        '<button class="tb-icon" id="tb-search" type="button" aria-label="全局搜索">' + ui('search') + '</button>';
    }
    TOPBAR.innerHTML = h;
    var mb = $('#tb-menu'); if (mb) mb.addEventListener('click', openNav);
    var sb = $('#tb-search'); if (sb) sb.addEventListener('click', openOmni);
    var bk = $('#tb-back');
    if (bk) bk.addEventListener('click', function () {
      if (history.length > 1) history.back(); else navTo('#list/' + ROUTE.key);
    });
    var fv = $('#tb-fav');
    if (fv) fv.addEventListener('click', function () {
      var rr = findRow(ROUTE.key, ROUTE.id);
      toggleFav(ROUTE.key, ROUTE.id, rr ? rowName(ROUTE.key, rr) : '未知条目');
    });
    var sh = $('#tb-share'); if (sh) sh.addEventListener('click', shareIt);
    var mo = $('#tb-more'); if (mo) mo.addEventListener('click', toggleMoreMenu);
  }

  function shareIt() {
    var url = location.href, title = document.title;
    if (navigator.share) navigator.share({ title: title, url: url }).catch(function () { });
    else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast('链接已复制'); }, function () { toast('请长按地址栏复制链接'); });
    else toast('请长按地址栏复制链接');
  }
  function toggleMoreMenu() {
    var m = $('#more-menu');
    if (m) { m.remove(); return; }
    var d = document.createElement('div');
    d.className = 'more-menu'; d.id = 'more-menu';
    d.innerHTML = '<button data-a="copyid">复制条目 ID</button>' +
      '<button data-a="copylink">复制页面链接</button>' +
      '<button data-a="top">回到顶部</button>' +
      '<button data-a="list">查看该分类列表</button>' +
      '<button data-a="prev">← 上一个功能</button>' +
      '<button data-a="next">下一个功能 →</button>';
    TOPBAR.appendChild(d);
    d.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var a = b.dataset.a;
      if (a === 'copyid' || a === 'copylink') {
        var txt = a === 'copyid' ? String(ROUTE.id) : location.href;
        if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast('已复制'); });
        else toast('复制失败，请长按地址栏');
      }
      if (a === 'top') PAGE.scrollTo({ top: 0, behavior: 'smooth' });
      if (a === 'list') navTo('#list/' + ROUTE.key);
      if (a === 'prev') step(-1);
      if (a === 'next') step(1);
      d.remove();
    });
  }

  /* ---------------- 底部导航 ---------------- */
  var TABS = [
    { k: 'home', t: '首页', i: 'home' }, { k: 'codex', t: '图鉴', i: 'book' },
    { k: 'search', t: '检索', i: 'compass' }, { k: 'fav', t: '收藏', i: 'star' }
  ];
  function renderTabbar() {
    var active = ROUTE.type === 'detail' || ROUTE.type === 'list' || ROUTE.type === 'tool' ? 'codex' : ROUTE.type;
    var n = Object.keys(favAll()).length;
    TABBAR.innerHTML = TABS.map(function (x) {
      return '<button class="tab' + (active === x.k ? ' on' : '') + '" data-t="' + x.k + '" type="button">' +
        ui(x.i) + '<span>' + x.t + '</span>' +
        (x.k === 'fav' && n ? '<i class="dot">' + n + '</i>' : '') + '</button>';
    }).join('');
    if (!TABBAR.__bound) {
      TABBAR.__bound = 1;
      TABBAR.addEventListener('click', function (e) {
        var b = e.target.closest('.tab'); if (!b) return;
        navTo('#' + b.dataset.t);
      });
    }
  }

  /* ---------------- 抽屉侧栏 ---------------- */
  function openNav() { $('#sb').classList.add('open'); $('#scrim').hidden = false; }
  function closeNav() { $('#sb').classList.remove('open'); $('#scrim').hidden = true; }
  function allKeys() { var a = []; NAV.forEach(function (g) { a = a.concat(g.keys); }); return a; }
  function shortNum(n) { return n >= 10000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n); }
  function paintNav() {
    var nav = $('#nav'), h = '', total = 0;
    NAV.forEach(function (g) {
      h += '<div class="ng">' + esc(g.g) + '<em>' + esc(g.g2) + '</em></div>';
      g.keys.forEach(function (k) {
        var mod = MODS[k]; if (!mod) return;
        var n = mod.count ? mod.count() : 0; total += n;
        h += '<button class="nv' + (ROUTE.key === k ? ' on' : '') + '" data-k="' + k + '" type="button">' +
          '<span class="nv-ic">' + ic(k) + '</span>' +
          '<span class="nv-t">' + esc(mod.title) + '<i>' + esc(mod.en) + '</i></span>' +
          (n ? '<span class="nv-n">' + shortNum(n) + '</span>' : '') + '</button>';
      });
    });
    nav.innerHTML = h;
    $('#sb-count').innerHTML = '共 <b>' + fmt(total) + '</b> 条记录 · 21 个功能';
    if (!nav.__bound) {
      nav.__bound = 1;
      nav.addEventListener('click', function (e) {
        var b = e.target.closest('.nv'); if (!b) return;
        closeNav(); openList(b.dataset.k);
      });
    }
  }

  /* ---------------- 首页 ---------------- */
  var QUICK = ['wpn', 'amr', 'jew', 'itm', 'skl', 'qst', 'mon', 'loc'];
  function pageHome() {
    var stt = D.stats(), total = 0;
    allKeys().forEach(function (k) { if (MODS[k].count) total += (MODS[k].count() || 0); });
    var h = '<div class="hero-home">' +
      '<div class="hh-mark"><svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.7">' +
      '<path d="M22 4c5 6 8 12 8 19a8 8 0 0 1-16 0c0-7 3-13 8-19z"/><path d="M22 12v26M14 24h16" opacity=".55"/></svg>' +
      '<div><b>MHXX<span>DEX</span></b><small>MONSTER HUNTER DOUBLE CROSS · 中文资料库</small></div></div>' +
      '<div class="hh-sub">随身查阅武器派生、防具技能、怪物肉质与任务报酬</div>' +
      '<button class="hh-search" id="hh-go" type="button">' + ui('search') + '<span>搜索全部资料…</span></button>' +
      '<div class="hh-stat"><div><b>' + fmt(total) + '</b><span>条记录</span></div>' +
      '<div><b>21</b><span>个功能</span></div>' +
      '<div><b>' + fmt(stt.wpn) + '</b><span>把武器</span></div>' +
      '<div><b>' + fmt(stt.mon) + '</b><span>种怪物</span></div></div></div>';

    h += '<div class="wrap stack">';
    h += '<div class="sec-title">常用分类</div><div class="quick-grid">' +
      QUICK.map(function (k) {
        return '<button class="quick" data-k="' + k + '" type="button">' + ic(k) + '<span>' + esc(MODS[k].title) + '</span></button>';
      }).join('') + '</div>';
    h += '<button class="tool-btn" id="go-codex" type="button" style="width:100%;justify-content:center">' +
      ui('book') + '<span>查看全部 21 个功能目录</span>' + ui('arrow') + '</button>';

    var rec = recentAll();
    h += '<div class="sec-title">最近浏览 <span class="n">' + rec.length + '</span></div><div class="card2">';
    h += rec.length ? rec.slice(0, 6).map(function (x) {
      return '<button class="mini-row" data-d="' + x.k + ':' + x.id + '" type="button">' +
        '<span class="ic">' + ic(x.k) + '</span><span class="tx"><b>' + esc(x.name) + '</b><small>' +
        esc((MODS[x.k] || {}).title || x.k) + '</small></span><span class="ar">›</span></button>';
    }).join('') : '<div class="empty2">还没有浏览记录<br>点开任意条目后会显示在这里</div>';
    h += '</div>';

    var fa = favAll(), farr = Object.keys(fa).map(function (k) { return fa[k]; })
      .sort(function (a, b) { return b.ts - a.ts; });
    h += '<div class="sec-title">我的收藏 <span class="n">' + farr.length + '</span></div><div class="card2">';
    h += farr.length ? farr.slice(0, 6).map(function (x) {
      return '<button class="mini-row" data-d="' + x.k + ':' + x.id + '" type="button">' +
        '<span class="ic" style="color:var(--gold)">' + ui('star') + '</span><span class="tx"><b>' + esc(x.name) + '</b><small>' +
        esc((MODS[x.k] || {}).title || x.k) + '</small></span><span class="ar">›</span></button>';
    }).join('') : '<div class="empty2">还没有收藏<br>在详情页点右上角星标即可收藏</div>';
    h += '</div>';

    h += '<div class="sec-title">常用工具</div><div class="tool-grid">' +
      '<button class="tool-btn" data-k="asb" type="button">' + ui('book') + '<span>套装模拟器</span></button>' +
      '<button class="tool-btn" data-k="asf" type="button">' + ui('filter') + '<span>套装配装器</span></button>' +
      '<button class="tool-btn" data-k="ara" type="button">' + ui('sort') + '<span>斗技大会</span></button>' +
      '<button class="tool-btn" data-k="vet" type="button">' + ui('compass') + '<span>山菜爷爷交换</span></button>' +
      '</div>';
    h += '<div class="empty2" style="padding:18px 10px">数据与素材来自 Ping\'s MHXX Dex<br>CC BY-NC-ND 4.0 · 仅个人游戏查询用途</div>';
    h += '</div>';
    PAGE.innerHTML = h;
    $('#hh-go').addEventListener('click', function () { navTo('#search'); });
    $('#go-codex').addEventListener('click', function () { navTo('#codex'); });
  }
  function homeClick(e) {
    var q = e.target.closest('[data-k]');
    if (q) { openList(q.dataset.k); return; }
    var d = e.target.closest('[data-d]');
    if (d) { var p = d.dataset.d.split(':'); openDetail(p[0], +p[1]); }
  }

  /* ---------------- 图鉴目录 ---------------- */
  function pageCodex() {
    var h = '<div class="wrap stack"><div class="sec-title">全部功能 <span class="n">21</span></div>';
    NAV.forEach(function (g) {
      h += '<div class="codex-group"><div class="codex-gh">' + esc(g.g) + '<em>' + esc(g.g2) + '</em></div><div class="card2">';
      g.keys.forEach(function (k) {
        var m = MODS[k], n = m.count ? m.count() : 0;
        h += '<button class="codex-item" data-k="' + k + '" type="button">' +
          '<span class="ci">' + ic(k) + '</span><span class="ct"><b>' + esc(m.title) + '</b><small>' +
          esc(m.desc || m.en) + '</small></span>' +
          (n ? '<span class="cn">' + fmt(n) + '</span>' : '') + '<span class="ar">›</span></button>';
      });
      h += '</div></div>';
    });
    h += '</div>';
    PAGE.innerHTML = h;
  }

  /* ---------------- 跨模块检索 ---------------- */
  var SEARCH_KEYS = allKeys().filter(function (k) { return !MODS[k].render; });
  function searchGroups(q, cap) {
    q = (q || '').trim().toLowerCase();
    var out = [];
    if (!q) return out;
    var words = q.split(/\s+/).filter(Boolean);
    SEARCH_KEYS.forEach(function (k) {
      var rows = D.rows(k), hits = [], i;
      for (i = 0; i < rows.length; i++) {
        var hay = rows[i].hay || '', ok = true;
        for (var j = 0; j < words.length; j++) if (hay.indexOf(words[j]) < 0) { ok = false; break; }
        if (ok) hits.push(rows[i]);
        if (hits.length >= cap + 1) break;
      }
      if (hits.length) out.push({ k: k, title: MODS[k].title, hits: hits, more: hits.length > cap });
    });
    return out;
  }
  function resultRow(k, r) {
    return '<button class="sr-i" data-d="' + k + ':' + r.id + '" type="button">' +
      '<span class="si">' + thumb(k, r) + '</span><span class="st"><b>' + esc(rowName(k, r)) + '</b>' +
      '<small>' + esc(MODS[k].title) + '</small></span>' + ui('arrow') + '</button>';
  }
  var SEARCH_CAP = 5, SEARCH_MORE = {};
  function pageSearch() {
    var q0 = st('__search__').q || '';
    PAGE.innerHTML = '<div class="wrap stack">' +
      '<div class="s-box' + (q0 ? ' has' : '') + '" id="sbox">' + ui('search') +
      '<input id="s-q" type="search" placeholder="名称 / 类型 / 属性 / 素材…" value="' + esc(q0) + '" autocomplete="off">' +
      '<button class="s-clr" id="s-clr" type="button" aria-label="清除">×</button></div>' +
      '<div id="s-res"></div></div>';
    var inp = $('#s-q');
    $('#s-clr').addEventListener('click', function () {
      inp.value = ''; st('__search__').q = ''; $('#sbox').classList.remove('has'); paintSearch(''); inp.focus();
    });
    var tm = null;
    inp.addEventListener('input', function () {
      st('__search__').q = inp.value;
      $('#sbox').classList.toggle('has', !!inp.value);
      clearTimeout(tm); tm = setTimeout(function () { paintSearch(inp.value); }, 120);
    });
    paintSearch(q0);
  }
  function paintSearch(q) {
    var box = $('#s-res'); if (!box) return;
    if (!q.trim()) {
      box.innerHTML = '<div class="sec-title">热门分类</div><div class="quick-grid" style="margin-top:10px">' +
        QUICK.map(function (k) { return '<button class="quick" data-sk="' + k + '" type="button">' + ic(k) + '<span>' + esc(MODS[k].title) + '</span></button>'; }).join('') +
        '</div><div class="empty2">输入关键词，跨 19 个数据模块检索<br>支持空格分隔的多关键词</div>';
      return;
    }
    var gs = searchGroups(q, 40);
    if (!gs.length) { box.innerHTML = '<div class="empty2"><b>没有匹配「' + esc(q) + '」的条目</b>试试更短的关键词，或换个分类</div>'; return; }
    var h = '<div class="sec-title">匹配结果 <span class="n">' + gs.length + ' 个分类</span></div>';
    gs.forEach(function (g) {
      var cap = SEARCH_MORE[g.k] ? 20 : SEARCH_CAP;
      h += '<div class="sr-group"><div class="card2"><div class="sr-gh">' + ui('book') +
        esc(g.title) + '<span class="n">' + (g.more ? cap + '+' : g.hits.length) + ' 条</span></div>' +
        g.hits.slice(0, cap).map(function (r) { return resultRow(g.k, r); }).join('') +
        (g.hits.length > SEARCH_CAP ? '<button class="sr-more" data-more="' + g.k + '" type="button">' +
          (SEARCH_MORE[g.k] ? '收起' : '显示更多（' + esc(g.title) + '）') + '</button>' : '') +
        '</div></div>';
    });
    box.innerHTML = h;
  }

  /* ---------------- 收藏页 ---------------- */
  function pageFav() {
    var all = favAll(), arr = Object.keys(all).map(function (k) { return all[k]; })
      .sort(function (a, b) { return b.ts - a.ts; });
    var groups = {}, order = [];
    arr.forEach(function (x) { if (!groups[x.k]) { groups[x.k] = []; order.push(x.k); } groups[x.k].push(x); });
    var h = '<div class="wrap stack">';
    if (!arr.length) h += '<div class="empty2"><b>收藏夹是空的</b>在任意详情页点右上角星标，即可把条目存到这里<br>收藏保存在本机，无需联网</div>';
    order.forEach(function (k) {
      h += '<div class="sec-title">' + esc((MODS[k] || {}).title || k) + ' <span class="n">' + groups[k].length + '</span></div><div class="card2">';
      groups[k].forEach(function (x) {
        var r = findRow(k, x.id);
        h += '<div class="fav-row" style="display:flex;align-items:center;gap:4px;padding:4px 6px;border-bottom:1px solid #f1eee4">' +
          '<button class="mini-row" style="border:none;padding:0;flex:1;min-width:0" data-d="' + k + ':' + x.id + '" type="button">' +
          '<span class="ic">' + (r ? thumb(k, r) : ic(k)) + '</span><span class="tx"><b>' + esc(x.name) + '</b><small>' + esc((MODS[k] || {}).title || k) + '</small></span></button>' +
          '<button class="tb-icon" data-del="' + favKey(k, x.id) + '" type="button" aria-label="移除">' + ui('close') + '</button></div>';
      });
      h += '</div>';
    });
    h += '</div>';
    PAGE.innerHTML = h;
  }

  /* ======================================================================
     统一列表页
     标题 → 搜索 → 分类筛选 → 高级筛选 → 数量 → 排序 → 列表
     ====================================================================== */
  function head(mod) {
    var n = mod.count ? mod.count() : 0;
    return '<div class="phead"><div class="ph-ic">' + ic(CUR) + '</div>' +
      '<div class="ph-tx"><h1>' + esc(mod.title) + '<span class="en">' + esc(mod.en || '') + '</span></h1>' +
      '<p>' + esc(mod.desc || '') + '</p></div>' +
      '<div class="ph-stat"><div class="n"><b>' + fmt(n) + '</b><span>条目</span></div>' +
      '<div class="n"><b>' + (mod.cols ? mod.cols.length : 0) + '</b><span>字段</span></div></div></div>';
  }
  function bar(mod, chips) {
    var hasF = !!(mod.filters && mod.filters.length) && chips !== false;
    return '<div class="pbar"><div class="q' + (st(CUR).q ? ' has' : '') + '" id="qwrap">' +
      ui('search') + '<input id="q" type="search" placeholder="' + esc(mod.ph || '搜索…') + '" autocomplete="off" spellcheck="false">' +
      '<button class="clr" id="qclr" type="button" aria-label="清空">×</button></div>' +
      (hasF ? '<div class="chips" id="chips"></div>' : '') + '</div>';
  }
  function colsOf(mod) {
    var cols = mod.cols || [];
    if (mod.mcols && window.innerWidth <= 860) {
      var out = [];
      mod.mcols.forEach(function (k) {
        var c = cols.filter(function (x) { return x.k === k; })[0];
        if (c) out.push(c);
      });
      if (out.length) return out;
    }
    return cols;
  }
  function filtered(mod) {
    var s = st(CUR), rows = D.rows(CUR), f = s.f, q = s.q.trim().toLowerCase(), out = rows;
    if (mod.match) out = rows.filter(function (r) { return mod.match(r, f); });
    if (q) {
      var words = q.split(/\s+/).filter(Boolean);
      out = out.filter(function (r) {
        var h = r.hay || '';
        for (var i = 0; i < words.length; i++) if (h.indexOf(words[i]) < 0) return false;
        return true;
      });
    }
    if (s.sort) {
      var col = s.sort, dir = s.dir;
      out = out.slice().sort(function (a, b) {
        var x = a[col], y = b[col];
        if (x == null) x = ''; if (y == null) y = '';
        if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir;
        return String(x).localeCompare(String(y), 'zh') * dir;
      });
    }
    return out;
  }
  function paintChips(mod) {
    var box = $('#chips'); if (!box) return;
    var s = st(CUR), fs = mod.filters || [], h = '';
    fs.forEach(function (f) {
      var cur = s.f[f.k] || '';
      if (f.toggle) {
        h += '<button type="button" class="chip fchip' + (cur ? ' on' : '') + '" data-fd="' + esc(f.k) + '">' +
          (cur ? '✓ ' : '') + esc(f.label || f.opts()[0][1]) + '</button>';
        return;
      }
      var val = f.all || '全部';
      if (cur) {
        var o = f.opts().filter(function (x) { return String(x[0]) === String(cur); })[0];
        val = o ? o[1] : cur;
      }
      h += '<button type="button" class="chip fchip' + (cur ? ' on' : '') + '" data-fd="' + esc(f.k) + '">' +
        '<span class="fd-l">' + esc(f.label || f.all || '筛选') + '</span>' +
        '<span class="fd-v">' + esc(val) + '</span><span class="fd-a">▾</span></button>';
    });
    var any = Object.keys(s.f).some(function (kk) { return s.f[kk]; });
    if (any) h += '<button type="button" class="chip freset" data-freset="1">清除筛选</button>';
    box.innerHTML = h;
  }
  function openFilterSheet(k) {
    var mod = MODS[CUR]; if (!mod) return;
    var f = (mod.filters || []).filter(function (x) { return x.k === k; })[0]; if (!f) return;
    closeFilterSheet();
    var cur = st(CUR).f[k] || '';
    var title = f.toggle ? (f.label || f.opts()[0][1]) : (f.label || f.all || '筛选');
    var opts = f.toggle
      ? [['', '全部'], ['1', f.opts()[0][1]]]
      : [['', f.all || '全部']].concat(f.opts());
    var d = document.createElement('div');
    d.className = 'fsheet'; d.id = 'fsheet';
    var h = '<div class="fsheet-mask" data-fclose="1"></div><div class="fsheet-box">' +
      '<div class="fsheet-hd"><b>' + esc(title) + '</b><button type="button" data-fclose="1">完成</button></div>' +
      '<div class="fsheet-opts">';
    opts.forEach(function (o) {
      var on = String(cur) === String(o[0]);
      h += '<button type="button" class="fopt' + (on ? ' on' : '') + '" data-fk="' + esc(k) + '" data-fv="' + esc(o[0]) + '">' +
        esc(o[1]) + (on ? '<span class="fck">✓</span>' : '') + '</button>';
    });
    h += '</div></div>';
    d.innerHTML = h;
    d.addEventListener('click', function (e) {
      if (e.target.closest('[data-fclose]')) { closeFilterSheet(); return; }
      var o = e.target.closest('.fopt');
      if (o) {
        var s2 = st(CUR);
        s2.f[o.dataset.fk] = o.dataset.fv;
        s2.show = 140;
        closeFilterSheet();
        paintTable();
      }
    });
    document.body.appendChild(d);
  }
  function closeFilterSheet() { var d = $('#fsheet'); if (d) d.remove(); }
  function paintAdv(mod) {
    var box = $('#advbox'); if (!box) return;
    var s = st(CUR), h = '';
    (mod.filters || []).forEach(function (f) {
      var cur = s.f[f.k] || '';
      var opts = f.toggle ? [['1', f.opts()[0][1]]] : f.opts();
      h += '<div class="adv-f"><label>' + esc(f.label || f.all || '筛选') + '</label>' +
        '<select data-f="' + f.k + '"><option value="">全部</option>' +
        opts.map(function (o) {
          return '<option value="' + esc(o[0]) + '"' + (String(cur) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
        }).join('') + '</select></div>';
    });
    box.innerHTML = h || '<div class="muted" style="font-size:11.5px">该分类暂无额外筛选条件</div>';
  }
  function sortOpts(mod) {
    var s = st(CUR), h = '<option value="">默认排序</option>';
    colsOf(mod).forEach(function (c) {
      if (c.sort === false || c.k === 'img' || !c.h) return;
      h += '<option value="' + c.k + '"' + (s.sort === c.k && s.dir > 0 ? ' selected' : '') + '>' + esc(c.h) + ' ↑</option>' +
        '<option value="' + c.k + '|d"' + (s.sort === c.k && s.dir < 0 ? ' selected' : '') + '>' + esc(c.h) + ' ↓</option>';
    });
    return h;
  }
  function tableHTML(mod, rows) {
    var cols = colsOf(mod), s = st(CUR);
    var h = '<div class="tw" id="tw"><table class="dt"><thead><tr>';
    cols.forEach(function (c) {
      var cls = (c.cls === 'num' ? 'num ' : '') + (c.th || '') + (c.sort !== false && c.k !== 'img' ? ' srt' : '');
      var dir = s.sort === c.k ? (s.dir > 0 ? ' asc' : ' desc') : '';
      h += '<th class="' + cls + dir + '" data-s="' + c.k + '"' + (c.w ? ' style="width:' + c.w + 'px"' : '') + '>' +
        esc(c.h || '') + '<span class="ar">▲</span></th>';
    });
    h += '</tr></thead><tbody id="tb">' + rowsHTML(mod, rows.slice(0, s.show)) + '</tbody></table>';
    if (!rows.length) h += '<div class="empty-row">没有符合条件的条目</div>';
    else if (rows.length > s.show) h += '<div class="more-row">已显示 ' + s.show + ' / ' + fmt(rows.length) + ' 条，继续下滑加载</div>';
    h += '</div>';
    return h;
  }
  function rowsHTML(mod, rows) {
    var cols = colsOf(mod), s = st(CUR), out = '';
    rows.forEach(function (r, i) {
      out += '<tr data-i="' + i + '">';
      cols.forEach(function (c) {
        var v;
        try { v = c.img ? c.img(r) : (c.cell ? c.cell(r) : r[c.k]); } catch (e) { v = null; }
        if (v == null || v === '') v = '<span class="dim2">—</span>';
        out += '<td class="' + (c.cls || '') + '">' + v + '</td>';
      });
      out += '</tr>';
    });
    return out;
  }
  /* ======================================================================
     武器派生树列表视图
     参考主流资料站的缩进树（├ / └ / │）与游戏内强化树，
     针对 iPhone 竖屏改为紧凑双行节点，支持折叠、类型切换、搜索定位。
     关系完全来自 D.wpnTree() 的精确父子结构，不做名称猜测。
     ====================================================================== */
  var WT_PER = 4;          // 每次加载的派生树棵数
  var WT_MAXNODE = 220;    // 单棵树渲染上限（实测最大 186）
  var WT_MAXGUIDE = 6;     // 缩进封顶层数，避免深层节点被挤出屏幕

  function viewSwitchHTML(v) {
    return '<div class="viewsw">' +
      '<button type="button" data-view="tree"' + (v === 'tree' ? ' class="on"' : '') + '>派生树</button>' +
      '<button type="button" data-view="table"' + (v === 'table' ? ' class="on"' : '') + '>表格</button>' +
      '<span class="viewsw-tip">' + (v === 'tree' ? '按强化路线展示父子与分支' : '按字段排序的扁平清单') + '</span></div>';
  }

  function treeBarHTML(s) {
    var tp = String(s.f.type || 1), h = '<div class="wt-bar"><div class="wt-types" id="wt-types">';
    for (var i = 1; i <= 14; i++) {
      h += '<button type="button" class="wt-type' + (String(i) === tp ? ' on' : '') + '" data-wtype="' + i + '">' +
        esc(D.X.wpnType[i] || ('类型' + i)) + '</button>';
    }
    h += '</div><div class="wt-legend">' +
      '<span><i class="lg forge"></i>可直接生产</span>' +
      '<span><i class="lg final"></i>最终形态</span>' +
      '<span><i class="lg branch"></i>分支点</span>' +
      '<span class="wt-hint">点节点看详情 · 点 ⊟ 折叠分支</span>' +
      '</div></div>';
    return h;
  }

  function wtElemText(n) {
    try { return D.elemText(n.elems) || ''; } catch (e) { return ''; }
  }

  function nodeRowHTML(id, T, s, opt) {
    opt = opt || {};
    var n = T.byId.get(id); if (!n) return '';
    var d = T.depth.get(id) || 0, g = T.guidesOf(id), cs = T.childrenOf(id);
    var canFold = cs.length && !opt.hideFold;
    var folded = canFold && s.fold && s.fold[id];
    var gHtml = '';
    if (d > 0) {
      var start = Math.max(0, g.length - WT_MAXGUIDE);
      if (start > 0) gHtml += '<i class="gl dep" title="第 ' + d + ' 层派生">⋯</i>';
      for (var i = start; i < g.length; i++) gHtml += '<i class="gl' + (g[i] ? ' v' : '') + '"></i>';
      gHtml += '<i class="gl el' + (T.isLast(id) ? ' last' : '') + '"></i>';
    }
    var tags = '';
    if (n.pro > 0) tags += '<i class="wt-tag forge">可生产</i>';
    if (n.child === 0) tags += '<i class="wt-tag final">最终</i>';
    else if (n.child > 1) tags += '<i class="wt-tag branch">' + n.child + ' 分支</i>';
    var fold = canFold
      ? '<button type="button" class="wt-fold" data-fold="' + id + '" aria-label="折叠分支">' + (folded ? '⊞' : '⊟') + '</button>'
      : '<span class="wt-leaf"></span>';
    var et = wtElemText(n);
    var stat = '攻击 ' + (n.atk || 0) + ' · 稀有 ' + (n.rare || 0) +
      (n.aff ? ' · 会心 ' + (n.aff > 0 ? '+' : '') + n.aff + '%' : '') +
      (et ? ' · ' + esc(et) : '');
    return '<div class="wt-row' + (d === 0 ? ' root' : '') +
      (opt.hits && opt.hits.has(id) ? ' hit' : '') + (opt.cur === id ? ' cur' : '') + '" data-wid="' + id + '">' +
      '<div class="wt-guides">' + gHtml + '</div>' +
      '<div class="wt-node" data-jump="wpn:' + id + '">' + fold +
        '<span class="wt-nic">' + icon.wpn(n._raw, 24) + '</span>' +
        '<span class="wt-ntx"><b>' + esc(n.name) + '</b><small>' + stat + '</small></span>' +
        '<span class="wt-ntag">' + tags + '</span>' +
      '</div></div>';
  }

  function branchHTML(id, T, s, opt, out, budget) {
    if (budget.n <= 0) return;
    budget.n--;
    out.push(nodeRowHTML(id, T, s, opt));
    if (!opt.hideFold && s.fold && s.fold[id]) return;
    var cs = T.childrenOf(id);
    for (var i = 0; i < cs.length; i++) branchHTML(cs[i], T, s, opt, out, budget);
  }

  function treeCardHTML(root, no, T, s, opt) {
    var rn = T.byId.get(root); if (!rn) return '';
    var out = [], budget = { n: WT_MAXNODE };
    branchHTML(root, T, s, opt, out, budget);
    var hitN = 0;
    if (opt.hits) opt.hits.forEach(function (hid) { if (T.rootOf(hid) === root) hitN++; });
    var h = '<section class="wt-card" id="wt-card-' + root + '">' +
      '<div class="wt-card-hd">' +
        '<span class="wt-chic">' + icon.wpn(rn._raw, 30) + '</span>' +
        '<div class="wt-chtx"><b>' + esc(rn.base || rn.name) + '</b><small>' +
          esc(D.X.wpnType[rn.type] || '') + ' · 共 ' + (T.treeSize.get(root) || 1) + ' 个形态' +
          (hitN ? ' · 命中 ' + hitN + ' 个' : '') + '</small></div>' +
        '<span class="wt-chno">' + no + '</span></div>' +
      '<div class="wt-rows">' + out.join('') + '</div>';
    if (budget.n <= 0) h += '<div class="wt-trunc">该派生树形态较多，已显示前 ' + WT_MAXNODE + ' 个，点击节点可继续查看</div>';
    return h + '</section>';
  }

  function paintTree(mod, s, box) {
    var T = D.wpnTree(), q = s.q.trim().toLowerCase();
    var focus = s.focusRoot && T.byId.get(s.focusRoot) ? s.focusRoot : 0;
    var hits = null, all = [], mode = 'all';

    if (q) {
      var words = q.split(/\s+/).filter(Boolean), rootsHit = new Set();
      hits = new Set();
      T.byId.forEach(function (n, id) {
        var hay = (n.name + ' ' + (D.X.wpnType[n.type] || '') + ' ' + wtElemText(n)).toLowerCase();
        for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) < 0) return;
        hits.add(id); rootsHit.add(T.rootOf(id));
      });
      all = Array.from(rootsHit).sort(function (a, b) { return a - b; });
      mode = 'search';
    } else if (focus) {
      all = [focus]; mode = 'focus';
    } else {
      all = (T.trees[+(s.f.type || 1)] || []).slice(); mode = 'all';
    }

    var lim = (s.treePage || 1) * WT_PER;
    var show = all.slice(0, lim);
    var opt = { hits: hits, hideFold: mode !== 'all' };
    var h = '';
    if (!all.length) {
      h = '<div class="empty-row">没有找到匹配的武器派生树</div>';
    } else {
      var sum;
      if (mode === 'search') {
        sum = '找到 <b>' + fmt(hits.size) + '</b> 个形态，分布在 <b>' + fmt(all.length) + '</b> 棵派生树';
      } else if (mode === 'focus') {
        sum = '正在查看单棵派生树 · <button type="button" class="wt-lnk" data-wtall="1">查看本类型全部派生树 →</button>';
      } else {
        sum = esc(D.X.wpnType[+(s.f.type || 1)] || '') + ' · 共 <b>' + fmt(all.length) +
          '</b> 棵派生树，已展示 <b>' + fmt(show.length) + '</b> 棵';
      }
      h += '<div class="wt-summary">' + sum + '</div>';
      if (mode === 'search' && hits.size) {
        var ids = Array.from(hits).slice(0, 12);
        h += '<div class="wt-hits"><div class="wt-hits-h">命中形态' +
          (hits.size > 12 ? '（前 12 个，共 ' + fmt(hits.size) + ' 个）' : '') + '</div><div class="wt-hits-b">';
        ids.forEach(function (hid) {
          var nn = T.byId.get(hid); if (!nn) return;
          h += '<button type="button" data-jump="wpn:' + hid + '">' +
            '<span class="wth-ic">' + icon.wpn(nn._raw, 20) + '</span>' +
            '<span class="wth-nm">' + esc(nn.name) + '</span>' +
            '<span class="wth-tp">' + esc(D.X.wpnType[nn.type] || '') + '</span></button>';
        });
        h += '</div><div class="wt-hits-f">下方派生树中已高亮命中节点，可查看它在强化路线中的位置</div></div>';
      }
      show.forEach(function (root, i) { h += treeCardHTML(root, i + 1, T, s, opt); });
      if (all.length > lim) {
        h += '<button type="button" class="wt-more" id="wt-more">继续加载派生树（还有 ' +
          fmt(all.length - lim) + ' 棵）</button>';
      }
    }
    box.innerHTML = h;
    var cnt = $('#pcnt');
    if (cnt) cnt.innerHTML = '<b>' + fmt(show.length) + '</b> 棵派生树 · 全站共 ' + fmt(D.stats().wpn) + ' 个武器形态';
    var tb = $('#wt-types');
    if (tb) $$('.wt-type', tb).forEach(function (b) {
      b.classList.toggle('on', b.dataset.wtype === String(s.f.type || 1));
    });
  }

  function paintTable() {
    var mod = MODS[ROUTE.key], s = st(ROUTE.key), box = $('#tablebox');
    if (!box || !mod) return;
    if (ROUTE.key === 'wpn' && s.view === 'tree') { paintTree(mod, s, box); return; }
    var rows = filtered(mod);
    box.innerHTML = tableHTML(mod, rows);
    var cnt = $('#pcnt');
    if (cnt) cnt.innerHTML = '<b>' + fmt(rows.length) + '</b> / ' + fmt(D.rows(ROUTE.key).length) + ' 条';
    var sel = $('#sort-sel'); if (sel) sel.value = s.sort ? s.sort + (s.dir < 0 ? '|d' : '') : '';
    paintChips(mod); paintAdv(mod);
  }
  function pageList(key) {
    CUR = key;
    var mod = MODS[key], s = st(key);
    var isTree = key === 'wpn' && s.view === 'tree';
    var hasF = !!(mod.filters && mod.filters.length);
    var metaHTML = isTree
      ? treeBarHTML(s) + '<div class="wt-meta"><span id="pcnt"></span></div>'
      : '<div class="list-meta"><div class="cnt" id="pcnt"></div><span class="sp"></span>' +
        (hasF ? '<button class="adv-btn" id="adv-btn" type="button">' + ui('filter') + ' 高级筛选</button>' : '') +
        '<select class="sort-sel" id="sort-sel" aria-label="排序">' + sortOpts(mod) + '</select></div>' +
        (hasF ? '<div class="adv-box" id="advbox"></div>' : '');
    PAGE.innerHTML = head(mod) + '<div class="pbody">' + bar(mod, !isTree) +
      (key === 'wpn' ? viewSwitchHTML(s.view) : '') + metaHTML +
      '<div class="panel' + (isTree ? ' is-tree' : '') + '" id="tablebox"></div></div>';
    var q = $('#q'); q.value = s.q || '';
    var tm = null;
    q.addEventListener('input', function () {
      s.q = q.value; $('#qwrap').classList.toggle('has', !!q.value);
      s.show = 140; s.treePage = 1;
      clearTimeout(tm); tm = setTimeout(paintTable, 90);
    });
    $('#qclr').addEventListener('click', function () {
      q.value = ''; s.q = ''; s.show = 140; s.treePage = 1;
      $('#qwrap').classList.remove('has'); paintTable(); q.focus();
    });
    var advbox = $('#advbox');
    if (advbox) advbox.addEventListener('change', function (e) {
      var el = e.target.closest('select[data-f]'); if (!el) return;
      s.f[el.dataset.f] = el.value; s.show = 140; paintTable();
    });
    var sel = $('#sort-sel');
    if (sel) sel.addEventListener('change', function () {
      var v = this.value;
      if (!v) { s.sort = null; s.dir = 1; }
      else if (v.indexOf('|d') > 0) { s.sort = v.split('|')[0]; s.dir = -1; }
      else { s.sort = v; s.dir = 1; }
      paintTable();
    });
    paintTable();
    PAGE.scrollTop = s.scroll || 0;
  }

  /* ======================================================================
     关联增强（全部来自既有 JSON 的反查 / 聚合，不新增游戏参数）
     ====================================================================== */
  var ELEM5 = ['火', '水', '冰', '雷', '龙'];
  function treeHtml(r) {
    var T = D.wpnTree(), root = T.rootOf(r.id);
    if (!root) return '<div class="muted">该武器暂无派生数据</div>';
    var rn = T.byId.get(root), out = [], budget = { n: WT_MAXNODE };
    branchHTML(root, T, { fold: {} }, { hideFold: true, cur: r.id }, out, budget);
    var kids = T.childrenOf(r.id), par = T.parent.get(r.id) || 0;
    return '<div class="wt-detail">' +
      '<div class="wt-dinfo"><b>' + esc(rn.base || rn.name) + '</b> 派生树 · 共 ' +
        (T.treeSize.get(root) || 1) + ' 个形态<span class="wt-dsep">|</span>当前位于第 ' +
        ((T.depth.get(r.id) || 0) + 1) + ' 层' +
        (par ? ' · 前置：' + esc((T.byId.get(par) || {}).name || '') : ' · 派生起点') +
        ' · 直接派生 ' + kids.length + ' 条</div>' +
      '<div class="wt-rows">' + out.join('') + '</div>' +
      (budget.n <= 0 ? '<div class="wt-trunc">形态较多，仅显示前 ' + WT_MAXNODE + ' 个</div>' : '') +
      '<div class="wt-dfoot">连线表示强化派生的父子与分支；当前武器已高亮，点击任一节点可查看详情。</div>' +
      '<button type="button" class="wt-golist" data-wtfocus="' + root + '">在武器列表中查看这棵派生树 →</button>' +
      '</div>';
  }
  function subHead(t) { return '<div style="font-size:10.5px;color:var(--dim);font-weight:600;letter-spacing:.8px;margin:10px 0 5px">' + esc(t) + '</div>'; }
  function scrollTable(inner) { return '<div class="scroll-x">' + inner + '</div><div class="hint">← 左右滑动查看完整表格 →</div>'; }

  function monExtra(r) {
    var out = [];
    // 属性弱点摘要（由部位肉质聚合）
    var best = ELEM5.map(function (e, i) {
      var mx = -1, part = '';
      (r.weak || []).forEach(function (w) {
        var v = (w[5] || [])[i] || 0;
        if (v > mx) { mx = v; part = w[1] || ''; }
      });
      return { e: e, v: mx, p: part };
    }).sort(function (a, b) { return b.v - a.v; });
    out.push({ title: '属性弱点', body: kv(best.map(function (x) {
      return [x.e + '属性最高', x.v > 0 ? '<span class="gold">' + x.v + '</span> · ' + esc(x.p) : '—'];
    })) + '<div class="hint" style="font-size:9.5px;color:var(--faint);margin-top:6px">数值为各部位中的最高属性肉质</div>' });

    // 完整掉落（含数量、概率、获取方式）
    var drops = D.monDrops(r.id), body = '';
    [3, 2, 1].forEach(function (rk) {
      var arr = drops[String(rk)] || [];
      if (!arr.length) return;
      body += subHead(D.rankName(rk) + ' · ' + arr.length + ' 项');
      body += scrollTable(mini(['', '素材', '数量', '概率', '途径'], arr.map(function (d) {
        return '<tr><td>' + icon.item(d[0], 18) + '</td><td>' + esc(D.name('itm', d[0])) + '</td>' +
          '<td>×' + d[1] + '</td><td class="numw">' + (d[2] >= 0 ? d[2] + '%' : '—') + '</td>' +
          '<td>' + esc(D.X.getType[d[3]] || '') + '</td></tr>';
      })));
    });
    if (body) out.push({ title: '掉落素材（完整）', body: body });

    // 相关任务 + 出现场所（由 quests[7] / quests[5] 反查）
    var qs = (D.raw.quests || []).filter(function (q) {
      var m = q[7] || [];
      for (var i = 0; i < m.length; i++) if (+m[i] === +r.id) return true;
      return false;
    });
    if (qs.length) {
      out.push({
        title: '相关任务', n: qs.length,
        body: '<div class="rel-list">' + qs.slice(0, 40).map(function (q) {
          return relBtn({ jump: 'qst:' + q[0], name: q[1], tag: q[2] || '', right: q[5] || '' });
        }).join('') + '</div>' + (qs.length > 40 ? '<div class="hint">共 ' + qs.length + ' 个任务，显示前 40 个</div>' : '')
      });
      var locs = {};
      qs.forEach(function (q) { var s = String(q[5] || '').trim(); if (s) locs[s] = (locs[s] || 0) + 1; });
      var lk = Object.keys(locs).sort(function (a, b) { return locs[b] - locs[a]; });
      if (lk.length) out.push({
        title: '出现场所', n: lk.length,
        body: '<div class="rel-list">' + lk.slice(0, 24).map(function (s) {
          return '<div class="rel"><span class="nm">' + esc(s) + '</span><span class="qty">' + locs[s] + ' 个任务</span></div>';
        }).join('') + '</div><div class="hint" style="font-size:9.5px;color:var(--faint);margin-top:6px">依据出现该怪物的任务地点统计</div>'
      });
    }
    return out;
  }
  function qstExtra(r) {
    var rw = D.questRewards(r.id), body = '', n = 0;
    var labels = { A: '基本报酬', B: '追加报酬 A', C: '追加报酬 B', D: '破坏报酬', E: '捕获报酬' };
    ['A', 'B', 'C', 'D', 'E'].forEach(function (g) {
      var arr = rw[g] || []; if (!arr.length) return;
      n += arr.length;
      body += subHead((labels[g] || g) + ' · ' + arr.length + ' 项');
      body += scrollTable(mini(['', '素材', '数量', '概率'], arr.map(function (x) {
        return itemRow(x[0], x[1], x[2]);
      })));
    });
    return body ? [{ title: '任务报酬素材（完整）', n: n, body: body }] : [];
  }
  function extraSections(k, r) {
    if (k === 'mon') return monExtra(r);
    if (k === 'qst') return qstExtra(r);
    if (k === 'wpn') return [{ title: '派生路线', body: treeHtml(r) }];
    return [];
  }
  function dropTitles(k) {
    if (k === 'mon') return ['掉落 · '];
    if (k === 'wpn') return ['派生路线'];
    if (k === 'qst') return ['基本报酬', '追加报酬 A', '追加报酬 B', '破坏报酬', '捕获报酬'];
    return [];
  }

  /* ======================================================================
     独立详情页（纵向单列，无左右分栏）
     ====================================================================== */
  function wrapTables(secEl) {
    var clone = secEl.cloneNode(true), h4 = clone.querySelector('h4');
    var title = '', n = '';
    if (h4) {
      if (h4.firstChild && h4.firstChild.nodeType === 3) title = h4.firstChild.nodeValue.replace(/\s+/g, ' ').trim();
      var nn = h4.querySelector('.n'); if (nn) n = nn.textContent.trim();
      h4.remove();
    }
    $$('table', clone).forEach(function (tb) {
      var p = tb.parentElement;
      if (p && p.classList.contains('scroll-x')) return;
      if (p && /overflow-x/.test(p.getAttribute('style') || '')) {
        p.className = 'scroll-x'; p.removeAttribute('style'); return;
      }
      var d = document.createElement('div'); d.className = 'scroll-x';
      tb.parentNode.insertBefore(d, tb); d.appendChild(tb);
    });
    var body = clone.innerHTML;
    if (body.indexOf('scroll-x') >= 0) body += '<div class="hint">← 左右滑动查看完整表格 →</div>';
    return { title: title || '详细信息', n: n, body: body };
  }
  var BIG_FIG = { wpn: 1, amr: 1, loc: 1, peliwpn: 1, peliamr: 1 };
  // 详情页统一兜底：清除残留的内部编号 / HEX 展示（不改动任何游戏数据）
  function stripId(s) {
    return String(s == null ? '' : s)
      .replace(/编号\s*#\d+/g, '')
      .replace(/#\d+/g, '')
      .replace(/HEX\s*[:：]?\s*[0-9A-Fa-f]{2,}/gi, '')
      .replace(/\s*[·・]\s*[·・]\s*/g, ' · ')
      .replace(/^\s*[·・]\s*|\s*[·・]\s*$/g, '')
      .trim();
  }
  function pageDetail(k, id) {
    CUR = k;
    var mod = MODS[k], r = findRow(k, id);
    if (!r) {
      PAGE.innerHTML = '<div class="wrap"><div class="empty2"><b>找不到该条目</b><br><br>' +
        '<button class="tool-btn" data-k="' + k + '" type="button" style="justify-content:center">返回' + esc(mod.title) + '列表</button></div></div>';
      return;
    }
    var html = '';
    try { html = mod.detail(r) || ''; } catch (e) { html = '<div class="d-sec"><h4>详情</h4><div class="muted">详情渲染失败：' + esc(e.message) + '</div></div>'; }
    var tmp = document.createElement('div'); tmp.innerHTML = html;

    var he = tmp.querySelector('.d-hero');
    var fig = he && he.querySelector('.fig') ? he.querySelector('.fig').innerHTML : '';
    var kicker = stripId(he && he.querySelector('.kicker') ? he.querySelector('.kicker').textContent : '');
    var name = he && he.querySelector('h2') ? he.querySelector('h2').textContent : rowName(k, r);
    var sub = stripId(he && he.querySelector('.sub') ? he.querySelector('.sub').innerHTML : '');
    var badges = he && he.querySelector('.badges') ? he.querySelector('.badges').innerHTML : '';

    var secs = [];
    $$('.d-sec', tmp).forEach(function (el) {
      var o = wrapTables(el), drop = dropTitles(k).some(function (t) { return o.title.indexOf(t) === 0; });
      if (!drop) secs.push(o);
    });
    extraSections(k, r).forEach(function (x) { secs.push({ title: x.title, n: x.n || '', body: x.body }); });
    // 详情无分区时，用该模块真实列定义生成基本信息（不编造数据）
    if (!secs.length) {
      var pairs = [];
      colsOf(mod).forEach(function (c) {
        if (c.k === 'img' || !c.h) return;
        var v;
        try { v = c.cell ? c.cell(r) : r[c.k]; } catch (e) { v = null; }
        if (v == null || v === '') v = '—';
        pairs.push([c.h, v]);
      });
      if (pairs.length) secs.push({ title: '基本信息', body: kv(pairs) });
    }

    var h = '<div class="dp"><div class="dp-hero">' +
      '<div class="dp-fig' + (BIG_FIG[k] ? ' big' : '') + '">' + fig + '</div>' +
      (kicker ? '<div class="dp-kicker">' + esc(kicker) + '</div>' : '') +
      '<h1 class="dp-name">' + esc(name) + '</h1>' +
      (sub ? '<div class="dp-sub">' + sub + '</div>' : '') +
      (badges ? '<div class="dp-badges">' + badges + '</div>' : '') +
      '<div class="dp-sub dp-cat" style="margin-top:8px">' + esc(mod.title) + '</div></div>';

    if (secs.length > 1) {
      h += '<div class="dp-quick">' + secs.map(function (s, i) {
        return '<a href="javascript:;" data-sec="' + i + '" type="button">' + esc(s.title) + '</a>';
      }).join('') + '</div>';
    }
    secs.forEach(function (s, i) {
      h += '<section class="dp-sec" id="sec-' + i + '"><h3>' + esc(s.title) +
        (s.n ? '<span class="n">' + esc(s.n) + ' 项</span>' : '') + '</h3><div class="bd">' + s.body + '</div></section>';
    });
    h += '<div class="empty2" style="padding:16px">数据与素材来自 Ping\'s MHXX Dex · CC BY-NC-ND 4.0</div></div>';
    PAGE.innerHTML = h;
    addRecent(k, id, name);
    document.title = name + ' · MHXX DEX';
  }
  function pageTool(k) {
    CUR = k;
    PAGE.innerHTML = '<div id="special"></div>';
    MODS[k].render($('#special'), MODS[k]);
  }

  /* ======================================================================
     全局搜索浮层
     ====================================================================== */
  var OMNI_ON = false, OMNI_IDX = 0, OMNI_ITEMS = [];
  function openOmni() {
    $('#omni').hidden = false; OMNI_ON = true;
    $('#omni-q').value = ''; $('#omni-q').focus(); searchOmni('');
  }
  function closeOmni() { $('#omni').hidden = true; OMNI_ON = false; }
  function searchOmni(q) {
    q = (q || '').trim();
    var box = $('#omni-res'); OMNI_ITEMS = []; OMNI_IDX = 0;
    if (!q) { box.innerHTML = '<div class="omni-empty">输入关键词，跨 19 个数据模块搜索</div>'; return; }
    var gs = searchGroups(q, 5);
    if (!gs.length) { box.innerHTML = '<div class="omni-empty">没有匹配「' + esc(q) + '」的条目</div>'; return; }
    var h = '';
    gs.forEach(function (g) {
      h += '<div class="omni-g">' + esc(g.title) + '　' + (g.more ? '5+' : g.hits.length) + ' 条</div>';
      g.hits.slice(0, 5).forEach(function (r) {
        OMNI_ITEMS.push({ k: g.k, id: r.id });
        h += '<button class="omni-i' + (OMNI_ITEMS.length === 1 ? ' on' : '') + '" data-k="' + g.k + '" data-id="' + r.id + '" type="button">' +
          '<span class="nm">' + esc(rowName(g.k, r)) + '</span><span class="k">' + esc(g.title) + '</span></button>';
      });
    });
    box.innerHTML = h;
  }
  function omniMove(d) {
    var items = $$('.omni-i'); if (!items.length) return;
    if (items[OMNI_IDX]) items[OMNI_IDX].classList.remove('on');
    OMNI_IDX = (OMNI_IDX + d + items.length) % items.length;
    items[OMNI_IDX].classList.add('on');
    items[OMNI_IDX].scrollIntoView({ block: 'nearest' });
  }

  /* ======================================================================
     统一点击委托
     ====================================================================== */
  function pageClick(e) {
    var t = e.target;
    var qk = t.closest('[data-sec]');
    if (qk) {
      var el = $('#sec-' + qk.dataset.sec);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    /* 武器派生树：折叠 / 视图切换 / 类型 / 加载更多 / 详情跳回所属树 */
    var wf = t.closest('[data-wtfocus]');
    if (wf) {
      var T0 = D.wpnTree(), rid = +wf.dataset.wtfocus, rn0 = T0.byId.get(rid);
      if (rn0) {
        var sw = st('wpn');
        sw.view = 'tree'; sw.focusRoot = rid; sw.q = ''; sw.f.type = String(rn0.type);
        sw.treePage = 1; sw.fold = {}; sw.scroll = 0;
        openList('wpn');
      }
      return;
    }
    if (ROUTE.type === 'list' && CUR === 'wpn') {
      var vw = t.closest('[data-view]');
      if (vw) {
        var sv = st('wpn'); sv.view = vw.dataset.view; sv.show = 140;
        sv.focusRoot = 0; sv.scroll = 0; pageList('wpn'); return;
      }
      var fold = t.closest('[data-fold]');
      if (fold) {
        var sf = st('wpn'), fid = fold.dataset.fold;
        sf.fold[fid] = !sf.fold[fid]; paintTable(); return;
      }
      var wty = t.closest('[data-wtype]');
      if (wty) {
        var sw2 = st('wpn'); sw2.f.type = wty.dataset.wtype; sw2.treePage = 1;
        sw2.fold = {}; sw2.focusRoot = 0; paintTable(); return;
      }
      var mr = t.closest('#wt-more');
      if (mr) { st('wpn').treePage = (st('wpn').treePage || 1) + 1; paintTable(); return; }
      var wa = t.closest('[data-wtall]');
      if (wa) { var sa = st('wpn'); sa.focusRoot = 0; sa.treePage = 1; paintTable(); return; }
    }
    var j = t.closest('[data-jump]');
    if (j) {
      if (ROUTE.type === 'list') st(CUR).scroll = PAGE.scrollTop;
      var jp = j.dataset.jump.split(':'); goto(jp[0], +jp[1]); return;
    }
    var del = t.closest('[data-del]');
    if (del) {
      var a = favAll(); delete a[del.dataset.del]; writeLS(LS_FAV, a);
      toast('已移除'); renderTabbar(); pageFav(); return;
    }
    var more = t.closest('[data-more]');
    if (more) { var mk = more.dataset.more; SEARCH_MORE[mk] = !SEARCH_MORE[mk]; paintSearch($('#s-q') ? $('#s-q').value : ''); return; }
    var sk = t.closest('[data-sk]'); if (sk) { openList(sk.dataset.sk); return; }
    var d = t.closest('[data-d]'); if (d) { var dp = d.dataset.d.split(':'); openDetail(dp[0], +dp[1]); return; }
    var bk = t.closest('[data-k]'); if (bk) { openList(bk.dataset.k); return; }

    if (ROUTE.type !== 'list') return;
    var fd = t.closest('[data-fd]');
    if (fd) { openFilterSheet(fd.dataset.fd); return; }
    var fr = t.closest('[data-freset]');
    if (fr) { var s0 = st(CUR); s0.f = {}; s0.show = 140; paintTable(); return; }
    var adv = t.closest('#adv-btn');
    if (adv) { adv.classList.toggle('on'); var ab = $('#advbox'); if (ab) ab.classList.toggle('on'); return; }
    var chip = t.closest('.chip[data-f]');
    if (chip) {
      var s = st(CUR), kk = chip.dataset.f;
      if (chip.dataset.t) s.f[kk] = s.f[kk] ? '' : '1';
      else s.f[kk] = (s.f[kk] === chip.dataset.v ? '' : chip.dataset.v);
      s.show = 140; paintTable(); return;
    }
    var th = t.closest('th[data-s]');
    if (th && th.classList.contains('srt')) {
      var s2 = st(CUR), k2 = th.dataset.s;
      if (s2.sort === k2) s2.dir = -s2.dir; else { s2.sort = k2; s2.dir = 1; }
      paintTable(); return;
    }
    var tr = t.closest('tr[data-i]');
    if (tr) {
      var rows = filtered(MODS[CUR]), rr = rows[+tr.dataset.i];
      if (rr) { st(CUR).scroll = PAGE.scrollTop; openDetail(CUR, rr.id); }
    }
  }
  function onPageScroll() {
    if (ROUTE.type !== 'list') return;
    var s = st(CUR), tw = $('#tw'); if (!tw) return;
    var total = filtered(MODS[CUR]).length;
    if (s.show >= total) return;
    var rc = tw.getBoundingClientRect();
    if (rc.bottom < window.innerHeight + 500) { s.show += 160; paintTable(); }
  }

  /* ======================================================================
     渲染总入口
     ====================================================================== */
  function step(d) {
    var a = allKeys(), i = a.indexOf(ROUTE.key || 'wpn');
    if (i < 0) i = 0;
    openList(a[(i + d + a.length) % a.length]);
  }
  function render() {
    var nr = parseHash();
    if (ROUTE.type === 'list' && !(nr.type === 'list' && nr.key === ROUTE.key)) {
      st(ROUTE.key).scroll = PAGE.scrollTop;
    }
    ROUTE = nr;
    if (nr.key) CUR = nr.key;
    var mm = $('#more-menu'); if (mm) mm.remove();
    closeOmni(); closeNav();
    renderTopbar(); renderTabbar(); paintNav();
    PAGE.innerHTML = ''; PAGE.scrollTop = 0;
    var t = ROUTE.type;
    if (t === 'home') pageHome();
    else if (t === 'codex') pageCodex();
    else if (t === 'search') pageSearch();
    else if (t === 'fav') pageFav();
    else if (t === 'list') pageList(ROUTE.key);
    else if (t === 'detail') pageDetail(ROUTE.key, ROUTE.id);
    else if (t === 'tool') pageTool(ROUTE.key);
    if (t === 'list') PAGE.scrollTop = st(ROUTE.key).scroll || 0;
    if (t !== 'detail') document.title = (t === 'home' ? 'MHXX DEX · 怪物猎人 XX 随身资料库' :
      ((MODS[ROUTE.key] || {}).title || 'MHXX DEX') + ' · MHXX DEX');
  }

  /* ======================================================================
     启动
     ====================================================================== */
  function boot() {
    D.load().then(function () {
      MODS.wpn.count = function () { return D.raw.weapons.length; };
      MODS.amr.count = function () { return D.raw.armor.length; };
      MODS.jew.count = function () { return D.raw.jewels.length; };
      MODS.itm.count = function () { return D.raw.items.length; };
      MODS.cbo.count = function () { return D.raw.combo.length; };
      MODS.skl.count = function () { return D.raw.skills.trees.length; };
      MODS.qst.count = function () { return D.raw.quests.length; };
      MODS.mon.count = function () { return D.raw.monsters.length; };
      MODS.loc.count = function () { return Object.keys(D.labels().loc).length; };
      MODS.song.count = function () { return D.raw.hhsongs.length; };
      MODS.ammo.count = function () { return Object.keys(D.raw.wpn_gun || {}).length; };
      MODS.kinsect.count = function () { return D.raw.kinsects.length; };
      MODS.peliwpn.count = function () { return D.raw.peli_weapons.length; };
      MODS.peliamr.count = function () { return D.raw.peli_armor.length; };
      MODS.peliteam.count = function () { return 1396; };
      MODS.hfh.count = function () { return D.raw.hfh.length; };
      MODS.vet.count = function () { return D.raw.veggie.length; };
      MODS.ara.count = function () { return D.raw.arena.length; };
      MODS.awd.count = function () { return D.raw.medals.length; };
      MODS.asb.count = function () { return 5; };
      MODS.asf.count = function () { return D.raw.skills.trees.length; };
      var PH = {
        wpn: '搜索武器名 / 类型 / 属性', amr: '搜索防具名 / 部位 / 技能',
        jew: '搜索装饰珠 / 技能', itm: '搜索道具名 / 用途 / 获取途径',
        cbo: '搜索结果或材料', skl: '搜索技能名 / 效果',
        qst: '搜索任务名 / 目标 / 地图', mon: '搜索怪物名',
        loc: '搜索地图名', song: '搜索旋律效果 / 分类',
        ammo: '搜索武器名或弹药名', kinsect: '搜索猎虫 / 虫技能',
        peliwpn: '搜索随从武器', peliamr: '搜索随从防具',
        peliteam: '搜索报酬道具', hfh: '搜索任务 / 地图',
        vet: '搜索给出或入手的道具', ara: '搜索地图 / 怪物', awd: '搜索勋章名 / 说明'
      };
      Object.keys(PH).forEach(function (k) { if (MODS[k]) MODS[k].ph = PH[k]; });

      var ld = $('#loading'); if (ld) ld.remove();

      // 全局事件（只绑定一次）
      $('#gsearch').addEventListener('click', openOmni);
      $('#sb-close').addEventListener('click', closeNav);
      $('#scrim').addEventListener('click', closeNav);
      $('#omni').addEventListener('click', function (e) { if (e.target.id === 'omni') closeOmni(); });
      $('#omni-q').addEventListener('input', function () { searchOmni(this.value); });
      $('#omni-res').addEventListener('click', function (e) {
        var b = e.target.closest('.omni-i'); if (!b) return;
        closeOmni(); goto(b.dataset.k, +b.dataset.id);
      });
      document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openOmni(); return; }
        if (!OMNI_ON) return;
        if (e.key === 'Escape') { closeOmni(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); omniMove(1); return; }
        if (e.key === 'ArrowUp') { e.preventDefault(); omniMove(-1); return; }
        if (e.key === 'Enter') {
          var cur = $$('.omni-i')[OMNI_IDX];
          if (cur) { closeOmni(); goto(cur.dataset.k, +cur.dataset.id); }
        }
      });
      // 侧栏左滑关闭（iPhone）
      var sx = 0, sy = 0;
      $('#sb').addEventListener('touchstart', function (e) {
        sx = e.touches[0].clientX; sy = e.touches[0].clientY;
      }, { passive: true });
      $('#sb').addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (dx < -55 && Math.abs(dx) > Math.abs(dy) * 1.4) closeNav();
      }, { passive: true });
      PAGE.addEventListener('click', pageClick);
      PAGE.addEventListener('scroll', onPageScroll, { passive: true });
      window.addEventListener('hashchange', render);
      var lastNarrow = window.innerWidth <= 860, rz = null;
      window.addEventListener('resize', function () {
        clearTimeout(rz);
        rz = setTimeout(function () {
          var n = window.innerWidth <= 860;
          if (n !== lastNarrow) { lastNarrow = n; if (ROUTE.type === 'list') render(); }
        }, 180);
      });

      render();
      if ('serviceWorker' in navigator && location.protocol === 'https:') {
        navigator.serviceWorker.register('sw.js').catch(function () { });
      }
      window.DEX = { go: openList, goto: goto, toast: toast, MODS: MODS, st: st, paint: render, paintNav: paintNav, icon: ic, step: step };
    }).catch(function (err) {
      PAGE.innerHTML = '<div class="wrap"><div class="empty2"><b>载入失败</b>' + esc(err.message) +
        '<br>请通过本地服务器打开（http://），不要直接双击 html 文件</div></div>';
    });
  }
  boot();
})();
