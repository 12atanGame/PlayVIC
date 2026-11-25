-/*:
 * @target MZ
 * @plugindesc [VIC] 三選一系統 (整合分類過濾與背景功能)
 * @author Gemini
 *
 * @help
 * 【功能 A：分類過濾】
 * 在執行 SceneManager.push(Scene_ItemSelection) 之前，
 * 先在事件腳本輸入：$gameTemp._customCategory = "食材";
 * 則列表只會顯示備註有 <Category:食材> 的物品。
 * * 【功能 B：背景切換】
 * 開啟開關 52：顯示燉鍋背景 (Cook/StewPot)
 * 開啟開關 53：顯示思考背景 (Think/Think)
 */

(() => {
    "use strict";

    // --- 1. 場景定義 ---
    window.Scene_ItemSelection = class extends Scene_MenuBase {
        create() {
            super.create();
            this.createBackgroundPicture(); 
            this.createDisplayWindow();
            this.createListWindow();
            this.createConfirmWindow();
        }

        createBackgroundPicture() {
            this._potSprite = new Sprite();
            if ($gameSwitches.value(52)) {
                this._potSprite.bitmap = ImageManager.loadPicture("Cook/StewPot");
            } else if ($gameSwitches.value(53)) {
                this._potSprite.bitmap = ImageManager.loadPicture("Think/Think");
            }
            this._potSprite.x = Graphics.width / 2;
            this._potSprite.y = 240;
            this._potSprite.anchor.x = 0.5;
            this._potSprite.anchor.y = 0.5;
            this.addChild(this._potSprite);
        }

        createDisplayWindow() {
            const rect = new Rectangle((Graphics.width - 400) / 2, 290, 400, 240);
            this._displayWindow = new Window_ItemDisplay(rect);
            this.addWindow(this._displayWindow);
        }

        createListWindow() {
            const y = 560;
            const rect = new Rectangle((Graphics.width - 400) / 2, y, 400, Graphics.height - y - 180);
            this._itemWindow = new Window_ItemList(rect);
            this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
            this._itemWindow.setHandler("cancel", this.onSceneCancel.bind(this));
            this._itemWindow.setCategory("item");
            this.addWindow(this._itemWindow);
            this._itemWindow.activate();
            this._itemWindow.select(0);
        }

        createConfirmWindow() {
            const rect = new Rectangle((Graphics.width - 240) / 2, Graphics.height - 160, 240, 68);
            this._confirmWindow = new Window_SimpleConfirm(rect);
            this._confirmWindow.setHandler("ok", this.onConfirmExecute.bind(this));
            this._confirmWindow.setHandler("cancel", this.onCancelConfirm.bind(this));
            this.addWindow(this._confirmWindow);
            this._confirmWindow.hide();
        }

        // --- 修改：選取道具時即時扣除 ---
        returnPreDeductedItems() {
            if ($gameSwitches.value(52)) { // 僅在野營系統啟動時執行
                const selected = this._displayWindow.getSelectedItems();
                selected.forEach(item => {
                    if (item) {
                        $gameParty.gainItem(item, 1);
                    }
                });
                this._displayWindow.clearItems(); // 清空顯示，防止重複歸還
                this._itemWindow.refresh();
            }
        };

        onItemOk() {
            const item = this._itemWindow.item();
            // 檢查條件：道具存在、展示窗未滿、且玩家身上真的還有該道具
            if (item && !this._displayWindow.isFull() && $gameParty.numItems(item) > 0) {
                
                // 如果是野營系統 (開關 52)，即時扣除 1 個
                if ($gameSwitches.value(52)) {
                    $gameParty.loseItem(item, 1);
                    this._itemWindow.refresh(); // 刷新列表顯示正確數量
                }

                this._displayWindow.addItem(item);
                SoundManager.playOk();

                if (this._displayWindow.isFull()) {
                    this._itemWindow.deactivate();
                    this._confirmWindow.show();
                    this._confirmWindow.activate();
                    this._confirmWindow.select(0);
                } else {
                    this._itemWindow.activate();
                }
            } else {
                // 如果數量不夠，會播放警告音
                SoundManager.playBuzzer();
                this._itemWindow.activate();
            }
        }

        // 2. 修正：當玩家在確認視窗按下「取消」時 (全數歸還)
        onCancelConfirm() {
            SoundManager.playCancel();
            
            // 如果是野營系統 (開關 52)，必須把展示視窗裡的物品「還給玩家」
            if ($gameSwitches.value(52)) {
                const selected = this._displayWindow.getSelectedItems(); // 取得畫面上那三個
                selected.forEach(item => {
                    if (item) {
                        $gameParty.gainItem(item, 1); // 歸還 1 個
                    }
                });
            }

            // 清空展示窗並刷新列表
            this._displayWindow.clearItems(); 
            this._itemWindow.refresh(); // 列表數量會補回來
            this._confirmWindow.hide();
            this._confirmWindow.deactivate();
            this._itemWindow.activate(); // 回到物品選單
        }

        onCancelConfirm() {
            SoundManager.playCancel();
            this.returnPreDeductedItems(); // 呼叫歸還邏輯
            this._confirmWindow.hide();
            this._confirmWindow.deactivate();
            this._itemWindow.activate(); // 回到列表
        };

        // 離開場景時重置分類標籤
        onSceneCancel() {
            const selected = this._displayWindow.getSelectedItems();
            let lastItemIndex = -1;

            // 使用傳統 for 迴圈從後往前找第一個不是 null 的位置
            for (let i = selected.length - 1; i >= 0; i--) {
                if (selected[i] !== null) {
                    lastItemIndex = i;
                    break;
                }
            }

            if ($gameSwitches.value(52) && lastItemIndex !== -1) {
                // --- 情況 A：欄位上有東西，執行「退回上一個」 ---
                const itemToReturn = selected[lastItemIndex];
                
                // 歸還給背包
                $gameParty.gainItem(itemToReturn, 1);
                
                // 從展示窗移除該位置的物品
                this._displayWindow.removeLastItem(lastItemIndex);
                
                // 刷新清單與音效
                this._itemWindow.refresh();
                SoundManager.playCancel();
                this._itemWindow.activate(); 
            } else {
                // --- 情況 B：欄位是空的，清除分類標籤並關閉場景 ---
                $gameTemp._customCategory = null; //
                SoundManager.playCancel();
                this.popScene();
            }
        }

        onConfirmExecute() {
            const selected = this._displayWindow.getSelectedItems();
            $gameVariables.setValue(58, selected[0]?.id || 0);
            $gameVariables.setValue(59, selected[1]?.id || 0);
            $gameVariables.setValue(60, selected[2]?.id || 0);

            // 成功提交後，清除分類標籤並離開
            // 這裡「不呼叫」returnPreDeductedItems，因為物品已經預扣了
            $gameTemp._customCategory = null; 
            SoundManager.playOk();
            this.popScene();
        };
    };

    // --- 2. 核心：整併物品過濾功能 ---
    const _Window_ItemList_includes = Window_ItemList.prototype.includes;
    Window_ItemList.prototype.includes = function(item) {
        // 如果正在三選一場景，且有設定自定義分類
        if (SceneManager._scene instanceof Scene_ItemSelection && $gameTemp._customCategory) {
            return item && item.meta.Category === $gameTemp._customCategory;
        }
        return _Window_ItemList_includes.call(this, item);
    };

    // --- 3. 視窗類別 (與之前穩定版一致) ---
    class Window_SimpleConfirm extends Window_Selectable {
        constructor(rect) { super(rect); this.refresh(); }
        maxItems() { return 1; }
        drawItem(index) {
            const rect = this.itemLineRect(index);
            this.drawText("確認提交", rect.x, rect.y, rect.width, "center");
        }
    }

    window.Window_ItemDisplay = class extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._selectedItems = [null, null, null];
            this.refresh();
        }
        addItem(item) {
            const idx = this._selectedItems.indexOf(null);
            if (idx !== -1) { this._selectedItems[idx] = item; this.refresh(); return true; }
            return false;
        }
        clearItems() { this._selectedItems = [null, null, null]; this.refresh(); }
        isFull() { return !this._selectedItems.includes(null); }
        getSelectedItems() { return this._selectedItems; }
        // 請在 window.Window_ItemDisplay 類別內加入：
        removeLastItem(index) {
            this._selectedItems[index] = null;
            this.refresh();
        }
        refresh() {
            if (!this.contents) return;
            this.contents.clear();
            const slotW = this.innerWidth / 3;
            this._selectedItems.forEach((item, i) => {
                const x = i * slotW;
                const boxX = x + (slotW - 120) / 2;
                this.contents.fillRect(boxX, 30, 120, 120, ColorManager.outlineColor());
                if (item) {
                    const ctx = this.contents.context;
                    ctx.save();
                    ctx.imageSmoothingEnabled = false;
                    const iconSet = ImageManager.loadSystem("IconSet");
                    if (iconSet.isReady()) {
                        this.contents.blt(iconSet, (item.iconIndex % 16) * 32, Math.floor(item.iconIndex / 16) * 32, 32, 32, boxX + 12, 48, 96, 96);
                    }
                    ctx.restore();
                    this.drawText(item.name, x, 160, slotW, "center");
                } else {
                    this.drawText("?", x, 76, slotW, "center");
                }
            });
        }
    };

    // 確保場景內物品皆可選取
    const _Window_ItemList_isEnabled = Window_ItemList.prototype.isEnabled;
    Window_ItemList.prototype.isEnabled = function(item) {
        if (SceneManager._scene instanceof Scene_ItemSelection) return true;
        return _Window_ItemList_isEnabled.call(this, item);
    };

})();