/*:
 * @target MZ
 * @plugindesc [v1.2] 全螢幕隱形動態搖桿（由開關 201 控制啟用）
 * @author Gemini
 * * @help
 * 這是專門為直版手遊設計的隱形移動插件。
 * v1.2 更新：
 * 1. 只有當遊戲中的【開關 201】打開（ON）時，搖桿功能才會啟動。
 * 2. 當開關 201 關閉（OFF）時，插件會完全失效，恢復預設狀態。
 * 3. 修正了上一版向上移動判定的語法小瑕疵。
 * * 【操作說明】
 * 1. 隨處按下並滑動：角色會往手指滑動的方向移動（不尋路）。
 * 2. 點擊空地：不會觸發任何移動或尋路。
 * * @param DeadZone
 * @text 搖桿死區 (像素)
 * @desc 手指滑動超過多少像素才判定為要移動。防抖動。
 * @default 15
 * * @param DiagonalMove
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
    const targetSwitchId = 201; // 控制搖桿啟用的開關 ID

    let touchStartPosition = null;

    // --- 核心優化 1：徹底閹割 RMMZ 內建的地圖觸控尋路功能（需在開關開啟時才閹割） ---
    const _Scene_Map_onMapTouch = Scene_Map.prototype.onMapTouch;
    Scene_Map.prototype.onMapTouch = function () {
        // 如果開關 201 打開了，就吃掉這個觸控，什麼都不做（阻斷尋路）
        if ($gameSwitches.value(targetSwitchId)) {
            return;
        }
        // 如果開關沒開，恢復 RMMZ 原本的點擊移動/尋路功能
        _Scene_Map_onMapTouch.call(this);
    };

    // --- 核心優化 2：攔截並重寫 Scene_Map 的更新邏輯 ---
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);

        // 【關鍵判定】如果開關 201 沒有打開，直接跳出，完全不執行搖桿邏輯
        if (!$gameSwitches.value(targetSwitchId)) {
            touchStartPosition = null;
            return;
        }

        if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
            touchStartPosition = null;
            this.clearJoystickInputs(); // 防止卡住方向鍵
            return; // 執行事件或對話框打開時，不觸發搖桿
        }
        this.updateInvisibleJoystick();
    };

    Scene_Map.prototype.updateInvisibleJoystick = function () {
        // 1. 手指按下 (Touch Start)
        if (TouchInput.isTriggered()) {
            touchStartPosition = { x: TouchInput.x, y: TouchInput.y };
            TouchInput._pressedTime = 0;
        }

        // 2. 手指按住並滑動 (Touch Move / Long Press)
        if (TouchInput.isPressed() && touchStartPosition) {
            const deltaX = TouchInput.x - touchStartPosition.x;
            const deltaY = TouchInput.y - touchStartPosition.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // 強制清除內建的移動目的地
            $gameTemp.clearDestination();

            if (distance > deadZone) {
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
    Scene_Map.prototype.processJoystickDirection = function (angle) {
        this.clearJoystickInputs();

        if (allowDiagonal) {
            // 八方位判定
            if (angle >= -22.5 && angle < 22.5) Input._currentState['right'] = true;
            else if (angle >= 22.5 && angle < 67.5) { Input._currentState['right'] = true; Input._currentState['down'] = true; }
            else if (angle >= 67.5 && angle < 112.5) Input._currentState['down'] = true;
            else if (angle >= 112.5 && angle < 157.5) { Input._currentState['left'] = true; Input._currentState['down'] = true; }
            else if (angle >= 157.5 || angle < -157.5) Input._currentState['left'] = true;
            else if (angle >= -157.5 && angle < -112.5) { Input._currentState['left'] = true; Input._currentState['up'] = true; }
            else if (angle >= -112.5 && angle < -67.5) Input._currentState['up'] = true;
            else if (angle >= -67.5 && angle < -22.5) { Input._currentState['right'] = true; Input._currentState['up'] = true; }
        } else {
            // 傳統四方位判定
            if (angle >= -45 && angle < 45) Input._currentState['right'] = true;
            else if (angle >= 45 && angle < 135) Input._currentState['down'] = true;
            else if (angle >= -135 && angle < -45) Input._currentState['up'] = true; // 已修正語法
            else Input._currentState['left'] = true;
        }
    };

    // 清除虛擬模擬的方向鍵
    Scene_Map.prototype.clearJoystickInputs = function () {
        Input._currentState['up'] = false;
        Input._currentState['down'] = false;
        Input._currentState['left'] = false;
        Input._currentState['right'] = false;
    };
})();
