/*:
 * @target MZ
 * @plugindesc 刀工小遊戲（橫條＋多段黃金區間＋移動刀線） v1.1（內建食譜，免外部JSON）
 * @author 炭炭 x GPT
 *
 * @help
 * 呼叫方法（事件「腳本」）：
 *   KnifeGame.start(difficulty);
 *   // difficulty: 1~5（決定刀數與黃金區間寬度/速度）
 *
 * 顯示可製作清單並直接進入遊戲（會自動扣素材、發放成敗品）：
 *   KnifeGame.openCookMenu();
 *
 * 遊戲結束時，結果寫入：
 *   變數61：是否成功（大成功/成功=1，失敗=0）
 *   變數62：評級（3=大成功, 2=成功, 1=失敗）
 *   變數63：命中數（落刀命中黃金區間的次數）
 *   （另會觸發 KnifeGame.onResult && KnifeGame.onResult(grade)）
 *
 * 規則：
 *  - 刀數 = difficulty
 *  - 黃金區間寬度(相對條長)：
 *      diff1: 40%, diff2: 30%, diff3: 22%, diff4: 16%, diff5: 10%
 *  - 成功判定：
 *      全中 → 大成功(3)
 *      命中率 ≥ 60% → 成功(2)
 *      其餘 → 失敗(1)
 *
 * @param BGPicture
 * @text 背景圖片(Pictures)
 * @type file
 * @dir img/pictures
 * @default Cook/BG
 *
 * @param CutSE
 * @text 落刀音效(SE)
 * @type file
 * @dir audio/se
 * @default 1101-Cut
 *
 * @param Recipes
 * @text 食譜列表
 * @type struct<Recipe>[]
 * @default []
 */

/*~struct~Recipe:
 * @param id
 * @text 內部ID（可選）
 * @type number
 * @min 1
 * @default 1
 *
 * @param difficulty
 * @text 刀工難度(1~5)
 * @type number
 * @min 1
 * @max 5
 * @default 2
 *
 * @param ingredients
 * @text 食材清單
 * @type struct<Ingredient>[]
 * @default []
 *
 * @param successItemId
 * @text 成功成品的道具ID
 * @type item
 * @default 1
 *
 * @param failureItemId
 * @text 失敗通用道具ID
 * @type item
 * @default 1
 */

/*~struct~Ingredient:
 * @param itemId
 * @text 道具ID
 * @type item
 * @default 1
 *
 * @param amount
 * @text 數量
 * @type number
 * @min 1
 * @default 1
 *
 */

var KnifeGame = KnifeGame || {};
(() => {
  // ────────────────────────────────────────────────────────────────────────────
  // 參數解析
  // ────────────────────────────────────────────────────────────────────────────
  const PLUGIN_NAME = document.currentScript.src
    .split("/")
    .pop()
    .replace(".js", "");
  const P = PluginManager.parameters(PLUGIN_NAME);

  const KNIFE_BG_NAME = String(P.BGPicture || "Cook/BG");
  const CUT_SE_NAME = String(P.CutSE || "Cursor1");

  function parseJSON(str, def) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return def;
    }
  }

  function parseRecipes(paramStr) {
    const raw = parseJSON(paramStr || "[]", []);
    return raw.map((r) => {
      const obj = parseJSON(r, {});
      obj.name = $dataItems[Number(obj.successItemId)].name || "";
      obj.ingredients = parseJSON(obj.ingredients || "[]", []).map((s) =>
        parseJSON(s, {}),
      );
      obj.difficulty = Number(obj.difficulty || 1);
      obj.successItemId = Number(obj.successItemId || 0);
      obj.failureItemId = Number(obj.failureItemId || 0);
      obj.id = Number(obj.id || 0);
      return obj;
    });
  }

  // 讓食譜存在 $gameSystem 以利存檔
  const _DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function () {
    _DataManager_createGameObjects.call(this);
    $gameSystem._recipes = parseRecipes(P.Recipes);
  };

  // 進讀檔時也恢復
  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents.call(this, contents);
    // 若舊存檔不存在食譜，補上當前參數
    if (!$gameSystem._recipes || !Array.isArray($gameSystem._recipes)) {
      $gameSystem._recipes = parseRecipes(P.Recipes);
    }
  };

  const RECIPES = () => ($gameSystem && $gameSystem._recipes) || [];

  function localName(obj) {
    const lang = "tw";
    return obj?.[lang] || obj?.tw || obj || "";
  }

  function hasIngredients(recipe) {
    return recipe.ingredients.every((ing) => {
      const item = $dataItems?.[Number(ing.itemId)];
      return item && $gameParty.numItems(item) >= Number(ing.amount || 1);
    });
  }

  function craftableRecipes() {
    return RECIPES().filter(hasIngredients);
  }

  function consumeIngredients(recipe) {
    recipe.ingredients.forEach((ing) => {
      const item = $dataItems?.[Number(ing.itemId)];
      if (item) $gameParty.loseItem(item, Number(ing.amount || 1), false);
    });
  }

  function gainDish(recipe, success = true, addamount) {
    const itemId = success
      ? Number(recipe.successItemId)
      : Number(recipe.failureItemId);
    if (itemId) $gameParty.gainItem($dataItems[itemId], addamount);
  }

  // 依難度決定參數
  function paramsByDifficulty(d) {
    const clamp = Math.max(1, Math.min(5, d | 0));
    const knifeCount = clamp;
    const widthPctMap = { 1: 0.3, 2: 0.2, 3: 0.18, 4: 0.14, 5: 0.1 };
    const speedMap = { 1: 5, 2: 7, 3: 10, 4: 14, 5: 18 };
    return {
      knifeCount,
      zoneWidthPct: widthPctMap[clamp],
      speed: speedMap[clamp],
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 對外入口：顯示可製作清單
  // ────────────────────────────────────────────────────────────────────────────
  KnifeGame.openCookMenu = function () {
    const list = craftableRecipes();
    if (!list.length) {
      $gameMessage.setSpeakerName("");
      $gameMessage.add("請先收集食材來進行料理。");
      return;
    }
    const choices = list.map((r) => localName(r.name));
    $gameMessage.setChoices(choices.concat(["取消"]), 0, choices.length);
    $gameMessage.setChoiceCallback((n) => {
      if (n === choices.length) return;
      $gameSwitches.setValue(20, true);
      const recipe = list[n];
      consumeIngredients(recipe);
      KnifeGame.start(recipe.difficulty);

      // 由小遊戲回傳最終結果（3=大成功,2=成功,1=失敗）
      KnifeGame.onResult = (grade) => {
        const ok = grade >= 2;
        const addItems = grade === 3 ? 2 : 1;
        gainDish(recipe, ok, addItems);
      };
    });
  };

  // ────────────────────────────────────────────────────────────────────────────
  // 場景：刀工小遊戲
  // ────────────────────────────────────────────────────────────────────────────
  class Scene_KnifeMiniGame extends Scene_Base {
    create() {
      super.create();
      this._difficulty = KnifeGame._difficulty || 1;
      const p = paramsByDifficulty(this._difficulty);

      // 背景底圖（最底層）
      const bmp = ImageManager.loadPicture(KNIFE_BG_NAME);
      this._bgSprite = new Sprite(bmp);
      this.addChild(this._bgSprite);

      const fit = () => {
        const gw = Graphics.width,
          gh = Graphics.height;
        const sw = this._bgSprite.bitmap.width || 1;
        const sh = this._bgSprite.bitmap.height || 1;
        const scale = Math.max(gw / sw, gh / sh);
        this._bgSprite.scale.set(scale, scale);
        this._bgSprite.x = (gw - sw * scale) / 2;
        this._bgSprite.y = (gh - sh * scale) / 2;
      };
      if (bmp.isReady()) fit();
      else bmp.addLoadListener(fit);

      // 半透明暗幕
      this._container = new PIXI.Container();
      this.addChild(this._container);
      const gw = Graphics.width,
        gh = Graphics.height;

      this._bg = new PIXI.Graphics();
      this._bg.beginFill(0x000000, 0.35).drawRect(0, 0, gw, gh).endFill();
      this._container.addChild(this._bg);

      // 說明文字
      this._label = new Sprite(new Bitmap(gw, 80));
      this._label.bitmap.fontSize = 20;
      this._label.bitmap.drawText(
        "請在紅線進到黃色區塊內的時候",
        0,
        8,
        gw,
        32,
        "center",
      );
      this._label.bitmap.drawText(
        "按下滑鼠左鍵 / Space",
        0,
        44,
        gw,
        32,
        "center",
      );
      this._label.y = 300;
      this.addChild(this._label);

      // 橫條參數
      // this._barW = Math.floor(gw * 0.8);
      this._barW = Math.min(Math.floor(gw * 0.6), 600); // 最大不超過 600 像素
      this._barH = 24;
      this._barX = Math.floor((gw - this._barW) / 2);
      this._barY = Math.floor(gh * 0.5);

      // 條底
      this._bar = new PIXI.Graphics();
      this._bar
        .beginFill(0x333333, 1)
        .drawRoundedRect(this._barX, this._barY, this._barW, this._barH, 8)
        .endFill();
      this._container.addChild(this._bar);

      // 黃金區間
      this._zones = new PIXI.Graphics();
      this._container.addChild(this._zones);

      // 產生不重疊區間
      const zones = [];
      const zonePx = Math.floor(this._barW * p.zoneWidthPct);
      const tries = 1000;
      let attempt = 0;
      while (zones.length < p.knifeCount && attempt < tries) {
        attempt++;
        const start =
          this._barX + Math.floor(Math.random() * (this._barW - zonePx));
        const end = start + zonePx;
        const overlap = zones.some((z) => !(end < z.start || start > z.end));
        if (!overlap) zones.push({ start, end });
      }
      while (zones.length < p.knifeCount) {
        const gap = Math.floor((this._barW - zonePx) / (p.knifeCount + 1));
        const start = this._barX + gap * (zones.length + 1);
        zones.push({ start, end: start + zonePx });
      }
      this._zoneData = zones.sort((a, b) => a.start - b.start);

      // 畫出區塊
      this._zones.beginFill(0xf1c40f, 0.9);
      for (const z of this._zoneData) {
        this._zones.drawRoundedRect(
          z.start,
          this._barY,
          z.end - z.start,
          this._barH,
          8,
        );
      }
      this._zones.endFill();

      // 紅色刀線
      this._knife = new PIXI.Graphics();
      this._container.addChild(this._knife);

      this._knifeX = this._barX;
      this._dir = 1;
      this._speed = p.speed;
      this._cutsNeeded = p.knifeCount;
      this._cuts = [];
      this._hits = 0;

      // 顯示剩餘刀數
      this._hud = new Sprite(new Bitmap(gw, 36));
      this._hud.y = this._barY - 60;
      this.addChild(this._hud);
      this.refreshHud();

      // 輸入
      this._clicked = false;
    }

    update() {
      super.update();
      this.updateKnife();
      this.updateInput();
    }

    updateKnife() {
      this._knifeX += this._dir * this._speed;
      if (this._knifeX <= this._barX) {
        this._knifeX = this._barX;
        this._dir = 1;
      }
      const right = this._barX + this._barW;
      if (this._knifeX >= right) {
        this._knifeX = right;
        this._dir = -1;
      }

      this._knife.clear();
      this._knife.lineStyle(3, 0xe74c3c, 1);
      this._knife.moveTo(this._knifeX, this._barY - 10);
      this._knife.lineTo(this._knifeX, this._barY + this._barH + 10);

      this._knife.lineStyle(2, 0xffffff, 0.9);
      for (const x of this._cuts) {
        this._knife.moveTo(x, this._barY - 8);
        this._knife.lineTo(x, this._barY + this._barH + 8);
      }
    }

    updateInput() {
      const okPressed = TouchInput.isTriggered() || Input.isTriggered("ok");
      if (okPressed && !this._clicked) {
        this._clicked = true;
        this.dropKnife();
      }
      if (!TouchInput.isPressed() && !Input.isPressed("ok"))
        this._clicked = false;
    }

    dropKnife() {
      AudioManager.playSe({
        name: CUT_SE_NAME,
        volume: 100,
        pitch: 100,
        pan: 0,
      });

      const x = this._knifeX;
      this._cuts.push(x);

      const hit = this._zoneData.some((z) => x >= z.start && x <= z.end);
      if (hit) this._hits++;

      this.refreshHud();

      if (this._cuts.length >= this._cutsNeeded) {
        this.finishGame();
      }
    }

    refreshHud() {
      const b = this._hud.bitmap;
      b.clear();
      const left = this._cutsNeeded - this._cuts.length;
      b.fontSize = 20;
      b.textColor = "#FFFFFF";
      b.drawText(`剩餘刀數：${left}`, 0, 0, Graphics.width, 36, "center");
    }

    finishGame() {
      const total = this._cutsNeeded;
      const hits = this._hits;
      let grade = 1; // 失敗
      if (hits === total)
        grade = 3; // 大成功
      else if (hits / total >= 0.6) grade = 2; // 成功

      // 寫回
      $gameVariables.setValue(63, hits);
      $gameVariables.setValue(62, grade);
      $gameVariables.setValue(61, grade >= 2 ? 1 : 0);

      if (KnifeGame.onResult) {
        KnifeGame.onResult(grade);
        KnifeGame.onResult = null;
      }
      SceneManager.pop();
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 對外 API
  // ────────────────────────────────────────────────────────────────────────────
  KnifeGame.start = function (difficulty = 1) {
    KnifeGame._difficulty = difficulty;
    SceneManager.push(Scene_KnifeMiniGame);
  };
})();
