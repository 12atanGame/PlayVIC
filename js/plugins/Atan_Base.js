//=============================================================================
// RPG Maker MZ - Base
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 字體調整
 * @author 12atan
 *
 * @help Atan_Base.js
 *
 */

(() => {
  ColorManager.itemBackColor1 = function () {
    return "rgba(0, 0, 0, 0.4)";
  };

  ColorManager.itemBackColor2 = function () {
    return "rgba(0, 0, 0, 0.4)";
  };

  // 淡色底深色字訊息
  // ColorManager.itemBackColor1 = function() {
  //     return "rgba(255, 255, 255, 0.2)";
  // };

  // ColorManager.itemBackColor2 = function() {
  //     return "rgba(255, 255, 255, 0.2)";
  // };

  // ColorManager.outlineColor = function() {
  // return "rgba(0, 0, 0, 0)";
  // };

  ColorManager.systemColor = function () {
    return this.textColor(6);
  };

  // Window_Base.prototype.lineHeight = function() {
  //     return 48;
  // };

  Window_BattleStatus.prototype.maxCols = function () {
    return 2;
  };

  // // /** 遊戲永動設定 */
  SceneManager.isGameActive = function () {
    return true;
  };
})();
