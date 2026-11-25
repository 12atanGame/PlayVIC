// ========================================================================
// WindowsetBuilder.js
// ========================================================================

/*:
 * @target MZ
 * @plugindesc 視窗外觀與裝飾管理 (由 Windowset Builder 自動產生)
 * @author Windowset Builder
 * @managedBy WindowsetBuilder
 * @managedVersion 0.0.1
 * @managedSchema ws_v1
 *
 * @help
 * 本外掛由 Windowset Builder 自動產生。
 * 手動編輯會在下次匯出時被覆寫。
 *
 * 以 "ws_" 開頭的參數由 Windowset Builder 管理,
 * 請勿手動編輯,而是從 WSB 重新匯出專案。
 *
 * @param ws_windowElements
 * @text 視窗元素（JSON 陣列）
 * @type string
 * @default []
 *
 * @param ws_sceneTransitions
 * @text 依場景的轉場（JSON）
 * @desc 各選單場景（Scene_Menu / Scene_Item 等）的開關演出。空物件則停用。由 Windowset Builder 管理。
 * @type string
 * @default {}
 *
 * @param ws_composerSelections
 * @text WSB 合成器選擇（JSON，內部）
 * @desc WSB 簡單模式合成器分頁的快照。執行時不使用；在 WSB 中重新開啟時還原。
 * @type string
 * @default {}
 *
 * @param ws_customWindows
 * @text WSB 自訂視窗（JSON，內部）
 * @desc 多執行個體自訂視窗的快照。執行時不使用；在 WSB 中重新開啟時還原。
 * @type string
 * @default []
 *
 * @param ws_sceneAnims
 * @text WSB 場景動畫設定（JSON，內部）
 * @desc 各標準場景的開啟/關閉動畫設定快照。執行時不使用（已展開到安裝器）；在 WSB 中重新開啟時還原。
 * @type string
 * @default {}
 *
 * @param ws_categorySkins
 * @text 分類視窗外觀（後備，JSON）
 * @desc 依 MADO 分類（對話/選單/戰鬥/其他）的後備外觀。僅套用於該分類中未受管理的視窗類別（例如：為選單換膚會套用到物品/技能視窗）。個別設定的視窗優先。由 Windowset Builder 管理。
 * @type string
 * @default {}
 *
 */

(function() {
  "use strict";

  (function() {
    if (typeof ImageManager === "undefined" || typeof ImageManager.loadSystem !== "function") return;
    if (ImageManager._wsbSubdirHooked) return;
    ImageManager._wsbSubdirHooked = true;
    var _wsp_loadSystem = ImageManager.loadSystem;
    ImageManager.loadSystem = function(filename, hue) {
      if (typeof filename === "string" && /^Window_(WSB|LIB)_/.test(filename)) {
        return this.loadBitmap("img/system/wsb/", filename, hue || 0, true);
      }
      return _wsp_loadSystem.call(this, filename, hue);
    };
  })();

  (function() {
    if (typeof TilingSprite === "undefined" || !TilingSprite.prototype) return;
    if (TilingSprite.prototype._wsbNullBitmapGuard) return;
    var _wsp_ts_onBitmapLoad = TilingSprite.prototype._onBitmapLoad;
    if (typeof _wsp_ts_onBitmapLoad !== "function") return;
    TilingSprite.prototype._wsbNullBitmapGuard = true;
    TilingSprite.prototype._onBitmapLoad = function() {
      if (!this._bitmap) return;
      return _wsp_ts_onBitmapLoad.apply(this, arguments);
    };
  })();

  var pluginName = "WindowsetBuilder";
  var params = PluginManager.parameters(pluginName);

  function ws_parseJSON(s) { try { return JSON.parse(s); } catch (e) { return null; } }

  var ws_windowElements = (ws_parseJSON(params["ws_windowElements"] || "[]") || []).map(function(e) {
    return typeof e === "string" ? ws_parseJSON(e) : e;
  }).filter(Boolean);
  var ws_categorySkins = ws_parseJSON(params["ws_categorySkins"] || "{}") || {};

  function ws_isPluginEnabled(name) {
    return typeof $plugins !== "undefined" && !!$plugins && $plugins.some(function(p) {
      return p && p.name === name && p.status;
    });
  }

  function ws_applyWindowskin(win, skinName) {
    if (!win || !skinName) return;
    win._windowskin = ImageManager.loadSystem(skinName);
    var _wsp_doRefresh = function() {
      if (typeof win._refreshAllParts === "function") {
        try { win._refreshAllParts(); } catch (e) { /* ignore */ }
      }
      if (typeof win.refresh === "function") {
        try { win.refresh(); } catch (e) { /* ignore */ }
      }
    };
    if (win._windowskin && win._windowskin.isReady && win._windowskin.isReady()) {
      _wsp_doRefresh();
    } else if (win._windowskin && typeof win._windowskin.addLoadListener === "function") {
      win._windowskin.addLoadListener(_wsp_doRefresh);
    }
  }

  (function() {
    var _wsp_catOf = {
      Window_ItemList: 'status', Window_SkillType: 'status', Window_SkillList: 'status',
      Window_SkillStatus: 'status', Window_EquipStatus: 'status', Window_EquipCommand: 'status',
      Window_EquipSlot: 'status', Window_EquipItem: 'status', Window_Status: 'status',
      Window_StatusParams: 'status', Window_StatusEquip: 'status', Window_GameEnd: 'status',
      Window_MenuActor: 'status', Window_EventItem: 'talk', Window_Gold: 'status',
      Window_NumberInput: 'talk', Window_ShopBuy: 'other', Window_ShopSell: 'other',
      Window_ShopNumber: 'other', Window_ShopStatus: 'other', Window_NameInput: 'other',
      Window_MapName: 'other', Window_ScrollText: 'talk'
    };
    var _wsp_names = Object.keys(_wsp_catOf);
    for (var _wsp_si = 0; _wsp_si < _wsp_names.length; _wsp_si++) {
      (function(_wsp_cn) {
        var _wsp_skin = ws_categorySkins[_wsp_catOf[_wsp_cn]];
        if (!_wsp_skin || _wsp_skin === "Window") return;
        var _wsp_C = window[_wsp_cn];
        if (!_wsp_C || !_wsp_C.prototype || !_wsp_C.prototype.initialize) return;
        if (_wsp_C.prototype._wsp_catSkinHooked) return;
        _wsp_C.prototype._wsp_catSkinHooked = true;
        var _wsp_origInit = _wsp_C.prototype.initialize;
        _wsp_C.prototype.initialize = function() {
          _wsp_origInit.apply(this, arguments);
          ws_applyWindowskin(this, _wsp_skin);
        };
      })(_wsp_names[_wsp_si]);
    }
  })();

  (function() {
    if (typeof Scene_Shop === "undefined" || !Scene_Shop.prototype) return;
    if (Scene_Shop.prototype._wsp_shopDummySkinHooked) return;
    var _wsp_shopSkin = "";
    for (var _wsp_i = 0; _wsp_i < ws_windowElements.length; _wsp_i++) {
      var _wsp_e = ws_windowElements[_wsp_i];
      if (_wsp_e && _wsp_e.targetClass === "Window_ShopCommand" && _wsp_e.windowskin) {
        _wsp_shopSkin = _wsp_e.windowskin; break;
      }
    }
    if (!_wsp_shopSkin) _wsp_shopSkin = ws_categorySkins["other"] || "";
    if (!_wsp_shopSkin || _wsp_shopSkin === "Window") return;
    Scene_Shop.prototype._wsp_shopDummySkinHooked = true;
    var _wsp_origShopCreate = Scene_Shop.prototype.create;
    Scene_Shop.prototype.create = function() {
      _wsp_origShopCreate.apply(this, arguments);
      ws_applyWindowskin(this._dummyWindow, _wsp_shopSkin);
    };
  })();


  (function() {
    var CORNER_SIZE = 48;
    var CORNER_SRC_Y = 384;
    var CORNER_SRC_XS = [0, 48, 96, 144]; // TL, TR, BL, BR
    var FRAME_SRC_X = 96;
    var FRAME_SRC_Y = 0;
    var FRAME_SRC_SIZE = 96;
    var FRAME_M = 24;
    var MADO_H = 384;

    function ws_cornerLayer() {
      var scene = (typeof SceneManager !== "undefined") ? SceneManager._scene : null;
      if (!scene || typeof scene.addChild !== "function") return null;
      if (scene._wsbCornerLayer && scene._wsbCornerLayer.parent === scene) {
        return scene._wsbCornerLayer;
      }
      var layer = new Sprite();
      var wlIndex = (scene._windowLayer && scene.children)
        ? scene.children.indexOf(scene._windowLayer)
        : -1;
      if (wlIndex >= 0 && typeof scene.addChildAt === "function") {
        scene.addChildAt(layer, wlIndex + 1);
      } else {
        scene.addChild(layer);
      }
      layer._wsbWins = [];
      layer.update = function() {
        for (var i = this._wsbWins.length - 1; i >= 0; i--) {
          var w = this._wsbWins[i];
          if (!w || !w._wsbCornerSprites || w.destroyed) {
            this._wsbWins.splice(i, 1);
            continue;
          }
          try { ws_syncCornerSprites(w); } catch (e) { /* ignore */ }
        }
        Sprite.prototype.update.call(this);
      };
      scene._wsbCornerLayer = layer;
      return layer;
    }

    function ws_ensureCornerSprites(win) {
      var layer0 = ws_cornerLayer();
      if (!win._wsbFrameOverlay || !win._wsbFrameOverlay.parent) {
        var fsp0 = new Sprite();
        fsp0.visible = false;
        if (layer0) layer0.addChild(fsp0);
        else win.addChild(fsp0);
        win._wsbFrameOverlay = fsp0;
        win._wsbFrameOverlayKey = null;
      }
      if (win._wsbCornerSprites && win._wsbCornerSprites[0] &&
          win._wsbCornerSprites[0].parent) {
        return win._wsbCornerSprites;
      }
      var layer = layer0;
      var arr = [];
      for (var i = 0; i < 4; i++) {
        var sp = new Sprite();
        sp.visible = false;
        if (layer) layer.addChild(sp);
        else win.addChild(sp);
        arr.push(sp);
      }
      win._wsbCornerSprites = arr;
      if (layer && layer._wsbWins && layer._wsbWins.indexOf(win) < 0) {
        layer._wsbWins.push(win);
      }
      return arr;
    }

    function ws_applyCornerFrames(win) {
      var skin = win._windowskin;
      var sprites = ws_ensureCornerSprites(win);
      win._wsbFrameOverlayActive = !!skin && (skin.height >= MADO_H ||
        ((typeof ws_frameFrontFor === "function") && ws_frameFrontFor(skin)));
      win._wsbFrameOverlayKey = null;
      if (!skin || skin.height < CORNER_SRC_Y + CORNER_SIZE) {
        for (var i = 0; i < 4; i++) sprites[i].visible = false;
        win._wsbCornerActive = false;
        ws_syncCornerSprites(win);
        return;
      }
      for (var i = 0; i < 4; i++) {
        var sp = sprites[i];
        sp.bitmap = skin;
        sp.setFrame(CORNER_SRC_XS[i], CORNER_SRC_Y, CORNER_SIZE, CORNER_SIZE);
      }
      win._wsbCornerActive = true;
      ws_syncCornerSprites(win);
    }

    function ws_syncCornerSprites(win) {
      var sprites = win._wsbCornerSprites;
      if (!sprites) return;
      var w = win.width || 0;
      var h = win.height || 0;
      var s = CORNER_SIZE;
      var wl = win.parent;
      var baseX = (wl && typeof wl.x === "number" ? wl.x : 0) + (win.x || 0);
      var baseY = (wl && typeof wl.y === "number" ? wl.y : 0) + (win.y || 0);
      var winShown = !!wl && win.visible !== false &&
        (typeof win.openness !== "number" || win.openness >= 255);
      var shown = win._wsbCornerActive === true && winShown;
      var op = (typeof win.opacity === "number") ? win.opacity : 255;
      var wa = (typeof win.alpha === "number") ? win.alpha : 1;
      var alpha = Math.max(0, Math.min(1, op / 255)) * Math.max(0, Math.min(1, wa));
      var scx = (win.scale && typeof win.scale.x === "number") ? win.scale.x : 1;
      var scy = (win.scale && typeof win.scale.y === "number") ? win.scale.y : 1;
      var dests = [[0, 0], [w - s, 0], [0, h - s], [w - s, h - s]];
      for (var i = 0; i < 4; i++) {
        var sp = sprites[i];
        if (sp.parent === win) {
          sp.x = dests[i][0];
          sp.y = dests[i][1];
        } else {
          sp.x = baseX + dests[i][0] * scx;
          sp.y = baseY + dests[i][1] * scy;
          if (sp.scale && sp.scale.set) sp.scale.set(scx, scy);
        }
        sp.visible = shown;
        sp.alpha = alpha;
      }
      ws_syncFrameOverlay(win, baseX, baseY, w, h, winShown, alpha);
    }

    function ws_drawFrameTo(bmp, skin, w, h) {
      var m = FRAME_M;
      var fsrc = (typeof ws_madoFrameSrc === "function") ? ws_madoFrameSrc(skin) : null;
      var src = fsrc ? fsrc.bmp : skin;
      var sx = fsrc ? fsrc.x : FRAME_SRC_X;
      var sy = fsrc ? fsrc.y : FRAME_SRC_Y;
      var szw = fsrc ? fsrc.w : FRAME_SRC_SIZE;
      var szh = fsrc ? fsrc.h : FRAME_SRC_SIZE;
      if (!ws_cornerReplacesFrame(skin)) {
        bmp.blt(src, sx, sy, m, m, 0, 0, m, m);
        bmp.blt(src, sx + szw - m, sy, m, m, w - m, 0, m, m);
        bmp.blt(src, sx, sy + szh - m, m, m, 0, h - m, m, m);
        bmp.blt(src, sx + szw - m, sy + szh - m, m, m, w - m, h - m, m, m);
      }
      var tile = (typeof ws_frameTileFor === "function") && ws_frameTileFor(skin);
      if (tile) {
        ws_bltEdgeTiled(bmp, src, sx + m, sy, szw - 2 * m, m, m, 0, w - 2 * m, m);
        ws_bltEdgeTiled(bmp, src, sx + m, sy + szh - m, szw - 2 * m, m, m, h - m, w - 2 * m, m);
        ws_bltEdgeTiled(bmp, src, sx, sy + m, m, szh - 2 * m, 0, m, m, h - 2 * m);
        ws_bltEdgeTiled(bmp, src, sx + szw - m, sy + m, m, szh - 2 * m, w - m, m, m, h - 2 * m);
      } else {
        bmp.blt(src, sx + m, sy, szw - 2 * m, m, m, 0, w - 2 * m, m);
        bmp.blt(src, sx + m, sy + szh - m, szw - 2 * m, m, m, h - m, w - 2 * m, m);
        bmp.blt(src, sx, sy + m, m, szh - 2 * m, 0, m, m, h - 2 * m);
        bmp.blt(src, sx + szw - m, sy + m, m, szh - 2 * m, w - m, m, m, h - 2 * m);
      }
    }

    function ws_syncFrameOverlay(win, baseX, baseY, w, h, shown, alpha) {
      var fsp = win._wsbFrameOverlay;
      if (!fsp) return;
      var nf = win._frameSprite || win._windowFrameSprite;
      var active = win._wsbFrameOverlayActive === true;
      var frameOn = active && (!nf || nf.visible !== false);
      var skin = win._windowskin;
      if (frameOn && skin && (!skin.isReady || skin.isReady()) && w > 0 && h > 0) {
        var key = w + "|" + h + "|" + (skin.url || skin._url || "");
        if (win._wsbFrameOverlayKey !== key) {
          var bmp = fsp.bitmap;
          if (!bmp || bmp.width !== w || bmp.height !== h) {
            bmp = new Bitmap(w, h);
            fsp.bitmap = bmp;
          } else {
            bmp.clear();
          }
          ws_drawFrameTo(bmp, skin, w, h);
          if (fsp.setFrame) fsp.setFrame(0, 0, w, h);
          win._wsbFrameOverlayKey = key;
        }
      }
      var fshown = shown && frameOn && win._wsbFrameOverlayKey !== null;
      fsp.visible = fshown;
      fsp.alpha = alpha;
      if (fsp.parent === win) {
        fsp.x = 0;
        fsp.y = 0;
      } else {
        fsp.x = baseX;
        fsp.y = baseY;
        var fsx = (win.scale && typeof win.scale.x === "number") ? win.scale.x : 1;
        var fsy = (win.scale && typeof win.scale.y === "number") ? win.scale.y : 1;
        if (fsp.scale && fsp.scale.set) fsp.scale.set(fsx, fsy);
        if (fsp.transform && fsp.transform.skew && win.transform && win.transform.skew) {
          fsp.transform.skew.x = win.transform.skew.x;
        }
      }
      if (nf) nf.renderable = !(active && shown && frameOn);
    }

    var _wsp_orig_refreshAllParts = Window.prototype._refreshAllParts;
    Window.prototype._refreshAllParts = function() {
      _wsp_orig_refreshAllParts.apply(this, arguments);
      try { ws_applyCornerFrames(this); } catch (e) { /* ignore */ }
    };

    var _wsp_orig_move = Window.prototype.move;
    Window.prototype.move = function(x, y, w, h) {
      _wsp_orig_move.apply(this, arguments);
      try { ws_syncCornerSprites(this); } catch (e) { /* ignore */ }
    };

    var _wsp_orig_update = Window.prototype.update;
    Window.prototype.update = function() {
      _wsp_orig_update.apply(this, arguments);
      try { ws_syncCornerSprites(this); } catch (e) { /* ignore */ }
    };
  })();

  var WS_BG_INSET = null;
  function ws_bgInsetFor(skin) {
    if (!WS_BG_INSET || !skin) return null;
    var url = String(skin.url || skin._url || "");
    var match = /([^\/\\]+)\.png$/i.exec(url);
    return (match && WS_BG_INSET[match[1]]) || null;
  }

  var WS_FRAME_FRONT = { "Window": 1 };
  function ws_frameFrontFor(skin) {
    if (!WS_FRAME_FRONT || !skin) return false;
    var url = String(skin.url || skin._url || "");
    var match = /([^\/\\]+)\.png$/i.exec(url);
    return !!(match && WS_FRAME_FRONT[match[1]]);
  }

  var WS_FRAME_TILE = null;
  function ws_frameTileFor(skin) {
    if (!WS_FRAME_TILE || !skin) return false;
    var url = String(skin.url || skin._url || "");
    var match = /([^\/\\]+)\.png$/i.exec(url);
    return !!(match && WS_FRAME_TILE[match[1]]);
  }
  function ws_bltEdgeTiled(bmp, skin, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (sw <= 0 || sh <= 0 || dw <= 0 || dh <= 0) return;
    if (sh === dh) {
      for (var ox = 0; ox < dw; ox += sw) {
        var cw = Math.min(sw, dw - ox);
        bmp.blt(skin, sx, sy, cw, sh, dx + ox, dy, cw, dh);
      }
    } else if (sw === dw) {
      for (var oy = 0; oy < dh; oy += sh) {
        var ch = Math.min(sh, dh - oy);
        bmp.blt(skin, sx, sy, sw, ch, dx, dy + oy, dw, ch);
      }
    } else {
      bmp.blt(skin, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }

  function ws_madoFrameSrc(skin) {
    if (!skin || !skin.height || skin.height < 384) return null;
    if (skin._wsbFlushFrame !== undefined) return skin._wsbFlushFrame;
    var out = null;
    try {
      var S = 96;
      var bmp = new Bitmap(S, S);
      bmp.blt(skin, 96, 0, S, S, 0, 0, S, S);
      var arrows = [[34, 22, 28, 16], [34, 58, 28, 16], [22, 34, 16, 28], [58, 34, 16, 28]];
      for (var i = 0; i < arrows.length; i++) {
        bmp.clearRect(arrows[i][0], arrows[i][1], arrows[i][2], arrows[i][3]);
      }
      var cv = bmp.canvas || bmp._canvas;
      var cx = cv && cv.getContext ? cv.getContext("2d") : null;
      if (cx) {
        var d = cx.getImageData(0, 0, S, S).data;
        var minX = S, minY = S, maxX = -1, maxY = -1;
        for (var y = 0; y < S; y++) {
          for (var x = 0; x < S; x++) {
            if (d[(y * S + x) * 4 + 3] > 8) {
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
          }
        }
        var bw = maxX + 1 - minX;
        var bh = maxY + 1 - minY;
        if (maxX >= 0 && bw >= 48 && bh >= 48) {
          out = { bmp: bmp, x: minX, y: minY, w: bw, h: bh };
        }
      }
    } catch (e) { out = null; }
    skin._wsbFlushFrame = out;
    return out;
  }

  function ws_cornerReplacesFrame(skin) {
    if (!skin) return false;
    if (typeof skin._wsbCornerReplaces === "boolean") return skin._wsbCornerReplaces;
    var rep = false;
    try {
      if (skin.height >= 432) {
        var ccv = skin.canvas || skin._canvas;
        var cctx = ccv && ccv.getContext ? ccv.getContext("2d") : null;
        if (cctx) {
          var fd = cctx.getImageData(96, 0, 96, 96).data;
          var bd = cctx.getImageData(0, 384, 192, 48).data;
          var hasCell = false;
          for (var bi = 3; bi < bd.length; bi += 4) {
            if (bd[bi] > 32) { hasCell = true; break; }
          }
          if (hasCell) {
            var specs = [[0, 0, 0, 0], [72, 0, 72, 0], [0, 72, 96, 24], [72, 72, 168, 24]];
            var minCov = 1;
            for (var si = 0; si < 4; si++) {
              var fx0 = specs[si][0], fy0 = specs[si][1];
              var cx0 = specs[si][2], cy0 = specs[si][3];
              var tot = 0, cov = 0;
              for (var yy = 0; yy < 24; yy++) {
                for (var xx = 0; xx < 24; xx++) {
                  if (fd[((fy0 + yy) * 96 + fx0 + xx) * 4 + 3] > 32) {
                    tot++;
                    if (bd[((cy0 + yy) * 192 + cx0 + xx) * 4 + 3] > 32) cov++;
                  }
                }
              }
              var ratio = tot === 0 ? 1 : cov / tot;
              if (ratio < minCov) minCov = ratio;
            }
            rep = minCov >= 0.9;
          }
        }
      }
    } catch (e) { rep = false; }
    skin._wsbCornerReplaces = rep;
    return rep;
  }

  (function() {
    var MADO_BG_SRC_Y = 192;
    var MADO_BG_SRC_SIZE = 192;
    var MADO_FORMAT_HEIGHT_THRESHOLD = 384;

    function ws_madoRoundClip(bm, bw, bh) {
      var ctx = bm.context || bm._context;
      if (!ctx) return;
      var r = 16;
      var maxR = Math.floor(Math.min(bw, bh) / 2);
      if (r > maxR) r = maxR;
      if (r <= 0) return;
      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(bw - r, 0);
      ctx.arcTo(bw, 0, bw, r, r);
      ctx.lineTo(bw, bh - r);
      ctx.arcTo(bw, bh, bw - r, bh, r);
      ctx.lineTo(r, bh);
      ctx.arcTo(0, bh, 0, bh - r, r);
      ctx.lineTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      if (typeof bm._setDirty === "function") bm._setDirty();
      else if (bm._baseTexture && typeof bm._baseTexture.update === "function") bm._baseTexture.update();
    }

    function ws_madoTilePeriod(skin) {
      if (skin._wsbTilePd) return skin._wsbTilePd;
      var pd = { x: MADO_BG_SRC_SIZE, y: MADO_BG_SRC_SIZE };
      try {
        var cv = skin.canvas || skin._canvas;
        var cx = cv && cv.getContext ? cv.getContext("2d") : null;
        if (cx) {
          var d = cx.getImageData(0, MADO_BG_SRC_Y, MADO_BG_SRC_SIZE, MADO_BG_SRC_SIZE).data;
          var S = MADO_BG_SRC_SIZE;
          var rowDiff = function(y1, y2) {
            var s = 0;
            for (var x = 0; x < S; x++) {
              var i1 = (y1 * S + x) * 4;
              var i2 = (y2 * S + x) * 4;
              for (var c = 0; c < 4; c++) s += Math.abs(d[i1 + c] - d[i2 + c]);
            }
            return s / (S * 4);
          };
          var colDiff = function(x1, x2) {
            var s = 0;
            for (var y = 0; y < S; y++) {
              var i1 = (y * S + x1) * 4;
              var i2 = (y * S + x2) * 4;
              for (var c = 0; c < 4; c++) s += Math.abs(d[i1 + c] - d[i2 + c]);
            }
            return s / (S * 4);
          };
          var OFFS = [0, 24, 48, 72];
          var skinUrl = String(skin.url || skin._url || "");
          var trimTrailingBorder = /(?:^|[\\/])Window_ID04[6-8]\.png(?:[?#].*)?$/i.test(skinUrl);
          var pick = function(diffPair) {
            if (diffPair(0, S - 1) <= 2) return S;
            for (var p = 96; p < S; p++) {
              var worst = 0;
              for (var ki = 0; ki < OFFS.length; ki++) {
                var k = OFFS[ki];
                if (k + p >= S) break;
                var dv = diffPair(k, k + p);
                if (dv > worst) worst = dv;
                if (worst > 2) break;
              }
              if (worst <= 2) return p;
            }
            if (trimTrailingBorder && S >= 98 &&
                diffPair(S - 2, S - 1) >= 12 &&
                diffPair(S - 3, S - 2) >= 8 &&
                diffPair(S - 4, S - 3) <= 4 &&
                diffPair(S - 3, 0) <= 6) {
              return S - 2;
            }
            return S;
          };
          pd.x = pick(colDiff);
          pd.y = pick(rowDiff);
        }
      } catch (e) { /* getImageData 不可等は 192 のまま */ }
      skin._wsbTilePd = pd;
      return pd;
    }

    var _wsp_orig_refreshBack = Window.prototype._refreshBack;
    Window.prototype._refreshBack = function() {
      var skin = this._windowskin;
      if (!skin || !skin.isReady()) {
        return _wsp_orig_refreshBack.apply(this, arguments);
      }
      var inset = ws_bgInsetFor(skin);
      var isMado = skin.height >= MADO_FORMAT_HEIGHT_THRESHOLD;
      if (!isMado && !inset) {
        return _wsp_orig_refreshBack.apply(this, arguments);
      }
      var m = this._margin;
      var mL = isMado ? 0 : (inset ? inset[0] : m); // L, T, R, B
      var mT = isMado ? 0 : (inset ? inset[1] : m);
      var mR = isMado ? 0 : (inset ? inset[2] : m);
      var mB = isMado ? 0 : (inset ? inset[3] : m);
      var w = Math.max(0, this._width - mL - mR);
      var h = Math.max(0, this._height - mT - mB);
      var mzBack = this._backSprite;
      var mvBack = this._windowBackSprite;
      if (!isMado) {
        if (mzBack) {
          mzBack.bitmap = skin;
          mzBack.setFrame(0, 0, 95, 95);
          mzBack.move(mL, mT);
          mzBack.scale.x = w / 95;
          mzBack.scale.y = h / 95;
          var stdTs = mzBack.children && mzBack.children[0];
          if (stdTs) {
            stdTs.bitmap = skin;
            stdTs.setFrame(0, 96, 96, 96);
            stdTs.move(0, 0, w, h);
            stdTs.scale.x = 96 / 95;
            stdTs.scale.y = 96 / 95;
          }
          if (mzBack.setColorTone && this._colorTone) {
            mzBack.setColorTone(this._colorTone);
          }
          return;
        }
        if (mvBack) {
          if (w <= 0 || h <= 0) return;
          var stdBitmap = new Bitmap(w, h);
          mvBack.bitmap = stdBitmap;
          mvBack.setFrame(0, 0, w, h);
          mvBack.move(mL, mT);
          stdBitmap.blt(skin, 0, 0, 96, 96, 0, 0, w, h);
          for (var sy = 0; sy < h; sy += 96) {
            for (var sx = 0; sx < w; sx += 96) {
              stdBitmap.blt(skin, 0, 96, 96, 96, sx, sy, 96, 96);
            }
          }
          var stdTone = this._colorTone;
          if (stdTone && stdBitmap.adjustTone) {
            stdBitmap.adjustTone(stdTone[0], stdTone[1], stdTone[2]);
          }
          return;
        }
        return _wsp_orig_refreshBack.apply(this, arguments);
      }
      {
        if (mzBack) {
          if (w <= 0 || h <= 0) return;
          var pdz = ws_madoTilePeriod(skin);
          var bmz = this._wsbMadoBakedBmp;
          if (!bmz || bmz.width !== w || bmz.height !== h) {
            bmz = new Bitmap(w, h);
          } else {
            bmz.clear();
          }
          for (var mzy = 0; mzy < h; mzy += pdz.y) {
            for (var mzx = 0; mzx < w; mzx += pdz.x) {
              bmz.blt(skin, 0, MADO_BG_SRC_Y, pdz.x, pdz.y, mzx, mzy, pdz.x, pdz.y);
            }
          }
          ws_madoRoundClip(bmz, w, h);
          this._wsbMadoBakedBmp = bmz;
          mzBack.bitmap = bmz;
          if (mzBack.setFrame) mzBack.setFrame(0, 0, w, h);
          mzBack.move(mL, mT);
          mzBack.scale.x = 1;
          mzBack.scale.y = 1;
          var ts = mzBack.children && mzBack.children[0];
          if (ts) {
            ts.bitmap = null;
            if (ts.move) ts.move(0, 0, 0, 0);
          }
          if (mzBack.setColorTone && this._colorTone) {
            mzBack.setColorTone(this._colorTone);
          }
          return;
        }
        if (mvBack) {
          if (w <= 0 || h <= 0) return;
          var tileBitmap = new Bitmap(w, h);
          mvBack.bitmap = tileBitmap;
          mvBack.setFrame(0, 0, w, h);
          mvBack.move(mL, mT);
          var pdv = ws_madoTilePeriod(skin);
          for (var tty = 0; tty < h; tty += pdv.y) {
            for (var ttx = 0; ttx < w; ttx += pdv.x) {
              tileBitmap.blt(skin, 0, MADO_BG_SRC_Y, pdv.x, pdv.y, ttx, tty, pdv.x, pdv.y);
            }
          }
          ws_madoRoundClip(tileBitmap, w, h);
          var tileTone = this._colorTone;
          if (tileTone && tileBitmap.adjustTone) {
            tileBitmap.adjustTone(tileTone[0], tileTone[1], tileTone[2]);
          }
          return;
        }
      }
      return _wsp_orig_refreshBack.apply(this, arguments);
    };
  })();

  if (typeof Window_NameBox === "function") {
    var _wsp_orig_nameBox_refresh = Window_NameBox.prototype.refresh;
    Window_NameBox.prototype.refresh = function() {
      _wsp_orig_nameBox_refresh.apply(this, arguments);
      var name = this._text || this._name || "";
      if (typeof name === "string" && name.trim() === "") {
        this.openness = 0;
        this.visible = false;
      } else {
        this.visible = true;
      }
    };
    var _wsp_nb_baseTextRect = Window_NameBox.prototype.baseTextRect;
    Window_NameBox.prototype.baseTextRect = function() {
      var rect = _wsp_nb_baseTextRect.apply(this, arguments);
      var off = Math.floor((this.innerHeight - this.lineHeight()) / 2);
      if (off > 0) rect.y += off;
      return rect;
    };
  }

  (function() {
    if (typeof Window_Selectable === "undefined" || !Window_Selectable.prototype) return;
    if (typeof Window_Selectable.prototype.update !== "function") return;
    function ws_rectsOverlap(a, b) {
      return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
    }
    function ws_raiseEligible(w) {
      if (!w || w.visible === false) return false;
      if (typeof w.openness === "number" && !(w.openness > 0)) return false;
      return true;
    }
    var ws_raisePending = [];
    var _wsp_actraise_orig = Window_Selectable.prototype.update;
    Window_Selectable.prototype.update = function() {
      _wsp_actraise_orig.apply(this, arguments);
      try {
        if (!this.active) return;
        if (!ws_raiseEligible(this)) return;
        if (!(this.width > 0) || !(this.height > 0)) return;
        var p = this.parent;
        if (!p || !p.children || typeof p.addChild !== "function") return;
        var me = p.children.indexOf(this);
        if (me < 0 || me === p.children.length - 1) return;
        for (var i = me + 1; i < p.children.length; i++) {
          var w = p.children[i];
          if (w && w !== this && w.width > 0 && w.height > 0 && ws_raiseEligible(w) && ws_rectsOverlap(this, w)) {
            if (ws_raisePending.indexOf(this) < 0) ws_raisePending.push(this);
            break;
          }
        }
      } catch (err) { /* ignore */ }
    };
    if (typeof Scene_Base !== "undefined" && Scene_Base.prototype && typeof Scene_Base.prototype.update === "function") {
      var _wsp_actraise_sceneUpdate = Scene_Base.prototype.update;
      Scene_Base.prototype.update = function() {
        _wsp_actraise_sceneUpdate.apply(this, arguments);
        if (ws_raisePending.length > 0) {
          var list = ws_raisePending;
          ws_raisePending = [];
          for (var i = 0; i < list.length; i++) {
            try {
              var w = list[i];
              var p = w ? w.parent : null;
              if (!p || !p.children || typeof p.addChild !== "function") continue;
              var me = p.children.indexOf(w);
              if (me < 0 || me === p.children.length - 1) continue;
              p.addChild(w);
            } catch (err2) { /* ignore */ }
          }
        }
      };
    }
  })();

  (function() {
    if (typeof WindowLayer === "undefined" || !WindowLayer.prototype) return;
    if (typeof WindowLayer.prototype.render !== "function") return;
    WindowLayer.prototype.render = function(renderer) {
      if (!this.visible) return;
      var children = this.children;
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (!child || !child.visible) continue;
        if (child._isWindow && !(child.openness > 0)) continue;
        child.render(renderer);
      }
    };
  })();

  window.$_wsbRuntime = {
    windowElements: ws_windowElements,
    pluginParams: {"ws_windowElements":[],"ws_composerSelections":{},"ws_customWindows":[],"ws_sceneTransitions":{},"ws_categorySkins":"{}"},
  };

})();
