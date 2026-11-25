/*:
 * @target MZ
 * @plugindesc 當指定開關打開時，提高內建動畫的 Z 軸層級，使其能覆蓋在圖片之上。
 * @author Gemini
 * * @help
 * 當開關 204 號為 ON 時，所有新播放或播放中的動畫 Z 軸會被提升至 200（預設大於圖片）。
 * 當開關為 OFF 時，則恢復原本的預設 Z 軸。
 */

(() => {
    const SWITCH_ID = 204;       // 指定的開關 ID
    const HIGH_Z_VALUE = 200;    // 開關打開時的 Z 軸高度（RMMZ 圖片預設 Z 軸通常為 100 左右）

    // 攔截動畫雪碧圖的更新流程
    const _Sprite_Animation_update = Sprite_Animation.prototype.update;
    Sprite_Animation.prototype.update = function() {
        _Sprite_Animation_update.call(this);
        this.updateDynamicZIndex();
    };

    // 動態更新 Z 軸的方法
    Sprite_Animation.prototype.updateDynamicZIndex = function() {
        if ($gameSwitches.value(SWITCH_ID)) {
            // 如果開關打開，設定為高層級
            this.z = HIGH_Z_VALUE;
        } else {
            // 如果開關關閉，恢復 RMMZ 預設的動畫 Z 軸（通常為 8）
            this.z = 8;
        }
    };
})();