/*:
 * @target MZ
 * @plugindesc [VIC 專案] 辭典系統 - 完整功能整合版 (支援多行、JS解鎖、圖片捲動)
 * @author Gemini & Project VIC
 * * @param GlossaryList
 * @text 辭典條目列表
 * @type struct<GlossaryItem>[]
 * @default []
 * * @help
 * 【使用說明】
 * 1. 在內容中使用 \bookPicture[檔名] 插入圖片。圖片路徑：img/pictures/Book/
 * 2. 內容支援多行輸入，並正確解析換行與控制字元 (\C[n], \V[n])。
 * 3. 每個條目可寫獨立 JS 腳本解鎖，條件不符則不顯示。
 * 4. 可以使用 --- 進行換頁分頁。
 * 5. 控制：左側清單按 Enter 進入右側捲動，Esc 回到左側。
 * 
 */

/*~struct~GlossaryItem:
 * @param name
 * @text 條目名稱
 * @type text
 * * @param category
 * @text 大分類 (請填：關於世界、維克腦內、休的筆記)
 * @type text
 * @default 關於世界
 * * @param condition
 * @text 解鎖條件 (JS腳本)
 * @desc 範例：$gameVariables.value(199) >= 1
 * @type text
 * @default true
 * * @param content
 * @text 條目內容 (支援多行)
 * @type note
 */

(() => {
    const pluginName = "VIC_Glossary_Integrated";
    const parameters = PluginManager.parameters(pluginName);
    
    // --- 核心資料處理：修正多行與解析問題 ---
    const getGlossaryData = () => {
        try {
            const raw = JSON.parse(parameters['GlossaryList'] || "[]");
            return raw.map(itemStr => {
                const item = JSON.parse(itemStr);
                // 這裡徹底解決 RMMZ Note 欄位的雙重轉義問題
                if (item.content) {
                    try {
                        item.content = JSON.parse(item.content);
                    } catch (e) {
                        item.content = item.content.replace(/\\n/g, "\n");
                    }
                }
                return item;
            });
        } catch (e) { return []; }
    };

    const evalCondition = (code) => {
        if (!code || code.trim() === "" || code.trim() === "true") return true;
        try { return !!eval(code); } catch (e) { return false; }
    };

    // --- 1. 右側：內容展示視窗 ---
    class Window_VIC_GlossaryContent extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this._pages = [];
            this._item = null;
            this.deactivate();
        }

        // 每一頁就是一個選項
        maxItems() { return this._pages.length; }
        itemHeight() { return this.innerHeight; }
        _updateCursor() { this._cursorSprite.visible = false; }

        setItem(item) {
            this._item = item;
            if (!item) {
                this._pages = [];
            } else {
                // 解析多行並依照分頁符號拆分
                let str = item.content || "";
                if (str.startsWith('"')) try { str = JSON.parse(str); } catch(e) {}
                const fullText = str.replace(/\\n/g, "\n");
                // 支援 --- 或 ---- 作為分頁符
                this._pages = fullText.split(/^-{3,}$/m).map(p => p.trim());
            }
            this.select(0);
            this.refresh();
        }

        drawItem(index) {
            const text = this._pages[index];
                if (!text) return;

                // 關鍵修正 1：確保每一頁繪製時，內容是相對於該頁的頂部 (y=0)
                // 我們不使用 itemLineRect(index)，因為那是給列表用的偏移座標
                const rect = this.itemRect(index); 
                let drawY = rect.y + 60; 
                const maxWidth = this.innerWidth - 40;

                // 1. 處理圖片 (blt 模式)
                const picRegex = /\\bookPicture\[(.+?)\]/gi;
                const cleanText = text.replace(picRegex, "");
                const matches = [...text.matchAll(picRegex)];

                if (matches.length > 0) {
                    const fileName = matches[0][1];
                    const bitmap = ImageManager.loadBitmap("img/pictures/Book/", fileName);
                    if (bitmap.isReady()) {
                        let scale = Math.min(1.0, maxWidth / bitmap.width);
                        let dw = bitmap.width * scale;
                        let dh = bitmap.height * scale;
                        let dx = (this.innerWidth - dw) / 2;
                        
                        // 直接畫在 contents 上
                        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, dx, drawY, dw, dh);
                        drawY += dh + 20;
                    } else {
                        // 圖片沒好就監聽載入後重刷，RMMZ 慣例
                        bitmap.addLoadListener(() => this.refresh());
                    }
                }

                // 2. 繪製文字
                this.drawTextEx(cleanText, 20, drawY, maxWidth);

                // 3. 繪製下一頁提示
                // this.drawPageGuide(index);

            // 3. 【新功能】右下角提示字眼
            this.drawPageGuide(index, rect);
        }

        scrollTo(x, y) {
           // 強制讓捲動只停留在頁面的倍數，防止兩頁內容同時出現
            const pageHeight = this.itemHeight();
            const targetY = Math.round(y / pageHeight) * pageHeight;
            super.scrollTo(x, targetY);
        };

        drawPageGuide(index, rect) {
            this.contents.fontSize = 18;
            const isLastPage = index === this.maxItems() - 1;
            const text = isLastPage ? "" : "Next Page [↓↑]";
            const textWidth = this.textWidth(text);
            
            // 畫在右下角，留一點邊距
            const gx = rect.x + rect.width - textWidth - 20;
            const gy = this.innerHeight - 60;
            
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(text, gx, gy, textWidth, "right");
            this.resetTextColor();
            this.resetFontSettings();
        }

        // 操作優化：按確定跳下一頁
        processOk() {
            if (this.index() < this.maxItems() - 1) {
                this.playCursorSound();
                this.select(this.index() + 1);
            } else {
                this.playOkSound();
                this.callHandler('cancel'); // 最後一頁關閉
            }
        }
    }

    // --- 2. 左側：分類與列表 ---
    class Window_VIC_GlossaryCategory extends Window_Command {
        initialize(rect, categories) {
            this._categories = categories;
            super.initialize(rect);
        }
        makeCommandList() {
            // 對應你的 UI 圖片樣式
            const styleMap = { "維克腦內": "", "休的筆記": "", "關於世界": "" };
            this._categories.forEach(cat => {
                const prefix = styleMap[cat] || "";
                this.addCommand(prefix + cat, cat);
            });
        }
        update() {
            super.update();
            if (this._lastIndex !== this.index()) {
                this._lastIndex = this.index();
                this.callHandler('cursor');
            }
        }
    }

    class Window_VIC_GlossaryList extends Window_Selectable {
        constructor(rect) { super(rect); this._data = []; }
        setCategory(cat, allData) {
            this._data = allData.filter(i => i.category === cat && evalCondition(i.condition));
            this.refresh();
            this.select(0);
        }
        maxItems() { return this._data.length; }
        drawItem(index) {
            const item = this._data[index];
            if (item) this.drawText(item.name, this.itemLineRect(index).x, this.itemLineRect(index).y);
        }
        select(index) {
            super.select(index);
            if (this._contentWindow) this._contentWindow.setItem(this._data[index]);
        }
        setContentWindow(win) { this._contentWindow = win; }
    }

    // --- 3. 場景控制 ---
    window.Scene_VIC_Glossary = class extends Scene_MenuBase {
        create() {
            super.create();
            this._allData = getGlossaryData();
            // 抓取所有大分類
            const categories = [...new Set(this._allData.map(i => i.category))];
            
            this.createContentWindow();
            this.createCategoryWindow(categories);
            this.createListWindow();
            
            this.refreshByCategory();
        }

        createCategoryWindow(categories) {
            const rect = new Rectangle(0, 0, 260, 240);
            this._categoryWindow = new Window_VIC_GlossaryCategory(rect, categories);
            this._categoryWindow.setHandler('ok', () => this._listWindow.activate());
            this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
            this._categoryWindow.setHandler('cursor', () => this.refreshByCategory());
            this.addWindow(this._categoryWindow);
        }

        createListWindow() {
            const rect = new Rectangle(0, 240, 260, Graphics.boxHeight - 240);
            this._listWindow = new Window_VIC_GlossaryList(rect);
            this._listWindow.setHandler('cancel', () => {
                this._listWindow.deactivate();
                this._categoryWindow.activate();
            });
            this._listWindow.setHandler('ok', () => {
                this._listWindow.deactivate();
                this._contentWindow.activate();
            });
            this._listWindow.setContentWindow(this._contentWindow);
            this.addWindow(this._listWindow);
        }

        createContentWindow() {
            const rect = new Rectangle(260, 0, Graphics.boxWidth - 260, Graphics.boxHeight);
            this._contentWindow = new Window_VIC_GlossaryContent(rect);
            this._contentWindow.setHandler('cancel', () => {
                this._contentWindow.deactivate();
                this._listWindow.activate();
            });
            this.addWindow(this._contentWindow);
        }

        refreshByCategory() {
            if (this._categoryWindow && this._listWindow) {
                this._listWindow.setCategory(this._categoryWindow.currentSymbol(), this._allData);
            }
        }
    };
})();