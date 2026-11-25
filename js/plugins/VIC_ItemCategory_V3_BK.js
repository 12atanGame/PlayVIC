/*:
 * @target MZ
 * @plugindesc [VIC] 物品自定義分類與選單頁籤系統 V3
 * @author Gemini_AI
 * * @param CustomCategories
 * @text 自定義分類清單
 * @desc 在選單物品欄顯示的自定義標籤（對應備註裡的 <Category:名稱>）
 * @type struct<CategoryConfig>[]
 * @default []
 *
 * @help
 * 【使用方法】
 * 1. 在物品資料庫「備註」欄位輸入：<Category:案件> 或 <Category:食材> 等。
 * * 【功能 A：事件指令「選擇物品」】
 * 在執行指令「之前」，先執行腳本：
 * $gameTemp._customCategory = "案件";
 * * 注意：物品類型必須設定為「重要物品」。
 * * 【功能 B：選單物品欄頁籤】
 * 在插件參數中設定「自定義分類清單」，選單就會自動出現對應的頁籤。
 */

/*~struct~CategoryConfig:
 * @param label
 * @text 顯示名稱
 * @desc 在遊戲選單中看到的名稱（如：案件）
 * * @param tag
 * @text 備註標籤
 * @desc 對應備註欄 <Category:XXX> 裡的 XXX（如：案件）
 */

(() => {
    const pluginName = "VIC_ItemCategory_V3";
    const parameters = PluginManager.parameters(pluginName);
    const customCats = JSON.parse(parameters['CustomCategories'] || "[]").map(c => JSON.parse(c));

    // --- 功能 A：攔截「選擇物品」事件視窗 ---
    const _Window_EventItem_includes = Window_EventItem.prototype.includes;
    Window_EventItem.prototype.includes = function(item) {
        const originalResult = _Window_EventItem_includes.call(this, item);
        if (!$gameTemp._customCategory) return originalResult;
        
        if (item && originalResult) {
            return item.meta.Category === $gameTemp._customCategory;
        }
        return false;
    };

    const _Window_EventItem_onOk = Window_EventItem.prototype.onOk;
    Window_EventItem.prototype.onOk = function() {
        _Window_EventItem_onOk.call(this);
        $gameTemp._customCategory = null;
    };

    const _Window_EventItem_onCancel = Window_EventItem.prototype.onCancel;
    Window_EventItem.prototype.onCancel = function() {
        _Window_EventItem_onCancel.call(this);
        $gameTemp._customCategory = null;
    };

    // --- 功能 B：擴展選單物品欄頁籤 ---

    // 1. 在分類視窗加入自定義按鈕
    const _Window_ItemCategory_makeCommandList = Window_ItemCategory.prototype.makeCommandList;
    Window_ItemCategory.prototype.makeCommandList = function() {
        // 先跑 RMMZ 預設的分類（物品、武器、防具、重要物品）
        _Window_ItemCategory_makeCommandList.call(this);
        
        // 加入插件參數設定的自定義分類
        for (const cat of customCats) {
            this.addCommand(cat.label, cat.tag);
        }
    };

    // 2. 讓物品清單根據選中的自定義標籤進行過濾
    const _Window_ItemList_includes = Window_ItemList.prototype.includes;
    Window_ItemList.prototype.includes = function(item) {
        // 取得當前視窗選擇的分類符號 (Symbol)
        const categorySymbol = this._category;

        // 如果這個 Symbol 是我們自定義的標籤
        const isCustom = customCats.some(c => c.tag === categorySymbol);
        
        if (isCustom) {
            // 檢查備註裡的標籤是否符合
            return item && item.meta.Category === categorySymbol;
        }

        // 若不是自定義分類，則走回 RMMZ 原有的邏輯
        return _Window_ItemList_includes.call(this, item);
    };

    // --- 功能 C：調整分類視窗佈局 (橫3 * 直2) ---

    // 設定橫向有 3 欄
    Window_ItemCategory.prototype.maxCols = function() {
        return 7;
    };

    // 設定縱向顯示 2 行 (這會自動撐開視窗高度)
    Window_ItemCategory.prototype.numVisibleRows = function() {
        return 1;
    };

    // 修正：如果總選項不夠填滿兩行，確保視窗依然維持兩行的高度
    const _Scene_Item_categoryWindowRect = Scene_Item.prototype.categoryWindowRect;
    Scene_Item.prototype.categoryWindowRect = function() {
        _Scene_Item_categoryWindowRect.call(this);
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

})();