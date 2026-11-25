/*:
 * @target MZ
 * @plugindesc [VIC 專案專用] 環型選單座標自動計算插件
 * @author Gemini
 * * @help
 * 【使用方法】
 * 1. 在插件參數中設定「X座標起始變數」與「Y座標起始變數」。
 * 2. 如果你設定 X 起始為 11，那麼 8 組選項的 X 座標會依序寫入變數 11, 12, 13...18。
 * 3. 在公共事件中呼叫插件指令「計算環型座標」，傳入中心點與數量即可。
 *
 * @command calculate
 * @text 計算環型座標
 * @desc 傳入中心點與總選項數，自動計算並寫入對應的變數中。
 *
 * @arg centerX
 * @text 中心點 X (變數ID)
 * @desc 存放中心點 X 座標的變數 ID（例如：玩家的畫面X）。
 * @type variable
 * @default 1
 *
 * @arg centerY
 * @text 中心點 Y (變數ID)
 * @desc 存放中心點 Y 座標的變數 ID（例如：玩家的畫面Y）。
 * @type variable
 * @default 2
 *
 * @arg totalOptions
 * @text 總選項數
 * @desc 這次要生成的選單總數（最高 8 組，超出也會自動均分）。
 * @type number
 * @min 1
 * @max 20
 * @default 5
 *
 * @arg radius
 * @text 圓半徑 (像素)
 * @desc 圖標距離中心點的距離。
 * @type number
 * @default 90
 * * * @param startXVariable
 * @text X 座標起始變數 ID
 * @desc 插件會從這個變數開始，依序往後寫入各個圖標的 X 座標。
 * @type variable
 * @default 11
 *
 * @param startYVariable
 * @text Y 座標起始變數 ID
 * @desc 插件會從這個變數開始，依序往後寫入各個圖標的 Y 座標。
 * @type variable
 * @default 21
 */

(() => {
    const pluginName = "VIC_RadialMenuCalc";

    // 讀取插件參數
    const parameters = PluginManager.parameters(pluginName);
    const startXVar = Number(parameters['startXVariable'] || 11);
    const startYVar = Number(parameters['startYVariable'] || 21);

    // 註冊插件指令
    PluginManager.registerCommand(pluginName, "calculate", args => {
        // 取得當前事件傳入的數值
        const cx = $gameVariables.value(Number(args.centerX));
        const cy = $gameVariables.value(Number(args.centerY));
        const total = Number(args.totalOptions);
        const radius = Number(args.radius);

        for (let i = 0; i < total; i++) {
            // 計算角度（- Math.PI / 2 是為了讓第一個選項在正上方 12 點鐘方向）
            let angle = (i * 2 * Math.PI / total) - (Math.PI / 2);

            // 三角函數計算偏移量
            let xOffset = radius * Math.cos(angle);
            let yOffset = radius * Math.sin(angle);

            // 計算最終絕對座標並四捨五入
            let finalX = Math.round(cx + xOffset);
            let finalY = Math.round(cy + yOffset);

            // 寫入 RMMZ 的變數系統
            $gameVariables.setValue(startXVar + i, finalX);
            $gameVariables.setValue(startYVar + i, finalY);
        }
    });
})();