/*:
 * @target MZ
 * @plugindesc 多重 BGS 擴充：支援存檔紀錄與事件距離感應音量。
 * @author 你的名字
 *
 * @command PlayEventBgs
 * @text 綁定事件 BGS
 * @arg eventId
 * @type number
 * @default 0
 * @arg name
 * @type file
 * @dir audio/bgs
 * @arg maxVolume
 * @type number
 * @default 90
 * @arg radius
 * @type number
 * @default 8
 */

(() => {
    "use strict";

    const pluginName = "MultiBgsPro";

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._eventBgsList = {}; 
    };

    PluginManager.registerCommand(pluginName, "PlayEventBgs", function(args) {
        const eventId = Number(args.eventId) || this._eventId;
        const name = args.name;
        if (!name) return;

        $gameSystem._eventBgsList[eventId] = {
            name: name,
            maxVolume: Number(args.maxVolume || 90),
            radius: Number(args.radius || 8),
            mapId: $gameMap._mapId
        };
    });

    AudioManager._eventBgsBuffers = {};

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);

        // this.updateEventBgsVolume();

        // 每 6 幀才更新一次音量的範例
        if (Graphics.frameCount % 6 === 0) {
            this.updateEventBgsVolume();
        }
    };

    Scene_Map.prototype.updateEventBgsVolume = function() {
        const list = $gameSystem._eventBgsList;
        if (!list) return;

        // 注意這裡：迴圈定義的變數名是 key
        for (const key in list) {
            const data = list[key];
            const eId = Number(key); // 將 key 轉回數字格式的事件 ID
            
            if (data.mapId !== $gameMap._mapId) {
                if (AudioManager._eventBgsBuffers[eId]) {
                    AudioManager._eventBgsBuffers[eId].stop();
                    delete AudioManager._eventBgsBuffers[eId];
                }
                continue;
            }

            if (!AudioManager._eventBgsBuffers[eId]) {
                const buffer = AudioManager.createBuffer("bgs/", data.name);
                buffer.volume = 0; // 初始音量歸零防止爆音
                buffer.play(true, 0);
                AudioManager._eventBgsBuffers[eId] = buffer;
            }

            const event = $gameMap.event(eId);
            const buffer = AudioManager._eventBgsBuffers[eId];
            
            if (event && buffer) {
                // 1. 距離與音量計算
                const dx = $gamePlayer.x - event.x;
                const dy = $gamePlayer.y - event.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                const configVol = ConfigManager.bgsVolume / 100;
                let volModifier = Math.max(0, 1 - (dist / data.radius));
                
                // 2. [新增] Pan 左右聲道計算
                const panRange = 5; // 距離差幾格時達到全聲道偏移
                let targetPan = (-dx / panRange).clamp(-1, 1);

                // 3. 套用平滑過渡 (Lerp)
                const targetVol = (data.maxVolume / 100) * volModifier * configVol;
                buffer.volume = buffer.volume + (targetVol - buffer.volume) * 0.1;
                
                // 套用 Pan 平滑過渡
                const currentPan = buffer.pan || 0;
                buffer.pan = currentPan + (targetPan - currentPan) * 0.1;
            }
        }
    };

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        _Scene_Map_terminate.call(this);
        for (const id in AudioManager._eventBgsBuffers) {
            AudioManager._eventBgsBuffers[id].stop();
            delete AudioManager._eventBgsBuffers[id];
        }
    };

})();