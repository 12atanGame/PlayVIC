//=============================================================================
// J0h3l Plugins - Common Event as Menu
// J0h3l_CommonEventAsMenu.js
//=============================================================================

var Imported = Imported || {};
Imported.J0h3l_CommonEventAsMenu = true;

var PlugJoh = PlugJoh || {};

//=============================================================================
 /*:
 * @plugindesc v1.0 the first version
 * @author J0h3l
 *
 * @param GENERAL
 * @default
 *
 * @param Common Event
 * @parent GENERAL
 * @type number
 * @min 1
 * @desc Common Event to call instead of the menu
 * @default 1
 *
 *
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 *
 * This plugin allows you to call a common event instead of the menu.
 * More information in the website: j0h3l.itch.io/rmmv-common-event-as-menu
 *
 * Este plugin te permite llamar un evento común en lugar del menu. 
 * Mas información en el sitio web: j0h3l.itch.io/rmmv-common-event-as-menu
 *
 * =============================================================================
 */
//=============================================================================
// Parameters
//=============================================================================

PlugJoh.Parameters = PluginManager.parameters('J0h3l_CommonEventAsMenu');
PlugJoh.Param = PlugJoh.Param || {};

PlugJoh.Param.CommonEvent = Number(PlugJoh.Parameters['Common Event']);

var joh_commonevent = PlugJoh.Param.CommonEvent;

//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

Scene_Map.prototype.callMenu = function() {
    //SoundManager.playOk();
    $gameTemp.reserveCommonEvent(joh_commonevent)
    Window_MenuCommand.initCommandPosition();
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};