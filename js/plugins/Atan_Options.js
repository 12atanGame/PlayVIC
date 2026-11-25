//=============================================================================
// RPG Maker MZ - Atan_Options
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Atan_Options
 * @author Atan
 *
 * @help Atan_Options.js
 * 調整選項選單中的顯示項目數量。
 * 
 */

(() => {

Scene_Options.prototype.maxCommands = function() {
    return 9;
};

})();