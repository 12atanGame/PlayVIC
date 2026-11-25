//=============================================================================
// RPG Maker MZ - Atan_Bust
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 支援左、中、右三個方位獨立顯示立繪，且具備多圖層同步功能。
 * @author 12atan & Gemini & GPT
 *
 * @param NoExtraList
 * @text 無配件服裝清單
 * @desc 當檔名包含在這些名稱中時，自動隱藏 Extra 圖層。請用逗號隔開。
 * @default H1, H2, V1
 *
 * @param L_PICS_ID1
 * @text 左側立繪的圖片ID起始設定
 * @type number
 * @default 61
 * @desc (會佔用連續4個圖片ID，例如設定為 101 時，佔用 101 ~ 104 圖片ID)
 *
 * @param C_PICS_ID1
 * @text 中央立繪的圖片ID起始設定
 * @type number
 * @default 65
 * @desc (會佔用連續4個圖片ID，例如設定為 101 時，佔用 101 ~ 104 圖片ID)
 *
 * @param R_PICS_ID1
 * @text 右側立繪的圖片ID起始設定
 * @type number
 * @default 69
 * @desc (會佔用連續4個圖片ID，例如設定為 101 時，佔用 101 ~ 104 圖片ID)
 *
 * @param L_X
 * @text 左側立繪的X位置設定
 * @type number
 * @default 480
 * @desc (圖片中心對齊)
 *
 * @param C_X
 * @text 中間立繪的X位置設定
 * @type number
 * @default 960
 * @desc (圖片中心對齊)
 *
 * @param R_X
 * @text 右側立繪的X位置設定
 * @type number
 * @default 1440
 * @desc (圖片中心對齊)
 *
 * @param LCR_Y
 * @text 立繪的Y位置設定
 * @type number
 * @default 560
 * @desc (圖片中心對齊)
 *
 * * @help
 *
 * 請把 png 立繪放進以下資料夾路徑：
 * img\pictures\Bust\Body\
 * img\pictures\Bust\Face\
 * img\pictures\Bust\Extra\
 * img\pictures\Bust\Effect\
 *
 * 註釋語法：
 * - Bust <方位> <部位> <檔名>  -> 在指定位置變更部件
 * - Bust <方位> 0              -> 隱藏該位置的立繪
 * - Bust <方位> Move <X(相對)> <Y(相對)> <時間(幀數)>  -> 移動該位置的立繪
 *
 * 方位代號：
 * L -> 左側 (X: 480，可自訂)
 * C -> 中間 (X: 960，可自訂)
 * R -> 右邊 (X: 1440，可自訂)
 *
 * 部位代號：
 * Body    -> 身體
 * Face    -> 臉部表情
 * Extra   -> 配飾
 * Effect  -> 臉紅、汗顏等
 *
 * 範例：
 * Bust R Body V1  -> 角色出現在右邊
 * Bust L Body H1  -> 角色出現在左邊
 * Bust R 0        -> 右邊的角色消失
 * Bust 0          -> 畫面中的立繪全部消失
 * Bust C Move -24 0 20 -> 中間的立繪用20幀往左邊位移24px
 * Bust L Wait -> 左邊的立繪變暗後退
 *
 *
 */

(() => {
  const pluginName = "Atan_Bust";
  const parameters = PluginManager.parameters(pluginName);
  const NO_EXTRA_LIST = (parameters["NoExtraList"] || "")
    .split(",")
    .map((s) => s.trim());

  const L_PICS_ID1 = Number(parameters.L_PICS_ID1 || 61);
  const L_PICS_ID2 = L_PICS_ID1 + 1;
  const L_PICS_ID3 = L_PICS_ID1 + 2;
  const L_PICS_ID4 = L_PICS_ID1 + 3;

  const C_PICS_ID1 = Number(parameters.C_PICS_ID1 || 65);
  const C_PICS_ID2 = C_PICS_ID1 + 1;
  const C_PICS_ID3 = C_PICS_ID1 + 2;
  const C_PICS_ID4 = C_PICS_ID1 + 3;

  const R_PICS_ID1 = Number(parameters.R_PICS_ID1 || 69);
  const R_PICS_ID2 = R_PICS_ID1 + 1;
  const R_PICS_ID3 = R_PICS_ID1 + 2;
  const R_PICS_ID4 = R_PICS_ID1 + 3;

  const L_X = Number(parameters.L_X || 480);
  const C_X = Number(parameters.C_X || 960);
  const R_X = Number(parameters.R_X || 1440);
  const LCR_Y = Number(parameters.LCR_Y || 560);

  // 定義三個方位的圖層編號與座標
  const POS_CONFIG = {
    L: {
      x: L_X,
      y: LCR_Y,
      pids: {
        BODY: L_PICS_ID1,
        FACE: L_PICS_ID2,
        EXTRA: L_PICS_ID3,
        EFFECT: L_PICS_ID4,
      },
    },
    C: {
      x: C_X,
      y: LCR_Y,
      pids: {
        BODY: C_PICS_ID1,
        FACE: C_PICS_ID2,
        EXTRA: C_PICS_ID3,
        EFFECT: C_PICS_ID4,
      },
    },
    R: {
      x: R_X,
      y: LCR_Y,
      pids: {
        BODY: R_PICS_ID1,
        FACE: R_PICS_ID2,
        EXTRA: R_PICS_ID3,
        EFFECT: R_PICS_ID4,
      },
    },
  };
  const BUST_EFFECTS = {
    inactiveScale: 50, // 縮小至 96%
    inactiveTone: [-30, -30, -30, 0], // 變暗的色調 [R, G, B, Gray]
    activeScale: 54, // 回復 100%
    activeTone: [0, 0, 0, 0], // 回復正常色調
    dur: 4, // 變化時間 (幀)
  };
  const BUST_ANIM = { swapDur: 1, exitDur: 1 };

  const _command108 = Game_Interpreter.prototype.command108;
  Game_Interpreter.prototype.command108 = function (params) {
    checkBustComment(params[0]);
    return _command108.call(this, params);
  };

  function checkBustComment(line) {
    let txt = line.replace(/\\V\[(\d+)\]/gi, (m, p1) =>
      $gameVariables.value(Number(p1)),
    );
    txt = txt.trim();
    let args = txt.split(/\s+/);

    // 0. 基本指令判定
    if (args[0].toLowerCase() !== "bust") return;

    // 1. 全域隱藏 (Bust 0)
    if (args[1] === "0") {
      Object.values(POS_CONFIG).forEach((config) => {
        Object.values(config.pids).forEach((pid) => hideBust(pid));
      });
      return;
    }

    // 2. 判定方位 (L, C, R)
    const posKey = args[1]?.toUpperCase();
    if (!POS_CONFIG[posKey]) return;
    const config = POS_CONFIG[posKey];

    // 3. 方位隱藏 (Bust C 0) - 這裡必須放在最優先位置
    if (args[2] === "0") {
      Object.values(config.pids).forEach((pid) => hideBust(pid));
      return;
    }

    // 新增：退後變暗指令 (語法：Bust L Wait)
    // --- 修正：正確呼叫 BUST_EFFECTS 參數 ---
    if (args[2]?.toLowerCase() === "wait") {
      Object.values(config.pids).forEach((pid) => {
        const pic = $gameScreen.picture(pid);
        if (pic && pic.opacity() > 0) {
          // 1. 使用定義好的 inactiveScale (90)
          $gameScreen.movePicture(
            pid,
            1,
            pic.x(),
            pic.y() + 30,
            BUST_EFFECTS.inactiveScale,
            BUST_EFFECTS.inactiveScale,
            255,
            0,
            BUST_EFFECTS.dur,
          );

          // 2. 使用定義好的 inactiveTone (變暗)
          $gameScreen.tintPicture(
            pid,
            BUST_EFFECTS.inactiveTone,
            BUST_EFFECTS.dur,
          );
        }
      });
      return;
    }

    // 2. 移動 (Bust L Move X Y Dur)
    if (args[2]?.toLowerCase() === "move") {
      const tx = Number(args[3]);
      const ty = Number(args[4]);
      const dur = Number(args[5]);
      moveGroupBusts(config.pids, tx, ty, dur);
      return;
    }

    // 3. 更換部件 (Bust L Body Filename)
    const type = args[2]?.toUpperCase();
    const filename = args[3];
    if (config.pids[type]) {
      // 這裡最後多傳一個 posKey 進去
      updateLayer(
        args[2],
        config.pids[type],
        filename,
        config.x,
        config.y,
        posKey,
      );
    }
  }

  // 自動讓發話者以外的所有位置進入 Wait 狀態
  function autoWaitOthers(activePosKey) {
    Object.keys(POS_CONFIG).forEach((posKey) => {
      if (posKey !== activePosKey) {
        const config = POS_CONFIG[posKey];
        Object.values(config.pids).forEach((pid) => {
          const pic = $gameScreen.picture(pid);
          // 只有原本亮著的角色才執行退後變暗
          if (
            pic &&
            pic.opacity() > 0 &&
            pic.scaleX() > BUST_EFFECTS.inactiveScale
          ) {
            $gameScreen.movePicture(
              pid,
              1,
              pic.x(),
              pic.y(),
              BUST_EFFECTS.inactiveScale,
              BUST_EFFECTS.inactiveScale,
              255,
              0,
              BUST_EFFECTS.dur,
            );
            $gameScreen.tintPicture(
              pid,
              BUST_EFFECTS.inactiveTone,
              BUST_EFFECTS.dur,
            );
          }
        });
      }
    });
  }

  function updateLayer(type, pid, filename, defaultX, defaultY, posKey) {
    if (!filename || filename === "0" || filename === "null") {
      hideBust(pid);
      return;
    }

    const folder = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

    if (type.toUpperCase() === "EXTRA" && NO_EXTRA_LIST.includes(filename)) {
      hideBust(pid);
      return;
    }

    const fullPath = "Bust/" + folder + "/" + filename;
    const bitmap = ImageManager.loadPicture(fullPath);

    bitmap.addLoadListener(() => {
      if (bitmap.isError()) {
        bitmap._hasError = false;
        bitmap._isLoading = false;
        hideBust(pid);
        return;
      }

      const pic = $gameScreen.picture(pid);
      const isNew = !pic || pic.opacity() === 0;

      // 自動觸發：讓其他人變暗
      autoWaitOthers(posKey);

      // 取得當前縮放，如果是新出現則從 96% 開始，避免直接彈出 100%
      const currentScale = isNew ? BUST_EFFECTS.inactiveScale : pic.scaleX();

      // showPicture：先設定初始狀態
      $gameScreen.showPicture(
        pid,
        fullPath,
        1,
        defaultX,
        defaultY,
        currentScale,
        currentScale,
        isNew ? 0 : 255,
        0,
      );

      // 回復色調
      $gameScreen.tintPicture(pid, BUST_EFFECTS.activeTone, BUST_EFFECTS.dur);

      // movePicture：平滑放大回 100%
      $gameScreen.movePicture(
        pid,
        1,
        defaultX,
        defaultY,
        BUST_EFFECTS.activeScale,
        BUST_EFFECTS.activeScale,
        255,
        0,
        BUST_EFFECTS.dur,
      );
    });
  }

  // 修改：支援相對座標移動
  // 修改：救回維克的頭 - 同步化相對位移
  function moveGroupBusts(pids, dx, dy, dur) {
    const bodyPic = $gameScreen.picture(pids.BODY);
    if (bodyPic) {
      // 只要移動身體，臉部和配件會因為上面的 updatePictures 邏輯強制黏上去
      const targetX = bodyPic.x() + dx;
      const targetY = bodyPic.y() + dy;
      $gameScreen.movePicture(
        pids.BODY,
        1,
        targetX,
        targetY,
        bodyPic.scaleX(),
        bodyPic.scaleY(),
        bodyPic.opacity(),
        bodyPic.blendMode(),
        dur,
      );
    }
  }

  function hideBust(pid) {
    const pic = $gameScreen.picture(pid);
    if (pic) {
      $gameScreen.movePicture(
        pid,
        1,
        pic.x(),
        pic.y(),
        pic.scaleX(),
        pic.scaleY(),
        0,
        0,
        BUST_ANIM.exitDur,
      );

      // 2. 換算時間：RMMZ 預設 60fps，所以 1 幀約 16.6 毫秒
      const delay = (BUST_ANIM.exitDur / 60) * 1000;

      // 3. 等待動畫結束後再抹除
      setTimeout(() => {
        $gameScreen.erasePicture(pid);
      }, delay);
    }
  }

  // --- 終極修正：每一幀強制對齊座標，防止斷頭 ---
  const _Game_Screen_updatePictures = Game_Screen.prototype.updatePictures;
  Game_Screen.prototype.updatePictures = function () {
    _Game_Screen_updatePictures.call(this);

    // 對於 POS_CONFIG 中的每一個方位進行同步鎖定
    Object.values(POS_CONFIG).forEach((config) => {
      const bodyPic = this.picture(config.pids.BODY);
      if (bodyPic && bodyPic.opacity() > 0) {
        // 以 BODY 為基準
        const bx = bodyPic.x();
        const by = bodyPic.y();
        const bsX = bodyPic.scaleX();
        const bsY = bodyPic.scaleY();

        // 強制臉部 (FACE) 與配件 (EXTRA, EFFECT) 鎖定座標與縮放
        [config.pids.FACE, config.pids.EXTRA, config.pids.EFFECT].forEach(
          (pid) => {
            const pic = this.picture(pid);
            if (pic) {
              // 直接操作內部座標，跳過 movePicture 的平滑過渡差
              pic._x = bx;
              pic._y = by;
              pic._scaleX = bsX;
              pic._scaleY = bsY;
            }
          },
        );
      }
    });
  };
})();
