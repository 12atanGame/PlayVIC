/*:
 * @target MZ
 * @plugindesc [VIC] 地圖射擊系統 - 維克的手槍攻擊
 * @author Gemini
 */

(() => {
    "use strict";

    // 設定觸發按鍵：'s' 鍵對應 RMMZ 的 'ok'
    const SHOOT_BUTTON = 'f'; 

    // --- 1. 子彈類別定義 ---
    // 使用 class 語法確保 super() 運作正常
    class Sprite_Bullet extends Sprite {
        constructor(x, y, d) {
            super(); // 正確呼叫 Sprite 的建構子
            this.initBullet(x, y, d);
        }

        initBullet(x, y, d) {
            // 建立一個 16x16 的透明畫布
            this.bitmap = new Bitmap(16, 16); 
            
            // 畫出圓形子彈
            // 參數：(中心點X, 中心點Y, 半徑, 顏色)
            this.bitmap.drawCircle(8, 8, 3, "#ffffde"); 
            
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            
            this._mapX = x;
            this._mapY = y;
            this._direction = d;
            this._speed = 0.4; 
            this._range = 6;   
            this._distanceTraveled = 0;
            this.updatePosition();
        }

        update() {
            super.update(); // 呼叫父類的 update
            this.move();
            this.checkCollision();
        }

        move() {
            if (this._direction === 2) this._mapY += this._speed;
            if (this._direction === 4) this._mapX -= this._speed;
            if (this._direction === 6) this._mapX += this._speed;
            if (this._direction === 8) this._mapY -= this._speed;

            this._distanceTraveled += this._speed;
            this.updatePosition();

            if (this._distanceTraveled >= this._range) {
                this.destroyBullet();
            }
        }

        updatePosition() {
            const tw = $gameMap.tileWidth();
            const th = $gameMap.tileHeight();
            this.x = ($gameMap.adjustX(this._mapX) + 0.5) * tw;
            this.y = ($gameMap.adjustY(this._mapY) + 0.5) * th;
        }

        checkCollision() {
            const tx = Math.round(this._mapX);
            const ty = Math.round(this._mapY);
            
            $gameMap.eventsXy(tx, ty).forEach(event => {
                if (event.event().note.includes("<Monster>")) {
                    // 擊中魔獸，開啟獨立開關 A
                    $gameSelfSwitches.setValue([$gameMap.mapId(), event.eventId(), 'A'], true);
                    this.destroyBullet();
                }else if (event.event().note.includes("<Boss>")){
                    // 擊中BOSS，開啟獨立開關 A
                    $gameSelfSwitches.setValue([$gameMap.mapId(), event.eventId(), 'A'], true);
                    this.destroyBullet();                    
                }
            });
        }

        destroyBullet() {
            if (this.parent) this.parent.removeChild(this);
            this.destroy();
        }
    }

    // --- 2. 注入地圖場景更新邏輯 ---
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        // 當對話框沒開啟且場景啟動時，監測按鍵
        if (this.isActive() && !$gameMessage.isBusy()) {
            if (Input.isTriggered(SHOOT_BUTTON)) {
                // 取得目前隊伍的第一人 (領隊)
                const leader = $gameParty.leader().actorId();
                if (leader === 1) {
                    // 執行維克的手槍射擊
                    this.vicShoot(); 
                } 
            }
        }
    };

    Scene_Map.prototype.vicShoot = function() {
        // 槍聲效果 (可依需求更換 SE)
        const se = { name: "Gun1", pan: 0, pitch: 100, volume: 90 };
        AudioManager.playSe(se);

        const x = $gamePlayer.x;
        const y = $gamePlayer.y;
        const d = $gamePlayer.direction();
        
        // 建立子彈並加入目前地圖的精靈層
        const bullet = new Sprite_Bullet(x, y, d);
        this._spriteset.addChild(bullet);
    };

})();