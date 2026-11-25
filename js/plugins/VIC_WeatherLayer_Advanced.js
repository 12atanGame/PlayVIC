/*:
 * @target MZ
 * @plugindesc [VIC 專案專用] 進階天氣層級控制 (將雨夾在圖片之間)
 * @author Gemini
 * * @param Weather Z-Index
 * @text 天氣層級高度
 * @desc 建議設定在 100 左右，使其高於低編號圖片。
 * @default 100
 * * @param UI Picture ID Start
 * @text UI 圖片起始編號
 * @desc 從此編號開始的圖片將會顯示在「雨」之上（不會被淋到）。
 * @default 50
 * * @help
 * 1. 將背景圖（如街道）使用「顯示圖片」指令設為編號 1~49。
 * 2. 將對話框或 UI 圖片設為編號 50 以上。
 * 3. 雨水會自動出現在背景圖之上，但被 UI 圖片遮住。
 */

(() => {
    const pluginName = "VIC_WeatherLayer_Advanced";
    const parameters = PluginManager.parameters(pluginName);
    const weatherZ = Number(parameters['Weather Z-Index'] || 100);
    const uiPictureId = Number(parameters['UI Picture ID Start'] || 50);

    // 重新定義圖片容器的層級管理
    const _Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
    Spriteset_Map.prototype.createUpperLayer = function() {
        _Spriteset_Map_createUpperLayer.call(this);
        
        // 確保天氣對象存在
        if (this._weather) {
            // 將天氣從原始位置移除，準備重新掛載
            // if (this.containsChild(this._weather)) {
                this.removeChild(this._weather);
            // }
            
            // 重新設定天氣的 Z 軸
            this._weather.z = weatherZ;
            
            // 將天氣加進 UpperLayer (與圖片同級)
            this.addChild(this._weather);
            
            // 核心邏輯：動態排序
            // 每當畫面刷新，重新根據 Z 值排列子物件順序
            this.sortChildren();
        }
    };

    // 讓圖片容器內的圖片也能根據編號區分 Z 軸
    const _Sprite_Picture_update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_Picture_update.call(this);
        if (this.picture()) {
            // RMMZ 預設圖片 Z 軸是根據編號給予的
            // 我們這裡強制讓高編號圖片的 Z 軸大幅增加
            const pictureId = this._pictureId;
            if (pictureId >= uiPictureId) {
                this.z = weatherZ + 10; // 確保在雨上方
            } else {
                this.z = weatherZ - 10; // 確保在雨下方
            }
        }
    };

})();