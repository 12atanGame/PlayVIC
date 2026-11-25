/*:
 * @target MZ
 * @plugindesc This is a plugin for RPG Maker MZ that helps you create a new HP system using Hearts.
 * @author Sang Hendrix
 * @url https://sanghendrix.itch.io
 * 
 * @help
 * Verion 1.2.3
 * ----------------------------------------------------------------------------
 * This plugin displays hearts on the screen based on a global variable
 * ----------------------------------------------------------------------------
 * FEATURES
 * - Choose your own Heart image
 * - Hearts per row. A new row will be created automatically 
 *   if the maximum hearts reach this number
 * - Blink. If your HP is low, the hearts will start blinking
 * - Call a Common Event when HP reaches 0
 * - Save Current Heart and Maximum Heart values to a variable
 * - Set default hearts and maximum hearts for the player
 * - Change the X Y position of the first Heart on the screen. 
 * The other hearts will automatically change their position accordingly
 * - More to be added if you desire.
 * ----------------------------------------------------------------------------
 * INSTRUCTION
 * Please download the demo for a clear example
 * ----------------------------------------------------------------------------
 * PLUGIN COMMAND
 * The only plugin command that is quite difficult is Remove Hearts.
 * Simply input any amount, or use: v[x] - x is a variable id
 * ----------------------------------------------------------------------------
 * For support, please dm me:
 * X: https://x.com/sanghendrix96
 * Discord: Discord: https://discord.gg/YKPscqHV8b
 * Patreon: https://www.patreon.com/c/SangHendrix
 *
 * @param Hearts Visible At Start
 * @text Show hearts on start?
 * @type boolean
 * @desc Choose whether or not the hearts are enabled by default.
 * @default true
 * 
 * @param Initial Hearts
 * @desc The initial number of hearts to display.
 * @default 5
 * @type number
 * 
 * @param Max Hearts
 * @text Initial Max Hearts
 * @desc The initial number of maximum hearts.
 * @default 5
 * @type number
 * 
 * @param decor1
 * @text ==========================
 * @type text
 * @default ===============================
 * 
 * @param Hearts Per Row
 * @text Hearts per Row
 * @type number
 * @desc Set the limit of hearts can be shown per row.
 * @default 8
 * 
 * @param Threshold
 * @text Blink Threshold
 * @type select
 * @desc Blood threshold for the blinking effect to begin. Choose the ratio between current blood and maximum blood.
 * @default 0.5
 * @option 50%
 * @value 0.5
 * @option 40%
 * @value 0.4
 * @option 30%
 * @value 0.3
 * @option 20%
 * @value 0.2
 * 
 * @param decor2
 * @text ==========================
 * @type text
 * @default ===============================
 * 
 * @param Common Event On No Hearts
 * @text Common Event ID
 * @type common_event
 * @desc Common eventto be triggered when the player's out of hearts.
 * @default 1
 * 
 * @param currentHeartsVariable
 * @text Current Hearts Variable
 * @type variable
 * @desc Choose a variable to store the current hearts value.
 * @default 2
 * 
 * @param maxHeartsVariable
 * @text Max Hearts Variable
 * @type variable
 * @desc Choose a variable to store the current hearts value.
 * @default 2
 * 
 * @param decor3
 * @text ==========================
 * @type text
 * @default ===============================
 * 
 * @param Heart Image
 * @desc The filename of the heart image in the img/pictures folder.
 * @default heart
 * @type file
 * @dir img/pictures/
 * 
 * @param Initial X
 * @desc The initial x position of the first heart.
 * @default 0
 * @type number
 *
 * @param Initial Y
 * @desc The initial y position of the first heart.
 * @default 0
 * @type number
 * 
 * @param Lines Offset X
 * @desc The X offset for hearts starting from the second line.
 * @default 0
 * @type number
 * 
 * @param decor3323
 * @text ==========================
 * @type text
 * @default ===============================
 * 
 * @param One Row Mode
 * @text 1 Row Mode
 * @type boolean
 * @desc All hearts to be displayed in one row.
 * @default false
 * 
 * @param Second Row Heart Image
 * @desc The filename of the heart image for the second row in 1 Row Mode.
 * @default
 * @type file
 * @dir img/pictures/
 * 
 * @param Third Row Heart Image
 * @desc The filename of the heart image for the third row in 1 Row Mode.
 * @default
 * @type file
 * @dir img/pictures/
 * 
 * @command toggleHearts
 * @text Set Heart Visibility
 * @desc Set the visibility of the hearts on the screen.
 * @arg visible
 * @type boolean
 * @text Visible
 * @desc Set the visibility of the hearts.
 * @default true
 *
 * @command setMaxHearts
 * @text Set maximum hearts
 * @desc Sets the maximum number of hearts.
 *
 * @arg maxHearts
 * @type number
 * @text Maximum Hearts
 * @desc The maximum number of hearts.
 * @default 10
 * 
 * @command increaseMaxHearts
 * @text Increase Maximum Hearts
 * @desc Increases the maximum number of hearts by the specified amount.
 * 
 * @arg amount
 * @type number
 * @text Amount
 * @desc The amount to increase the maximum number of hearts by.
 * @default 1
 * 
 * @command decreaseMaxHearts
 * @text Decrease Maximum Hearts
 * @desc Decrease the maximum number of hearts by the specified amount.
 *
 * @arg amount
 * @type number
 * @text Amount
 * @desc The amount to decrease the maximum number of hearts by.
 * @default 1
 * 
 * @command addHeart
 * @text Add Heart
 * @desc Adds a heart to the display.
 *
 * @command removeHeart
 * @text Remove Heart
 * @desc Removes hearts from the display.
 * @arg value
 * @type string
 * @text Amount
 * @desc v[x] for variable. valueFromThisEvent for value from the current event notetag: <eventDmg: x - y (or just x)>
 * @default 1
 * 
 * @command restoreHearts
 * @text Restore Hearts
 * @desc Restore all hearts.
 */

(function () {
    var pluginName = "Hendrix_Heart_System"
    var parameters = PluginManager.parameters(pluginName);
    var heartImage = parameters['Heart Image'];
    var currentHeartsVariable = parseInt(parameters["currentHeartsVariable"]) || 1;
    var maxHeartsVariable = Number(parameters['maxHeartsVariable'] || 5);
    var initialHearts = Number(parameters['Initial Hearts'] || 5);
    var maxHearts = Number(parameters['Max Hearts'] || 10);
    var initialX = Number(parameters['Initial X'] || 0);
    var initialY = Number(parameters['Initial Y'] || 0);
    var heartsVisible = parameters['Hearts Visible At Start'] === 'true';
    var commonEventId = Number(parameters['Common Event On No Hearts'] || 0);
    var heartsPerRow = Number(parameters['Hearts Per Row'] || 8);
    var threshold = Number(parameters['Threshold'] || 0.5);
    var blinkFrames = Number(parameters['Blink Frames'] || 19);
    var linesOffsetX = Number(parameters['Lines Offset X'] || 0);
    var oneRowMode = parameters['One Row Mode'] === 'true';
    var secondRowHeartImage = parameters['Second Row Heart Image'];
    var thirdRowHeartImage = parameters['Third Row Heart Image'];
    var heartVariableId = currentHeartsVariable;
    var heartsVisible = true;

    PluginManager.registerCommand(pluginName, 'toggleHearts', function (args) {
        heartsVisible = args.visible === 'true';
        $gameSystem._heartsVisible = heartsVisible;
        SceneManager._scene.updateHeartVisibility();
    });

    PluginManager.registerCommand(pluginName, 'addHeart', function () {
        var currentHearts = $gameVariables.value(heartVariableId);
        if (currentHearts < maxHearts) {
            $gameVariables.setValue(heartVariableId, currentHearts + 1);
            SceneManager._scene.startHeartAddAnimation(currentHearts);
        }
    });

    PluginManager.registerCommand(pluginName, 'restoreHearts', function () {
        while ($gameVariables.value(heartVariableId) < maxHearts) {
            var currentHearts = $gameVariables.value(heartVariableId);
            $gameVariables.setValue(heartVariableId, currentHearts + 1);
            if (SceneManager._scene && SceneManager._scene.startHeartAddAnimation) {
                SceneManager._scene.startHeartAddAnimation(currentHearts);
            }
        }
    });

    PluginManager.registerCommand(pluginName, 'removeHeart', function (args) {
        var currentHearts = $gameVariables.value(heartVariableId);
        var amount = 1;

        var valueStr = String(args.value);

        if (valueStr === 'valueFromThisEvent') {
            var event = $gameMap.event(this._eventId);
            if (event && event.event()) {
                var note = event.event().note || '';
                var damageRange = note.match(/<eventDmg:\s*(\d+)\s*-\s*(\d+)>/i);
                var damageFixed = note.match(/<eventDmg:\s*(\d+)>/i);

                if (damageRange) {
                    var min = parseInt(damageRange[1]);
                    var max = parseInt(damageRange[2]);
                    amount = Math.floor(Math.random() * (max - min + 1)) + min;
                } else if (damageFixed) {
                    amount = parseInt(damageFixed[1]);
                }
            }
        } else if (valueStr.match(/v\[(\d+)\]/i)) {
            var variableId = parseInt(RegExp.$1);
            if (isNaN(variableId)) {
                amount = 1;
            } else {
                amount = $gameVariables.value(variableId) || 1;
            }
        } else {
            amount = parseInt(valueStr) || 1;
        }

        amount = Math.max(1, Math.min(amount, currentHearts));

        if (currentHearts > 0) {
            for (var i = 0; i < amount; i++) {
                var heartIndex = currentHearts - 1 - i;
                SceneManager._scene.startHeartRemoveAnimation(heartIndex);
            }

            $gameVariables.setValue(heartVariableId, currentHearts - amount);

            if ($gameVariables.value(heartVariableId) === 0 && commonEventId > 0) {
                $gameTemp.reserveCommonEvent(commonEventId);
                heartVariableId = 0;
            }
            SceneManager._scene.createBlackHeartSprites();
        }

        heartVariableId = currentHeartsVariable;
    });

    PluginManager.registerCommand(pluginName, 'setMaxHearts', function (args) {
        maxHearts = Number(args.maxHearts);
        $gameVariables.setValue(maxHeartsVariable, maxHearts);
        if (maxHearts < $gameVariables.value(heartVariableId)) {
            $gameVariables.setValue(heartVariableId, maxHearts);
        }
        while (SceneManager._scene._heartSprites.length > maxHearts) {
            var sprite = SceneManager._scene._heartSprites.pop();
            SceneManager._scene.removeChild(sprite);
        }
        while (SceneManager._scene._blackHeartSprites.length > maxHearts) {
            var sprite = SceneManager._scene._blackHeartSprites.pop();
            SceneManager._scene.removeChild(sprite);
        }
        SceneManager._scene.createBlackHeartSprites();
        SceneManager._scene.createHeartSprites();
        SceneManager._scene.updateHeartVisibility();
    });

    PluginManager.registerCommand(pluginName, 'increaseMaxHearts', function (args) {
        maxHearts += Number(args.amount);
        $gameVariables.setValue(maxHeartsVariable, maxHearts);
        if (maxHearts < $gameVariables.value(heartVariableId)) {
            $gameVariables.setValue(heartVariableId, maxHearts);
        }
        SceneManager._scene.createBlackHeartSprites();
        SceneManager._scene.createHeartSprites();
        SceneManager._scene.updateHeartVisibility();
    });

    PluginManager.registerCommand(pluginName, 'decreaseMaxHearts', function (args) {

        maxHearts -= Number(args.amount);
        $gameVariables.setValue(maxHeartsVariable, maxHearts);
        if ($gameVariables.value(heartVariableId) > maxHearts) {
            $gameVariables.setValue(heartVariableId, maxHearts);
        }
        for (var i = maxHearts; i < SceneManager._scene._heartSprites.length; i++) {
            SceneManager._scene.startHeartRemoveAnimation(i);
        }

        setTimeout(function () {
            while (SceneManager._scene._heartSprites.length > maxHearts) {
                var sprite = SceneManager._scene._heartSprites.pop();
                SceneManager._scene.removeChild(sprite);
            }
            while (SceneManager._scene._blackHeartSprites.length > maxHearts) {
                var sprite = SceneManager._scene._blackHeartSprites.pop();
                SceneManager._scene.removeChild(sprite);
            }
        }, 170);

        SceneManager._scene.createBlackHeartSprites();
        SceneManager._scene.createHeartSprites();
        SceneManager._scene.updateHeartVisibility();
    });


    var _Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function () {
        _Scene_Map_initialize.call(this);
        if ($gameVariables.value(heartVariableId) === 0) {
            $gameVariables.setValue(heartVariableId, initialHearts);
        }
        heartsVisible = $gameSystem._heartsVisible !== undefined ? $gameSystem._heartsVisible : parameters['Hearts Visible At Start'] === 'true';
        $gameVariables.setValue(maxHeartsVariable, maxHearts);
        this._blackHeartSprites = [];
        this._heartSprites = [];
    };

    var _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);
        this.updateHeartVisibility();
    };

    var _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function () {
        _Scene_Map_createDisplayObjects.call(this);
        this.createBlackHeartSprites();
        this.createHeartSprites();
    };

    Scene_Map.prototype.createBlackHeartSprites = function () {
        var heartBitmap = ImageManager.loadPicture(heartImage);
        heartBitmap.addLoadListener(function () {
            var spritesToCreate = oneRowMode ? Math.min(maxHearts, heartsPerRow) : maxHearts;
            for (var i = this._blackHeartSprites.length; i < spritesToCreate; i++) {
                this.addBlackHeartSprite(i);
            }
            this.updateHeartVisibility();
        }.bind(this));
    };

    Scene_Map.prototype.addBlackHeartSprite = function (index) {
        var heartBitmap = ImageManager.loadPicture(heartImage);
        var sprite = new Sprite(heartBitmap);
        var row = Math.floor(index / heartsPerRow);
        sprite.x = initialX + (index % heartsPerRow) * sprite.width + (row > 0 ? linesOffsetX : 0);
        sprite.y = initialY + Math.floor(index / heartsPerRow) * sprite.height;
        sprite.opacity = 255;
        sprite.scale.x = 1;
        sprite.scale.y = 1;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.setColorTone([-255, -255, -255, 255]);
        sprite.visible = heartsVisible && !oneRowMode;  // Hide in one row mode
        this._blackHeartSprites.push(sprite);
        this.addChild(sprite);
    };

    Scene_Map.prototype.createHeartSprites = function () {
        var heartBitmap = ImageManager.loadPicture(heartImage);
        var secondRowHeartBitmap = ImageManager.loadPicture(secondRowHeartImage);
        var thirdRowHeartBitmap = ImageManager.loadPicture(thirdRowHeartImage);
        heartBitmap.addLoadListener(function () {
            secondRowHeartBitmap.addLoadListener(function () {
                thirdRowHeartBitmap.addLoadListener(function () {
                    for (var i = this._heartSprites.length; i < $gameVariables.value(heartVariableId); i++) {
                        this.addHeartSprite(i);
                    }
                    this.updateHeartVisibility();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    };

    Scene_Map.prototype.addHeartSprite = function (index) {
        var rowIndex = Math.floor(index / heartsPerRow);
        var isSecondRow = oneRowMode && rowIndex === 1;
        var isThirdRow = oneRowMode && rowIndex >= 2;
        var heartBitmap;
        if (isThirdRow) {
            heartBitmap = ImageManager.loadPicture(thirdRowHeartImage);
        } else if (isSecondRow) {
            heartBitmap = ImageManager.loadPicture(secondRowHeartImage);
        } else {
            heartBitmap = ImageManager.loadPicture(heartImage);
        }
        var sprite = new Sprite(heartBitmap);
        var row = oneRowMode ? 0 : rowIndex;
        var column = index % heartsPerRow;
        sprite.x = initialX + column * sprite.width + (row > 0 ? linesOffsetX : 0);
        sprite.y = initialY + row * sprite.height;
        sprite.opacity = 255;
        sprite.scale.x = 1;
        sprite.scale.y = 1;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.visible = heartsVisible;
        sprite._blinkFramesLeft = 0;
        sprite._rowIndex = rowIndex;
        this._heartSprites.push(sprite);
        this.addChild(sprite);
        return sprite;
    };

    Scene_Map.prototype.startHeartRemoveAnimation = function (index) {
        var sprite = this._heartSprites[index];
        if (sprite) {
            sprite._removing = true;
            sprite._removeFrames = 18;
            sprite.setColorTone([206, 28, 28, 255]);
        }
    };
    Scene_Map.prototype.startHeartAddAnimation = function (index) {
        var sprite = this.addHeartSprite(index);
        sprite._adding = true;
        sprite._addFrames = 18;
        sprite.setColorTone([51, 204, 110, 255]);
        sprite.scale.x = 1;
        sprite.scale.y = 1;
        sprite.visible = heartsVisible;
    };

    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        this.updateHeartSprites();
    };

    Scene_Map.prototype.updateHeartSprites = function () {
        var currentHearts = $gameVariables.value(heartVariableId);
        var isBelowThreshold = currentHearts <= maxHearts * threshold;
        for (var i = 0; i < this._heartSprites.length; i++) {
            var sprite = this._heartSprites[i];
            sprite.visible = heartsVisible;

            if (isBelowThreshold) {
                if (sprite._blinkFramesLeft <= 0) {
                    sprite._blinkFramesLeft = blinkFrames * 2;
                }
                sprite._blinkFramesLeft--;

                var colorIntensity;
                if (sprite._blinkFramesLeft >= blinkFrames) {
                    colorIntensity = 255 * (sprite._blinkFramesLeft - blinkFrames) / blinkFrames;
                } else {
                    colorIntensity = 255 * sprite._blinkFramesLeft / blinkFrames;
                }
                sprite.setColorTone([colorIntensity, -colorIntensity, -colorIntensity, 0]);
            } else {
                sprite._blinkFramesLeft = 0;
                sprite.setColorTone([0, 0, 0, 0]);
            }

            if (sprite._removing) {
                if (sprite._removeFrames > 9) {
                    sprite.scale.x += 0.1;
                    sprite.scale.y += 0.1;
                    sprite.setColorTone([206, 28, 28, 255]);
                } else {
                    sprite.scale.x -= 0.1;
                    sprite.scale.y -= 0.1;
                    if (oneRowMode && sprite._rowIndex > 0) {
                        sprite.opacity = (sprite._removeFrames / 9) * 255;
                    } else {
                        sprite.setColorTone([128, 0, 0]);
                    }
                }
                sprite._removeFrames--;
                if (sprite._removeFrames <= 0) {
                    sprite._removing = false;
                    this.removeChild(sprite);
                    this._heartSprites.splice(i, 1);
                    i--;
                }
            } else if (sprite._adding) {
                if (sprite._adding) {
                    if (sprite._addFrames > 9) {
                        sprite.scale.x += 0.1;
                        sprite.scale.y += 0.1;
                        sprite.setColorTone([51, 204, 110, 255]);
                    } else {
                        sprite.scale.x -= 0.1;
                        sprite.scale.y -= 0.1;
                        sprite.setColorTone([0, 0, 0, 0]);
                    }
                    sprite._addFrames--;
                    if (sprite._addFrames <= 0) {
                        sprite._adding = false;
                    }
                }
            }
        }
    };

    var _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        _Scene_Map_terminate.call(this);
        this._heartSprites.forEach(function (sprite) {
            this.removeChild(sprite);
        }, this);
        this._heartSprites = [];
        this._blackHeartSprites.forEach(function (sprite) {
            this.removeChild(sprite);
        }, this);
        this._blackHeartSprites = [];
    };

    Scene_Map.prototype.updateHeartVisibility = function () {
        for (var i = 0; i < this._heartSprites.length; i++) {
            this._heartSprites[i].visible = heartsVisible;
        }
        for (var i = 0; i < this._blackHeartSprites.length; i++) {
            this._blackHeartSprites[i].visible = heartsVisible;
        }
    };

    var _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
        var contents = _DataManager_makeSaveContents.call(this);
        contents.maxHearts = maxHearts;
        return contents;
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _DataManager_extractSaveContents.call(this, contents);
        maxHearts = contents.maxHearts;
    };

})();

