/*:
 * @target MZ
 * @plugindesc 在畫面指定 X, Y 範圍內點擊時，阻止角色移動
 * @author 阿傑
 */
(() => {
  const _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
  Scene_Map.prototype.processMapTouch = function () {
    // 如果當前有觸控或點擊動作
    if (TouchInput.isTriggered() || TouchInput.isRepeated()) {
      const screenX = TouchInput.x; // 畫面像素 X (從左上角 0 開始)
      const screenY = TouchInput.y; // 畫面像素 Y (從左上角 0 開始)

      // 範例：假設要禁用畫面右下角的 UI 區域
      // 例如 X 在 1000 ~ 1280 像素，Y 在 600 ~ 720 像素之間
      const minX = 0;
      const maxX = 528;
      const minY = 900;
      const maxY = 960;

      if (
        screenX >= minX &&
        screenX <= maxX &&
        screenY >= minY &&
        screenY <= maxY
      ) {
        // 落在禁移畫面區域 -> 直接不處理地圖點擊
        return;
      }
    }

    // 不在禁移區域 -> 執行原本的地圖點擊與移動邏輯
    _Scene_Map_processMapTouch.call(this);
  };
})();
