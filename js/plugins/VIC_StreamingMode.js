/*:
 * @target MZ
 * @plugindesc 在選項選單中增加「實況模式」開關。
 * @author Gemini
 * * @help 
 * 開啟後，變數 ConfigManager.streamingMode 會變為 true。
 * 你可以在事件中使用腳本條件分歧：ConfigManager.streamingMode 來判斷。
 */

(() => {
    // 1. 初始化設定
    ConfigManager.streamingMode = false;

    // 2. 讓設定可以被存檔讀取
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.streamingMode = this.streamingMode;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.streamingMode = this.readFlag(config, 'streamingMode', false);
    };

    // 3. 在選項選單中加入控制項
    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand("實況模式", "streamingMode");
    };
})();