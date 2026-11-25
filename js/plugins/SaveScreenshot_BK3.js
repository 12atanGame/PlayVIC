/*:
 * @target MZ
 * @plugindesc 兩欄式存檔系統：解決截圖全黑問題 + 強制 UI 隱藏（自訂截圖尺寸 1500x540 居中裁切）。
 * @author Gemini
 */

(() => {
    "use strict";

    // --- 1. 修改存檔總數上限 ---
    DataManager.maxSavefiles = function() {
        return 19; // 將原本預設的 20 改為 19
    };

    function captureGameScreenshot() {
        try {
            const scene = SceneManager._scene;
            if (!scene) return null;

            // 1. 記錄原始狀態
            const uiVisible = scene._windowLayer ? scene._windowLayer.visible : true;
            
            // 關鍵：處理 Scene_MenuBase 產生的背景模糊
            let oldFilters = null;
            if (scene._backgroundSprite && scene._backgroundSprite.filters) {
                oldFilters = scene._backgroundSprite.filters;
                scene._backgroundSprite.filters = null; // 暫時移除背景模糊
            }

            // 2. 暫時隱藏 UI
            if (scene._windowLayer) scene._windowLayer.visible = false;

            // 3. 強制渲染 (此時背景與內容都是清晰的)
            Graphics.app.renderer.render(scene);

            // 4. 抓取並處理畫布
            const canvas = Graphics._canvas;
            const tempCanvas = document.createElement('canvas');
            const ctx = tempCanvas.getContext('2d');
            
            // 固定目標截圖尺寸為 1500 * 480
            const targetWidth = 480;
            const targetHeight = 280;
            tempCanvas.width = targetWidth;
            tempCanvas.height = targetHeight;

            // 關閉平滑處理，讓縮圖更銳利
            ctx.imageSmoothingEnabled = false;

            // --- 核心：計算置中裁切 (Center Crop) ---
            // 1. 計算當寬度固定為 1500px 時，原圖等比例縮放後的對應高度
            const scale = targetWidth / canvas.width;
            const scaledHeight = canvas.height * scale;

            // 2. 計算在原圖畫布（canvas）上，應該從什麼 Y 座標開始裁切，才能達到「畫面水平置中」
            // 公式：(縮放後高度 - 目標高度) / 2 / 縮放比例 = 原圖需要跳過的上方高度
            const sourceX = 0;
            const sourceY = (scaledHeight - targetHeight) / 2 / scale;
            
            // 3. 計算在原圖畫布上要抓取的寬高範圍
            const sourceWidth = canvas.width;
            const sourceHeight = targetHeight / scale;

            // 執行裁切與繪製
            ctx.drawImage(
                canvas, 
                sourceX, sourceY, sourceWidth, sourceHeight, // 來源範圍 (原圖畫布)
                0, 0, targetWidth, targetHeight             // 目標範圍 (新畫布)
            );

            // 5. 生成數據
            const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.9); // 稍微調低一點點點質量(0.9)以節省存檔體積，若要最高畫質可改回 1

            // 6. 還原所有狀態
            if (scene._windowLayer) scene._windowLayer.visible = uiVisible;
            if (scene._backgroundSprite && oldFilters) {
                scene._backgroundSprite.filters = oldFilters; // 還原模糊
            }

            return dataUrl;
        } catch (e) {
            console.error("高清截圖捕捉失敗:", e);
            return null;
        }
    }

    // --- 2. 存檔流程對接 ---
    const _Scene_Save_executeSave = Scene_Save.prototype.executeSave;
    Scene_Save.prototype.executeSave = function(savefileId) {
        this._myLastSnap = captureGameScreenshot();
        _Scene_Save_executeSave.apply(this, arguments);
    };

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        const scene = SceneManager._scene;
        if (scene instanceof Scene_Save && scene._myLastSnap) {
            contents.system._mySnapshot = scene._myLastSnap;
        } else {
            contents.system._mySnapshot = captureGameScreenshot();
        }
        return contents;
    };

    const _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function() {
        const info = _DataManager_makeSavefileInfo.call(this);
        const contents = DataManager.makeSaveContents();
        const leader = $gameParty.leader();
        if (leader) {
            info.faceName = leader.faceName();
            info.faceIndex = leader.faceIndex();
        }

        info.allFaces = $gameParty.members().map(actor => {
            return {
                name: actor.faceName(),
                index: actor.faceIndex()
            };
        });

        info.snapUrl = contents.system._mySnapshot;

        info.customVars = {
            chapter: $gameVariables.value(200),
            days: $gameVariables.value(197),
            progress: $gameVariables.value(196),
            vicLove: $gameVariables.value(2),
            huLove: $gameVariables.value(3)
        };
        info.place = $gameMap.displayName() || "未知區域";
        return info;
    };

    // --- 3. 右側詳情視窗 ---
    class Window_SaveDetail extends Window_Base {
        constructor(rect) {
            super(rect);
            this._savefileId = -1;
            this.refresh();
        }
        setSavefileId(savefileId) {
            if (this._savefileId !== savefileId) {
                this._savefileId = savefileId;
                this.refresh();
            }
        }
        refresh() {
            this.contents.clear();
            const info = DataManager.savefileInfo(this._savefileId);
            if (!info) {
                this.drawText("無存檔數據", 0, this.innerHeight / 2, this.innerWidth, "center");
                return;
            }
            let infoY = 20;
            if (info.snapUrl) {
                // --- 修改：配合新尺寸，將繪製寬高改為 1500*540 的對應比例（或直接原寸渲染） ---
                // 注意：如果你的 UI 右側視窗寬度沒有 1500px，blt 會自動幫你縮放到符合視窗的大小。
                // 這裡寬度帶入 this.innerWidth - 40 可以讓它自動適應右側視窗寬度，高度則依比例縮放
                const displayWidth = this.innerWidth - 40;
                const displayHeight = (displayWidth / 480) * 280; 
                
                this.drawScreenshot(info.snapUrl, 20, infoY, displayWidth, displayHeight);
                infoY += displayHeight + 20;
            }
            if (info.customVars) {

                if (info.allFaces && info.allFaces.length > 0) {
                    const maxFaces = 4;
                    const faces = info.allFaces.slice(0, maxFaces);
                    const drawSize = 144; 
                    const spacing = 12;
                    
                    let startX = 20;
                    
                    for (const face of faces) {
                        this.drawFace(face.name, face.index, startX, infoY, drawSize, drawSize);
                        startX += drawSize + spacing;
                    }
                    
                    infoY += drawSize;
                }

                infoY += 10;

                this.contents.fontSize = 24;
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(info.customVars.chapter, 20, infoY, this.innerWidth, "left");
                infoY += 36;
                this.resetTextColor();
                this.contents.fontSize = $gameSystem.mainFontSize();
                const playTimeShow = String(info.playtime);
                this.drawText(`${playTimeShow}．${info.place}．互相好感：${info.customVars.vicLove}0%`, 20, infoY, this.innerWidth);
                // infoY += 36;
                // this.drawText(`| ${info.place}`, 160, infoY, this.innerWidth);
                // infoY += 36;
                // this.drawText(`| 互相好感：${info.customVars.vicLove}0%`, 330, infoY, 400);
            }
        }
        drawScreenshot(url, x, y, w, h) {
            const bitmap = ImageManager.loadBitmapFromUrl(url);
            bitmap.addLoadListener(() => {
                this.contents.fillRect(x - 2, y - 2, w + 4, h + 4, ColorManager.outlineColor());
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y, w, h);
            });
        }
    }

    // --- 4. 場景與列表佈局 ---
    const _Scene_File_create = Scene_File.prototype.create;
    Scene_File.prototype.create = function() {
        _Scene_File_create.apply(this, arguments);
        this._listWindow.width = 532;
        const x = 0;
        const y = 120;
        this._listWindow.y = 690;
        this._listWindow.height = 260;
        this._detailWindow = new Window_SaveDetail(new Rectangle(x, y, Graphics.width - x - 8, 564));
        this.addWindow(this._detailWindow);
    };

    const _Scene_File_update = Scene_File.prototype.update;
    Scene_File.prototype.update = function() {
        _Scene_File_update.apply(this, arguments);
        if (this._listWindow && this._detailWindow) {
            this._detailWindow.setSavefileId(this._listWindow.indexToSavefileId(this._listWindow.index()));
        }
    };

    const _Window_SavefileList_initialize = Window_SavefileList.prototype.initialize;
    Window_SavefileList.prototype.initialize = function(rect) {
        _Window_SavefileList_initialize.call(this, rect);
        this.refresh();
    };
    Window_SavefileList.prototype.itemHeight = function() { return 49; };

    Window_SavefileList.prototype.drawItem = function(index) {
        const id = this.indexToSavefileId(index);
        const rect = this.itemRectWithPadding(index);
        const info = DataManager.savefileInfo(id);

        this.resetTextColor();
        this.changePaintOpacity(this.isEnabled(id));

        const iconId = info ? 189 : 187; 
        this.drawIcon(iconId, rect.x, rect.y + (rect.height - 32) / 2);

        const name = TextManager.file + " " + id; 
        let titleText = name;

        if (info && info.timestamp) {
            const now = new Date();
            const saveDate = new Date(info.timestamp);
            const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfSave = new Date(saveDate.getFullYear(), saveDate.getMonth(), saveDate.getDate());
            const diffTime = startOfNow - startOfSave;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            let dateShow = "";
            if (diffDays === 0) {
                dateShow = "今天";
            } else if (diffDays === 1) {
                dateShow = "1 天前";
            } else if (diffDays < 30) {
                dateShow = `${diffDays} 天前`;
            } else {
                const year = saveDate.getFullYear();
                const month = String(saveDate.getMonth() + 1).padStart(2, '0');
                const day = String(saveDate.getDate()).padStart(2, '0');
                dateShow = `${year}-${month}-${day}`;
            }
            titleText += ` [ ${dateShow} ]`;
        }

        this.drawText(titleText, rect.x + 40, rect.y, rect.width - 40);
    };

})();