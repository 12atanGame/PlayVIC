/*:
 * @target MZ
 * @plugindesc 自訂書本風日記顯示系統
 * @author Gemini
 * * @command openDiary
 * @text 打開日記本
 * @desc 呼叫 HTML/CSS 介面顯示指定變數的日記內容。
 * * @arg varId
 * @text 變數編號 / 語法
 * @type string
 * @default 10
 * @desc 可以輸入 180（固定180號變數）或輸入 v[160]（代表讀取160號變數裡面的數值當作目標）。
 * * @command writeDiary
 * @text 寫日記
 * @desc 呼叫 HTML/CSS 介面讓玩家輸入長篇大論，並存入指定變數。
 * * @arg varId
 * @text 變數編號 / 語法
 * @type string
 * @default 10
 * @desc 可以輸入 180（固定180號變數）或輸入 v[160]（代表讀取160號變數裡面的數值當作目標）。
 */

(() => {

    // 解析變數 ID 的輔助函式（支援純數字或 v[x] 語法）
    function getVariableId(arg) {
        if (!arg) return 10;
        const match = String(arg).match(/^v\[(\d+)\]$/i);
        if (match) {
            return $gameVariables.value(Number(match[1])); // 取得變數 160 的值 (例如 165)
        }
        return Number(arg);
    }

    // ==========================================
    // 1. 打開日記本（純顯示）
    // ==========================================
    PluginManager.registerCommand('VIC_Book', 'openDiary', args => {
        const diaryVarId = getVariableId(args.varId); // 使用新解析解析
        const imgPaper = "";

        const playerText = $gameVariables.value(diaryVarId) || "這一天，什麼都沒有寫下。";
        const oldBook = document.getElementById('rmmz-diary-book');
        if (oldBook) oldBook.remove();

        const bookContainer = document.createElement('div');
        bookContainer.id = 'rmmz-diary-book';
        bookContainer.innerHTML = `
        <style>
            #rmmz-diary-book { position: fixed; top: -20px; right: 20px; width: 600px; height: 600px; z-index: 1000; overflow-y: auto; font-family: sans-serif; background-repeat: repeat-y;}
            .box1 { width: 600px; height: 200px; box-shadow: 6px 2px 36px rgba(27,31,37,0.6); margin: 100px auto; padding: 30px; background-color: #e8dfcd; background-image: url("${imgPaper}"); box-sizing: border-box; display: block; border: none; resize: none; outline: none; color: #1C1C1C; font-size: 18px; line-height: 1.6; }
            .close-btn { position: fixed; top: 20px; right: 20px; padding: 10px 20px; background: #1C1C1C; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
            #rmmz-diary-book p { margin: 0 0 20px 0; color: #1C1C1C; white-space: pre-wrap; line-height: 1.6; font-size: 18px; }
        </style>
        <button class="close-btn" onclick="document.getElementById('rmmz-diary-book').remove()">關閉</button>
        <div class="box1"><p>${playerText}</p></div>
        `;
        document.body.appendChild(bookContainer);
    });
    
    // ==========================================
    // 2. 寫日記（輸入並儲存）
    // ==========================================
    PluginManager.registerCommand('VIC_Book', 'writeDiary', args => {
        const diaryVarId = getVariableId(args.varId); // 使用新解析解析
        const imgPaper = "";

        // 讀取舊文字，如果是初始值就給空字串，方便玩家直接輸入
        const currentText = $gameVariables.value(diaryVarId) || ""; 
        
        const oldBook = document.getElementById('rmmz-diary-book');
        if (oldBook) oldBook.remove();

        const bookContainer = document.createElement('div');
        bookContainer.id = 'rmmz-diary-book';
        bookContainer.innerHTML = `
        <style>
            #rmmz-diary-book { position: fixed; top: -20px; right: 20px; width: 600px; height: 600px; z-index: 1000; overflow-y: auto; font-family: sans-serif; background-repeat: repeat-y;}
            /* 針對 textarea 進行樣式優化，拔除預備外框與調整縮放 */
            textarea.box1 { width: 600px; height: 200px; box-shadow: 6px 2px 36px rgba(27,31,37,0.6); margin: 100px auto; padding: 30px; background-color: #e8dfcd; background-image: url("${imgPaper}"); box-sizing: border-box; display: block; border: none; resize: none; outline: none; color: #1C1C1C; font-size: 18px; line-height: 1.6; }
            .close-btn { position: fixed; top: 20px; right: 20px; padding: 10px 20px; background: #1C1C1C; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; z-index: 1001; }
        </style>
        <!-- 移除 form 標籤，給 textarea 一個 id 方便撈資料，且內文直接放變數 -->
        <textarea id="diary-textarea" class="box1" placeholder="在這裡寫下今天的冒險...">${currentText}</textarea>
        <button id="diary-submit-btn" class="close-btn">存檔</button>
        `;
        document.body.appendChild(bookContainer);

        // --- 核心儲存與防錯邏輯 ---
        const textarea = document.getElementById('diary-textarea');
        const submitBtn = document.getElementById('diary-submit-btn');

        // 核心防錯：阻止鍵盤事件往外傳遞（避免打字時觸發 RMMZ 地圖移動或開啟選單）
        textarea.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });
        textarea.addEventListener('keyup', (e) => {
            e.stopPropagation();
        });

        // 點擊「闔上日記」按鈕時觸發儲存
        submitBtn.addEventListener('click', () => {
            const updatedText = textarea.value; // 抓取玩家打的字
            $gameVariables.setValue(diaryVarId, updatedText); // 寫入 RMMZ 遊戲變數！
            // 可選：如果你有做自動存檔，可以在這行補上 $gameSystem.onBeforeSave();
            bookContainer.remove(); // 儲存完後關閉 UI
        });
    });
})();