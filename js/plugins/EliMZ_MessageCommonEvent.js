//==========================================================================
// EliMZ_MessageCommonEvent.js
//==========================================================================

/*:
@target MZ
@base EliMZ_Book
@orderAfter EliMZ_MessageActions

@plugindesc ♦1.3.0♦ Auto add a common event before and after every show text command
@author Hakuen Studio
@url https://hakuenstudio.itch.io/eli-message-common-event-for-rpg-maker/rate?source=game

@help
★★★★★ Rate the plugin! Please, is very important to me ^^
● Terms of Use
https://www.hakuenstudio.com/terms-of-use-5-0-0

============================================================================
Features
============================================================================

● Adds a common event before and after every show text command.
● Control the common event ids through variables values.
● Disable/Enable the plugin with a switch.

============================================================================
How to use
============================================================================

https://docs.google.com/document/d/1FR9GO7Az6JD6kbIjJ1ZPzUAiO8msaCWVq5QYSi56S8I/edit?usp=sharing

============================================================================

@param enableSwitch
@text Enable Switch
@type switch
@desc If this switch is on, the plugin will add the common event.
@default 1

@param smart
@text Smart behavior
@type boolean
@desc If true, a block of text will be considered. See help file.
@default false

@param openCommonEventId
@text Open common event id
@type variable
@desc The variable that will hold the common event id when open message window.
@default 1

@param closeCommonEventId
@text Close common event id
@type variable
@desc The variable that will hold the common event id when close message window.
@default 2

@param ignoreChoice
@text Ignore Choice
@type boolean
@desc See help file.
@default false

*/

"use strict"

var Eli = Eli || {}
var Imported = Imported || {}
Imported.Eli_MessageCommonEvent = true

/* ========================================================================== */
/*                                   PLUGIN                                   */
/* ========================================================================== */
Eli.MessageCommonEvent = {

    Parameters: class {

        constructor(parameters){
            this.enableSwitch = Number(parameters.enableSwitch)
            this.smart = parameters.smart === "true"
            this.ignoreChoice = parameters.ignoreChoice === "true"
            this.openCommonEventId = Number(parameters.openCommonEventId)
            this.closeCommonEventId = Number(parameters.closeCommonEventId)
        }
    },

    initialize(){
        this.initParameters()
    },

    initParameters(){
        const parameters = PluginManager.parameters(Eli.PluginManager.getPluginName())
        this.parameters = new this.Parameters(parameters)
    },

    getParam(){
        return this.parameters
    },

    canChangeListForMessageCommonEvent(list){
        return this.isEnabled() && this.listHasShowTextCommand(list)
    },

    isEnabled(){
        return $gameSwitches.value(this.getParam().enableSwitch)
    },
    
    listHasShowTextCommand(list){
        return list.some(item => item.code === 101)
    },

    createNewListForMessageCommonEvent(list){
        const newList = []
    
        for(let i = 0; i < list.length; i++){
            const previousCommand = list[i-1]
            let command = list[i]
            let nextCommand = list[i+1]
    
            if(this.isShowTextCommand(command)){
                newList.push(...this.createCommonEventBeforeMessage(previousCommand, command))
        
            }else if(this.isLineTextCommand(command)){
    
                if(!this.getParam().ignoreChoice){
    
                    if(this.isShowChoiceCommand(nextCommand) || this.isLineChoiceCommand(nextCommand)){
                        i++
                        newList.push(command)
                        command = list[i]
                        // nextCommand = list[i+1]
                        nextCommand = list[i] //atan改
                    }
                }
    
                newList.push(...this.createCommonEventAfterMessage(command, nextCommand))
    
            }else{
                newList.push(command)
            }
        }
    
        return newList
    },
    
    createCommonEventBeforeMessage(previousCommand, command){
        const commands = []
    
        if(this.isLineTextCommand(previousCommand) && this.getParam().smart){
            commands.push(command)
        }else{
            commands.push(this.createMsgCommonEventCommand(command.indent, this.getOpenEventId()))
            commands.push(command)
        }
    
        return commands
    },

    getOpenEventId(){
        return $gameVariables.value(this.getParam().openCommonEventId)
    },
    
    createCommonEventAfterMessage(command, nextCommand){
        const commands = [command]
    
        if(!this.isLineTextCommand(nextCommand) && !this.canBatchShowTextCommands(nextCommand)){
            commands.push(this.createMsgCommonEventCommand(command.indent, this.getCloseEventId()))
        }
    
        return commands
    },

    canBatchShowTextCommands(command){
        return this.getParam().smart && this.isShowTextCommand(command)
    },

    getCloseEventId(){
        return $gameVariables.value(this.getParam().closeCommonEventId)
    },
    
    isShowTextCommand(command){
        return command?.code === 101
    },
    
    isLineTextCommand(command){
        return command?.code === 401
    },
    
    isShowChoiceCommand(command){
        return command?.code === 102
    },
    
    isLineChoiceCommand(command){
        return command?.code === 402
    },
    
    isMessageOrChoiceCommand(command){
        return [101, 401, 102, 402].includes(command?.code)
    },
    
    createMsgCommonEventCommand(indent, commonEventId){
        return {
            code: 117,
            indent: indent,
            parameters: [commonEventId]
        }
    },

}

{

const Plugin = Eli.MessageCommonEvent
const Alias = {}

Plugin.initialize()

/* ---------------------------- GAME INTERPRETER ---------------------------- */
Alias.Game_Interpreter_setup = Game_Interpreter.prototype.setup
Game_Interpreter.prototype.setup = function(list, eventId) {
    if(Plugin.canChangeListForMessageCommonEvent(list)){
        list = Plugin.createNewListForMessageCommonEvent(list)
    }

    Alias.Game_Interpreter_setup.call(this, list, eventId)
}

}