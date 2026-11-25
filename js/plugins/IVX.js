/*:
 * @target MZ
 * @plugindesc 允許在\I[]語法中使用變數，如\I[\V[1]]
 * @author ChatGPT (MZ port)
 * 
 * @help 
 * 使用方式：
 * 在顯示文字時使用 \I[\V[1]] 即可顯示變數1中所代表的圖示ID。
 */

(function() {
  // 保存原始的convertEscapeCharacters函式
  var _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;

  Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = text.replace(/\\V\[(\d+)\]/gi, function() {
      return $gameVariables.value(parseInt(arguments[1]));
    });
    // 將\I[\V[x]]轉成\I[n]，注意上面先處理變數後再解析icon
    text = _Window_Base_convertEscapeCharacters.call(this, text);
    return text;
  };
})();