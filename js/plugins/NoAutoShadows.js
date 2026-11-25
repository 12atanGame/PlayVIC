/*:
 * @target MZ
 * @plugindesc 完全去除地圖牆面與地形的自動陰影繪製。
 * @author Custom
 *
 * @help
 * 啟用此插件後，地圖上的自動陰影將不會被繪製。
 */

(() => {
    // 覆蓋 Tilemap 的陰影繪製方法，將其重置為空函式
    Tilemap.prototype._addShadow = function(layer, shadowBits, x, y) {
        // 不執行任何陰影繪製 logic
    };
})();