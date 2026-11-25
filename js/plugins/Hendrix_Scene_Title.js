/*:
 * @target MZ
 * @plugindesc Heavily customize your default Scene Title using animated background or videos.
 * @author Sang Hendrix
 * @url https://sanghendrix.itch.io/
 * 
 * @help
 *
 * Verion 1.1.1
 * ----------------------------------------------------------------------------
 * This is a plugin for RPG Maker MZ that allows you to customize your
 * Scene Title. Add more commands, pictures to the scene and make your
 * background animated or use a video as your background.
 * ----------------------------------------------------------------------------
 * FEATURES
 * - Add more commands that can call as script or a common event Id.
 * - Add as many pictures as you want to the scene and adjust their position.
 * - Use multiple frames of pictures to play as an animated background.
 * - Use a video to play as the background.
 * - Adjust font name, size, color.
 * - Some other minor customizations.
 * ----------------------------------------------------------------------------
 * CHANGELOG
 * [ver 1.1.0] New feature: Assign different video background or animated title
 *             with different Switches.
 * [ver 1.0.4] Adjusted the default value of a parameter
 * [ver 1.0.3] Fixed the issue command list being cropped.
 * [ver 1.0.2] Bug fixes and now support webm video.
 * The plugin will always prefer webm, which playable on PC, Linux and Android.
 * If you don't have webm video inside movies folder, it'll search for mp4.
 * [ver 1.0.1] Use default game font color if param Font Color is empty.
 * [ver 1.0.0] Released!
 * ----------------------------------------------------------------------------
 * HOW TO USE
 * Just mess around with the parameters. But do remember, if you use animated
 * background feature and video as the background at the same time, the video
 * will cover your animated background. You can leave it as it or remove
 * your animated background because they're still playing underneath, which
 * probably cost performance. Not huge, but still.
 * ----------------------------------------------------------------------------
 * For feedback or feature request, please dm me on X (Twitter) or Facebook:
 * https://x.com/sanghendrix96
 * https://www.facebook.com/hendrixguy/
 * 
 * @param additionalImages
 * @text Pictures to show on Scene
 * @type struct<ImageStruct>[]
 * @desc List of images with their positions to be displayed on top of the title screen.
 * 
 * @param decor1
 * @text -------------------------------
 * @type text
 * @default -------------------------------
 * 
 * @param backgroundSettings
 * @text Background Settings
 * @type struct<BackgroundSettings>[]
 * @desc Multiple background configurations that can be controlled by switches.
 * @default []
 * 
 * @param decor2
 * @text -------------------------------
 * @type text
 * @default -------------------------------
 *
 * @param options
 * @text Commands
 * @type struct<Option>[]
 * @desc The list of commands to add to the Scene_Title
 * @default []
 * 
 * @param decor3
 * @text -------------------------------
 * @type text
 * @default -------------------------------
 *
 * @param X
 * @text Window Command X
 * @type string
 * @default 70
 * @desc The X position of the command window (can be an expression)
 *
 * @param Y
 * @text Window Command Y
 * @type string
 * @default Graphics.boxHeight - 250
 * @desc The Y position of the command window (can be an expression)
 * 
 * @param commandWidth
 * @text Window Command Width
 * @type number
 * @min 1
 * @default 240
 * @desc The width of the command window.
 *
 * @param windowSkinTransparent
 * @text WindowSkin Transparent
 * @type boolean
 * @on Transparent
 * @off Visible
 * @default true
 * @desc If true, the windowskin around commands will be completely transparent.
 * 
 * @param decor4
 * @text -------------------------------
 * @type text
 * @default -------------------------------
 * 
 * @param fontFileName
 * @text Font File Name
 * @type string
 * @desc The name of the font file to use (e.g., myfont.ttf)
 * 
 * @param fontSize
 * @text Font Size
 * @type number
 * @min 1
 * @default 28
 * @desc The size of the font to use
 * 
 * @param commandFontColor
 * @text Font Color
 * @type string
 * @desc The color of the command text in hex format (e.g., #FFFFFF for white)
 * @default 
 */

/*~struct~Option:
 * @param name
 * @text Name
 * @type string
 * @desc The name of the option
 *
 * @param script
 * @text Script
 * @type note
 * @desc If not empty, call this script. Recommended.
 *
 * @param commonEventId
 * @text Common Event ID
 * @type common_event
 * @desc If not empty or not 0, call this. Remember, common event can only be run in scene_map.
 */

/*~struct~ImageStruct:
 * @param imageFile
 * @text Image File
 * @type file
 * @dir img/pictures
 * @desc The image file to display.
 *
 * @param x
 * @text X Position
 * @type string
 * @desc The X position of the image (can be an expression, e.g. Graphics.boxWidth / 2)
 *
 * @param y
 * @text Y Position
 * @type string
 * @desc The Y position of the image (can be an expression, e.g. Graphics.boxHeight - 100)
 */

/*~struct~BackgroundSettings:
 * @param backgroundImages
 * @text Animated Background
 * @type file[]
 * @dir img/pictures
 * @desc Multiple pictures will result in a frame-by-frame animation.
 * 
 * @param frameTime
 * @text Frame Time
 * @type number
 * @min 1
 * @default 6
 * @desc Time in frames to display each Animated Background images. Shorter = Animation runs faster.
 * 
 * @param backgroundVideo
 * @text Video Background
 * @type string
 * @desc The video file to be played as the background. Example: Title.webm (prefered) or Title.mp4. Video file should be in movies folder.
 * 
 * @param visibilitySwitch
 * @text Visibility Switch
 * @type switch
 * @default 0
 * @desc Switch that controls this background setting. 0 = Enabled by default. If multiple settings have their switches ON, the last one will be used.
 */

(() => {
    const PLUGIN_NAME = "Hendrix_Scene_Title";
    const PARAMETERS = PluginManager.parameters(PLUGIN_NAME);
    const OPTIONS = JSON.parse(PARAMETERS.options).map(option => JSON.parse(option));
    const ADDITIONAL_IMAGES = JSON.parse(PARAMETERS['additionalImages'] || '[]').map(JSON.parse);
    const WINDOW_SKIN_TRANSPARENT = JSON.parse(PARAMETERS.windowSkinTransparent || "false");
    const COMMAND_WIDTH = parseInt(PARAMETERS.commandWidth || "240");
    const FONT_FILE_NAME = String(PARAMETERS.fontFileName || '');
    const FONT_SIZE = Number(PARAMETERS.fontSize || 28);
    const COMMAND_FONT_COLOR = String(PARAMETERS.commandFontColor || '').trim();
    const BACKGROUND_SETTINGS = JSON.parse(PARAMETERS.backgroundSettings || "[]").map(setting => JSON.parse(setting));
    const BACKGROUND_CONFIG_KEY = 'titleBackgroundSettings';

    const X = PARAMETERS.X;
    const Y = PARAMETERS.Y;

    let frameCount = 0;
    let targetX = [];
    let currentX = [];

    function getPreferredVideoFormat() {
        return ['webm', 'mp4'];
    }

    function loadCustomFont(fontFileName) {
        if (!fontFileName) return;

        const fontName = fontFileName.split('.')[0];
        const fileExtension = fontFileName.split('.').pop().toLowerCase();
        let format;

        if (fileExtension === 'ttf') {
            format = 'truetype';
        } else if (fileExtension === 'otf') {
            format = 'opentype';
        } else {
            return;
        }

        const fontPath = `url('fonts/${fontFileName}')`;
        const font = new FontFace(fontName, fontPath);

        font.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
            applyFontFace(fontName);
            if (SceneManager._scene && SceneManager._scene.refreshAllWindows) {
                SceneManager._scene.refreshAllWindows();
            }
        }).catch((error) => {
            console.error('Font loading failed:', error);
        });

        const style = document.createElement('style');
        const css = `@font-face {
            font-family: "${fontName}";
            src: ${fontPath} format("${format}");
        }`;
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        _Scene_Boot_start.call(this);
        if (FONT_FILE_NAME) {
            loadCustomFont(FONT_FILE_NAME);
        }
    };

    Scene_Title.prototype.createBackgroundVideo = function () {
        const settings = getActiveBackgroundSettings();
        const videoFile = settings.backgroundVideo;
        if (videoFile) {
            try {
                const videoName = videoFile.split('.')[0];
                const videoFormats = getPreferredVideoFormat();
                const videoElement = document.createElement('video');
                videoElement.loop = true;
                videoElement.muted = true;
                videoElement.playsInline = true;

                let sourceAdded = false;
                for (const format of videoFormats) {
                    const source = document.createElement('source');
                    source.src = `movies/${videoName}.${format}`;
                    source.type = `video/${format}`;
                    videoElement.appendChild(source);
                    sourceAdded = true;
                }

                if (!sourceAdded) {
                    console.error("No supported video format found. Please use WebM or MP4.");
                    return;
                }

                const texture = PIXI.Texture.from(videoElement);
                this._backgroundVideo = new PIXI.Sprite(texture);
                this._backgroundVideo.width = Graphics.width;
                this._backgroundVideo.height = Graphics.height;
                this._backgroundVideo.alpha = 1;

                // Find the index of the custom background and add the video right after it
                const customBackgroundIndex = this.children.indexOf(this._customBackSprite);
                this.addChildAt(this._backgroundVideo, customBackgroundIndex + 1);

            } catch (e) {
                console.error("Video creation failed:", e);
                this._backgroundVideo = null;
            }
        }
    };

    const _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function () {
        _Scene_Title_start.call(this);
        if (this._backgroundVideo && this._backgroundVideo.texture.baseTexture.resource.source) {
            const videoElement = this._backgroundVideo.texture.baseTexture.resource.source;
            const playVideo = () => {
                videoElement.play().catch(e => {
                    console.error("Video playback failed:", e);
                    const currentFormat = videoElement.currentSrc.split('.').pop();
                    const fallbackFormat = currentFormat === 'webm' ? 'mp4' : 'webm';
                    console.warn(`${currentFormat.toUpperCase()} playback failed. Falling back to ${fallbackFormat.toUpperCase()} if available.`);
                    const fallbackSource = videoElement.querySelector(`source[type="video/${fallbackFormat}"]`);
                    if (fallbackSource) {
                        videoElement.src = fallbackSource.src;
                        videoElement.load();
                        videoElement.play().catch(e => console.error(`${fallbackFormat.toUpperCase()} fallback failed:`, e));
                    }
                });
            };

            if (videoElement.readyState >= 4) {  // HAVE_ENOUGH_DATA
                playVideo();
            } else {
                videoElement.addEventListener('canplay', playVideo, { once: true });
            }
        }
    };

    Scene_Title.prototype.createAdditionalImages = function () {
        this._additionalImageSprites = [];
        ADDITIONAL_IMAGES.forEach(imageData => {
            const sprite = new Sprite();
            sprite.bitmap = ImageManager.loadPicture(imageData.imageFile);
            sprite.x = eval(imageData.x);
            sprite.y = eval(imageData.y);
            this.addChild(sprite);
            this._additionalImageSprites.push(sprite);
        });
    };

    Scene_Title.prototype.createCustomBackground = function () {
        const settings = getActiveBackgroundSettings();
        this._customBackSprite = new Sprite();
        this._customBackSprite.z = 0;
        this.addChild(this._customBackSprite);
        this.currentBackgroundIndex = 0;
        this.frameCount = 0;
        this._backgroundImages = JSON.parse(settings.backgroundImages || "[]");
        this._frameTime = parseInt(settings.frameTime || "6");
        this.updateCustomBackground();
    };

    Scene_Title.prototype.updateCustomBackground = function () {
        if (this._backgroundImages.length > 0) {
            const imageName = this._backgroundImages[this.currentBackgroundIndex];
            this._customBackSprite.bitmap = ImageManager.loadPicture(imageName);
        }
    };

    Scene_Title.prototype.nextBackgroundImage = function () {
        this.currentBackgroundIndex = (this.currentBackgroundIndex + 1) % this._backgroundImages.length;
        this.updateCustomBackground();
    };

    const _Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function () {
        this.createCustomBackground();
        this.createBackgroundVideo();
        _Scene_Title_create.call(this);
        this.createAdditionalImages();
    };

    const _Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function () {
        _Scene_Title_update.call(this);
        if (this._backgroundVideo && this._backgroundVideo.texture) {
            this._backgroundVideo.texture.update();
        }
        this.frameCount++;
        if (this.frameCount >= this._frameTime) {
            this.frameCount = 0;
            this.nextBackgroundImage();
        }
    };

    Scene_Title.prototype.updateBackgroundVideo = function () {
        if (this._backgroundVideo && this._backgroundVideo.texture) {
            this._backgroundVideo.texture.update();
        }
    };

    const _Scene_Title_terminate = Scene_Title.prototype.terminate;
    Scene_Title.prototype.terminate = function () {
        _Scene_Title_terminate.call(this);
        if (this._backgroundVideo) {
            const videoElement = this._backgroundVideo.texture.baseTexture.resource.source;
            videoElement.pause();
            videoElement.src = '';
            videoElement.load();
        }
    };

    const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function () {
        _Scene_Title_createCommandWindow.call(this);
        this._commandWindow.makeCommandList();
        this._commandWindow.refresh();

        // Custom commands
        OPTIONS.forEach(option => {
            this._commandWindow.setHandler(option.name, () => {
                if (option.script) {
                    try {
                        const script = JSON.parse(option.script);
                        eval(script);
                    } catch (e) {
                        console.error(e);
                    }
                } else if (option.commonEventId && option.commonEventId !== 0) {
                    $gameTemp.reserveCommonEvent(option.commonEventId);
                    SceneManager.goto(Scene_Map);
                }
            });
        });

        // Initialize cursor positions
        for (let i = 0; i < this._commandWindow.maxItems(); i++) {
            targetX[i] = 0;
            currentX[i] = 0;
        }

        // Window transparency
        if (WINDOW_SKIN_TRANSPARENT) {
            this._commandWindow.opacity = 0;
            this._commandWindow.backOpacity = 0;
        }

        // Store the original new game handler
        const originalNewGameHandler = this._commandWindow._handlers['newGame'];

        // Create a new handler that clears storage before starting new game
        this._commandWindow.setHandler('newGame', () => {
            localStorage.removeItem(BACKGROUND_CONFIG_KEY);
            if ($gameSwitches) {
                // Reset all background-related switches when starting new game
                BACKGROUND_SETTINGS.forEach(setting => {
                    const switchId = Number(setting.visibilitySwitch);
                    if (switchId > 0) {
                        $gameSwitches.setValue(switchId, false);
                    }
                });
            }
            originalNewGameHandler.call(this);
        });
    };

    const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function () {
        _Window_TitleCommand_makeCommandList.call(this);
        OPTIONS.forEach(option => {
            this.addCommand(option.name, option.name);
        });
        // Initialize targetX and currentX for all commands
        for (let i = 0; i < this._list.length; i++) {
            if (typeof targetX[i] === 'undefined') {
                targetX[i] = 0;
                currentX[i] = 0;
            }
        }
    };

    const _Scene_Title_commandWindowRect = Scene_Title.prototype.commandWindowRect;
    Scene_Title.prototype.commandWindowRect = function () {
        const rect = _Scene_Title_commandWindowRect.call(this);

        // Ensure a minimum number of visible items exists
        const minVisibleItems = 3; // Minimum number of items to show
        const defaultCommands = 3; // Typically "New Game", "Continue", and "Options"
        const customCommands = OPTIONS.length;
        const totalCommands = Math.max(minVisibleItems, defaultCommands + customCommands);

        // Calculate the height based on the total number of commands
        const itemHeight = this.calcWindowHeight(1, true); // Height of a single item
        const height = itemHeight * totalCommands;

        // Ensure the height is at least the original rect's height
        const finalHeight = Math.max(height, rect.height);

        return new Rectangle(eval(X), eval(Y), COMMAND_WIDTH, finalHeight);
    };

    Window_TitleCommand.prototype.drawItem = function (index) {
        if (FONT_FILE_NAME) {
            this.contents.fontFace = FONT_FILE_NAME.split('.')[0];
        }
        if (FONT_SIZE) {
            this.contents.fontSize = FONT_SIZE;
        }

        const rect = this.itemLineRect(index);
        const isEnabled = this.isCommandEnabled(index);
        if (this.index() === index) {
            targetX[index] = 15;
        } else {
            targetX[index] = 0;
        }
        currentX[index] += (targetX[index] - currentX[index]) / 15;
        if (Math.abs(currentX[index] - targetX[index]) < 0.1) {
            currentX[index] = targetX[index];
        }
        this.changePaintOpacity(isEnabled);

        if (COMMAND_FONT_COLOR) {
            this.changeTextColor(COMMAND_FONT_COLOR);
        }

        this.drawText(this.commandName(index), rect.x + currentX[index], rect.y, rect.width, 'left');
    };

    Window_TitleCommand.prototype.itemHeight = function () {
        return Window_Selectable.prototype.itemHeight.call(this) - 10;
    };

    Window_TitleCommand.prototype.updateCursor = function () {
        Window_Selectable.prototype.updateCursor.call(this);
        this.refresh();
    };

    Window_TitleCommand.prototype.processCursorMove = function () {
        Window_Selectable.prototype.processCursorMove.call(this);
        if (this.isCursorMovable()) {
            this.refresh();
        }
    };

    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function () {
        _Scene_Base_update.call(this);
        frameCount++;
        if (frameCount >= 1) {
            frameCount = 0;
            for (let i = 0; i < targetX.length; i++) {
                if (currentX[i] < targetX[i]) {
                    currentX[i] += (targetX[i] - currentX[i]) / 15;
                } else if (currentX[i] > targetX[i]) {
                    currentX[i] -= (currentX[i] - targetX[i]) / 15;
                }
                if (Math.abs(currentX[i] - targetX[i]) < 0.1) {
                    currentX[i] = targetX[i];
                }
            }
        }
    };

    function saveBackgroundSetting(switchId) {
        localStorage.setItem(BACKGROUND_CONFIG_KEY, switchId.toString());
    }

    // Load the saved background setting from localStorage
    function loadBackgroundSetting() {
        return parseInt(localStorage.getItem(BACKGROUND_CONFIG_KEY) || "0");
    }

    function getActiveBackgroundSettings() {
        let activeSettings = BACKGROUND_SETTINGS.find(setting => setting.visibilitySwitch === "0");
        let activeSwitchId = 0;

        // First check game switches
        for (const setting of BACKGROUND_SETTINGS) {
            const switchId = Number(setting.visibilitySwitch);
            if (switchId > 0 && $gameSwitches.value(switchId)) {
                activeSettings = setting;
                activeSwitchId = switchId;
            }
        }

        // If no switch is active in game, check saved setting
        if (activeSwitchId === 0) {
            const savedSwitchId = loadBackgroundSetting();
            if (savedSwitchId > 0) {
                const savedSettings = BACKGROUND_SETTINGS.find(
                    setting => Number(setting.visibilitySwitch) === savedSwitchId
                );
                if (savedSettings) {
                    activeSettings = savedSettings;
                    // Restore the switch state
                    if ($gameSwitches) {
                        $gameSwitches.setValue(savedSwitchId, true);
                    }
                }
            }
        } else {
            // Save the current active switch
            saveBackgroundSetting(activeSwitchId);
        }

        return activeSettings || {
            backgroundImages: "[]",
            frameTime: "6",
            backgroundVideo: "",
            visibilitySwitch: "0"
        };
    }

    Window_TitleCommand.prototype.drawBackgroundRect = function (rect) {
        if (!WINDOW_SKIN_TRANSPARENT) {
            Window_Selectable.prototype.drawBackgroundRect.call(this, rect);
        }
    };
})();