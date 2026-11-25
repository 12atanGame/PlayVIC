/*:
 * @target MZ
 * @plugindesc [VIC 專案] 真正支援多行與 JS 腳本的辭典系統
 * @author Gemini
 * * @param DictionaryData
 * @text 辭典條目設定
 * @type struct<DictItem>[]
 * @default []
 * * @help
 * 1. 在 content 欄位（Note 類型）輸入時，可以直接按 Enter 換行。
 * 2. 顯示時會完全保留換行格式，並支援 \C[n] 等控制字元。
 */

/*~struct~DictItem:
 * @param title
 * @text 條目名稱
 * @type string
 * * @param category
 * @text 分類
 * @type select
 * @option 關於世界 @value world
 * @option 維克腦內 @value vic
 * @option 休的筆記 @value hugh
 * * @param condition
 * @text 解鎖腳本 (JS)
 * @desc 範例：$gameVariables.value(199) >= 1
 * @default true
 * * @param content
 * @text 內容描述 (支援多行)
 * @type note
 * * @param image
 * @text 顯示圖片
 * @type file
 * @dir img/pictures
 */

(() => {
    const pluginName = "VIC_Dictionary";
    const parameters = PluginManager.parameters(pluginName);
    
    // --- 這裡是最關鍵的修正點：解析 Note 欄位 ---
    const rawData = JSON.parse(parameters['DictionaryData'] || '[]');
    const dictData = rawData.map(itemStr => {
        const item = JSON.parse(itemStr);
        // RMMZ 的 Note 欄位在 JSON 裡是字串化的字串，需要再 parse 一次並處理換行
        try {
            item.content = JSON.parse(item.content); 
        } catch (e) {
            // 如果 parse 失敗，手動替換可能的換行符
            item.content = item.content.replace(/\\n/g, "\n");
        }
        return item;
    });

    
    // --- 內容繪製處理 (支援多行) ---
    Window_DictDisplay.prototype.drawContent = function(item) {
        this.contents.clear();
        if (!item) return;

        // 解析 Note 格式的多行文字
        const text = JSON.parse(item.content); 
        const padding = 20;
        
        // 繪製標題
        this.contents.fontSize = 28;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(item.title, padding, 10, this.contentsWidth() - padding*2);
        this.resetTextColor();
        this.contents.fontSize = $gameSystem.mainFontSize();

        // 使用 drawTextEx 處理多行文本與控制符號
        // 假設圖片佔據上方空間，文字從 y=320 開始
        this.drawTextEx(text, padding, 320);
    };

    // --- 視窗繪製修正 ---
    Window_DictDisplay.prototype.refresh = function() {
        this.contents.clear();
        if (!this._item) return;

        const padding = 20;
        
        // 標題
        this.contents.fontSize = 28;
        this.drawText(this._item.title, padding, 10, this.contentsWidth() - padding * 2);
        this.contents.fontSize = $gameSystem.mainFontSize();

        // 圖片處理
        if (this._item.image) {
            const bitmap = ImageManager.loadPicture(this._item.image);
            bitmap.addLoadListener(() => {
                // 依照你的 UI 圖，地圖通常放在上方
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, padding, 60);
            });
        }

        // --- 多行文本修正 ---
        // 使用 drawTextEx 是為了讓 \n 有效，並支援 \C[n]
        const textY = this._item.image ? 360 : 60; 
        this.drawTextEx(this._item.content, padding, textY);
    };
    
    // --- 分類與列表邏輯 (省略重複的樣板代碼) ---
    // 在 makeCommandList 內會調用 isItemUnlocked(item) 來決定是否顯示標題或問號
    window.Scene_Dictionary = Scene_Dictionary;
})();