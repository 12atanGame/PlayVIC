/*:
 * @target MZ
 * @plugindesc [VIC] 雙主角地圖戰鬥系統 (維克射擊 & 休體術)
 * @author Gemini
 * @help
 * 1. 統一觸發鍵：'3' 鍵。
 * 2. 維克 (Actor ID 1) 為領隊：發射金色圓形子彈。
 * 3. 休 (Actor ID 2) 為領隊：發動近戰魔法體術（帶擊退）。
 * 4. 判定標籤：支援 <Monster> 與 <Boss>。
 */

(() => {
  "use strict";

  const ATTACK_BUTTON = "e"; // 統一使用 e 鍵

  // --- 1. 維克的子彈精靈 ---
  // --- 修正：維克的馬鈴薯子彈精靈 ---
  class Sprite_VicBullet extends Sprite {
    constructor(x, y, d) {
      super();
      this._isDestroying = false; // 新增：防止重複銷毀旗標
      this.initBullet(x, y, d);
    }

    initBullet(x, y, d) {
      // 讀取圖片
      this.bitmap = ImageManager.loadPicture("Battle/Potato");
      this.anchor.x = 0.5;
      this.anchor.y = 0.5;
      this._mapX = x;
      this._mapY = y;
      this._direction = d;
      this._speed = 0.3;
      this._range = 9;
      this._distanceTraveled = 0;
      this._rotationSpeed = 0.15;
      this.updatePosition();
    }

    update() {
      super.update();

      if (this._isDestroying) return;

      // 1. 確保圖片已經載入（避免 bitmap 為 null）ddd
      if (this.bitmap && this.bitmap.isReady()) {
        this.move();
        this.checkCollision();

        // 2. 使用標準的 rotation，但確保 this 存在
        // 如果 rotation 報錯，改用 angle (角度制) 通常更穩定
        try {
          this.angle += 10; // angle 是 PIXI 提供給 Sprite 的便利屬性，10 度 10 度轉
        } catch (e) {
          // 如果連 angle 都報錯，再嘗試 _rotation
          this._rotation += 0.15;
        }
      }
    }

    move() {
      if (this._direction === 2) this._mapY += this._speed;
      if (this._direction === 4) this._mapX -= this._speed;
      if (this._direction === 6) this._mapX += this._speed;
      if (this._direction === 8) this._mapY -= this._speed;
      this._distanceTraveled += this._speed;
      this.updatePosition();
      if (this._distanceTraveled >= this._range) this.destroyBullet();
    }

    updatePosition() {
      const tw = $gameMap.tileWidth();
      const th = $gameMap.tileHeight();
      this.x = ($gameMap.adjustX(this._mapX) + 0.5) * tw;
      this.y = ($gameMap.adjustY(this._mapY) + 0.5) * th;
    }

    checkCollision() {
      if (this._isDestroying) return;
      const tx = Math.round(this._mapX);
      const ty = Math.round(this._mapY);

      $gameMap.eventsXy(tx, ty).forEach((event) => {
        const key = [$gameMap.mapId(), event.eventId(), "A"];
        if ($gameSelfSwitches.value(key) === true) return;

        // --- 修改判定方式：同時檢查「外頁備註」與「內頁註釋」 ---
        const isTarget =
          event.event().note.includes("<Monster>") ||
          event.event().note.includes("<Boss>") ||
          checkCurrentPageNote(event, "<Monster>") ||
          checkCurrentPageNote(event, "<Boss>");

        if (isTarget) {
          $gameSelfSwitches.setValue(key, true);
          this.destroyBullet();
        }
      });
    }

    // --- 關鍵修正：更安全的銷毀流程 ---
    destroyBullet() {
      if (this._isDestroying) return;

      this._isDestroying = true; // 標記為銷毀中

      // 1. 物理移除：將座標移到地圖外 (-1, -1)，確保不會擋住下一發子彈
      this._mapX = -1;
      this._mapY = -1;

      // 2. 視覺移除：立即隱藏，不再等待下一幀
      this.visible = false;
      this.opacity = 0;

      // 確保精靈從父級容器移除
      if (this.parent) {
        this.parent.removeChild(this);
      }

      this._isDestroying = false;

      // 呼叫 PIXI 與 RMMZ 的原生 destroy
      // 使用 { children: true, texture: false } 確保不誤刪共用的馬鈴薯貼圖
      this.destroy({ children: true, texture: false });
    }
  }

  // --- 2. 休的衝擊波精靈 ---
  class Sprite_HueShockwave extends Sprite {
    constructor(x, y) {
      super();
      this.initWave(x, y);
    }

    initWave(x, y) {
      this.bitmap = new Bitmap(128, 128);
      const ctx = this.bitmap.context;
      const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
      grad.addColorStop(0, "rgba(135, 206, 250, 0.8)"); // 藍色漸層
      grad.addColorStop(1, "rgba(0, 0, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(64, 64, 108, 0, Math.PI * 2);
      ctx.fill();
      this.anchor.x = 0.5;
      this.anchor.y = 0.5;
      this._mapX = x;
      this._mapY = y;
      this._scaleValue = 0.1;
      this.updatePosition();
    }

    update() {
      super.update();
      this._scaleValue += 0.15;
      this.scale.x = this._scaleValue;
      this.scale.y = this._scaleValue;
      this.opacity -= 15;
      if (this.opacity <= 0) this.destroyWave();
    }

    updatePosition() {
      const tw = $gameMap.tileWidth();
      const th = $gameMap.tileHeight();
      this.x = ($gameMap.adjustX(this._mapX) + 0.5) * tw;
      this.y = ($gameMap.adjustY(this._mapY) + 0.5) * th;
    }

    destroyWave() {
      if (this.parent) this.parent.removeChild(this);
      this.destroy();
    }
  }

  // --- 3. 整合判定邏輯 ---
  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.call(this);
    if (this.isActive() && !$gameMessage.isBusy()) {
      if (Input.isTriggered(ATTACK_BUTTON)) {
        this.executeMapAction();
      } else if ($gameSwitches.value(59)) {
        this.executeMapAction();
        $gameSwitches.setValue(59, false);
      }
    }
  };

  Scene_Map.prototype.executeMapAction = function () {
    const leader = $gameParty.leader();
    if (!leader) return;

    if (leader.actorId() === 1) {
      // 維克 (射擊)
      this.vicAction();
    } else if (leader.actorId() === 2) {
      const actor = $gameActors.actor(2);

      if (actor && actor.mp >= 4) {
        actor.gainMp(-4);

        // 休 (體術)
        this.hueAction();
      } else {
        // 播放無法施法音效
        const se2 = { name: "000_VIC_Oo_Lab", pan: 0, pitch: 120, volume: 90 };
        AudioManager.playSe(se2);
      }
    }
  };

  Scene_Map.prototype.vicAction = function () {
    AudioManager.playSe({ name: "Jump1", pan: 0, pitch: 100, volume: 60 });
    const bullet = new Sprite_VicBullet(
      $gamePlayer.x,
      $gamePlayer.y,
      $gamePlayer.direction(),
    );
    this._spriteset.addChild(bullet);
  };

  Scene_Map.prototype.hueAction = function () {
    AudioManager.playSe({
      name: "Summer sound material collection/SE_attack_massive_1",
      pan: 0,
      pitch: 100,
      volume: 60,
    });
    const wave = new Sprite_HueShockwave($gamePlayer.x, $gamePlayer.y);
    this._spriteset.addChild(wave);

    const px = $gamePlayer.x;
    const py = $gamePlayer.y;

    $gameMap.events().forEach((event) => {
      const dx = Math.abs(event.x - px);
      const dy = Math.abs(event.y - py);
      const key = [$gameMap.mapId(), event.eventId(), "A"];

      if (dx <= 2 && dy <= 2) {
        // 使用新的判定方式
        const isMonster =
          event.event().note.includes("<Monster>") ||
          checkCurrentPageNote(event, "<Monster>");
        const isBoss =
          event.event().note.includes("<Boss>") ||
          checkCurrentPageNote(event, "<Boss>");

        if (isMonster && $gameSelfSwitches.value(key) === false) {
          event.jump(event.x - px, event.y - py);
          $gameSelfSwitches.setValue(key, true);
        } else if (isBoss && $gameSelfSwitches.value(key) === false) {
          $gameSelfSwitches.setValue(key, true);
        }
      }
    });
  };

  // 新增：檢查事件「當前頁面」的註釋指令
  const checkCurrentPageNote = function (event, tag) {
    if (!event || !event.page()) return false;
    // 遍歷當前頁面的所有指令
    return event.list().some((command) => {
      // 408 是註釋指令的代碼
      if (command.code === 408 || command.code === 108) {
        return command.parameters[0].includes(tag);
      }
      return false;
    });
  };
})();
