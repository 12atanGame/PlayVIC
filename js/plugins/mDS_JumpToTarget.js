/*:
 * @target MZ
 * @author 阿曜(Takumi) @minorDreamStudio
 * @plugindesc 操作玩家角色或地圖事件跳躍向玩家角色或目標地圖事件，或其附近。
 * 
 * @help 
 * 
 * --- 插件簡介 --- 
 * 這是一款專為 RPG Maker MZ 開發的移動輔助插件。它的主要功能是讓玩家角色或
 * 地圖事件，能夠精準地跳躍向指定的目標事件，或是跳躍到特定的地圖座標上，或
 * 這些目標/座標的附近。
 * 
 * 
 * --- 全域參數說明 ---
 * * defaultJumpShift_X: 落點X座標預設偏移量
 * 跳躍後，落下地點的 X 座標偏移預設值（負數 = 向左，正數 = 向右）
 * 
 * * defaultJumpShift_Y: 落點Y座標預設偏移量
 * 跳躍後，落下地點的 Y 座標偏移預設值（負數 = 向上，正數 = 向下）
 * 
 * * autoFitBoundarySwitch: 打開「自動適應地圖邊界」功能
 * 綁定一個開關 ID。當該開關為 ON 時，若跳躍落點在地圖外或邊緣，
 * 會自動將落點拉回地圖範圍內。
 * 
 * * autoFitBoundaryDistance: 自動適應地圖邊界距離
 * 當觸發「邊界適應」時，重新設定落點距離地圖邊緣多少格距離。
 * 
 * 
 * --- 插件指令說明 ---
 * 1. JumpToEvent: 跳躍向目標
 * 
 * - 使指定的主角或事件，跳躍至另一個目標事件的身邊。
 * 
 * - 指令參數：
 * 
 * * jumpSubjectId (跳躍者ID) / jumpSubjectVariable (跳躍者變數)：
 * 指定誰要跳躍。輸入 -1 代表主角，0 代表本事件，1 或以上代表特定的地圖事件ID。
 * 若有設定變數指定，將會優先覆蓋直接輸入的 ID 參數。
 * 
 * * jumpTargetId (跳躍目標ID) / jumpTargetVariable (跳躍目標變數)：
 * 指定要跳向誰。代碼規則同上。若有設定變數指定，同樣會覆蓋直接輸入的 ID 參數。
 * 
 * * jumpShift_X (落點偏移X) / jumpShift_Y (落點偏移Y)：
 * 本次跳躍的專屬落點偏移量。如果有輸入數值，將會覆蓋全域參數中的預設偏移量。
 * 
 * * setWaitForJumping (等待跳躍完成)：
 * 可選擇是否要暫停事件執行，直到跳躍動作完全結束 (true 或 false)。
 * 
 * 
 * 2. JumpToCoordinate: 跳躍向座標地點
 * 
 * - 使指定的主角或事件，跳躍至地圖上的指定 X, Y 座標。
 * 
 * - 指令參數：
 * 
 * * jumpSubjectId (跳躍者ID) / jumpSubjectVariable (跳躍者變數)
 * 說明同上。
 * 
 * * jumpTargetX (跳躍座標X) / jumpTargetY(跳躍座標Y)：
 * 直接輸入目的地座標的具體數值。
 * 
 * * jumpTargetX_Variable (跳躍座標X變數)  / jumpTargetY_Variable (跳躍座標Y變數)：
 * 透過遊戲變數來決定目的地座標。只要有設定變數，就會覆蓋上方直接輸入的數值。
 * 
 * * jumpShift_X (落點偏移X) / jumpShift_Y (落點偏移Y)：
 * 本次跳躍的專屬落點偏移量。預設為0並覆蓋全域參數中的預設偏移量。
 * 如果想使用全域參數中的設定，請把指令中參數刪除。
 * 
 * * setWaitForJumping (等待跳躍完成)：
 * 選擇是否暫停事件直到本次跳躍動作結束。
 * 
 * 
 * --- 注意事項 ---
 * - 變數的優先權較高：
 * 在所有插件指令中，如果你同時使用了「數值指定」與「變數指定」，
 * 系統設計上會一律優先採用「變數」中的數值，讓事件設計更具彈性。
 * 
 * - JumpToCoordinate指令裡，跳躍的X座標和Y座標可以用不同方式指定：
 * 用戶可以使用jumpTargetX 指定 X座標，同時使用jumpTargetY_Variable
 * 來指定 Y座標變數，反之亦然。
 * 
 * 
 * 
 * @param defaultJumpShift_X
 * @text 落點X座標偏移量(預設值)
 * @desc 跳躍後, 落下地點的X座標偏移程度(負數=左，正數=右)
 * @type number
 * @default 0
 * 
 * @param defaultJumpShift_Y
 * @text 落點Y座標偏移量(預設值)
 * @desc 跳躍後, 落下地點的X座標程度(負數=上，正數=下)
 * @type number
 * @default 1
 * 
 * @param autoFitBoundarySwitch
 * @text 打開自動適應地圖邊界(指定開關)
 * @desc 當指定開關為ON時, 如果跳躍的落下地點在地圖外或地圖邊緣, 重新設定為地圖邊緣前的座標
 * @type switch
 * @default 1
 * 
 * @param autoFitBoundaryDistance
 * @text 自動適應地圖邊界距離
 * @desc 如果跳躍落點在地圖外或地圖邊緣, 重新設定地點為地圖邊緣前的多少格的座標距離
 * @type number
 * @default 1
 * 
 * 
 * @command JumpToEvent
 * @text 跳躍向目標
 * @desc 使主角或事件跳躍向目標事件
 * 
 * @arg jumpSubjectId
 * @text 跳躍者id
 * @desc 跳躍者(-1=主角，0=本事件,1或以上=地圖事件id)
 * @default -1 
 * 
 * @arg jumpSubjectVariable
 * @text 跳躍者id(以變數指定)
 * @desc 以變數指定跳躍者(會覆蓋 jumpSubjectId 參數)
 * @type variable
 * @default 0
 * 
 * @arg jumpTargetId
 * @text 跳躍目標id
 * @desc 跳躍的目標對象(-1=主角，0=本事件,1或以上=地圖事件id)
 * @default 0
 * 
 * @arg jumpTargetVariable
 * @text 跳躍目標id(以變數指定)
 * @desc 以變數指定跳躍的目標(會覆蓋 jumpTargetId 參數)
 * @type variable
 * @default 0
 * 
 * @arg jumpShift_X
 * @text 落點偏移X
 * @desc 跳躍落下地點的X座標偏移(會覆蓋defaultJumpShift_X的設定)
 * 
 * @arg jumpShift_Y
 * @text 落點偏移Y
 * @desc 跳躍落下地點的Y座標偏移(會覆蓋defaultJumpShift_Y的設定)
 * 
 * @arg setWaitForJumping
 * @text 等待跳躍完成
 * @desc 暫停事件直到本次跳躍完成
 * @type select
 * @option true
 * @value true
 * @option false
 * @value false
 * @default true
 * 
 * 
 * 
 * @command JumpToCoordinate
 * @text 跳躍向座標地點
 * @desc 使主角或事件跳躍向指定座標地點
 * 
 * @arg jumpSubjectId
 * @text 跳躍者id
 * @desc 跳躍者(-1=主角，0=本事件,1或以上=地圖事件id)
 * @default 0 
 * 
 * @arg jumpSubjectVariable
 * @text 跳躍者id(以變數指定)
 * @desc 以變數指定跳躍者(會覆蓋 jumpSubjectId 參數)
 * @type variable
 * @default 0
 * 
 * @arg jumpTargetX
 * @text 跳躍座標X
 * @desc 跳躍目的地的X座標
 * @type number
 * @default 0 
 * 
 * @arg jumpTargetY
 * @text 跳躍座標Y
 * @desc 跳躍目的地的Y座標
 * @type number
 * @default 0 
 * 
 * @arg jumpTargetX_Variable
 * @text 跳躍座標X(以變數指定)
 * @desc 以變數指定跳躍目的地的X座標(會覆蓋 jumpTargetX 參數)
 * @type variable
 * @default 0
 * 
 * @arg jumpTargetY_Variable
 * @text 跳躍座標Y(以變數指定)
 * @desc 以變數指定跳躍目的地的Y座標(會覆蓋 jumpTargetY 參數)
 * @type variable
 * @default 0
 * 
 * @arg jumpShift_X
 * @text 落點偏移X
 * @desc 跳躍落下地點的X座標偏移(會覆蓋defaultJumpShift_X的設定)
 * @default 0
 * 
 * @arg jumpShift_Y
 * @text 落點偏移Y
 * @desc 跳躍落下地點的Y座標偏移(會覆蓋defaultJumpShift_Y的設定)
 * @default 0
 * 
 * @arg setWaitForJumping
 * @text 等待跳躍完成
 * @desc 暫停事件直到本次跳躍完成
 * @type select
 * @option true
 * @value true
 * @option false
 * @value false
 * @default true
 * 
 * 
 */


// PLUGIN COMMANDS
//-----------------------------------------------------------------------------
/**
 * 檔案名稱。
 * 
 * 如果你有更改檔名，請保持這個值與檔名一致，否則無法讀取到插件參數。
 */
const filename = "mDS_JumpToTarget"

// 讀取插件參數
const parameters = PluginManager.parameters(filename);
const defaultJumpShift_X = Number(parameters['defaultJumpShift_X']);
const defaultJumpShift_Y = Number(parameters['defaultJumpShift_Y']);
const autoFitBoundarySwitch = Number(parameters['autoFitBoundarySwitch']);
const autoFitBoundaryDistance = Number(parameters['autoFitBoundaryDistance']);


// 定義插件命令功能
PluginManager.registerCommand(filename, "JumpToEvent", function(args) {
    
    let subject = getSubject.call(this, args.jumpSubjectId, args.jumpSubjectVariable);
    if (!subject) return;

    let [targetX, targetY] = getCoordinateFromTarget.call(this, args.jumpTargetId, args.jumpTargetVariable);
    if (targetX === null || targetY === null ) return;

    let [jumpShift_X, jumpShift_Y] = setJumpShift.call(this, targetX, targetY, args.jumpShift_X, args.jumpShift_Y, defaultJumpShift_X, defaultJumpShift_Y, autoFitBoundaryDistance);
    Takumi_JumpStart(subject, targetX, targetY, jumpShift_X, jumpShift_Y, args.setWaitForJumping);
    console.log("------------------");

});


PluginManager.registerCommand(filename, "JumpToCoordinate", function(args) {
    
    let subject = getSubject.call(this, args.jumpSubjectId, args.jumpSubjectVariable);
    if (!subject) return;

    let [targetX, targetY] = getCoordinateFromUser.call(this, args.jumpTargetX, args.jumpTargetX, args.jumpTargetX_Variable, args.jumpTargetY_Variable);
    if (targetX === null || targetY === null ) return;

    let [jumpShift_X, jumpShift_Y] = setJumpShift.call(this, targetX, targetY, args.jumpShift_X, args.jumpShift_Y, defaultJumpShift_X, defaultJumpShift_Y, autoFitBoundaryDistance);
    Takumi_JumpStart(subject, targetX, targetY, jumpShift_X, jumpShift_Y, args.setWaitForJumping);
    console.log("------------------");

});






// PLUGIN FUNCTIONS
//-----------------------------------------------------------------------------

// 擴充 Game_Interpreter
// 修改等待模式邏輯, 使其能判斷特定的角色是否正在跳躍(對應的新 WaitMode: "takumi_jump")
const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function() {
    let waiting = false;
    if (this._waitMode === "takumi_jump") {
        // 檢查解釋器當前綁定的跳躍對象
        const character = this._takumi_jumping_character || $gamePlayer;
        // 檢查是否正在移動或跳躍
        // isStopping() 在跳躍時會返回 false
        waiting = !character.isStopping();
        // 跳躍後清除WaitMode和角色綁定
        if (!waiting) {
            this._waitMode = "";
            this._takumi_jumping_character = null;
        }
        return waiting;
    }
    // 如果不是"takumi_jump"模式，就執行原本的邏輯
    return _Game_Interpreter_updateWaitMode.call(this);
};

// 取得跳躍者
function getSubject(jumpSubjectId, jumpSubjectVariable) {

    console.log("start getSubject...");
    console.log(jumpSubjectVariable);

    jumpSubjectId = Number(jumpSubjectId);
    jumpSubjectVariable = Number(jumpSubjectVariable);

    let subjectId;
    let subject;

    // 1. 取得跳躍者的id
    if (jumpSubjectVariable != 0) {
        //取得變數內容, 覆蓋參數 jumpSubjectId
        console.log("jumpSubjectVariable: ", jumpSubjectVariable);
        subjectId = $gameVariables.value(jumpSubjectVariable);

    } else {
        subjectId = jumpSubjectId;
    }

    // 2. 指定跳躍者為subject
    if (subjectId === -1) {
        // -1 代表主角
        subject = $gamePlayer;
        console.log("get subject: Player");
        
    } else if (subjectId === 0) {
        // 0 代表此事件 (使用 this._eventId 獲取當前執行事件的 ID)
        // 如果是在公共事件中執行且沒有綁定地圖事件，this._eventId 可能是 0，這時無法獲取對象
        if (this._eventId > 0) {
            subject = $gameMap.event(this._eventId);
            console.log("get subject: eventId ", this._eventId, "(This event)");
        }
    } else {
        // >0 代表指定事件 ID

        subject = $gameMap.event(subjectId);
        if (!subject) {
            console.log("錯誤：找不到跳躍事件 ID " + subjectId);
        } else {
            console.log("get subject: eventId ", $gameMap.event(subjectId));
        };
    };

    // 如果找不到對象 (例如事件ID不存在, 或在非地圖事件環境下使用了ID 0), 則中斷
    if (!subject) return;

    // 3. Output
    return subject;
}


// 從目標對象取得落點
function getCoordinateFromTarget(jumpTargetId, jumpTargetVariable) {
    // 1. 取得目標的id
    let targetId;
    let targetX;
    let targetY;

    jumpTargetId = Number(jumpTargetId);
    jumpTargetVariable = Number(jumpTargetVariable);

    if (jumpTargetVariable != 0) {
        console.log("get targetId from variable");
        //取得變數內容，覆蓋參數jumpTargetid;
        targetId = $gameVariables.value(jumpTargetVariable);

            
    } else {
        targetId = jumpTargetId;
    };
    console.log("finish get targetId: ", targetId);

    //2. 取得目標的座標XY
    if (targetId === -1) {
	//當跳躍目標是玩家時
	targetX = $gamePlayer.x;
	targetY = $gamePlayer.y;
	
    } else if (targetId === 0) {
        //當跳躍目標是本事件時
        if ($gameMap.event(this._eventId)) {
            targetX = $gameMap.event(this._eventId).x;
            targetY = $gameMap.event(this._eventId).y;
        } else {
            console.log("錯誤：找不到目標事件 ID " + this._eventId);
            return [null, null];
        };
        
    } else {
        //當跳躍目標是其他地圖事件時
        if ($gameMap.event(targetId)) {
            targetX = $gameMap.event(targetId).x;
            targetY = $gameMap.event(targetId).y;
        } else {
            console.log("錯誤：找不到目標事件 ID " + targetId);
            return [null, null];
        }
;
    };


    // 3. 輸出座標
    console.log("get target: ", targetId, ", X:",targetX , ", Y:", targetY);
    return [targetX, targetY];
};



// 從指令參數直接取得落點
function getCoordinateFromUser(jumpTargetX, jumpTargetY, jumpTargetX_Variable, jumpTargetY_Variable) {
    let targetX;
    let targetY;

    jumpTargetX = Number(jumpTargetX);
    jumpTargetY = Number(jumpTargetY);
    jumpTargetX_Variable = Number(jumpTargetX_Variable);
    jumpTargetY_Variable = Number(jumpTargetY_Variable);

    if (jumpTargetX_Variable > 0) {
        //當跳躍座標由變數決定
        targetX = $gameVariables.value(jumpTargetX_Variable);
    } else {
        //當跳躍座標由用戶直接指定
        targetX = jumpTargetX;
    };

    if (jumpTargetY_Variable > 0) {
        //當跳躍座標由變數決定
        targetY = $gameVariables.value(jumpTargetY_Variable);
    } else {
        //當跳躍座標由用戶直接指定
        targetY = jumpTargetY;
    };

    // 輸出座標
    console.log("Target X:",targetX , ", Y:", targetY);
    return [targetX, targetY];
};



// 設定落點偏移
function setJumpShift(targetX, targetY, jumpShift_X, jumpShift_Y, defaultJumpShift_X, defaultJumpShift_Y, autoFitBoundaryDistance=1) {
    // 如果插件指令裡有輸入JumpShift_X 和 JumpShift_Y，以插件指令為準
    // 如果插件指令裡只輸入 JumpShift_X 或 JumpShift_Y 任一數值，
    // 用defaultJumpShift的值來補充
    // 如果都沒有，以 defaultJumpShift 為準

    autoFitBoundaryDistance = Number(autoFitBoundaryDistance)

    if (jumpShift_X == "") {
        jumpShift_X = defaultJumpShift_X;
    } else {jumpShift_X = Number(jumpShift_X)};

    if (jumpShift_Y == "") {
        jumpShift_Y = defaultJumpShift_Y;
    } else {jumpShift_Y = Number(jumpShift_Y)};

    // 自動適應地圖邊界距離
    // 如果目的地位於地圖邊界，降落點向內移動
    // 地圖寛度為：$gameMap.width()、地圖高度為：$gameMap.height()
    // 因此，事件座標X最大為$gameMap.width()-1；
    // 事件座標Y最大為$gameMap.height()-1

    console.log("Map width: ", $gameMap.width(), ", Map height: ", $gameMap.height());
    console.log("jumpShift_X: ", jumpShift_X, ", jumpShift_Y: ", jumpShift_Y);

    if ($gameSwitches.value(autoFitBoundarySwitch)) {
        // 當落點位於地圖的左方邊界外時，
        if (targetX + jumpShift_X <= 0) {
            jumpShift_X = -targetX + autoFitBoundaryDistance;
        
        // 當落點位於地圖的右方邊界外時
        } else if (targetX + jumpShift_X >= $gameMap.width()-1) {
            jumpShift_X = $gameMap.width() - 1 - targetX - autoFitBoundaryDistance;
        };
        
        // 當落點位於地圖的上方邊界外時，
        if (targetY + jumpShift_Y <= 0) {   
            jumpShift_Y = -targetY + autoFitBoundaryDistance;
        
        // 當落點位於地圖的下方邊界外時，
        } else if (targetY + jumpShift_Y >= $gameMap.height() - 1) {
            console.log("落點位於地圖的下方邊界外!");
            jumpShift_Y = $gameMap.height() - 1 - targetY - autoFitBoundaryDistance;
            console.log(jumpShift_Y);
        };
    };

    // 輸出落點偏移
    console.log("Target X:",targetX , ", Y:", targetY, "; Jumpshift X:", jumpShift_X, ", Y:", jumpShift_Y);
    return [jumpShift_X, jumpShift_Y];
};


// 正式跳躍
function Takumi_JumpStart(subject, targetX, targetY, jumpShift_X, jumpShift_Y, setWaitForJumping) {
    // 計算跳躍距離
    // 公式：目標座標 - 當前座標 + 偏移量
    const jumpX = targetX - subject.x + jumpShift_X;
    const jumpY = targetY - subject.y + jumpShift_Y;

    // 執行跳躍
    subject.jump(jumpX, jumpY);

    // --- 設定事件等待 ---
    // 因為在 registerCommand 用了 .call(this, ...)，這裡的 this 指向 interpreter
    // 如果是從腳本直接呼叫這個函數，this 可能是 window，所以要做個檢查
    // setWaitForJumping = Boolean(setWaitForJumping);
    console.log("Wait for jumping:", setWaitForJumping, typeof setWaitForJumping);
    if (setWaitForJumping == "true") {

        let interpreter = null;
        if (this instanceof Game_Interpreter) {
            interpreter = this;
        } else {
            // 如果無法透過 this 獲取，嘗試全域獲取
            interpreter = $gameParty.inBattle() ? $gameTroop._interpreter : $gameMap._interpreter;
        }

        if (interpreter) {
            // 告訴解釋器現在是誰在跳，這樣 updateWaitMode 才知道要等誰
            interpreter._takumi_jumping_character = subject;
            interpreter.setWaitMode('takumi_jump');
        }
    };

};

