/*:
 * @target MZ
 * @plugindesc [VIC 專案專用] 自動抓取標籤並執行公共事件的選單 Scene（已移除分頁，改用 Music 標籤）。
 * @author Gemini
 * 
 * @help
 * 使用方法：
 * 1. 在公共事件的第一行建立「註釋」。
 * 2. 輸入 <Music: 你的選項名稱>。
 * 3. 在地圖事件中使用腳本指令呼叫： SceneManager.push(VIC_MusicMenu);
 */

(() => {

    // --- 配置區域 ---
    const READ_ICON = 80;    // 圖示
    const DISABLE_SOUND = { name: "005-Oo", volume: 60, pitch: 100, pan: 0 };

    //-----------------------------------------------------------------------------
    // VIC_MusicMenu
    //-----------------------------------------------------------------------------
    function VIC_MusicMenu() {
        this.initialize(...arguments);
    }

    VIC_MusicMenu.prototype = Object.create(Scene_MenuBase.prototype);
    VIC_MusicMenu.prototype.constructor = VIC_MusicMenu;

    VIC_MusicMenu.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow(); // 直接建立事件列表視窗
    };

    // 當在故事列表按取消時：直接關閉並返回上一層選單/地圖
    VIC_MusicMenu.prototype.onCommandCancel = function() {
        this.popScene();
    };

    VIC_MusicMenu.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
    };

    VIC_MusicMenu.prototype.createCommandWindow = function() {
        // 自動過濾有寫 [Music] 標籤的事件
        const validIds = $dataCommonEvents
            .map((ev, index) => {
                if (ev && this.getTagName(ev)) return index;
                return null;
            })
            .filter(id => id !== null);

        // 設定選單大小與位置
        const ww = 400; 
        const wh = Math.min(validIds.length * 48 + 8, 426); // 根據選項數量自動伸縮高度
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2; // 垂直居中
        const rect = new Rectangle(wx, wy, ww, wh);
        
        // 建立視窗
        this._commandWindow = new Window_VIC_Common(rect, validIds, this);
        
        this._commandWindow.setHandler("ok", this.onCommandOk.bind(this));
        this._commandWindow.setHandler("cancel", this.onCommandCancel.bind(this));
        
        this.autoFocusLatestStory();
        this.addWindow(this._commandWindow);
        
        // 確保視窗一打開就是啟用狀態
        this._commandWindow.activate();
    };

    // 取得公共事件 ID 的方式
    VIC_MusicMenu.prototype.onCommandOk = function() {
        const data = this._commandWindow.currentExt();
        $gameTemp.reserveCommonEvent(data.id);
        this.popScene();
    };

    // --- 解析邏輯：支援變數替換（已修改為偵測 Music 標籤） ---
    VIC_MusicMenu.prototype.getTagName = function(commonEvent) {
        if (!commonEvent || !commonEvent.list) return null;
        const re = /<Music:[ ]?(.+)>/i;
        for (const cmd of commonEvent.list) {
            if (cmd.code === 108 || cmd.code === 408) {
                const match = cmd.parameters[0].match(re);
                if (match) {
                    let name = match[1].trim();
                    // --- 解析 \V[n] 語法 ---
                    name = name.replace(/\\V\[(\d+)\]/gi, (match, p1) => {
                        return $gameVariables.value(parseInt(p1));
                    });
                    return name;
                }
            }
        }
        return null;
    };

    // --- 統一的註釋解析器（已同步支援 Music 標籤的變數轉換） ---
    VIC_MusicMenu.prototype.getMetaData = function(commonEvent, tag) {
        if (!commonEvent || !commonEvent.list) return null;
        const re = new RegExp(`<${tag}:[ ]?(.+)>`, "i");
        for (const cmd of commonEvent.list) {
            if (cmd.code === 108 || cmd.code === 408) {
                const match = cmd.parameters[0].match(re);
                if (match) {
                    let value = match[1].trim();
                    // 如果是 Music 標籤才進行變數轉換
                    if (tag.toLowerCase() === "music") {
                        value = value.replace(/\\V\[(\d+)\]/gi, (match, p1) => {
                            return $gameVariables.value(parseInt(p1));
                        });
                    }
                    return value;
                }
            }
        }
        return null;
    };

    // 尋找「可讀取且尚未讀完」的最新項目並聚焦
    VIC_MusicMenu.prototype.autoFocusLatestStory = function() {
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

    window.VIC_MusicMenu = VIC_MusicMenu;


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
            
            let enabled = true;

            if (reqData) {
                const [varId, threshold] = reqData.split(',').map(Number);
                enabled = $gameVariables.value(varId) >= threshold;
            }

            const iconIndex = READ_ICON;
            // 優先抓取 Music 標籤的名稱，如果沒有才用事件名稱
            const name = this._scene.getMetaData(ev, "Music") || ev.name;

            // 加入選項
            this.addCommand(name, "commonEvent", enabled, { id: id, icon: iconIndex });
        }
    };

    // 選項置中
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