/*:
 * @target MZ
 * @plugindesc Displays dynamic bubble messages above speaking characters without using escape codes.
 * @author Sang Hendrix
 * @url https://sanghendrix.itch.io/
 * 
 * @help
 * Verion 1.3.3
 * ----------------------------------------------------------------------------
 * A dynamic message system plugin for RPG Maker MZ that transforms your game's 
 * dialogue into automatic bubble messages. Simply match the event name with the 
 * message's Namebox, and the plugin handles everything else - no escape codes or 
 * manual positioning needed!
 * ----------------------------------------------------------------------------
 * FEATURES
 * - Bubble messages automatically display on the speaking event without using escape codes
 * - Display bubble messages on any event, any follower or game player
 * - Smart positioning: Bubble message will never be cropped from the viewport
 *   if the speaking event is near the edge
 * - Auto sizing and auto wrap. Write your dialogues without any worry of the text being cropped.
 * - Completely overhauled the choice system, including a smart feature to auto-adjust
 *   its position to avoid overlapping the game player. The star shouldn't be covered!
 * - New bubble animations and choice animations. More will be added!
 * - The game's camera can move to the speaking event
 * - The traditional message system is untouched in case you need it
 * - Highly customizable: Fonts, size, outline, window skins, face size,  etc,
 *   for bubble message, normal message, and choice system. Design the way your bubble looks
 * - An awesome dev who will support you 24/7
 * - And a lot more!
 * ----------------------------------------------------------------------------
 * HOW TO USE
 * To display bubble on game player (party leader)
 *       -> Namebox: write  player
 * To display bubble on a follower (party member)
 *       -> Namebox: write  follower: Name of the member or their id
 *          e.g. follower: Roza | follower: 2
 * To display bubble on events automatically, match it with the event name.
 *        -> Event name: Kara Ha
 *           Message Namebox: Kara Ha
 * To manually display bubble on a specific event ID
 *       -> Namebox: Name to display (event ID)
 *          e.g. Danial (event 3) -> Display bubble on event ID 3
 * 
 * Empty Namebox will result in default message system (cuz nobody is talking)
 * ----------------------------------------------------------------------------
 * For feedback or feature request, please dm me on X or Facebook:
 * https://x.com/sanghendrix96
 * Discord: https://discord.gg/YKPscqHV8b
 * 
 * @command Set Bubble Status
 * @text Set Bubble Messages Status
 * @desc Enable or disable bubble messages
 * 
 * @arg Status
 * @type boolean
 * @text Enable Bubble Messages
 * @desc Enable or disable bubble messages functionality
 * @default true
 * 
 * @command Camera Focus
 * @text Camera Focus To
 * @desc Manually Focus the camera on a target (event name or "player")
 *
 * @arg Target
 * @type string
 * @text Target
 * @desc The target to focus on. Use event name or "player"
 * 
 * @command Force Bubble Position
 * @text Force Bubble Position
 * @desc Force the message bubble to appear at a specific position
 *
 * @arg Force
 * @type boolean
 * @text Force Bubble Position
 * @desc Enable/disable forced bubble position
 * @default false
 *
 * @arg Position
 * @type string
 * @text Position (x, y)
 * @desc Position in format "x, y". Example: "100, 200" or "Graphics.boxWidth / 2, 200"
 * 
 * @command Change Bubble Windowskin
 * @text Change Bubble Windowskin
 * @desc Changes the windowskin used for message bubbles
 *
 * @arg filename
 * @type file
 * @dir img/system
 * @text Windowskin File
 * @desc Select a windowskin file from the system folder
 * @default Window
 * 
 * 
 * 
 * 
 * @param -
 * @text __ BUBBLE MESSAGE _______
 * 
 * @param Manual Word Wrap
 * @text Manual Word Wrap
 * @desc Preserves line breaks from the message editor. If false, combines all text into one line for auto-wrap
 * @default false
 * @type boolean
 * 
 * @param Vertical Adjustment
 * @desc Fine-tune the vertical position of the bubble (negative moves up)
 * @default auto
 * @type string
 * 
 * @param Max Width
 * @desc Maximum width for the bubble (leave empty for no limit)
 * @default 400
 * @type number
 * 
 * @param Max Row
 * @desc Maximum number of row for each bubble
 * @default 4
 * @type number
 * @min 1
 * @max 4
 * 
 * @param Message Font File
 * @text Custom Message Font
 * @desc Font file to use for message text (must be in fonts folder). e.g., abc.ttf or abc.otf
 * @type string
 * @default
 * 
 * @param Message Font Size
 * @text Message Font Size
 * @desc Font size for the message text
 * @default
 * @type number
 * 
 * @param Message Font Color
 * @text Message Font Color
 * @desc Hex color code for message text (e.g., #ffffff for white)
 * @default
 * 
 * @param Message Outline
 * @text Enable Message Outline
 * @desc Enable or disable text outline in message window
 * @default true
 * @type boolean
 * 
 * @param Message Outline Color
 * @text Message Outline Color
 * @desc Hex color code for text outline (e.g., #000000 for black)
 * @default
 * 
 * @param Message Line Height
 * @text Message Line Height
 * @desc Height between lines in the message window (empty = 36)
 * @default
 * @type number
 * 
 * @param WindowSkin
 * @text Custom Window Skin
 * @desc The window skin image file to use from img/system folder. Leave empty to use default.
 * @default 
 * @dir img/system/
 * @type file
 * 
 * @param -sd
 * @text ---------------------------
 * 
 * @param --------
 * @text __ NORMAL MESSAGE _______
 * 
 * @param Normal Message Wrap
 * @text Normal Message Wrap
 * @desc Auto Wrap Normal Message
 * @default false
 * @type boolean
 * 
 * @param Normal Message Width
 * @text Normal Message Width
 * @desc Set the width of normal messages
 * @default
 * @type number
 * 
 * @param Normal Message Row
 * @text Normal Message Row Count
 * @desc Set the row count for normal messages (1-4)
 * @default 4
 * @type number
 * @min 1
 * @max 4
 * 
 * @param Normal Message Y Offset
 * @text Normal Message Y Offset
 * @desc Adjust the vertical position of normal messages (negative moves up)
 * @default 0
 * @type number
 * @min -9999
 * 
 * @param Normal Message Font File
 * @text Normal Message Font File
 * @desc Font file to use for normal messages (must be in fonts folder). Leave empty for default font.
 * @type string
 * 
 * @param Normal Message Font Size
 * @text Normal Message Font Size
 * @desc Font size for normal messages
 * @default
 * @type number
 * 
 * @param Normal Message Font Color
 * @text Normal Message Font Color
 * @desc Hex color code for normal message text (e.g., #ffffff for white)
 * @default 
 * 
 * @param Normal Message Outline
 * @text Enable Normal Message Outline
 * @desc Enable or disable text outline in normal messages
 * @default true
 * @type boolean
 * 
 * @param Normal Message Outline Color
 * @text Normal Message Outline Color
 * @desc Hex color code for normal message outline (e.g., #000000 for black)
 * @default
 * 
 * @param -sds
 * @text ---------------------------
 * 
 * @param ----------
 * @text __ NAMEBOX _____________
 * 
 * @param Namebox Position X
 * @text Namebox Position
 * @desc Set the horizontal position of the namebox relative to the message window
 * @type select
 * @option Left
 * @value left
 * @option Center
 * @value center
 * @option Right
 * @value right
 * @default left
 * 
 * @param Namebox Position Y
 * @text Namebox Y Offset
 * @desc Adjust the vertical position of the namebox (negative moves up)
 * @default 0
 * @type number
 * @min -9999
 * 
 * @param Namebox Font File
 * @text Custom Namebox Font
 * @desc Font file to use for namebox text (must be in fonts folder). Leave empty to use game font.
 * @type string
 * 
 * @param Namebox Font Size
 * @text Namebox Font Size
 * @desc Font size for the namebox text. 0 to disable Namebox text
 * @default 20
 * @type number
 * 
 * @param Namebox Font Color
 * @text Namebox Font Color
 * @desc Hex color code for namebox text (e.g., #ffffff for white)
 * @default
 * 
 * @param Namebox Outline
 * @text Enable Namebox Outline
 * @desc Enable or disable text outline in namebox
 * @default true
 * @type boolean
 * 
 * @param Namebox Outline Color
 * @text Namebox Outline Color
 * @desc Hex color code for namebox text outline (e.g., #000000 for black)
 * @default
 * 
 * @param -sdz
 * @text ---------------------------
 * 
 * @param -------
 * @text __ FACE ________________
 * 
 * @param Face Size
 * @text Bubble Message Face Scale
 * @desc Scale factor for face images in bubble messages (1 = 100%, 0.5 = 50%, etc.)
 * @default 0.5
 * @type number
 * @min 0.1
 * @decimals 2
 * 
 * @param Normal Face Scale
 * @text Normal Message Face Scale
 * @desc Scale factor for face images in normal messages (1 = 100%, 0.5 = 50%, etc.)
 * @default 1
 * @type number
 * @min 0.1
 * @decimals 2
 * 
 * @param -sdc
 * @text ---------------------------
 * 
 * @param ----b---
 * @text __ CHOICE LIST _________
 * 
 * @param Choice Text Align
 * @text Choice Text Alignment
 * @desc Alignment of text in choice buttons
 * @type select
 * @option Left
 * @value left
 * @option Center
 * @value center
 * @option Right
 * @value right
 * @default center
 * 
 * @param Choice List Style
 * @text Choice List Style
 * @desc Choose how choices are arranged
 * @type select
 * @option Horizontal (2 columns)
 * @value horizontal
 * @option Vertical (1 column)
 * @value vertical
 * @default horizontal
 * 
 * @param Choice Font File
 * @text Custom Choice Font
 * @desc Font file to use for choice text (must be in fonts folder). Leave empty for default font.
 * @type string
 * 
 * @param Choice Font Size
 * @text Choice Font Size
 * @desc Font size for the choice text
 * @default
 * @type number
 * 
 * @param Choice Font Color
 * @text Choice Font Color
 * @desc Hex color code for choice text (e.g., #ffffff for white)
 * @default
 * 
 * @param Choice Font Outline
 * @text Enable Choice Outline
 * @desc Enable or disable text outline in choices
 * @default true
 * @type boolean
 * 
 * @param Choice Font Outline Color
 * @text Choice Outline Color
 * @desc Hex color code for choice text outline (e.g., #000000 for black)
 * @default
 * 
 * @param Choice Animation
 * @text Choice Window Animation
 * @desc Choose the animation style for the choice window
 * @type select
 * @option Default
 * @value default
 * @option Move to Scene
 * @value moveToScene
 * @default moveToScene
 * 
 * @param Choice Windowskin
 * @text Custom Choice Window Skin
 * @desc The window skin image file to use for choice lists from img/system folder
 * @default 
 * @dir img/system/
 * @type file
 * 
 * @param Choice Window Y
 * @text Choice Window Y Position
 * @desc Y position of choice window
 * @type string
 * @default Graphics.boxHeight - 170
 * 
 * @param Choice Auto Position
 * @text Auto Position Choices
 * @desc Automatically position choices to avoid overlapping with the player, bubbles, and normal messages
 * @type boolean
 * @default true
 * 
 * @param Choice Space
 * @text Choice Spacing
 * @desc Space between each choice item (in pixels)
 * @type number
 * @min 0
 * @default 4
 * 
 * @param Choice Width
 * @text Choice Window Width
 * @desc Width of the choice window (in pixels, empty for auto sizing)
 * @type number
 * @default
 * 
 * @param Choice Height
 * @text Choice Item Height
 * @desc Height of each choice item (in pixels)
 * @type number
 * @default 36
 * 
 * @param -sdzz
 * @text ---------------------------
 * 
 * @param ---f---
 * @text __ MESSAGE SFX _________
 * 
 * @param Message Start SFX
 * @text Message Start Sound
 * @desc Sound effect to play when message starts.
 * @dir audio/se/
 * @type file
 * 
 * @param Message SFX Volume
 * @text Message Start Volume
 * @desc Volume of the message start sound effect. Use "x - y" format for random range (e.g., "50 - 100")
 * @default 45
 * @type string
 * 
 * @param Message SFX Pitch
 * @text Message Start Pitch
 * @desc Pitch adjustment. Use "x - y" format for random range (e.g., "-20 - 20")
 * @default 0
 * @type string
 * 
 * @param Typing SFX
 * @text Typing Sound Effect
 * @desc Sound effect to play for each character typed
 * @dir audio/se/
 * @type file
 * 
 * @param Typing SFX Volume
 * @text Typing Sound Volume & Pitch
 * @desc Volume, Pitch (e.g., "50, 100")
 * @default 50, 100
 * @type string
 * 
 * @param -sdxc
 * @text ---------------------------
 * 
 * @param ----a---
 * @text __ BUBBLE SETTINGS _______
 * 
 * @param Bubble Animation
 * @text Message Bubble Animation
 * @desc Choose the animation style for message bubbles
 * @type select
 * @option Default
 * @value default
 * @option Scale
 * @value scale
 * @default default
 * 
 * @param Bubble Ease
 * @text Bubble Ease Movement
 * @desc Ease the movemnt of bubble when camera is focusing on a target. False to display the bubble instantly, true to ease it.
 * @type boolean
 * @default true
 * 
 * @param Navigator
 * @text Navigator
 * @desc The window skin image file to use for choice lists from img/system folder
 * @default 
 * @dir img/system/
 * @type file

 * @param -sdxcxx
 * @text ---------------------------
 * 
 * @param ----acxc---
 * @text __ CAMERA SETTINGS _______
 * 
 * @param Camera To Speaker
 * @text Focus Camera on Speaker
 * @desc Move the camera to focus on the speaking character when true
 * @default false
 * @type boolean
 * 
 * @param Camera Pan Speed
 * @text Camera Movement Speed
 * @desc How fast the camera pans (1-10). Lower is slower.
 * @default 4
 * @type number
 * @min 1
 * @max 10
 */

var Imported = Imported || {};
Imported.Hendrix_Smart_Bubble_Message = true;

(function () {
    const pluginName = 'Hendrix_Smart_Bubble_Message';
    const pluginParams = PluginManager.parameters(pluginName);
    const VERTICAL_ADJUSTMENT = pluginParams['Vertical Adjustment'] || 0;
    const MAX_WIDTH = Number(pluginParams['Max Width'] || 400);
    const NAMEBOX_POSITION = String(pluginParams['Namebox Position X'] || 'left');
    const NAMEBOX_Y_OFFSET = Number(pluginParams['Namebox Position Y'] || 0);
    const NAMEBOX_FONT_FILE = pluginParams['Namebox Font File'];
    const NAMEBOX_FONT_COLOR = pluginParams['Namebox Font Color'];
    const NAMEBOX_OUTLINE = pluginParams['Namebox Outline'] === 'true';
    const NAMEBOX_OUTLINE_COLOR = pluginParams['Namebox Outline Color'];
    const NAMEBOX_FONT_SIZE = Number(pluginParams['Namebox Font Size']);
    const MESSAGE_FONT_FILE = pluginParams['Message Font File'];
    const MESSAGE_FONT_COLOR = pluginParams['Message Font Color'];
    const MESSAGE_FONT_SIZE = Number(pluginParams['Message Font Size']);
    const MESSAGE_LINE_HEIGHT = Number(pluginParams['Message Line Height'] || 36);
    const MESSAGE_OUTLINE = pluginParams['Message Outline'] === 'true';
    const MESSAGE_OUTLINE_COLOR = pluginParams['Message Outline Color'];
    const MAX_ROW = Number(pluginParams['Max Row'] || 4);
    const MANUAL_WORD_WRAP = pluginParams['Manual Word Wrap'] === 'true';
    const FACE_SCALE = Number(pluginParams['Face Size'] || 1);
    const BUBBLE_ANIMATION = String(pluginParams['Bubble Animation'] || 'default');
    const BUBBLE_EASE = String(pluginParams['Bubble Ease'] === 'true');
    const CAMERA_TO_SPEAKER = pluginParams['Camera To Speaker'] === 'true';
    const CAMERA_PAN_SPEED = Number(pluginParams['Camera Pan Speed']);
    const CHOICE_WINDOW_SKIN = pluginParams['Choice Windowskin'];
    const CHOICE_WINDOW_Y = String(pluginParams['Choice Window Y']);
    const CHOICE_SPACE = Number(pluginParams['Choice Space'] || 4);
    const CHOICE_WIDTH = Number(pluginParams['Choice Width']);
    const CHOICE_HEIGHT = Number(pluginParams['Choice Height'] || 36);
    const CHOICE_FONT_FILE = pluginParams['Choice Font File'];
    const CHOICE_FONT_SIZE = Number(pluginParams['Choice Font Size']);
    const CHOICE_FONT_COLOR = pluginParams['Choice Font Color'];
    const CHOICE_FONT_OUTLINE = pluginParams['Choice Font Outline'] === 'true';
    const CHOICE_FONT_OUTLINE_COLOR = pluginParams['Choice Font Outline Color'];
    const CHOICE_ANIMATION = String(pluginParams['Choice Animation'] || 'default');
    const CHOICE_TEXT_ALIGN = String(pluginParams['Choice Text Align'] || 'left');
    const MESSAGE_SFX = pluginParams['Message Start SFX'];
    const NORMAL_MESSAGE_WIDTH = Number(pluginParams['Normal Message Width']);
    const NORMAL_MESSAGE_ROW = Number(pluginParams['Normal Message Row'] || 4);
    const NORMAL_FACE_SCALE = Number(pluginParams['Normal Face Scale'] || 1);
    const NORMAL_MESSAGE_Y_OFFSET = Number(pluginParams['Normal Message Y Offset'] || 0);
    const NORMAL_MESSAGE_FONT_FILE = pluginParams['Normal Message Font File'];
    const NORMAL_MESSAGE_FONT_SIZE = Number(pluginParams['Normal Message Font Size']);
    const NORMAL_MESSAGE_FONT_COLOR = pluginParams['Normal Message Font Color'];
    const NORMAL_MESSAGE_OUTLINE = pluginParams['Normal Message Outline'] === 'true';
    const NORMAL_MESSAGE_OUTLINE_COLOR = pluginParams['Normal Message Outline Color'];
    const WRAP_NORMAL_MESSAGE = pluginParams['Normal Message Wrap'] === 'true';
    const CHOICE_AUTO_POSITION = pluginParams['Choice Auto Position'] === 'true';
    const CHOICE_STYLE = String(pluginParams['Choice List Style'] || 'horizontal');
    const TYPING_SFX = pluginParams['Typing SFX'];
    const TYPING_SFX_VOLUME = pluginParams['Typing SFX Volume'];
    const BUBBLE_NAVIGATOR = pluginParams['Navigator'];

    const eventHeightCache = new Map();
    const ROW_COUNT = 4;
    const BUFFER_SPACE = 8;
    let forceBubblePosition = false;
    let bubbleMessagesEnabled = true;
    let forcedBubbleX = 0;
    let forcedBubbleY = 0;
    let currentBubbleWindowskin = pluginParams['WindowSkin'] || 'Window';

    PluginManager.registerCommand(pluginName, "Set Bubble Status", args => {
        //console.log("Previous bubble status:", bubbleMessagesEnabled);
        bubbleMessagesEnabled = Boolean(args.Status === "true");
        //console.log("New bubble status:", bubbleMessagesEnabled);
    });

    PluginManager.registerCommand(pluginName, "Change Bubble Windowskin", args => {
        const bitmap = ImageManager.loadSystem(args.filename);
        bitmap.addLoadListener(() => {
            currentBubbleWindowskin = args.filename;
            if (SceneManager._scene && SceneManager._scene._messageWindow) {
                SceneManager._scene._messageWindow.loadWindowskin();
            }
        });
    });

    PluginManager.registerCommand(pluginName, "Camera Focus", args => {
        const target = String(args.Target || '').trim().toLowerCase();

        const isDragonCameraActive = typeof SDragon !== 'undefined' &&
            SDragon.SmoothCamera &&
            SDragon.SmoothCamera.enabled;

        if (target === "player") {
            if (isDragonCameraActive) {
                $gamePlayer.setCameraFocus(0);
            } else {
                if (!$gameMap._cameraTarget || typeof $gameMap._cameraTarget.update !== 'function') {
                    $gameMap._cameraTarget = new Game_CameraTarget();
                }
                $gameMap._cameraTarget.setTarget($gamePlayer.x, $gamePlayer.y);
                // Auto-deactivate when close to player
                $gameMap._cameraTarget._autoDeactivate = true;
            }
            return;
        }

        const event = $gameMap.events().find(event => {
            return event && event.event().name.toLowerCase() === target;
        });

        if (event) {
            if (isDragonCameraActive) {
                $gamePlayer.setCameraFocus(event.x, event.y);
            } else {
                if (!$gameMap._cameraTarget || typeof $gameMap._cameraTarget.update !== 'function') {
                    $gameMap._cameraTarget = new Game_CameraTarget();
                }
                $gameMap._cameraTarget.setTarget(event.x, event.y);
                // Clear auto-deactivate for events
                $gameMap._cameraTarget._autoDeactivate = false;
            }
        }
    });

    PluginManager.registerCommand(pluginName, "Force Bubble Position", args => {
        forceBubblePosition = args.Force === "true";

        if (forceBubblePosition && args.Position) {
            try {
                const [xEval, yEval] = args.Position.split(',').map(str => str.trim());
                forcedBubbleX = eval(xEval);
                forcedBubbleY = eval(yEval);
            } catch (e) {
                //console.error('Error evaluating bubble position:', e);
                forceBubblePosition = false;
            }
        }
    });

    //=============================================================================
    // Camera Control
    //=============================================================================

    function Game_CameraTarget() {
        this.initialize(...arguments);
    }

    Game_CameraTarget.prototype.initialize = function () {
        this._targetX = null;
        this._targetY = null;
        this._currentX = null;
        this._currentY = null;
        this._isActive = false;
        // Check if DragonSmoothCamera exists
        this._isDragonCameraActive = typeof SDragon !== 'undefined' &&
            SDragon.SmoothCamera &&
            SDragon.SmoothCamera.enabled;
    };

    Game_CameraTarget.prototype.setTarget = function (x, y) {
        if (this._isDragonCameraActive) {
            $gamePlayer._cameraOffset ??= { x: 0, y: 0 };
            $gamePlayer.setCameraFocus(x, y);
            this._isActive = true;
            this._isMovingToTarget = true;
            setTimeout(() => {
                this._isMovingToTarget = false;
            }, 500);
            return;
        }

        const screenWidth = Graphics.boxWidth / $gameMap.tileWidth();
        const screenHeight = Graphics.boxHeight / $gameMap.tileHeight();

        this._isMovingToTarget = true;

        // Calculate new target position
        if (typeof ScSWinter !== 'undefined' && ScSWinter.params) {
            this._currentX ??= $gameMap._displayX;
            this._currentY ??= $gameMap._displayY;

            const wasPlayerTarget = this._isPlayerTarget;
            this._isPlayerTarget = Math.abs(x - $gamePlayer.x) + Math.abs(y - $gamePlayer.y) <= 8;

            const halfWidth = (screenWidth - !this._isPlayerTarget) / 2;
            this._targetX = !this._isPlayerTarget ? this.clampX(x - halfWidth) : x - halfWidth;
            this._targetY = !this._isPlayerTarget ? this.clampY(y - screenHeight / 2) : y - screenHeight / 2;

            if (wasPlayerTarget !== this._isPlayerTarget) {
                [this._transitionStartX, this._transitionStartY] = [$gameMap._displayX, $gameMap._displayY];
                this._transitionProgress = 0;
            }
        } else {
            // Normal calculation
            if (this._currentX === null) {
                this._currentX = $gameMap._displayX;
                this._currentY = $gameMap._displayY;
            }

            this._targetX = this.clampX(x - (screenWidth - 1) / 2);
            this._targetY = this.clampY(y - (screenHeight - 1) / 2);
        }

        this._isActive = true;
    };

    Game_Map.prototype.updateParallaxForCamera = function (oldX, oldY) {
        if (this._parallaxName && this._parallaxName.startsWith('!')) {
            // Only adjust if parallax is not looping
            if (!this._parallaxLoopX) {
                this._parallaxX += this._displayX - oldX;
            }
            if (!this._parallaxLoopY) {
                this._parallaxY += this._displayY - oldY;
            }
        }
    };

    Game_CameraTarget.prototype.update = function () {
        if (!this._isActive || this._isDragonCameraActive) return;

        // Store old display coordinates for parallax adjustment
        const oldDisplayX = $gameMap._displayX;
        const oldDisplayY = $gameMap._displayY;

        // MultiTweaks plugin
        if (typeof ScSWinter !== 'undefined' && ScSWinter.params) {
            if (this._currentX === this._targetX && this._currentY === this._targetY) {
                // Clear moving flag when we reach the target
                this._isMovingToTarget = false;
                return;
            }

            const dx = Math.abs(this._targetX - $gameMap._displayX);
            const dy = Math.abs(this._targetY - $gameMap._displayY);
            const distance = Math.sqrt(dx * dx + dy * dy);

            const speedMultiplier = Math.max(0.15,
                distance <= 5 ? 1 : 1 / (1 + Math.log10(distance))
            );
            const baseSpeed = CAMERA_PAN_SPEED / 50 * speedMultiplier;

            if (typeof this._transitionProgress === 'number') {
                this._transitionProgress = Math.min(1, this._transitionProgress + baseSpeed);
                const ease = 1 - Math.pow(1 - this._transitionProgress, 3);

                this._currentX = this._transitionStartX + (this._targetX - this._transitionStartX) * ease;
                this._currentY = this._transitionStartY + (this._targetY - this._transitionStartY) * ease;

                if (this._transitionProgress >= 1) this._transitionProgress = null;
            } else {
                this._currentX += (this._targetX - this._currentX) * baseSpeed;
                this._currentY += (this._targetY - this._currentY) * baseSpeed;
            }

            $gameMap._displayX = this._isPlayerTarget ? this._currentX : this.clampX(this._currentX);
            $gameMap._displayY = this._isPlayerTarget ? this._currentY : this.clampY(this._currentY);

            // Check if we're close enough to the target
            if (distance < 0.5) {
                this._isMovingToTarget = false;
            }
        } else {
            // Normal calculation
            const speed = CAMERA_PAN_SPEED * 0.04;

            if (this._currentX !== this._targetX || this._currentY !== this._targetY) {
                this._currentX = this._currentX + (this._targetX - this._currentX) * speed;
                this._currentY = this._currentY + (this._targetY - this._currentY) * speed;

                $gameMap._displayX = this.clampX(this._currentX);
                $gameMap._displayY = this.clampY(this._currentY);

                // Check if we're close enough to the target
                const distance = Math.hypot(this._targetX - this._currentX, this._targetY - this._currentY);
                if (distance < 0.1) {
                    this._isMovingToTarget = false;
                }
            } else {
                this._isMovingToTarget = false;
            }
        }

        // Update parallax position after camera movement
        $gameMap.updateParallaxForCamera(oldDisplayX, oldDisplayY);

        // Auto-deactivate when close to player
        if (this._autoDeactivate && this._isActive) {
            const distance = Math.abs(this._targetX - this._currentX) + Math.abs(this._targetY - this._currentY);
            if (distance < 0.5) {
                this.deactivate();
            }
        }
    };

    Game_CameraTarget.prototype.clampX = function (x) {
        const screenWidth = Graphics.boxWidth / $gameMap.tileWidth();
        const minX = 0;
        const maxX = Math.max(0, $gameMap.width() - screenWidth);
        return Math.round(Math.max(minX, Math.min(maxX, x)) * 100) / 100;
    };

    Game_CameraTarget.prototype.clampY = function (y) {
        const screenHeight = Graphics.boxHeight / $gameMap.tileHeight();
        const minY = 0;
        const maxY = Math.max(0, $gameMap.height() - screenHeight);
        return Math.round(Math.max(minY, Math.min(maxY, y)) * 100) / 100;
    };

    Game_CameraTarget.prototype.deactivate = function () {
        if (this._isDragonCameraActive) {
            $gamePlayer.setCameraFocus(0); // to player
            // MultiTweaks plugin Compitibility
        } else if (typeof ScSWinter !== 'undefined' && ScSWinter.params) {
            const screenWidth = Graphics.boxWidth / $gameMap.tileWidth();
            const screenHeight = Graphics.boxHeight / $gameMap.tileHeight();
            // Set display position with player at center
            $gameMap.setDisplayPos($gamePlayer.x - screenWidth / 2, $gamePlayer.y - screenHeight / 2);
        }

        this._isActive = false;
        this._targetX = null;
        this._targetY = null;
        this._currentX = null;
        this._currentY = null;
    };

    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function (sceneActive) {
        _Game_Map_update.call(this, sceneActive);
        if (!this._cameraTarget || typeof this._cameraTarget.update !== 'function') {
            this._cameraTarget = new Game_CameraTarget();
        }
        this._cameraTarget.update();
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);

        if (!CAMERA_TO_SPEAKER ||
            !$gameMap._cameraTarget?._isActive ||
            $gameMap._interpreter.isRunning()) return;

        if ($gameMap._cameraTarget._manualFocusActive) return;

        // Allow camera to continue moving even when message is open/has text
        // Only stop if camera has finished moving to target
        if ($gameMap._cameraTarget._isMovingToTarget) return;

        if ($gameMap._cameraTarget._isDragonCameraActive) {
            $gamePlayer.setCameraFocus(0);
            return;
        }

        // Add a small buffer after camera stops moving before starting reset timer
        if (!$gameMap._cameraTarget._settledTimer) {
            $gameMap._cameraTarget._settledTimer = 10; // Small buffer
            return;
        } else {
            $gameMap._cameraTarget._settledTimer--;
            if ($gameMap._cameraTarget._settledTimer > 0) return;
        }

        if (!$gameMap._cameraTarget._resetTimer) {
            $gameMap._cameraTarget._resetTimer = 60;
        } else {
            $gameMap._cameraTarget._resetTimer--;
            if ($gameMap._cameraTarget._resetTimer <= 0) {
                $gameMap._cameraTarget.setTarget($gamePlayer.x, $gamePlayer.y);
                $gameMap._cameraTarget._resetTimer = null;
                $gameMap._cameraTarget._settledTimer = null;

                if (typeof ScSWinter !== 'undefined' && ScSWinter.params) {
                    const distance = Math.hypot(
                        $gameMap._cameraTarget._currentX - $gameMap._cameraTarget._targetX,
                        $gameMap._cameraTarget._currentY - $gameMap._cameraTarget._targetY
                    );

                    if (distance < 0.1) {
                        setTimeout(() => $gameMap._cameraTarget.deactivate(), 50);
                    }
                } else {
                    setTimeout(() => {
                        $gameMap._cameraTarget.deactivate();
                    }, 1000);
                }
            }
        }
    };

    const _Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function () {
        _Game_Map_initialize.call(this);
        this._cameraTarget = new Game_CameraTarget();
    };

    //=============================================================================
    // Font Management
    //=============================================================================

    const loadCustomFont = (fontFile) => {
        if (!fontFile) return null;
        const fontFace = fontFile.split('.')[0];
        const fontPath = `fonts/${fontFile}`;
        const customFont = new FontFace(fontFace, `url('${fontPath}')`);
        customFont.load().then(loadedFont => {
            document.fonts.add(loadedFont);
        }).catch(error => {
            console.error('Font loading failed:', error);
        });
        return fontFace;
    };

    const nameboxFontFamily = loadCustomFont(NAMEBOX_FONT_FILE);
    const messageFontFamily = loadCustomFont(MESSAGE_FONT_FILE);

    if (CHOICE_FONT_FILE) {
        loadCustomFont(CHOICE_FONT_FILE);
    }

    if (NORMAL_MESSAGE_FONT_FILE) {
        loadCustomFont(NORMAL_MESSAGE_FONT_FILE);
    }

    //=============================================================================
    // Message Window - Core
    //=============================================================================

    const _Window_Message_open = Window_Message.prototype.open;
    Window_Message.prototype.open = function () {
        const speakerName = $gameMessage.speakerName();
        if (!speakerName || !bubbleMessagesEnabled) {
            _Window_Message_open.call(this, arguments);
            return;
        }

        if (BUBBLE_ANIMATION === 'scale') {
            // Set scale origin to center
            this.pivot.x = this.width / 2;
            this.pivot.y = this.height / 2;
            // Start from 0 scale
            this.scale.x = 0;
            this.scale.y = 0;
        }

        if (this._navigatorSprite) {
            this._navigatorSprite.visible = true;
        }

        if (!this.isClosing()) {
            this._opening = true;
            this.openness = 0;
        }
    };


    const _Window_Message_updateOpen = Window_Message.prototype.updateOpen;
    Window_Message.prototype.updateOpen = function () {
        const speakerName = $gameMessage.speakerName();
        if (!speakerName || !bubbleMessagesEnabled) {
            _Window_Message_updateOpen.call(this, arguments);
            return;
        }
        // Update default openness animation
        if (this._opening) {
            this.openness += 32;
            if (this.isOpen()) {
                this._opening = false;
            }

            // Update position as openness changes
            const event = this.findEventByName(speakerName);
            if (event) {
                this.placeBubbleMessage(event);
            }

            // Add scale animation
            if (this._opening && BUBBLE_ANIMATION === 'scale') {
                // Sync scale with openness
                const progress = this.openness / 255;
                this.scale.x = progress;
                this.scale.y = progress;
            }
        }
    };

    const _Window_Message_updateClose = Window_Message.prototype.updateClose;
    Window_Message.prototype.updateClose = function () {
        if (this._navigatorSprite) {
            this._navigatorSprite.visible = false;
        }
        if (BUBBLE_ANIMATION === 'scale' && this._currentSpeakerName) {
            if (this._closing) {
                this.scale.x = Math.max(this.scale.x - 0.15, 0);
                this.scale.y = Math.max(this.scale.y - 0.15, 0);
                if (this.scale.x <= 0) {
                    this._closing = false;
                    this.openness = 0;
                }
            }
        } else {
            _Window_Message_updateClose.call(this);
        }
    };

    const _Window_Message_updateShowFast = Window_Message.prototype.updateShowFast;
    Window_Message.prototype.updateShowFast = function () {
        const speakerName = $gameMessage.speakerName();
        if (!speakerName || !bubbleMessagesEnabled) {
            _Window_Message_updateShowFast.call(this, arguments);
            return;
        }
        if (BUBBLE_ANIMATION === 'scale') {
            this._showFast = true;
        }
        _Window_Message_updateShowFast.call(this);
    };

    //const _Window_Message_drawFace = Window_Message.prototype.drawFace;
    Window_Message.prototype.drawFace = function (faceName, faceIndex, x, y, width, height) {
        //_Window_Message_drawFace.call(this, faceName, faceIndex, x, y, width, height);
        const speakerName = $gameMessage.speakerName();
        if (!speakerName || !bubbleMessagesEnabled) {
            width = width || ImageManager.faceWidth;
            height = height || ImageManager.faceHeight;
            const normalScaledSize = Math.floor(width * NORMAL_FACE_SCALE);

            const bitmap = ImageManager.loadFace(faceName);
            bitmap.smooth = false;
            const pw = ImageManager.faceWidth;
            const ph = ImageManager.faceHeight;
            const sw = pw;
            const sh = ph;
            const sx = (faceIndex % 4) * pw;
            const sy = Math.floor(faceIndex / 4) * ph;
            const dx = x;
            const dy = y;
            const dw = normalScaledSize;
            const dh = normalScaledSize;

            this.contents.smooth = false;
            this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
            this.contents.smooth = true;
            return;
        }

        width = width || ImageManager.faceWidth;
        height = height || ImageManager.faceHeight;

        // Scale both width and height by the same factor to maintain 1:1 ratio
        const scaledSize = Math.floor(width * FACE_SCALE);

        const bitmap = ImageManager.loadFace(faceName);
        bitmap.smooth = false;
        const pw = ImageManager.faceWidth;
        const ph = ImageManager.faceHeight;
        const sw = pw;
        const sh = ph;
        const sx = (faceIndex % 4) * pw;
        const sy = Math.floor(faceIndex / 4) * ph;
        const dx = x;
        const dy = y;
        const dw = scaledSize;
        const dh = scaledSize;

        this.contents.smooth = false;
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, dw, dh);
        this.contents.smooth = true;
    };

    const _Window_Message_newLineX = Window_Message.prototype.newLineX;
    Window_Message.prototype.newLineX = function () {
        const speakerName = $gameMessage.speakerName();
        if (!speakerName || !bubbleMessagesEnabled) {
            if ($gameMessage.faceName() === '') {
                return _Window_Message_newLineX.call(this, arguments);
            }
            const normalScaledFaceWidth = Math.floor(ImageManager.faceWidth * NORMAL_FACE_SCALE);
            return normalScaledFaceWidth + 24;
        }

        if ($gameMessage.faceName() === '') {
            return _Window_Message_newLineX.call(this, arguments);
        }

        const scaledFaceWidth = Math.floor(ImageManager.faceWidth * FACE_SCALE);
        return scaledFaceWidth + 24;
    };


    Window_Message.prototype.processCharacter = function (textState) {
        const c = textState.text[textState.index++];
        if (c.charCodeAt(0) < 0x20) {
            this.flushTextState(textState);
            this.processControlCharacter(textState, c);
        } else {
            textState.buffer += c;
            // Initialize the character counter if it doesn't exist
            if (!this._typingSoundCounter) this._typingSoundCounter = 0;

            // Play typing sound every 3 characters if SFX is set and message is not being shown instantly
            this._typingSoundCounter++;
            if (TYPING_SFX && !this._showFast && !this._lineShowFast && this._typingSoundCounter >= 4) {
                this.playTypingSFX();
                this._typingSoundCounter = 0; // Reset counter
            }
        }
    };

    Window_Message.prototype.playTypingSFX = function () {
        if (!TYPING_SFX) return;

        let volume = 50;
        let pitch = 100;

        if (TYPING_SFX_VOLUME) {
            const params = TYPING_SFX_VOLUME.split(',').map(v => parseInt(v.trim()));
            if (params.length >= 2) {
                volume = params[0];
                pitch = params[1];
            } else {
                volume = params[0];
            }
        }

        AudioManager.playSe({
            name: TYPING_SFX,
            volume: volume,
            pitch: pitch,
            pan: 0
        });
    };

    const _Window_NameBox_start = Window_NameBox.prototype.start;
    Window_NameBox.prototype.start = function () {

        if (!bubbleMessagesEnabled || !$gameMessage.speakerName()) {
            this.show();
            this.open();
            _Window_NameBox_start.call(this);
        } else {
            this.openness = 0;
            this.hide();
            this.close();
            this.contents.clear();
        }
    };

    Window_Message.prototype.drawMessageName = function (name) {
        // Convert 'player' to party leader name and remove namebox stuff
        name = name.replace(/\\V\[(\d+)\]/gi, (match, n) => {
            return $gameVariables.value(parseInt(n));
        });
        let displayName;
        const eventIdMatch = name.match(/(.+?)\s*\(event\s*\d+\)/i);
        if (eventIdMatch) {
            displayName = eventIdMatch[1].trim();
        } else {
            const normalizedName = name.toLowerCase();
            if (normalizedName === 'player') {
                displayName = $gameParty.leader().name();
            } else if (normalizedName.startsWith('follower:')) {
                const followerIdentifier = name.substring(9).trim();

                const actorId = parseInt(followerIdentifier);
                if (!isNaN(actorId)) {
                    const actor = $gameParty.battleMembers().find(member => member && member.actorId() === actorId);
                    displayName = actor ? actor.name() : followerIdentifier;
                } else {
                    displayName = followerIdentifier;
                }
            } else {
                displayName = name;
            }
        }

        const padding = 4;
        const textWidth = this.textWidth(displayName) + padding * 2;
        let x;

        switch (NAMEBOX_POSITION.toLowerCase()) {
            case 'center':
                x = (this.width - textWidth) / 2;
                break;
            case 'right':
                x = this.width - textWidth - this.padding;
                break;
            default:
                x = this.padding;
                break;
        }
        const bitmap = new Bitmap(textWidth, this.lineHeight());
        bitmap.fontSize = NAMEBOX_FONT_SIZE !== null ? NAMEBOX_FONT_SIZE : $gameSystem.mainFontSize();
        if (nameboxFontFamily) {
            bitmap.fontFace = nameboxFontFamily;
        } else {
            bitmap.fontFace = $gameSystem.mainFontFace();
        }
        bitmap.textColor = NAMEBOX_FONT_COLOR || ColorManager.normalColor();
        bitmap.outlineWidth = NAMEBOX_OUTLINE ? 4 : 0;
        bitmap.outlineColor = NAMEBOX_OUTLINE_COLOR || ColorManager.outlineColor();
        bitmap.drawText(displayName, padding, 0, textWidth - padding * 2, this.lineHeight(), 'left');

        const newSprite = new Sprite(bitmap);
        newSprite.x = x;
        newSprite.y = -this.lineHeight() + NAMEBOX_Y_OFFSET;

        if (this._nameSprite &&
            this._nameSprite.width === newSprite.width &&
            this._nameSprite.height === newSprite.height &&
            this._nameSprite.x === newSprite.x &&
            this._nameSprite.y === newSprite.y) {
            return;
        }

        if (this._nameSprite) {
            this.removeChild(this._nameSprite);
            this._nameSprite = null;
        }

        this._nameSprite = newSprite;
        this.addChild(this._nameSprite);
    };

    const _Window_Message_lineHeight = Window_Message.prototype.lineHeight;
    Window_Message.prototype.lineHeight = function () {
        const speakerName = $gameMessage.speakerName();
        if (!speakerName || !bubbleMessagesEnabled) {
            return _Window_Message_lineHeight.call(this);
        }
        return MESSAGE_LINE_HEIGHT;
    };

    const _Window_Message_resetFontSettings = Window_Message.prototype.resetFontSettings;
    Window_Message.prototype.resetFontSettings = function () {
        _Window_Message_resetFontSettings.call(this);

        if (!this._currentSpeakerName) {
            // Normal message settings
            this.contents.fontFace = NORMAL_MESSAGE_FONT_FILE ? NORMAL_MESSAGE_FONT_FILE.split('.')[0] : $gameSystem.mainFontFace();
            this.contents.fontSize = NORMAL_MESSAGE_FONT_SIZE || $gameSystem.mainFontSize();
            this.contents.textColor = NORMAL_MESSAGE_FONT_COLOR || ColorManager.normalColor();
            this.contents.outlineWidth = NORMAL_MESSAGE_OUTLINE ? 4 : 0;
            this.contents.outlineColor = NORMAL_MESSAGE_OUTLINE_COLOR || ColorManager.outlineColor();
            return;
        }

        // Bubble message settings
        this.contents.fontFace = messageFontFamily || $gameSystem.mainFontFace();
        this.contents.fontSize = MESSAGE_FONT_SIZE || $gameSystem.mainFontSize();
        this.contents.textColor = MESSAGE_FONT_COLOR || ColorManager.normalColor();
        this.contents.outlineWidth = MESSAGE_OUTLINE ? 4 : 0;
        this.contents.outlineColor = MESSAGE_OUTLINE_COLOR || ColorManager.outlineColor();
    };


    const _Window_Message_loadWindowskin = Window_Message.prototype.loadWindowskin;
    Window_Message.prototype.loadWindowskin = function () {
        const speakerName = $gameMessage.speakerName();
        if (!speakerName || !bubbleMessagesEnabled) {
            _Window_Message_loadWindowskin.call(this);
            return;
        }

        this.windowskin = ImageManager.loadSystem(currentBubbleWindowskin);
    };

    function parseRangeParameter(value, defaultValue) {
        if (!value) return defaultValue;
        if (value.includes('-')) {
            const [min, max] = value.split('-').map(v => Number(v.trim()));
            if (!isNaN(min) && !isNaN(max)) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
    }

    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
        this._typingSoundCounter = 0;
        this._expandedWidth = null;
        const speakerName = $gameMessage.speakerName();

        if (this._nameSprite) {
            this.removeChild(this._nameSprite);
            this._nameSprite = null;
        }

        if (speakerName && bubbleMessagesEnabled) {
            this.resizeBubble();
            this.updatePlacement();
        } else {
            // Reset window dimensions for regular messages
            this.width = NORMAL_MESSAGE_WIDTH > 0 ? NORMAL_MESSAGE_WIDTH : Graphics.boxWidth;
            this.height = this.fittingHeight(NORMAL_MESSAGE_ROW);
            this.x = (Graphics.boxWidth - this.width) / 2;
            this.createContents();
        }

        this._currentSpeakerName = bubbleMessagesEnabled ? speakerName : null;

        if (MESSAGE_SFX) {
            AudioManager.playSe({
                name: MESSAGE_SFX,
                volume: parseRangeParameter(pluginParams['Message SFX Volume'], 45),
                pitch: 100 + parseRangeParameter(pluginParams['Message SFX Pitch'], 0),
                pan: 0
            });
        }

        // Wrap Text for Normal Message
        if (!speakerName || !bubbleMessagesEnabled) {
            if (WRAP_NORMAL_MESSAGE && $gameMessage._texts.length > 0) {
                const processedTexts = [];
                for (const text of $gameMessage._texts) {
                    processedTexts.push(...this.wrapText(text));
                }

                if (processedTexts.length > NORMAL_MESSAGE_ROW) {
                    const pages = [];
                    for (let i = 0; i < processedTexts.length; i += NORMAL_MESSAGE_ROW) {
                        const page = processedTexts.slice(i, i + NORMAL_MESSAGE_ROW);
                        pages.push(page.join('\n'));
                    }
                    $gameMessage._texts = [pages.join('\f')];
                } else {
                    $gameMessage._texts = processedTexts;
                }
            }
            this._messageInitialized = false;
            _Window_Message_startMessage.call(this);
            return;
        }

        if (CAMERA_TO_SPEAKER && speakerName && bubbleMessagesEnabled) {
            const event = this.findEventByName(speakerName);
            if (event) {
                if (!$gameMap._cameraTarget) {
                    $gameMap._cameraTarget = new Game_CameraTarget();
                }

                if (speakerName.toLowerCase() === 'player') {
                    $gameMap._cameraTarget.setTarget($gamePlayer.x, $gamePlayer.y);
                } else {
                    $gameMap._cameraTarget.setTarget(event.x, event.y);
                }
            }
        }

        // Wrap Text for Bubble Message
        if (speakerName && bubbleMessagesEnabled && $gameMessage._texts.length > 0) {
            if (MANUAL_WORD_WRAP) {
                // Manual line break - preserve line breaks from editor
                const combinedText = $gameMessage._texts.join('\n');
                const manualLines = combinedText.split('\n');
                const wrappedLines = [];
                
                for (const line of manualLines) {
                    if (line.trim()) {
                        wrappedLines.push(...this.wrapText(line));
                    } else {
                        wrappedLines.push('');
                    }
                }
                
                if (wrappedLines.length > MAX_ROW) {
                    const pages = [];
                    for (let i = 0; i < wrappedLines.length; i += MAX_ROW) {
                        pages.push(wrappedLines.slice(i, i + MAX_ROW).join('\n'));
                    }
                    $gameMessage._texts = pages;
                } else {
                    $gameMessage._texts = wrappedLines;
                }
            } else {
                // Auto word wrap - combine all text into one line
                const combinedText = $gameMessage._texts.join(' ').replace(/\n/g, ' ');
                const wrappedLines = this.wrapText(combinedText);
                
                if (wrappedLines.length > MAX_ROW) {
                    const pages = [];
                    for (let i = 0; i < wrappedLines.length; i += MAX_ROW) {
                        pages.push(wrappedLines.slice(i, i + MAX_ROW).join('\n'));
                    }
                    $gameMessage._texts = pages;
                } else {
                    $gameMessage._texts = wrappedLines;
                }
            }
        }

        //if (bubbleMessagesEnabled && speakerName) {
        //    this.drawMessageName(speakerName);
        //}
        _Window_Message_startMessage.call(this);
    };

    const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function () {
        _Window_Message_terminateMessage.call(this);

        // Return camera to player when dialogue ends
        if (CAMERA_TO_SPEAKER) {
            setTimeout(() => {
                // Check if there are more messages coming or the event is still running
                if (!$gameMessage.hasText() && !$gameMap._interpreter.isRunning()) {
                    if (SceneManager._scene && SceneManager._scene.executeCameraReturn) {
                        SceneManager._scene.executeCameraReturn();
                    } else {
                        if ($gameMap._cameraTarget) {
                            if ($gameMap._cameraTarget._isDragonCameraActive) {
                                $gamePlayer.setCameraFocus(0);
                            } else {
                                $gameMap._cameraTarget.setTarget($gamePlayer.x, $gamePlayer.y);
                                setTimeout(() => {
                                    $gameMap._cameraTarget.deactivate();
                                }, 1000);
                            }
                        }
                    }
                }
            }, 200);
        }
    };

    Window_Message.prototype.wrapText = function (text) {
        const speakerName = $gameMessage.speakerName();
        const faceExists = $gameMessage.faceName() !== '';
        const faceScale = speakerName ? FACE_SCALE : NORMAL_FACE_SCALE;
        const faceWidth = faceExists ? Math.floor(ImageManager.faceWidth * faceScale) + 20 : 0;
        const maxWidth = speakerName ?
            (MAX_WIDTH - faceWidth - this.padding * 2 - BUFFER_SPACE) :
            (NORMAL_MESSAGE_WIDTH - faceWidth - this.padding * 2 - BUFFER_SPACE);

        const removeEscapeCodes = (text) => {
            if (!text) return '';
            let result = text.replace(/\\([\w!$&.|^]|[A-Z])\[([^\]]*)\]/gi, '');
            result = result.replace(/\\./g, '');
            return result;
        };

        const isAsian = /[\u3000-\u9fff]/.test(text);
        const lines = [''];
        let currentLine = 0;

        const segments = isAsian ? [...text] : text.split(/([\s\n])/);
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const testLine = lines[currentLine] + segment;
            const maxRows = speakerName ? MAX_ROW : NORMAL_MESSAGE_ROW;

            const cleanTestLine = removeEscapeCodes(testLine);
            const cleanWidth = this.textWidth(cleanTestLine);

            if (cleanWidth <= maxWidth) {
                lines[currentLine] += segment;
            } else if (currentLine === maxRows - 1) {
                const remaining = isAsian ? text.slice(i) : segments.slice(i).join('').trim();
                const cleanRemaining = removeEscapeCodes(remaining);
                const shortTextLimit = isAsian ? 3 : 9;

                if (cleanRemaining.length <= shortTextLimit &&
                    this.textWidth(removeEscapeCodes(lines[currentLine] + remaining)) <= maxWidth * 1.2) {
                    lines[currentLine] += remaining;
                    this._expandedWidth = this.textWidth(removeEscapeCodes(lines[currentLine])) +
                        faceWidth + this.padding * 2 + BUFFER_SPACE;
                    break;
                }
                currentLine++;
                if (segment === ' ' && i + 1 < segments.length) {
                    lines[currentLine] = segments[i + 1];
                    i++;
                } else {
                    lines[currentLine] = segment;
                }
            } else {
                currentLine++;
                if (segment === ' ' && i + 1 < segments.length) {
                    lines[currentLine] = segments[i + 1];
                    i++;
                } else {
                    lines[currentLine] = segment;
                }
            }
        }

        return lines.filter(line => removeEscapeCodes(line).trim().length > 0);
    };

    const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function () {
        const speakerName = this._currentSpeakerName;

        if (!speakerName || !bubbleMessagesEnabled) {
            // Reset for normal messages
            this.scale.x = 1;
            this.scale.y = 1;
            this.pivot.x = 0;
            this.pivot.y = 0;
            this.width = NORMAL_MESSAGE_WIDTH > 0 ? NORMAL_MESSAGE_WIDTH : Graphics.boxWidth;
            this.height = this.fittingHeight(NORMAL_MESSAGE_ROW);
            this.x = (Graphics.boxWidth - this.width) / 2;
            this.createContents();
            this.loadWindowskin();
            _Window_Message_updatePlacement.call(this);
            this.y += NORMAL_MESSAGE_Y_OFFSET;
            return;
        }
        // Fix DIM attached to bubbles
        if (this._currentSpeakerName && bubbleMessagesEnabled && this._dimmerSprite) {
            this._dimmerSprite.visible = false;
        }
        const event = this.findEventByName(speakerName);
        if (event) {
            this.resizeBubble();
            this.placeBubbleMessage(event);
            if (this._nameSprite) {
                this.removeChild(this._nameSprite);
                this._nameSprite = null;
            }
            this.loadWindowskin();
            this.drawMessageName(speakerName);
        }
    };

    Window_Message.prototype.resizeBubble = function () {
        const dimensions = this.calcAutoSize();
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.createContents();
    };

    Window_Message.prototype.calcAutoSize = function () {
        const texts = $gameMessage._texts;
        const faceExists = $gameMessage.faceName() !== '';
        const scaledFaceSize = Math.floor(ImageManager.faceWidth * FACE_SCALE);
        const faceWidth = faceExists ? scaledFaceSize + 20 : 0;
        let maxWidth = 0;

        // Use expanded width if available
        if (this._expandedWidth) {
            maxWidth = this._expandedWidth;
            this._expandedWidth = null;
        } else {
            // Calculate the actual maximum available witdh
            const availableWidth = MAX_WIDTH > 0 ? MAX_WIDTH : Graphics.boxWidth - this.padding * 2;

            for (const text of texts) {
                const width = this.textWidth(text) + faceWidth + this.padding * 2 + BUFFER_SPACE;

                // Use the full available width if text width is close to max
                if (width >= availableWidth * 0.85) { // Threshold 85%
                    maxWidth = availableWidth;
                } else {
                    maxWidth = Math.max(maxWidth, width);
                }
            }

            // Ensure minimum width and handle maximum width
            maxWidth = Math.max(maxWidth, faceWidth + this.padding * 4);
            maxWidth = Math.min(maxWidth, availableWidth);
        }

        const totalLines = Math.min(texts.length, ROW_COUNT > 0 ? ROW_COUNT : texts.length);
        const lineHeight = this.lineHeight();
        const textHeight = totalLines * lineHeight;
        const faceHeight = faceExists ? scaledFaceSize : 0;
        const height = Math.max(textHeight, faceHeight) + this.padding * 2;

        return {
            width: maxWidth,
            height: Math.min(height, Graphics.boxHeight)
        };
    };

    Window_Message.prototype.findEventByName = function (name) {
        name = name.replace(/\\V\[(\d+)\]/gi, (match, n) => {
            return $gameVariables.value(parseInt(n));
        });
        const normalizedName = name.toLowerCase();

        // Name (event X)
        const eventIdMatch = name.match(/(.+?)\s*\(event\s*(\d+)\)/i);
        if (eventIdMatch) {
            const eventId = parseInt(eventIdMatch[2]);
            const event = $gameMap.event(eventId);
            if (event) {
                return event;
            }
            return null;
        }

        // Display on Player
        if (normalizedName === 'player') {
            return $gamePlayer;
        }

        if (normalizedName.startsWith('follower:')) {
        const followerIdentifier = name.substring(9).trim();

            const actorId = parseInt(followerIdentifier);
            if (!isNaN(actorId)) {
                // Actor ID
                for (let i = 0; i < $gameParty.battleMembers().length; i++) {
                    const member = $gameParty.battleMembers()[i];
                    if (member && member.actorId() === actorId && $gamePlayer.followers()._data[i - 1]) {
                        return $gamePlayer.followers()._data[i - 1];
                    }
                }
            } else {
                // Name
                for (let i = 0; i < $gameParty.battleMembers().length; i++) {
                    const member = $gameParty.battleMembers()[i];
                    if (member && member.name() === followerIdentifier && $gamePlayer.followers()._data[i - 1]) {
                        return $gamePlayer.followers()._data[i - 1];
                    }
                }
            }
            return null;
        }

        return $gameMap.events().find(event => {
            // Check if event name matches AND has an active page
            return event.event().name === name &&
                event.page() !== null;
        });
    };

    Window_Message.prototype.createNavigator = function () {
        if (!this._navigatorSprite && BUBBLE_NAVIGATOR) {
            this._navigatorSprite = new Sprite();
            this._navigatorSprite.bitmap = ImageManager.loadSystem(BUBBLE_NAVIGATOR);
            this._navigatorSprite.visible = false;
            this.addChild(this._navigatorSprite);
        }
    };

    Window_Message.prototype.updateNavigatorPosition = function (isAboveCharacter) {
        if (!this._navigatorSprite || !BUBBLE_NAVIGATOR) return;

        // Show navigator only when message window is fully open
        this._navigatorSprite.visible = this.openness >= 255;

        // Center horizontally
        this._navigatorSprite.x = this.width / 2 - this._navigatorSprite.width / 2;

        if (isAboveCharacter) {
            // Place at bottom of bubble
            this._navigatorSprite.y = this.height;
            this._navigatorSprite.scale.y = 1;
        } else {
            // Place at top of bubble
            this._navigatorSprite.y = 0;
            this._navigatorSprite.scale.y = -1; // Flip vertically
        }
    };

    Game_Character.prototype.getSpriteHeight = function () {
        const characterName = this.characterName();

        if (!characterName) return 48;

        if (eventHeightCache.has(characterName)) {
            return eventHeightCache.get(characterName);
        }

        const bitmap = ImageManager.loadCharacter(characterName);
        const defaultHeight = ImageManager.isBigCharacter(characterName) ? 64 : 48;

        eventHeightCache.set(characterName, defaultHeight);

        bitmap.addLoadListener(() => {
            const big = ImageManager.isBigCharacter(characterName);
            const charWidth = big ? bitmap.width / 3 : bitmap.width / 12;
            const charHeight = big ? bitmap.height / 4 : bitmap.height / 8;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = charWidth;
            canvas.height = charHeight;

            // Get the correct sprite index
            const index = this.characterIndex();
            const sx = (index % 4 * 3) * charWidth;
            const sy = Math.floor(index / 4) * 4 * charHeight;

            ctx.drawImage(bitmap._canvas || bitmap._image,
                sx, sy, charWidth, charHeight,
                0, 0, charWidth, charHeight);

            const imageData = ctx.getImageData(0, 0, charWidth, charHeight);
            const data = imageData.data;

            let topPixel = charHeight;
            let bottomPixel = 0;

            for (let y = 0; y < charHeight; y++) {
                for (let x = 0; x < charWidth; x++) {
                    const alpha = data[(y * charWidth + x) * 4 + 3];
                    if (alpha > 0) {
                        topPixel = Math.min(topPixel, y);
                        bottomPixel = Math.max(bottomPixel, y + 1);
                    }
                }
            }

            const actualHeight = bottomPixel - topPixel;
            eventHeightCache.set(characterName, actualHeight > 0 ? actualHeight : defaultHeight);
        });

        return eventHeightCache.get(characterName);
    };

    Window_Message.prototype.placeBubbleMessage = function (event) {
        if (!this._navigatorSprite) {
            this.createNavigator();
        }

        if (forceBubblePosition) {
            if (BUBBLE_ANIMATION === 'scale') {
                this.pivot.x = this.width / 2;
                this.pivot.y = this.height / 2;
                this.x = forcedBubbleX;
                this.y = forcedBubbleY;
            } else {
                this.x = forcedBubbleX - this.width / 2;
                this.y = forcedBubbleY;
            }
            return;
        }

        const tileHeight = $gameMap.tileHeight();
        const screenY = Math.round((event._realY - $gameMap._displayY) * tileHeight + tileHeight / 2);
        const baseY = screenY - (VERTICAL_ADJUSTMENT === 'auto' ? event.getSpriteHeight() : tileHeight) - this.height + (VERTICAL_ADJUSTMENT === 'auto' ? 0 : Number(VERTICAL_ADJUSTMENT));
        const isAboveCharacter = baseY >= 0 && baseY + this.height <= Graphics.boxHeight;

        this.updateNavigatorPosition(isAboveCharacter);
        this.placeCloselyStickingBubble(event);
    };

    const _Window_Message_close = Window_Message.prototype.close;
    Window_Message.prototype.close = function () {
        _Window_Message_close.call(this);
        if (this._navigatorSprite) {
            this._navigatorSprite.visible = false;
        }
    };

    Window_Message.prototype.placeCloselyStickingBubble = function (event) {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();

        if (typeof ScSWinter !== 'undefined' && ScSWinter.params) {
            // Get current zoom from the map
            const zoom = $gameMap._currentZoom || 1.0;

            // Calculate base screen position accounting for zoom
            const screenX = Math.round((event._realX - $gameMap._displayX - $gameMap._extraScreenTileX) * tileWidth * zoom + tileWidth * zoom / 2);
            const screenY = Math.round((event._realY - $gameMap._displayY - $gameMap._extraScreenTileY) * tileHeight * zoom + tileHeight * zoom / 2);

            // Calculate base target position (always centered)
            const baseX = screenX - this.width / 2;
            let baseY;

            if (VERTICAL_ADJUSTMENT === 'auto') {
                baseY = screenY - event.getSpriteHeight() * zoom - this.height;
                if (baseY < 0 || baseY + this.height > Graphics.boxHeight) {
                    baseY = screenY + tileHeight * zoom;
                }
            } else {
                baseY = screenY - tileHeight * zoom - this.height + Number(VERTICAL_ADJUSTMENT);
                if (baseY < 0 || baseY + this.height > Graphics.boxHeight) {
                    baseY = screenY + tileHeight * zoom + Number(VERTICAL_ADJUSTMENT);
                }
            }

            if (!this._messageInitialized) {
                if (BUBBLE_ANIMATION === 'scale') {
                    this.pivot.x = this.width / 2;
                    this.pivot.y = this.height / 2;
                    this.x = screenX;
                    this.y = baseY + this.height / 2;
                } else {
                    this.x = baseX;
                    this.y = baseY;
                }
                this._messageInitialized = true;
            } else {
                const targetX = BUBBLE_ANIMATION === 'scale' ? screenX : baseX;
                const targetY = BUBBLE_ANIMATION === 'scale' ? baseY + this.height / 2 : baseY;

                if (BUBBLE_EASE === 'true') {
                    const distanceX = targetX - this.x;
                    const distanceY = targetY - this.y;
                    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                    const smoothness = Math.min(0.5, distance / 100);

                    if (distance > 0.01) {
                        this.x += distanceX * smoothness;
                        this.y += distanceY * smoothness;
                    } else {
                        this.x = targetX;
                        this.y = targetY;
                    }
                } else {
                    this.x = targetX;
                    this.y = targetY;
                }
            }
        } else {
            // Original calculation without zoom (without MultiTweaks plugin)
            const screenX = Math.round((event._realX - $gameMap._displayX) * tileWidth + tileWidth / 2);
            const screenY = Math.round((event._realY - $gameMap._displayY) * tileHeight + tileHeight / 2);

            const baseX = screenX - this.width / 2;
            let baseY;

            if (VERTICAL_ADJUSTMENT === 'auto') {
                baseY = screenY - event.getSpriteHeight() - this.height;
                if (baseY < 0 || baseY + this.height > Graphics.boxHeight) {
                    baseY = screenY + tileHeight;
                }
            } else {
                baseY = screenY - tileHeight - this.height + Number(VERTICAL_ADJUSTMENT);
                if (baseY < 0 || baseY + this.height > Graphics.boxHeight) {
                    baseY = screenY + tileHeight + Number(VERTICAL_ADJUSTMENT);
                }
            }

            if (!this._messageInitialized) {
                if (BUBBLE_ANIMATION === 'scale') {
                    this.pivot.x = this.width / 2;
                    this.pivot.y = this.height / 2;
                    this.x = screenX;
                    this.y = baseY + this.height / 2;
                } else {
                    this.x = baseX;
                    this.y = baseY;
                }
                this._messageInitialized = true;
            } else {
                const targetX = BUBBLE_ANIMATION === 'scale' ? screenX : baseX;
                const targetY = BUBBLE_ANIMATION === 'scale' ? baseY + this.height / 2 : baseY;

                if (BUBBLE_EASE === 'true') {
                    const distanceX = targetX - this.x;
                    const distanceY = targetY - this.y;
                    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                    const smoothness = Math.min(0.5, distance / 100);

                    if (distance > 0.01) {
                        this.x += distanceX * smoothness;
                        this.y += distanceY * smoothness;
                    } else {
                        this.x = targetX;
                        this.y = targetY;
                    }
                } else {
                    this.x = targetX;
                    this.y = targetY;
                }
            }
        }
    };

    const _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function () {
        _Window_Message_update.call(this);

        if (!bubbleMessagesEnabled) { return }
        if (this.isOpen() &&
            this.openness === 255 &&
            !this._opening &&
            !this._closing &&
            $gameMessage.speakerName()) {
            const event = this.findEventByName($gameMessage.speakerName());
            if (event) {
                this.placeBubbleMessage(event);
            }
        }
    };

    Window_Message.prototype.adjustPosition = function () {
        const minX = 0;
        const maxX = Graphics.boxWidth - this.width;
        const minY = 0;
        const maxY = Graphics.boxHeight - this.height;
        this.x = Math.max(minX, Math.min(maxX, this.x));
        this.y = Math.max(minY, Math.min(maxY, this.y));
    };

    // Reset to default opacity when it's not bubble
    const _Window_Message_initialize = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function (rect) {
        _Window_Message_initialize.call(this, rect);
        this._defaultOpacity = this.opacity;
        this._defaultBackOpacity = this.backOpacity;
    };

    const _Window_Message_updateBackground = Window_Message.prototype.updateBackground;
    Window_Message.prototype.updateBackground = function () {
        const speakerName = $gameMessage.speakerName();
        if (speakerName && bubbleMessagesEnabled) {
            this.opacity = 255;
            this.backOpacity = 255;
        } else {
            this.opacity = this._defaultOpacity;
            this.backOpacity = this._defaultBackOpacity;
            _Window_Message_updateBackground.call(this);
        }
    };

    //=============================================================================
    // Choice Window
    //=============================================================================

    let targetY = 0;

    const _Window_ChoiceList_initialize = Window_ChoiceList.prototype.initialize;
    Window_ChoiceList.prototype.initialize = function (messageWindow) {
        _Window_ChoiceList_initialize.call(this, messageWindow);
        this.loadCustomWindowskin();
        this._animating = false;
        this._animationProgress = 0;
    };

    Window_ChoiceList.prototype.resetFontSettings = function () {
        this.contents.fontFace = CHOICE_FONT_FILE ? CHOICE_FONT_FILE.split('.')[0] : $gameSystem.mainFontFace();
        this.contents.fontSize = CHOICE_FONT_SIZE || $gameSystem.mainFontSize();
        this.contents.textColor = CHOICE_FONT_COLOR || ColorManager.normalColor();
        this.contents.outlineWidth = CHOICE_FONT_OUTLINE ? 4 : 0;
        this.contents.outlineColor = CHOICE_FONT_OUTLINE_COLOR || ColorManager.outlineColor();
    };

    Window_ChoiceList.prototype.loadCustomWindowskin = function () {
        if (CHOICE_WINDOW_SKIN) {
            this.windowskin = ImageManager.loadSystem(CHOICE_WINDOW_SKIN);
        } else {
            this.windowskin = ImageManager.loadSystem('Window');
        }
    };

    Window_ChoiceList.prototype.calculateCustomY = function (messageY, messageHeight) {
        if (!CHOICE_WINDOW_Y) return null;

        try {
            return eval(CHOICE_WINDOW_Y);
        } catch (e) {
            console.error('Error in Choice Window Y formula:', e);
            return null;
        }
    };

    Window_ChoiceList.prototype.updatePlacement = function () {
        const messageY = this._messageWindow.y;
        const messageHeight = this._messageWindow.height;
        const choices = $gameMessage.choices();
        const maxCols = this.maxCols();

        this.numVisibleRows = function () {
            return Math.ceil(choices.length / maxCols);
        };

        const processedChoices = choices.map(choice => {
            const tempWindow = new Window_Base(new Rectangle(0, 0, 1000, 100));
            tempWindow._isWindow = false;

            let processedText = choice;

            // \V[n]
            processedText = processedText.replace(/\\V\[(\d+)\]/gi, (match, n) => {
                return $gameVariables.value(parseInt(n));
            });

            // \N[n]
            processedText = processedText.replace(/\\N\[(\d+)\]/gi, (match, n) => {
                const actor = $gameActors.actor(parseInt(n));
                return actor ? actor.name() : '';
            });

            // P[]
            processedText = processedText.replace(/\\P\[(\d+)\]/gi, (match, n) => {
                const actor = $gameParty.members()[parseInt(n) - 1];
                return actor ? actor.name() : '';
            });

            // G
            processedText = processedText.replace(/\\G/gi, TextManager.currencyUnit);

            // Color codes and others
            processedText = processedText.replace(/\\C\[(\d+)\]/gi, '');
            processedText = processedText.replace(/\\I\[(\d+)\]/gi, '    ');
            processedText = processedText.replace(/\\{/g, '');
            processedText = processedText.replace(/\\}/g, '');
            processedText = processedText.replace(/\\\\/g, '\\');

            tempWindow.destroy();
            return processedText;
        });

        // Set window width based on parameter and columns
        const maxWidth = Math.max(...processedChoices.map(choice => this.textWidth(choice)));

        this.width = maxCols === 1 ?
            (CHOICE_WIDTH > 0 ? CHOICE_WIDTH : maxWidth + this.padding * 4) :
            (CHOICE_WIDTH > 0 ? CHOICE_WIDTH : (maxWidth + this.padding * 4) * 2);

        this.height = this.fittingHeight(this.numVisibleRows());
        this.x = (Graphics.boxWidth - this.width) / 2;

        if (CHOICE_AUTO_POSITION) {
            const playerScreenY = this.calculatePlayerScreenY();
            const safeDistance = 50; // Minimum distance from objects
            const isBubbleMessage = !!$gameMessage.speakerName();
            const isMessageVisible = this._messageWindow.isOpen();

            // Calculate positions above and below player
            let positionAbove = playerScreenY - this.height - safeDistance;
            let positionBelow = playerScreenY + safeDistance;

            if (isMessageVisible) {
                const messageTop = messageY;
                const messageBottom = messageY + messageHeight;

                // For bubble messages, check both message bounds and player position
                if (isBubbleMessage) {
                    // Check if positions would overlap with bubble message
                    if (positionBelow < messageBottom && positionBelow + this.height > messageTop) {
                        positionBelow = messageBottom + 8;
                    }
                    if (positionAbove < messageBottom && positionAbove + this.height > messageTop) {
                        positionAbove = messageTop - this.height - 8;
                    }

                    // If bubble is in top half, prefer bottom placement
                    if (messageY < Graphics.boxHeight / 2) {
                        positionBelow = Math.max(positionBelow, messageBottom + 8);
                    } else {
                        // If bubble is in bottom half, prefer top placement
                        positionAbove = Math.min(positionAbove, messageTop - this.height - 8);
                    }
                } else {
                    // For normal messages
                    if (positionBelow < messageBottom && positionBelow + this.height > messageTop) {
                        positionBelow = messageBottom + 8;
                    }
                    if (positionAbove < messageBottom && positionAbove + this.height > messageTop) {
                        positionAbove = messageTop - this.height - 8;
                    }

                    // If both player and message are in bottom half, prefer top
                    const screenMiddle = Graphics.boxHeight / 2;
                    if (playerScreenY > screenMiddle && messageY > screenMiddle) {
                        positionAbove = 80;
                        positionBelow = 80;
                    }
                }
            }

            const wouldOverflowTop = positionAbove < 0;
            const wouldOverflowBottom = positionBelow + this.height > Graphics.boxHeight;

            if (!wouldOverflowBottom && (!isMessageVisible || positionBelow > messageY + messageHeight)) {
                // Prefer below if it fits and doesn't overlap with message
                targetY = positionBelow;
            } else if (!wouldOverflowTop && (!isMessageVisible || positionAbove + this.height < messageY)) {
                // Above
                targetY = positionAbove;
            } else {
                // If neither ideal position works, find best alternative
                const topOverflow = Math.abs(Math.min(0, positionAbove));
                const bottomOverflow = Math.abs(Math.max(0, (positionBelow + this.height) - Graphics.boxHeight));

                // Consider message window position in overflow calculation
                if (isMessageVisible) {
                    const messageOverlapTop = Math.max(0, messageY + messageHeight - positionAbove);
                    const messageOverlapBottom = Math.max(0, positionBelow + this.height - messageY);
                    targetY = (topOverflow + messageOverlapTop) < (bottomOverflow + messageOverlapBottom) ?
                        positionAbove : positionBelow;
                } else {
                    targetY = topOverflow < bottomOverflow ? positionAbove : positionBelow;
                }
            }

            // Final bounds check
            targetY = Math.max(0, Math.min(Graphics.boxHeight - this.height, targetY));

        } else {
            const customY = this.calculateCustomY(messageY, messageHeight);
            targetY = customY !== null ? customY : (messageY >= Graphics.boxHeight / 2 ?
                messageY - this.height - 8 : messageY + messageHeight + 8);
        }

        if (CHOICE_ANIMATION === 'moveToScene') {
            this.y = targetY < Graphics.boxHeight / 2 ? -this.height : Graphics.boxHeight;
            this._animating = true;
            this._animationProgress = 0;
        } else {
            this.y = targetY;
        }
    };

    Window_ChoiceList.prototype.calculatePlayerScreenY = function () {
        const tileHeight = $gameMap.tileHeight();
        const scrolledY = $gameMap._displayY;
        return Math.round(($gamePlayer.y - scrolledY) * tileHeight + tileHeight / 2);
    };

    // Create two columns
    //const _Window_ChoiceList_drawItem = Window_ChoiceList.prototype.drawItem;
    Window_ChoiceList.prototype.drawItem = function (index) {
        //const speakerName = $gameMessage.speakerName();
        //if (!speakerName) {
        //    _Window_ChoiceList_drawItem.call(this, index);
        //   return;
        //}

        const rect = this.itemLineRect(index);
        const text = this.commandName(index);

        this.resetFontSettings();

        const textWidth = this.textWidth(text);
        const availableWidth = rect.width - 16;

        let x = rect.x + 8;
        if (CHOICE_TEXT_ALIGN === 'center') {
            x = rect.x + (rect.width - textWidth) / 2;
        } else if (CHOICE_TEXT_ALIGN === 'right') {
            x = rect.x + rect.width - textWidth - 8;
        }

        // If text is too wide, scale it down
        if (textWidth > availableWidth) {
            const scale = availableWidth / textWidth;
            const context = this.contents.context;
            context.save();

            context.font = `${this.contents.fontSize}px ${this.contents.fontFace}`;
            context.fillStyle = this.contents.textColor;
            if (CHOICE_FONT_OUTLINE) {
                context.strokeStyle = this.contents.outlineColor;
                context.lineWidth = this.contents.outlineWidth;
            }

            // Adjust translation based on alignment
            let translateX = rect.x + 8;
            if (CHOICE_TEXT_ALIGN === 'center') {
                translateX = rect.x + rect.width / 2 - (textWidth * scale) / 2;
            } else if (CHOICE_TEXT_ALIGN === 'right') {
                translateX = rect.x + rect.width - (textWidth * scale) - 8;
            }

            context.translate(translateX, rect.y);
            context.scale(scale, 1);
            this.drawTextEx(text, 0, 0, textWidth);
            context.restore();
        } else {
            this.drawTextEx(text, x, rect.y, rect.width);
        }
    };

    Window_ChoiceList.prototype.itemRect = function (index) {
        const rect = new Rectangle();
        const maxCols = this.maxCols();

        if (maxCols === 1) {
            // Single column - center the item
            const itemWidth = this.innerWidth;
            const itemHeight = this.itemHeight();
            rect.width = itemWidth - 4;
            rect.height = itemHeight - 4;
            rect.x = 2;  // Small padding from edge
            rect.y = index * (itemHeight + this.spacing()) + 2;
        } else {
            // Two columns - original layout
            const itemWidth = (this.innerWidth - this.spacing() * (maxCols - 1)) / maxCols;
            const itemHeight = this.itemHeight();
            const colIndex = index % maxCols;
            const rowIndex = Math.floor(index / maxCols);
            rect.width = itemWidth - 4;
            rect.height = itemHeight - 4;
            rect.x = colIndex * (itemWidth + this.spacing()) + 2;
            rect.y = rowIndex * (itemHeight + this.spacing()) + 2;
        }

        return rect;
    };

    Window_ChoiceList.prototype.drawBackgroundRect = function (rect) {
        const x = rect.x;
        const y = rect.y;
        const w = rect.width;
        const h = rect.height;
        const radius = 10;
        const color1 = ColorManager.itemBackColor1();
        const color2 = ColorManager.itemBackColor2();
        const fillColor = color1;
        const strokeColor = color2;

        const context = this.contents.context;
        context.save();

        context.globalAlpha = 1;

        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + w - radius, y);
        context.quadraticCurveTo(x + w, y, x + w, y + radius);
        context.lineTo(x + w, y + h - radius);
        context.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        context.lineTo(x + radius, y + h);
        context.quadraticCurveTo(x, y + h, x, y + h - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();

        const gradient = context.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, fillColor);
        gradient.addColorStop(1, strokeColor);
        context.fillStyle = gradient;
        context.fill();

        context.strokeStyle = strokeColor;
        context.lineWidth = 1;
        context.stroke();
        context.restore();
    };

    Window_ChoiceList.prototype.maxCols = function () {
        const choices = $gameMessage.choices();
        if (CHOICE_STYLE === 'vertical' || choices.length <= 1) {
            return 1;
        }
        return 2;
    };

    Window_ChoiceList.prototype.rowSpacing = function () {
        return 4;
    };

    Window_ChoiceList.prototype.itemHeight = function () {
        return CHOICE_HEIGHT;
    };

    Window_ChoiceList.prototype.spacing = function () {
        return CHOICE_SPACE;
    };

    Window_ChoiceList.prototype.fittingHeight = function (numLines) {
        return numLines * this.itemHeight() + (numLines - 1) * this.spacing() + this.padding * 2;
    };

    Window_ChoiceList.prototype.itemLineRect = function (index) {
        const rect = this.itemRect(index);
        rect.x += 4;
        rect.width -= 8;
        rect.y = rect.y + (rect.height - this.lineHeight()) / 2;
        return rect;
    };

    // Wait till animation is finished before allowing player to choose
    Window_ChoiceList.prototype.isOpenAndActive = function () {
        const isAnimating = this._animating && CHOICE_ANIMATION === 'moveToScene';
        return this.isOpen() && this.active && !isAnimating;
    };

    const _Window_ChoiceList_update = Window_ChoiceList.prototype.update;
    Window_ChoiceList.prototype.update = function () {
        _Window_ChoiceList_update.call(this);

        if (this._animating) {
            this._animationProgress = Math.min(1, this._animationProgress + 0.03);

            const easeOut = 1 - Math.pow(1 - this._animationProgress, 1);
            this.y = this.y + (targetY - this.y) * easeOut;

            if (this._animationProgress >= 1) {
                this._animating = false;
                this.y = targetY;
            }
        }
    };

    const _Window_ChoiceList_show = Window_ChoiceList.prototype.show;
    Window_ChoiceList.prototype.show = function () {
        if (CHOICE_ANIMATION === 'moveToScene') {
            this.openness = 255;
            this._animating = true;
            this._animationProgress = 0;
        } else {
            _Window_ChoiceList_show.call(this);
        }
    };

    const _Window_ChoiceList_hide = Window_ChoiceList.prototype.hide;
    Window_ChoiceList.prototype.hide = function () {
        this._animating = false;
        _Window_ChoiceList_hide.call(this);
    };

    // GALV MESSAGE BACKGROUND_____________________________________
    if (Imported.Galv_MessageBackground) {
        const _Window_Message_setBackgroundType = Window_Message.prototype.setBackgroundType;
        Window_Message.prototype.setBackgroundType = function (type) {
            if ($gameMessage.speakerName()) {
                Galv.MBG.disable = true;
                this.opacity = type === 0 ? 255 : 0;
                if (type === 1) this.showBackgroundDimmer();
                return;
            }
            _Window_Message_setBackgroundType.call(this, type);
        };
    }

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.bubbleSettings = contents.bubbleSettings || {};
        contents.bubbleSettings.windowskin = currentBubbleWindowskin;
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (contents.bubbleSettings && contents.bubbleSettings.windowskin) {
            currentBubbleWindowskin = contents.bubbleSettings.windowskin;
        }
    };
})();