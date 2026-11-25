/*:
 * @target MZ
 * @plugindesc [v1.1] 全螢幕隱形動態搖桿（徹底阻斷內建觸控尋路）
 * @author Gemini
 * 
 * @help
 * 這是專門為直版手遊設計的隱形移動插件。
 * v1.1 更新：
 * 1. 徹底無效化 RMMZ 內建與插件殘留的 touchMove / 地圖觸控尋路功能。
 * 2. 移除了雙擊（Double Tap）觸發確定鍵的功能，方便開發者自行配置 UI 按鈕。
 * 
 * 【操作說明】
 * 1. 隨處按下並滑動：角色會往手指滑動的方向移動（不尋路）。
 * 2. 點擊空地：不會觸發任何移動或尋路。
 * 3. 事件中的 Move To 指令：由後台觸發，不受此插件影響，可正常運作。
 * 
 * @param DeadZone
 * @text 搖桿死區 (像素)
 * @desc 手指滑動超過多少像素才判定為要移動。防抖動。
 * @default 15
 * 
 * @param DiagonalMove
 * @text 啟用斜方向移動
 * @type boolean
 * @desc 是否允許八方位移動？（true = 八向, false = 傳統四向）
 * @default false
 */

(() => {
    const pluginName = 'InvisibleJoystick';
    const parameters = PluginManager.parameters(pluginName);
    const deadZone = Number(parameters['DeadZone'] || 15);
    const allowDiagonal = String(parameters['DiagonalMove'] || 'false') === 'true';

    let touchStartPosition = null;

    // --- 核心優化 1：徹底閹割 RMMZ 內建的地圖觸控尋路與點擊移動功能 ---
    // 這會直接廢除玩家點擊地圖時的尋路反應，但「後台事件指令的 Move To」走的是不同路線，因此不受影響。
    Scene_Map.prototype.onMapTouch = function() {
        // 原本這裡會計算目的地並移動，現在直接放空，什麼都不做。
    };

    // --- 核心優化 2：攔截並重寫 Scene_Map 的更新邏輯 ---
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
            touchStartPosition = null;
            return; // 執行事件或對話框打開時，不觸發搖桿
        }
        this.updateInvisibleJoystick();
    };

    Scene_Map.prototype.updateInvisibleJoystick = function() {
        // 1. 手指按下 (Touch Start)
        if (TouchInput.isTriggered()) {
            touchStartPosition = { x: TouchInput.x, y: TouchInput.y };
            // 清除內建點擊時間，確保雙重保險
            TouchInput._pressedTime = 0;
        }

        // 2. 手指按住並滑動 (Touch Move / Long Press)
        if (TouchInput.isPressed() && touchStartPosition) {
            const deltaX = TouchInput.x - touchStartPosition.x;
            const deltaY = TouchInput.y - touchStartPosition.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // 強制清除內建的移動目的地，確保地圖上絕對不會出現任何尋路點或閃爍
            $gameTemp.clearDestination();

            if (distance > deadZone) {
                // 計算滑動角度 (弧度轉角度)
                const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
                this.processJoystickDirection(angle);
            } else {
                this.clearJoystickInputs();
            }
        }

        // 3. 手指放開 (Touch End)
        if (TouchInput.isReleased()) {
            touchStartPosition = null;
            this.clearJoystickInputs();
        }
    };

    // 將角度轉換為 RPG Maker 的方向鍵輸入狀態
    Scene_Map.prototype.processJoystickDirection = function(angle) {
        this.clearJoystickInputs();

        if (allowDiagonal) {
            // 八方位判定
            if (angle >= -22.5 && angle < 22.5)   Input._currentState['right'] = true;
            else if (angle >= 22.5 && angle < 67.5)   { Input._currentState['right'] = true; Input._currentState['down'] = true; }
            else if (angle >= 67.5 && angle < 112.5)  Input._currentState['down'] = true;
            else if (angle >= 112.5 && angle < 157.5) { Input._currentState['left'] = true; Input._currentState['down'] = true; }
            else if (angle >= 157.5 || angle < -157.5) Input._currentState['left'] = true;
            else if (angle >= -157.5 && angle < -112.5) { Input._currentState['left'] = true; Input._currentState['up'] = true; }
            else if (angle >= -112.5 && angle < -67.5)  Input._currentState['up'] = true;
            else if (angle >= -67.5 && angle < -22.5)  { Input._currentState['right'] = true; Input._currentState['up'] = true; }
        } else {
            // 傳統四方位判定
            if (angle >= -45 && angle < 45)       {Input._currentState['right'] = true;}
            else if (angle >= 45 && angle < 135)    {Input._currentState['down'] = true;}
            else if (angle >= -135 && angle < -45)  {Input._currentColor = true; Input._currentState['up'] = true;}
            else{ Input._currentState['left'] = true;}
        }
    };

    // 清除虛擬模擬的方向鍵
    Scene_Map.prototype.clearJoystickInputs = function() {
        Input._currentState['up'] = false;
        Input._currentState['down'] = false;
        Input._currentState['left'] = false;
        Input._currentState['right'] = false;
    };
})();