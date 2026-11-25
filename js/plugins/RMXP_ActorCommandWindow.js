/*:
 * @target MZ
 * @plugindesc 正面戰鬥UI調整：完美跳過隊伍選單、均分狀態寬度、指令浮動於頭頂
 * @author 阿傑
 *
 * @param Actor Cmd Offset X
 * @text X軸微調
 * @desc 角色指令選單相對於臉圖中心的X軸偏移量
 * @default 0
 *
 * @param Actor Cmd Offset Y
 * @text Y軸微調
 * @desc 角色指令選單相對於狀態視窗頂部的Y軸偏移量 (負數往上)
 * @default -185
 *
 * @help
 * RMXP_ActorCommandWindow.js
 *
 * 完美隱藏隊伍選單，同時確保角色指令選單能正常跳出與跟隨。
 */

(() => {
  const parameters = PluginManager.parameters("RMXP_ActorCommandWindow");
  const offsetX = Number(parameters["Actor Cmd Offset X"] || 0);
  const offsetY = Number(parameters["Actor Cmd Offset Y"] || -185);

  // ------------------------------------------------------------------------
  // 1. 根據目前隊伍人數自動均分狀態視窗寬度並置中
  // ------------------------------------------------------------------------
  const _Scene_Battle_statusWindowRect =
    Scene_Battle.prototype.statusWindowRect;
  Scene_Battle.prototype.statusWindowRect = function () {
    const rect = _Scene_Battle_statusWindowRect.call(this);
    const memberCount = Math.max(1, $gameParty.battleMembers().length);
    rect.width = memberCount * 130;
    rect.x = Math.floor((Graphics.boxWidth - rect.width) / 2);
    return rect;
  };

  Scene_Battle.prototype.updateStatusWindowPosition = function () {
    if (this._statusWindow) {
      this._statusWindow.x = Math.floor(
        (Graphics.boxWidth - this._statusWindow.width) / 2,
      );
    }
  };

  // ------------------------------------------------------------------------
  // 2. 乾淨地將隊伍選單 (Window_PartyCommand) 隱藏並直接轉交給角色指令
  // ------------------------------------------------------------------------
  const _Window_PartyCommand_initialize =
    Window_PartyCommand.prototype.initialize;
  Window_PartyCommand.prototype.initialize = function (rect) {
    _Window_PartyCommand_initialize.call(this, rect);
    this.visible = false;
    this.deactivate();
  };

  // 攔截隊伍選單的開啟動作，一但遊戲想叫出它，直接安全地改為讓角色開始輸入指令
  const _Scene_Battle_startPartyCommandSelection =
    Scene_Battle.prototype.startPartyCommandSelection;
  Scene_Battle.prototype.startPartyCommandSelection = function () {
    if (BattleManager.isBattleEnd()) {
      _Scene_Battle_startPartyCommandSelection.call(this);
      return;
    }

    // 直接啟動第一個角色的指令輸入，不顯示隊伍選單
    this.commandFight();
  };

  // ------------------------------------------------------------------------
  // 3. 角色指令選單 (攻擊 / 魔法 / 防禦 / 道具) 浮動在角色臉圖上方
  // ------------------------------------------------------------------------
  const _Window_ActorCommand_open = Window_ActorCommand.prototype.open;
  Window_ActorCommand.prototype.open = function () {
    _Window_ActorCommand_open.call(this);
    this.updateCustomPosition();
  };

  const _Window_ActorCommand_update = Window_ActorCommand.prototype.update;
  Window_ActorCommand.prototype.update = function () {
    _Window_ActorCommand_update.call(this);
    if (this.active && this.isOpen()) {
      this.updateCustomPosition();
    }
  };

  Window_ActorCommand.prototype.updateCustomPosition = function () {
    const scene = SceneManager._scene;
    if (this._actor && scene && scene._statusWindow) {
      const statusWin = scene._statusWindow;
      const index = $gameParty.battleMembers().indexOf(this._actor);

      if (index >= 0) {
        const rect = statusWin.itemRect(index);
        const globalX = statusWin.x + rect.x;
        const globalY = statusWin.y;

        let x = Math.floor(globalX + rect.width / 2 - this.width / 2 + offsetX);
        let y = Math.floor(globalY + offsetY);

        // 邊界防護
        x = Math.max(10, Math.min(x, Graphics.boxWidth - this.width - 10));
        y = Math.max(10, y);

        this.x = x;
        this.y = y;
      }
    }
  };
})();
