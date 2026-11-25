/*:
 * @target MZ
 * @plugindesc VIC 專案 - 行程系統 (Vic & Hugh)
 * @author Atan
 *
 * @help
 * 這個插件會管理角色的行程狀態，避免大量並行事件造成掉 FPS。
 *
 * 可用腳本：
 *
 *   $gameSystem.setVicSchedule(x);   // 設定維克行程
 *   $gameSystem.setHughSchedule(x);  // 設定休行程
 *
 * 行程代號：
 *   0 = 出門
 *   1 = 睡覺
 *   2 = 維克看公文|休在盯著維克
 *   3 = 料理
 *   4 = 吃飯
 *   5 = 家中散步
 */

(() => {

  Game_System.prototype.setVicSchedule = function(state) {
    $gameVariables.setValue(66, state);
  };

  Game_System.prototype.setHughSchedule = function(state) {
    $gameVariables.setValue(67, state);
  };

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);


    let VIC_playtime = Math.floor(Graphics.frameCount / 60);

    if($gameSwitches.value(16)){
      if( VIC_playtime / 6 == 0){
        this.updateSchedules();
      }   
    }

  };

  // 行程邏輯 (這裡可以自由改寫)
  Scene_Map.prototype.updateSchedules = function() {

//     行程：
//      0-出外：兩位角色走出家門，透明化。
//      1-在家：他們回到各自房間睡覺。
//      2-在家：維克看公文，休待在維克旁邊。
//      3-在家：維克跟休在做菜。
//      4-在家：維克跟休在餐桌旁坐下吃飯。
//      5-在家：走來走去。


    //  隨機0...5
    let randomVic = Math.floor(Math.random() * 6);
    let randomHugh = Math.floor(Math.random() * 6);

    if (randomVic == 0 || randomHugh == 0){randomVic = 0; randomHugh = 0;}
    $gameSystem.setVicSchedule(randomVic);
    $gameSystem.setHughSchedule(randomHugh); 

    $gameSwitches.setValue(25, true);

    // $gameSwitches.setValue(35, true);

    // 範例：根據遊戲內時間隨機改變狀態
    // 這裡的條件你可以依照原本公共事件的設計再細化

    // 隨機0...3
    // $gameVariables.setValue(64, Math.floor(Math.random() * 4));

    // const time = $gameVariables.value(31); // 現實時間

    // // 維克的行程
    // if (time >= 0 && time < 6) {
    //     // 夜晚
    //     $gameSystem.setVicSchedule(1); // 睡覺
    // } else if (time >= 6 && time < 9) {
    //     // 早晨
    //     $gameSystem.setVicSchedule(0); // 出門
    // } else if (time >= 9 && time < 16) {
    //     // 白天
    //     $gameSystem.setVicSchedule(2); // 做菜
    // } else if (time >= 16 && time < 18) {
    //     // 黃昏

    // } else {
    //     // 夜晚
    //     $gameSystem.setVicSchedule(3); // 閒聊
    // }

    // // 休的行程（先簡單跟隨維克）
    // $gameSystem.setHughSchedule($gameSystem.vicSchedule);

  };

})();
