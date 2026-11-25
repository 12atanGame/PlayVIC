//=============================================================================
// RPG Maker MZ - Atan_StorySwitch
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Atan_StorySwitch
 * @author Atan
 *
 * @help Atan_StorySwitch.js
 * 事件劇情進行中，自動打開開關。
 * 事件劇情結束時，自動關閉開關。
 * 
 * @param StorySwitchId
 * @text 故事開關ID
 * @desc 故事進行中時開啟的開關ID
 * @type switch
 * 
 */

(() => {
"use strict";

const pluginName = "Atan_StorySwitch";
const parameters = PluginManager.parameters(pluginName);
const AtanStorySwitch = Number(parameters["StorySwitchId"] || 0);

const Scene_Map_Update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    Scene_Map_Update.call(this);
    if (AtanStorySwitch > 0){
        if(!$gameMap.isEventRunning()){
                $gameSwitches.setValue(AtanStorySwitch, false);
            }else{
                $gameSwitches.setValue(AtanStorySwitch, true);  
        }
    } 
};

})();