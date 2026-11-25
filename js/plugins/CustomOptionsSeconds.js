//=============================================================================
// CustomOptionsSeconds.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 在選項選單中加入獨立的純數字調整型行程變換秒數（最低 12 秒，無上限）。
 * @author Gemini
 * * @help
 * 這是一個微型外掛，可以將行程秒數設定加入內建的選項選單中，並允許左右鍵與點擊調整數值。
 */

(() => {
    const TARGET_VARIABLE_ID = 39; 
    const MIN_SECONDS = 12;
    const OFFSET_STEP = 1;

    // 取得安全秒數
    function getCurrentSeconds() {
        let val = MIN_SECONDS;
        if ($gameVariables) {
            val = $gameVariables.value(TARGET_VARIABLE_ID);
        } else if (ConfigManager["scheduleSeconds"] !== undefined) {
            val = ConfigManager["scheduleSeconds"];
        }
        // 如果遊戲剛開局是 0，強制轉為 12 秒
        return val < MIN_SECONDS ? MIN_SECONDS : val;
    }

    // 1. 在選項選單中追加項目
    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);
        this.addCommand("行程變換時間", "scheduleSeconds");
    };

    // 2. 重寫狀態文字顯示（跳過 booleanStatusText 的判定）
    Window_Options.prototype.statusText = function(index) {
        const symbol = this.commandSymbol(index);
        if (symbol === "scheduleSeconds") {
            return getCurrentSeconds() + " 秒";
        }
        // 其他項目保留原本的 MZ 預設邏輯（包括 ON/OFF 和 %）
        const value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            return this.volumeStatusText(value);
        } else {
            return this.booleanStatusText(value);
        }
    };

    // 3. 處理點擊或確認鍵（模仿音量條，點擊直接往上加）
    const _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === "scheduleSeconds") {
            let value = getCurrentSeconds() + OFFSET_STEP;
            this.updateScheduleValue(index, value);
        } else {
            _Window_Options_processOk.call(this);
        }
    };

    // 4. 按右鍵增加
    const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === "scheduleSeconds") {
            let value = getCurrentSeconds() + OFFSET_STEP;
            this.updateScheduleValue(index, value);
        } else {
            _Window_Options_cursorRight.call(this);
        }
    };

    // 5. 按左鍵減少
    const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === "scheduleSeconds") {
            let value = getCurrentSeconds() - OFFSET_STEP;
            if (value < MIN_SECONDS) value = MIN_SECONDS;
            this.updateScheduleValue(index, value);
        } else {
            _Window_Options_cursorLeft.call(this);
        }
    };

    // 更新數值並刷新
    Window_Options.prototype.updateScheduleValue = function(index, value) {
        if ($gameVariables) {
            $gameVariables.setValue(TARGET_VARIABLE_ID, value);
        }
        ConfigManager["scheduleSeconds"] = value;
        ConfigManager.save();
        this.redrawItem(index);
        this.playCursorSound();
    };

    // 6. ConfigManager 存讀檔資料同步
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.scheduleSeconds = getCurrentSeconds();
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        if (config.scheduleSeconds !== undefined) {
            ConfigManager.scheduleSeconds = Math.max(MIN_SECONDS, config.scheduleSeconds);
        } else {
            ConfigManager.scheduleSeconds = MIN_SECONDS;
        }
    };

    // 地圖與標題的變數安全保障
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        $gameVariables.setValue(TARGET_VARIABLE_ID, getCurrentSeconds());
    };

    const _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.call(this);
        if ($gameVariables && $gameVariables.value(TARGET_VARIABLE_ID) < MIN_SECONDS) {
            $gameVariables.setValue(TARGET_VARIABLE_ID, MIN_SECONDS);
        }
    };
})();