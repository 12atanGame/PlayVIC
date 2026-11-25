//=============================================================================
// RPG Maker MZ - ShopUI
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 細節調整
 * @author 12atan
 *
 * @help Atan_ShopUI.js
 * 商店UI
 * 道具分類UI
 * 
 */

(() => {

    // 商店UI
    Scene_Shop.prototype.goldWindowRect = function() {
        const ww = 160;
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };
    Scene_Shop.prototype.buyWindowRect = function() {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth;
        const wh = this._dummyWindow.height - this.statusHeight();
        return new Rectangle(wx, wy, ww, wh);
    };
    Scene_Shop.prototype.numberWindowRect = function() {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth;
        const wh = this._dummyWindow.height - this.statusHeight();
        return new Rectangle(wx, wy, ww, wh);
    };
    Scene_Shop.prototype.statusWindowRect = function() {
        const ww = Graphics.boxWidth;
        const wh = this.statusHeight();
        const wx = 0;
        const wy = Graphics.boxHeight - this._helpWindow.height - wh;
        return new Rectangle(wx, wy, ww, wh);
    };
    Scene_Shop.prototype.statusHeight = function() {
        return 68;
    };
    Window_ShopBuy.prototype.priceWidth = function() {
    return 48;
    };

    // 道具分類UI
    Window_ItemCategory.prototype.maxCols = function() {
        return 2;
    };

})();