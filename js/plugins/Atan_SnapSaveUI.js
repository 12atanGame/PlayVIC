/*:
 * @target MZ
 * @plugindesc [v1.0] VIC專案：帶縮圖的存檔/讀檔介面（直式 432×912 擷取） 
 * @author Atan
 *
 * @help
 * Atan_SnapSaveUI.js
 * ------------------------------------------------------------
 * 功能摘要
 *  - 存檔時自動擷取當前畫面，依 432×912 直式比例縮放（cover/contain）
 *  - 縮圖（base64）嵌入 savefileInfo，不需另存檔案
 *  - 自訂是否包含 UI（對話框視窗等）
 *  - 新的存讀檔 UI：左側槽清單 + 右側大圖預覽 + 詳細資訊
 *  - 支援自動存檔槽（0號），其餘 1..maxSavefiles
 *
 * 使用方式
 *  1) 將本檔放入 js/plugins/，插件管理器啟用
 *  2) 可從標題畫面 → 「載入遊戲」/「保存遊戲」進入，也可事件指令進入
 *     - 事件：打開存檔畫面 →「打開存檔畫面」
 *             打開讀檔畫面 →「打開讀檔畫面」
 *
 * 注意
 *  - 本插件會覆蓋/擴增以下流程：
 *     DataManager.makeSavefileInfo（加入 snapshot 字串）
 *     Scene_File / Window_SavefileList 的繪製與版面
 *  - 縮圖存於存檔資訊（base64），存檔體積會略增；可調降縮圖尺寸。
 *
 * @param captureTargetWidth
 * @text 擷取目標寬度
 * @type number
 * @min 1
 * @default 432
 *
 * @param captureTargetHeight
 * @text 擷取目標高度
 * @type number
 * @min 1
 * @default 912
 *
 * @param captureFitMode
 * @text 擷取縮放模式
 * @type select
 * @option cover（滿版裁切）
 * @value cover
 * @option contain（等比置中）
 * @value contain
 * @default cover
 *
 * @param captureIncludeUI
 * @text 擷取包含UI
 * @type boolean
 * @on 包含
 * @off 不含
 * @default true
 *
 * @param thumbWidth
 * @text 清單縮圖寬
 * @type number
 * @min 48
 * @default 144
 *
 * @param thumbHeight
 * @text 清單縮圖高
 * @type number
 * @min 48
 * @default 304
 *
 * @param previewWidth
 * @text 右側預覽寬
 * @type number
 * @min 48
 * @default 216
 *
 * @param previewHeight
 * @text 右側預覽高
 * @type number
 * @min 48
 * @default 456
 *
 * @param bgColor
 * @text contain留邊底色
 * @type string
 * @default #000000
 *
 * @param playSE
 * @text 存檔音效（留空不播）
 * @type file
 * @dir audio/se
 * @default
 *
 * @param listCols
 * @text 清單欄數
 * @type number
 * @min 1
 * @max 2
 * @default 1
 *
 * @param showAutosaveSlot
 * @text 顯示自動存檔槽(0)
 * @type boolean
 * @default true
 *
 * @param maxVisibleRows
 * @text 清單可視行數
 * @type number
 * @min 3
 * @default 6
 *
 * @param showMapName
 * @text 顯示地圖名稱
 * @type boolean
 * @default true
 *
 * @param showPlaytime
 * @text 顯示遊玩時間
 * @type boolean
 * @default true
 *
 * @param showTimestamp
 * @text 顯示日期時間
 * @type boolean
 * @default true
 */

(() => {
  const PN = "Atan_SnapSaveUI";
  const P = PluginManager.parameters(PN);
  const CAP_W = Number(P.captureTargetWidth || 432);
  const CAP_H = Number(P.captureTargetHeight || 912);
  const FIT   = String(P.captureFitMode || "cover");
  const INC_UI = P.captureIncludeUI === "true";
  const BG = String(P.bgColor || "#000000");
  const TH_W = Number(P.thumbWidth || 144);
  const TH_H = Number(P.thumbHeight || 304);
  const PV_W = Number(P.previewWidth || 216);
  const PV_H = Number(P.previewHeight || 456);
  const PLAY_SE = String(P.playSE || "");
  const LIST_COLS = Math.max(1, Math.min(2, Number(P.listCols || 1)));
  const SHOW_AUTOSAVE = P.showAutosaveSlot === "true";
  const MAX_ROWS = Number(P.maxVisibleRows || 6);
  const SHOW_MAP = P.showMapName === "true";
  const SHOW_PT  = P.showPlaytime === "true";
  const SHOW_TS  = P.showTimestamp === "true";

  // ---------------- Utils: snapshot to dataURL ----------------
  function captureStageToDataURL({includeUI=INC_UI, fitMode=FIT, targetW=CAP_W, targetH=CAP_H, bgColor=BG}) {
    const scene = SceneManager._scene;
    if (!scene) return null;
    // toggle UI if needed
    let uiLayer, prevVisible;
    if (!includeUI) {
      uiLayer = scene._windowLayer;
      if (uiLayer) {
        prevVisible = uiLayer.visible;
        uiLayer.visible = false;
      }
    }
    let srcCanvas;
    try {
      const stage = Graphics.app.stage;
      const extractor = Graphics.app.renderer.plugins.extract;
      srcCanvas = extractor.canvas(stage);
    } finally {
      if (!includeUI && uiLayer) uiLayer.visible = prevVisible;
    }
    // scale to targetW/targetH using 2D canvas
    const out = document.createElement("canvas");
    out.width = targetW;
    out.height = targetH;
    const ctx = out.getContext("2d");
    const sw = srcCanvas.width, sh = srcCanvas.height;
    if (fitMode === "contain") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0,0,targetW,targetH);
      const s = Math.min(targetW/sw, targetH/sh);
      const dw = Math.round(sw * s), dh = Math.round(sh * s);
      const dx = Math.floor((targetW - dw)/2), dy = Math.floor((targetH - dh)/2);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(srcCanvas, 0,0, sw,sh, dx,dy, dw,dh);
    } else {
      const s = Math.max(targetW/sw, targetH/sh);
      const dw = Math.round(sw * s), dh = Math.round(sh * s);
      const dx = Math.floor((targetW - dw)/2), dy = Math.floor((targetH - dh)/2);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(srcCanvas, 0,0, sw,sh, dx,dy, dw,dh);
    }
    // return PNG dataURL (高畫質縮圖來源)
    return out.toDataURL("image/png");
  }

  // 生成縮圖（給清單與預覽用）
  function makeThumbnail(dataUrl, w, h) {
    // 利用 <img> + canvas 縮製作小圖
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const ctx = c.getContext("2d");
        // cover-fit 小縮圖（以避免擠壓）
        const s = Math.max(w / img.width, h / img.height);
        const dw = Math.round(img.width * s);
        const dh = Math.round(img.height * s);
        const dx = Math.floor((w - dw)/2);
        const dy = Math.floor((h - dh)/2);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0,0, img.width,img.height, dx,dy, dw,dh);
        resolve(c.toDataURL("image/png"));
      };
      img.src = dataUrl;
    });
  }

  // 將 dataURL 畫到 Bitmap（RMMZ）
  function dataUrlToBitmap(dataUrl) {
    const b = new Bitmap(1,1);
    b._image = new Image();
    b._image.onload = b._onLoad.bind(b);
    b._image.src = dataUrl;
    return b;
  }

  // ---------------- Hook savefile info to include snapshot ----------------
  const DM_makeSavefileInfo = DataManager.makeSavefileInfo;
  DataManager.makeSavefileInfo = function() {
    const info = DM_makeSavefileInfo.call(this);
    try {
      // 擷取大圖，並另外縮一張清單小圖加速顯示
      const full = captureStageToDataURL({
        includeUI: INC_UI,
        fitMode: FIT,
        targetW: CAP_W,
        targetH: CAP_H,
        bgColor: BG
      });
      info.snapshotFull = full || null; // 432×912 PNG dataURL
      info.snapshotThumb = null;        // 供清單使用的小圖（稍後 Scene_File 生成）
      info.mapName = $gameMap ? $gameMap.displayName() : "";
      info.timestampISO = new Date().toISOString();
    } catch(e) {
      console.warn(`[${PN}] snapshot failed`, e);
    }
    return info;
  };

  // ---------------- Custom Scene_File Layout ----------------
  // 我們覆寫 Scene_File 以加上右側大預覽與資訊欄
  const SF_create = Scene_File.prototype.create;
  Scene_File.prototype.create = function() {
    SF_create.call(this);
    this.createRightPreview();
  };

    Scene_File.prototype.createSavefileList = function() {
    const x = 0;
    const y = this.helpAreaHeight ? this.helpAreaHeight() : 0;
    const w = Math.floor(Graphics.boxWidth * 0.66);
    const h = this.mainAreaHeight ? this.mainAreaHeight() : Graphics.boxHeight - y;
    const rect = new Rectangle(x, y, w, h);
    this._listWindow = new Window_SnapSaveList(rect);  // 強制用我寫的子類別
    this._listWindow.setHandler("ok", this.onSavefileOk.bind(this));
    this._listWindow.setHandler("cancel", this.popScene.bind(this));
    this._listWindow.selectSavefile(this.firstSavefileId());
    this._listWindow.setTopRow(this.firstSavefileId() - 1);
    this.addWindow(this._listWindow);
    };

  Scene_File.prototype.createRightPreview = function() {
    const x = this._listWindow ? this._listWindow.width : Math.floor(Graphics.boxWidth * 0.66);
    const y = this.helpAreaHeight ? this.helpAreaHeight() : 0;
    const w = Graphics.boxWidth - x;
    const h = this.mainAreaHeight ? this.mainAreaHeight() : Graphics.boxHeight - y;
    this._previewSprite = new Sprite();
    this._previewSprite.x = x + Math.floor((w - PV_W)/2);
    this._previewSprite.y = y + 16;
    this.addChild(this._previewSprite);

    this._infoWindow = new Window_SnapInfo(new Rectangle(x, y + PV_H + 32, w, h - PV_H - 32));
    this.addWindow(this._infoWindow);
    
    // 進場立刻更新
    // 初始根據選中項更新右側
    const info = DataManager.savefileInfo(this._listWindow.indexToSavefileId(this._listWindow.index()));
    this._listWindow(info);
    this.updatePreview(info);
  };

  Scene_File.prototype.updatePreview = function(info) {
    if (!this._previewSprite) return;
    if (info && info.snapshotFull) {
      const bmp = dataUrlToBitmap(info.snapshotFull);
      bmp.addLoadListener(() => {
        // 把大圖再 cover-fit 到 PV_W × PV_H
        const s = new Sprite(bmp);
        const sc = Math.max(PV_W / bmp.width, PV_H / bmp.height);
        s.scale.x = s.scale.y = sc;
        s.x = this._previewSprite.x;
        s.y = this._previewSprite.y;
      });
      this._previewSprite.bitmap = null; // 直接繪到 bitmap
      const canvas = document.createElement("canvas");
      canvas.width = PV_W; canvas.height = PV_H;
      const ctx = canvas.getContext("2d");
      bmp.addLoadListener(() => {
        const sc = Math.max(PV_W / bmp.width, PV_H / bmp.height);
        const dw = Math.round(bmp.width * sc), dh = Math.round(bmp.height * sc);
        const dx = Math.floor((PV_W - dw)/2), dy = Math.floor((PV_H - dh)/2);
        ctx.drawImage(bmp._image, 0,0, bmp.width,bmp.height, dx,dy, dw,dh);
        const out = new Bitmap(PV_W, PV_H);
        out._image = new Image();
        out._image.onload = out._onLoad.bind(out);
        out._image.src = canvas.toDataURL("image/png");
        this._previewSprite.bitmap = out;
      });
    } else {
      // 無縮圖：清空
      this._previewSprite.bitmap = new Bitmap(PV_W, PV_H);
      this._previewSprite.bitmap.fillAll("#111");
      this._previewSprite.bitmap.drawText("（無預覽）", 0, PV_H/2 - 12, PV_W, 24, "center");
    }
    this._infoWindow && this._infoWindow.setInfo(info);
  };

  // 存檔成功 SE
  const DM_saveGame = DataManager.saveGame;
  DataManager.saveGame = async function(savefileId) {
    const ok = await DM_saveGame.call(this, savefileId);
    if (ok && PLAY_SE) AudioManager.playSe({ name: PLAY_SE, volume: 90, pitch: 100, pan: 0 });
    return ok;
  };

  // ---------------- Custom Windows ----------------
  class Window_SnapSaveList extends Window_SavefileList {
    initialize(rect) {
      super.initialize(rect);
      this._previewHook = null;
      this.refresh();
    }
    maxCols() { return LIST_COLS; }
    maxVisibleItems() { return MAX_ROWS * this.maxCols(); }
    spacing() { return 12; }
    itemHeight() { return TH_H + 48; } // 縮圖 + 兩行文字
    drawItem(index) {
      const id = this.indexToSavefileId(index);
      const info = DataManager.savefileInfo(id);
      const rect = this.itemRectWithPadding(index);
      this.resetTextColor();
      // 背板
      this.changePaintOpacity(true);
      this.contents.paintOpacity = 255;
      this.drawRectBorder(rect.x, rect.y, rect.width, rect.height, "#333", 128);

      // 縮圖：若沒有縮好的，動態生成一次並緩存於 info.snapshotThumb
      const drawThumb = (dataUrl) => {
        const bmp = dataUrlToBitmap(dataUrl);
        bmp.addLoadListener(() => {
          this.contents.blt(bmp, 0,0, bmp.width, bmp.height,
            rect.x + 6, rect.y + 6, TH_W, TH_H);
        });
      };
      if (info && info.snapshotFull) {
        if (info.snapshotThumb) {
          drawThumb(info.snapshotThumb);
        } else {
          // 略耗時：縮一次存回 info
          makeThumbnail(info.snapshotFull, TH_W, TH_H).then((t) => {
            info.snapshotThumb = t;
            drawThumb(t);
          });
        }
      } else {
        // 無縮圖時的灰底
        this.contents.fillRect(rect.x + 6, rect.y + 6, TH_W, TH_H, "#222");
        this.drawText("無圖", rect.x + 6, rect.y + TH_H/2 - 12, TH_W, 24, "center");
      }

      // 文字區
      const tx = rect.x + TH_W + 16;
      const line1 = this.savefileIdText(id);
      this.drawText(line1, tx, rect.y + 6, rect.width - TH_W - 22, 24);
      if (info) {
        let line2 = "";
        if (SHOW_MAP && info.mapName) line2 += info.mapName + "   ";
        if (SHOW_PT && info.playtime) line2 += info.playtime + "   ";
        if (SHOW_TS && info.timestampISO) {
          const dt = new Date(info.timestampISO);
          const yyyy = dt.getFullYear();
          const mm = (dt.getMonth()+1).toString().padStart(2,"0");
          const dd = dt.getDate().toString().padStart(2,"0");
          const hh = dt.getHours().toString().padStart(2,"0");
          const mi = dt.getMinutes().toString().padStart(2,"0");
          line2 += `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
        }
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(line2.trim(), tx, rect.y + 6 + 26, rect.width - TH_W - 22, 24);
        this.changeTextColor(ColorManager.normalColor());
      } else {
        this.changeTextColor(ColorManager.textColor(8));
        this.drawText("(空槽)", tx, rect.y + 6 + 26, rect.width - TH_W - 22, 24);
        this.changeTextColor(ColorManager.normalColor());
      }

      // 當前選取移入時右側預覽更新
      if (this._previewHook && this.index() === index) {
        this._previewHook(info || null);
      }
    }
    drawRectBorder(x,y,w,h,color="#666",alpha=128) {
      const c = this.contents;
      const old = c.paintOpacity;
      c.paintOpacity = alpha;
      c.fillRect(x,y,w,1,color);
      c.fillRect(x,y,1,h,color);
      c.fillRect(x+w-1,y,1,h,color);
      c.fillRect(x,y+h-1,w,1,color);
      c.paintOpacity = old;
    }
    indexToSavefileId(index) {
      // 依參數：是否顯示 autosave 槽
      if (SHOW_AUTOSAVE) return index;
      // 不顯示 autosave 時，index=0 對應 savefileId=1
      return index + 1;
    }
    maxItems() {
      const total = DataManager.maxSavefiles() + 1; // 含 0
      return SHOW_AUTOSAVE ? total : total - 1;
    }
    setPreviewHook(fn) { this._previewHook = fn; }
    update() {
      const prev = this.index();
      super.update();
      if (prev !== this.index() && this._previewHook) {
        const id = this.indexToSavefileId(this.index());
        this._previewHook(DataManager.savefileInfo(id));
      }
    }
  }

  class Window_SnapInfo extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this._info = null;
      this.refresh();
    }
    setInfo(info) {
      this._info = info || null;
      this.refresh();
    }
    refresh() {
      this.contents.clear();
      if (!this._info) {
        this.drawText("（沒有資訊）", 0, 0, this.contentsWidth(), 24, "center");
        return;
      }
      let y = 0;
      this.drawText("詳細資訊", 0, y, this.contentsWidth(), 24, "left");
      y += 30;
      if (SHOW_MAP && this._info.mapName) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("地圖", 0, y, 80, 24);
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(this._info.mapName, 90, y, this.contentsWidth()-90, 24);
        y += 26;
      }
      if (SHOW_PT && this._info.playtime) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("遊玩時間", 0, y, 80, 24);
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(this._info.playtime, 90, y, this.contentsWidth()-90, 24);
        y += 26;
      }
      if (SHOW_TS && this._info.timestampISO) {
        const dt = new Date(this._info.timestampISO);
        const yyyy = dt.getFullYear();
        const mm = (dt.getMonth()+1).toString().padStart(2,"0");
        const dd = dt.getDate().toString().padStart(2,"0");
        const hh = dt.getHours().toString().padStart(2,"0");
        const mi = dt.getMinutes().toString().padStart(2,"0");
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("時間", 0, y, 80, 24);
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(`${yyyy}/${mm}/${dd} ${hh}:${mi}`, 90, y, this.contentsWidth()-90, 24);
        y += 26;
      }
      // 你之後想顯示章節、CG旗標等，也可在 DataManager.makeSavefileInfo 補欄位來畫
    }
  }

})();
