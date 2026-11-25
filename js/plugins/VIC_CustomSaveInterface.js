//=============================================================================
// VIC_CustomSaveInterface.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc VIC 自定義存檔界面 v1.0.0
 * @author YourName
 * @version 1.0.0
 * @description 提供直式滑動的存檔界面，每頁顯示一個存檔格
 *
 * @param maxSaveSlots
 * @text 最大存檔數量
 * @desc 設置最大存檔槽位數量
 * @type number
 * @min 1
 * @max 99
 * @default 20
 *
 * @help VIC_CustomSaveInterface.js
 * 
 * 這個插件提供了一個現代化的存檔界面
 */

(() => {
    'use strict';
    
    const pluginName = 'VIC_CustomSaveInterface';
    const parameters = PluginManager.parameters(pluginName);
    const maxSaveSlots = parseInt(parameters['maxSaveSlots'] || 20);

    //=============================================================================
    // Window_VICSaveSlot - 自定義存檔槽視窗
    //=============================================================================
    
    window.Window_VICSaveSlot = class extends Window_Base {
        constructor(rect) {
            super(rect);
            this._savefileId = 1;
            this.refresh();
        }
        
        setSavefileId(savefileId) {
            this._savefileId = savefileId;
            this.refresh();
        }
        
        refresh() {
            if (this.contents) {
                this.contents.clear();
                
                const savefileId = this._savefileId;
                let info = null;
                
                try {
                    if (DataManager.savefileExists && DataManager.savefileExists(savefileId)) {
                        info = DataManager.loadSavefileInfo(savefileId);
                    }
                } catch (e) {
                    console.warn('讀取存檔信息失敗:', e);
                    info = null;
                }
                
                if (info) {
                    this.drawSaveSlotContent(info, savefileId);
                } else {
                    this.drawEmptySlot(savefileId);
                }
            }
        }
        
        drawSaveSlotContent(info, savefileId) {
            const rect = this.itemRect();
            
            // 背景色
            this.contents.fillRect(0, 0, rect.width, 120, '#4a90e2');
            
            // 存檔槽編號
            this.drawSlotNumber(savefileId);
            
            // 章節信息
            const chapter = this.getChapterName(info);
            this.contents.textColor = '#000000';
            this.contents.fontSize = 18;
            this.contents.drawText(chapter, 20, 135, rect.width - 40, 30, 'left');
            
            // 時間戳記
            const timestamp = this.formatTimestamp(info);
            this.contents.textColor = '#666666';
            this.contents.fontSize = 14;
            this.contents.drawText('📅 ' + timestamp, 20, 165, rect.width - 40, 20, 'left');
            
            // 進度條
            this.drawProgressBar(info);
        }
        
        drawEmptySlot(savefileId) {
            const rect = this.itemRect();
            
            // 虛線邊框（簡化版）
            this.contents.fillRect(10, 10, rect.width - 20, 2, '#cccccc');
            this.contents.fillRect(10, rect.height - 12, rect.width - 20, 2, '#cccccc');
            this.contents.fillRect(10, 10, 2, rect.height - 20, '#cccccc');
            this.contents.fillRect(rect.width - 12, 10, 2, rect.height - 20, '#cccccc');
            
            // 空槽文字
            this.contents.textColor = '#999999';
            this.contents.fontSize = 24;
            this.contents.drawText('💾', 0, 80, rect.width, 30, 'center');
            
            this.contents.fontSize = 16;
            this.contents.drawText('空白存檔槽', 0, 120, rect.width, 30, 'center');
            
            // 存檔槽編號
            this.drawSlotNumber(savefileId);
        }
        
        drawSlotNumber(savefileId) {
            const rect = this.itemRect();
            
            // 編號背景
            this.contents.fillRect(rect.width - 50, 10, 40, 25, '#2c3e50');
            
            // 編號文字
            this.contents.textColor = '#ffffff';
            this.contents.fontSize = 14;
            const slotText = String(savefileId).padStart(2, '0');
            this.contents.drawText(slotText, rect.width - 50, 12, 40, 20, 'center');
        }
        
        drawProgressBar(info) {
            const rect = this.itemRect();
            const progress = this.calculateProgress(info);
            
            // 進度條背景
            this.contents.fillRect(20, 185, rect.width - 40, 6, '#eeeeee');
            
            // 進度條填充
            const fillWidth = Math.floor((progress / 100) * (rect.width - 40));
            if (fillWidth > 0) {
                this.contents.fillRect(20, 185, fillWidth, 6, '#4CAF50');
            }
        }
        
        itemRect() {
            return new Rectangle(0, 0, this.innerWidth, this.innerHeight);
        }
        
        getChapterName(info) {
            try {
                if (info && info.switches) {
                    if (info.switches[10]) return '第三章：自毀淨化';
                    if (info.switches[5]) return '第二章：一起逃亡';
                    return '第一章：維克與休';
                }
            } catch (e) {
                console.warn('章節判斷失敗:', e);
            }
            return '序章';
        }
        
        calculateProgress(info) {
            try {
                if (info && info.switches) {
                    const totalSwitches = 50;
                    let activeSwitches = 0;
                    
                    for (let i = 1; i <= totalSwitches; i++) {
                        if (info.switches[i]) {
                            activeSwitches++;
                        }
                    }
                    
                    return Math.floor((activeSwitches / totalSwitches) * 100);
                }
            } catch (e) {
                console.warn('進度計算失敗:', e);
            }
            return 0;
        }
        
        formatTimestamp(info) {
            try {
                if (info && info.timestamp) {
                    const date = new Date(info.timestamp);
                    return date.toLocaleString('zh-TW', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            } catch (e) {
                console.warn('時間格式化失敗:', e);
            }
            return '未知時間';
        }
    };

    //=============================================================================
    // Scene_VICSave - 自定義存檔場景
    //=============================================================================
    
    window.Scene_VICSave = class extends Scene_MenuBase {
        initialize() {
            super.initialize();
            this._currentSlot = 1;
            this._isAnimating = false;
        }
        
        create() {
            super.create();
            this.createBackground();
            this.createWindows();
        }
        
        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            
            // 簡單的漸變背景
            for (let i = 0; i < Graphics.height; i++) {
                const ratio = i / Graphics.height;
                const r = Math.floor(102 + (118 - 102) * ratio);
                const g = Math.floor(126 + (75 - 126) * ratio);
                const b = Math.floor(234 + (162 - 234) * ratio);
                const color = `rgb(${r},${g},${b})`;
                
                this._backgroundSprite.bitmap.fillRect(0, i, Graphics.width, 1, color);
            }
            
            this.addChild(this._backgroundSprite);
        }
        
        createWindows() {
            this.createHeaderWindow();
            this.createSaveSlotWindow();
            this.createNavigationWindow();
        }
        
        createHeaderWindow() {
            const rect = new Rectangle((Graphics.width - 432) / 2, 20, 432, 80);
            this._headerWindow = new Window_Base(rect);
            
            if (this._headerWindow.contents) {
                this._headerWindow.contents.fontSize = 24;
                this._headerWindow.contents.textColor = '#000000';
                this._headerWindow.contents.drawText('VIC', 0, 10, this._headerWindow.innerWidth, 30, 'center');
                
                this._headerWindow.contents.fontSize = 14;
                this._headerWindow.contents.drawText('遊戲存檔', 0, 45, this._headerWindow.innerWidth, 20, 'center');
            }
            
            this.addChild(this._headerWindow);
        }
        
        createSaveSlotWindow() {
            const rect = new Rectangle(
                (Graphics.width - 432) / 2 + 21, 120, 390, 200
            );
            this._saveSlotWindow = new Window_VICSaveSlot(rect);
            this._saveSlotWindow.setSavefileId(this._currentSlot);
            this.addChild(this._saveSlotWindow);
        }
        
        createNavigationWindow() {
            const rect = new Rectangle(
                (Graphics.width - 432) / 2, Graphics.height - 80, 432, 60
            );
            this._navigationWindow = new Window_Base(rect);
            
            if (this._navigationWindow.contents) {
                this._navigationWindow.contents.fontSize = 14;
                this._navigationWindow.contents.textColor = '#000000';
                this._navigationWindow.contents.drawText(
                    '↑↓ 切換存檔槽 | Enter 選擇 | Esc 返回',
                    0, 15, this._navigationWindow.innerWidth, 20, 'center'
                );
            }
            
            this.addChild(this._navigationWindow);
        }
        
        update() {
            super.update();
            if (!this._isAnimating) {
                this.updateInput();
            }
        }
        
        updateInput() {
            if (Input.isRepeated('down') || Input.isRepeated('right')) {
                this.nextSlot();
            } else if (Input.isRepeated('up') || Input.isRepeated('left')) {
                this.previousSlot();
            } else if (Input.isTriggered('ok')) {
                this.onSavefileOk();
            } else if (Input.isTriggered('cancel')) {
                this.onSavefileCancel();
            }
        }
        
        nextSlot() {
            if (this._currentSlot < maxSaveSlots) {
                if (SoundManager && SoundManager.playCursor) {
                    SoundManager.playCursor();
                }
                this._currentSlot++;
                this.refreshSaveSlot();
            }
        }
        
        previousSlot() {
            if (this._currentSlot > 1) {
                if (SoundManager && SoundManager.playCursor) {
                    SoundManager.playCursor();
                }
                this._currentSlot--;
                this.refreshSaveSlot();
            }
        }
        
        refreshSaveSlot() {
            if (this._saveSlotWindow && this._saveSlotWindow.setSavefileId) {
                this._saveSlotWindow.setSavefileId(this._currentSlot);
            }
        }
        
        onSavefileOk() {
            if (SoundManager && SoundManager.playOk) {
                SoundManager.playOk();
            }
            
            try {
                if ($gameSystem && $gameSystem.setSavefileId) {
                    $gameSystem.setSavefileId(this._currentSlot);
                }
                
                if ($gameSystem && $gameSystem.onBeforeSave) {
                    $gameSystem.onBeforeSave();
                }
                
                if (DataManager && DataManager.saveGame) {
                    if (DataManager.saveGame(this._currentSlot)) {
                        if (SoundManager && SoundManager.playSave) {
                            SoundManager.playSave();
                        }
                        this.onSaveSuccess();
                    } else {
                        this.onSaveFailure();
                    }
                }
            } catch (e) {
                console.error('存檔失敗:', e);
                this.onSaveFailure();
            }
        }
        
        onSaveSuccess() {
            this.refreshSaveSlot();
            if ($gameMessage && $gameMessage.add) {
                $gameMessage.add(`遊戲已存檔至槽位 ${this._currentSlot}`);
            }
        }
        
        onSaveFailure() {
            if (SoundManager && SoundManager.playBuzzer) {
                SoundManager.playBuzzer();
            }
            if ($gameMessage && $gameMessage.add) {
                $gameMessage.add('存檔失敗！');
            }
        }
        
        onSavefileCancel() {
            if (SoundManager && SoundManager.playCancel) {
                SoundManager.playCancel();
            }
            this.popScene();
        }
    };

    //=============================================================================
    // 替換原始存檔場景
    //=============================================================================
    
    const _Scene_Save_create = Scene_Save.prototype.create;
    Scene_Save.prototype.create = function() {
        Scene_VICSave.prototype.create.call(this);
    };
    
    const _Scene_Save_update = Scene_Save.prototype.update;
    Scene_Save.prototype.update = function() {
        Scene_VICSave.prototype.update.call(this);
    };
    
    const _Scene_Save_initialize = Scene_Save.prototype.initialize;
    Scene_Save.prototype.initialize = function() {
        Scene_VICSave.prototype.initialize.call(this);
    };
    
    // 複製必要的方法
    Scene_Save.prototype.createBackground = Scene_VICSave.prototype.createBackground;
    Scene_Save.prototype.createWindows = Scene_VICSave.prototype.createWindows;
    Scene_Save.prototype.createHeaderWindow = Scene_VICSave.prototype.createHeaderWindow;
    Scene_Save.prototype.createSaveSlotWindow = Scene_VICSave.prototype.createSaveSlotWindow;
    Scene_Save.prototype.createNavigationWindow = Scene_VICSave.prototype.createNavigationWindow;
    Scene_Save.prototype.updateInput = Scene_VICSave.prototype.updateInput;
    Scene_Save.prototype.nextSlot = Scene_VICSave.prototype.nextSlot;
    Scene_Save.prototype.previousSlot = Scene_VICSave.prototype.previousSlot;
    Scene_Save.prototype.refreshSaveSlot = Scene_VICSave.prototype.refreshSaveSlot;
    Scene_Save.prototype.onSavefileOk = Scene_VICSave.prototype.onSavefileOk;
    Scene_Save.prototype.onSaveSuccess = Scene_VICSave.prototype.onSaveSuccess;
    Scene_Save.prototype.onSaveFailure = Scene_VICSave.prototype.onSaveFailure;
    Scene_Save.prototype.onSavefileCancel = Scene_VICSave.prototype.onSavefileCancel;
    
})();