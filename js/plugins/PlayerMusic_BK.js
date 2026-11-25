/*:
 * @target MZ
 * @plugindesc 路徑存取版：僅記錄外部音樂路徑，不複製檔案。
 * @author Gemini
 *
 * @command PlayFromPath
 * @text 選擇外部音樂播放
 * @desc 選擇電腦中任何位置的音樂，並將路徑存入存檔。
 * 
 * @command StopExternalMusic
 * @text 暫停外部音樂播放
 * @desc 暫停音樂。
 * 
 */

(() => {
    "use strict";

    const pluginName = "PlayerMusic";

    // --- 核心播放函數 (加入音量連動) ---
    function playExternalMusic(filePath) {
        if (!filePath) return;

        AudioManager.stopBgm();

        if (window._currentExtAudio) {
            window._currentExtAudio.pause();
        }

        const fileUrl = "file:///" + filePath.replace(/\\/g, "/");
        const audio = new Audio(fileUrl);
        audio.loop = true;
        
        // 初次播放時套用當前音量
        audio.volume = (ConfigManager.bgmVolume / 100) * (AudioManager._bgmVolume / 100);
        
        audio.play().catch(e => console.error("播放失敗：", e));
        window._currentExtAudio = audio;
    }

    // --- 1. 實現音量實時連動 ---
    // 每幀更新音量，確保玩家在選單調整音量時立即生效
    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);
        if (window._currentExtAudio) {
            // 計算公式：設定值(0-100) * 腳本控制音量(0-100)
            let targetVolume = (ConfigManager.bgmVolume / 100) * (AudioManager._bgmVolume / 100);
            
            // --- 2. 檢測 ME 是否正在播放 ---
            // 如果正在播放 ME，將外部音樂音量降至 0 (或 0.2 做為背景墊音)
            if (AudioManager._meBuffer && AudioManager._meBuffer.isPlaying()) {
                targetVolume = 0; 
            }

            // 平滑調整音量 (選用，防止聲音切換太突兀)
            window._currentExtAudio.volume = targetVolume;
        }
    };

    // 定義一個專門停止外部音樂的函數，方便重複調用
    function stopExternalMusic() {
        if (window._currentExtAudio) {
            window._currentExtAudio.pause();
            // 不要設為 null，或者設為 null 前要確保邏輯不會報錯
            // 建議設為 null 釋放記憶體，但使用時要檢查
            window._currentExtAudio = null; 
        }
    }

    // --- 3. 修改你的地圖邏輯 ---
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);

        // 如果回到私人據點 (地圖 6 且 開關 46 打開)
        if ($gameSystem._externalBgmPath && $gameSwitches.value(46) && $gameMap._mapId === 6) {
            // 只有在沒播放時才觸發，避免重複播放導致重疊
            if (!window._currentExtAudio) {
                playExternalMusic($gameSystem._externalBgmPath);
            }
        } else {
            // 如果不符合播放條件（離開地圖 6 或 開關 46 關閉）
            if (window._currentExtAudio) {
                stopExternalMusic();
                // 恢復地圖原本設定的自動播放音樂 (BGM/BGS)
                $gameMap.autoplay();
            }
        }
    };

    // --- 插件指令註冊 (保持不變) ---
    PluginManager.registerCommand(pluginName, "PlayFromPath", () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/mp3, audio/ogg, audio/wav';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const absolutePath = file.path; 
            playExternalMusic(absolutePath);
            $gameSystem._externalBgmPath = absolutePath;
        };
        input.click();
    });

    // 註冊暫停指令
    PluginManager.registerCommand(pluginName, "StopExternalMusic", () => {
        if (window._currentExtAudio) {
            window._currentExtAudio.pause();
            window._currentExtAudio = null;
            // 恢復地圖 BGM
            $gameMap.autoplay();
        }
    });

})();