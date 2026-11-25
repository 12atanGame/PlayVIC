/*:
 * @target MZ
 * @plugindesc [VIC] 休的魔力充能
 * @author Gemini
 * @help 
 * 判定標籤：<Charge>
 * 開啟自開關：C
 * 
 */

(() => {
    "use strict";

// --- 實作：休的魔法充能與魔法陣 ---
Scene_Map.prototype.HughSkill = function() {
    AudioManager.playSe({ name: "Magic1", pan: 0, pitch: 160, volume: 60 });

    const px = $gamePlayer.x;
    const py = $gamePlayer.y;

    // 新增：檢查事件「當前頁面」的註釋指令
    const checkCurrentPageNote = function(event, tag) {
        if (!event || !event.page()) return false;
        // 遍歷當前頁面的所有指令
        return event.list().some(command => {
            // 408 是註釋指令的代碼
            if (command.code === 408 || command.code === 108) {
                return command.parameters[0].includes(tag);
            }
            return false;
        });
    };

    // 1. 生成地面魔法陣 (預留你之後的 RMXP 改圖)
    const magicCircle = new Sprite();
    magicCircle.bitmap = ImageManager.loadPicture("Battle/MagicCircle"); // 假設檔名
    magicCircle.anchor.x = 0.5;
    magicCircle.anchor.y = 0.5;
    // 將座標設定在玩家腳下
    const tw = $gameMap.tileWidth();
    const th = $gameMap.tileHeight();
    magicCircle.x = ($gameMap.adjustX(px) + 0.5) * tw;
    magicCircle.y = ($gameMap.adjustY(py) + 0.5) * th;
    magicCircle.opacity = 0;
    magicCircle.blendMode = 1; 

    // 簡單的魔法陣動畫：淡入、旋轉、淡出
    magicCircle.update = function() {
        if (this.opacity < 255 && !this._fadingOut) {
            this.opacity += 20;  
            this.scale.x = 1;    
        } else {
            this._fadingOut = true;
            this.opacity -= 10;
            this.scale.x += 0.02;
        }
        // this.rotation += 0.05; // 讓魔法陣旋轉
        if (this.opacity <= 0) {
            if (this.parent) this.parent.removeChild(this);
            this.destroy();
        }
    };
    this._spriteset.addChild(magicCircle);

    // 2. 執行充能判定
    let isSuccess = false; // 紀錄是否有成功觸發
    
    $gameMap.events().forEach(event => {
        const dx = Math.abs(event.x - px);
        const dy = Math.abs(event.y - py);
        if (dx <= 1 && dy <= 1) {
            const isChargeable = event.event().note.includes("<Charge>") || 
                                checkCurrentPageNote(event, "<Charge>");
            
            // 檢查是否還沒被開啟，避免重疊觸發
            const key = [$gameMap.mapId(), event.eventId(), 'C'];
            if (isChargeable && !$gameSelfSwitches.value(key)) {
                // 開啟 51 號開關與獨立開關 C
                $gameSwitches.setValue(51, true);
                $gameSelfSwitches.setValue(key, true);
                isSuccess = true;
            }
        }
    });

    // 3. 成功時的反饋效果
    if (isSuccess) {
        // 畫面震動：[力度, 速度, 時長]
        // $gameScreen.startShake(5, 5, 20); 
        
        // 畫面閃爍：[顏色(RGBO), 時長]
        $gameScreen.startFlash([255, 255, 255, 32], 40); 
        
        // 額外的能量疏通音效
        AudioManager.playSe({ name: "Recovery", pan: 0, pitch: 150, volume: 80 });
    }

};
})();