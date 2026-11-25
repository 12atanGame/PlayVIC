/*:
 * @target MZ
 * @plugindesc [VIC 專案專用] 自動抓取標籤並執行公共事件的選單 Scene。
 * @author Gemini
 * 
 * @help
 * 使用方法：
 * 1. 在公共事件的第一行建立「註釋」。
 * 2. 輸入 <Name: 你的選項名稱>。
 * 3. 在地圖事件中使用腳本指令呼叫： SceneManager.push(Scene_VIC_CommonMenu);
 */

(() => {

    // --- 配置區域 ---
    const UNREAD_ICON = 187;  // 未讀故事圖示
    const READ_ICON = 189;    // 已讀故事圖示
    const DISABLE_SOUND = { name: "005-Oo", volume: 60, pitch: 100, pan: 0 };

    //-----------------------------------------------------------------------------
    // Scene_VIC_CommonMenu
    //-----------------------------------------------------------------------------
    function Scene_VIC_CommonMenu() {
        this.initialize(...arguments);
    }

    Scene_VIC_CommonMenu.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_VIC_CommonMenu.prototype.constructor = Scene_VIC_CommonMenu;

    Scene_VIC_CommonMenu.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createTabWindow();     // 建立頂部分頁
        this.createCommandWindow();
    };

    Scene_VIC_CommonMenu.prototype.createTabWindow = function() {

        const rect = new Rectangle((Graphics.boxWidth - 600) / 2, 250, 600, 74);
        this._tabWindow = new Window_VIC_Tab(rect);
        this._tabWindow.setHandler("chapter1", this.refreshList.bind(this));
        this._tabWindow.setHandler("chapter2", this.refreshList.bind(this));
        this._tabWindow.setHandler("chapter3", this.refreshList.bind(this));
        this._tabWindow.setHandler("special", this.refreshList.bind(this));
        this.addWindow(this._tabWindow);
        

        // 新增：按下確定鍵後進入列表
        this._tabWindow.setHandler("ok", this.onTabOk.bind(this));
        
        // 頁籤按取消才是真的關閉選單
        this._tabWindow.setHandler("cancel", this.popScene.bind(this));
      

    };

    // 當在故事列表按取消時：回到分頁選擇
    Scene_VIC_CommonMenu.prototype.onCommandCancel = function() {
        this._commandWindow.deselect();     // 取消列表選取
        this._commandWindow.deactivate();   // 停用列表視窗
        this._tabWindow.activate();         // 啟用上方頁籤視窗
    };

    // 補充：當在分頁按確定時：進入故事列表 (滑鼠點擊也會觸發)
    Scene_VIC_CommonMenu.prototype.onTabOk = function() {
        this._tabWindow.deactivate();
        this._commandWindow.activate();
        this._commandWindow.select(0);
    };

    Scene_VIC_CommonMenu.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        // 監聽 Q (PageUp) 和 W (PageDown) 切換分頁
        if (Input.isTriggered("pageup")) {
            this.changeTab(-1);
            this.refreshList();
        } else if (Input.isTriggered("pagedown")) {
            this.changeTab(1);
            this.refreshList();
        }
    };

    // 新增：處理分頁切換的輔助函數
    Scene_VIC_CommonMenu.prototype.changeTab = function(direction) {
        const lastIndex = this._tabWindow.index();
        const maxCols = this._tabWindow.maxCols();
        
        // 計算新索引並循環
        let newIndex = lastIndex + direction;
        if (newIndex < 0) newIndex = maxCols - 1;
        if (newIndex >= maxCols) newIndex = 0;
        
        if (newIndex !== lastIndex) {
            this._tabWindow.select(newIndex);
            this._tabWindow.playCursorSound(); // 播放切換音效
            this.refreshList(); // 重新過濾列表
        }
    };

    Scene_VIC_CommonMenu.prototype.refreshList = function() {
        const symbol = this._tabWindow.currentSymbol();
        let filterKey = "";
        
        // 根據頁籤決定過濾關鍵字
        if (symbol === "chapter1") filterKey = "1-";
        if (symbol === "chapter2") filterKey = "2-";
        if (symbol === "chapter3") filterKey = "3-";
        if (symbol === "special") filterKey = "S-"; // 特別故事假設叫 S-

        const validIds = $dataCommonEvents
            .map((ev, index) => {
                if (ev && ev.name.includes(filterKey) && this.getTagName(ev)) return index;
                return null;
            })
            .filter(id => id !== null);

        this._commandWindow.setEventIds(validIds);
        this._commandWindow.refresh();
        this._commandWindow.activate();
        this._commandWindow.select(0);
    };

    Scene_VIC_CommonMenu.prototype.createCommandWindow = function() {
        // 自動過濾有寫標籤的事件
        const validIds = $dataCommonEvents
            .map((ev, index) => {
                if (ev && ev.name.includes("故事") && this.getTagName(ev)) return index;
                return null;
            })
            .filter(id => id !== null);

        // 設定選單大小與位置 (可根據你的截圖 UI 比例微調)
        const ww = 600; 
        const wh = Math.min(validIds.length * 48 + 8, 552); // 根據選項數量自動伸縮高度
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2 + 78;
        const rect = new Rectangle(wx, wy, ww, wh);
        this._commandWindow = new Window_VIC_Common(rect);
        
        this._commandWindow.setHandler("ok", this.onCommandOk.bind(this));
        
        // --- 修改：取消時不要直接 popScene，而是回到頁籤 ---
        this._commandWindow.setHandler("cancel", this.onCommandCancel.bind(this));
        
        this._commandWindow._scene = this; 
        this.autoFocusLatestStory();
        this.addWindow(this._commandWindow);

    };

    Scene_VIC_CommonMenu.prototype.getTagName = function(commonEvent) {
        if (!commonEvent || !commonEvent.list) return null;
        const re = /<Name:[ ]?(.+)>/i;
        for (const cmd of commonEvent.list) {
            if (cmd.code === 108 || cmd.code === 408) {
                const match = cmd.parameters[0].match(re);
                if (match) return match[1].trim();
            }
        }
        return null;
    };

    // 取得公共事件 ID 的方式微調
    Scene_VIC_CommonMenu.prototype.onCommandOk = function() {
        const data = this._commandWindow.currentExt();
        $gameTemp.reserveCommonEvent(data.id);
        this.popScene();
    };

    // 統一的註釋解析器
    Scene_VIC_CommonMenu.prototype.getMetaData = function(commonEvent, tag) {
        if (!commonEvent || !commonEvent.list) return null;
        const re = new RegExp(`<${tag}:[ ]?(.+)>`, "i");
        for (const cmd of commonEvent.list) {
            if (cmd.code === 108 || cmd.code === 408) {
                const match = cmd.parameters[0].match(re);
                if (match) return match[1].trim();
            }
        }
        return null;
    };

    // 尋找「可讀取且尚未讀完」的最新項目
    Scene_VIC_CommonMenu.prototype.autoFocusLatestStory = function() {
        const list = this._commandWindow._list;
        let targetIndex = 0;

        for (let i = 0; i < list.length; i++) {
            const evId = list[i].ext.id;
            const ev = $dataCommonEvents[evId];
            const reqData = this.getMetaData(ev, "Var");
            
            if (reqData) {
                const [varId, threshold] = reqData.split(',').map(Number);
                const val = $gameVariables.value(varId);
                const enabled = val >= threshold;
                const isRead = val >= threshold + 1;

                // 如果這項是開的且還沒讀過，就是它了！
                if (enabled && !isRead) {
                    targetIndex = i;
                    break;
                }
                // 如果已經讀過了，暫時把 targetIndex 設為這一項，
                // 這樣如果所有故事都讀完了，光標會停在最後一個已讀項。
                if (enabled && isRead) {
                    targetIndex = i;
                }
            }
        }
        this._commandWindow.select(targetIndex);
    };

    window.Scene_VIC_CommonMenu = Scene_VIC_CommonMenu;


    // --- 新增：分頁視窗類別 ---
    function Window_VIC_Tab() {
        this.initialize(...arguments);
    }

    Window_VIC_Tab.prototype = Object.create(Window_HorzCommand.prototype);
    Window_VIC_Tab.prototype.constructor = Window_VIC_Tab;

    Window_VIC_Tab.prototype.initialize = function(rect) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
    };

    Window_VIC_Tab.prototype.maxCols = function() {
        return 4; // 四個分頁
    };

    Window_VIC_Tab.prototype.makeCommandList = function() {
        this.addCommand("第一大章", "chapter1");
        this.addCommand("第二大章", "chapter2");
        this.addCommand("第三大章", "chapter3");
        this.addCommand("特別故事", "special");
    };

    //-----------------------------------------------------------------------------
    // Window_VIC_Common
    //-----------------------------------------------------------------------------
    function Window_VIC_Common() {
        this.initialize(...arguments);
    }

    Window_VIC_Common.prototype = Object.create(Window_Command.prototype);
    Window_VIC_Common.prototype.constructor = Window_VIC_Common;

    Window_VIC_Common.prototype.initialize = function(rect, eventIds, scene) {
        this._eventIds = eventIds;
        this._scene = scene;
        Window_Command.prototype.initialize.call(this, rect);
    };

    // --- 新增：讓視窗可以接收新的事件 ID 列表 ---
    Window_VIC_Common.prototype.setEventIds = function(ids) {
        this._eventIds = ids; // 將過濾後的 ID 存起來
    };
    
    Window_VIC_Common.prototype.makeCommandList = function() {
        // 如果沒有 ID 列表，就直接結束 (顯示空列表)
        if (!this._eventIds) return; 

        for (const id of this._eventIds) {
            const ev = $dataCommonEvents[id];
            if (!ev) return;

            // 這裡保留你原本的 Condition 與 Read 邏輯
            const reqData = this._scene.getMetaData(ev, "Var");
            const readData = reqData;
            
            let enabled = true;
            let isRead = false;

            if (reqData) {
                const [varId, threshold] = reqData.split(',').map(Number);
                enabled = $gameVariables.value(varId) >= threshold;
            }
            if (readData) {
                const [varId, threshold] = readData.split(',').map(Number);
                isRead = $gameVariables.value(varId) >= threshold + 1;
            }

            const iconIndex = isRead ? READ_ICON : UNREAD_ICON;
            const name = this._scene.getMetaData(ev, "Name") || ev.name;

            // 加入選項
            this.addCommand(name, "commonEvent", enabled, { id: id, icon: iconIndex });
        };
    };

    // 選項置中 (符合你截圖的樣式)
    Window_VIC_Common.prototype.itemTextAlign = function() {
        return "center";
    };

    Window_VIC_Common.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        const data = this._list[index].ext;
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawIcon(data.icon, rect.x, rect.y + 2);
        this.drawText(this.commandName(index), rect.x + 40, rect.y, rect.width - 40, "left");
    };

    Window_VIC_Common.prototype.processOk = function() {
        if (this.isCurrentItemEnabled()) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callOkHandler();
        } else {
            AudioManager.playStaticSe(DISABLE_SOUND);
        }
    };



})();