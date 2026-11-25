/*:
 * @target MZ
 * @plugindesc [VIC專案] 貓咪玩家的心情日記系統（事件專用版）
 * @author Gemini
 * 
 * @help
 * 【使用方法（方案 A）】
 * 1. 請在事件中透過「顯示選擇肢」或「名稱輸入」等方式，將資料存入變數中。
 * 2. 呼叫腳本指令儲存日記：
 *    $gameSystem.saveDiaryFromVariables(情緒變數ID, 標籤陣列變數ID, 內容變數ID);
 *
 * 3. 呼叫腳本指令新增自訂標籤：
 *    $gameSystem.addMoodTagFromVariable(變數ID);
 */

var Imported = Imported || {};
Imported.Vic_MoodDiary = true;

// 初始化與存檔相容
const _DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    _DataManager_createGameObjects.call(this);
    if (!$gameSystem._vicCustomTags) $gameSystem._vicCustomTags = [];
    if (!$gameSystem._vicMoodDiaries) $gameSystem._vicMoodDiaries = [];
};

// 取得所有可用標籤
Game_System.prototype.getMoodTags = function() {
    const baseTags = ["學業", "工作", "感情", "家庭", "health", "創作", "遊戲", "人際", "其他"];
    // 為了符合妳指定的中文名稱，將內部預留的英文轉回中文顯示
    const displayTags = baseTags.map(t => t === "health" ? "健康" : t);
    if (!this._vicCustomTags) this._vicCustomTags = [];
    return displayTags.concat(this._vicCustomTags);
};

// 儲存日記（核心邏輯）
Game_System.prototype.saveDiaryEntry = function(moodIndex, tags, content) {
    if (!this._vicMoodDiaries) this._vicMoodDiaries = [];
    const entry = {
        date: new Date().toLocaleDateString('zh-TW'), 
        mood: moodIndex,                      // 0 ~ 4
        tags: Array.isArray(tags) ? tags : [tags], 
        content: String(content)
    };
    this._vicMoodDiaries.push(entry);
};

// 【事件專用】從指定變數讀取並儲存日記
Game_System.prototype.saveDiaryFromVariables = function(moodVarId, tagsVarId, contentVarId) {
    const mood = $gameVariables.value(moodVarId);
    let tags = $gameVariables.value(tagsVarId);
    const content = $gameVariables.value(contentVarId);
    
    // 防呆：如果標籤變數不是陣列，就將它轉為單一元素的陣列
    if (!Array.isArray(tags)) {
        tags = tags ? [tags] : [];
    }
    
    this.saveDiaryEntry(mood, tags, content);
};

// 【事件專用】從指定變數新增自訂標籤
Game_System.prototype.addMoodTagFromVariable = function(varId) {
    const newTag = String($gameVariables.value(varId)).trim();
    if (newTag && !this.getMoodTags().includes(newTag)) {
        this._vicCustomTags.push(newTag);
    }
};

// 獲取統計數據
Game_System.prototype.getMoodStatistics = function() {
    const diaries = this._vicMoodDiaries || [];
    const stats = {
        moodCounts: [0, 0, 0, 0, 0], // 😄, 🙂, 😐, 🙁, 😭
        tagCounts: {}
    };
    diaries.forEach(entry => {
        if (entry.mood >= 0 && entry.mood <= 4) stats.moodCounts[entry.mood]++;
        entry.tags.forEach(tag => {
            stats.tagCounts[tag] = (stats.tagCounts[tag] || 0) + 1;
        });
    });
    return stats;
};