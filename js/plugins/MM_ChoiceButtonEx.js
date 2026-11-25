//=============================================================================
// MM_ChoiceButtonEx.js
//=============================================================================
// Copyright (c) 2026 - 牛乳もなか
// このプラグインは正規に購入したユーザーだけが利用規約の範囲内で使用することができます。
// 利用規約は同梱しているテキストファイルをご確認ください。
// This plugin may only be used by authorized purchasers within the terms of use.
// Please see the included text for terms of use.
//----------------------------------------------------------------------------
// Version
// 1.0.0 2026/07/09 release version.
//----------------------------------------------------------------------------
/*:
* @target MZ
* @url https://x.com/milkmonaka_1
* @plugindesc v1.0.0 Flexibly arrange image-based buttons and selection options.
* @author milkmonaka
* @help
*
* [Plugin Commands]
* showChoicePreset / showButtonPanelPreset:
* Shows buttons from a JSON preset ID.
* Presets are loaded from dataMM/MMChoiceButtonExPresets.json by default.
* During desktop playtesting, the JSON file is checked again whenever a preset
* is displayed, so edits are applied the next time the preset is shown.
* Use Button Studio MZ to create and edit the file.
* The command can override the result variable and per-button text/actions.
* Button positions are stored directly on each button as x/y. Alignment,
* paths, rings, and offsets are editor tools that write final positions.
*
* clearChoiceButtons:
* Immediately clears the visible modal choice buttons.
*
* Scene-start auto presets:
* Use autoShowPresets to show JSON presets automatically when a scene starts.
* The preset type decides how it is shown: choice opens modal choices, panel
* opens a persistent button panel.
* Each entry can decide whether the shown buttons receive focus immediately.
* Each entry can also set an input symbol that moves focus to the shown buttons.
* Each entry can override input mode and focus-on-hover only for that auto-show.
* On maps, add <MMChoiceButtonExNoAutoShow> to the map note to skip only
* these automatic displays. Preset display commands still work.
*
* Show Choices replacement:
* choiceReplacementRules can replace the event command "Show Choices" with a
* JSON choice preset. The event's choice texts override the preset texts, and
* the normal event branches continue to work.
* If Choice Count is 0 and Match Choice Texts is empty, the rule intentionally
* matches every Show Choices command. Use this as a catch-all when you want to
* replace all event choices at once.
*
* hideButtonPanel / hideAllButtonPanels:
* Hides persistent panels after their exit animations. Saved states remain,
* so panels can be restored. Panels with Enter/Exit On Focus enabled exit
* when focus is lost and enter again when focused by key, command, or hover.
*
* eraseButtonPanel / eraseAllButtonPanels:
* Immediately erases persistent panels without exit animations and removes
* their saved states.
* Erased panels cannot be restored.
*
* Choice buttons play their exit animation when confirmed. Result processing
* and scene changes do not wait for the animation. Scene termination stops any
* remaining exit processing immediately.
*
* restoreButtonPanel / restoreAllButtonPanels:
* Restores persistent panels saved by panel ID.
* Use this to show earlier panels again after scene changes or loading.
*
* setButtonFocus:
* Changes keyboard/button operation focus.
* When target is panel, specify the panel ID.
*
* [Runtime State]
* $gameTemp.mmChoiceButtonEx.result
* Last result object:
* { type, index, value, text }
* On cancel, index is 0 and value is 0.
* $gameTemp.mmChoiceButtonEx.result.index is the last confirmed button index.
*
* $gameTemp.mmChoiceButtonEx.selectedIndex
* Current selected index. 0 means no selection; otherwise it is 1-based.
* This is the real-time selected item.
*
* $gameTemp.mmChoiceButtonEx.isActive
* true while image choice buttons are active.
*
* $gameTemp.mmChoiceButtonEx.focus
* Current operation focus:
* { type: "none"|"choice"|"panel", panelId }
*
* $gameTemp.mmChoiceButtonEx.panelResults[panelId]
* Last toggle result for the persistent panel:
* { type: "toggle", index, panelId, value, text, toggled }
*
* $gameTemp.mmChoiceButtonEx.panels[panelId]
* Current persistent panel state:
* { selectedIndex, toggles, inputMode, isActive }
* Persistent panel settings and ON/OFF states are internally saved to
* $gameSystem, so they can be restored after scene changes or save/load.
*
* [Script API]
* MMChoiceButtonEx.showChoicePreset(args)
* MMChoiceButtonEx.showButtonPanelPreset(args)
* Shows buttons from a JSON preset.
*
* MMChoiceButtonEx.showChoice(config, options)
* MMChoiceButtonEx.clearChoice(options)
* MMChoiceButtonEx.isChoiceActive()
* MMChoiceButtonEx.currentFocus()
* Generic script API for child plugins that create a choice configuration at runtime.
* options.onDismiss(info) is called when a choice is replaced or cleared without a result.
* clearChoice({ exitingOnly: true }) removes completed exit effects without clearing the active choice.
*
* MMChoiceButtonEx.hideButtonPanel(panelId)
* MMChoiceButtonEx.hideAllButtonPanels()
* Hides one or all visible panels. Saved states remain.
*
* MMChoiceButtonEx.eraseButtonPanel(panelId)
* MMChoiceButtonEx.eraseAllButtonPanels()
* Erases one or all panels and removes their saved states.
*
* MMChoiceButtonEx.restoreButtonPanel(panelId)
* MMChoiceButtonEx.restoreAllButtonPanels()
* Restores saved persistent panels. Returns true if restoration succeeded.
*
* MMChoiceButtonEx.focusPanel(panelId)
* MMChoiceButtonEx.focusChoice()
* MMChoiceButtonEx.clearFocus()
* MMChoiceButtonEx.setFocus(target, panelId)
* Changes operation focus. target is none / choice / panel.
*
* MMChoiceButtonEx.panelResult(panelId):
* Returns the specified panel's last toggle result.
*
* MMChoiceButtonEx.panelState(panelId):
* Returns the specified panel's current or saved state.
*
* @param defaultResultVariable
* @text Default Result Variable
* @desc Default variable that stores the selected result value.
* @type variable
* @default 0
*
* @param presetDataFile
* @text Preset Data File
* @desc JSON preset file path. Missing file is treated as an empty preset list.
* @type string
* @default dataMM/MMChoiceButtonExPresets.json
*
* @param autoShowPresets
* @text Auto-show on Scene Start
* @desc JSON presets shown automatically when each scene starts.
* @type struct<AutoPreset>[]
* @default []
*
* @param choiceReplacementRules
* @text Replace Show Choices
* @desc Rules that automatically replace event "Show Choices" commands with JSON choice presets.
* @type struct<ChoiceReplacement>[]
* @default []
*
* @command showChoicePreset
* @text Show Choice Preset
* @desc Shows modal choice buttons from a JSON preset ID.
*
* @arg presetId
* @text Preset ID
* @desc Preset identifier in the JSON file.
* @type string
* @default
*
* @arg buttonOverrides
* @text Button Overrides
* @desc Per-button text, result value, switch, common event, and script overrides. Empty fields keep preset values.
* @type struct<ChoiceButtonPresetOverride>[]
* @default []
*
* @arg resultVariable
* @text Result Variable
* @desc Overrides the preset result variable. 0 uses the preset or default parameter.
* @type variable
* @default 0
*
* @command clearChoiceButtons
* @text Clear Choice Buttons
* @desc Immediately clears the active modal choice buttons.
*
* @command showButtonPanelPreset
* @text Show Button Panel Preset
* @desc Shows persistent toggle buttons from a JSON preset ID.
*
* @arg presetId
* @text Preset ID
* @desc Preset identifier in the JSON file.
* @type string
* @default
*
* @arg buttonOverrides
* @text Button Overrides
* @desc Per-button text, result value, switch, ON/OFF common event, and script overrides. Empty fields keep preset values.
* @type struct<PanelButtonPresetOverride>[]
* @default []
*
* @arg panelId
* @text Panel ID
* @desc Optional panel ID override. Empty uses the preset panel ID.
* @type string
* @default
*
* @arg resultVariable
* @text Result Variable
* @desc Overrides the preset result variable. 0 uses the preset or default parameter.
* @type variable
* @default 0
*
* @command hideButtonPanel
* @text Hide Button Panel
* @desc Hides a persistent button panel while keeping its saved state.
*
* @arg panelId
* @text Panel ID
* @desc Panel ID to hide.
* @type string
* @default default
*
* @command hideAllButtonPanels
* @text Hide All Button Panels
* @desc Hides all visible persistent button panels while keeping saved states.
*
* @command eraseButtonPanel
* @text Erase Button Panel
* @desc Hides a persistent button panel and removes its saved state.
*
* @arg panelId
* @text Panel ID
* @desc Panel ID to erase.
* @type string
* @default default
*
* @command eraseAllButtonPanels
* @text Erase All Button Panels
* @desc Hides all persistent button panels and removes their saved states.
*
* @command restoreButtonPanel
* @text Restore Button Panel
* @desc Restores a saved persistent button panel.
*
* @arg panelId
* @text Panel ID
* @desc Saved panel ID to restore.
* @type string
* @default default
*
* @command restoreAllButtonPanels
* @text Restore All Button Panels
* @desc Restores all saved persistent button panels.
*
* @command setButtonFocus
* @text Set Button Focus
* @desc Switches keyboard/button operation focus.
*
* @arg target
* @text Target
* @desc Focus target.
* @type select
* @option None
* @value none
* @option Choice Buttons
* @value choice
* @option Button Panel
* @value panel
* @default none
*
* @arg panelId
* @text Panel ID
* @desc Panel ID used when Target is Button Panel.
* @type string
* @default default
*/

/*~struct~ChoiceButton:
* @param text
* @text Text
* @desc Text shown on the button. Supports \v[n] and \c[n].
* @type string
* @default Item
*
* @param imageName
* @text Image
* @desc Button image in img/system.
* @type file
* @dir img/system
* @default
*
* @param selectedImageName
* @text Selected Image
* @desc Optional selected image in img/system. Empty uses Image.
* @type file
* @dir img/system
* @default
*
* @param spriteSheetImageName
* @text Sprite Sheet
* @desc Optional horizontal sprite sheet in img/system. When set, Image and Selected Image are not used.
* @type file
* @dir img/system
* @default
*
* @param spriteSheetFrameCount
* @text Sprite Frame Count
* @desc Number of frames arranged horizontally. The image width is divided by this value.
* @type number
* @min 1
* @default 1
*
* @param spriteSheetFrameInterval
* @text Sprite Frame Interval
* @desc Frames to wait before advancing to the next sprite-sheet frame.
* @type number
* @min 1
* @default 6
*
* @param cursorImageName
* @text Cursor Override
* @desc Optional cursor image for only this button. Empty uses the preset cursor image.
* @type file
* @dir img/system
* @default
*
* @param enabled
* @text Enabled
* @desc Disabled buttons are dimmed and cannot be selected or confirmed.
* @type boolean
* @default true
*
* @param disabledImageName
* @text Disabled Image
* @desc Optional image used while this button is disabled.
* @type file
* @dir img/system
* @default
*
* @param disabledOpacity
* @text Disabled Opacity
* @desc Opacity used while disabled when Disabled Image is empty.
* @type number
* @min 0
* @max 255
* @default 128
*
* @param opacity
* @text Opacity
* @desc Normal button opacity. 255 is fully opaque.
* @type number
* @min 0
* @max 255
* @default 255
*
* @param x
* @text X
* @desc Button center X position.
* @type number
* @min -9999
* @default
*
* @param y
* @text Y
* @desc Button center Y position.
* @type number
* @min -9999
* @default
*
* @param angle
* @text Angle
* @desc Rotation angle in degrees.
* @type number
* @min -3600
* @default
*
* @param value
* @text Result Value
* @desc Value written to the result variable. 0 uses the 1-based index.
* @type number
* @min -999999
* @default 0
*
* @param commonEventId
* @text Common Event
* @desc Common event reserved when this choice is confirmed. 0 disables it.
* @type common_event
* @default 0
*
* @param switchId
* @text Switch
* @desc Switch turned ON when this choice is confirmed. 0 disables it.
* @type switch
* @default 0
*
* @param script
* @text Script
* @desc Script evaluated after this choice is confirmed and closed.
* @type multiline_string
* @default
*/

/*~struct~ToggleButton:
* @param text
* @text Text
* @desc Text shown on the button. Supports \v[n] and \c[n].
* @type string
* @default Toggle
*
* @param onImageName
* @text ON Image
* @desc Image used while this item is ON after being confirmed.
* @type file
* @dir img/system
* @default
*
* @param offImageName
* @text OFF Image
* @desc Image used while this item is OFF.
* @type file
* @dir img/system
* @default
*
* @param selectedImageName1
* @text Selected Image 1
* @desc Image used while this item is ON and focused. Empty uses ON Image.
* @type file
* @dir img/system
* @default
*
* @param selectedImageName2
* @text Selected Image 2
* @desc Image used while this item is OFF and focused. Empty uses OFF Image.
* @type file
* @dir img/system
* @default
*
* @param cursorImageName
* @text Cursor Override
* @desc Optional cursor image for only this button. Empty uses the preset cursor image.
* @type file
* @dir img/system
* @default
*
* @param x
* @text X
* @desc Button center X position.
* @type number
* @min -9999
* @default
*
* @param y
* @text Y
* @desc Button center Y position.
* @type number
* @min -9999
* @default
*
* @param angle
* @text Angle
* @desc Rotation angle in degrees.
* @type number
* @min -3600
* @default
*
* @param value
* @text Result Value
* @desc Value written to the result variable. 0 uses the 1-based index.
* @type number
* @min -999999
* @default 0
*
* @param switchId
* @text Switch
* @desc Switch turned ON when this toggle is pressed. 0 disables it.
* @type switch
* @default 0
*
* @param syncSwitchWithToggle
* @text Sync Switch ON/OFF
* @desc ON mirrors the toggle state to the switch. OFF always turns the switch ON when pressed.
* @type boolean
* @on Sync
* @off ON only
* @default false
*
* @param onCommonEventId
* @text ON Common Event
* @desc Common event reserved when this toggle turns ON. 0 disables it.
* @type common_event
* @default 0
*
* @param offCommonEventId
* @text OFF Common Event
* @desc Common event reserved when this toggle turns OFF. 0 disables it.
* @type common_event
* @default 0
*
* @param script
* @text Script
* @desc Script evaluated after this toggle is pressed.
* @type multiline_string
* @default
*/

/*~struct~ChoiceButtonPresetOverride:
* @param index
* @text Button Index
* @desc 1-based button index to override.
* @type number
* @min 1
* @default 1
*
* @param text
* @text Text
* @desc Override text. Empty keeps the preset value.
* @type string
* @default
*
* @param value
* @text Result Value
* @desc Override result value. Empty keeps the preset value.
* @type string
* @default
*
* @param commonEventId
* @text Common Event
* @desc Override common event. Empty keeps the preset value.
* @type string
* @default
*
* @param switchId
* @text Switch
* @desc Override switch ID. Empty keeps the preset value.
* @type string
* @default
*
* @param script
* @text Script
* @desc Override script. Empty keeps the preset value.
* @type multiline_string
* @default
*/

/*~struct~PanelButtonPresetOverride:
* @param index
* @text Button Index
* @desc 1-based button index to override.
* @type number
* @min 1
* @default 1
*
* @param text
* @text Text
* @desc Override text. Empty keeps the preset value.
* @type string
* @default
*
* @param value
* @text Result Value
* @desc Override result value. Empty keeps the preset value.
* @type string
* @default
*
* @param switchId
* @text Switch
* @desc Override switch ID. Empty keeps the preset value.
* @type string
* @default
*
* @param onCommonEventId
* @text ON Common Event
* @desc Override ON common event. Empty keeps the preset value.
* @type string
* @default
*
* @param offCommonEventId
* @text OFF Common Event
* @desc Override OFF common event. Empty keeps the preset value.
* @type string
* @default
*
* @param script
* @text Script
* @desc Override script. Empty keeps the preset value.
* @type multiline_string
* @default
*/

/*~struct~AutoPreset:
* @param sceneName
* @text Scene Name
* @type combo
* @option Scene_Title
* @option Scene_Map
* @option Scene_Menu
* @option Scene_Item
* @option Scene_Skill
* @option Scene_Equip
* @option Scene_Status
* @option Scene_Options
* @option Scene_Save
* @option Scene_Load
* @option Scene_GameEnd
* @option Scene_Shop
* @option Scene_Name
* @option Scene_Debug
* @option Scene_Battle
* @option Scene_Gameover
* @desc Scene where the preset is shown. Custom scene names can be typed manually.
*
* @param presetId
* @text Preset ID
* @desc JSON preset ID to show. Its type decides whether it appears as choice or panel.
* @type string
* @default
*
* @param resultVariable
* @text Result Variable
* @desc Overrides the preset result variable. 0 uses the preset or default parameter.
* @type variable
* @default 0
*
* @param panelId
* @text Panel ID
* @desc Optional panel ID override. Used only when the preset type is panel.
* @type string
* @default
*
* @param autoFocus
* @text Auto Focus
* @desc Focus the auto-shown buttons immediately. OFF does not focus them.
* @type boolean
* @on Focus
* @off No Focus
* @default true
*
* @param focusKey
* @text Focus Key
* @desc Input symbol that moves focus to this auto-shown preset. Empty disables. ok/cancel/menu are allowed.
* @type combo
* @option ok
* @option cancel
* @option menu
* @option shift
* @option pageup
* @option pagedown
* @option up
* @option down
* @option left
* @option right
* @option control
* @option tab
* @default
*
* @param inputModeOverride
* @text Input Mode Override
* @desc Overrides the preset input mode only for this auto-show entry.
* @type select
* @option Preset
* @value preset
* @option Always
* @value always
* @option Button Priority
* @value button
* @option Mouse
* @value mouse
* @default preset
*
* @param hoverFocusOverride
* @text Focus On Hover Override
* @desc Overrides the preset focus-on-hover setting only for this auto-show entry.
* @type select
* @option Preset
* @value preset
* @option ON
* @value on
* @option OFF
* @value off
* @default preset
*/

/*~struct~ChoiceReplacement:
* @param presetId
* @text Preset ID
* @desc JSON choice preset used as the visual template.
* @type string
* @default
*
* @param choiceCount
* @text Choice Count
* @desc Replaces only when the event choice count matches. 0 matches any count; with empty Match Choice Texts, it catches all.
* @type number
* @min 0
* @default 0
*
* @param matchChoices
* @text Match Choice Texts
* @desc Optional exact choice texts, one per line. Empty matches by count only; with Choice Count 0, it catches all.
* @type multiline_string
* @default
*
* @param resultVariable
* @text Result Variable
* @desc Writes the choice result to this variable. 0 does not write a variable.
* @type variable
* @default 0
*/

/*~struct~ChoiceLayout:
* @param backgroundX
* @text Background X
* @desc Center X of the group background image. Empty uses the button group center.
* @type number
* @min -9999
* @default
*
* @param backgroundY
* @text Background Y
* @desc Center Y of the group background image. Empty uses the button group center.
* @type number
* @min -9999
* @default
*/

/*~struct~ChoiceInput:
* @param inputAxis
* @text Input Axis
* @desc vertical uses up/down. horizontal uses left/right.
* @type select
* @option vertical
* @option horizontal
* @default vertical
*
* @param initialIndex
* @text Initial Index
* @desc Initial selected index. 0 starts with no selection; otherwise 1-based.
* @type number
* @min 0
* @default 1
*
* @param wrap
* @text Wrap Cursor
* @desc Wrap from first to last and last to first.
* @type boolean
* @on Wrap
* @off Stop
* @default true
*
* @param allowCancel
* @text Allow Cancel
* @desc Allows cancel with Esc or right-click.
* @type boolean
* @on Allow
* @off Deny
* @default false
*
* @param inputMode
* @text Input Mode
* @desc always: buttons keep scene selection input while allowing map movement. button: also blocks map movement. mouse: mouse only.
* @type select
* @option Always
* @value always
* @option Button Priority
* @value button
* @option Mouse
* @value mouse
* @default always
*
* @param hoverFocus
* @text Focus On Hover
* @desc Focuses while the pointer is inside the whole button group; leaving clears focus.
* @type boolean
* @on Focus
* @off Keep
* @default false
*
* @param includeBackgroundInHover
* @text Include Background In Hover
* @desc Includes the group background image in the Focus On Hover detection area.
* @type boolean
* @on Include
* @off Buttons Only
* @default true
*/

/*~struct~ToggleInput:
* @param inputAxis
* @text Input Axis
* @desc vertical uses up/down. horizontal uses left/right.
* @type select
* @option vertical
* @option horizontal
* @default vertical
*
* @param initialIndex
* @text Initial Index
* @desc Initial selected index. 0 starts with no selection; otherwise 1-based.
* @type number
* @min 0
* @default 1
*
* @param wrap
* @text Wrap Cursor
* @desc Wrap from first to last and last to first.
* @type boolean
* @on Wrap
* @off Stop
* @default true
*
* @param allowCancel
* @text Allow Cancel
* @desc Allows cancel. In Mouse mode, only right-click cancels focus.
* @type boolean
* @on Allow
* @off Deny
* @default false
*
* @param inputMode
* @text Input Mode
* @desc always: buttons keep scene selection input while allowing map movement. button: also blocks map movement. mouse: mouse only.
* @type select
* @option Always
* @value always
* @option Button Priority
* @value button
* @option Mouse
* @value mouse
* @default always
*
* @param hoverFocus
* @text Focus On Hover
* @desc Focuses while the pointer is inside the whole panel group; leaving clears focus.
* @type boolean
* @on Focus
* @off Keep
* @default false
*
* @param includeBackgroundInHover
* @text Include Background In Hover
* @desc Includes the panel background image in the Focus On Hover detection area.
* @type boolean
* @on Include
* @off Buttons Only
* @default true
*
* @param focusEnterExit
* @text Enter/Exit On Focus
* @desc Exits when focus is lost and enters again when focused by key, command, or hover.
* @type boolean
* @on Exit
* @off Keep
* @default false
*/

/*~struct~ChoiceVisual:
* @param backgroundImageName
* @text Background Image
* @desc Optional image shown behind the whole button group in img/system.
* @type file
* @dir img/system
* @default
*
* @param cursorImageName
* @text Cursor Image
* @desc Cursor frame/glow image in img/system. Empty disables cursor image.
* @type file
* @dir img/system
* @default
*
* @param cursorOffsetX
* @text Cursor Offset X
* @desc Horizontal cursor image offset from the button center in pixels. Positive values move right.
* @type number
* @min -9999
* @default 0
*
* @param cursorOffsetY
* @text Cursor Offset Y
* @desc Vertical cursor image offset from the button center in pixels. Positive values move down.
* @type number
* @min -9999
* @default 0
*
* @param textAlign
* @text Text Align
* @desc Text alignment on the button.
* @type select
* @option center
* @option right
* @option left
* @default center
*
* @param textPadding
* @text Text Padding
* @desc Horizontal padding for button text. Text is fitted within the padded area.
* @type number
* @min 0
* @default 0
*
* @param selectedScale
* @text Selected Scale
* @desc Scale percentage of the selected button. 100 is original size.
* @type number
* @min 0
* @default 100
*
* @param normalScale
* @text Normal Scale
* @desc Scale percentage of unselected buttons. 100 is original size.
* @type number
* @min 0
* @default 90
*
* @param selectedOffsetX
* @text Selected Offset X
* @desc Horizontal offset in pixels while selected. Positive values move right.
* @type number
* @min -9999
* @default 0
*
* @param selectedOffsetY
* @text Selected Offset Y
* @desc Vertical offset in pixels while selected. Positive values move down.
* @type number
* @min -9999
* @default 0
*
* @param selectedMoveDuration
* @text Selected Move Duration
* @desc Frames used to move to or from the selected offset. 0 moves immediately.
* @type number
* @min 0
* @default 12
*
* @param selectedPulseScale
* @text Selected Pulse Scale
* @desc Extra scale added/subtracted while selected. 0 disables continuous pulsing.
* @type number
* @min 0
* @default 0
*
* @param selectedPulseDuration
* @text Selected Pulse Duration
* @desc Frames for one pulse cycle. Used only when Selected Pulse Scale is greater than 0.
* @type number
* @min 1
* @default 60
*
* @param fontSize
* @text Font Size
* @desc Font size for button text. 0 uses the game's main font size.
* @type number
* @min 0
* @default 0
*/

/*~struct~ChoiceAnimation:
* @param enterFrom
* @text Enter From
* @desc Direction used when buttons slide in.
* @type select
* @option none
* @option left
* @option right
* @option top
* @option bottom
* @option cross
* @option verticalCross
* @option sequence
* @option extra
* @default left
*
* @param enterDistance
* @text Enter Distance
* @desc Slide-in distance.
* @type number
* @min 0
* @default 100
*
* @param enterDuration
* @text Enter Duration
* @desc Frames until slide-in completes. 0 completes immediately.
* @type number
* @min 0
* @default 30
*
* @param enterStagger
* @text Enter Stagger
* @desc Delay frames between each button slide-in.
* @type number
* @min 0
* @default 0
*
* @param easing
* @text Easing
* @desc Non-linear easing uses MonakaEasing. Missing easing falls back to linear.
* @type select
* @option linear
* @option easeInSine
* @option easeOutSine
* @option easeInOutSine
* @option easeInQuad
* @option easeOutQuad
* @option easeInOutQuad
* @option easeInCubic
* @option easeOutCubic
* @option easeInOutCubic
* @option easeInQuart
* @option easeOutQuart
* @option easeInOutQuart
* @option easeInQuint
* @option easeOutQuint
* @option easeInOutQuint
* @option easeInBack
* @option easeOutBack
* @option easeInOutBack
* @option easeInElastic
* @option easeOutElastic
* @option easeInOutElastic
* @option bounceIn
* @option bounceOut
* @option bounceInOut
* @default linear
*
* @param exitTo
* @text Exit To
* @desc Direction used when buttons slide out.
* @type select
* @option none
* @option left
* @option right
* @option top
* @option bottom
* @option cross
* @option verticalCross
* @option sequence
* @option extra
* @default none
*
* @param exitDistance
* @text Exit Distance
* @desc Slide-out distance.
* @type number
* @min 0
* @default
*
* @param exitDuration
* @text Exit Duration
* @desc Frames until slide-out completes. 0 completes immediately.
* @type number
* @min 0
* @default
*
* @param exitStagger
* @text Exit Stagger
* @desc Delay frames between each button slide-out.
* @type number
* @min 0
* @default
*
* @param exitEasing
* @text Exit Easing
* @desc Non-linear easing uses MonakaEasing. Missing easing falls back to linear.
* @type select
* @option linear
* @option easeInSine
* @option easeOutSine
* @option easeInOutSine
* @option easeInQuad
* @option easeOutQuad
* @option easeInOutQuad
* @option easeInCubic
* @option easeOutCubic
* @option easeInOutCubic
* @option easeInQuart
* @option easeOutQuart
* @option easeInOutQuart
* @option easeInQuint
* @option easeOutQuint
* @option easeInOutQuint
* @option easeInBack
* @option easeOutBack
* @option easeInOutBack
* @option easeInElastic
* @option easeOutElastic
* @option easeInOutElastic
* @option bounceIn
* @option bounceOut
* @option bounceInOut
* @default linear
*/

/*:ja
* @target MZ
* @url https://x.com/milkmonaka_1
* @plugindesc v1.0.0 画像式のボタンや選択肢を柔軟に配置します。
* @author milkmonaka
* @help
*
* ■ プラグインコマンド
* showChoicePreset / showButtonPanelPreset:
* JSONプリセットのIDを指定してボタンを表示します。
* デフォルトでは dataMM/MMChoiceButtonExPresets.json を読み込みます。
* デスクトップ版のテストプレイ中はプリセット表示のたびにJSONを再確認するため、
* ゲームを再起動しなくても編集内容が次回表示時から反映されます。
* プリセット作成は外部ツール Button Studio MZ を使います。
* コマンド側では結果変数と各ボタンのテキスト/処理を上書きできます。
* ボタン位置は各ボタンの x/y に直接保存します。整列、パス配置、
* リング配置、オフセット配置はエディタ側の編集機能です。
*
* clearChoiceButtons:
* 表示中のボタン選択肢を即座に消去します。
*
* シーン開始時の自動表示:
* autoShowPresets を使うと、各シーン開始時にJSONプリセットを自動表示できます。
* presetのtypeが choice ならモーダル選択肢、panel なら常駐パネルとして表示します。
* 各項目で、表示直後にフォーカスするかどうかを指定できます。
* 各項目で、表示したボタンへフォーカスを移す入力シンボルも指定できます。
* 各項目で、その自動表示だけ入力モードとホバーでフォーカスを上書きできます。
* マップのメモ欄に <MMChoiceButtonExNoAutoShow> または
* <ChoiceButtonEx自動表示なし> を書くと、そのマップでは自動表示だけを止めます。
* プリセット表示コマンドは通常通り使えます。
*
* 選択肢の置き換え:
* choiceReplacementRules を設定すると、イベントコマンド「選択肢の表示」を
* JSONプリセットへ自動で置き換えます。イベント側の選択肢文言がボタン文言を
* 上書きし、通常の選択肢分岐はそのまま動きます。
* 選択肢数が0、かつ一致する選択肢文言が空の場合は、すべての
* 「選択肢の表示」に一致します。全部まとめて画像ボタン化したい場合の
* 一括置き換え用として使えます。
*
* hideButtonPanel / hideAllButtonPanels:
* 常駐パネルを退場演出後に非表示にします。保存状態は残るため、後で復元できます。
* 「フォーカスで入退場」が有効なパネルは、フォーカス解除で退場し、
* キー、コマンド、再ホバーでフォーカスされると入場します。
*
* eraseButtonPanel / eraseAllButtonPanels:
* 退場演出を行わず常駐パネルを即座に消去し、保存状態も削除します。
* 消去後は復元できません。
*
* choiceは決定時に退場演出を行います。結果処理やシーン変更は退場完了を待ちません。
* シーン終了時に残っている退場処理は即座に停止します。
*
* restoreButtonPanel / restoreAllButtonPanels:
* パネルIDで保存されている常駐パネルを復元します。
* シーン遷移後やロード後に、以前のパネルを再表示したい場合に使います。
*
* setButtonFocus:
* キー/ボタン操作のフォーカスを切り替えます。
* target が panel の場合はパネルIDを指定します。
*
* ■ 実行時ステート
* $gameTemp.mmChoiceButtonEx.result
* 最後の結果オブジェクト:
* { type, index, value, text }
* キャンセル時は index: 0、value: 0 です。
* $gameTemp.mmChoiceButtonEx.result.index; であれば、最後に決定されたボタンのインデックスです。
*
* $gameTemp.mmChoiceButtonEx.selectedIndex
* 現在選択中の番号。0は未選択、それ以外は1始まりです。
* これは選択中のリアルタイムの項目と言うことです。
*
* $gameTemp.mmChoiceButtonEx.isActive
* 画像選択肢が有効な間 true。
*
* $gameTemp.mmChoiceButtonEx.focus
* 現在の操作フォーカス:
* { type: "none"|"choice"|"panel", panelId }
*
* $gameTemp.mmChoiceButtonEx.panelResults[panelId]
* 常駐パネルの最後のトグル結果:
* { type: "toggle", index, panelId, value, text, toggled }
*
* $gameTemp.mmChoiceButtonEx.panels[panelId]
* 常駐パネルの現在状態:
* { selectedIndex, toggles, inputMode, isActive }
* 常駐パネルの設定とON/OFF状態は内部的に $gameSystem へ保存されるため、
* シーン遷移やセーブ/ロード後に復元できます。
*
* ■ スクリプトAPI
* MMChoiceButtonEx.showChoicePreset(args)
* MMChoiceButtonEx.showButtonPanelPreset(args)
* JSONプリセットからボタンを表示します。
*
* MMChoiceButtonEx.showChoice(config, options)
* MMChoiceButtonEx.clearChoice(options)
* MMChoiceButtonEx.isChoiceActive()
* MMChoiceButtonEx.currentFocus()
* 実行時にchoice設定を生成する子プラグイン向けの汎用スクリプトAPIです。
* options.onDismiss(info) は、結果を返さず置換・消去された時に呼ばれます。
* clearChoice({ exitingOnly: true }) は、現在のchoiceを残して完了済みの退場表示だけを消去します。
*
* MMChoiceButtonEx.hideButtonPanel(panelId)
* MMChoiceButtonEx.hideAllButtonPanels()
* 1つ、または全ての表示中パネルを非表示にします。保存状態は残ります。
*
* MMChoiceButtonEx.eraseButtonPanel(panelId)
* MMChoiceButtonEx.eraseAllButtonPanels()
* 1つ、または全てのパネルを消去し、保存状態も削除します。
*
* MMChoiceButtonEx.restoreButtonPanel(panelId)
* MMChoiceButtonEx.restoreAllButtonPanels()
* 保存済みの常駐パネルを復元します。復元できた場合はtrueを返します。
*
* MMChoiceButtonEx.focusPanel(panelId)
* MMChoiceButtonEx.focusChoice()
* MMChoiceButtonEx.clearFocus()
* MMChoiceButtonEx.setFocus(target, panelId)
* 操作フォーカスを変更します。target は none / choice / panel です。
*
* MMChoiceButtonEx.panelResult(panelId):
* 指定パネルの最後のトグル結果を返します。
*
* MMChoiceButtonEx.panelState(panelId):
* 指定パネルの現在状態または保存状態を返します。
*
* @param defaultResultVariable
* @text デフォルト結果変数
* @desc 選択結果を格納するデフォルト変数。
* @type variable
* @default 0
*
* @param presetDataFile
* @text プリセットデータファイル
* @desc JSONプリセットのファイルパス。ファイルが無い場合は空の一覧として扱います。
* @type string
* @default dataMM/MMChoiceButtonExPresets.json
*
* @param autoShowPresets
* @text シーン開始時の自動表示
* @desc 各シーン開始時に自動表示するJSONプリセットの一覧です。
* @type struct<AutoPreset>[]
* @default []
*
* @param choiceReplacementRules
* @text 選択肢の置き換え
* @desc イベントコマンド「選択肢の表示」をJSONプリセットへ自動で置き換えるルール。
* @type struct<ChoiceReplacement>[]
* @default []
*
* @command showChoicePreset
* @text 選択肢プリセット表示
* @desc JSONプリセットIDからモーダル選択肢ボタンを表示します。
*
* @arg presetId
* @text プリセットID
* @desc JSONファイル内のプリセット識別子。
* @type string
* @default
*
* @arg buttonOverrides
* @text ボタン上書き
* @desc ボタンごとの表示テキスト、結果値、スイッチ、コモンイベント、スクリプト上書き。空欄はプリセット値を使います。
* @type struct<ChoiceButtonPresetOverride>[]
* @default []
*
* @arg resultVariable
* @text 結果変数
* @desc プリセットの結果変数を上書きします。0ならプリセットまたはデフォルト値を使います。
* @type variable
* @default 0
*
* @command clearChoiceButtons
* @text 選択肢ボタン消去
* @desc 現在のモーダル選択肢ボタンを即時消去します。
*
* @command showButtonPanelPreset
* @text ボタンパネルプリセット表示
* @desc JSONプリセットIDから常駐トグルボタンを表示します。
*
* @arg presetId
* @text プリセットID
* @desc JSONファイル内のプリセット識別子。
* @type string
* @default
*
* @arg buttonOverrides
* @text ボタン上書き
* @desc ボタンごとの表示テキスト、結果値、スイッチ、ON/OFFコモン、スクリプト上書き。空欄はプリセット値を使います。
* @type struct<PanelButtonPresetOverride>[]
* @default []
*
* @arg panelId
* @text パネルID
* @desc パネルIDを上書きします。空欄ならプリセットのパネルIDを使います。
* @type string
* @default
*
* @arg resultVariable
* @text 結果変数
* @desc プリセットの結果変数を上書きします。0ならプリセットまたはデフォルト値を使います。
* @type variable
* @default 0
*
* @command hideButtonPanel
* @text ボタンパネル非表示
* @desc 常駐ボタンパネルを非表示にします。保存状態は残ります。
*
* @arg panelId
* @text パネルID
* @desc 非表示にするパネルID。
* @type string
* @default default
*
* @command hideAllButtonPanels
* @text 全ボタンパネル非表示
* @desc 表示中の常駐ボタンパネルをすべて非表示にします。保存状態は残ります。
*
* @command eraseButtonPanel
* @text ボタンパネル消去
* @desc 常駐ボタンパネルを消去し、保存状態も削除します。
*
* @arg panelId
* @text パネルID
* @desc 消去するパネルID。
* @type string
* @default default
*
* @command eraseAllButtonPanels
* @text 全ボタンパネル消去
* @desc すべての常駐ボタンパネルを消去し、保存状態も削除します。
*
* @command restoreButtonPanel
* @text ボタンパネル復元
* @desc 保存済みの常駐ボタンパネルを復元します。
*
* @arg panelId
* @text パネルID
* @desc 復元する保存済みパネルID。
* @type string
* @default default
*
* @command restoreAllButtonPanels
* @text 全ボタンパネル復元
* @desc 保存済みの常駐ボタンパネルをすべて復元します。
*
* @command setButtonFocus
* @text ボタンフォーカス変更
* @desc キーボード/ボタン操作の対象を切り替えます。
*
* @arg target
* @text 対象
* @desc フォーカス対象。
* @type select
* @option なし
* @value none
* @option 選択肢ボタン
* @value choice
* @option ボタンパネル
* @value panel
* @default none
*
* @arg panelId
* @text パネルID
* @desc 対象がボタンパネルの場合のパネルID。
* @type string
* @default default
*/

/*~struct~ChoiceButton:ja
* @param text
* @text 表示テキスト
* @desc ボタンに表示するテキスト。\v[n]、\c[n] に対応します。
* @type string
* @default 項目
*
* @param imageName
* @text 画像
* @desc img/system内のボタン画像。
* @type file
* @dir img/system
* @default
*
* @param selectedImageName
* @text 選択時画像
* @desc img/system内の選択時画像。空なら通常画像を使います。
* @type file
* @dir img/system
* @default
*
* @param spriteSheetImageName
* @text スプライトシート
* @desc img/system内の横一列スプライトシート。指定時は画像と選択時画像を使いません。
* @type file
* @dir img/system
* @default
*
* @param spriteSheetFrameCount
* @text コマ数
* @desc 横一列に並んでいるコマ数。画像の横幅をこの数で分割します。
* @type number
* @min 1
* @default 1
*
* @param spriteSheetFrameInterval
* @text 切り替えフレーム
* @desc 次のコマへ切り替えるまでのフレーム数。
* @type number
* @min 1
* @default 6
*
* @param cursorImageName
* @text カーソル画像上書き
* @desc このボタンだけに使うカーソル画像。空ならプリセットのカーソル画像を使います。
* @type file
* @dir img/system
* @default
*
* @param enabled
* @text 有効
* @desc OFFのボタンは半透明になり、選択・決定できません。
* @type boolean
* @default true
*
* @param disabledImageName
* @text 使用不可画像
* @desc 使用不可時に表示する任意の画像です。
* @type file
* @dir img/system
* @default
*
* @param disabledOpacity
* @text 使用不可時の不透明度
* @desc 使用不可画像が空欄の時に使う不透明度です。
* @type number
* @min 0
* @max 255
* @default 128
*
* @param opacity
* @text 不透明度
* @desc 通常時のボタン不透明度です。255で完全不透明になります。
* @type number
* @min 0
* @max 255
* @default 255
*
* @param x
* @text X
* @desc このボタンの中心X座標。
* @type number
* @min -9999
* @default
*
* @param y
* @text Y
* @desc このボタンの中心Y座標。
* @type number
* @min -9999
* @default
*
* @param angle
* @text 角度
* @desc このボタンの回転角度（度）。
* @type number
* @min -3600
* @default
*
* @param value
* @text 結果値
* @desc 結果変数へ保存する値。0 or 空欄なら1始まりのボタンindexを保存します。
* @type number
* @min -999999
* @default 0
*
* @param commonEventId
* @text コモンイベント
* @desc この選択肢を決定した時に予約するコモンイベント。0なら使用しません。
* @type common_event
* @default 0
*
* @param switchId
* @text スイッチ
* @desc この選択肢を決定した時にONにするスイッチ。0なら使用しません。
* @type switch
* @default 0
*
* @param script
* @text スクリプト
* @desc この選択肢を決定して閉じた後に実行するスクリプト。
* @type multiline_string
* @default
*/

/*~struct~ToggleButton:ja
* @param text
* @text 表示テキスト
* @desc ボタンに表示するテキスト。\v[n]、\c[n] に対応します。
* @type string
* @default トグル
*
* @param onImageName
* @text ON画像
* @desc 項目を決定してONになっている時に表示する画像。
* @type file
* @dir img/system
* @default
*
* @param offImageName
* @text OFF画像
* @desc 項目がOFFの時に表示する画像。
* @type file
* @dir img/system
* @default
*
* @param selectedImageName1
* @text 選択時画像1
* @desc 項目がONでフォーカス中の画像。空ならON画像を使います。
* @type file
* @dir img/system
* @default
*
* @param selectedImageName2
* @text 選択時画像2
* @desc 項目がOFFでフォーカス中の画像。空ならOFF画像を使います。
* @type file
* @dir img/system
* @default
*
* @param cursorImageName
* @text カーソル画像上書き
* @desc このボタンだけに使うカーソル画像。空ならプリセットのカーソル画像を使います。
* @type file
* @dir img/system
* @default
*
* @param x
* @text X
* @desc このボタンの中心X座標。
* @type number
* @min -9999
* @default
*
* @param y
* @text Y
* @desc このボタンの中心Y座標。
* @type number
* @min -9999
* @default
*
* @param angle
* @text 角度
* @desc このボタンの回転角度（度）。
* @type number
* @min -3600
* @default
*
* @param value
* @text 結果値
* @desc 結果変数へ保存する値。0 or 空欄なら1始まりのボタンindexを保存します。
* @type number
* @min -999999
* @default 0
*
* @param switchId
* @text スイッチ
* @desc このトグルを押した時にONにするスイッチ。0なら使用しません。
* @type switch
* @default 0
*
* @param syncSwitchWithToggle
* @text スイッチON/OFF連動
* @desc ONならトグルONでスイッチON、トグルOFFでスイッチOFF。OFFなら押した時に常にONにします。
* @type boolean
* @on 連動
* @off ONのみ
* @default false
*
* @param onCommonEventId
* @text ONコモンイベント
* @desc このトグルがONになった時に予約するコモンイベント。0なら使用しません。
* @type common_event
* @default 0
*
* @param offCommonEventId
* @text OFFコモンイベント
* @desc このトグルがOFFになった時に予約するコモンイベント。0なら使用しません。
* @type common_event
* @default 0
*
* @param script
* @text スクリプト
* @desc このトグルを押した後に実行するスクリプト。
* @type multiline_string
* @default
*/

/*~struct~ChoiceButtonPresetOverride:ja
* @param index
* @text ボタン番号
* @desc 上書きする1始まりのボタン番号。
* @type number
* @min 1
* @default 1
*
* @param text
* @text 表示テキスト
* @desc 表示テキストを上書きします。空欄ならプリセット値を使います。
* @type string
* @default
*
* @param value
* @text 結果値
* @desc 結果値を上書きします。空欄ならプリセット値を使います。
* @type string
* @default
*
* @param commonEventId
* @text コモンイベント
* @desc コモンイベントを上書きします。空欄ならプリセット値を使います。
* @type string
* @default
*
* @param switchId
* @text スイッチ
* @desc スイッチIDを上書きします。空欄ならプリセット値を使います。
* @type string
* @default
*
* @param script
* @text スクリプト
* @desc スクリプトを上書きします。空欄ならプリセット値を使います。
* @type multiline_string
* @default
*/

/*~struct~PanelButtonPresetOverride:ja
* @param index
* @text ボタン番号
* @desc 上書きする1始まりのボタン番号。
* @type number
* @min 1
* @default 1
*
* @param text
* @text 表示テキスト
* @desc 表示テキストを上書きします。空欄ならプリセット値を使います。
* @type string
* @default
*
* @param value
* @text 結果値
* @desc 結果値を上書きします。空欄ならプリセット値を使います。
* @type string
* @default
*
* @param switchId
* @text スイッチ
* @desc スイッチIDを上書きします。空欄ならプリセット値を使います。
* @type string
* @default
*
* @param onCommonEventId
* @text ONコモンイベント
* @desc ONコモンイベントを上書きします。空欄ならプリセット値を使います。
* @type string
* @default
*
* @param offCommonEventId
* @text OFFコモンイベント
* @desc OFFコモンイベントを上書きします。空欄ならプリセット値を使います。
* @type string
* @default
*
* @param script
* @text スクリプト
* @desc スクリプトを上書きします。空欄ならプリセット値を使います。
* @type multiline_string
* @default
*/

/*~struct~AutoPreset:ja
* @param sceneName
* @text シーン名
* @type combo
* @option Scene_Title
* @option Scene_Map
* @option Scene_Menu
* @option Scene_Item
* @option Scene_Skill
* @option Scene_Equip
* @option Scene_Status
* @option Scene_Options
* @option Scene_Save
* @option Scene_Load
* @option Scene_GameEnd
* @option Scene_Shop
* @option Scene_Name
* @option Scene_Debug
* @option Scene_Battle
* @option Scene_Gameover
* @desc 表示シーンを選択。独自シーンは手入力できます。
*
* @param presetId
* @text プリセットID
* @desc 自動表示するJSONプリセットID。presetのtypeでchoice/panelを判定します。
* @type string
* @default
*
* @param resultVariable
* @text 結果変数
* @desc 結果変数を上書きします。0ならプリセットまたはデフォルト値を使います。
* @type variable
* @default 0
*
* @param panelId
* @text パネルID
* @desc パネルIDの上書き。presetのtypeがpanelの場合のみ使います。
* @type string
* @default
*
* @param autoFocus
* @text 自動フォーカス
* @desc 自動表示したボタンへすぐフォーカスします。OFFならそのボタンへフォーカスしません。
* @type boolean
* @on フォーカスする
* @off フォーカスしない
* @default true
*
* @param focusKey
* @text フォーカスキー
* @desc 自動表示したボタンへフォーカスを移す入力シンボル。空欄で無効。ok/cancel/menuも指定できます。
* @type combo
* @option ok
* @option cancel
* @option menu
* @option shift
* @option pageup
* @option pagedown
* @option up
* @option down
* @option left
* @option right
* @option control
* @option tab
* @default
*
* @param inputModeOverride
* @text 入力モード上書き
* @desc この自動表示だけ、プリセットの入力モードを上書きします。
* @type select
* @option プリセット
* @value preset
* @option 常時
* @value always
* @option ボタン優先
* @value button
* @option マウス
* @value mouse
* @default preset
*
* @param hoverFocusOverride
* @text ホバーでフォーカス上書き
* @desc この自動表示だけ、プリセットのホバーでフォーカス設定を上書きします。
* @type select
* @option プリセット
* @value preset
* @option ON
* @value on
* @option OFF
* @value off
* @default preset
*/

/*~struct~ChoiceReplacement:ja
* @param presetId
* @text プリセットID
* @desc 見た目のテンプレートとして使うJSON選択肢プリセット。
* @type string
* @default
*
* @param choiceCount
* @text 選択肢数
* @desc イベントの選択肢数が一致する場合だけ置換。0かつ文言空なら全選択肢の一括置換になります。
* @type number
* @min 0
* @default 0
*
* @param matchChoices
* @text 一致する選択肢文言
* @desc 任意。選択肢文言を1行ずつ完全一致で指定。空かつ選択肢数0なら全てに一致します。
* @type multiline_string
* @default
*
* @param resultVariable
* @text 結果変数
* @desc 選択結果を保存する変数。0なら結果変数へ保存しません。
* @type variable
* @default 0
*/

/*~struct~ChoiceLayout:ja
* @param backgroundX
* @text 背景X
* @desc ボタン群背景画像の中心X座標。空ならボタン群の中心です。
* @type number
* @min -9999
* @default
*
* @param backgroundY
* @text 背景Y
* @desc ボタン群背景画像の中心Y座標。空ならボタン群の中心です。
* @type number
* @min -9999
* @default
*/

/*~struct~ChoiceInput:ja
* @param inputAxis
* @text 入力方向
* @desc verticalは上下、horizontalは左右で選択します。
* @type select
* @option vertical
* @option horizontal
* @default vertical
*
* @param initialIndex
* @text 初期選択番号
* @desc 初期選択する番号。0なら未選択で開始、それ以外は1始まりです。
* @type number
* @min 0
* @default 1
*
* @param wrap
* @text カーソルループ
* @desc 先頭と末尾でカーソルをループさせます。
* @type boolean
* @on ループ
* @off 停止
* @default true
*
* @param allowCancel
* @text キャンセル許可
* @desc Escまたは右クリックでキャンセルできるようにします。
* @type boolean
* @on 許可
* @off 不許可
* @default false
*
* @param inputMode
* @text 入力モード
* @desc 常時:選択ウィンドウ入力はボタン優先、マップ移動は許可。ボタン優先:マップ移動も止める。マウス:マウスのみ。
* @type select
* @option 常時
* @value always
* @option ボタン優先
* @value button
* @option マウス
* @value mouse
* @default always
*
* @param hoverFocus
* @text ホバーでフォーカス
* @desc ポインタがボタン群全体に入ったらフォーカスし、外れたら解除します。
* @type boolean
* @on 移す
* @off 維持
* @default false
*
* @param includeBackgroundInHover
* @text ホバー範囲に背景を含める
* @desc ホバーでフォーカスの判定範囲に、ボタン群の背景画像を含めます。
* @type boolean
* @on 含める
* @off ボタンのみ
* @default true
*/

/*~struct~ToggleInput:ja
* @param inputAxis
* @text 入力方向
* @desc verticalは上下、horizontalは左右で選択します。
* @type select
* @option vertical
* @option horizontal
* @default vertical
*
* @param initialIndex
* @text 初期選択番号
* @desc 初期選択する番号。0なら未選択で開始、それ以外は1始まりです。
* @type number
* @min 0
* @default 1
*
* @param wrap
* @text カーソルループ
* @desc 先頭と末尾でカーソルをループさせます。
* @type boolean
* @on ループ
* @off 停止
* @default true
*
* @param allowCancel
* @text キャンセル許可
* @desc キャンセルでフォーカスを外せるようにします。マウスモードでは右クリックのみ有効です。
* @type boolean
* @on 許可
* @off 不許可
* @default false
*
* @param inputMode
* @text 入力モード
* @desc 常時:選択ウィンドウ入力はボタン優先、マップ移動は許可。ボタン優先:マップ移動も止める。マウス:マウスのみ。
* @type select
* @option 常時
* @value always
* @option ボタン優先
* @value button
* @option マウス
* @value mouse
* @default always
*
* @param hoverFocus
* @text ホバーでフォーカス
* @desc ポインタがパネル全体に入ったらフォーカスし、外れたら解除します。
* @type boolean
* @on 移す
* @off 維持
* @default false
*
* @param includeBackgroundInHover
* @text ホバー範囲に背景を含める
* @desc ホバーでフォーカスの判定範囲に、パネルの背景画像を含めます。
* @type boolean
* @on 含める
* @off ボタンのみ
* @default true
*
* @param focusEnterExit
* @text フォーカスで入退場
* @desc フォーカス解除で退場し、キー、コマンド、再ホバーでフォーカスされると入場します。
* @type boolean
* @on 退場
* @off 維持
* @default false
*/

/*~struct~ChoiceVisual:ja
* @param backgroundImageName
* @text 背景画像
* @desc ボタン群全体の背面に表示する任意画像。img/systemから指定します。
* @type file
* @dir img/system
* @default
*
* @param cursorImageName
* @text カーソル画像
* @desc img/system内のカーソル画像。空ならカーソル画像を表示しません。
* @type file
* @dir img/system
* @default
*
* @param cursorOffsetX
* @text カーソルオフセットX
* @desc カーソル画像をボタン中央から横へずらす量（px）。正の値で右へ移動します。
* @type number
* @min -9999
* @default 0
*
* @param cursorOffsetY
* @text カーソルオフセットY
* @desc カーソル画像をボタン中央から縦へずらす量（px）。正の値で下へ移動します。
* @type number
* @min -9999
* @default 0
*
* @param textAlign
* @text テキスト揃え
* @desc ボタン上のテキスト揃え。
* @type select
* @option center
* @option right
* @option left
* @default center
*
* @param textPadding
* @text テキスト左右余白
* @desc ボタンテキストの左右余白。この余白を除いた範囲に収まるよう描画します。
* @type number
* @min 0
* @default 0
*
* @param selectedScale
* @text 選択時倍率
* @desc 選択中ボタンの倍率（%）。100で等倍です。
* @type number
* @min 0
* @default 100
*
* @param normalScale
* @text 通常倍率
* @desc 非選択ボタンの倍率（%）。100で等倍です。
* @type number
* @min 0
* @default 90
*
* @param selectedOffsetX
* @text 選択時移動X
* @desc 選択中に移動するX座標（px）。正の値で右へ移動します。
* @type number
* @min -9999
* @default 0
*
* @param selectedOffsetY
* @text 選択時移動Y
* @desc 選択中に移動するY座標（px）。正の値で下へ移動します。
* @type number
* @min -9999
* @default 0
*
* @param selectedMoveDuration
* @text 選択時移動時間
* @desc 選択時移動／復帰にかけるフレーム数。0なら即座に切り替えます。
* @type number
* @min 0
* @default 12
*
* @param selectedPulseScale
* @text 選択中パルス倍率
* @desc 選択中に加減算する倍率。0なら継続拡縮しません。
* @type number
* @min 0
* @default 0
*
* @param selectedPulseDuration
* @text 選択中パルス周期
* @desc 1回の拡縮にかかるフレーム数。選択中パルス倍率が0より大きい時だけ使います。
* @type number
* @min 1
* @default 60
*
* @param fontSize
* @text 文字サイズ
* @desc ボタンテキストの文字サイズ。0ならゲームのメイン文字サイズ。
* @type number
* @min 0
* @default 0
*/

/*~struct~ChoiceAnimation:ja
* @param enterFrom
* @text 入場方向
* @desc ボタンのスライド開始方向。
* @type select
* @option none
* @option left
* @option right
* @option top
* @option bottom
* @option cross
* @option verticalCross
* @option sequence
* @option extra
* @default left
*
* @param enterDistance
* @text 入場距離
* @desc スライドイン距離。
* @type number
* @min 0
* @default 100
*
* @param enterDuration
* @text 入場時間
* @desc スライドイン完了までのフレーム数。0なら即完了。
* @type number
* @min 0
* @default 30
*
* @param enterStagger
* @text 入場ずらし
* @desc 各ボタンのスライド開始をずらすフレーム数。
* @type number
* @min 0
* @default 0
*
* @param easing
* @text イージング
* @desc linear以外はMonakaEasingを使用します。未導入や未定義ならlinearになります。
* @type select
* @option linear
* @option easeInSine
* @option easeOutSine
* @option easeInOutSine
* @option easeInQuad
* @option easeOutQuad
* @option easeInOutQuad
* @option easeInCubic
* @option easeOutCubic
* @option easeInOutCubic
* @option easeInQuart
* @option easeOutQuart
* @option easeInOutQuart
* @option easeInQuint
* @option easeOutQuint
* @option easeInOutQuint
* @option easeInBack
* @option easeOutBack
* @option easeInOutBack
* @option easeInElastic
* @option easeOutElastic
* @option easeInOutElastic
* @option bounceIn
* @option bounceOut
* @option bounceInOut
* @default linear
*
* @param exitTo
* @text 退場方向
* @desc ボタンのスライド終了方向。
* @type select
* @option none
* @option left
* @option right
* @option top
* @option bottom
* @option cross
* @option verticalCross
* @option sequence
* @option extra
* @default none
*
* @param exitDistance
* @text 退場距離
* @desc スライドアウト距離。
* @type number
* @min 0
* @default
*
* @param exitDuration
* @text 退場時間
* @desc スライドアウト完了までのフレーム数。0なら即完了。
* @type number
* @min 0
* @default
*
* @param exitStagger
* @text 退場ずらし
* @desc 各ボタンのスライド開始をずらすフレーム数。
* @type number
* @min 0
* @default
*
* @param exitEasing
* @text 退場イージング
* @desc linear以外はMonakaEasingを使用します。未導入や未定義ならlinearになります。
* @type select
* @option linear
* @option easeInSine
* @option easeOutSine
* @option easeInOutSine
* @option easeInQuad
* @option easeOutQuad
* @option easeInOutQuad
* @option easeInCubic
* @option easeOutCubic
* @option easeInOutCubic
* @option easeInQuart
* @option easeOutQuart
* @option easeInOutQuart
* @option easeInQuint
* @option easeOutQuint
* @option easeInOutQuint
* @option easeInBack
* @option easeOutBack
* @option easeInOutBack
* @option easeInElastic
* @option easeOutElastic
* @option easeInOutElastic
* @option bounceIn
* @option bounceOut
* @option bounceInOut
* @default linear
*/

(() => {
	'use strict';

	const pluginName = decodeURIComponent(document.currentScript.src).match(/^.*\/js\/plugins\/(.+)\.js$/)[1];
	const parameters = PluginManager.parameters(pluginName);
	const waitMode = 'mmChoiceButtonEx';

	const toNumber = (value, fallback = 0) => {
		const number = Number(value);
		return Number.isFinite(number) ? number : fallback;
	};

	const toOptionalNumber = value => {
		if (value === undefined || value === null || value === '') return null;
		const number = Number(value);
		return Number.isFinite(number) ? number : null;
	};

	const toBoolean = (value, fallback = false) => {
		if (value === true || value === 'true') return true;
		if (value === false || value === 'false') return false;
		return fallback;
	};

	const toString = (value, fallback = '') => {
		if (value === undefined || value === null) return fallback;
		return String(value);
	};

	const parseJson = (value, fallback) => {
		if (value === undefined || value === null || value === '') return fallback;
		if (typeof value !== 'string') return value;
		return JSON.parse(value);
	};

	const parseStructArray = value => {
		const array = parseJson(value, []);
		if (!Array.isArray(array)) return [];
		return array.map(item => {
			if (typeof item === 'string') {
				return JSON.parse(item);
			}
			return item;
		});
	};

	const parseStruct = value => {
		const struct = parseJson(value, {});
		return struct && typeof struct === 'object' && !Array.isArray(struct) ? struct : {};
	};

	const clamp = (value, min, max) => {
		return Math.max(min, Math.min(max, value));
	};

	const defaultConfig = {
		resultVariableId: toNumber(parameters.defaultResultVariable, 0)
	};

	const presetDataFile = toString(parameters.presetDataFile, 'dataMM/MMChoiceButtonExPresets.json');

	const cloneData = value => {
		return value === undefined || value === null ? value : JSON.parse(JSON.stringify(value));
	};

	const normalizePresetId = id => toString(id, '').trim();
	const mapNoAutoShowTags = [
		'MMChoiceButtonExNoAutoShow',
		'ChoiceButtonExNoAutoShow',
		'MM_ChoiceButtonExNoAutoShow',
		'ChoiceButtonEx自動表示なし',
		'MMChoiceButtonEx自動表示なし',
		'選択ボタン自動表示なし'
	];
	const focusKeyAliases = {
		'ok': 'ok',
		'決定': 'ok',
		'cancel': 'cancel',
		'キャンセル': 'cancel',
		'menu': 'menu',
		'メニュー': 'menu',
		'shift': 'shift',
		'シフト': 'shift',
		'page up': 'pageup',
		'pageup': 'pageup',
		'page down': 'pagedown',
		'pagedown': 'pagedown',
		'up': 'up',
		'上': 'up',
		'down': 'down',
		'下': 'down',
		'left': 'left',
		'左': 'left',
		'right': 'right',
		'右': 'right',
		'control': 'control',
		'ctrl': 'control',
		'tab': 'tab'
	};
	const normalizeFocusKey = key => {
		const symbol = toString(key, '').trim();
		if (!symbol) return '';
		const normalized = symbol.toLowerCase();
		if (normalized === 'none') return '';
		return focusKeyAliases[normalized] || focusKeyAliases[symbol] || normalized;
	};

	const normalizeAutoInputModeOverride = value => {
		const mode = toString(value, 'preset').trim().toLowerCase();
		if (!mode || mode === 'preset' || mode === 'default' || mode === 'none') return '';
		return ['always', 'button', 'mouse'].includes(mode) ? mode : '';
	};

	const normalizeAutoHoverFocusOverride = value => {
		const mode = toString(value, 'preset').trim().toLowerCase();
		if (!mode || mode === 'preset' || mode === 'default' || mode === 'none') return null;
		if (['on', 'true', '1', 'yes', 'focus'].includes(mode)) return true;
		if (['off', 'false', '0', 'no', 'keep'].includes(mode)) return false;
		return null;
	};

	const normalizeAutoPreset = entry => ({
		sceneName: toString(entry.sceneName, '').trim(),
		presetId: normalizePresetId(entry.presetId),
		resultVariable: toNumber(entry.resultVariable, 0),
		panelId: toString(entry.panelId, '').trim(),
		autoFocus: toBoolean(entry.autoFocus, true),
		focusKey: normalizeFocusKey(entry.focusKey),
		inputModeOverride: normalizeAutoInputModeOverride(entry.inputModeOverride),
		hoverFocusOverride: normalizeAutoHoverFocusOverride(entry.hoverFocusOverride)
	});

	const autoShowPresets = parseStructArray(parameters.autoShowPresets || '[]')
		.map(normalizeAutoPreset);

	const normalizeChoiceMatchText = value => toString(value, '').trim();
	const splitChoiceMatchTexts = value => {
		return toString(value, '')
			.split(/\r?\n/)
			.map(normalizeChoiceMatchText)
			.filter(text => text.length > 0);
	};

	const normalizeChoiceReplacementRule = rule => ({
		presetId: normalizePresetId(rule.presetId),
		choiceCount: Math.max(0, toNumber(rule.choiceCount, 0)),
		matchChoices: splitChoiceMatchTexts(rule.matchChoices),
		resultVariable: Math.max(0, toNumber(rule.resultVariable, 0))
	});

	const choiceReplacementRules = parseStructArray(parameters.choiceReplacementRules || '[]')
		.map(normalizeChoiceReplacementRule)
		.filter(rule => rule.presetId);

	const hasTruthyMetaTag = (data, tagNames) => {
		if (!data || !data.meta) return false;
		return tagNames.some(tagName => {
			if (!Object.prototype.hasOwnProperty.call(data.meta, tagName)) return false;
			return toBoolean(data.meta[tagName], true);
		});
	};

	const mapDisablesAutoShow = () => {
		return hasTruthyMetaTag($dataMap, mapNoAutoShowTags);
	};

	const isBlank = value => {
		return value === undefined || value === null || value === '';
	};

	const normalizePanelRecord = value => {
		const record = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
		if (Object.getPrototypeOf(record) !== Object.prototype) {
			Object.setPrototypeOf(record, Object.prototype);
		}
		return record;
	};

	const panelRecordValue = (record, key) => {
		if (!record || !Object.prototype.hasOwnProperty.call(record, key)) return undefined;
		return record[key];
	};

	const setPanelRecordValue = (record, key, value) => {
		Object.defineProperty(record, key, {
			value,
			writable: true,
			enumerable: true,
			configurable: true
		});
	};

	const deletePanelRecordValue = (record, key) => {
		if (record && Object.prototype.hasOwnProperty.call(record, key)) {
			delete record[key];
		}
	};

	const PresetStore = {
		_data: [],
		_loaded: false,
		_error: null,
		_sourceText: null,
		_reloadErrorText: null,

		filePath() {
			return presetDataFile.replace(/\\/g, '/').replace(/^\/+/, '');
		},

		load() {
			this._loaded = false;
			this._error = null;
			this._data = [];
			this._sourceText = null;
			this._reloadErrorText = null;
			const filePath = this.filePath();
			if (!filePath) {
				this._loaded = true;
				return;
			}

			const xhr = new XMLHttpRequest();
			xhr.open('GET', filePath);
			xhr.overrideMimeType('application/json');
			xhr.onload = () => {
				try {
					if (xhr.status >= 400) {
						this._data = [];
					} else if (xhr.responseText.trim()) {
						this._data = this.normalizeData(JSON.parse(xhr.responseText));
						this._sourceText = xhr.responseText;
					} else {
						this._data = [];
						this._sourceText = xhr.responseText;
					}
				} catch (error) {
					this._error = error;
					this._data = [];
					console.error(`${pluginName}: failed to parse ${filePath}`, error);
				}
				this._loaded = true;
			};
			xhr.onerror = () => {
				this._data = [];
				this._loaded = true;
			};
			xhr.send();
		},

		isLoaded() {
			return this._loaded;
		},

		reload() {
			if (!Utils.isNwjs() || !Utils.isOptionValid('test') || typeof require !== 'function') return false;
			const filePath = this.filePath();
			if (!filePath) return false;
			try {
				const fs = require('fs');
				const path = require('path');
				const mainFile = process.mainModule && process.mainModule.filename;
				const basePath = mainFile ? path.dirname(mainFile) : process.cwd();
				const sourceText = fs.readFileSync(path.resolve(basePath, filePath), 'utf8');
				if (sourceText === this._sourceText) return false;
				try {
					this._data = sourceText.trim()
						? this.normalizeData(JSON.parse(sourceText))
						: [];
					this._sourceText = sourceText;
					this._reloadErrorText = null;
					this._error = null;
					return true;
				} catch (error) {
					if (sourceText !== this._reloadErrorText) {
						console.error(`${pluginName}: failed to hot-reload ${filePath}; keeping the last valid presets.`, error);
						this._reloadErrorText = sourceText;
					}
				}
			} catch (error) {
				// Keep the startup-loaded data if the file is temporarily unavailable.
			}
			return false;
		},

		normalizeData(data) {
			if (Array.isArray(data)) return data;
			if (data && Array.isArray(data.presets)) return data.presets;
			return [];
		},

		presets() {
			if (this._error) throw this._error;
			return this._data;
		},

		find(presetId, expectedType) {
			this.reload();
			const id = normalizePresetId(presetId);
			if (!id) {
				console.warn(`${pluginName}: presetId is required.`);
				return null;
			}
			const preset = this.presets().find(item => {
				if (!item || typeof item !== 'object') return false;
				const itemId = normalizePresetId(item.id || item.presetId);
				const type = toString(item.type, '');
				return itemId === id && (!expectedType || !type || type === expectedType);
			});
			if (!preset) {
				const expected = expectedType ? ` for type "${expectedType}"` : '';
				console.warn(`${pluginName}: preset "${id}" was not found${expected}.`);
				return null;
			}
			return cloneData(preset);
		}
	};

	const linearEasing = value => value;

	const easingFunction = name => {
		const easingName = toString(name, 'linear');
		const monakaEasing = window.MM && window.MM.monakaEasing ? window.MM.monakaEasing : window.monakaEasing;
		if (monakaEasing && typeof monakaEasing[easingName] === 'function') {
			return monakaEasing[easingName];
		}
		if (monakaEasing && typeof monakaEasing.linear === 'function') {
			return monakaEasing.linear;
		}
		return linearEasing;
	};

	const normalizeImageName = value => {
		return toString(value).replace(/\.(png|jpg|jpeg|webp)$/i, '');
	};

	const requiredImageName = (value, label) => {
		const imageName = normalizeImageName(value);
		if (imageName) return imageName;
		console.warn(`${pluginName}: ${label} is empty. The button will be shown without a bitmap.`);
		return '';
	};

	const requiredToggleImageNames = (button, index) => {
		const onImageName = normalizeImageName(button.onImageName);
		const offImageName = normalizeImageName(button.offImageName);
		if (!onImageName) {
			console.warn(`${pluginName}: toggle buttons[${index}].onImageName is empty. The ON state will be shown without a bitmap.`);
		}
		if (!offImageName) {
			console.warn(`${pluginName}: toggle buttons[${index}].offImageName is empty. The OFF state will be shown without a bitmap.`);
		}
		return { onImageName, offImageName };
	};

	const normalizeInputMode = value => {
		const mode = toString(value, 'always');
		return ['always', 'button', 'mouse'].includes(mode) ? mode : 'always';
	};

	const defaultButtonPosition = index => ({
		x: 300 + 30 * Math.max(0, index),
		y: 260 + 60 * Math.max(0, index)
	});

	const optionalNumber = value => {
		if (value === undefined || value === null || value === '') return null;
		const number = Number(value);
		return Number.isFinite(number) ? number : null;
	};

	const normalizeExtraAnimationTrack = track => {
		if (!track || typeof track !== 'object') return null;
		const keyframes = Array.isArray(track.keyframes)
			? track.keyframes
				.map(frame => {
					if (!frame || typeof frame !== 'object') return null;
					return {
						time: clamp(toNumber(frame.time, 0), 0, 1),
						x: toNumber(frame.x, 0),
						y: toNumber(frame.y, 0),
						scale: Math.max(0, toNumber(frame.scale, 100)),
						rotation: toNumber(frame.rotation, 0)
					};
				})
				.filter(Boolean)
				.sort((a, b) => a.time - b.time)
			: [];
		return {
			duration: optionalNumber(track.duration),
			delay: optionalNumber(track.delay),
			easing: toString(track.easing, ''),
			scaleDuration: optionalNumber(track.scaleDuration),
			scaleDelay: optionalNumber(track.scaleDelay),
			scaleEasing: toString(track.scaleEasing, ''),
			rotationDuration: optionalNumber(track.rotationDuration),
			rotationDelay: optionalNumber(track.rotationDelay),
			rotationEasing: toString(track.rotationEasing, ''),
			keyframes
		};
	};

	const normalizeExtraAnimation = value => {
		if (!value || typeof value !== 'object') return {};
		const enter = normalizeExtraAnimationTrack(value.enter);
		const exit = normalizeExtraAnimationTrack(value.exit);
		return {
			...(enter ? { enter } : {}),
			...(exit ? { exit } : {})
		};
	};

	const normalizeSpriteSheet = choice => {
		const imageName = normalizeImageName(choice.spriteSheetImageName);
		const frameCount = Math.max(1, Math.floor(toNumber(choice.spriteSheetFrameCount, 1)));
		const frameInterval = Math.max(1, Math.floor(toNumber(choice.spriteSheetFrameInterval, 6)));
		return { imageName, frameCount, frameInterval };
	};

	const normalizeChoice = (choice, index) => {
		const spriteSheet = normalizeSpriteSheet(choice);
		const imageName = spriteSheet.imageName
			? normalizeImageName(choice.imageName)
			: requiredImageName(choice.imageName, `choices[${index}].imageName`);
		const value = toNumber(choice.value, 0);
		const position = defaultButtonPosition(index);
		return {
			text: toString(choice.text, ''),
			imageName,
			selectedImageName: normalizeImageName(choice.selectedImageName),
			spriteSheetImageName: spriteSheet.imageName,
			spriteSheetFrameCount: spriteSheet.frameCount,
			spriteSheetFrameInterval: spriteSheet.frameInterval,
			cursorImageName: normalizeImageName(choice.cursorImageName),
			enabled: toBoolean(choice.enabled, true),
			disabledImageName: normalizeImageName(choice.disabledImageName),
			disabledOpacity: clamp(toNumber(choice.disabledOpacity, 128), 0, 255),
			opacity: clamp(toNumber(choice.opacity, 255), 0, 255),
			x: toNumber(choice.x, position.x),
			y: toNumber(choice.y, position.y),
			angle: toNumber(choice.angle, 0),
			extraAnimation: normalizeExtraAnimation(choice.extraAnimation),
			value,
			resultValue: value === 0 ? index + 1 : value,
			commonEventId: toNumber(choice.commonEventId, 0),
			switchId: toNumber(choice.switchId, 0),
			script: toString(choice.script, '')
		};
	};

	const normalizeToggleButton = (button, index) => {
		const { onImageName, offImageName } = requiredToggleImageNames(button, index);
		const value = toNumber(button.value, 0);
		const position = defaultButtonPosition(index);
		return {
			text: toString(button.text, ''),
			onImageName,
			offImageName,
			selectedImageName1: normalizeImageName(button.selectedImageName1),
			selectedImageName2: normalizeImageName(button.selectedImageName2),
			cursorImageName: normalizeImageName(button.cursorImageName),
			x: toNumber(button.x, position.x),
			y: toNumber(button.y, position.y),
			angle: toNumber(button.angle, 0),
			extraAnimation: normalizeExtraAnimation(button.extraAnimation),
			value,
			resultValue: value === 0 ? index + 1 : value,
			switchId: toNumber(button.switchId, 0),
			syncSwitchWithToggle: toBoolean(button.syncSwitchWithToggle, false),
			onCommonEventId: toNumber(button.onCommonEventId, 0),
			offCommonEventId: toNumber(button.offCommonEventId, 0),
			script: toString(button.script, '')
		};
	};

	const executeChoiceScript = (script, result) => {
		if (!script.trim()) return;
		const choiceResult = result;
		const index = result.index;
		const value = result.value;
		const panelId = result.panelId || '';
		const toggled = !!result.toggled;
		const text = result.text;
		eval(script);
	};

	const setButtonSwitch = (button, value) => {
		const switchId = toNumber(button.switchId, 0);
		if (switchId > 0) {
			$gameSwitches.setValue(switchId, !!value);
		}
	};

	const panelCommonEventId = (button, toggled) => {
		return toggled ? toNumber(button.onCommonEventId, 0) : toNumber(button.offCommonEventId, 0);
	};

	const parseButtonConfig = (args, commandName, normalizeButton = normalizeChoice) => {
		const choices = parseStructArray(args.choices).map(normalizeButton);
		if (choices.length === 0) {
			throw new Error(`${pluginName}: ${commandName} requires at least one choice.`);
		}

		const layoutArgs = parseStruct(args.layout);
		const inputArgs = parseStruct(args.input);
		const visualArgs = parseStruct(args.visual);
		const animationArgs = parseStruct(args.animation);
		const selectedScale = Math.max(0, toNumber(visualArgs.selectedScale, 100));
		const normalScale = Math.max(0, toNumber(visualArgs.normalScale, 90));
		const selectedOffsetX = toNumber(visualArgs.selectedOffsetX, 0);
		const selectedOffsetY = toNumber(visualArgs.selectedOffsetY, 0);
		const selectedMoveDuration = Math.max(0, toNumber(visualArgs.selectedMoveDuration, 12));
		const selectedPulseScale = Math.max(0, toNumber(visualArgs.selectedPulseScale, 0)) / 100;
		const selectedPulseDuration = Math.max(1, toNumber(visualArgs.selectedPulseDuration, 60));
		const commandFontSize = toNumber(visualArgs.fontSize, 0);
		const resultVariableId = toNumber(args.resultVariable, 0) || defaultConfig.resultVariableId;

		return {
			choices,
			resultVariableId,
			layout: {
				backgroundX: toOptionalNumber(layoutArgs.backgroundX),
				backgroundY: toOptionalNumber(layoutArgs.backgroundY)
			},
			input: {
				axis: toString(inputArgs.inputAxis, 'vertical'),
				initialIndex: clamp(toNumber(inputArgs.initialIndex, 1), 0, choices.length),
				wrap: toBoolean(inputArgs.wrap, true),
				allowCancel: toBoolean(inputArgs.allowCancel, false),
				mode: normalizeInputMode(inputArgs.inputMode),
				hoverFocus: toBoolean(inputArgs.hoverFocus, false),
				includeBackgroundInHover: toBoolean(inputArgs.includeBackgroundInHover, true),
				focusEnterExit: toBoolean(inputArgs.focusEnterExit, toBoolean(inputArgs.exitOnFocusLost, false))
			},
			visual: {
				backgroundImageName: normalizeImageName(visualArgs.backgroundImageName),
				cursorImageName: normalizeImageName(visualArgs.cursorImageName),
				cursorOffsetX: toNumber(visualArgs.cursorOffsetX, 0),
				cursorOffsetY: toNumber(visualArgs.cursorOffsetY, 0),
				textAlign: toString(visualArgs.textAlign, 'center'),
				textPadding: Math.max(0, toNumber(visualArgs.textPadding, 0)),
				selectedScale: selectedScale / 100,
				normalScale: normalScale / 100,
				selectedOffsetX,
				selectedOffsetY,
				selectedMoveDuration,
				selectedPulseScale,
				selectedPulseDuration,
				fontSize: commandFontSize > 0 ? commandFontSize : $gameSystem.mainFontSize()
			},
			animation: {
				enterFrom: toString(animationArgs.enterFrom, 'left'),
				enterDistance: toNumber(animationArgs.enterDistance, 100),
				enterDuration: toNumber(animationArgs.enterDuration, 30),
				enterStagger: toNumber(animationArgs.enterStagger, 0),
				easing: toString(animationArgs.easing, 'linear'),
				exitTo: toString(animationArgs.exitTo, 'none'),
				exitDistance: toNumber(animationArgs.exitDistance, 0),
				exitDuration: toNumber(animationArgs.exitDuration, 0),
				exitStagger: toNumber(animationArgs.exitStagger, 0),
				exitEasing: toString(animationArgs.exitEasing, 'linear')
			}
		};
	};

	const parseChoicePresetArgs = args => {
		return parseButtonConfig(args, 'showChoicePreset');
	};

	const parsePanelPresetArgs = args => {
		return {
			...parseButtonConfig(args, 'showButtonPanelPreset', normalizeToggleButton),
			panelId: toString(args.panelId, 'default') || 'default'
		};
	};

	const choiceButtonOverrideFields = [
		'text',
		'value',
		'commonEventId',
		'switchId',
		'script'
	];

	const panelButtonOverrideFields = [
		'text',
		'value',
		'switchId',
		'onCommonEventId',
		'offCommonEventId',
		'script'
	];

	const applyButtonOverrides = (choices, overrides, fields) => {
		const result = cloneData(choices || []) || [];
		parseStructArray(overrides).forEach(override => {
			if (!override || typeof override !== 'object') return;
			const targetIndex = toNumber(override.index, 0) - 1;
			const button = result[targetIndex];
			if (!button) return;
			fields.forEach(key => {
				if (!isBlank(override[key])) {
					button[key] = override[key];
				}
			});
		});
		return result;
	};

	const presetChoices = preset => {
		const choices = preset.choices || [];
		return Array.isArray(choices) ? choices : [];
	};

	const presetChoicesWithPositions = preset => {
		const layout = preset.layout || {};
		const startX = toNumber(layout.startX, 300);
		const startY = toNumber(layout.startY, 260);
		const offsetX = toNumber(layout.offsetX, 30);
		const offsetY = toNumber(layout.offsetY, 60);
		return presetChoices(preset).map((choice, index) => {
			const result = cloneData(choice || {}) || {};
			if (!Number.isFinite(Number(result.x))) {
				result.x = startX + offsetX * index;
			}
			if (!Number.isFinite(Number(result.y))) {
				result.y = startY + offsetY * index;
			}
			return result;
		});
	};

	const presetCommandArgs = (preset, args, isPanel) => {
		const commandResultVariable = toNumber(args.resultVariable, 0);
		const presetResultVariable = toNumber(preset.resultVariable, 0);
		return {
			panelId: isPanel ? toString(args.panelId || preset.panelId, 'default') || 'default' : undefined,
			choices: applyButtonOverrides(
				presetChoicesWithPositions(preset),
				args.buttonOverrides || args.textOverrides || args.overrides,
				isPanel ? panelButtonOverrideFields : choiceButtonOverrideFields
			),
			resultVariable: commandResultVariable > 0 ? commandResultVariable : presetResultVariable,
			layout: cloneData(preset.layout || {}),
			input: cloneData(preset.input || {}),
			visual: cloneData(preset.visual || {}),
			animation: cloneData(preset.animation || {})
		};
	};

	const parseChoicePresetConfig = args => {
		const preset = PresetStore.find(args.presetId, 'choice');
		if (!preset) return null;
		return parseChoicePresetArgs(presetCommandArgs(preset, args, false));
	};

	const eventChoiceTexts = params => {
		const choices = params && Array.isArray(params[0]) ? params[0] : [];
		return choices.map(text => toString(text, ''));
	};

	const choiceReplacementRuleMatches = (rule, texts) => {
		if (rule.choiceCount > 0 && rule.choiceCount !== texts.length) return false;
		if (rule.matchChoices.length > 0) {
			if (rule.matchChoices.length !== texts.length) return false;
			return rule.matchChoices.every((text, index) => {
				return text === normalizeChoiceMatchText(texts[index]);
			});
		}
		return true;
	};

	const choiceReplacementRulePriority = rule => {
		if (rule.matchChoices.length > 0) return 3;
		if (rule.choiceCount > 0) return 2;
		return 1;
	};

	const findChoiceReplacementRule = params => {
		const texts = eventChoiceTexts(params);
		let bestRule = null;
		let bestPriority = 0;
		choiceReplacementRules.forEach(rule => {
			if (!choiceReplacementRuleMatches(rule, texts)) return;
			const priority = choiceReplacementRulePriority(rule);
			if (priority > bestPriority) {
				bestRule = rule;
				bestPriority = priority;
			}
		});
		return bestRule;
	};

	const eventChoiceInitialIndex = params => {
		const defaultType = toNumber(params && params[2], -1);
		return defaultType >= 0 ? defaultType + 1 : 0;
	};

	const eventChoiceCancelType = params => {
		const choices = eventChoiceTexts(params);
		const cancelType = toNumber(params && params[1], -2);
		return cancelType < choices.length ? cancelType : -2;
	};

	const eventChoiceAllowsCancel = params => {
		return eventChoiceCancelType(params) !== -1;
	};

	const eventChoiceBranchValue = (params, result) => {
		if (result && result.type === 'confirm') return result.index - 1;
		const cancelType = eventChoiceCancelType(params);
		return cancelType >= 0 ? cancelType : -2;
	};

	const eventChoiceButtonFromTemplate = (templateChoices, text, index) => {
		const template = cloneData(templateChoices[index] || templateChoices[templateChoices.length - 1] || {}) || {};
		const positionSource = templateChoices[index] || {};
		const fallback = defaultButtonPosition(index);
		template.text = toString(text, '');
		template.value = index + 1;
		template.resultValue = index + 1;
		template.x = Number.isFinite(positionSource.x) ? positionSource.x : fallback.x;
		template.y = Number.isFinite(positionSource.y) ? positionSource.y : fallback.y;
		return template;
	};

	const createChoiceReplacementConfig = (params, rule) => {
		const args = { presetId: rule.presetId };
		if (rule.resultVariable > 0) args.resultVariable = String(rule.resultVariable);
		const config = parseChoicePresetConfig(args);
		if (!config) return null;
		const templateChoices = config.choices || [];
		const texts = eventChoiceTexts(params);
		config.resultVariableId = rule.resultVariable > 0 ? rule.resultVariable : 0;
		config.choices = texts.map((text, index) => eventChoiceButtonFromTemplate(templateChoices, text, index));
		config.input.initialIndex = clamp(eventChoiceInitialIndex(params), 0, config.choices.length);
		config.input.allowCancel = eventChoiceAllowsCancel(params);
		return config;
	};

	const parsePanelPresetConfig = args => {
		const preset = PresetStore.find(args.presetId, 'panel');
		if (!preset) return null;
		return parsePanelPresetArgs(presetCommandArgs(preset, args, true));
	};

	const autoPresetCommandArgs = entry => {
		const args = { presetId: entry.presetId };
		if (entry.resultVariable > 0) args.resultVariable = String(entry.resultVariable);
		if (entry.panelId) args.panelId = entry.panelId;
		return args;
	};

	const applyAutoPresetInputOverrides = (config, entry) => {
		if (!config.input) config.input = {};
		if (entry.inputModeOverride) {
			config.input.mode = entry.inputModeOverride;
		}
		if (entry.hoverFocusOverride !== null) {
			config.input.hoverFocus = entry.hoverFocusOverride;
		}
		return config;
	};

	const showAutoPreset = (entry, sceneName) => {
		if (!entry.presetId) {
			console.warn(`${pluginName}: autoShowPresets presetId is empty (sceneName=${sceneName}).`);
			return;
		}
		if (sceneName === 'Scene_Map' && mapDisablesAutoShow()) {
			return;
		}
		try {
			const preset = PresetStore.find(entry.presetId);
			if (!preset) return;
			const type = toString(preset.type, 'choice');
			const args = autoPresetCommandArgs(entry);
			const options = { autoFocus: entry.autoFocus, focusKey: entry.focusKey };
			if (type === 'panel') {
				const config = parsePanelPresetConfig(args);
				if (config) Manager.showPanel(applyAutoPresetInputOverrides(config, entry), options);
			} else {
				const config = parseChoicePresetConfig(args);
				if (config) Manager.showChoice(applyAutoPresetInputOverrides(config, entry), options);
			}
		} catch (error) {
			console.warn(`${pluginName}: failed to auto-show preset "${entry.presetId}" (sceneName=${sceneName}).`, error);
		}
	};

	const resolvePosition = (config, index) => {
		const choice = config.choices[index] || {};
		const fallback = defaultButtonPosition(index);
		return {
			x: Number.isFinite(choice.x) ? choice.x : fallback.x,
			y: Number.isFinite(choice.y) ? choice.y : fallback.y
		};
	};

	const resolveEnterStartX = (config, targetX, index) => {
		const distance = config.animation.enterDistance;
		switch (config.animation.enterFrom) {
			case 'none':
			case 'top':
			case 'up':
			case 'bottom':
			case 'down':
			case 'verticalCross':
				return targetX;
			case 'right':
				return targetX + distance;
			case 'cross':
				return index % 2 === 0 ? targetX - distance : targetX + distance;
			case 'left':
			default:
				return targetX - distance;
		}
	};

	const resolveEnterStartY = (config, targetY, index) => {
		const distance = config.animation.enterDistance;
		switch (config.animation.enterFrom) {
			case 'top':
			case 'up':
				return targetY - distance;
			case 'bottom':
			case 'down':
				return targetY + distance;
			case 'verticalCross':
				return index % 2 === 0 ? targetY - distance : targetY + distance;
			default:
				return targetY;
		}
	};

	const positionsEqual = (a, b) => {
		return !!a && !!b && a.x === b.x && a.y === b.y;
	};

	const extraAnimationTrack = (config, index, phase) => {
		const choice = config.choices[index] || {};
		const track = choice.extraAnimation && choice.extraAnimation[phase];
		return track && typeof track === 'object' ? track : null;
	};

	const resolveExtraPathData = (config, targetX, targetY, index, phase) => {
		const track = extraAnimationTrack(config, index, phase);
		if (!track || !Array.isArray(track.keyframes) || track.keyframes.length === 0) {
			return {
				path: [{ x: targetX, y: targetY }],
				times: [phase === 'enter' ? 1 : 0],
				scales: [100],
				rotations: [0]
			};
		}
		const frames = track.keyframes
			.map(frame => ({
				time: clamp(toNumber(frame.time, 0), 0, 1),
				x: targetX + toNumber(frame.x, 0),
				y: targetY + toNumber(frame.y, 0),
				scale: Math.max(0, toNumber(frame.scale, 100)),
				rotation: toNumber(frame.rotation, 0)
			}))
			.sort((a, b) => a.time - b.time);
		if (phase === 'enter') {
			const movingFrames = frames.filter(frame => frame.time < 1);
			movingFrames.push({ time: 1, x: targetX, y: targetY, scale: 100, rotation: 0 });
			return {
				path: movingFrames.map(frame => ({ x: frame.x, y: frame.y })),
				times: movingFrames.map(frame => frame.time),
				scales: movingFrames.map(frame => frame.scale),
				rotations: movingFrames.map(frame => frame.rotation)
			};
		}
		const movingFrames = [
			{ time: 0, x: targetX, y: targetY, scale: 100, rotation: 0 },
			...frames.filter(frame => frame.time > 0)
		];
		return {
			path: movingFrames.map(frame => ({ x: frame.x, y: frame.y })),
			times: movingFrames.map(frame => frame.time),
			scales: movingFrames.map(frame => frame.scale),
			rotations: movingFrames.map(frame => frame.rotation)
		};
	};

	const resolveExtraTiming = (config, index, phase, channel = 'move') => {
		const track = extraAnimationTrack(config, index, phase) || {};
		const entering = phase === 'enter';
		const durationFallback = entering ? config.animation.enterDuration : config.animation.exitDuration;
		const stagger = entering ? config.animation.enterStagger : config.animation.exitStagger;
		const easingFallback = entering ? config.animation.easing : config.animation.exitEasing;
		const duration = channel === 'move' ? track.duration : track[`${channel}Duration`];
		const delay = channel === 'move' ? track.delay : track[`${channel}Delay`];
		const easing = channel === 'move' ? track.easing : track[`${channel}Easing`];
		return {
			duration: Math.max(0, duration ?? track.duration ?? durationFallback),
			delay: Math.max(0, delay ?? track.delay ?? (stagger * index)),
			easing: toString(easing, '') || toString(track.easing, '') || easingFallback
		};
	};

	const resolveSequenceEnterPath = (config, targetX, targetY, index) => {
		const target = { x: targetX, y: targetY };
		if (index <= 0) return [target];
		const previous = resolvePosition(config, index - 1);
		return positionsEqual(previous, target) ? [target] : [previous, target];
	};

	const resolveEnterPath = (config, targetX, targetY, index) => {
		if (config.animation.enterFrom === 'extra') {
			return resolveExtraPathData(config, targetX, targetY, index, 'enter').path;
		}
		if (config.animation.enterFrom === 'sequence') {
			return resolveSequenceEnterPath(config, targetX, targetY, index);
		}
		return [
			{
				x: resolveEnterStartX(config, targetX, index),
				y: resolveEnterStartY(config, targetY, index)
			},
			{ x: targetX, y: targetY }
		];
	};

	const resolveExitEndX = (config, targetX, index) => {
		const distance = config.animation.exitDistance;
		switch (config.animation.exitTo) {
			case 'none':
			case 'top':
			case 'up':
			case 'bottom':
			case 'down':
			case 'verticalCross':
				return targetX;
			case 'right':
				return targetX + distance;
			case 'cross':
				return index % 2 === 0 ? targetX - distance : targetX + distance;
			case 'left':
			default:
				return targetX - distance;
		}
	};

	const resolveExitEndY = (config, targetY, index) => {
		const distance = config.animation.exitDistance;
		switch (config.animation.exitTo) {
			case 'top':
			case 'up':
				return targetY - distance;
			case 'bottom':
			case 'down':
				return targetY + distance;
			case 'verticalCross':
				return index % 2 === 0 ? targetY - distance : targetY + distance;
			default:
				return targetY;
		}
	};

	const resolveSequenceExitPath = (config, targetX, targetY, index) => {
		const target = { x: targetX, y: targetY };
		if (index <= 0) return [target];
		const previous = resolvePosition(config, index - 1);
		return positionsEqual(previous, target) ? [target] : [target, previous];
	};

	const resolveExitPath = (config, targetX, targetY, index) => {
		if (config.animation.exitTo === 'extra') {
			return resolveExtraPathData(config, targetX, targetY, index, 'exit').path;
		}
		if (config.animation.exitTo === 'sequence') {
			return resolveSequenceExitPath(config, targetX, targetY, index);
		}
		return [
			{ x: targetX, y: targetY },
			{
				x: resolveExitEndX(config, targetX, index),
				y: resolveExitEndY(config, targetY, index)
			}
		];
	};

	const enterPathNeedsMove = path => {
		if (path.length <= 1) return false;
		const target = path[path.length - 1];
		return path.some(position => !positionsEqual(position, target));
	};

	const interpolateEnterPath = (path, progress) => {
		if (path.length <= 1) return path[0] || { x: 0, y: 0 };
		const segmentCount = path.length - 1;
		const scaled = progress * segmentCount;
		const segmentIndex = clamp(Math.floor(scaled), 0, segmentCount - 1);
		const segmentProgress = scaled - segmentIndex;
		const from = path[segmentIndex];
		const to = path[segmentIndex + 1];
		return {
			x: from.x + (to.x - from.x) * segmentProgress,
			y: from.y + (to.y - from.y) * segmentProgress
		};
	};

	const interpolateTimedPath = (path, times, progress) => {
		if (!Array.isArray(times) || times.length !== path.length || path.length <= 1) {
			return interpolateEnterPath(path, progress);
		}
		let segmentIndex = 0;
		if (progress >= times[times.length - 1]) {
			segmentIndex = path.length - 2;
		} else {
			for (let index = 0; index < path.length - 1; index++) {
				if (progress <= times[index + 1]) {
					segmentIndex = index;
					break;
				}
			}
		}
		{
			const index = segmentIndex;
			const startTime = times[index];
			const endTime = times[index + 1];
			const duration = endTime - startTime;
			const segmentProgress = duration > 0 ? (progress - startTime) / duration : 1;
			const from = path[index];
			const to = path[index + 1];
			return {
				x: from.x + (to.x - from.x) * segmentProgress,
				y: from.y + (to.y - from.y) * segmentProgress
			};
		}
	};

	const interpolateTimedValue = (values, times, progress, fallback) => {
		if (!Array.isArray(values) || values.length === 0) return fallback;
		if (!Array.isArray(times) || times.length !== values.length || values.length === 1) return values[0];
		let segmentIndex = 0;
		if (progress >= times[times.length - 1]) {
			segmentIndex = values.length - 2;
		} else {
			for (let index = 0; index < values.length - 1; index++) {
				if (progress <= times[index + 1]) {
					segmentIndex = index;
					break;
				}
			}
		}
		const startTime = times[segmentIndex];
		const endTime = times[segmentIndex + 1];
		const duration = endTime - startTime;
		const segmentProgress = duration > 0 ? (progress - startTime) / duration : 1;
		return values[segmentIndex] + (values[segmentIndex + 1] - values[segmentIndex]) * segmentProgress;
	};

	const extraMotionNeedsAnimation = (path, scales, rotations) => {
		return enterPathNeedsMove(path)
			|| (Array.isArray(scales) && scales.some(scale => scale !== 100))
			|| (Array.isArray(rotations) && rotations.some(rotation => rotation !== 0));
	};

	const sequenceEnterStartOffset = (config, index) => {
		if (config.animation.enterFrom !== 'sequence') {
			return config.animation.enterStagger * index;
		}
		const step = Math.max(0, config.animation.enterDuration) + Math.max(0, config.animation.enterStagger);
		return step * Math.max(0, index - 1);
	};

	const sequenceExitStartOffset = (config, index) => {
		if (config.animation.exitTo !== 'sequence') {
			return config.animation.exitStagger * index;
		}
		const step = Math.max(0, config.animation.exitDuration) + Math.max(0, config.animation.exitStagger);
		const lastIndex = Math.max(0, config.choices.length - 1);
		return step * Math.max(0, lastIndex - index);
	};

	const resolveButtonGroupCenter = config => {
		const positions = config.choices.map((_choice, index) => resolvePosition(config, index));
		if (positions.length > 0) {
			const xs = positions.map(position => position.x);
			const ys = positions.map(position => position.y);
			return {
				x: (Math.min(...xs) + Math.max(...xs)) / 2,
				y: (Math.min(...ys) + Math.max(...ys)) / 2
			};
		}
		return defaultButtonPosition(0);
	};

	const resolveBackgroundPosition = config => {
		const center = resolveButtonGroupCenter(config);
		return {
			x: Number.isFinite(config.layout.backgroundX) ? config.layout.backgroundX : center.x,
			y: Number.isFinite(config.layout.backgroundY) ? config.layout.backgroundY : center.y
		};
	};

	const createRuntimeState = () => ({
		result: null,
		selectedIndex: 0,
		isActive: false,
		focus: { type: 'none', panelId: '' },
		panelResults: {},
		panels: {}
	});

	const ensureRuntimeState = () => {
		if (typeof $gameTemp === 'undefined' || !$gameTemp) {
			return createRuntimeState();
		}
		if (!$gameTemp.mmChoiceButtonEx) {
			$gameTemp.mmChoiceButtonEx = createRuntimeState();
		}
		const state = $gameTemp.mmChoiceButtonEx;
		if (!state.focus) state.focus = { type: 'none', panelId: '' };
		state.panelResults = normalizePanelRecord(state.panelResults);
		state.panels = normalizePanelRecord(state.panels);
		return $gameTemp.mmChoiceButtonEx;
	};

	const ensurePersistentState = () => {
		if (typeof $gameSystem === 'undefined' || !$gameSystem) {
			return { panels: {} };
		}
		if (!$gameSystem._mmChoiceButtonEx) {
			$gameSystem._mmChoiceButtonEx = {
				panels: {}
			};
		}
		const state = $gameSystem._mmChoiceButtonEx;
		state.panels = normalizePanelRecord(state.panels);
		return state;
	};

	const normalTextColor = () => {
		if (window.ColorManager && typeof ColorManager.normalColor === 'function') {
			return ColorManager.normalColor();
		}
		return '#ffffff';
	};

	const textColor = index => {
		if (window.ColorManager && typeof ColorManager.textColor === 'function') {
			return ColorManager.textColor(index);
		}
		return normalTextColor();
	};

	const convertChoiceTextEscapes = text => {
		const base = Window_Base.prototype;
		return base.convertEscapeCharacters.call({
			actorName: base.actorName,
			partyMemberName: base.partyMemberName
		}, toString(text, ''));
	};

	const escapeCodePattern = /^[$.|^!><{}\\]|^[A-Z]+/i;

	const choiceTextSegments = text => {
		const convertedText = convertChoiceTextEscapes(text);
		const segments = [];
		let color = normalTextColor();
		let buffer = '';

		const flush = () => {
			if (buffer) {
				segments.push({ type: 'text', text: buffer, color });
				buffer = '';
			}
		};

		for (let index = 0; index < convertedText.length; index++) {
			const character = convertedText[index];
			if (character === '\x1b') {
				const rest = convertedText.slice(index + 1);
				const codeMatch = escapeCodePattern.exec(rest);
				if (codeMatch) {
					const rawCode = codeMatch[0];
					const code = rawCode.toUpperCase();
					const paramIndex = index + 1 + rawCode.length;
					const paramMatch = /^\[(\d+)\]/.exec(convertedText.slice(paramIndex));
					if (code === 'C' && paramMatch) {
						flush();
						color = textColor(Number(paramMatch[1]));
						index = paramIndex + paramMatch[0].length - 1;
						continue;
					}
					if (code === 'I' && paramMatch) {
						flush();
						segments.push({ type: 'icon', iconIndex: Number(paramMatch[1]) });
						index = paramIndex + paramMatch[0].length - 1;
						continue;
					}
					buffer += `\\${rawCode}`;
					if (paramMatch) {
						buffer += paramMatch[0];
						index = paramIndex + paramMatch[0].length - 1;
					} else {
						index += rawCode.length;
					}
					continue;
				}
			}
			buffer += character;
		}

		flush();
		return segments;
	};

	const choiceTextUsesIcons = text => /\x1bI\[\d+\]/i.test(convertChoiceTextEscapes(text));

	const choiceIconAdvanceWidth = () => ImageManager.iconWidth + 4;

	const drawChoiceIcon = (bitmap, iconSetBitmap, iconIndex, x) => {
		if (!iconSetBitmap?.isReady?.()) return;
		const iconWidth = ImageManager.iconWidth;
		const iconHeight = ImageManager.iconHeight;
		const sourceX = (iconIndex % 16) * iconWidth;
		const sourceY = Math.floor(iconIndex / 16) * iconHeight;
		const drawX = x + (choiceIconAdvanceWidth() - iconWidth) / 2;
		const drawY = (bitmap.height - iconHeight) / 2;
		bitmap.blt(iconSetBitmap, sourceX, sourceY, iconWidth, iconHeight, drawX, drawY);
	};

	const drawChoiceText = (bitmap, text, align, padding, iconSetBitmap = null) => {
		const segments = choiceTextSegments(text);
		const widths = segments.map(segment => segment.type === 'icon'
			? choiceIconAdvanceWidth()
			: bitmap.measureTextWidth(segment.text));
		const totalTextWidth = segments.reduce((sum, segment, index) =>
			segment.type === 'text' ? sum + widths[index] : sum, 0);
		const totalIconWidth = segments.reduce((sum, segment, index) =>
			segment.type === 'icon' ? sum + widths[index] : sum, 0);
		const safePadding = Math.min(Math.max(0, padding), Math.floor(bitmap.width / 2));
		const availableWidth = Math.max(0, bitmap.width - safePadding * 2);
		if (availableWidth <= 0 || totalTextWidth + totalIconWidth <= 0) return;
		const availableTextWidth = Math.max(0, availableWidth - totalIconWidth);
		const fitScale = totalTextWidth > availableTextWidth && totalTextWidth > 0
			? availableTextWidth / totalTextWidth
			: 1;
		const fittedWidth = totalIconWidth + totalTextWidth * fitScale;
		let x = safePadding;

		if (align === 'center') {
			x += (availableWidth - fittedWidth) / 2;
		} else if (align === 'right') {
			x += availableWidth - fittedWidth;
		}

		segments.forEach((segment, index) => {
			const width = widths[index];
			if (width <= 0) return;
			if (segment.type === 'icon') {
				drawChoiceIcon(bitmap, iconSetBitmap, segment.iconIndex, x);
				x += width;
				return;
			}
			const fittedSegmentWidth = width * fitScale;
			if (fittedSegmentWidth <= 0) return;
			bitmap.textColor = segment.color;
			bitmap.drawText(segment.text, x, 0, Math.max(1, Math.ceil(fittedSegmentWidth)), bitmap.height, 'left');
			x += fittedSegmentWidth;
		});
		bitmap.textColor = normalTextColor();
	};

	class ResultWriter {
		static write(config, result, options = {}) {
			const state = ensureRuntimeState();
			state.result = result;
			state.selectedIndex = result.index;
			if (options.finishChoice !== false) {
				state.isActive = false;
			}
			if (result.panelId) {
				setPanelRecordValue(state.panelResults, result.panelId, result);
			}

			if (config.resultVariableId > 0) {
				$gameVariables.setValue(config.resultVariableId, result.value);
			}
		}
	}

	class ChoiceButtonBackgroundSprite extends Sprite {
		constructor(config, enterStartPosition = null) {
			super(ImageManager.loadSystem(config.visual.backgroundImageName));
			this._config = config;
			const position = resolveBackgroundPosition(config);
			this._targetX = position.x;
			this._targetY = position.y;
			this._enterPath = ['sequence', 'extra'].includes(config.animation.enterFrom)
				? [{ x: this._targetX, y: this._targetY }]
				: resolveEnterPath(config, this._targetX, this._targetY, 0);
			const resumeX = Number(enterStartPosition?.x);
			const resumeY = Number(enterStartPosition?.y);
			if (Number.isFinite(resumeX) && Number.isFinite(resumeY)) {
				const resumed = { x: resumeX, y: resumeY };
				const target = { x: this._targetX, y: this._targetY };
				this._enterPath = positionsEqual(resumed, target) ? [target] : [resumed, target];
			}
			this._startX = this._enterPath[0].x;
			this._startY = this._enterPath[0].y;
			this._enterStartFrame = Graphics.frameCount;
			this._enterDuration = Math.max(0, config.animation.enterDuration);
			this._easing = easingFunction(config.animation.easing);
			this._enterComplete = false;
			this._exitPlaying = false;
			this._exitComplete = false;

			this.anchor.set(0.5, 0.5);
			this.x = this._startX;
			this.y = this._startY;
		}

		update() {
			super.update();
			if (this._exitPlaying) {
				this.updateExitAnimation();
			} else {
				this.updateEnterAnimation();
			}
		}

		updateEnterAnimation() {
			if (this._enterComplete) return;
			const movingSequence = this._sequenceEnter && enterPathNeedsMove(this._enterPath);
			if (Graphics.frameCount < this._enterStartFrame) {
				if (movingSequence) this.visible = false;
				return;
			}

			if (this._enterDuration <= 0 || !enterPathNeedsMove(this._enterPath)) {
				this.visible = true;
				this.x = this._targetX;
				this.y = this._targetY;
				this._enterComplete = true;
				return;
			}

			const rawProgress = clamp((Graphics.frameCount - this._enterStartFrame) / this._enterDuration, 0, 1);
			if (movingSequence && rawProgress <= 0) {
				this.visible = false;
				return;
			}
			this.visible = true;
			const progress = this._easing(rawProgress);
			const position = interpolateEnterPath(this._enterPath, progress);
			this.x = position.x;
			this.y = position.y;

			if (rawProgress >= 1) {
				this.x = this._targetX;
				this.y = this._targetY;
				this._enterComplete = true;
			}
		}

		isEnterComplete() {
			return this._enterComplete;
		}

		startExitAnimation() {
			this._enterComplete = true;
			this._exitPlaying = true;
			this._exitComplete = false;
			this._exitPath = ['sequence', 'extra'].includes(this._config.animation.exitTo)
				? [{ x: this.x, y: this.y }]
				: resolveExitPath(this._config, this._targetX, this._targetY, 0);
			this._exitPath[0] = { x: this.x, y: this.y };
			const end = this._exitPath[this._exitPath.length - 1];
			this._exitEndX = end.x;
			this._exitEndY = end.y;
			this._exitStartFrame = Graphics.frameCount;
			this._exitDuration = Math.max(0, this._config.animation.exitDuration);
			this._exitEasing = easingFunction(this._config.animation.exitEasing);
			this.visible = true;
		}

		updateExitAnimation() {
			if (this._exitComplete || Graphics.frameCount < this._exitStartFrame) return;
			if (this._exitDuration <= 0 || !enterPathNeedsMove(this._exitPath)) {
				this.x = this._exitEndX;
				this.y = this._exitEndY;
				this._exitComplete = true;
				return;
			}
			const rawProgress = clamp((Graphics.frameCount - this._exitStartFrame) / this._exitDuration, 0, 1);
			const position = interpolateEnterPath(this._exitPath, this._exitEasing(rawProgress));
			this.x = position.x;
			this.y = position.y;
			if (rawProgress >= 1) {
				this.x = this._exitEndX;
				this.y = this._exitEndY;
				this._exitComplete = true;
			}
		}

		isExitComplete() {
			return this._exitComplete;
		}
	}

	class ChoiceButtonSprite extends Sprite_Clickable {
		constructor(choice, index, config, pressHandler, enterStartPosition = null, pointerTargetHandler = null) {
			super();
			this.index = index;
			this.choice = choice;
			this._config = config;
			this._pressHandler = pressHandler;
			this._pointerTargetHandler = pointerTargetHandler;
			this._isTogglePanel = !!config.panelId;
			this._usesSpriteSheet = !this._isTogglePanel && !!choice.spriteSheetImageName;
			this._spriteSheetFrameCount = this._usesSpriteSheet ? choice.spriteSheetFrameCount : 1;
			this._spriteSheetFrameInterval = this._usesSpriteSheet ? choice.spriteSheetFrameInterval : 1;
			this._spriteSheetStartFrame = Graphics.frameCount;
			this._spriteSheetFrameIndex = -1;
			const normalImageName = this._usesSpriteSheet
				? choice.spriteSheetImageName
				: this.normalImageName();
			const selectedImageName = this.selectedImageName(normalImageName);
			const pressedImageName = this.pressedImageName(normalImageName);
			const pressedSelectedImageName = this.pressedSelectedImageName(pressedImageName);
			this._normalBitmap = ImageManager.loadSystem(normalImageName);
			this._disabledBitmap = this.choice.disabledImageName
				? ImageManager.loadSystem(this.choice.disabledImageName)
				: null;
			this._selectedBitmap = selectedImageName
				? ImageManager.loadSystem(selectedImageName)
				: this._normalBitmap;
			this._pressedBitmap = pressedImageName
				? ImageManager.loadSystem(pressedImageName)
				: this._selectedBitmap;
			this._pressedSelectedBitmap = pressedSelectedImageName
				? ImageManager.loadSystem(pressedSelectedImageName)
				: this._pressedBitmap;
			const cursorImageName = this.choice.cursorImageName || config.visual.cursorImageName;
			this._cursorBitmap = cursorImageName
				? ImageManager.loadSystem(cursorImageName)
				: null;
			this._iconSetBitmap = choiceTextUsesIcons(choice.text)
				? ImageManager.loadSystem('IconSet')
				: null;
			this._textSprite = null;
			this._cursorSprite = null;
			this._cursorTargetAlpha = 0;
			this._selected = false;
			this._toggleOn = false;
			this._targetScale = config.visual.normalScale;
			this._currentScale = config.visual.normalScale;
			this._scaleStep = 0.03;
			this._selectionOffsetX = 0;
			this._selectionOffsetY = 0;
			this._selectionOffsetTargetX = 0;
			this._selectionOffsetTargetY = 0;
			this._selectionOffsetStartX = 0;
			this._selectionOffsetStartY = 0;
			this._selectionOffsetStartFrame = Graphics.frameCount;
			const resumeX = Number(enterStartPosition?.x);
			const resumeY = Number(enterStartPosition?.y);
			const resumesFromCurrent = Number.isFinite(resumeX) && Number.isFinite(resumeY);
			this._sequenceEnter = config.animation.enterFrom === 'sequence' && !resumesFromCurrent;
			this._enterComplete = false;
			const enterTiming = config.animation.enterFrom === 'extra'
				? resolveExtraTiming(config, index - 1, 'enter')
				: {
					duration: Math.max(0, config.animation.enterDuration),
					delay: sequenceEnterStartOffset(config, index - 1),
					easing: config.animation.easing
				};
			this._enterStartFrame = Graphics.frameCount + enterTiming.delay;
			this._enterDuration = enterTiming.duration;
			this._easing = easingFunction(enterTiming.easing);
			const enterScaleTiming = config.animation.enterFrom === 'extra'
				? resolveExtraTiming(config, index - 1, 'enter', 'scale')
				: enterTiming;
			const enterRotationTiming = config.animation.enterFrom === 'extra'
				? resolveExtraTiming(config, index - 1, 'enter', 'rotation')
				: enterTiming;
			this._enterScaleTiming = {
				startFrame: Graphics.frameCount + enterScaleTiming.delay,
				duration: enterScaleTiming.duration,
				easing: easingFunction(enterScaleTiming.easing)
			};
			this._enterRotationTiming = {
				startFrame: Graphics.frameCount + enterRotationTiming.delay,
				duration: enterRotationTiming.duration,
				easing: easingFunction(enterRotationTiming.easing)
			};
			this._exitPlaying = false;
			this._exitComplete = false;

			const position = resolvePosition(config, index - 1);
			this._targetX = position.x;
			this._targetY = position.y;
			const enterMotionData = config.animation.enterFrom === 'extra'
				? resolveExtraPathData(config, this._targetX, this._targetY, index - 1, 'enter')
				: null;
			this._enterPath = enterMotionData
				? enterMotionData.path
				: resolveEnterPath(config, this._targetX, this._targetY, index - 1);
			this._enterPathTimes = enterMotionData?.times || null;
			this._enterScales = enterMotionData?.scales || null;
			this._enterRotations = enterMotionData?.rotations || null;
			if (resumesFromCurrent) {
				const resumed = { x: resumeX, y: resumeY };
				const target = { x: this._targetX, y: this._targetY };
				this._enterPath = positionsEqual(resumed, target) ? [target] : [resumed, target];
				this._enterPathTimes = null;
				this._enterScales = null;
				this._enterRotations = null;
			}
			this._startX = this._enterPath[0].x;
			this._startY = this._enterPath[0].y;
			this._baseRotation = toNumber(choice.angle, 0) * Math.PI / 180;
			this._motionScale = this._enterScales
				? interpolateTimedValue(this._enterScales, this._enterPathTimes, 0, 100) / 100
				: 1;
			this._motionRotation = this._enterRotations
				? interpolateTimedValue(this._enterRotations, this._enterPathTimes, 0, 0) * Math.PI / 180
				: 0;

			this.anchor.set(0.5, 0.5);
			this.bitmap = this._normalBitmap;
			this.rotation = this._baseRotation + this._motionRotation;
			this.scale.set(
				config.visual.normalScale * this._motionScale,
				config.visual.normalScale * this._motionScale
			);
			this.x = this._startX;
			this.y = this._startY;
			if (this._sequenceEnter && enterPathNeedsMove(this._enterPath)) {
				this.visible = false;
			}

			this._normalBitmap.addLoadListener(() => {
				this.updateSpriteSheetFrame(true);
				this.refreshChildren();
			});
			if (this._iconSetBitmap) {
				this._iconSetBitmap.addLoadListener(() => this.refreshChildren());
			}
			if (this._disabledBitmap) {
				this._disabledBitmap.addLoadListener(() => {
					if (this.bitmap === this._disabledBitmap) {
						this.setButtonBitmap(this._disabledBitmap);
					}
				});
			}
		}

		normalImageName() {
			if (this._isTogglePanel) {
				return this.choice.offImageName;
			}
			return this.choice.imageName;
		}

		selectedImageName(normalImageName) {
			if (this._usesSpriteSheet) return normalImageName;
			if (this._isTogglePanel) {
				return this.choice.selectedImageName2 || normalImageName;
			}
			return this.choice.selectedImageName || normalImageName;
		}

		pressedImageName(normalImageName) {
			if (this._usesSpriteSheet) return normalImageName;
			if (this._isTogglePanel) {
				return this.choice.onImageName;
			}
			return normalImageName;
		}

		pressedSelectedImageName(pressedImageName) {
			if (this._usesSpriteSheet) return pressedImageName;
			if (this._isTogglePanel) {
				return this.choice.selectedImageName1 || pressedImageName;
			}
			return pressedImageName;
		}

		buttonBitmapWidth() {
			return this._usesSpriteSheet
				? this.spriteSheetFrameWidth()
				: this._normalBitmap.width;
		}

		buttonBitmapHeight() {
			return this._normalBitmap.height;
		}

		spriteSheetFrameWidth() {
			if (!this._usesSpriteSheet || !this._normalBitmap?.isReady?.()) return 0;
			return Math.max(1, Math.floor(this._normalBitmap.width / this._spriteSheetFrameCount));
		}

		setButtonBitmap(bitmap) {
			this.bitmap = bitmap;
			if (!this._usesSpriteSheet) return;
			if (bitmap === this._normalBitmap) {
				this.updateSpriteSheetFrame(true);
			} else if (bitmap?.isReady?.()) {
				this.setFrame(0, 0, bitmap.width, bitmap.height);
			}
		}

		updateSpriteSheetFrame(force = false) {
			if (!this._usesSpriteSheet || this.bitmap !== this._normalBitmap) return;
			const bitmap = this._normalBitmap;
			if (!bitmap?.isReady?.()) return;
			const frameWidth = this.spriteSheetFrameWidth();
			const frameHeight = bitmap.height;
			const frameCount = this._spriteSheetFrameCount;
			if (frameWidth <= 0 || frameHeight <= 0) return;
			const elapsed = Math.max(0, Graphics.frameCount - this._spriteSheetStartFrame);
			const frameIndex = Math.floor(elapsed / this._spriteSheetFrameInterval) % frameCount;
			if (!force && frameIndex === this._spriteSheetFrameIndex) return;
			this._spriteSheetFrameIndex = frameIndex;
			this.setFrame(frameIndex * frameWidth, 0, frameWidth, frameHeight);
		}

		refreshChildren() {
			if (this._cursorBitmap && !this._cursorSprite) {
				this._cursorSprite = new Sprite(this._cursorBitmap);
				this._cursorSprite.anchor.set(0.5, 0.5);
				this._cursorSprite.x = this._config.visual.cursorOffsetX;
				this._cursorSprite.y = this._config.visual.cursorOffsetY;
				this._cursorSprite.alpha = 0;
				this.addChild(this._cursorSprite);
			}

			const textResourcesReady = this._normalBitmap?.isReady?.()
				&& (!this._iconSetBitmap || this._iconSetBitmap.isReady());
			if (!this._textSprite && textResourcesReady) {
				const textBitmap = new Bitmap(this.buttonBitmapWidth(), this.buttonBitmapHeight());
				textBitmap.fontFace = $gameSystem.mainFontFace();
				textBitmap.fontSize = this._config.visual.fontSize;
				drawChoiceText(
					textBitmap,
					this.choice.text,
					this._config.visual.textAlign,
					this._config.visual.textPadding,
					this._iconSetBitmap
				);
				this._textSprite = new Sprite(textBitmap);
				this._textSprite.anchor.set(0.5, 0.5);
				this.addChild(this._textSprite);
			}

			this.applySelectionVisual();
		}

		update() {
			super.update();
			this.updateSpriteSheetFrame();
			if (this._exitPlaying) {
				this.updateExitAnimation();
			} else {
				this.removeSelectionOffset();
				this.updateEnterAnimation();
				this.updateSelectionPosition();
			}
			this.updateScaleAnimation();
			this.updateCursor();
		}

		onClick() {
			if (this.isEnabled() && this._pressHandler) {
				this._pressHandler(this.index);
			}
		}

		isClickEnabled() {
			return super.isClickEnabled()
				&& (!this._pointerTargetHandler || this._pointerTargetHandler(this));
		}

		hitTest(x, y) {
			const bitmap = this.bitmap;
			if (!bitmap?.isReady?.()) return false;
			const usesSpriteSheetFrame = this._usesSpriteSheet && bitmap === this._normalBitmap;
			const width = usesSpriteSheetFrame ? this.spriteSheetFrameWidth() : bitmap.width;
			const height = bitmap.height;
			if (!Number.isFinite(x) || !Number.isFinite(y) ||
				!Number.isFinite(width) || !Number.isFinite(height) ||
				width <= 0 || height <= 0) {
				return false;
			}
			const left = -this.anchor.x * width;
			const top = -this.anchor.y * height;
			if (!Number.isFinite(left) || !Number.isFinite(top)) return false;
			if (x < left || x >= left + width || y < top || y >= top + height) return false;
			const pixelX = Math.floor(x - left);
			const pixelY = Math.floor(y - top);
			if (pixelX < 0 || pixelX >= width || pixelY < 0 || pixelY >= height) return false;
			const sourceX = usesSpriteSheetFrame
				? Math.max(0, this._spriteSheetFrameIndex) * this.spriteSheetFrameWidth()
				: 0;
			return bitmap.getAlphaPixel(sourceX + pixelX, pixelY) > 0;
		}

		isEnabled() {
			return this.choice.enabled !== false;
		}

		setSelected(selected) {
			this._selected = selected;
			this.applySelectionVisual();
		}

		setPressed(pressed) {
			this._toggleOn = pressed;
			this.applySelectionVisual();
		}

		applySelectionVisual() {
			const enabled = this.isEnabled();
			this._targetScale = enabled && this._selected
				? this._config.visual.selectedScale
				: this._config.visual.normalScale;
			this.setSelectionOffsetTarget(
				enabled && this._selected ? this._config.visual.selectedOffsetX : 0,
				enabled && this._selected ? this._config.visual.selectedOffsetY : 0
			);
			this._cursorTargetAlpha = enabled && this._selected ? 1 : 0;
			const normalOpacity = Number.isFinite(this.choice.opacity) ? this.choice.opacity : 255;
			this.alpha = enabled ? normalOpacity / 255 : this.choice.disabledOpacity / 255;
			if (!enabled && !this._isTogglePanel) {
				this.setButtonBitmap(this._disabledBitmap || this._normalBitmap);
				return;
			}
			if (this._isTogglePanel) {
				if (this._toggleOn && this._selected) {
					this.setButtonBitmap(this._pressedSelectedBitmap);
				} else if (this._toggleOn) {
					this.setButtonBitmap(this._pressedBitmap);
				} else if (this._selected) {
					this.setButtonBitmap(this._selectedBitmap);
				} else {
					this.setButtonBitmap(this._normalBitmap);
				}
			} else {
				this.setButtonBitmap(this._selected ? this._selectedBitmap : this._normalBitmap);
			}
		}

		isHovered() {
			return this.isEnabled() && !!this._hovered;
		}

		isPointerInside() {
			return this.worldVisible && this.isBeingTouched();
		}

		isEnterComplete() {
			return this._enterComplete;
		}

		startExitAnimation() {
			this._enterComplete = true;
			this._exitPlaying = true;
			this._exitComplete = false;
			const exitMotionData = this._config.animation.exitTo === 'extra'
				? resolveExtraPathData(this._config, this._targetX, this._targetY, this.index - 1, 'exit')
				: null;
			this._exitPath = exitMotionData
				? exitMotionData.path
				: resolveExitPath(this._config, this._targetX, this._targetY, this.index - 1);
			this._exitPathTimes = exitMotionData?.times || null;
			this._exitScales = exitMotionData?.scales || null;
			this._exitRotations = exitMotionData?.rotations || null;
			this._exitPath[0] = { x: this.x, y: this.y };
			const end = this._exitPath[this._exitPath.length - 1];
			this._exitEndX = end.x;
			this._exitEndY = end.y;
			const exitTiming = this._config.animation.exitTo === 'extra'
				? resolveExtraTiming(this._config, this.index - 1, 'exit')
				: {
					duration: Math.max(0, this._config.animation.exitDuration),
					delay: sequenceExitStartOffset(this._config, this.index - 1),
					easing: this._config.animation.exitEasing
				};
			this._exitStartFrame = Graphics.frameCount + exitTiming.delay;
			this._exitDuration = exitTiming.duration;
			this._exitEasing = easingFunction(exitTiming.easing);
			const exitScaleTiming = this._config.animation.exitTo === 'extra'
				? resolveExtraTiming(this._config, this.index - 1, 'exit', 'scale')
				: exitTiming;
			const exitRotationTiming = this._config.animation.exitTo === 'extra'
				? resolveExtraTiming(this._config, this.index - 1, 'exit', 'rotation')
				: exitTiming;
			this._exitScaleTiming = {
				startFrame: Graphics.frameCount + exitScaleTiming.delay,
				duration: exitScaleTiming.duration,
				easing: easingFunction(exitScaleTiming.easing)
			};
			this._exitRotationTiming = {
				startFrame: Graphics.frameCount + exitRotationTiming.delay,
				duration: exitRotationTiming.duration,
				easing: easingFunction(exitRotationTiming.easing)
			};
			this.visible = true;
		}

		updateExitAnimation() {
			if (this._config.animation.exitTo === 'extra') {
				this.updateExtraMotionPhase('exit');
				return;
			}
			if (this._exitComplete || Graphics.frameCount < this._exitStartFrame) return;
			const hideAfterSequenceExit = this._config.animation.exitTo === 'sequence';
			if (this._exitDuration <= 0 || !extraMotionNeedsAnimation(this._exitPath, this._exitScales, this._exitRotations)) {
				this.x = this._exitEndX;
				this.y = this._exitEndY;
				this.applyExtraMotionProgress(this._exitScales, this._exitRotations, this._exitPathTimes, 1);
				this._exitComplete = true;
				if (hideAfterSequenceExit) this.visible = false;
				return;
			}
			const rawProgress = clamp((Graphics.frameCount - this._exitStartFrame) / this._exitDuration, 0, 1);
			const progress = this._exitEasing(rawProgress);
			const position = interpolateTimedPath(this._exitPath, this._exitPathTimes, progress);
			this.x = position.x;
			this.y = position.y;
			this.applyExtraMotionProgress(this._exitScales, this._exitRotations, this._exitPathTimes, progress);
			if (rawProgress >= 1) {
				this.x = this._exitEndX;
				this.y = this._exitEndY;
				this.applyExtraMotionProgress(this._exitScales, this._exitRotations, this._exitPathTimes, 1);
				this._exitComplete = true;
				if (hideAfterSequenceExit) this.visible = false;
			}
		}

		isExitComplete() {
			return this._exitComplete;
		}

		updateEnterAnimation() {
			if (this._config.animation.enterFrom === 'extra') {
				this.updateExtraMotionPhase('enter');
				return;
			}
			if (this._enterComplete) return;
			const movingSequence = this._sequenceEnter && enterPathNeedsMove(this._enterPath);
			if (Graphics.frameCount < this._enterStartFrame) {
				if (movingSequence) this.visible = false;
				return;
			}

			if (this._enterDuration <= 0 || !extraMotionNeedsAnimation(this._enterPath, this._enterScales, this._enterRotations)) {
				this.visible = true;
				this.x = this._targetX;
				this.y = this._targetY;
				this._motionScale = 1;
				this._motionRotation = 0;
				this._enterComplete = true;
				return;
			}

			const rawProgress = clamp((Graphics.frameCount - this._enterStartFrame) / this._enterDuration, 0, 1);
			if (movingSequence && rawProgress <= 0) {
				this.visible = false;
				return;
			}
			this.visible = true;
			const progress = this._easing(rawProgress);
			const position = interpolateTimedPath(this._enterPath, this._enterPathTimes, progress);
			this.x = position.x;
			this.y = position.y;
			this.applyExtraMotionProgress(this._enterScales, this._enterRotations, this._enterPathTimes, progress);

			if (rawProgress >= 1) {
				this.x = this._targetX;
				this.y = this._targetY;
				this._motionScale = 1;
				this._motionRotation = 0;
				this._enterComplete = true;
			}
		}

		animationChannelState(timing, needed) {
			if (!needed) return { progress: 1, complete: true };
			if (Graphics.frameCount < timing.startFrame) return { progress: 0, complete: false };
			if (timing.duration <= 0) return { progress: 1, complete: true };
			const rawProgress = clamp((Graphics.frameCount - timing.startFrame) / timing.duration, 0, 1);
			return {
				progress: timing.easing(rawProgress),
				complete: rawProgress >= 1
			};
		}

		updateExtraMotionPhase(phase) {
			const entering = phase === 'enter';
			if (entering ? this._enterComplete : this._exitComplete) return;
			const path = entering ? this._enterPath : this._exitPath;
			const times = entering ? this._enterPathTimes : this._exitPathTimes;
			const scales = entering ? this._enterScales : this._exitScales;
			const rotations = entering ? this._enterRotations : this._exitRotations;
			const moveTiming = entering
				? { startFrame: this._enterStartFrame, duration: this._enterDuration, easing: this._easing }
				: { startFrame: this._exitStartFrame, duration: this._exitDuration, easing: this._exitEasing };
			const scaleTiming = entering ? this._enterScaleTiming : this._exitScaleTiming;
			const rotationTiming = entering ? this._enterRotationTiming : this._exitRotationTiming;
			const moveState = this.animationChannelState(moveTiming, enterPathNeedsMove(path));
			const scaleState = this.animationChannelState(
				scaleTiming,
				Array.isArray(scales) && scales.some(scale => scale !== 100)
			);
			const rotationState = this.animationChannelState(
				rotationTiming,
				Array.isArray(rotations) && rotations.some(rotation => rotation !== 0)
			);
			const position = interpolateTimedPath(path, times, moveState.progress);
			this.visible = true;
			this.x = position.x;
			this.y = position.y;
			this.applyExtraMotionProgress(scales, rotations, times, scaleState.progress, rotationState.progress);
			if (moveState.complete && scaleState.complete && rotationState.complete) {
				const end = path[path.length - 1];
				this.x = end.x;
				this.y = end.y;
				this.applyExtraMotionProgress(scales, rotations, times, 1, 1);
				if (entering) {
					this._enterComplete = true;
				} else {
					this._exitComplete = true;
				}
			}
		}

		updateScaleAnimation() {
			this._currentScale = this.nextScaleValue(this._currentScale, this._targetScale);
			const scale = Math.max(0, (this._currentScale + this.selectedPulseOffset()) * this._motionScale);
			this.scale.set(scale, scale);
			this.rotation = this._baseRotation + this._motionRotation;
		}

		applyExtraMotionProgress(scales, rotations, times, scaleProgress, rotationProgress = scaleProgress) {
			this._motionScale = interpolateTimedValue(scales, times, scaleProgress, 100) / 100;
			this._motionRotation = interpolateTimedValue(rotations, times, rotationProgress, 0) * Math.PI / 180;
		}

		setSelectionOffsetTarget(x, y) {
			if (this._selectionOffsetTargetX === x && this._selectionOffsetTargetY === y) return;
			this._selectionOffsetStartX = this._selectionOffsetX;
			this._selectionOffsetStartY = this._selectionOffsetY;
			this._selectionOffsetTargetX = x;
			this._selectionOffsetTargetY = y;
			this._selectionOffsetStartFrame = Graphics.frameCount;
		}

		removeSelectionOffset() {
			this.x -= this._selectionOffsetX;
			this.y -= this._selectionOffsetY;
		}

		updateSelectionPosition() {
			const duration = this._config.visual.selectedMoveDuration;
			if (duration <= 0) {
				this._selectionOffsetX = this._selectionOffsetTargetX;
				this._selectionOffsetY = this._selectionOffsetTargetY;
			} else {
				const progress = clamp((Graphics.frameCount - this._selectionOffsetStartFrame) / duration, 0, 1);
				this._selectionOffsetX = this._selectionOffsetStartX
					+ (this._selectionOffsetTargetX - this._selectionOffsetStartX) * progress;
				this._selectionOffsetY = this._selectionOffsetStartY
					+ (this._selectionOffsetTargetY - this._selectionOffsetStartY) * progress;
			}
			this.x += this._selectionOffsetX;
			this.y += this._selectionOffsetY;
		}

		nextScaleValue(current, target) {
			if (current < target) return Math.min(current + this._scaleStep, target);
			if (current > target) return Math.max(current - this._scaleStep, target);
			return current;
		}

		selectedPulseOffset() {
			const amount = this._config.visual.selectedPulseScale;
			if (!this._selected || amount <= 0) return 0;
			const duration = Math.max(1, this._config.visual.selectedPulseDuration);
			const phase = (Graphics.frameCount % duration) / duration;
			return Math.sin(phase * Math.PI * 2) * amount;
		}

		updateCursor() {
			if (!this._cursorSprite) return;
			const current = this._cursorSprite.alpha;
			const target = this._cursorTargetAlpha;
			const speed = 0.12;
			if (current < target) this._cursorSprite.alpha = Math.min(current + speed, target);
			if (current > target) this._cursorSprite.alpha = Math.max(current - speed, target);
		}
	}

	class ChoiceButtonLayer extends Sprite {
		constructor(session) {
			super();
			this._session = session;
		}

		update() {
			this._session.updatePointerTarget();
			super.update();
			this._session.update();
		}
	}

	const buttonGroupHoverPadding = 4;
	const pointerInsideBounds = (bounds, padding = 0) => {
		return !!bounds
			&& TouchInput.x >= bounds.x - padding
			&& TouchInput.x <= bounds.x + bounds.width + padding
			&& TouchInput.y >= bounds.y - padding
			&& TouchInput.y <= bounds.y + bounds.height + padding;
	};

	const buttonGroupBounds = buttons => {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		buttons.forEach(button => {
			if (!button || !button.worldVisible || typeof button.getBounds !== 'function') return;
			const bounds = button.getBounds();
			if (!bounds || bounds.width <= 0 || bounds.height <= 0) return;
			minX = Math.min(minX, bounds.x);
			minY = Math.min(minY, bounds.y);
			maxX = Math.max(maxX, bounds.x + bounds.width);
			maxY = Math.max(maxY, bounds.y + bounds.height);
		});

		if (!Number.isFinite(minX)) return null;
		return {
			x: minX,
			y: minY,
			width: maxX - minX,
			height: maxY - minY
		};
	};

	const buttonGroupTargetBounds = buttons => {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		buttons.forEach(button => {
			if (!button) return;
			const targetX = Number(button._targetX);
			const targetY = Number(button._targetY);
			if (!Number.isFinite(targetX) || !Number.isFinite(targetY)) return;
			const bounds = typeof button.getBounds === 'function' ? button.getBounds() : null;
			const width = bounds && bounds.width > 0 ? bounds.width : Math.max(1, Math.abs(button.width || 48));
			const height = bounds && bounds.height > 0 ? bounds.height : Math.max(1, Math.abs(button.height || 48));
			minX = Math.min(minX, targetX - width / 2);
			minY = Math.min(minY, targetY - height / 2);
			maxX = Math.max(maxX, targetX + width / 2);
			maxY = Math.max(maxY, targetY + height / 2);
		});

		if (!Number.isFinite(minX)) return null;
		return {
			x: minX,
			y: minY,
			width: maxX - minX,
			height: maxY - minY
		};
	};

	const visitSceneChildren = (node, visitor) => {
		if (!node) return;
		visitor(node);
		const children = Array.isArray(node.children) ? node.children : [];
		children.forEach(child => visitSceneChildren(child, visitor));
	};

	const sceneSelectableWindows = () => {
		const scene = SceneManager._scene;
		if (!scene || typeof Window_Selectable === 'undefined') return [];

		const windows = [];
		visitSceneChildren(scene, node => {
			if (node instanceof Window_Selectable) windows.push(node);
		});
		return windows;
	};

	const belongsToScene = (node, scene) => {
		let current = node;
		while (current) {
			if (current === scene) return true;
			current = current.parent;
		}
		return false;
	};

	const isActiveSelectableWindow = window => {
		if (!window.active || !window.visible) return false;
		if (typeof window.isOpen === 'function' && !window.isOpen()) return false;
		if (typeof window.index !== 'function' || window.index() < 0) return false;
		if (typeof window.maxItems === 'function' && window.maxItems() <= 0) return false;
		return true;
	};

	class InputPriorityTracker {
		constructor() {
			this._pointerX = TouchInput.x;
			this._pointerY = TouchInput.y;
			this._preferKeyboard = false;
		}

		updatePointer() {
			if (this._pointerX === TouchInput.x && this._pointerY === TouchInput.y) return false;
			this._pointerX = TouchInput.x;
			this._pointerY = TouchInput.y;
			this._preferKeyboard = false;
			return true;
		}

		preferKeyboard() {
			this._pointerX = TouchInput.x;
			this._pointerY = TouchInput.y;
			this._preferKeyboard = true;
		}

		acceptsHover() {
			return !this._preferKeyboard;
		}
	}

	class ChoiceButtonSession {
		constructor(config, onFinish, options = {}) {
			this._config = config;
			this._onFinish = onFinish;
			this._onResult = typeof options.onResult === 'function' ? options.onResult : null;
			this._onDismiss = typeof options.onDismiss === 'function' ? options.onDismiss : null;
			this._state = 'opening';
			this._queuedConfirmIndex = null;
			this._pointerTargetButton = null;
			this._selectedIndex = config.input.initialIndex;
			this._inputPriority = new InputPriorityTracker();
			this._hoverFocusInside = false;
			this.layer = new ChoiceButtonLayer(this);
			this.background = config.visual.backgroundImageName ? new ChoiceButtonBackgroundSprite(config) : null;
			if (this.background) {
				this.layer.addChild(this.background);
			}
			this.buttons = config.choices.map((choice, index) => {
				const button = new ChoiceButtonSprite(choice, index + 1, config, confirmIndex => {
					this.queueConfirm(confirmIndex);
				}, null, candidate => this.isTopmostPointerButton(candidate));
				this.layer.addChild(button);
				return button;
			});
			this.select(this.initialSelectedIndex(), false);
			this.publishActiveState();
		}

		update() {
			if (this._state === 'finished') return;
			if (this._state === 'closing') {
				if (this.isExitComplete()) {
					this.finishExit();
				}
				return;
			}

			if (this._state === 'opening') {
				if (this.isEnterComplete()) {
					this._state = 'active';
					this.setFocusVisual(Manager.isChoiceFocused());
				}
				return;
			}

			if (this._state !== 'active') return;
			this._inputPriority.updatePointer();
			this.updateHoverFocus();
			if (!Manager.isChoiceFocused()) return;
			if (Manager.isFocusInputSuppressed()) return;

			const keyboardMoved = this.updateKeyboardSelection();
			if (!keyboardMoved) {
				this.updateHoverSelection();
			}
			this.updateConfirm();
			this.updateCancel();
		}

		queueConfirm(index) {
			if (this._state !== 'active') return;
			if (!Manager.isChoiceFocused()) return;
			this._queuedConfirmIndex = index;
		}

		updatePointerTarget() {
			this._pointerTargetButton = null;
			for (let index = this.buttons.length - 1; index >= 0; index--) {
				const candidate = this.buttons[index];
				if (candidate.isPointerInside()) {
					this._pointerTargetButton = candidate;
					break;
				}
			}
		}

		isTopmostPointerButton(button) {
			return this._pointerTargetButton === button;
		}

		updateHoverFocus() {
			if (!this._config.input.hoverFocus) return false;
			if (!Manager.canUseHoverFocus()) return false;
			const inside = this.isPointerInsideButtonGroup();
			if (inside === this._hoverFocusInside) return false;

			this._hoverFocusInside = inside;
			if (inside) {
				return Manager.isChoiceFocused() ? false : Manager.focusChoice();
			}
			return Manager.isChoiceFocused() ? Manager.clearFocus() : false;
		}

		updateHoverSelection() {
			if (!Manager.canUseHoverFocus()) return;
			if (!this._inputPriority.acceptsHover()) return;
			const hoveredButton = this.buttons.find(button => button.isHovered());
			if (hoveredButton && hoveredButton.index !== this._selectedIndex) {
				this.select(hoveredButton.index, true);
			}
		}

		updateKeyboardSelection() {
			if (this.isMouseOnly()) return false;

			let movement = 0;
			if (this._config.input.axis === 'horizontal') {
				if (Input.isRepeated('left')) movement -= 1;
				if (Input.isRepeated('right')) movement += 1;
			} else {
				if (Input.isRepeated('up')) movement -= 1;
				if (Input.isRepeated('down')) movement += 1;
			}

			if (movement !== 0) {
				this._inputPriority.preferKeyboard();
				this.moveSelection(movement);
				return true;
			}
			return false;
		}

		updateConfirm() {
			if (this._queuedConfirmIndex !== null) {
				const index = this._queuedConfirmIndex;
				this._queuedConfirmIndex = null;
				this.confirm(index);
				return;
			}

			if (!this.isMouseOnly() && Input.isTriggered('ok')) {
				Input.update();
				TouchInput.update();
				this.confirm(this._selectedIndex);
			}
		}

		updateCancel() {
			if (!this._config.input.allowCancel) return;
			const cancelByMouse = TouchInput.isCancelled();
			const cancelByKey = !this.isMouseOnly() && Input.isTriggered('cancel');
			if (cancelByKey || cancelByMouse) {
				this.cancel();
			}
		}

		moveSelection(delta) {
			const selectableIndexes = this.selectableIndexes();
			if (selectableIndexes.length === 0) {
				this.select(0, false);
				return;
			}

			const currentPosition = selectableIndexes.indexOf(this._selectedIndex);
			if (currentPosition < 0) {
				this.select(delta > 0 ? selectableIndexes[0] : selectableIndexes[selectableIndexes.length - 1], true);
				return;
			}

			let nextPosition = currentPosition + delta;
			if (this._config.input.wrap) {
				if (nextPosition < 0) nextPosition = selectableIndexes.length - 1;
				if (nextPosition >= selectableIndexes.length) nextPosition = 0;
			} else {
				nextPosition = clamp(nextPosition, 0, selectableIndexes.length - 1);
			}

			const nextIndex = selectableIndexes[nextPosition];
			this.select(nextIndex, nextIndex !== this._selectedIndex);
		}

		selectableIndexes() {
			return this.buttons
				.filter(button => button.isEnabled())
				.map(button => button.index);
		}

		initialSelectedIndex() {
			if (this._selectedIndex === 0) return 0;
			return this.selectableIndexes().includes(this._selectedIndex)
				? this._selectedIndex
				: (this.selectableIndexes()[0] || 0);
		}

		select(index, playSound) {
			const requestedIndex = clamp(index, 0, this.buttons.length);
			const requestedButton = this.buttons[requestedIndex - 1];
			this._selectedIndex = requestedIndex === 0 || (requestedButton && requestedButton.isEnabled())
				? requestedIndex
				: (this.selectableIndexes()[0] || 0);
			this.setFocusVisual(Manager.isChoiceFocused());
			const state = ensureRuntimeState();
			state.selectedIndex = this._selectedIndex;
			state.isActive = true;

			if (playSound) {
				SoundManager.playCursor();
			}
		}

		setFocusVisual(focused) {
			const showSelection = focused && this._state === 'active';
			this.buttons.forEach(button => {
				button.setSelected(showSelection && button.index === this._selectedIndex);
			});
		}

		confirm(index) {
			if (this._state !== 'active') return;
			const button = this.buttons[index - 1];
			if (!button) return;
			if (!button.isEnabled()) {
				SoundManager.playBuzzer();
				return;
			}

			const keepOpen = !!this._config.keepOpenOnConfirm;
			if (!keepOpen) this.startExit();
			if (!this._config.suppressConfirmSound) SoundManager.playOk();
			const result = {
				type: 'confirm',
				index,
				value: button.choice.resultValue,
				text: button.choice.text
			};
			ResultWriter.write(this._config, result, { finishChoice: !keepOpen });
			if (this._onResult) {
				this._onResult(result);
			}
			if (button.choice.commonEventId > 0) {
				$gameTemp.reserveCommonEvent(button.choice.commonEventId);
			}
			setButtonSwitch(button.choice, true);
			const script = button.choice.script;
			if (keepOpen) {
				Manager.clearFocus();
				executeChoiceScript(script, result);
				return;
			}
			this._onFinish(this);
			executeChoiceScript(script, result);
		}

		cancel() {
			if (this._state !== 'active') return;

			this.startExit();
			Manager.suppressMenuThisFrame();
			if (!this._config.suppressCancelSound) SoundManager.playCancel();
			const result = {
				type: 'cancel',
				index: 0,
				value: 0,
				text: ''
			};
			ResultWriter.write(this._config, result);
			if (this._onResult) {
				this._onResult(result);
			}
			this._onFinish(this);
		}

		clear(options = {}) {
			if (this._state === 'finished') return;
			this._state = 'finished';
			const state = ensureRuntimeState();
			state.isActive = false;
			this.destroy();
			const onDismiss = this._onDismiss;
			this._onDismiss = null;
			try {
				if (onDismiss) {
					onDismiss({ reason: toString(options.reason, 'cleared') || 'cleared' });
				}
			} finally {
				this._onFinish(this);
			}
		}

		startExit() {
			this._state = 'closing';
			this._queuedConfirmIndex = null;
			this.setFocusVisual(false);
			const state = ensureRuntimeState();
			state.isActive = false;
			if (this.background) this.background.startExitAnimation();
			this.buttons.forEach(button => button.startExitAnimation());
			Manager.trackExitingSession(this);
		}

		isExitComplete() {
			const backgroundComplete = !this.background || this.background.isExitComplete();
			return backgroundComplete && this.buttons.every(button => button.isExitComplete());
		}

		finishExit() {
			if (this._state !== 'closing') return;
			this._state = 'finished';
			this.destroy();
			Manager.finishExitingSession(this);
		}

		forceDestroy() {
			if (this._state === 'finished') return;
			this._state = 'finished';
			this.destroy();
		}

		destroy() {
			if (this.layer.parent) {
				this.layer.parent.removeChild(this.layer);
			}
			this.layer.removeChildren();
		}

		isActive() {
			return this._state === 'opening' || this._state === 'active';
		}

		isChoiceSession() {
			return true;
		}

		inputMode() {
			return this._config.input.mode || 'always';
		}

		isMouseOnly() {
			return this.inputMode() === 'mouse';
		}

		blocksPlayerMovement() {
			return this.inputMode() === 'button';
		}

		blocksMapTouch() {
			if (this.inputMode() === 'button') return true;
			if (this.isPointerOnButton()) return true;
			return false;
		}

		blocksMenuCall() {
			return !this.isMouseOnly() || TouchInput.isCancelled();
		}

		blocksSelectableCursorInput() {
			return !this.isMouseOnly();
		}

		blocksSelectableHandlingInput() {
			return !this.isMouseOnly() || TouchInput.isCancelled();
		}

		blocksSelectableTouchInput() {
			if (!this.isMouseOnly()) return true;
			return this.isPointerOnButton();
		}

		isPointerOnButton() {
			return this.buttons.some(button => button.isPointerInside() || button.isPressed());
		}

		isPointerInsideButtonGroup() {
			const sprites = this._config.input.includeBackgroundInHover && this.background
				? [this.background, ...this.buttons]
				: this.buttons;
			return pointerInsideBounds(buttonGroupBounds(sprites), buttonGroupHoverPadding);
		}

		isEnterComplete() {
			const backgroundComplete = !this.background || this.background.isEnterComplete();
			return backgroundComplete && this.buttons.every(button => button.isEnterComplete());
		}

		publishActiveState() {
			const state = ensureRuntimeState();
			state.result = null;
			state.selectedIndex = this._selectedIndex;
			state.isActive = true;
		}
	}

	class ButtonPanelSession {
		constructor(config, savedState = {}, options = {}) {
			this._config = config;
			const enterPositions = options.enterPositions || {};
			this._state = 'opening';
			this._queuedConfirmIndex = null;
			this._pointerTargetButton = null;
			this._selectedIndex = clamp(toNumber(savedState.selectedIndex, config.input.initialIndex), 0, config.choices.length);
			const savedToggles = Array.isArray(savedState.toggles) ? savedState.toggles : [];
			this._toggleStates = config.choices.map((_, index) => !!savedToggles[index]);
			this._inputPriority = new InputPriorityTracker();
			this._hoverFocusInside = false;
			this.layer = new ChoiceButtonLayer(this);
			this.background = config.visual.backgroundImageName
				? new ChoiceButtonBackgroundSprite(config, enterPositions.background)
				: null;
			if (this.background) {
				this.layer.addChild(this.background);
			}
			this.buttons = config.choices.map((choice, index) => {
				const button = new ChoiceButtonSprite(choice, index + 1, config, confirmIndex => {
					this.queueConfirm(confirmIndex);
				}, enterPositions.buttons?.[index], candidate => this.isTopmostPointerButton(candidate));
				this.layer.addChild(button);
				return button;
			});
			this.buttons.forEach((button, index) => {
				button.setPressed(this._toggleStates[index]);
			});
			this.select(this._selectedIndex, false);
			this.publishPanelState();
		}

		update() {
			if (this._state === 'finished') return;
			if (this._state === 'closing') {
				if (this.isExitComplete()) {
					this.finishExit();
				}
				return;
			}

			if (this._state === 'opening') {
				if (this.isEnterComplete()) {
					this._state = 'active';
					this.setFocusVisual(Manager.isPanelFocused(this._config.panelId));
				}
				return;
			}

			if (this._state !== 'active') return;
			this._inputPriority.updatePointer();
			this.updateHoverFocus();
			if (!Manager.isPanelFocused(this._config.panelId)) return;
			if (Manager.isFocusInputSuppressed()) return;

			const keyboardMoved = this.updateKeyboardSelection();
			if (!keyboardMoved) {
				this.updateHoverSelection();
			}
			this.updateConfirm();
			this.updateCancel();
		}

		queueConfirm(index) {
			if (this._state !== 'active') return;
			if (!Manager.isPanelFocused(this._config.panelId)) return;
			this._queuedConfirmIndex = index;
		}

		updatePointerTarget() {
			this._pointerTargetButton = null;
			for (let index = this.buttons.length - 1; index >= 0; index--) {
				const candidate = this.buttons[index];
				if (candidate.isPointerInside()) {
					this._pointerTargetButton = candidate;
					break;
				}
			}
		}

		isTopmostPointerButton(button) {
			return this._pointerTargetButton === button;
		}

		updateHoverFocus() {
			if (!this._config.input.hoverFocus) return false;
			if (!Manager.canUseHoverFocus()) return false;
			const inside = this.isPointerInsideButtonGroup();
			if (inside === this._hoverFocusInside) return false;

			this._hoverFocusInside = inside;
			if (inside) {
				return Manager.isPanelFocused(this._config.panelId) ? false : Manager.focusPanel(this._config.panelId);
			}
			return Manager.isPanelFocused(this._config.panelId) ? Manager.clearFocus() : false;
		}

		updateHoverSelection() {
			if (!Manager.canUseHoverFocus()) return;
			if (!this._inputPriority.acceptsHover()) return;
			const hoveredButton = this.buttons.find(button => button.isHovered());
			if (hoveredButton && hoveredButton.index !== this._selectedIndex) {
				this.select(hoveredButton.index, true);
			}
		}

		updateKeyboardSelection() {
			if (this.isMouseOnly()) return false;

			let movement = 0;
			if (this._config.input.axis === 'horizontal') {
				if (Input.isRepeated('left')) movement -= 1;
				if (Input.isRepeated('right')) movement += 1;
			} else {
				if (Input.isRepeated('up')) movement -= 1;
				if (Input.isRepeated('down')) movement += 1;
			}

			if (movement !== 0) {
				this._inputPriority.preferKeyboard();
				this.moveSelection(movement);
				return true;
			}
			return false;
		}

		updateConfirm() {
			if (this._queuedConfirmIndex !== null) {
				const index = this._queuedConfirmIndex;
				this._queuedConfirmIndex = null;
				this.confirm(index);
				return;
			}

			if (!this.isMouseOnly() && Input.isTriggered('ok')) {
				this.confirm(this._selectedIndex);
			}
		}

		updateCancel() {
			if (!this._config.input.allowCancel) return;
			const cancelByMouse = TouchInput.isCancelled();
			const cancelByKey = !this.isMouseOnly() && Input.isTriggered('cancel');
			if (cancelByKey || cancelByMouse) {
				Manager.suppressMenuThisFrame();
				SoundManager.playCancel();
				Manager.clearFocus();
			}
		}

		moveSelection(delta) {
			const count = this.buttons.length;
			if (this._selectedIndex === 0) {
				this.select(delta > 0 ? 1 : count, true);
				return;
			}

			let nextIndex = this._selectedIndex + delta;

			if (this._config.input.wrap) {
				if (nextIndex < 1) nextIndex = count;
				if (nextIndex > count) nextIndex = 1;
			} else {
				nextIndex = clamp(nextIndex, 1, count);
			}

			this.select(nextIndex, nextIndex !== this._selectedIndex);
		}

		select(index, playSound) {
			this._selectedIndex = clamp(index, 0, this.buttons.length);
			this.setFocusVisual(Manager.isPanelFocused(this._config.panelId));
			this.publishPanelState();

			if (playSound) {
				SoundManager.playCursor();
			}
		}

		setFocusVisual(focused) {
			const showSelection = focused && this._state === 'active';
			this.buttons.forEach(button => {
				button.setSelected(showSelection && button.index === this._selectedIndex);
			});
		}

		confirm(index) {
			if (this._state !== 'active') return;
			const button = this.buttons[index - 1];
			if (!button) return;

			this.select(index, index !== this._selectedIndex);
			this._toggleStates[index - 1] = !this._toggleStates[index - 1];
			button.setPressed(this._toggleStates[index - 1]);
			SoundManager.playOk();

			const result = {
				type: 'toggle',
				index,
				panelId: this._config.panelId,
				value: button.choice.resultValue,
				text: button.choice.text,
				toggled: this._toggleStates[index - 1]
			};
			ResultWriter.write(this._config, result, { finishChoice: false });
			this.publishPanelState(result);

			if (button.choice.syncSwitchWithToggle) {
				setButtonSwitch(button.choice, result.toggled);
			} else {
				setButtonSwitch(button.choice, true);
			}
			const commonEventId = panelCommonEventId(button.choice, result.toggled);
			if (commonEventId > 0) {
				$gameTemp.reserveCommonEvent(commonEventId);
			}
			executeChoiceScript(button.choice.script, result);
		}

		clear(options = {}) {
			if (this._state === 'finished') return;
			if (!options.removeStore) {
				Manager.savePanelSnapshot({
					config: this._config,
					selectedIndex: this._selectedIndex,
					toggles: this._toggleStates.slice(),
					result: null
				});
			}
			this._state = 'finished';
			const state = ensureRuntimeState();
			deletePanelRecordValue(state.panels, this._config.panelId);
			if (options.removeStore) {
				Manager.removeStoredPanel(this._config.panelId);
			}
			this.destroy();
		}

		hide() {
			if (!this.isActive()) return false;
			Manager.savePanelSnapshot({
				config: this._config,
				selectedIndex: this._selectedIndex,
				toggles: this._toggleStates.slice(),
				result: null
			});
			this._state = 'closing';
			this._queuedConfirmIndex = null;
			this.setFocusVisual(false);
			const state = ensureRuntimeState();
			deletePanelRecordValue(state.panels, this._config.panelId);
			if (this.background) this.background.startExitAnimation();
			this.buttons.forEach(button => button.startExitAnimation());
			return true;
		}

		isExitComplete() {
			const backgroundComplete = !this.background || this.background.isExitComplete();
			return backgroundComplete && this.buttons.every(button => button.isExitComplete());
		}

		finishExit() {
			if (this._state !== 'closing') return;
			this._state = 'finished';
			this.destroy();
			Manager.finishExitingSession(this);
		}

		forceDestroy() {
			if (this._state === 'finished') return;
			this._state = 'finished';
			this.destroy();
		}

		focusEnterExitEnabled() {
			return !!(this._config.input.focusEnterExit ?? this._config.input.exitOnFocusLost);
		}

		focusReentryBounds() {
			const sprites = this._config.input.includeBackgroundInHover && this.background
				? [this.background, ...this.buttons]
				: this.buttons;
			return buttonGroupTargetBounds(sprites);
		}

		currentEnterPositions() {
			return {
				background: this.background ? { x: this.background.x, y: this.background.y } : null,
				buttons: this.buttons.map(button => ({ x: button.x, y: button.y }))
			};
		}

		destroy() {
			if (this.layer.parent) {
				this.layer.parent.removeChild(this.layer);
			}
			this.layer.removeChildren();
		}

		isActive() {
			return this._state === 'opening' || this._state === 'active';
		}

		isChoiceSession() {
			return false;
		}

		panelId() {
			return this._config.panelId;
		}

		inputMode() {
			return this._config.input.mode || 'always';
		}

		isMouseOnly() {
			return this.inputMode() === 'mouse';
		}

		blocksPlayerMovement() {
			return this.inputMode() === 'button';
		}

		blocksMapTouch() {
			if (this.inputMode() === 'button') return true;
			if (this.isPointerOnButton()) return true;
			return false;
		}

		blocksMenuCall() {
			return !this.isMouseOnly() || TouchInput.isCancelled();
		}

		blocksSelectableCursorInput() {
			return !this.isMouseOnly();
		}

		blocksSelectableHandlingInput() {
			return !this.isMouseOnly() || TouchInput.isCancelled();
		}

		blocksSelectableTouchInput() {
			if (!this.isMouseOnly()) return true;
			return this.isPointerOnButton();
		}

		isPointerOnButton() {
			return this.buttons.some(button => button.isPointerInside() || button.isPressed());
		}

		isPointerInsideButtonGroup() {
			const sprites = this._config.input.includeBackgroundInHover && this.background
				? [this.background, ...this.buttons]
				: this.buttons;
			return pointerInsideBounds(buttonGroupBounds(sprites), buttonGroupHoverPadding);
		}

		isEnterComplete() {
			const backgroundComplete = !this.background || this.background.isEnterComplete();
			return backgroundComplete && this.buttons.every(button => button.isEnterComplete());
		}

		publishPanelState(result = null) {
			const state = ensureRuntimeState();
			setPanelRecordValue(state.panels, this._config.panelId, {
				selectedIndex: this._selectedIndex,
				toggles: this._toggleStates.slice(),
				inputMode: this.inputMode(),
				isActive: this.isActive()
			});
			Manager.savePanelSnapshot({
				config: this._config,
				selectedIndex: this._selectedIndex,
				toggles: this._toggleStates.slice(),
				result
			});
		}
	}

	const MessageBridge = {
		_pendingConfig: null,
		_pendingOnResult: null,
		_startConfig: null,
		_startOnResult: null,
		_messageWindow: null,

		setup(config, options = {}) {
			this._pendingConfig = config;
			this._pendingOnResult = typeof options.onResult === 'function' ? options.onResult : null;
		},

		hasPending() {
			return !!this._pendingConfig;
		},

		start(messageWindow) {
			if (!this._pendingConfig) return false;
			const config = this._pendingConfig;
			const onResult = this._pendingOnResult;
			this._pendingConfig = null;
			this._pendingOnResult = null;
			this._startConfig = config;
			this._startOnResult = onResult;
			this._messageWindow = messageWindow;
			return true;
		},

		flushStart() {
			if (!this._startConfig || !this._messageWindow) return;
			const config = this._startConfig;
			const onResult = this._startOnResult;
			const messageWindow = this._messageWindow;
			this._startConfig = null;
			this._startOnResult = null;
			Manager.showChoice(config, { messageWindow, onResult });
		},

		isActiveFor(messageWindow) {
			return this._messageWindow === messageWindow && (!!this._startConfig || Manager.isChoiceActive());
		},

		finish(session) {
			const messageWindow = this._messageWindow;
			this._messageWindow = null;
			if (messageWindow && Manager.lastFinishedSession() === session) {
				messageWindow.terminateMessage();
			}
		},

		clear() {
			this._pendingConfig = null;
			this._pendingOnResult = null;
			this._startConfig = null;
			this._startOnResult = null;
			this._messageWindow = null;
		}
	};

	const consumedMessageChoiceCommands = new WeakMap();

	const markMessageChoiceCommandConsumed = (interpreter, command) => {
		if (!interpreter || !command) return;
		let commands = consumedMessageChoiceCommands.get(interpreter);
		if (!commands) {
			commands = new WeakSet();
			consumedMessageChoiceCommands.set(interpreter, commands);
		}
		commands.add(command);
	};

	const consumeMessageChoiceCommand = interpreter => {
		if (!interpreter || !interpreter.currentCommand) return false;
		const command = interpreter.currentCommand();
		const commands = consumedMessageChoiceCommands.get(interpreter);
		return !!command && !!commands && commands.has(command);
	};

	const Manager = {
		_activeSession: null,
		_finishedSession: null,
		_panelSessions: {},
		_exitingSessions: new Set(),
		_hiddenFocusPanels: {},
		_focus: { type: 'none', panelId: '' },
		_focusBeforeChoice: null,
		_focusInputSuppressedFrame: -1,
		_selectableFocusSnapshots: [],
		_selectableWindows: new Set(),
		_selectableDiscoveryRequired: false,
		_suppressMenuFrame: -1,
		_hoverFocusReady: true,

		invalidateHoverFocus() {
			this._hoverFocusReady = false;
		},

		validateHoverFocus() {
			this._hoverFocusReady = true;
		},

		canUseHoverFocus() {
			return this._hoverFocusReady;
		},

		showChoice(config, options = {}) {
			this.clearChoice({
				preserveMessageBridge: !!options.messageWindow,
				reason: 'replaced'
			});
			const scene = SceneManager._scene;
			if (!scene) return;

			const shouldAutoFocus = options.autoFocus !== false;
			this._finishedSession = null;
			this._focusBeforeChoice = this.focusedTarget();
			this._activeSession = new ChoiceButtonSession(config, session => {
				this.finishChoice(session);
				if (options.messageWindow) {
					MessageBridge.finish(session);
				}
			}, {
				onResult: options.onResult,
				onDismiss: options.onDismiss
			});
			this._activeSession.focusKey = normalizeFocusKey(options.focusKey);
			scene.addChild(this._activeSession.layer);
			if (shouldAutoFocus) {
				this.focusChoice();
			} else if (this._focus.type === 'choice') {
				this.clearFocus();
			} else {
				this.refreshFocusVisuals();
			}
		},

		clearChoice(options = {}) {
			if (!options.exitingOnly && this._activeSession) {
				this._activeSession.clear({ reason: options.reason || 'cleared' });
				this._activeSession = null;
			}
			this.clearExitingSessions(session => session.isChoiceSession());
			if (!options.exitingOnly && !options.preserveMessageBridge) {
				MessageBridge.clear();
			}
		},

		finishChoice(session) {
			if (this._activeSession === session) {
				this._activeSession = null;
			}
			this._finishedSession = session;
			if (this._focus.type === 'choice') {
				this.restoreFocusAfterChoice();
			}
		},

		restoreFocusAfterChoice() {
			const previousFocus = this._focusBeforeChoice;
			this._focusBeforeChoice = null;
			const canRestorePanel = previousFocus
				&& previousFocus.type === 'panel'
				&& (this.hasPanel(previousFocus.panelId)
					|| panelRecordValue(this._hiddenFocusPanels, previousFocus.panelId));
			if (canRestorePanel) {
				this.focusPanel(previousFocus.panelId);
			} else {
				this.clearFocus();
			}
		},

		showPanel(config, options = {}) {
			const scene = SceneManager._scene;
			if (!scene) return;

			const shouldAutoFocus = options.autoFocus !== false;
			deletePanelRecordValue(this._hiddenFocusPanels, config.panelId);
			this.clearExitingSessions(session => !session.isChoiceSession() && session.panelId() === config.panelId);
			const snapshot = this.createPanelSnapshot(config, options.savedState || this.storedPanel(config.panelId));
			this.savePanelSnapshot(snapshot);
			this.releasePanelSession(config.panelId);
			const session = new ButtonPanelSession(snapshot.config, snapshot, {
				enterPositions: options.enterPositions
			});
			session.focusKey = normalizeFocusKey(options.focusKey);
			setPanelRecordValue(this._panelSessions, config.panelId, session);
			scene.addChild(session.layer);
			if (shouldAutoFocus && !this.isChoiceActive()) {
				this.focusPanel(config.panelId);
			} else if (!shouldAutoFocus && this._focus.type === 'panel' && this._focus.panelId === config.panelId) {
				this.clearFocus();
			} else {
				this.refreshFocusVisuals();
			}
		},

		hidePanel(panelId) {
			const key = toString(panelId, 'default') || 'default';
			const session = panelRecordValue(this._panelSessions, key);
			if (session) {
				this.registerHiddenFocusPanel(session);
				if (session.hide()) this.trackExitingSession(session);
				deletePanelRecordValue(this._panelSessions, key);
			}
			this.updateFocusAfterPanelHidden(key);
		},

		hideAllPanels() {
			Object.keys(this._panelSessions).forEach(panelId => this.hidePanel(panelId));
		},

		erasePanel(panelId) {
			const key = toString(panelId, 'default') || 'default';
			const session = panelRecordValue(this._panelSessions, key);
			if (session) {
				session.clear({ removeStore: true });
				deletePanelRecordValue(this._panelSessions, key);
			} else {
				this.removeStoredPanel(key);
			}
			this.clearExitingSessions(exiting => !exiting.isChoiceSession() && exiting.panelId() === key);
			deletePanelRecordValue(this._hiddenFocusPanels, key);
			this.updateFocusAfterPanelHidden(key);
		},

		eraseAllPanels() {
			const panelIds = new Set([
				...Object.keys(this._panelSessions),
				...Object.keys(this.storedPanels()),
				...Object.keys(this._hiddenFocusPanels)
			]);
			panelIds.forEach(panelId => this.erasePanel(panelId));
			this.clearExitingSessions(session => !session.isChoiceSession());
		},

		updateFocusAfterPanelHidden(panelId) {
			if (this._focus.type === 'panel' && this._focus.panelId === panelId) {
				if (this.isChoiceActive()) {
					this.focusChoice();
				} else {
					this.clearFocus();
				}
			}
		},

		clearAll() {
			this.clearChoice();
			this.eraseAllPanels();
			this.clearFocus();
		},

		releaseScene() {
			this.clearChoice({ reason: 'scene' });
			Object.keys(this._panelSessions).forEach(panelId => this.releasePanelSession(panelId));
			this._panelSessions = {};
			this.clearExitingSessions();
			this._hiddenFocusPanels = {};
			this.clearFocus();
			this._selectableWindows.clear();
			this._selectableDiscoveryRequired = false;
		},

		releasePanelSession(panelId) {
			const key = toString(panelId, 'default') || 'default';
			const session = panelRecordValue(this._panelSessions, key);
			if (!session) return;
			session.clear({ removeStore: false });
			deletePanelRecordValue(this._panelSessions, key);
		},

		trackExitingSession(session) {
			if (session) this._exitingSessions.add(session);
		},

		finishExitingSession(session) {
			this._exitingSessions.delete(session);
		},

		clearExitingSessions(predicate = null) {
			[...this._exitingSessions].forEach(session => {
				if (predicate && !predicate(session)) return;
				session.forceDestroy();
				this._exitingSessions.delete(session);
			});
		},

		registerHiddenFocusPanel(session) {
			const key = session.panelId();
			if (!session.focusEnterExitEnabled()) {
				deletePanelRecordValue(this._hiddenFocusPanels, key);
				return;
			}
			const bounds = session.focusReentryBounds();
			setPanelRecordValue(this._hiddenFocusPanels, key, {
				focusKey: normalizeFocusKey(session.focusKey),
				bounds,
				hoverArmed: !this.canUseHoverFocus()
					|| !bounds
					|| !pointerInsideBounds(bounds, buttonGroupHoverPadding)
			});
		},

		exitingPanelPositions(panelId) {
			const session = [...this._exitingSessions].find(candidate => {
				return !candidate.isChoiceSession() && candidate.panelId() === panelId;
			});
			return session ? session.currentEnterPositions() : null;
		},

		reactivateHiddenPanel(panelId) {
			const key = toString(panelId, 'default') || 'default';
			const entry = panelRecordValue(this._hiddenFocusPanels, key);
			const savedState = this.storedPanel(key);
			if (!entry || !savedState || !savedState.config) return false;
			const enterPositions = this.exitingPanelPositions(key);
			deletePanelRecordValue(this._hiddenFocusPanels, key);
			this.showPanel(savedState.config, {
				savedState,
				autoFocus: false,
				focusKey: entry.focusKey,
				enterPositions
			});
			return this.focusPanel(key);
		},

		restorePanel(panelId) {
			const key = toString(panelId, 'default') || 'default';
			const savedState = this.storedPanel(key);
			if (!savedState || !savedState.config) return false;
			const entry = panelRecordValue(this._hiddenFocusPanels, key);
			this.showPanel(savedState.config, {
				savedState,
				focusKey: entry ? entry.focusKey : '',
				enterPositions: this.exitingPanelPositions(key)
			});
			return true;
		},

		restoreAllPanels() {
			let restored = false;
			Object.keys(this.storedPanels()).forEach(panelId => {
				restored = this.restorePanel(panelId) || restored;
			});
			return restored;
		},

		storedPanels() {
			return ensurePersistentState().panels;
		},

		storedPanel(panelId) {
			const key = toString(panelId, 'default') || 'default';
			return panelRecordValue(this.storedPanels(), key) || null;
		},

		createPanelSnapshot(config, savedState = null) {
			const savedToggles = savedState && Array.isArray(savedState.toggles) ? savedState.toggles : [];
			const canReuseToggles = savedToggles.length === config.choices.length;
			return {
				config,
				selectedIndex: clamp(
					savedState ? toNumber(savedState.selectedIndex, config.input.initialIndex) : config.input.initialIndex,
					0,
					config.choices.length
				),
				toggles: config.choices.map((_, index) => canReuseToggles && !!savedToggles[index]),
				result: savedState && savedState.result ? savedState.result : null
			};
		},

		savePanelSnapshot(snapshot) {
			const key = snapshot.config.panelId;
			const stored = this.storedPanel(key);
			const result = snapshot.result !== null && snapshot.result !== undefined
				? snapshot.result
				: stored && stored.result
					? stored.result
					: null;
			setPanelRecordValue(this.storedPanels(), key, {
				config: snapshot.config,
				selectedIndex: snapshot.selectedIndex,
				toggles: Array.isArray(snapshot.toggles) ? snapshot.toggles.slice() : [],
				result
			});
		},

		removeStoredPanel(panelId) {
			const key = toString(panelId, 'default') || 'default';
			deletePanelRecordValue(this.storedPanels(), key);
			const state = ensureRuntimeState();
			deletePanelRecordValue(state.panels, key);
			deletePanelRecordValue(state.panelResults, key);
		},

		setFocus(target, panelId = '') {
			if (target === 'choice' && this.isChoiceActive()) {
				this.applyFocus({ type: 'choice', panelId: '' });
				return true;
			}

			const key = toString(panelId, 'default') || 'default';
			if (target === 'panel') {
				if (this.hasPanel(key)) {
					this.applyFocus({ type: 'panel', panelId: key });
					return true;
				}
				if (panelRecordValue(this._hiddenFocusPanels, key)) {
					return this.reactivateHiddenPanel(key);
				}
			}

			this.applyFocus({ type: 'none', panelId: '' });
			return target === 'none';
		},

		focusChoice() {
			return this.setFocus('choice');
		},

		focusPanel(panelId) {
			return this.setFocus('panel', panelId);
		},

		clearFocus() {
			return this.setFocus('none');
		},

		applyFocus(focus) {
			const previousFocus = this.focusedTarget();
			const previousPanelSession = previousFocus.type === 'panel'
				? panelRecordValue(this._panelSessions, previousFocus.panelId)
				: null;
			const nextFocus = {
				type: focus.type || 'none',
				panelId: focus.panelId || ''
			};
			const changed = this._focus.type !== nextFocus.type || this._focus.panelId !== nextFocus.panelId;
			this._focus = {
				type: nextFocus.type,
				panelId: nextFocus.panelId
			};
			if (changed) {
				this._selectableDiscoveryRequired = this._focus.type !== 'none';
				if (this._focus.type !== 'none') {
					this._focusInputSuppressedFrame = Graphics.frameCount;
				}
			}
			ensureRuntimeState().focus = this.focusedTarget();
			this.refreshFocusVisuals();
			this.syncSelectableFocus();
			if (changed
				&& previousPanelSession
				&& previousPanelSession.focusEnterExitEnabled()
				&& (nextFocus.type !== 'panel' || nextFocus.panelId !== previousFocus.panelId)) {
				this.hidePanel(previousFocus.panelId);
			}
		},

		focusedTarget() {
			return {
				type: this._focus.type,
				panelId: this._focus.panelId
			};
		},

		refreshFocusVisuals() {
			if (this._activeSession) {
				this._activeSession.setFocusVisual(this.isChoiceFocused());
			}
			Object.keys(this._panelSessions).forEach(panelId => {
				const session = panelRecordValue(this._panelSessions, panelId);
				session.setFocusVisual(this.isPanelFocused(panelId));
			});
		},

		updateFocusTriggers() {
			if (this._activeSession && this._activeSession.isActive()) {
				const focusKey = normalizeFocusKey(this._activeSession.focusKey);
				if (focusKey && Input.isTriggered(focusKey)) {
					if (!this.isChoiceFocused()) {
						this.focusChoice();
					}
					return true;
				}
			}

			const panelIds = Object.keys(this._panelSessions);
			for (const panelId of panelIds) {
				const session = panelRecordValue(this._panelSessions, panelId);
				if (!session || !session.isActive()) continue;
				const focusKey = normalizeFocusKey(session.focusKey);
				if (focusKey && Input.isTriggered(focusKey)) {
					if (!this.isPanelFocused(panelId)) {
						this.focusPanel(panelId);
					}
					return true;
				}
			}

			const hiddenPanelIds = Object.keys(this._hiddenFocusPanels);
			for (const panelId of hiddenPanelIds) {
				const entry = panelRecordValue(this._hiddenFocusPanels, panelId);
				if (!entry) continue;
				const focusKey = normalizeFocusKey(entry.focusKey);
				if (focusKey && Input.isTriggered(focusKey)) {
					return this.reactivateHiddenPanel(panelId);
				}
				const savedState = this.storedPanel(panelId);
				if (!savedState?.config?.input?.hoverFocus || !entry.bounds) continue;
				if (!this.canUseHoverFocus()) continue;
				const inside = pointerInsideBounds(entry.bounds, buttonGroupHoverPadding);
				if (!entry.hoverArmed) {
					if (!inside) entry.hoverArmed = true;
					continue;
				}
				if (inside) {
					return this.reactivateHiddenPanel(panelId);
				}
			}
			return false;
		},

		isChoiceActive() {
			return !!this._activeSession && this._activeSession.isActive();
		},

		isChoiceFocused() {
			return this._focus.type === 'choice' && this.isChoiceActive();
		},

		currentFocus() {
			return this.focusedTarget();
		},

		focusedChoiceSession() {
			return this.isChoiceFocused() ? this._activeSession : null;
		},

		isPanelFocused(panelId) {
			return this._focus.type === 'panel' && this._focus.panelId === panelId && this.hasPanel(panelId);
		},

		focusedPanelSession() {
			if (this._focus.type !== 'panel') return null;
			const session = panelRecordValue(this._panelSessions, this._focus.panelId);
			return session && session.isActive() ? session : null;
		},

		focusedInputSession() {
			return this.focusedChoiceSession() || this.focusedPanelSession();
		},

		shouldHideSelectableFocus() {
			const session = this.focusedInputSession();
			return !!session && (session.blocksSelectableCursorInput() || session.blocksSelectableHandlingInput());
		},

		syncSelectableFocus() {
			if (this.shouldHideSelectableFocus()) {
				this.hideSelectableFocus();
			} else {
				this.restoreSelectableFocus();
			}
		},

		registerSelectableWindow(window) {
			if (window) this._selectableWindows.add(window);
		},

		discoverSelectableWindows() {
			sceneSelectableWindows().forEach(window => this.registerSelectableWindow(window));
			this._selectableDiscoveryRequired = false;
		},

		registeredSelectableWindows() {
			const scene = SceneManager._scene;
			if (!scene) return [];
			const windows = [];
			this._selectableWindows.forEach(window => {
				if (!window || window._destroyed) {
					this._selectableWindows.delete(window);
					return;
				}
				if (belongsToScene(window, scene)) windows.push(window);
			});
			return windows;
		},

		hideSelectableFocus() {
			if (this._selectableDiscoveryRequired) {
				this.discoverSelectableWindows();
			}
			const windows = this.registeredSelectableWindows().filter(isActiveSelectableWindow);
			windows.forEach(window => {
				if (!this._selectableFocusSnapshots.some(snapshot => snapshot.window === window)) {
					this._selectableFocusSnapshots.push({
						window,
						index: window.index()
					});
				}
				if (typeof window.deselect === 'function') {
					window.deselect();
				} else if (typeof window.select === 'function') {
					window.select(-1);
				}
			});
		},

		restoreSelectableFocus() {
			const snapshots = this._selectableFocusSnapshots;
			this._selectableFocusSnapshots = [];
			snapshots.forEach(snapshot => {
				const window = snapshot.window;
				if (!window || !window.parent || window._destroyed) return;
				if (typeof window.select !== 'function') return;
				const maxItems = typeof window.maxItems === 'function' ? window.maxItems() : 0;
				if (maxItems <= 0) return;
				window.select(clamp(snapshot.index, 0, maxItems - 1));
			});
		},

		isFocusInputSuppressed() {
			return this._focusInputSuppressedFrame === Graphics.frameCount;
		},

		blocksSelectableCursorInput() {
			const session = this.focusedInputSession();
			return !!session && (this.isFocusInputSuppressed() || session.blocksSelectableCursorInput());
		},

		blocksSelectableHandlingInput() {
			const session = this.focusedInputSession();
			return !!session && (this.isFocusInputSuppressed() || session.blocksSelectableHandlingInput());
		},

		blocksSelectableTouchInput() {
			const session = this.focusedInputSession();
			return !!session && session.blocksSelectableTouchInput();
		},

		blocksPlayerMovement() {
			const choiceSession = this.focusedChoiceSession();
			if (choiceSession && choiceSession.blocksPlayerMovement()) return true;
			const session = this.focusedPanelSession();
			return !!session && session.blocksPlayerMovement();
		},

		blocksMapTouch() {
			const choiceSession = this.focusedChoiceSession();
			if (choiceSession && choiceSession.blocksMapTouch()) return true;
			const session = this.focusedPanelSession();
			return !!session && session.blocksMapTouch();
		},

		blocksMenuCall() {
			const session = this.focusedInputSession();
			return this.isMenuSuppressed()
				|| (!!session && (this.isFocusInputSuppressed() || session.blocksMenuCall()));
		},

		suppressMenuThisFrame() {
			this._suppressMenuFrame = Graphics.frameCount;
		},

		isMenuSuppressed() {
			return this._suppressMenuFrame === Graphics.frameCount;
		},

		hasPanel(panelId) {
			const session = panelRecordValue(this._panelSessions, panelId);
			return !!session && session.isActive();
		},

		panelResult(panelId) {
			const key = toString(panelId, 'default') || 'default';
			const runtimeResult = panelRecordValue(ensureRuntimeState().panelResults, key);
			if (runtimeResult) return runtimeResult;
			const stored = this.storedPanel(key);
			return stored && stored.result ? stored.result : null;
		},

		panelState(panelId) {
			const key = toString(panelId, 'default') || 'default';
			const runtimeState = panelRecordValue(ensureRuntimeState().panels, key);
			if (runtimeState) return runtimeState;
			const stored = this.storedPanel(key);
			if (!stored) return null;
			return {
				selectedIndex: stored.selectedIndex,
				toggles: Array.isArray(stored.toggles) ? stored.toggles.slice() : [],
				inputMode: stored.config && stored.config.input ? stored.config.input.mode : 'always',
				isActive: false,
				isStored: true
			};
		},

		lastFinishedSession() {
			return this._finishedSession;
		}
	};

	const _DataManager_loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		_DataManager_loadDatabase.call(this);
		PresetStore.load();
	};

	const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
	DataManager.isDatabaseLoaded = function() {
		return _DataManager_isDatabaseLoaded.call(this) && PresetStore.isLoaded();
	};

	PluginManager.registerCommand(pluginName, 'showChoicePreset', function(args) {
		const config = parseChoicePresetConfig(args);
		if (!config) return;
		Manager.showChoice(config);
		this.setWaitMode(waitMode);
	});

	PluginManager.registerCommand(pluginName, 'clearChoiceButtons', function() {
		Manager.clearChoice();
	});

	PluginManager.registerCommand(pluginName, 'showButtonPanelPreset', function(args) {
		const config = parsePanelPresetConfig(args);
		if (config) Manager.showPanel(config);
	});

	PluginManager.registerCommand(pluginName, 'hideButtonPanel', function(args) {
		Manager.hidePanel(args.panelId);
	});

	PluginManager.registerCommand(pluginName, 'hideAllButtonPanels', function() {
		Manager.hideAllPanels();
	});

	PluginManager.registerCommand(pluginName, 'eraseButtonPanel', function(args) {
		Manager.erasePanel(args.panelId);
	});

	PluginManager.registerCommand(pluginName, 'eraseAllButtonPanels', function() {
		Manager.eraseAllPanels();
	});

	PluginManager.registerCommand(pluginName, 'restoreButtonPanel', function(args) {
		Manager.restorePanel(args.panelId);
	});

	PluginManager.registerCommand(pluginName, 'restoreAllButtonPanels', function() {
		Manager.restoreAllPanels();
	});

	PluginManager.registerCommand(pluginName, 'setButtonFocus', function(args) {
		Manager.setFocus(toString(args.target, 'none'), args.panelId);
	});

	window.addEventListener('blur', () => {
		Manager.invalidateHoverFocus();
	});

	document.addEventListener('mousemove', event => {
		const x = Graphics.pageToCanvasX(event.pageX);
		const y = Graphics.pageToCanvasY(event.pageY);
		if (Graphics.isInsideCanvas(x, y)) {
			Manager.validateHoverFocus();
		}
	});

	const _Scene_Base_start = Scene_Base.prototype.start;
	Scene_Base.prototype.start = function() {
		_Scene_Base_start.apply(this, arguments);
		const sceneName = this.constructor.name;
		autoShowPresets
			.filter(entry => entry.sceneName === sceneName)
			.forEach(entry => showAutoPreset(entry, sceneName));
	};

	const _Scene_Base_update = Scene_Base.prototype.update;
	Scene_Base.prototype.update = function() {
		Manager.updateFocusTriggers();
		_Scene_Base_update.apply(this, arguments);
		Manager.syncSelectableFocus();
	};

	const _Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		_Scene_Map_update.apply(this, arguments);
		MessageBridge.flushStart();
	};

	const _Scene_Battle_update = Scene_Battle.prototype.update;
	Scene_Battle.prototype.update = function() {
		_Scene_Battle_update.apply(this, arguments);
		MessageBridge.flushStart();
	};

	const isShowChoicePresetCommand = command => {
		if (!command || command.code !== 357) return false;
		const params = command.parameters;
		return Utils.extractFileName(params[0]) === pluginName
			&& params[1] === 'showChoicePreset';
	};

	const parseMessageChoiceConfig = command => {
		const args = command.parameters[3];
		return parseChoicePresetConfig(args);
	};

	const canAttachToMessage = () => {
		return !$gameMessage.isChoice() && !$gameMessage.isNumberInput() && !$gameMessage.isItemChoice();
	};

	const setupChoiceReplacement = (interpreter, params, options = {}) => {
		const rule = findChoiceReplacementRule(params);
		if (!rule) return false;

		try {
			const config = createChoiceReplacementConfig(params, rule);
			if (!config) return false;
			const onResult = result => {
				interpreter._branch[interpreter._indent] = eventChoiceBranchValue(params, result);
			};
			if (options.attachToMessage) {
				MessageBridge.setup(config, { onResult });
			} else {
				Manager.showChoice(config, { onResult });
				interpreter.setWaitMode(waitMode);
			}
			return true;
		} catch (error) {
			console.warn(`${pluginName}: failed to replace Show Choices with preset "${rule.presetId}".`, error);
			return false;
		}
	};

	const _Game_Interpreter_setupChoices = Game_Interpreter.prototype.setupChoices;
	Game_Interpreter.prototype.setupChoices = function(params) {
		if (!this._mmChoiceButtonExBypassChoiceReplacement) {
			const attachToMessage = $gameMessage && $gameMessage.hasText && $gameMessage.hasText();
			if (setupChoiceReplacement(this, params, { attachToMessage })) {
				return;
			}
		}
		_Game_Interpreter_setupChoices.call(this, params);
	};

	const _Game_Interpreter_command102 = Game_Interpreter.prototype.command102;
	Game_Interpreter.prototype.command102 = function(params) {
		if ($gameMessage.isBusy()) {
			return false;
		}
		if (setupChoiceReplacement(this, params, { attachToMessage: false })) {
			return true;
		}
		this._mmChoiceButtonExBypassChoiceReplacement = true;
		try {
			return _Game_Interpreter_command102.call(this, params);
		} finally {
			this._mmChoiceButtonExBypassChoiceReplacement = false;
		}
	};

	const _Game_Interpreter_command101 = Game_Interpreter.prototype.command101;
	Game_Interpreter.prototype.command101 = function(params) {
		const result = _Game_Interpreter_command101.call(this, params);
		if (result && canAttachToMessage()) {
			const nextCommand = this._list[this._index + 1];
			if (isShowChoicePresetCommand(nextCommand)) {
				markMessageChoiceCommandConsumed(this, nextCommand);
				const config = parseMessageChoiceConfig(nextCommand);
				if (config) MessageBridge.setup(config);
			}
		}
		return result;
	};

	const _Game_Interpreter_command357 = Game_Interpreter.prototype.command357;
	Game_Interpreter.prototype.command357 = function(params) {
		if (consumeMessageChoiceCommand(this) && isShowChoicePresetCommand(this.currentCommand())) {
			return true;
		}
		return _Game_Interpreter_command357.call(this, params);
	};

	const _Window_Message_startInput = Window_Message.prototype.startInput;
	Window_Message.prototype.startInput = function() {
		if (_Window_Message_startInput.call(this)) {
			return true;
		}
		if (MessageBridge.hasPending()) {
			return MessageBridge.start(this);
		}
		return false;
	};

	const _Window_Message_updateInput = Window_Message.prototype.updateInput;
	Window_Message.prototype.updateInput = function() {
		if (MessageBridge.isActiveFor(this)) {
			return true;
		}
		return _Window_Message_updateInput.call(this);
	};

	const _Window_Message_checkToNotClose = Window_Message.prototype.checkToNotClose;
	Window_Message.prototype.checkToNotClose = function() {
		_Window_Message_checkToNotClose.call(this);
		if (this.isOpen() && this.isClosing() && MessageBridge.isActiveFor(this)) {
			this.open();
		}
	};

	const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
	Game_Interpreter.prototype.updateWaitMode = function() {
		if (this._waitMode === waitMode) {
			const waiting = Manager.isChoiceActive();
			if (!waiting) {
				this._waitMode = '';
			}
			return waiting;
		}
		return _Game_Interpreter_updateWaitMode.call(this);
	};

	const _Window_Selectable_initialize = Window_Selectable.prototype.initialize;
	Window_Selectable.prototype.initialize = function() {
		_Window_Selectable_initialize.apply(this, arguments);
		Manager.registerSelectableWindow(this);
	};

	const _Window_Selectable_processCursorMove = Window_Selectable.prototype.processCursorMove;
	Window_Selectable.prototype.processCursorMove = function() {
		if (Manager.blocksSelectableCursorInput()) return;
		_Window_Selectable_processCursorMove.apply(this, arguments);
	};

	const _Window_Selectable_processHandling = Window_Selectable.prototype.processHandling;
	Window_Selectable.prototype.processHandling = function() {
		if (Manager.blocksSelectableHandlingInput()) return;
		_Window_Selectable_processHandling.apply(this, arguments);
	};

	const _Window_Selectable_processTouch = Window_Selectable.prototype.processTouch;
	Window_Selectable.prototype.processTouch = function() {
		if (Manager.blocksSelectableTouchInput()) return;
		_Window_Selectable_processTouch.apply(this, arguments);
	};

	if (typeof Window_Scrollable !== 'undefined' && Window_Scrollable.prototype.processWheelScroll) {
		const _Window_Scrollable_processWheelScroll = Window_Scrollable.prototype.processWheelScroll;
		Window_Scrollable.prototype.processWheelScroll = function() {
			if (Manager.blocksSelectableTouchInput()) return;
			_Window_Scrollable_processWheelScroll.apply(this, arguments);
		};
	}

	if (typeof Window_Scrollable !== 'undefined' && Window_Scrollable.prototype.processTouchScroll) {
		const _Window_Scrollable_processTouchScroll = Window_Scrollable.prototype.processTouchScroll;
		Window_Scrollable.prototype.processTouchScroll = function() {
			if (Manager.blocksSelectableTouchInput()) return;
			_Window_Scrollable_processTouchScroll.apply(this, arguments);
		};
	}

	const _Game_Player_canMove = Game_Player.prototype.canMove;
	Game_Player.prototype.canMove = function() {
		if (Manager.blocksPlayerMovement()) {
			return false;
		}
		return _Game_Player_canMove.call(this);
	};

	const _Scene_Map_isAnyButtonPressed = Scene_Map.prototype.isAnyButtonPressed;
	Scene_Map.prototype.isAnyButtonPressed = function() {
		return _Scene_Map_isAnyButtonPressed.call(this) || Manager.blocksMapTouch();
	};

	const _Scene_Map_isMenuCalled = Scene_Map.prototype.isMenuCalled;
	Scene_Map.prototype.isMenuCalled = function() {
		if (Manager.blocksMenuCall()) {
			return false;
		}
		return _Scene_Map_isMenuCalled.call(this);
	};

	const _Scene_Base_terminate = Scene_Base.prototype.terminate;
	Scene_Base.prototype.terminate = function() {
		Manager.releaseScene();
		_Scene_Base_terminate.call(this);
	};

	window.MMChoiceButtonEx = {
		Manager,
		parseChoicePresetConfig,
		parsePanelPresetConfig,
		PresetStore,
		showChoice(config, options) {
			if (config) Manager.showChoice(config, options || {});
		},
		clearChoice(options) {
			Manager.clearChoice(options || {});
		},
		isChoiceActive() {
			return Manager.isChoiceActive();
		},
		currentFocus() {
			return Manager.currentFocus();
		},
		showChoicePreset(args) {
			const config = parseChoicePresetConfig(args || {});
			if (config) Manager.showChoice(config);
		},
		showButtonPanelPreset(args) {
			const config = parsePanelPresetConfig(args || {});
			if (config) Manager.showPanel(config);
		},
		hideButtonPanel(panelId) {
			Manager.hidePanel(panelId);
		},
		hideAllButtonPanels() {
			Manager.hideAllPanels();
		},
		eraseButtonPanel(panelId) {
			Manager.erasePanel(panelId);
		},
		eraseAllButtonPanels() {
			Manager.eraseAllPanels();
		},
		restoreButtonPanel(panelId) {
			return Manager.restorePanel(panelId);
		},
		restoreAllButtonPanels() {
			return Manager.restoreAllPanels();
		},
		focusChoice() {
			return Manager.focusChoice();
		},
		focusPanel(panelId) {
			return Manager.focusPanel(panelId);
		},
		clearFocus() {
			return Manager.clearFocus();
		},
		setFocus(target, panelId) {
			return Manager.setFocus(target, panelId);
		},
		panelResult(panelId) {
			return Manager.panelResult(panelId);
		},
		panelState(panelId) {
			return Manager.panelState(panelId);
		}
	};
})();
