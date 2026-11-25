/*:
 * @target MZ
 * @plugindesc 自製圖片選項清單 (支援滑鼠懸停即時切換/移出還原、\I[n]圖示、X/Y座標與對齊方式)
 * @author 阿傑
 *
 * @help CustomPictureChoice.js
 *
 * 使用方式：
 * 1. 將選項的「一般狀態」與「被選中狀態」底圖放入 img/pictures/ 資料夾中。
 *    (建議兩張圖片的尺寸保持一致，排版會最整齊)
 * 2. 在事件中使用「插件指令」-> 選擇本插件的「顯示自製選項」。
 * 3. 選項文字支援使用 \I[n] 顯示系統圖示 (例如：\I[64] 拔劍出擊)。
 * 4. 設定好底圖、清單座標與對齊方式，並指定一個「變數ID」來接收結果。
 * 5. 玩家選擇後，該變數會獲得對應的選項編號 (第1個選項為 1，第2個為 2，依此類推)。
 *
 * @command showCustomChoices
 * @text 顯示自製選項
 * @desc 呼叫自訂圖片的直式選項清單，事件會暫停直到玩家做出選擇。
 *
 * @arg choices
 * @text 選項清單
 * @type string[]
 * @default ["選項一", "選項二"]
 * @desc 設定要顯示的選項文字，支援 \I[n] 顯示圖示，每行代表一個選項。
 *
 * @arg normalImage
 * @text 一般狀態底圖
 * @type file
 * @dir img/pictures
 * @desc 未被選中時的選項背景圖片。
 *
 * @arg selectedImage
 * @text 被選中狀態底圖
 * @type file
 * @dir img/pictures
 * @desc 游標指到或被選中時的選項背景圖片。
 *
 * @arg listX
 * @text 清單 X 座標
 * @type number
 * @min -9999
 * @default 408
 * @desc 整個選項清單的基準 X 座標（預設 408 為 816 解析度的正中央）。
 *
 * @arg listY
 * @text 清單 Y 座標
 * @type number
 * @min -9999
 * @default 250
 * @desc 整個選項清單最頂端的起始 Y 座標。
 *
 * @arg align
 * @text 水平對齊方式
 * @type select
 * @option 靠左對齊 (以清單X為左邊界)
 * @value left
 * @option 置中對齊 (以清單X為中心點)
 * @value center
 * @option 靠右對齊 (以清單X為右邊界)
 * @value right
 * @default center
 * @desc 決定選項清單相對於「清單 X 座標」的對齊基準，同時影響選項內文字與圖示的對齊。
 *
 * @arg itemSpacing
 * @text 選項垂直間距
 * @type number
 * @min -100
 * @default 12
 * @desc 每個選項之間的上下間隔像素。
 *
 * @arg textPaddingX
 * @text 文字水平內距
 * @type number
 * @default 24
 * @desc 當靠左或靠右對齊時，文字與圖示距離底圖邊緣的留白像素。
 *
 * @arg resultVariableId
 * @text 結果儲存變數
 * @type variable
 * @default 1
 * @desc 玩家決定選項後，將選項編號 (1, 2, 3...) 存入此變數中。
 *
 * @arg defaultIndex
 * @text 預設選中項 (0為全不選中)
 * @type number
 * @min 0
 * @default 0
 * @desc 剛打開選項時預設停留的選項 (0 = 全部為一般狀態，等待滑鼠移入或按方向鍵；1 以上 = 指定第幾項)。
 */

(() => {
  const pluginName = "CustomPictureChoice";

  // 註冊插件指令
  PluginManager.registerCommand(
    pluginName,
    "showCustomChoices",
    function (args) {
      const choices = JSON.parse(args.choices || "[]");
      if (choices.length === 0) return;

      const defaultVal = Number(args.defaultIndex || 0);
      const config = {
        choices: choices,
        normalImage: args.normalImage || "",
        selectedImage: args.selectedImage || "",
        listX: Number(args.listX || 0),
        listY: Number(args.listY || 0),
        align: args.align || "center",
        itemSpacing: Number(args.itemSpacing || 10),
        textPaddingX: Number(args.textPaddingX || 20),
        resultVariableId: Number(args.resultVariableId || 1),
        defaultIndex: defaultVal > 0 ? defaultVal - 1 : -1,
      };

      // 通知 Scene_Map 開啟自製選項，並讓事件解譯器進入等待狀態
      if (SceneManager._scene instanceof Scene_Map) {
        SceneManager._scene.startCustomChoice(config);
        this.setWaitMode("customChoice");
      }
    },
  );

  // 擴充 Game_Interpreter 的等待模式
  const _Game_Interpreter_updateWaitMode =
    Game_Interpreter.prototype.updateWaitMode;
  Game_Interpreter.prototype.updateWaitMode = function () {
    if (this._waitMode === "customChoice") {
      const waiting =
        SceneManager._scene && SceneManager._scene.isCustomChoiceActive();
      if (!waiting) {
        this._waitMode = "";
      }
      return waiting;
    }
    return _Game_Interpreter_updateWaitMode.call(this);
  };

  // 在 Scene_Map 中管理選項容器
  const _Scene_Map_createDisplayObjects =
    Scene_Map.prototype.createDisplayObjects;
  Scene_Map.prototype.createDisplayObjects = function () {
    _Scene_Map_createDisplayObjects.call(this);
    this.createCustomChoiceContainer();
  };

  Scene_Map.prototype.createCustomChoiceContainer = function () {
    this._customChoiceContainer = new Sprite_CustomChoiceList();
    this.addChild(this._customChoiceContainer);
  };

  Scene_Map.prototype.startCustomChoice = function (config) {
    this._customChoiceContainer.setup(config);
  };

  Scene_Map.prototype.isCustomChoiceActive = function () {
    return (
      this._customChoiceContainer && this._customChoiceContainer.isActive()
    );
  };

  // 避免開啟自製選項時，點擊畫面導致玩家角色移動
  const _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
  Scene_Map.prototype.isMapTouchOk = function () {
    if (this.isCustomChoiceActive()) {
      return false;
    }
    return _Scene_Map_isMapTouchOk.call(this);
  };

  // 避免開啟自製選項時，按取消鍵叫出主選單
  const _Scene_Map_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
  Scene_Map.prototype.isMenuEnabled = function () {
    if (this.isCustomChoiceActive()) {
      return false;
    }
    return _Scene_Map_isMenuEnabled.call(this);
  };

  //=========================================================================
  // Sprite_CustomChoiceList: 整個選項清單的容器
  //=========================================================================
  function Sprite_CustomChoiceList() {
    this.initialize(...arguments);
  }

  Sprite_CustomChoiceList.prototype = Object.create(Sprite.prototype);
  Sprite_CustomChoiceList.prototype.constructor = Sprite_CustomChoiceList;

  Sprite_CustomChoiceList.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._active = false;
    this._config = null;
    this._items = [];
    this._index = -1;
    this._normalBitmap = null;
    this._selectedBitmap = null;
    this._iconSetBitmap = null;
    this._isReady = false;
    this._lastTouchX = -1;
    this._lastTouchY = -1;
  };

  Sprite_CustomChoiceList.prototype.isActive = function () {
    return this._active;
  };

  Sprite_CustomChoiceList.prototype.setup = function (config) {
    this.clearItems();
    this._config = config;
    this._index =
      config.defaultIndex < config.choices.length ? config.defaultIndex : -1;
    this._active = true;
    this._isReady = false;
    this._lastTouchX = TouchInput.x;
    this._lastTouchY = TouchInput.y;

    // 預先載入底圖與系統 IconSet，確保取得正確的圖片寬高與圖示
    this._normalBitmap = config.normalImage
      ? ImageManager.loadPicture(config.normalImage)
      : null;
    this._selectedBitmap = config.selectedImage
      ? ImageManager.loadPicture(config.selectedImage)
      : null;
    this._iconSetBitmap = ImageManager.loadSystem("IconSet");
  };

  Sprite_CustomChoiceList.prototype.clearItems = function () {
    for (const item of this._items) {
      this.removeChild(item);
      item.destroy();
    }
    this._items = [];
  };

  Sprite_CustomChoiceList.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (!this._active) return;

    // 等待圖片與 IconSet 載入完成後再建立選項物件
    if (!this._isReady) {
      if (this.checkBitmapsReady()) {
        this.buildItems();
        this._isReady = true;
        this.checkInitialHover();
      }
      return;
    }

    this.updateInput();
  };

  Sprite_CustomChoiceList.prototype.checkBitmapsReady = function () {
    const normalReady = !this._normalBitmap || this._normalBitmap.isReady();
    const selectedReady =
      !this._selectedBitmap || this._selectedBitmap.isReady();
    const iconReady = !this._iconSetBitmap || this._iconSetBitmap.isReady();
    return normalReady && selectedReady && iconReady;
  };

  Sprite_CustomChoiceList.prototype.buildItems = function () {
    const cfg = this._config;
    const baseWidth = this._normalBitmap
      ? this._normalBitmap.width
      : this._selectedBitmap
        ? this._selectedBitmap.width
        : 300;
    const baseHeight = this._normalBitmap
      ? this._normalBitmap.height
      : this._selectedBitmap
        ? this._selectedBitmap.height
        : 56;

    let drawX = cfg.listX;
    if (cfg.align === "center") {
      drawX = cfg.listX - Math.floor(baseWidth / 2);
    } else if (cfg.align === "right") {
      drawX = cfg.listX - baseWidth;
    }

    for (let i = 0; i < cfg.choices.length; i++) {
      const text = cfg.choices[i];
      const item = new Sprite_CustomChoiceItem(
        text,
        this._normalBitmap,
        this._selectedBitmap,
        this._iconSetBitmap,
        baseWidth,
        baseHeight,
        cfg.align,
        cfg.textPaddingX,
      );
      item.x = drawX;
      item.y = cfg.listY + i * (baseHeight + cfg.itemSpacing);
      item.setSelected(i === this._index);
      this.addChild(item);
      this._items.push(item);
    }
  };

  Sprite_CustomChoiceList.prototype.checkInitialHover = function () {
    for (let i = 0; i < this._items.length; i++) {
      if (this._items[i].isBeingTouched()) {
        const lastIndex = this._index;
        this._index = i;
        this.refreshSelection(lastIndex);
        break;
      }
    }
  };

  Sprite_CustomChoiceList.prototype.updateInput = function () {
    const maxItems = this._items.length;
    if (maxItems === 0) return;

    let lastIndex = this._index;
    let usedKeyboard = false;

    // 1. 鍵盤 / 手把上下操作
    if (Input.isRepeated("down")) {
      this._index = this._index < 0 ? 0 : (this._index + 1) % maxItems;
      usedKeyboard = true;
    } else if (Input.isRepeated("up")) {
      this._index =
        this._index < 0
          ? maxItems - 1
          : (this._index - 1 + maxItems) % maxItems;
      usedKeyboard = true;
    }

    // 2. 滑鼠懸停與移出偵測
    const mouseMoved =
      TouchInput.x !== this._lastTouchX || TouchInput.y !== this._lastTouchY;
    this._lastTouchX = TouchInput.x;
    this._lastTouchY = TouchInput.y;

    if (!usedKeyboard && (mouseMoved || TouchInput.isTriggered())) {
      let hoveredIndex = -1;
      for (let i = 0; i < maxItems; i++) {
        if (this._items[i].isBeingTouched()) {
          hoveredIndex = i;
          break;
        }
      }

      this._index = hoveredIndex;

      if (hoveredIndex >= 0 && TouchInput.isTriggered()) {
        this.refreshSelection(lastIndex);
        this.confirmChoice();
        return;
      }
    }

    // 狀態有變化時更新圖片與音效
    if (lastIndex !== this._index) {
      if (this._index >= 0) {
        SoundManager.playCursor();
      }
      this.refreshSelection(lastIndex);
    }

    // 3. 鍵盤 / 手把確認鍵
    if (Input.isTriggered("ok") && this._index >= 0) {
      this.confirmChoice();
    }
  };

  Sprite_CustomChoiceList.prototype.refreshSelection = function (lastIndex) {
    if (lastIndex >= 0 && this._items[lastIndex]) {
      this._items[lastIndex].setSelected(false);
    }
    if (this._index >= 0 && this._items[this._index]) {
      this._items[this._index].setSelected(true);
    }
  };

  Sprite_CustomChoiceList.prototype.confirmChoice = function () {
    SoundManager.playOk();
    const chosenNumber = this._index + 1;
    $gameVariables.setValue(this._config.resultVariableId, chosenNumber);

    this._active = false;
    this.clearItems();
  };

  //=========================================================================
  // Sprite_CustomChoiceItem: 單一選項按鈕 (底圖 + 圖示與文字)
  //=========================================================================
  function Sprite_CustomChoiceItem() {
    this.initialize(...arguments);
  }

  Sprite_CustomChoiceItem.prototype = Object.create(Sprite.prototype);
  Sprite_CustomChoiceItem.prototype.constructor = Sprite_CustomChoiceItem;

  Sprite_CustomChoiceItem.prototype.initialize = function (
    text,
    normalBmp,
    selectedBmp,
    iconSetBmp,
    width,
    height,
    align,
    paddingX,
  ) {
    Sprite.prototype.initialize.call(this);
    this._text = text;
    this._normalBmp = normalBmp;
    this._selectedBmp = selectedBmp;
    this._iconSetBmp = iconSetBmp;
    this._boxWidth = width;
    this._boxHeight = height;
    this._align = align;
    this._paddingX = paddingX;

    this.createBgSprite();
    this.createTextSprite();
  };

  Sprite_CustomChoiceItem.prototype.createBgSprite = function () {
    this._bgSprite = new Sprite();
    if (!this._normalBmp && !this._selectedBmp) {
      const fallbackBmp = new Bitmap(this._boxWidth, this._boxHeight);
      fallbackBmp.fillAll("rgba(0, 0, 0, 0.6)");
      this._bgSprite.bitmap = fallbackBmp;
    }
    this.addChild(this._bgSprite);
  };

  Sprite_CustomChoiceItem.prototype.createTextSprite = function () {
    const textBmp = new Bitmap(this._boxWidth, this._boxHeight);
    textBmp.fontFace = $gameSystem.mainFontFace();
    textBmp.fontSize = $gameSystem.mainFontSize();
    textBmp.outlineWidth = 4;
    textBmp.outlineColor = "rgba(0, 0, 0, 0.8)";

    // 解析字串中的 \I[n] 標記，拆分成「文字片段」與「圖示片段」
    const segments = this.parseTextSegments(this._text);
    const iconWidth = ImageManager.iconWidth || 32;
    const iconHeight = ImageManager.iconHeight || 32;
    const iconGap = 4; // 圖示與前後文字的微調間距

    // 1. 先計算所有片段加起來的總寬度
    let totalWidth = 0;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (seg.type === "icon") {
        totalWidth += iconWidth;
        if (i < segments.length - 1) totalWidth += iconGap;
      } else if (seg.type === "text" && seg.value.length > 0) {
        totalWidth += textBmp.measureTextWidth(seg.value);
        if (i < segments.length - 1 && segments[i + 1].type === "icon") {
          totalWidth += iconGap;
        }
      }
    }

    // 2. 根據對齊方式決定起點 X 座標
    let currentX = 0;
    if (this._align === "left") {
      currentX = this._paddingX;
    } else if (this._align === "center") {
      currentX = Math.floor((this._boxWidth - totalWidth) / 2);
    } else if (this._align === "right") {
      currentX = this._boxWidth - this._paddingX - totalWidth;
    }

    // 3. 逐一繪製圖示與文字
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (seg.type === "icon") {
        this.drawIconOnBitmap(
          textBmp,
          seg.index,
          currentX,
          Math.floor((this._boxHeight - iconHeight) / 2),
        );
        currentX += iconWidth;
        if (i < segments.length - 1) currentX += iconGap;
      } else if (seg.type === "text" && seg.value.length > 0) {
        const segWidth = textBmp.measureTextWidth(seg.value);
        // 留一點餘裕避免描邊被裁切
        textBmp.drawText(
          seg.value,
          currentX,
          0,
          segWidth + 8,
          this._boxHeight,
          "left",
        );
        currentX += segWidth;
        if (i < segments.length - 1 && segments[i + 1].type === "icon") {
          currentX += iconGap;
        }
      }
    }

    this._textSprite = new Sprite(textBmp);
    this.addChild(this._textSprite);
  };

  // 將字串拆解為純文字與 \I[n] 陣列
  Sprite_CustomChoiceItem.prototype.parseTextSegments = function (rawText) {
    const regex = /\\I\[(\d+)\]/gi;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(rawText)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          type: "text",
          value: rawText.slice(lastIndex, match.index),
        });
      }
      segments.push({
        type: "icon",
        index: Number(match[1]),
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < rawText.length) {
      segments.push({
        type: "text",
        value: rawText.slice(lastIndex),
      });
    }

    return segments;
  };

  // 從 IconSet 繪製指定編號的圖示
  Sprite_CustomChoiceItem.prototype.drawIconOnBitmap = function (
    targetBmp,
    iconIndex,
    x,
    y,
  ) {
    if (!this._iconSetBmp) return;
    const pw = ImageManager.iconWidth || 32;
    const ph = ImageManager.iconHeight || 32;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    targetBmp.blt(this._iconSetBmp, sx, sy, pw, ph, x, y);
  };

  Sprite_CustomChoiceItem.prototype.setSelected = function (selected) {
    if (selected && this._selectedBmp) {
      this._bgSprite.bitmap = this._selectedBmp;
    } else if (this._normalBmp) {
      this._bgSprite.bitmap = this._normalBmp;
    }
    if (!this._selectedBmp && this._normalBmp) {
      this._bgSprite.setBlendColor(
        selected ? [255, 255, 255, 60] : [0, 0, 0, 0],
      );
    }
  };

  Sprite_CustomChoiceItem.prototype.isBeingTouched = function () {
    const touchPos = new Point(TouchInput.x, TouchInput.y);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return (
      localPos.x >= 0 &&
      localPos.y >= 0 &&
      localPos.x < this._boxWidth &&
      localPos.y < this._boxHeight
    );
  };
})();
