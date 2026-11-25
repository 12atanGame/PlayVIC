/*:
 * @target MZ
 * @plugindesc v1.0 Switch 44 toggles outdoor tilesets 9 (summer) and 10 (winter).
 * @author ChatGPT
 * @help
 * When switch 44 is OFF, maps using tileset 9/10 use tileset 9.
 * When switch 44 is ON, maps using tileset 9/10 use tileset 10.
 * Other tilesets are untouched. Applies on map entry and immediately
 * when switch 44 changes on the current map.
 * Keep corresponding tile positions and passability aligned in both tilesets.
 * No plugin commands.
 */
(() => {
    "use strict";
    const SWITCH_ID = 44;
    const SUMMER_ID = 9;
    const WINTER_ID = 10;

    function applySeason() {
        if (!$gameMap || !$gameSwitches || !$dataMap) return;
        const current = $gameMap.tilesetId();
        if (current !== SUMMER_ID && current !== WINTER_ID) return;
        const target = $gameSwitches.value(SWITCH_ID) ? WINTER_ID : SUMMER_ID;
        if (current !== target) $gameMap.changeTileset(target);
    }

    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        applySeason();
    };

    const _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value) {
        const oldValue = this.value(switchId);
        _Game_Switches_setValue.call(this, switchId, value);
        if (switchId === SWITCH_ID && oldValue !== this.value(switchId)) {
            applySeason();
        }
    };
})();
