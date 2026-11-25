/*:
 * @target MZ
 * @plugindesc 在遊戲內建選項選單中，加入「視窗置頂」的切換開關。
 * @author Gemini
 * * @help WindowAlwaysOnTop.js
 * * 在「選項」選單中會多出一個「視窗置頂」的項目，
 * 玩家開啟後，遊戲視窗將會固定在螢幕最上層。
 * * @param optionName
 * @text 選項顯示名稱
 * @desc 在選項選單中顯示的文字。
 * @default 視窗置頂
 */

(() => {
    'use strict';

    const pluginName = 'WindowAlwaysOnTop';
    const parameters = PluginManager.parameters(pluginName);
    const optionName = parameters['optionName'] || '視窗置頂';

    // 1. 在 ConfigManager 中加入最上層的設定讀寫
    ConfigManager.alwaysOnTop = false;

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.alwaysOnTop = this.alwaysOnTop;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.alwaysOnTop = this.readFlag(config, 'alwaysOnTop', false);
        this.updateAlwaysOnTop();
    };

    // 實際控制 NW.js 視窗置頂的方法
    ConfigManager.updateAlwaysOnTop = function() {
        if (typeof nw !== 'undefined') {
            try {
                const win = nw.Window.get();
                win.setAlwaysOnTop(this.alwaysOnTop);
            } catch (e) {
                console.error("無法設定視窗置頂:", e);
            }
        }
    };

    // 2. 將選項注入到 Window_Options 中
    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand(optionName, 'alwaysOnTop');
    };

    // 3. 當玩家在選單改變該選項時，即時更新視窗狀態
    const _Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
    Window_Options.prototype.setConfigValue = function(symbol, value) {
        _Window_Options_setConfigValue.call(this, symbol, value);
        if (symbol === 'alwaysOnTop') {
            ConfigManager.updateAlwaysOnTop();
        }
    };
})();