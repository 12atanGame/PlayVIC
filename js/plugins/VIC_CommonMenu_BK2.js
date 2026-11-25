/*:
 * @target MZ
 * @plugindesc [VIC 專案專用] 自動抓取標籤並執行公共事件的選單 Scene（已移除章節分頁，僅剩故事單一欄位）。
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
    const INTRO_SWITCH_ID = 182; // 控制是否顯示過介紹圖的開關 ID
    const INTRO_IMAGE_PATH = "img/pictures/Intro/Intro_Story"; // 圖片相對路徑

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
        this.createCommandWindow(); // 直接建立故事清單視窗
        this.createIntroSprite();
    };

    // 建立介紹圖的 Sprite
    Scene_VIC_CommonMenu.prototype.createIntroSprite = function() {
        if ($gameSwitches.value(INTRO_SWITCH_ID)) {
            this._introSprite = null;
            // 如果沒有介紹圖，直接激活清單
            this._commandWindow.activate();
            return;
        }

        this._introSprite = new Sprite();
        this._introSprite.bitmap = ImageManager.loadBitmap("", INTRO_IMAGE_PATH);
        
        this._introSprite.x = Graphics.boxWidth / 2;
        this._introSprite.y = Graphics.boxHeight / 2;
        this._introSprite.anchor.x = 0.5;
        this._introSprite.anchor.y = 0.5;
        
        this.addChild(this._introSprite);

        // 當圖片顯示時，暫時停用選單視窗的互動
        this._commandWindow.deactivate();
    };

    Scene_VIC_CommonMenu.prototype.update = function() {
        // 如果介紹圖存在，優先處理介紹圖的關閉邏輯
        if (this._introSprite) {
            this.updateIntroSprite();
            return; 
        }

        Scene_MenuBase.prototype.update.call(this);
    };

    // 處理介紹圖消失與開關變更的邏輯
    Scene_VIC_CommonMenu.prototype.updateIntroSprite = function() {
        if (Input.isTriggered("ok") || TouchInput.isTriggered()) {
            SoundManager.playOk(); 
            
            this.removeChild(this._introSprite);
            this._introSprite = null;
            
            $gameSwitches.setValue(INTRO_SWITCH_ID, true);
            
            // 圖片消失後，重新激活故事清單選單
            this._commandWindow.activate();
        }
    };

    // 建立單一的故事指令視窗
    Scene_VIC_CommonMenu.prototype.createCommandWindow = function() {
        // 自動過濾名字有包含「故事」且有寫 <Name:xxx> 標籤的事件
        const validIds = $dataCommonEvents
            .map((ev, index) => {
                if (ev && ev.name.includes("故事") && this.getTagName(ev)) return index;
                return null;
            })
            .filter(id => id !== null);

        // 微調選單大小與位置，使其在畫面正中央呈現
        const ww = 360; 
        const wh = Math.min(validIds.length * 48 + 8, 552); // 根據選項數量自動伸縮高度，最高 552
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2; // 置中對齊
        const rect = new Rectangle(wx, wy, ww, wh);
        
        this._commandWindow = new Window_VIC_Common(rect, validIds, this);
        
        this._commandWindow.setHandler("ok", this.onCommandOk.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this)); // 取消時直接關閉選單
        
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

    Scene_VIC_CommonMenu.prototype.onCommandOk = function() {
        const data = this._commandWindow.currentExt();
        $gameTemp.reserveCommonEvent(data.id);
        this.popScene();
    };

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

    // 尋找「可讀取且尚未讀完」的最新項目進行聚焦
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

                if (enabled && !isRead) {
                    targetIndex = i;
                    break;
                }
                if (enabled && isRead) {
                    targetIndex = i;
                }
            }
        }
        this._commandWindow.select(targetIndex);
    };

    window.Scene_VIC_CommonMenu = Scene_VIC_CommonMenu;


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
    
    Window_VIC_Common.prototype.makeCommandList = function() {
        if (!this._eventIds) return; 

        for (const id of this._eventIds) {
            const ev = $dataCommonEvents[id];
            if (!ev) continue;

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

            this.addCommand(name, "commonEvent", enabled, { id: id, icon: iconIndex });
        }
    };

    Window_VIC_Common.prototype.itemTextAlign = function() {
        return "left";
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