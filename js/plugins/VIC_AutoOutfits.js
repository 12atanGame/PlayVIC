/*:
 * @target MZ
 * @plugindesc [VIC 專案專用] 根據事件頁內的註釋同步維克與休的行走圖
 * @author Gemini
 * * @help
 * 1. 變數 68 控制維克 (Vic) 的服裝代號 (例如: "V1")
 * 2. 變數 69 控制休 (Hugh) 的服裝代號 (例如: "H1")
 * * 【使用方法】
 * 在事件頁的最上方，新增一個「註釋 (Comment)」指令，內容填寫：
 * <Cloth:V>  -> 該頁面會自動同步為維克的服裝 (變數 68)
 * <Cloth:H>  -> 該頁面會自動同步為休的服裝 (變數 69)
 */

(() => {
    const VAR_VIC = 68;
    const VAR_HUGH = 69;
    const VIC_ACTOR_ID = 1;
    const HUGH_ACTOR_ID = 2;

    // 監控變數變化
    const _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        _Game_Variables_setValue.call(this, variableId, value);
        if (variableId === VAR_VIC || variableId === VAR_HUGH) {
            if ($gameMap) $gameMap.requestRefresh(); 
        }
    };

    // 核心邏輯：在事件刷新頁面時，檢查該頁面的註釋指令
    const _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
        _Game_Event_setupPage.call(this);
        this.updateClothByComment();
    };

    Game_Event.prototype.updateClothByComment = function() {
        const page = this.page();
        if (!page) return;

        // 搜尋該頁面所有的指令，找尋註釋 (Code 108 或 408)
        let clothTag = null;
        page.list.forEach(command => {
            if (command.code === 108 || command.code === 408) {
                const comment = command.parameters[0];
                if (comment.includes("<Cloth:V>")) clothTag = 'V';
                if (comment.includes("<Cloth:H>")) clothTag = 'H';
            }
        });

        // 根據標籤更換圖案
        if (clothTag === 'V') {
            const suffix = $gameVariables.value(VAR_VIC);
            if (suffix) {
                this.setImage("$" + suffix, 0);
                this.setDirection(this.direction());
        }
        } else if (clothTag === 'H') {
            const suffix = $gameVariables.value(VAR_HUGH);
            if (suffix) {
                this.setImage("$" + suffix, 0); 
                this.setDirection(this.direction());
            }

        }

    };

    // 確保主角也會同步
    const _Game_Player_refresh = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function() {
        _Game_Player_refresh.call(this);
        const vic = $gameActors.actor(VIC_ACTOR_ID);
        const hugh = $gameActors.actor(HUGH_ACTOR_ID);
        const vSuff = $gameVariables.value(VAR_VIC);
        const hSuff = $gameVariables.value(VAR_HUGH);
        if (vic && vSuff) vic.setCharacterImage("$" + vSuff, 0);
        if (hugh && hSuff) hugh.setCharacterImage("$" + hSuff, 0);
    };

})();