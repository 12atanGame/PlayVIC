/*:
 * @target MZ
 * @plugindesc 路徑存取版：支援 8 個存檔位、全螢幕修復與 8 個曲名變數。
 * @author Gemini
 *
 * @param StartVariableID
 * @text 起始變數 ID (連續 8 個)
 * @desc 請設定第一個變數的編號。插件會自動使用該編號開始的連續 8 個變數來存儲曲名。
 * @type variable
 * @default 11
 *
 * @command PlayFromPath
 * @text 選擇外部音樂並存入指定位置
 * @arg slot
 * @text 儲存位置 (1-8)
 * @type number
 * @min 1
 * @max 8
 * @default 1
 *
 * @command PlayFromSlot
 * @text 播放指定位置的音樂
 * @arg slot
 * @text 播放位置 (1-8)
 * @type number
 * @min 1
 * @max 8
 * @default 1
 *
 * @command ResumeExternalMusic
 * @text 繼續播放外部音樂
 *
 * @command StopExternalMusic
 * @text 暫停外部音樂播放
 */

(() => {
    "use strict";

    const pluginName = "PlayerMusic";
    const parameters = PluginManager.parameters(pluginName);
    // 取得起始變數 ID
    const startVarId = Number(parameters['StartVariableID'] || 11);

    function checkSlots() {
        if (!$gameSystem._externalBgmSlots) {
            $gameSystem._externalBgmSlots = new Array(9).fill(null);
        }
    }

    // 擷取檔名並存入對應的變數 (根據 slot)
    function updateMusicNameVariable(slot, filePath) {
        if (!filePath) return;
        // 取得純檔名
        const fileName = filePath.split(/[\\/]/).pop().replace(/\.[^/.]+$/, "");
        // 計算該 slot 對應的變數 ID (例如 slot 1 對應 startVarId + 0)
        const targetVarId = startVarId + (slot - 1);
        $gameVariables.setValue(targetVarId, fileName);
    }

    // 重新整理所有已儲存欄位的曲名到變數中 (用於讀檔後或初始化)
    function refreshAllNameVariables() {
        checkSlots();
        for (let i = 1; i <= 8; i++) {
            const path = $gameSystem._externalBgmSlots[i];
            if (path) {
                const fileName = path.split(/[\\/]/).pop().replace(/\.[^/.]+$/, "");
                $gameVariables.setValue(startVarId + (i - 1), fileName);
            } else {
                $gameVariables.setValue(startVarId + (i - 1), ""); // 空位則清空變數
            }
        }
    }

    function selectAndSave(slot) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/mp3, audio/ogg, audio/wav';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            
            // 修復全螢幕跳出
            if (Utils.isNwjs() && Graphics._isFullScreen()) {
                setTimeout(() => {
                    nw.Window.get().enterFullscreen();
                }, 100);
            }

            if (!file || !file.path) return;
            
            checkSlots();
            $gameSystem._externalBgmSlots[slot] = file.path;
            // 更新對應變數
            updateMusicNameVariable(slot, file.path);
            playExternalMusic(file.path);
        };
        input.click();
    }

    function playExternalMusic(filePath) {
        if (!filePath) return;

        AudioManager.stopBgm();

        if (window._currentExtAudio) {
            window._currentExtAudio.pause();
            window._currentExtAudio = null;
        }

        const fileUrl = "file:///" + filePath.replace(/\\/g, "/");
        const audio = new Audio(fileUrl);
        audio.loop = true;
        audio.volume = (ConfigManager.bgmVolume / 100) * (AudioManager._bgmVolume / 100);
        
        audio.play().catch(e => console.error("播放失敗：", e));
        window._currentExtAudio = audio;
        $gameSystem._lastExternalPath = filePath;
    }

    // --- 音量與自動播放邏輯 ---
    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);
        if (window._currentExtAudio) {
            let targetVolume = (ConfigManager.bgmVolume / 100) * (AudioManager._bgmVolume / 100);
            if (AudioManager._meBuffer && AudioManager._meBuffer.isPlaying()) {
                targetVolume = 0; 
            }
            window._currentExtAudio.volume = targetVolume;
        }
    };

    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        checkSlots();
        // 每次進入地圖時重新整理變數，確保顯示正確
        refreshAllNameVariables();

        if ($gameSystem._lastExternalPath && $gameSwitches.value(46) && $gameMap._mapId === 6) {
            if (!window._currentExtAudio) {
                playExternalMusic($gameSystem._lastExternalPath);
            }
        } else {
            if (window._currentExtAudio) {
                window._currentExtAudio.pause();
                window._currentExtAudio = null;
                $gameMap.autoplay();
            }
        }
    };

    // --- 插件指令 ---
    PluginManager.registerCommand(pluginName, "PlayFromPath", args => {
        selectAndSave(parseInt(args.slot));
    });

    PluginManager.registerCommand(pluginName, "PlayFromSlot", args => {
        const slot = parseInt(args.slot);
        checkSlots();
        const path = $gameSystem._externalBgmSlots[slot];
        if (path) {
            updateMusicNameVariable(slot, path); // 播放時也確認變數更新
            playExternalMusic(path);
        } else {
            selectAndSave(slot);
        }
    });

    PluginManager.registerCommand(pluginName, "ResumeExternalMusic", () => {
        if (window._currentExtAudio && window._currentExtAudio.paused) {
            window._currentExtAudio.play();
        }
    });

    PluginManager.registerCommand(pluginName, "StopExternalMusic", () => {
        if (window._currentExtAudio) {
                window._currentExtAudio.pause();
                window._currentExtAudio = null;
                $gameMap.autoplay();
        }
    });

})();