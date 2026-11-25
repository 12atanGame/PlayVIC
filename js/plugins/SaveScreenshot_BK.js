/*:
 * @target MZ
 * @plugindesc 兩欄式存檔系統：解決截圖全黑問題 + 強制 UI 隱藏。
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
            
            tempCanvas.width = canvas.width / 2;
            tempCanvas.height = canvas.height / 2;

            // 關閉平滑處理，讓縮圖更銳利
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

            // 5. 生成數據
            const dataUrl = tempCanvas.toDataURL('image/jpeg', 1);

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
        // 在存檔前先抓好圖並存放在場景物件中
        this._myLastSnap = captureGameScreenshot();
        _Scene_Save_executeSave.apply(this, arguments);
    };

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        const scene = SceneManager._scene;
        // 如果目前是存檔場景，就拿剛才抓好的圖
        if (scene instanceof Scene_Save && scene._myLastSnap) {
            contents.system._mySnapshot = scene._myLastSnap;
        } 
        // 如果是自動存檔或其他情況，現場補抓一張
        else {
            contents.system._mySnapshot = captureGameScreenshot();
        }
        return contents;
    };

    const _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function() {
        const info = _DataManager_makeSavefileInfo.call(this);
        // 這邊確保預覽時能正確讀取剛存進去的 snapshot
        const contents = DataManager.makeSaveContents();
        const leader = $gameParty.leader();
        if (leader) {
            info.faceName = leader.faceName();
            info.faceIndex = leader.faceIndex();
        }

        // 抓取所有出戰隊友的臉圖資料
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

    // --- 3. 右側詳情視窗 (維持原樣) ---
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
                this.drawScreenshot(info.snapUrl, 20, infoY, 960, 540);
                infoY += 560;
            }
            if (info.customVars) {

                /* 找到原本繪製單人臉圖的地方，替換成以下邏輯 */
                if (info.allFaces && info.allFaces.length > 0) {
                    const maxFaces = 4; // 最多顯示人數，避免超出視窗
                    const faces = info.allFaces.slice(0, maxFaces);
                    
                    // 設定縮小後的臉圖尺寸 (原大 144，這裡建議縮小一點才塞得下多人)
                    const drawSize = 144; 
                    const spacing = 12; // 臉圖之間的間距
                    const totalWidth = (drawSize * faces.length) + (spacing * (faces.length - 1));
                    
                    // 起始 X 位置 (讓整排臉圖置中)
                    let startX = 20;
                    
                    for (const face of faces) {
                        // 使用 drawFace 的最後四個參數來達成縮放：
                        // sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH
                        this.drawFace(face.name, face.index, startX, infoY, drawSize, drawSize);
                        startX += drawSize + spacing;
                    }
                    
                    infoY += drawSize; // 更新下一個項目的 Y 位置
                }

                infoY += 10;

                this.contents.fontSize = 24;
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(info.customVars.chapter, 20, infoY, this.innerWidth, "left");
                infoY += 36;
                this.resetTextColor();
                this.contents.fontSize = $gameSystem.mainFontSize();
                const playTimeShow = String(info.playtime);
                this.drawText(`遊玩時間：${playTimeShow}`, 20, infoY, this.innerWidth);
                infoY += 36;
                this.drawText(`現在位置：${info.place}`, 20, infoY, this.innerWidth);
                // infoY += 36;
                // this.drawText(`天數：${info.customVars.days}`, 20, infoY, this.innerWidth);
                infoY += 36;
                this.drawText(`互相好感：${info.customVars.vicLove}0%`, 20, infoY, 200);
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

    // --- 4. 場景與列表佈局 (維持原樣) ---
    const _Scene_File_create = Scene_File.prototype.create;
    Scene_File.prototype.create = function() {
        _Scene_File_create.apply(this, arguments);
        this._listWindow.width = 360;
        const x = this._listWindow.x + this._listWindow.width;
        this._detailWindow = new Window_SaveDetail(new Rectangle(x, this._listWindow.y, Graphics.width - x, this._listWindow.height));
        this.addWindow(this._detailWindow);
    };

    const _Scene_File_update = Scene_File.prototype.update;
    Scene_File.prototype.update = function() {
        _Scene_File_update.apply(this, arguments);
        if (this._listWindow && this._detailWindow) {
            this._detailWindow.setSavefileId(this._listWindow.indexToSavefileId(this._listWindow.index()));
        }
    };

    // --- 2. (選配) 讓捲動更順暢的微調 ---
    // 如果你希望 19 個格子剛好填滿一頁且不出現捲動軸，
    // 我們可以稍微調整左側列表的視覺邊距。
    const _Window_SavefileList_initialize = Window_SavefileList.prototype.initialize;
    Window_SavefileList.prototype.initialize = function(rect) {
        _Window_SavefileList_initialize.call(this, rect);
        // 這裡可以確保列表刷新時的選中狀態更穩定
        this.refresh();
    };
    Window_SavefileList.prototype.itemHeight = function() { return 49; };
    // --- 修改：存檔列表繪製邏輯 (修正文字取得方式) ---
    Window_SavefileList.prototype.drawItem = function(index) {
        const id = this.indexToSavefileId(index);
        const rect = this.itemRectWithPadding(index);
        const info = DataManager.savefileInfo(id);

        this.resetTextColor();
        this.changePaintOpacity(this.isEnabled(id));

        // 設定 Icon
        const iconId = info ? 189 : 187; 
        this.drawIcon(iconId, rect.x, rect.y + (rect.height - 32) / 2);

        // 正確取得方式：資料庫設定的「檔案」字樣 + ID
        const name = TextManager.file + " " + id; 
        let titleText = name;

        // 如果存檔資訊存在且有時間戳記
        // --- 修改：將絕對日期改為相對時間顯示 ---
        if (info && info.timestamp) {
            const now = new Date();
            const saveDate = new Date(info.timestamp);
            
            // 將兩個日期都轉為「零點」來計算天數差異，避免小時差造成的誤判
            const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfSave = new Date(saveDate.getFullYear(), saveDate.getMonth(), saveDate.getDate());
            
            // 計算天數差 (毫秒轉天數)
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
                // 超過一週則恢復顯示年月日
                const year = saveDate.getFullYear();
                const month = String(saveDate.getMonth() + 1).padStart(2, '0');
                const day = String(saveDate.getDate()).padStart(2, '0');
                dateShow = `${year}-${month}-${day}`;
            }
            titleText += ` [ ${dateShow} ]`;
        }

        // 繪製文字
        this.drawText(titleText, rect.x + 40, rect.y, rect.width - 40);
    };


})();