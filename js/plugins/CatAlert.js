/*:
 * @target MZ
 * @plugindesc [v1.1] 按下Q鍵發出貓叫聲，吸引怪物接近或觸發NPC反應。
 * @author 阿傑
 *
 * @help CatAlert.js
 *
 * 【使用說明】
 * 1. 當玩家在地圖上按下 Q 鍵（PageUp 鍵）時：
 *    - 播放 SE 音效（Cat）。
 *    - 搜尋畫面視野內的事件：
 *      - 帶有 <Monster> 的事件：切換為「接近」主角，碰觸主角時紀錄變數 201 並開啟開關 91。
 *      - 帶有 <NPC> 的事件：不改變移動方式，立即紀錄變數 201（該 NPC 的 ID）並開啟開關 92。
 */

(() => {
  "use strict";

  const SE_FILENAME = "Cat";
  const TARGET_VARIABLE_ID = 201;
  const MONSTER_SWITCH_ID = 91;
  const NPC_SWITCH_ID = 92;

  // 判斷事件標籤，回傳 'MONSTER'、'NPC' 或 null
  function getEventType(event) {
    if (!event || !event.event()) return null;

    // 1. 檢查事件本體備註 (Note)
    const note = event.event().note || "";
    if (/<Monster>/i.test(note)) return "MONSTER";
    if (/<NPC>/i.test(note)) return "NPC";

    // 2. 檢查當前執行頁面的指令「註解 (Comment)」
    const page = event.page();
    if (page && page.list) {
      for (const command of page.list) {
        if (command.code === 108 || command.code === 408) {
          const commentText = command.parameters[0];
          if (/<Monster>/i.test(commentText)) return "MONSTER";
          if (/<NPC>/i.test(commentText)) return "NPC";
        }
      }
    }

    return null;
  }

  // 監聽地圖更新 (捕捉 Q 鍵按下)
  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.call(this);

    if ($gameMap.isEventRunning()) return;

    // RMMZ 中 Q 鍵對應的鍵盤按鍵映射名稱為 'pageup'
    if (Input.isTriggered("e")) {
      if ($gameSwitches.value(21)) {
        this.triggerCatAlert();
      }
    }
  };

  // 執行 Q 鍵呼叫邏輯
  Scene_Map.prototype.triggerCatAlert = function () {
    // 播放 SE 音效
    AudioManager.playSe({ name: SE_FILENAME, volume: 80, pitch: 100, pan: 0 });

    // 取得當前畫面可見的邊界座標
    const startX = $gameMap.displayX();
    const endX = startX + Graphics.width / $gameMap.tileWidth();
    const startY = $gameMap.displayY();
    const endY = startY + Graphics.height / $gameMap.tileHeight();

    // 搜尋地圖上所有在畫面內的事件
    $gameMap.events().forEach((event) => {
      const isInScreen =
        event.x >= startX &&
        event.x < endX &&
        event.y >= startY &&
        event.y < endY;

      if (isInScreen) {
        const type = getEventType(event);

        if (type === "MONSTER") {
          // 怪物：改為接近模式，等待碰撞
          event._moveType = 2; // 2 代表接近主角
          event._attractedByCat = true;
        } else if (type === "NPC") {
          // NPC：不追玩家，直接觸發開關 92 並紀錄 NPC 的 ID
          $gameVariables.setValue(TARGET_VARIABLE_ID, event.eventId());
          $gameSwitches.setValue(NPC_SWITCH_ID, true);
        }
      }
    });
  };

  // 監聽事件更新，判斷怪物是否碰到主角
  const _Game_Event_update = Game_Event.prototype.update;
  Game_Event.prototype.update = function () {
    _Game_Event_update.call(this);

    // 僅針對已被吸引的怪物進行距離檢測
    if (this._attractedByCat && !this._erased) {
      this.checkCatTouchPlayer();
    }
  };

  // 檢測怪物是否碰觸主角
  Game_Event.prototype.checkCatTouchPlayer = function () {
    const player = $gamePlayer;
    const distance = Math.abs(this.x - player.x) + Math.abs(this.y - player.y);

    if (distance <= 1) {
      // 寫入變數 201 與 開關 91
      $gameVariables.setValue(TARGET_VARIABLE_ID, this.eventId());
      $gameSwitches.setValue(MONSTER_SWITCH_ID, true);

      // 清除吸引標記
      this._attractedByCat = false;
    }
  };
})();
