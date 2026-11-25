/*:
 * @target MZ
 * @plugindesc 入門教學：讀取參數、指令、與更換選單背景。
 * @author 你的名字
 *
 * @param MenuBackground
 * @text 選單背景圖名稱
 * @desc 請輸入要作為選單背景的圖片檔名（放入 img/pictures/）。
 * @default Crystal
 *
 * @command ShowMessage
 * @text 顯示自訂訊息
 * @desc 彈出一個由插件指令設定的視窗。
 *
 * @arg msgContent
 * @text 訊息內容
 * @desc 要顯示的文字內容。
 * @default 你好，這是我用插件指令跑出來的！
 */

(() => {
    "use strict";

    const pluginName = "MyFirstPlugin";

    // --- 1. 讀取插件參數 ---
    const parameters = PluginManager.parameters(pluginName);
    const customBgImage = String(parameters['MenuBackground'] || "Crystal");

    // --- 2. 註冊插件指令 ---
    PluginManager.registerCommand(pluginName, "ShowMessage", args => {
        const text = args.msgContent;
        // 在遊戲畫面顯示一個簡單的訊息視窗
        $gameMessage.add(text);
    });

    // --- 3. 更換選單背景 UI ---
    // 我們要「攔截」選單場景創建背景的過程
    const _Scene_Menu_createBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function() {
        // 建立一個新的精靈（Sprite）
        this._backgroundSprite = new Sprite();
        // 從 img/pictures 檔案夾讀取你在參數設定的圖片
        this._backgroundSprite.bitmap = ImageManager.loadPicture(customBgImage);
        // 將這個精靈加到場景中
        this.addChild(this._backgroundSprite);
        
        // 注意：這裡我們不呼叫原本的 _Scene_Menu_createBackground.call(this);
        // 因為原本的功能是把背景弄模糊，如果我們想換成清晰的圖，就直接蓋掉它。
    };

})();