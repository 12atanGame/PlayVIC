/*:
 * @target MZ
 * @plugindesc Create progress HUD bars using Variables easily.
 * @author Sang Hendrix
 * @url https://sanghendrix.itch.io/
 * 
 * @help
 * Verion 1.4.1
 * For support, please contact:
 * Discord: https://discord.gg/YKPscqHV8b
 * ----------------------------------------------------------------------------
 * This is a plugin for RPG Maker MV/MZ that allows the creation of variable-based
 * HUD elements on the screen.
 * ----------------------------------------------------------------------------
 * HOW TO USE
 * ----------------------------------------------------------------------------
 * Please check the demo for some examples.
 * > To make a HUD bar follow an event:
 * >> In X|Y Position, write: event(id).x | Similar to Y: event(id).y
 * > To make a HUD bar follow the player:
 * >> IN X|Y Position, write: player.x | player.y
 * > Example: X: player.x | Y: player.y - 50
 * >> This will make the HUD bar follow the player and move slighty upward by 50 pixel
 * so the HUD bar appear above the head of the player.
 * ----------------------------------------------------------------------------
 * PARAMETERS EXPLAIN
 * ----------------------------------------------------------------------------
 * Display Switch | If this switch is ON, display this HUD
 * -------
 * Variable ID | The variable ID of this bar (example: hunger >>5<< /10)
 * Max Variable ID | The maximum variable ID (example: hunger 5/ >>10<<)
 * Width, Height, X, Y | The size and position of the bar
 * Bar Color | The color of your bar using hex code
 * Bar image | The image file for the bar, will replace Bar Color
 * -------
 * Frame Image (optional) | The frame image file that wrap the bar
 * Frame Background Image (optional) | Additional layer of image that will 
 * be displayed behind both previous images
 * Additional Images (optional) | Display any additional image you want on top of
 * everything. Spritesheet supported (animation)
 * -------
 * Flash when max | Flash the bar when variable ID reaches (equal to) Max variable ID (10/10)
 * ----------------------------------------------------------------------------
 * 
 * @param HUDs
 * @text HUD Elements
 * @type struct<HUD>[]
 * @desc List of HUD elements to be displayed on the screen.
 * @default []
 * 
 * @param smartHUDVisibility
 * @text Smart HUD Visibility
 * @type boolean
 * @desc HUD elements fade when player character is behind them
 * @default true
 * 
 * @param hideHUDDuringMessages
 * @text Hide during Messages
 * @type boolean
 * @desc Hide all HUD elements when message windows are displayed
 * @default false
 * 
 * @param customFontFile
 * @text Custom Font File
 * @type string
 * @desc Custom font for HUD's text elements, e.g. haha.ttf
 * @default 
 *
 */

/*~struct~HUD:
 * @param This bar is
 * @text Name
 * @type string
 * @desc Does nothing, just a name so you can identify what this bar is
 * @default 
 * 
 * @param switchID
 * @text Visibility Switch
 * @type switch
 * @desc The switch that controls the visibility of the HUD element.
 * @default 0
 * 
 * @param -------
 * @text --------------------------------
 * 
 * @param useAs
 * @text Use As
 * @type select
 * @option Variable
 * @value variable
 * @option Player HP
 * @value hp
 * @option Player MP
 * @value mp
 * @option Player EXP
 * @value exp
 * @desc What type of value to display in this HUD bar
 * @default variable
 * 
 * @param variableID
 * @text Variable Value
 * @type variable
 * @desc The game variable whose value will be represented by the HUD's progress bar.
 * @default 0
 *
 * @param maxVariableValue
 * @text Max Variable Value
 * @type variable
 * @desc The maximum value of the game variable for the HUD's progress bar.
 * @default 0
 * 
 * @param --------
 * @text --------------------------------
 * @type string
 *
 * @param sizeAndPosition
 * @text Size and Position
 * @type string
 * @desc Format: width, height, x, y. For x/y, can use event(id).x/y or player.x/y
 * @default 100, 20, 0, 0
 * 
 * @param barColor
 * @text Bar Color
 * @type string
 * @desc Hex color code for the bar when no image is used (e.g., #ff0000 for red)
 * @default #ff0000
 * 
 * @param barImage
 * @text Bar Image
 * @type file
 * @dir img/pictures
 * @desc (Optional) The image file used for the HUD's progress bar.
 * 
 * @param barDirection
 * @text Bar Fill Direction
 * @type select
 * @option Left to Right
 * @value leftToRight
 * @option Right to Left
 * @value rightToLeft
 * @desc Direction the bar fills/empties
 * @default leftToRight
 * 
 * @param ------
 * @text --------------------------------
 * @type string
 * 
 * @param frameImage
 * @text Frame Image
 * @type file
 * @dir img/pictures
 * @desc (Optional) The image file used as the foreground frame for the HUD bar.
 *
 * @param frameImageBack
 * @text Frame Background Image
 * @type file
 * @dir img/pictures
 * @desc (Optional) The image file used as the background frame behind the HUD bar.
 * 
 * @param additionalLayers
 * @text Additional Images
 * @type struct<AdditionalLayerSettings>[]
 * @desc List of additional images to be displayed
 * @default []
 * 
 * @param -----
 * @text --------------------------------
 * @type string
 * 
 * @param flashWhenMax
 * @text Flash When Max
 * @type boolean
 * @desc Whether the bar should flash when it reaches the maximum value.
 * @default false
 * 
 * @param -----65
 * @text --------------------------------
 * 
 * @param displayTextType
 * @text Display Text Value
 * @type select
 * @option None
 * @value none
 * @option Variable
 * @value variable
 * @option Variable / Max Variable
 * @value variableMax
 * @option Player HP
 * @value playerHp
 * @option Player HP / Max HP
 * @value playerHpMax
 * @option Player MP
 * @value playerMp
 * @option Player MP / Max MP
 * @value playerMpMax
 * @option Player EXP
 * @value playerExp
 * @option Player EXP / Max EXP
 * @value playerExpMax
 * @desc Choose what type of text to display on the HUD
 * @default none
 * 
 * @param fontSettings
 * @text Font Settings
 * @type struct<FontSettings>
 * @desc Font settings for variable text display
 * @default {"size":"","color":"","outline":"true","outlineColor":"","offsetX":"0","offsetY":"0"}
 */

/*~struct~FontSettings:
* @param size
* @text Font Size
* @type number
* @desc Font size for the variable text. Empty to use game default.
* @default 
* 
* @param color
* @text Font Color
* @type string
* @desc Hex color code for variable text (e.g., #ffffff). Leave empty to use game default.
* @default 
* 
* @param outline
* @text Enable Outline
* @type boolean
* @desc Enable text outline for variable text
* @default true
* 
* @param outlineColor
* @text Outline Color
* @type string
* @desc Hex color code for text outline (e.g., #000000). Leave empty to use game default.
* @default 
* 
* @param offsetX
* @text X Offset
* @type number
* @min -999
* @desc Horizontal offset for variable text position. Leave empty for center.
* @default 0
* 
* @param offsetY
* @text Y Offset
* @type number
* @min -999
* @desc Vertical offset for variable text position. Leave empty for center.
* @default 0
*/

/*~struct~AdditionalLayerSettings:
 * @param image
 * @text Image File
 * @type file
 * @dir img/pictures
 * @desc The image file to use (can be regular image or spritesheet)
 * 
 * @param row
 * @text Spritesheet Rows
 * @type number
 * @desc Number of rows in the spritesheet. Leave 0 for regular image.
 * @default 0
 * 
 * @param column
 * @text Spritesheet Columns
 * @type number
 * @desc Number of columns in the spritesheet. Leave 0 for regular image.
 * @default 0
 * 
 * @param fps
 * @text Animation FPS
 * @type number
 * @desc Frames per second for spritesheet animation (e.g. 60 for 60fps)
 * @default 15
 * 
 * @param xOffset
 * @text X Offset
 * @type string
 * @desc The X offset from the HUD's position. Can use JavaScript eval
 * @default 0
 * 
 * @param yOffset
 * @text Y Offset
 * @type string
 * @desc The Y offset from the HUD's position. Can use JavaScript eval
 * @default 0
 * 
 * @param dragAndDrop
 * @text Drag and Drop
 * @type boolean
 * @desc Allow this image to be dragged when in drag and drop mode.
 * @default true
 */

(() => {
    const pluginName = "Hendrix_HUD_Creator";
    let parameters = PluginManager.parameters(pluginName);
    let HUDs = JSON.parse(parameters['HUDs'] || '[]').map(hud => {
        const parsed = JSON.parse(hud);
        if (parsed.additionalLayers) {
            parsed.additionalLayers = JSON.parse(parsed.additionalLayers || '[]').map(layer => JSON.parse(layer));
        }
        return parsed;
    });
    const smartHUDVisibility = (parameters['smartHUDVisibility'] || 'true') === 'true';
    const hideHUDDuringMessages = (parameters['hideHUDDuringMessages'] || 'false') === 'true';

    const loadCustomFont = (fontFile) => {
        if (!fontFile) return null;
        try {
            const fontFace = fontFile.split('.')[0];
            const fontPath = `fonts/${fontFile}`;
            if (Utils.isNwjs()) {
                const customFont = new FontFace(fontFace, `url('${fontPath}')`);
                customFont.load().then(function (loadedFont) {
                    document.fonts.add(loadedFont);
                }).catch(error => {
                    console.error('Error loading font:', error);
                });
            } else {
                const style = document.createElement('style');
                style.textContent = `
                    @font-face {
                        font-family: '${fontFace}';
                        src: url('${fontPath}');
                    }
                `;
                document.head.appendChild(style);
            }
            return fontFace;
        } catch (e) {
            console.error('Error loading custom font:', e);
            return null;
        }
    };

    const HUDcustomFont = loadCustomFont(parameters['customFontFile']);

    class SpriteSheetSprite extends Sprite {
        initialize(bitmap, row, column, fps) {
            super.initialize();

            this._row = Number(row) || 1;
            this._column = Number(column) || 1;
            this._fps = Number(fps) || 60;
            this._frameIndex = 0;
            this._maxFrame = this._row * this._column;
            this._frameDelay = Math.round(60 / this._fps);
            this._frameCount = 0;
            this._frameWidth = 0;
            this._frameHeight = 0;
            this._isReady = false;

            if (bitmap) {
                this.bitmap = bitmap;
                bitmap.addLoadListener(() => {
                    this._frameWidth = Math.floor(bitmap.width / this._column);
                    this._frameHeight = Math.floor(bitmap.height / this._row);
                    this._isReady = true;
                    this._updateFrame();
                });
            }
        }

        _updateFrame() {
            if (!this._isReady) return;

            const col = this._frameIndex % this._column;
            const row = Math.floor(this._frameIndex / this._column);

            const sx = col * this._frameWidth;
            const sy = row * this._frameHeight;

            this.setFrame(sx, sy, this._frameWidth, this._frameHeight);
        }
    }

    function evaluatePosition(expression, hud) {
        if (typeof expression !== 'string') return Number(expression);

        let evalExpression = expression;

        evalExpression = evalExpression.replace(/event\((\d+)\)\.([xy])/gi, (match, eventId, coord) => {
            const event = $gameMap.event(parseInt(eventId));
            if (!event) {
                return hud && hud.lastValidPosition ?
                    (coord.toLowerCase() === 'x' ? hud.lastValidPosition.x : hud.lastValidPosition.y).toString() :
                    '0';
            }
            const value = coord.toLowerCase() === 'x' ? event.screenX() : event.screenY();
            return value.toString();
        });

        evalExpression = evalExpression.replace(/player\.([xy])/gi, (match, coord) => {
            const value = coord.toLowerCase() === 'x' ? $gamePlayer.screenX() : $gamePlayer.screenY();
            return value.toString();
        });

        try {
            const result = eval(evalExpression);
            return result;
        } catch (e) {
            return hud && hud.lastValidPosition ?
                (expression.includes('.x') ? hud.lastValidPosition.x : hud.lastValidPosition.y) :
                0;
        }
    }

    class Hendrix_HUD {
        constructor(hudData, index) {
            // Basic HUD settings
            this.switchID = Number(hudData.switchID);
            this.index = index;
            this.useAs = hudData.useAs || 'variable';
            this.variableID = Number(hudData.variableID);
            this.maxVariableValue = Number(hudData.maxVariableValue);
            this.currentValue = this.getCurrentValue();
            this.displayValue = this.currentValue;

            const [width, height, x, y] = (hudData.sizeAndPosition || "100, 20, 0, 0")
                .split(',')
                .map(val => val.trim());

            // Size and position
            this.width = Number(width);
            this.height = Number(height);
            this.xExpression = x;
            this.yExpression = y;
            this.lastValidPosition = null;

            this.originalX = this.evaluateX();
            this.originalY = this.evaluateY();

            if (window.$hudPositions && window.$hudPositions[index]) {
                this.x = window.$hudPositions[index].x;
                this.y = window.$hudPositions[index].y;
            } else {
                this.x = this.originalX;
                this.y = this.originalY;
            }

            // Visual settings
            this.frameImageBack = hudData.frameImageBack;
            this.frameImage = hudData.frameImage;
            this.barColor = hudData.barColor || '#ff0000';
            this.barImage = hudData.barImage;
            this.barDirection = hudData.barDirection || 'leftToRight';
            this._messageFadeOpacity = 255;
            this._previousMessageState = false;
            this._fadeDuration = 15;

            // Flash effect stuff
            this.flashDuration = 0;
            this.flashIntensity = 0;
            this.flashWhenMax = hudData.flashWhenMax === 'true';

            // Additional layers
            this.additionalLayers = hudData.additionalLayers || [];
            this.additionalSprites = [];

            // Text display settings
            this.displayTextType = hudData.displayTextType || 'none';
            const fontSettings = hudData.fontSettings ? JSON.parse(hudData.fontSettings) : {};
            this.variableTextSize = Number(fontSettings.size) || 0;
            this.variableTextColor = fontSettings.color || '';
            this.variableTextOutline = fontSettings.outline !== 'false';
            this.variableTextOutlineColor = fontSettings.outlineColor || '';
            this.variableTextOffsetX = Number(fontSettings.offsetX) || 0;
            this.variableTextOffsetY = Number(fontSettings.offsetY) || 0;

            this._isDragging = false;
            this._dragOffsetX = 0;
            this._dragOffsetY = 0;
            this.originalX = this.x;
		    this.originalY = this.y;

            this.createHUD();
            this.updateVisibility();
        }

        isPositionBound() {
            const hasEventBinding = this.xExpression.includes('event(') ||
                this.yExpression.includes('event(');
            const hasPlayerBinding = this.xExpression.includes('player.') ||
                this.yExpression.includes('player.');
            return hasEventBinding || hasPlayerBinding;
        }

        evaluateX() {
            return evaluatePosition(this.xExpression);
        }

        evaluateY() {
            return evaluatePosition(this.yExpression);
        }

        getCurrentValue() {
            switch (this.useAs) {
                case 'hp':
                    return $gameParty.leader() ? $gameParty.leader().hp : 0;
                case 'mp':
                    return $gameParty.leader() ? $gameParty.leader().mp : 0;
                case 'exp':
                    return $gameParty.leader() ? $gameParty.leader().currentExp() - $gameParty.leader().currentLevelExp() : 0;
                default:
                    return $gameVariables.value(this.variableID);
            }
        }

        getMaxValue() {
            switch (this.useAs) {
                case 'hp':
                    return $gameParty.leader() ? $gameParty.leader().mhp : 1;
                case 'mp':
                    return $gameParty.leader() ? $gameParty.leader().mmp : 1;
                case 'exp':
                    return $gameParty.leader() ? $gameParty.leader().nextLevelExp() - $gameParty.leader().currentLevelExp() : 1;
                default:
                    return $gameVariables.value(this.maxVariableValue);
            }
        }

        createHUD() {
            this.container = new PIXI.Container();
            this.container.x = this.x;
            this.container.y = this.y;
            SceneManager._scene.addChild(this.container);

            // Create frame background sprite (Layer 1)
            const frameBackSprite = new Sprite();
            frameBackSprite.bitmap = ImageManager.loadPicture(this.frameImageBack);
            frameBackSprite.anchor.x = 0.5;
            frameBackSprite.anchor.y = 0.5;
            this.container.addChild(frameBackSprite);
            this.frameBackSprite = frameBackSprite;

            // Create bar sprite (Layer 2)
            const barBitmap = new Bitmap(this.width, this.height);
            const barSprite = new Sprite(barBitmap);
            barSprite.anchor.x = 0.5;
            barSprite.anchor.y = 0.5;
            this.container.addChild(barSprite);
            this.barSprite = barSprite;

            // Create flash sprite (Layer 3)
            if (this.flashWhenMax) {
                const flashSprite = new Sprite(new Bitmap(this.width, this.height));
                flashSprite.anchor.x = 0.5;
                flashSprite.anchor.y = 0.5;
                flashSprite.blendMode = PIXI.BLEND_MODES.ADD;
                this.container.addChild(flashSprite);
                this.flashSprite = flashSprite;
            }

            // Create frame sprite (Layer 4)
            const frameSprite = new Sprite();
            frameSprite.bitmap = ImageManager.loadPicture(this.frameImage);
            frameSprite.anchor.x = 0.5;
            frameSprite.anchor.y = 0.5;
            this.container.addChild(frameSprite);
            this.frameSprite = frameSprite;

            // Create additional layer (Layer 5)
            if (this.additionalLayers.length > 0) {
                this.createAdditionalLayers();
            }

            // Create text sprite (Final Layer)
            if (this.displayTextType !== 'none') {
                const textSprite = new Sprite(new Bitmap(this.width, this.height));
                textSprite.anchor.x = 0.5;
                textSprite.anchor.y = 0.5;
                textSprite.x = this.variableTextOffsetX;
                textSprite.y = this.variableTextOffsetY;
                this.container.addChild(textSprite);
                this.textSprite = textSprite;
            }
        }

        createAdditionalLayers() {
            this.additionalSprites = [];

            for (const layerData of this.additionalLayers) {
                if (!layerData || !layerData.image) continue;

                const row = Number(layerData.row || 0);
                const column = Number(layerData.column || 0);
                const fps = Number(layerData.fps || 60);
                const isSpritesheetAnimation = row > 0 && column > 0;

                const bitmap = ImageManager.loadPicture(layerData.image);

                let sprite;
                if (isSpritesheetAnimation) {
                    sprite = new SpriteSheetSprite();
                    sprite.initialize(bitmap, row, column, fps);
                } else {
                    sprite = new Sprite();
                    sprite.bitmap = bitmap;
                }

                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                sprite.layerData = layerData;

                sprite._isDragging = false;
                sprite._dragOffsetX = 0;
                sprite._dragOffsetY = 0;
                sprite._originalXOffset = Number(layerData.xOffset) || 0;
                sprite._originalYOffset = Number(layerData.yOffset) || 0;
                sprite._canDragAndDrop = layerData.dragAndDrop !== 'false' && layerData.dragAndDrop !== false;

                if (window.$hudPositions &&
                    window.$hudPositions.additionalLayers &&
                    window.$hudPositions.additionalLayers[this.index + '_' + layerData.image]) {
                    const savedPos = window.$hudPositions.additionalLayers[`${this.index}_${layerData.image}`];
                    layerData.xOffset = savedPos.xOffset;
                    layerData.yOffset = savedPos.yOffset;
                }

                this.container.addChild(sprite);
                this.additionalSprites.push(sprite);
            }

            this.updateAdditionalLayerPositions();
        }

        updateAdditionalLayerPositions() {
            for (const sprite of this.additionalSprites) {
                if (!sprite || !sprite.layerData) continue;

                const xOffset = isNaN(sprite.layerData.xOffset) ?
                    eval(sprite.layerData.xOffset) :
                    Number(sprite.layerData.xOffset);

                const yOffset = isNaN(sprite.layerData.yOffset) ?
                    eval(sprite.layerData.yOffset) :
                    Number(sprite.layerData.yOffset);

                sprite.x = xOffset;
                sprite.y = yOffset;
            }
        }

        isPlayerBehind() {
            if (!smartHUDVisibility) return false;
            const playerSprite = SceneManager._scene._spriteset._characterSprites.find(
                sprite => sprite._character === $gamePlayer
            );
            if (!playerSprite) return false;
            const playerWidth = playerSprite.patternWidth ? playerSprite.patternWidth() : $gameMap.tileWidth();
            const playerHeight = playerSprite.patternHeight ? playerSprite.patternHeight() : $gameMap.tileHeight();

            const playerScreenX = $gamePlayer.screenX();
            const playerScreenY = $gamePlayer.screenY();

            const playerLeft = playerScreenX - playerWidth / 2;
            const playerRight = playerScreenX + playerWidth / 2;
            const playerTop = playerScreenY - playerHeight;
            const playerBottom = playerScreenY;

            const hudLeft = this.container.x - this.width / 2;
            const hudRight = hudLeft + this.width;
            const hudTop = this.container.y - this.height / 2;
            const hudBottom = hudTop + this.height;

            return (
                playerRight > hudLeft &&
                playerLeft < hudRight &&
                playerBottom > hudTop &&
                playerTop < hudBottom
            );
        };

        getDisplayText() {
            switch (this.displayTextType) {
                case 'none':
                    return '';
                case 'variable':
                    return `${Math.round(this.displayValue)}`;
                case 'variableMax':
                    return `${Math.round(this.displayValue)}/${this.getMaxValue()}`;
                case 'playerHp':
                    const leader = $gameParty.leader();
                    return leader ? `${leader.hp}` : '0';
                case 'playerHpMax':
                    const leaderHp = $gameParty.leader();
                    return leaderHp ? `${leaderHp.hp}/${leaderHp.mhp}` : '0/0';
                case 'playerMp':
                    const leaderMp = $gameParty.leader();
                    return leaderMp ? `${leaderMp.mp}` : '0';
                case 'playerMpMax':
                    const leaderMpMax = $gameParty.leader();
                    return leaderMpMax ? `${leaderMpMax.mp}/${leaderMpMax.mmp}` : '0/0';
                case 'playerExp':
                    const leaderExp = $gameParty.leader();
                    return leaderExp ? `${leaderExp.currentExp() - leaderExp.currentLevelExp()}` : '0';
                case 'playerExpMax':
                    const leaderExpMax = $gameParty.leader();
                    return leaderExpMax ? `${leaderExpMax.currentExp() - leaderExpMax.currentLevelExp()}/${leaderExpMax.nextLevelExp() - leaderExpMax.currentLevelExp()}` : '0/0';
                default:
                    return `${Math.round(this.displayValue)}/${this.getMaxValue()}`;
            }
        }

        updateVisibility() {
            if (this.switchID > 0) {
                const isVisible = $gameSwitches.value(this.switchID);
                this.container.visible = isVisible;
            }
        }

        updatePosition(visibleHUDs) {
            if (SceneManager._scene._isVarBarDragMode ||
                (window.$hudPositions && window.$hudPositions[this.index])) return;

            const newX = this.evaluateX();
            const newY = this.evaluateY();

            if (newX !== 0 || newY !== 0 || !this.lastValidPosition) {
                this.lastValidPosition = {
                    x: newX,
                    y: newY
                };
            }

            this.originalX = newX;
            this.originalY = newY;

            let offset = 0;
            for (let i = 0; i < this.index; i++) {
                if (visibleHUDs[i] &&
                    visibleHUDs[i].originalX === this.originalX &&
                    visibleHUDs[i].originalY === this.originalY &&
                    visibleHUDs[i].height === this.height) {
                    offset += 20;
                }
            }

            this.x = this.originalX;
            this.y = this.originalY - offset;
            this.container.x = this.x;
            this.container.y = this.y;
        }

        updateDrag() {
            if (!SceneManager._scene._isVarBarDragMode ||
                !Utils.isOptionValid('test') ||
                this.isPositionBound()) return;

            if (!this._isDragging) {
                for (const sprite of this.additionalSprites) {
                    if (!sprite._isDragging && sprite._canDragAndDrop && TouchInput.isTriggered()) {
                        const touchX = TouchInput.x;
                        const touchY = TouchInput.y;
                        const width = sprite._frameWidth || sprite.width;
                        const height = sprite._frameHeight || sprite.height;

                        const rect = new Rectangle(
                            this.container.x + sprite.x - width / 2,
                            this.container.y + sprite.y - height / 2,
                            width,
                            height
                        );

                        if (touchX >= rect.x && touchX <= rect.x + rect.width &&
                            touchY >= rect.y && touchY <= rect.y + rect.height) {
                            sprite._isDragging = true;
                            sprite._dragOffsetX = sprite.x - (touchX - this.container.x);
                            sprite._dragOffsetY = sprite.y - (touchY - this.container.y);
                            return;
                        }
                    }
                }
            }

            if (!this._isDragging && TouchInput.isTriggered()) {
                const touchX = TouchInput.x;
                const touchY = TouchInput.y;
                const rect = new Rectangle(
                    this.container.x - this.width / 2,
                    this.container.y - this.height / 2,
                    this.width,
                    this.height
                );

                if (touchX >= rect.x && touchX <= rect.x + rect.width &&
                    touchY >= rect.y && touchY <= rect.y + rect.height) {
                    this._isDragging = true;
                    this._dragOffsetX = this.container.x - touchX;
                    this._dragOffsetY = this.container.y - touchY;
                }
            }

            if (this._isDragging) {
                if (TouchInput.isPressed()) {
                    this.container.x = TouchInput.x + this._dragOffsetX;
                    this.container.y = TouchInput.y + this._dragOffsetY;

                    this.container.x = Math.max(this.width / 2, Math.min(Graphics.width - this.width / 2, this.container.x));
                    this.container.y = Math.max(this.height / 2, Math.min(Graphics.height - this.height / 2, this.container.y));

                    this.x = this.container.x;
                    this.y = this.container.y;
                } else {
                    this._isDragging = false;

                    if (!this.isPositionBound()) {
                        window.$hudPositions = window.$hudPositions || {};
                        window.$hudPositions[this.index] = {
                            x: this.x,
                            y: this.y
                        };
                        saveUIPositions(window.$hudPositions);
                    }
                }
            }

            for (const sprite of this.additionalSprites) {
                if (sprite._isDragging && sprite._canDragAndDrop) {
                    if (TouchInput.isPressed()) {
                        sprite.x = TouchInput.x - this.container.x + sprite._dragOffsetX;
                        sprite.y = TouchInput.y - this.container.y + sprite._dragOffsetY;

                        sprite.layerData.xOffset = sprite.x;
                        sprite.layerData.yOffset = sprite.y;
                    } else {
                        sprite._isDragging = false;

                        if (!this.isPositionBound()) {
                            window.$hudPositions = window.$hudPositions || {
                                additionalLayers: {}
                            };
                            if (!window.$hudPositions.additionalLayers) {
                                window.$hudPositions.additionalLayers = {};
                            }

                            window.$hudPositions.additionalLayers[`${this.index}_${sprite.layerData.image}`] = {
                                xOffset: sprite.x,
                                yOffset: sprite.y
                            };
                            saveUIPositions(window.$hudPositions);
                        }
                    }
                }
            }
        }

        updateText() {
		if (!this.textSprite || this.displayTextType === 'none') return;

		const bitmap = this.textSprite.bitmap;
		bitmap.clear();

		if (HUDcustomFont) {
			bitmap.fontFace = HUDcustomFont;
		}
		if (this.variableTextSize > 0) {
			bitmap.fontSize = this.variableTextSize;
		}
		if (this.variableTextColor) {
			bitmap.textColor = this.variableTextColor;
		}
		if (this.variableTextOutline) {
			bitmap.outlineWidth = 4;
			if (this.variableTextOutlineColor) {
				bitmap.outlineColor = this.variableTextOutlineColor;
			}
		}

		const text = this.getDisplayText();
		bitmap.drawText(text, 0, 0, this.width, this.height, 'center');
	}

        updateHUD() {
		this.updateAdditionalLayerPositions();
		for (const sprite of this.additionalSprites) {
			if (!(sprite instanceof SpriteSheetSprite) || !sprite._isReady) continue;

			sprite._frameCount++;
			if (sprite._frameCount >= sprite._frameDelay) {
				sprite._frameCount = 0;
				sprite._frameIndex = (sprite._frameIndex + 1) % sprite._maxFrame;
				sprite._updateFrame();
			}
		}
		let prevValue = this.currentValue;
		this.currentValue = Math.min(
			this.getCurrentValue(),
			this.getMaxValue()
		);
		this.displayValue = this.interpolate(this.displayValue, this.currentValue, 0.3);
		let barWidth = (this.width * this.displayValue) / this.getMaxValue();
		this.barSprite.bitmap.clear();

		if (this.barImage) {
			let img = ImageManager.loadPicture(this.barImage);
			if (this.barDirection === 'rightToLeft') {
				const xOffset = this.width - barWidth;
				this.barSprite.bitmap.blt(img, img.width - barWidth, 0, barWidth, img.height, xOffset, 0, barWidth, this.height);
			} else {
				this.barSprite.bitmap.blt(img, 0, 0, img.width, img.height, 0, 0, barWidth, this.height);
			}
		} else {
			if (this.barDirection === 'rightToLeft') {
				const xOffset = this.width - barWidth;
				this.barSprite.bitmap.fillRect(xOffset, 0, barWidth, this.height, this.barColor);
			} else {
				this.barSprite.bitmap.fillRect(0, 0, barWidth, this.height, this.barColor);
			}
		}
		if (this.currentValue === this.getMaxValue() && prevValue !== this.currentValue) {
			this.startFlash();
		}
		this.updateFlash();
		this.updateVisibility();
		if (hideHUDDuringMessages) {
			const isMessageVisible = $gameMessage.isBusy();
			if (this._previousMessageState !== isMessageVisible) {
				this._previousMessageState = isMessageVisible;
				if (!isMessageVisible && (this.switchID <= 0 || $gameSwitches.value(this.switchID))) {
					this.container.visible = true;
				}
			}
			const fadeStep = 255 / this._fadeDuration;

			if (isMessageVisible) {
				this._messageFadeOpacity -= fadeStep;
				if (this._messageFadeOpacity < 0) this._messageFadeOpacity = 0;
			} else {
				this._messageFadeOpacity += fadeStep;
				if (this._messageFadeOpacity > 255) this._messageFadeOpacity = 255;
			}
			if (this._messageFadeOpacity <= 0) {
				this.container.visible = false;
			}
		} else {
			this._messageFadeOpacity = 255;
		}
		if (this.container.visible) {
			const isBehindPlayer = this.isPlayerBehind();
			const messageFadeAlpha = this._messageFadeOpacity / 255;

			if (isBehindPlayer) {
				const targetAlpha = Math.min(0.3, messageFadeAlpha);
				this.container.alpha = Math.max(targetAlpha, this.container.alpha - 0.1);
			} else {
				this.container.alpha = Math.min(messageFadeAlpha, this.container.alpha + 0.1);
			}
		}
		if (this.displayTextType !== 'none') {
			this.updateText();
		}
	}

        interpolate(current, target, speed) {
            if (current < target) {
                return Math.min(current + speed * (target - current), target);
            } else {
                return Math.max(current - speed * (current - target), target);
            }
        }

        startFlash() {
            this.flashDuration = 10;
            this.flashIntensity = 180;
        }

        updateFlash() {
            if (this.flashWhenMax) {
                if (this.flashDuration > 0) {
                    this.flashDuration--;
                    this.flashIntensity = Math.floor((this.flashDuration / 15) * 255);

                    this.flashSprite.bitmap.clear();
                    this.flashSprite.bitmap.fillAll(`rgba(255, 255, 255, ${this.flashIntensity / 255})`);
                } else {
                    this.flashSprite.bitmap.clear();
                }
            }
        }
    }

    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function () {
        _Scene_Map_createAllWindows.call(this);
        this._isVarBarDragMode = false;
        this.createHUDResetButton();
        this.createHuds();
    };

    function saveUIPositions(positions) {
        try {
            if (Utils.isNwjs()) {
                const fs = require('fs');
                const path = require('path');
                const filePath = path.join(process.mainModule.filename, '..', 'js', 'variableBarPosition.json');
                try {
                    fs.writeFileSync(filePath, JSON.stringify(positions, null, 2));
                } catch (e) {
                    console.error('Error saving variableBarPosition.json:', e);
                }
            }
        } catch (e) {
            console.error('Error in saveUIPositions:', e);
        }
    }

    function readUIPositions() {
        try {
            if (Utils.isNwjs()) {
                const fs = require('fs');
                const path = require('path');
                const filePath = path.join(process.mainModule.filename, '..', 'js', 'variableBarPosition.json');
                if (fs.existsSync(filePath)) {
                    try {
                        const data = fs.readFileSync(filePath, 'utf8');
                        return JSON.parse(data);
                    } catch (e) {
                        console.error('Error reading variableBarPosition.json:', e);
                        return { additionalLayers: {} };
                    }
                }
            }
        } catch (e) {
            console.error('Error in readUIPositions:', e);
        }
        return { additionalLayers: {} };
    }

    function loadPositionsFromFile() {
        if (!Utils.isNwjs()) {
            fetch('js/variableBarPosition.json')
                .then(response => response.json())
                .then(data => {
                    window.$hudPositions = data;
                    localStorage.setItem('HendrixVariableBarPositions', JSON.stringify(data));
                })
                .catch(error => {
                    window.$hudPositions = { additionalLayers: {} };
                });
        }
    }

    window.$hudPositions = readUIPositions();
    if (!Utils.isNwjs()) {
        setTimeout(loadPositionsFromFile, 500);
    }

    Scene_Map.prototype.createHuds = function () {
        this._hendrixHuds = HUDs.map((hudData, index) => {
            const hud = new Hendrix_HUD(hudData, index);

            if (window.$hudPositions && window.$hudPositions[index]) {
                hud.x = window.$hudPositions[index].x;
                hud.y = window.$hudPositions[index].y;
                hud.container.x = hud.x;
                hud.container.y = hud.y;
            }

            return hud;
        });

        this.updateHudPositions();
    };

    Scene_Map.prototype.updateHudPositions = function () {
        const visibleHUDs = this._hendrixHuds.filter(hud => hud.container.visible);
        visibleHUDs.forEach(hud => hud.updatePosition(visibleHUDs));
    };

    Scene_Map.prototype.createHUDResetButton = function () {
        this._resetButton = new Sprite();
        this._resetButton.bitmap = new Bitmap(100, 40);
        this._resetButton.x = (Graphics.width - 100) / 2;
        this._resetButton.y = 20;
        this._resetButton.bitmap.fillRect(0, 0, 100, 40, '#666666');
        this._resetButton.bitmap.fontSize = 20;
        this._resetButton.textColor = '#ffffff';
        this._resetButton.bitmap.drawText('RESET', 0, 0, 100, 40, 'center');
        this._resetButton.visible = false;
        this.addChild(this._resetButton);
    };

    Scene_Map.prototype.toggleHUDDragMode = function () {
        if (!Utils.isOptionValid('test')) return;

        this._isVarBarDragMode = !this._isVarBarDragMode;
        this._resetButton.visible = this._isVarBarDragMode;

        if (!this._isVarBarDragMode && this._hendrixHuds) {
            const positions = {};
            this._hendrixHuds.forEach(hud => {
                if (!hud.isPositionBound()) {
                    positions[hud.index] = {
                        x: hud.x,
                        y: hud.y
                    };

                    if (!positions.additionalLayers) positions.additionalLayers = {};
                    hud.additionalSprites.forEach(sprite => {
                        if (sprite.layerData) {
                            positions.additionalLayers[`${hud.index}_${sprite.layerData.image}`] = {
                                xOffset: sprite.x,
                                yOffset: sprite.y
                            };
                        }
                    });
                }
            });
            window.$hudPositions = positions;
            saveUIPositions(positions);
        }
    };

    Scene_Map.prototype.resetHUDPositions = function () {
        if (this._hendrixHuds) {
            this._hendrixHuds.forEach(hud => {
                const newX = hud.evaluateX();
                const newY = hud.evaluateY();

                hud.x = newX;
                hud.y = newY;
                hud.container.x = newX;
                hud.container.y = newY;

                hud.originalX = newX;
                hud.originalY = newY;

                hud.additionalSprites.forEach(sprite => {
                    sprite.x = sprite._originalXOffset;
                    sprite.y = sprite._originalYOffset;
                    sprite.layerData.xOffset = sprite._originalXOffset;
                    sprite.layerData.yOffset = sprite._originalYOffset;
                });
            });

            window.$hudPositions = {
                additionalLayers: {}
            };
            saveUIPositions(window.$hudPositions);
        }
    };

    Scene_Map.prototype.updateHUDResetButton = function () {
        if (!this._isVarBarDragMode || !this._resetButton) return;

        if (TouchInput.isTriggered()) {
            const x = TouchInput.x;
            const y = TouchInput.y;
            if (x >= this._resetButton.x && x <= this._resetButton.x + 100 &&
                y >= this._resetButton.y && y <= this._resetButton.y + 40) {
                this.resetHUDPositions();
            }
        }
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        this._hendrixHuds.forEach(hud => {
            if (hud.isPositionBound()) {
                const newX = evaluatePosition(hud.xExpression);
                const newY = evaluatePosition(hud.yExpression);
                hud.container.x = newX;
                hud.container.y = newY;
            }
            hud.updateHUD();
        });

        if (Input.isTriggered('pagedown') && Utils.isOptionValid('test')) {
            this.toggleHUDDragMode();
        }

        if (this._isVarBarDragMode) {
            this.updateHUDResetButton();
            if (this._hendrixHuds) {
                this._hendrixHuds.forEach(hud => hud.updateDrag());
            }
        }
    };
})();