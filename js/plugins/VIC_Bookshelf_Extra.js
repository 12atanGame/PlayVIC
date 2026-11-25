/*:
 * @target MZ
 * @plugindesc [VIC Project] 安全載入置中版 - 徹底移除標題視窗
 * @author Ruたん / Gemini 改裝
 */

(() => {
    'use strict';

    const Torigoya = window.Torigoya;
    if (!Torigoya || !Torigoya.Bookshelf) return;

    const { TextParser, Scene_Bookshelf } = Torigoya.Bookshelf;

    // --- 1. 支援 ### 分類的解析邏輯 ---
    TextParser.prototype.parse = function(text) {
        const lines = text.split(/\r?\n/);
        return {
            title: this.parseBookshelfTitle(lines),
            categories: this.parseCategories(lines),
        };
    };

    TextParser.prototype.parseCategories = function(lines) {
        const categories = [];
        let currentCategory = { title: "", books: [] };
        lines = lines.slice(0);
        while (lines.length > 0) {
            const line = lines.shift();
            const catMatch = line.match(/^###\s*(.+)$/);
            if (catMatch) {
                if (currentCategory.books.length > 0) categories.push(currentCategory);
                currentCategory = { title: catMatch[1], books: [] };
                continue;
            }
            const bookMatch = line.match(/^##(?!#)\s*(?:if\((.+)\):)?\s*(.+)$/);
            if (bookMatch) {
                const contentLines = [];
                while (lines[0] !== undefined && !lines[0].match(/^##/) && !lines[0].match(/^###/)) {
                    contentLines.push(lines.shift());
                }
                currentCategory.books.push({
                    title: bookMatch[2],
                    condition: bookMatch[1],
                    pages: this.parseBookContent(contentLines),
                });
            }
        }
        if (currentCategory.books.length > 0) categories.push(currentCategory);
        return categories;
    };

    // --- 2. 定義置中分類視窗 ---
    class Window_BookshelfCategory extends Window_Selectable {
        setCategories(categories) {
            this._data = categories;
            this.refresh();
        }
        maxItems() { return this._data ? this._data.length : 0; }
        item() { return this._data[this.index()]; }
        drawItem(index) {
            const rect = this.itemLineRect(index);
            this.drawText(this._data[index].title, rect.x, rect.y, rect.width, 'center');
        }
    }

    // --- 3. 場景控制：徹底移除標題視窗並置中 ---
    const POPUP_WIDTH = 500;

    // 【核心修正】直接讓建立標題視窗的動作失效，消滅左上角方塊
    Scene_Bookshelf.prototype.createTitleWindow = function() {
        // 這裡留空，就不會建立那個 _titleWindow 了
    };

    const _Scene_Bookshelf_create = Scene_Bookshelf.prototype.create;
    Scene_Bookshelf.prototype.create = function() {
        _Scene_Bookshelf_create.call(this);
        this.createCategoryWindow();
    };

    Scene_Bookshelf.prototype.createCategoryWindow = function() {
        const rect = this.booksListWindowRect();
        this._categoryWindow = new Window_BookshelfCategory(rect);
        this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
        this._categoryWindow.hide();
        this.addWindow(this._categoryWindow);
    };

    Scene_Bookshelf.prototype.onLoadSuccess = function(bookshelf) {
        this._bookshelf = bookshelf;
        this._categoryWindow.setCategories(this._bookshelf.categories);
        this._booksListWindow.hide();
        this._categoryWindow.show();
        this._categoryWindow.activate();
        this._categoryWindow.select(0);
        this.adjustWindowPosition();
    };

    Scene_Bookshelf.prototype.onCategoryOk = function() {
        const category = this._categoryWindow.item();
        this._booksListWindow.setBooks(category.books);
        this._categoryWindow.deactivate();
        this._categoryWindow.hide();
        this._booksListWindow.show();
        this._booksListWindow.activate();
        this._booksListWindow.select(0);
        this.adjustWindowPosition();
    };

    Scene_Bookshelf.prototype.onBooksCancel = function() {
        this._booksListWindow.deactivate();
        this._booksListWindow.hide();
        this._categoryWindow.show();
        this._categoryWindow.activate();
        this.adjustWindowPosition();
    };

    Scene_Bookshelf.prototype.booksListWindowRect = function() {
        const h = this.calcWindowHeight(6, true);
        const x = (Graphics.boxWidth - POPUP_WIDTH) / 2;
        const y = (Graphics.boxHeight - h) / 2;
        return new Rectangle(x, y, POPUP_WIDTH, h);
    };

    Scene_Bookshelf.prototype.adjustWindowPosition = function() {
        if (!this._bookshelf) return;
        const activeWin = this._categoryWindow.visible ? this._categoryWindow : this._booksListWindow;
        activeWin.height = this.calcWindowHeight(activeWin.maxItems(), true);
        activeWin.y = (Graphics.boxHeight - activeWin.height) / 2;
    };

    const _Scene_Bookshelf_createBooksListWindow = Scene_Bookshelf.prototype.createBooksListWindow;
    Scene_Bookshelf.prototype.createBooksListWindow = function() {
        _Scene_Bookshelf_createBooksListWindow.call(this);
        this._booksListWindow.setHandler('cancel', this.onBooksCancel.bind(this));
        this._booksListWindow.hide(); // 初始隱藏，直到選完分類
    };
})();