/* :
 * @pluginname LTN_Elements
 * @plugindesc Create unique HUDs or other display elements for your RPG Maker game
 * @modulename $Elements
 * @required
 * @external
 *
 * @author inc0der | LTN Games
 *
 * @help
--------------------------------------------------------------------------------
 # TERMS OF USE (https://ltngames.xyz/terms-of-use.html)

 * Free to use in any of your projects, commercial or otherwise

 * Credits/Attribution must go to `inc0der` or 'LTN Games'

  * You may edit this plugin and you may ask others to edit this plugin for free
  or for payment so long as the original header and terms of use remain intact.

  * You may NOT re-distribute this plugin alone for monetary gains
   without LTN Games direct written permission.

  * Do NOT change any information, including the original parameters or
    terms of use.
 -------------------------------------------------------------------------------
 # INFORMATION
*/

var $Elements = (function () {
'use strict';

/**
 * Checks if file(s) exist on a local machine using node fs.
 *
 * @function localFileExists
 * @since 1.0.0
 * @memberof module:File
 *
 * @param {string|array} paths - A path or array of paths to check.
 *
 * @return {boolean} True if the file path or paths exist
 * @example
 * import {localFileExists} from 'fenix-tools'
 *
 * localFileExists('./img/pictures/myPicture.png') // => Returns true or false
 *
 */
function localFileExists (paths = []) {
  paths = typeof paths === 'string' ? [paths] : paths;
  const fs = require('fs');
  return paths.every((path) => fs.existsSync(path))
}

/**
 * @author       LTNGames <ltngamesdevelopment@gmail.com>
 * @copyright    2018 FeniX Engine
 * @license      {@link https://gitlab.com/FeniXEngineMV/fenix-utils/blob/master/LICENSE|MIT License}
 */

/**
 * An async function for checking if a file exist on a server.
 *
 * @function webFileExists
 * @async
 * @since 1.0.0
 * @memberof module:File
 *
 * @param {string} url - The url to the file
 *
 * @returns {promise} Promise that resolves to true if the file exists.
 * @example
 * import { webFileExists } from 'fenix-tools'
 *
 * const file = 'http://example.com/file.png'
 *  const fileExists = await webFileExists(file)
 * console.log(fileExists)  // => returns true if file exists
 * // or
 * webFileExists(file)
 * .then(console.log('File exists!'))
 * .catch(console.log('Unable to get file))
 */
async function webFileExists (url) {
  try {
    const result = await window.fetch(url, {
      method: 'HEAD',
      cache: 'no-cache'
    }).then((response) => {
      return response.ok === true
    });
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Load a file on the local machine.
 *
 * @function loadLocalFile
 * @since 1.0.0
 * @memberof module:File
 *
 * @param {string} path - Path to the file.
 * @param {string} [encoding='utf8'] - The type of file encoding
 *
 * @return {promise} A promise that resolves the data
 * @example
 * import {loadLocalFile} from 'fenix-tools'
 *
 * loadLocalFile('./img/pictures/character1.png)
 * .then(data => {
 *  // Local file loaded success
 *  console.log(data)  // => A parsed JSON object.
 * })
 *
 */
function loadLocalFile (path, encoding = 'utf8') {
  const fs = require('fs');
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path)) {
      const contents = fs.readFileSync(path, encoding, err => reject(err));
      resolve(contents);
    }
    reject(new Error(`Cannot read file at ${path}`));
  })
}

/**
 * Loads a JSON file. and parses it Decides to use node or fetch based on platform.
 * If using nwjs it will use node else it falls back to fetch()
 *
 * @function loadJSON
 * @async
 * @since 1.0.0
 * @memberof module:File
 * @see {@link module:File.loadLocalFile|loadLocalFile}
 *
 * @param {any} path - The path to the JSON file.
 *
 * @returns {promise} promise - A promise that resolves the parsed JSON
 * @example
 * import {loadJSON} from 'fenix-tools'
 *
 * loadJSON('./data/highscores.json')
 * .then(data => {
 *   // success for parsing and loading JSON file
 *   console.log(data)  // => A parsed JSON object.
 * })
 *
 */
function loadJSON (path) {
  if (window.Utils.isNwjs()) {
    return new Promise((resolve, reject) => {
      loadLocalFile(`${path}`)
        .catch(err => reject(err))
        .then(response => resolve(JSON.parse(response)));
    })
  } else {
    return new Promise((resolve, reject) => {
      window.fetch(`${path}`)
        .then((response) => resolve(response.json()))
        .catch(err => reject(err));
    })
  }
}

/**
 * Attempts to write given data to a file.
 *
 * @function tryWriteFile
 * @since 1.0.0
 * @memberof module:File
 *
 * @param {string} filepath - Path to an existing or new file you want to write to
 * @param {string} data - The data you would like to write to the file
 * @param {string|object} [options='utf8'] - The options object or a string with the encoding
 *
 * @return {promise} A promise that resolves if successfully written to file
 * @example
 * import { tryWriteFile } from 'fenix-tools'
 *
 * tryWriteFile('path/to/file', 'Data to write to file', 'utf8')
 * .then(() => {
 *  // Success writing file to machine
 * })
 *
 */
function tryWriteFile (filepath, data, options = 'utf8') {
  const fs = require('fs');
  return new Promise((resolve, reject) => {
    try {
      fs.writeFile(filepath, data, options, (error) => {
        if (error !== 'undefined' && error !== null) {
          resolve();
        }
      });
    } catch (error) { reject(error); }
  })
}

/**
 * Recursive method that will convert all string values in an object to a more
 * appropriate type.
 *
 * In MV there are a lot of objects filled with strings of different values, a lot
 * of times we need to convert each value manually, instead use this to quickly
 * deep parse each value from string to the correct type.
 *
 * @function convertParameters
 * @since 1.0.0
 * @memberof module:Utils
 *
 * @param {object} parameters - The string filled object you want converted
 *
 * @returns An object with it's string values converted
 * @example
 *
 * const myParams = { p1: '22', p2: 'true' }
 * convertParameters(myParams) // => { p1: 22, p2: true }
 *
 * const myParams = { p1: '{a: 1'1, c: '2'}', p2: '[{}, {}, {}]' }
 * convertParameters(myParams) // => { p1: {a: 1, c: 2}, p2: [{}, {}, {}] }
 *
 */
function convertParameters (parameters) {
  function parseParameters (string) {
    try {
      return JSON.parse(string, (key, value) => {
        try {
          return parseParameters(value)
        } catch (e) {
          return value
        }
      })
    } catch (e) {
      return string
    }
  }
  return parseParameters(JSON.stringify(parameters))
}

const PluginName = document.currentScript.src.match(/.+\/(.+).js/)[1];
const rawParams = PluginManager.parameters(PluginName);

const Params = convertParameters(rawParams);

let currentButtonData = null;

function getCurrentButtonData$1 () {
  return currentButtonData;
}

function setCurrentButtonData (value) {
  currentButtonData = value;
}

Graphics.renderTo = function (displayObject, renderTexture) {
  return this._app.renderer.render(displayObject, renderTexture);
};

Graphics.generateTexture = function (displayObject) {
  return this._app.renderer.generateTexture(displayObject);
};

Graphics.extractPixels = function (texture) {
  return this._app.renderer.extract.pixels(texture);
};

ImageManager.loadElement = function (filename, hue) {
  return this.loadBitmap('img/elements/', filename, hue, false);
};

ImageManager.loadElementsUI = function (filename, hue) {
  return this.loadBitmap('img/elements_ui/', filename, hue, false);
};

ImageManager.elementsUiTexture = function (filename) {
  if (filename) {
    return PIXI.Texture.from(`img/elements_ui/${filename}.png`);
  }
  return null;
};

Input.isPreventDefault = true;

const aliasOnKeyDown = Input._onKeyDown;
Input._onKeyDown = function (event) {
  if (!this.isPreventDefault) {
    return;
  }
  aliasOnKeyDown.call(this, event);
};

Bitmap.prototype.measureTextHeight = function (text) {
  const context = this._context;
  context.save();
  context.font = this._makeFontNameText();
  const metrics = context.measureText(text);
  const metricHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  context.restore();
  if (!metricHeight) {
    return parseInt(context.font.replace(/^\D+/g, ''));
  }
  return metricHeight;
};

function Draggable (state) {
  return {
    isDragging () {
      return state.isDragging;
    },

    setDragging (value) {
      state.isDragging = value;
    },

    enableDragging () {
      state.canDrag = true;
    },

    disableDragging () {
      state.canDrag = false;
    },

    enableInteraction () {
      state.canDrag = true;
      state.canTouch = true;
    },

    disableInteraction () {
      state.canDrag = false;
      state.canTouch = false;
      this.enableOutline = false;
    },

    isInteractionEnabled () {
      return state.canDrag || state.canTouch;
    },

    isInteractionDisabled () {
      return !state.canDrag || !state.canTouch;
    },
  };
}

/**
 * Make any PIXI element touchable.
 *
 * The class you mixin with must contain a worldTransform property and wordVisible property.
 */
function Touchable () {

  return {
    _tempPoint: new Point(),
    isTouching: false,

    isTouched (mouseX, mouseY) {
      return this.containsPoint(new Point(mouseX, mouseY)) &&
        this.worldVisible;
    },

    containsPoint (point) {
      this.worldTransform.applyInverse(point, this._tempPoint);
      const width = this._width;
      const height = this._height;
      const x1 = -width * this.pivot.x;
      let y1 = 0;
      if (this._tempPoint.x >= x1 && this._tempPoint.x < x1 + width) {
        y1 = -height * this.pivot.y;
        if (this._tempPoint.y >= y1 && this._tempPoint.y < y1 + height) {
          return true;
        }
      }
      return false;
    },
  };
}

/**
 * The core element mixin handling element state and core element mechanics
 */
function Elementable (state) {
  return {
    state,
    isElement: true,

    setType (type) {
      this.state.type = type;
    },

    type () {
      console.warn('Deprecated, use getType instead');
      return this.state.type;
    },

    getType () { return this.state.type; },

    getZIndex () { return this.state.zIndex; },

    setZIndex (zIndex) {
      this.state.zIndex = zIndex;
    },

    getElementSettings () {
      console.warn('deprecated, use getElementState instead');
      return this.getElementState();
    },

    getElementState () {
      const { x, y, width, height, visible, opacity } = this;
      const state = Object.assign({},
        {
          ...this.state,
          x,
          y,
          width,
          height,
          visible,
          opacity,
          childElements: this.getChildElements().map((child) => child.getElementState()),
          selectionFilter: null,
        },
      );

      if (this.getBehaviorSettings) {
        Object.assign(state, this.getBehaviorSettings());
      }

      return state;
    },

    setName (name) {
      this.state.name = name;
    },

    getName () { return this.state.name; },

    setPosition (x, y) {
      this.x = x;
      this.y = y;
    },

    getPosition () {
      return { x: this.x, y: this.y };
    },

    setEventId (eventId) {
      this.getChildElements().forEach((child) => {
        child.setEventId(eventId);
      });
      this.state.eventId = eventId;
    },

    getEventId () { return this.state.eventId; },

    setGameSwitch (gameSwitch) {
      this.state.gameSwitch = gameSwitch;
    },

    getGameSwitch () { return this.state.gameSwitch; },

    setGameVar (gameVar = {}) {
      Object.assign(this.state.gameVar, gameVar);
    },

    getGameVar () { return this.state.gameVar; },

    isChild () { return this.state.isChild; },

    setIsChild (value) {
      this.state.isChild = value;
    },

    isGlobal () { return this.state.isGlobal; },

    getChildElements () {
      return this.children.filter((child) => child.isElement);
    },

    addChildElement (child, index = -1) {
      child.setIsChild(true);
      if (index < 0) {
        this.addChild(child);
      } else {
        this.addChildAt(child, index);
      }
      this.emit('add-child-element', child);
      this.state.childElements.push(child);
    },

    toggleVisibility () {
      if (this.isVisible()) {
        this.hide();
        return;
      }
      this.show();
    },

    isVisible () {
      if (this.state.forceOpacity) {
        return this.opacity > 0;
      }
      return this.visible;
    },

    hide () {
      if (this.state.forceOpacity) {
        this.state.oldOpacity = this.opacity;
        this.opacity = 0;
        return;
      }
      this.visible = false;
    },

    show () {
      if (this.state.forceOpacity) {
        this.opacity = this.oldOpacity;
        return;
      }
      this.visible = true;
    },

    changeVisibility (value) {
      if (value) {
        this.show();
      } else if (value === false) {
        this.hide();
      }
    },

    moveToBack () {
      if (this.isChild()) {
        this.parent.setChildIndex(this, 1);
      } else {
        this.layer.setChildIndex(this, 0);
      }

      // this.enableInteraction()
      this.emit('element-changed', this);
    },

    moveToFront () {
      if (this.isChild()) {
        this.parent.setChildIndex(this, this.parent.children.length - 1);
      } else {
        const index = this.layer.children.length - 1;
        this.layer.setChildIndex(this, index);
      }
      // this.enableInteraction()
      this.emit('element-changed', this);
    },

    reparent (element) {
      if (this.parent.isElement) {
        element.parent.removeChild(element);
      }
      this.addChildElement(element);
      element.emit('element-changed', element);

      element.x = 5;
      element.y = 5;
    },

    decouple () {
      if (this.parent.isElement) {
        const globalPosition = this.getGlobalPosition();
        this.parent.removeChild(this);
        this.layer.addChild(this);
        this.state.isChild = false;

        this.x = globalPosition.x;
        this.y = globalPosition.y;
      }
    },
  };
}

// Temp solution for mixins due to Elements requiring setDimensions in constructor
function MethodMixin () {
  return {
    setDimensions (width = this.width, height = this.height) {
      this.width = width;
      this.height = height;
      this.contents.resize(this.width, this.height);
      this.refresh();
    },

    updateVisibility () {
      if (this.state && !this.getGameVar() && !this.getGameSwitch()) {
        return;
      }
      if (this.getGameSwitch() > 0) {
        if (this.isVisible() === false && $gameSwitches.value(this.getGameSwitch()) === true) {
          this.changeVisibility(true);
        } else if (this.state.isVisible() === true && $gameSwitches.value(this.getGameSwitch()) === false) {
          this.changeVisibility(false);
        }
      }
      if (this.getGameVar().id > 0) {
        const value = isNaN(this.getGameVar()) ? this.getGameVar().value : Number(this.getGameVar().value);

        if (this.isVisible() === true && $gameVariables.value(this.getGameVar().id) !== value) {
          this.changeVisibility(false);
        } else if (this.isVisible() === false && $gameVariables.value(this.getGameVar().id) === value) {
          this.changeVisibility(true);
        }
      }
    },

    refresh () {},
  };
}

/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB
 *
 * @class
 * @param thickness {number} The tickness of the outline. Make it 2 times more for resolution 2
 * @param color {number} The color of the glow.
 *
 * @example
 *  someSprite.shader = new OutlineFilter(9, 0xFF0000);
 */

const fragShader = `
 varying vec2 vTextureCoord;
 uniform sampler2D uSampler;

 uniform float thickness;
 uniform vec4 outlineColor;
 uniform vec4 filterArea;
 uniform vec4 filterClamp;
 vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);

 void main(void) {
     const float PI = 3.14159265358979323846264;
     vec4 ownColor = texture2D(uSampler, vTextureCoord);
     vec4 curColor;
     float maxAlpha = 0.;
     vec2 displaced;
     for (float angle = 0.; angle < PI * 2.; angle += %THICKNESS% ) {
         displaced.x = vTextureCoord.x + thickness * px.x * cos(angle);
         displaced.y = vTextureCoord.y + thickness * px.y * sin(angle);
         curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));
         maxAlpha = max(maxAlpha, curColor.a);
     }
     float resultAlpha = max(maxAlpha, ownColor.a);
     gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);
 }
 `;

function OutlineFilter (thickness, color) {
  thickness = thickness || 1;
  PIXI.Filter.call(this,
    `attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat3 projectionMatrix;
        varying vec2 vTextureCoord;

        void main(void){
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }
        `,
    // fragment shader
    fragShader.replace(/%THICKNESS%/gi, (1.0 / thickness).toFixed(7)),
  );

  this.uniforms.thickness = thickness;
  this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1]);
  if (color) {
    this.color = color;
  }
}

OutlineFilter.prototype = Object.create(PIXI.Filter.prototype);
OutlineFilter.prototype.constructor = OutlineFilter;

Object.defineProperties(OutlineFilter.prototype, {
  color: {
    get: function () {
      return PIXI.utils.rgb2hex(this.uniforms.outlineColor);
    },
    set: function (value) {
      PIXI.utils.hex2rgb(value, this.uniforms.outlineColor);
    },
  },
});

function Selectable (state) {
  state.selectionFilter = new OutlineFilter(2, 0x53E1FF);
  state.isSelected = false;
  state.forceSelection = false;

  return {
    applySelectionFilter () {
      this.filters = [state.selectionFilter];
    },

    clearSelectionFilter () {
      this.filters = [];
      state.isSelected = false;
    },

    toggleForceSelection () {
      this.forceSelection(!state.forceSelection);
    },

    forceSelection (value) {
      state.forceSelection = value;
      this.processSelectionFilter();
    },

    processSelectionFilter () {
      if (state.isSelected && !state.forceSelection) {
        this.applySelectionFilter();
      } else if (!state.isSelected && state.forceSelection) {
        this.applySelectionFilter();
      } else {
        this.clearSelectionFilter();
      }
    },
  };
}

/**
 * Creates and initializes the default state for an element.
 * @param {Object} options - Custom options to override the default state.
 * @returns {Object} - The initialized state object.
 */
function ElementState (options = {}) {
  return {
    // Basic Properties
    type: 'element',
    name: '',
    eventId: -1,
    globalId: -1,

    // Visibility and Opacity
    visible: true,
    opacity: 255,
    oldOpacity: 255,
    forceOpacity: false,
    visibleConditionType: 'switch',

    // Position and Z-Index
    position: { x: 0, y: 0 },
    zIndex: -1,

    // Hierarchical Properties
    isChild: false,
    isGlobal: false,
    childElements: [],

    // Game-related Properties
    gameVar: { id: 0, value: '' },
    gameSwitch: -1,

    // Selection and Filtering
    isSelected: false,
    forceSelection: false,
    selectionFilter: null,

    // Draggable and Touchable States
    isDragging: false,
    isDraggable: false,
    canTouch: false,

    // Custom Options
    ...options,
  };
}

function safeEval (string) {
  // eslint-disable-next-line no-new-func
  return (new Function('return (' + string + ')')());
}

function TextBehavior (state) {
  return {
    _text: state.text || 'Text',
    _fontFace: state.fontFace,
    _fontSize: state.fontSize,
    _characterId: state.characterId || null,
    _textVariable: state.textVariable || null,
    _scriptEval: state.scriptEval || null,
    _evalReady: false,

    initBehavior () {
      this.opacity = 0;
      this.padding = 0;

      this.setText(this._text, this._fontSize, this._fontFace);

      if (this._scriptEval) {
        this.evaluateScript();
      }
      if (this._characterId) {
        this.setCharacter(this._characterId);
      } else if (this._textVariable) {
        this.setTextVariable(this._textVariable);
      }
      this.refresh();
    },

    getBehaviorSettings () {
      return {
        text: this._text,
        fontSize: this.contents.fontSize,
        fontFace: this.contents.fontFace,
        textVariable: this._textVariable,
        scriptEval: this._scriptEval,
        characterId: this._characterId,
      };
    },

    setText (text, fontSize, fontFace) {
      this._text = text;
      this.contents.fontSize = fontSize || this.contents.fontSize;
      this.contents.fontFace = fontFace || this.contents.fontFace;

      this.refreshContentsDimensions();
      this.refresh();
    },

    setFontSize (fontSize) {
      this.contents.fontSize = Number(fontSize);
      this.refresh();
      this.refreshContentsDimensions();
    },

    setFontFace (fontFace) {
      this.contents.fontFace = fontFace;
      this.refreshContentsDimensions();
      this.refresh();
    },

    setTextVariable (variable) {
      this._textVariable = variable;
      this._text = $gameVariables.value(variable);
      this.refresh();
    },

    setScriptEval (evalString) {
      this._evalReady = false;
      this._scriptEval = evalString;
    },

    setCharacter (id) {
      this._characterId = id;
      this._character = $gameParty.members()[id];
      if (!this._character) {
        return;
      }
      this._text = `${this._character.hp} / ${this._character.mhp}`;
      this.refreshContentsDimensions();
      this.refresh();
    },

    evaluateScript () {
      if (this._scriptEval) {
        this._evalReady = true;
        this._text = String(safeEval(this._scriptEval));
        this.refresh();
      }
    },

    updateTextBehavior () {
      if (this._textVariable) {
        if (this._text !== $gameVariables.value(this._textVariable)) {
          this._text = `${$gameVariables.value(this._textVariable)}`;
          this.refresh();
        }
      }
      if (this._character) {
        if (this._text !== this._character.hp) {
          this._text = `${this._character.hp} / ${this._character.mhp}`;
          this.refresh();
        }
      }
      if (this._evalReady) {
        if (this._text !== String(safeEval(this._scriptEval))) {
          this.evaluateScript();
        }
      }
    },

    refreshContentsDimensions () {
      const width = Math.ceil(this.textWidth(this._text));
      const height = this.calcTextHeight(this.textState(this._text, 0, 0));
      this.setDimensions(width + 5, height + 5);
    },

    // These functions are dependent on the base Window class
    // You'll still need them in the implementation
    textState (text = this._text, x = 0, y = 0) {
      if (Utils.RPGMAKER_NAME === 'MZ') {
        return this.createTextState(this._text, x, y, 0);
      }
      return { index: 0, x, y, left: 0, text: text };
    },

    textWidthExLog (text) {
      return this.drawTextExLog(text, 0, this.contents.height);
    },

    drawTextExLog (text, x, y) {
      if (text) {
        const textState = this.textState(text, x, y);
        textState.text = this.convertEscapeCharacters(text);
        textState.height = this.calcTextHeight(textState, false);
        while (textState.index < textState.text.length) {
          this.processCharacter(textState);
        }
        this.flushTextState(textState);
        return textState.x - x;
      } else {
        return 0;
      }
    },

    refreshText () {
      this.contents.clear();
      let y = 5;
      if (this.contents.fontSize > 100) {
        y = this.contents.measureTextHeight(this._text) / 2;
      }

      this.drawTextExLog(this._text, 2, y);
    },

    refresh () {
      this.updateVisibility();
      this.refreshText();
    },

    onResize (newWidth, newHeight) {
      const oldWidth = Math.ceil(this.textWidth(this._text));
      const oldHeight = this.calcTextHeight(this.textState(this._text, 0, 0));

      const scaleX = newWidth / oldWidth;
      const scaleY = newHeight / oldHeight;


      const scale = Math.min(scaleX, scaleY);

      this._fontSize *= scale;
      this.contents.fontSize *= scale;

      this.setDimensions(newWidth, newHeight);
    },
  };
}

function ImageBehavior (state) {
  return {
    initBehavior () {
      this._imagePath = state.imagePath || { folder: '', filename: '' };
      this.opacity = 0;
      this.padding = 0;
      this.setImage(this._imagePath);
    },

    getBehaviorSettings () {
      return {
        imagePath: this._imagePath,
      };
    },

    setImage (imagePath) {
      this.opacity = 0;
      this.padding = 0;
      this.setDimensions(this.width, this.height);
      this._imagePath = imagePath;
      this.createBitmap(this._imagePath);
      this.refresh();
    },

    createBitmap (path) {
      if (path && path.filename !== '') {
        this.bitmap = ImageManager.loadBitmap(path.folder, path.filename);
        return;
      }
      this.bitmap = new Bitmap(this.width, this.height);
      this.bitmap.fillRect(0, 0, this.width, this.height);
    },

    drawImage () {
      if (!this.bitmap) {
        return;
      }
      this.bitmap.addLoadListener((bitmap) => {
        const sw = bitmap.width;
        const sh = bitmap.height;
        this.contents.blt(bitmap, 0, 0, sw, sh, 0, 0, this.width, this.height);
      });
    },

    refresh () {
      this.contents.clear();
      this.drawImage(this.bitmap);
      this.updateVisibility();
    },

    onResize (newWidth, newHeight) {
      this.setDimensions(newWidth, newHeight);
      this.refresh();
    },
  };
}

function ButtonBehavior (state) {
  return {
    isButton: true,
    bitmap: null,
    normalImagePath: state.normalImagePath || { folder: '', filename: '' },
    hoverImagePath: state.hoverImagePath || { folder: '', filename: '' },
    clickedImagePath: state.clickedImagePath || { folder: '', filename: '' },
    _commonEventId: state.commonEventId || 0,
    _evalScript: state.evalScript || '',
    _openElementName: state.openElementName || '',
    buttonData: state.buttonData || null,
    keepOutline: false,
    canClick: true,
    keepAspectRatio: state.keepAspectRatio || true,

    initBehavior () {
      this.padding = 0;
      this.preloadImages();
      this.updateButtonState();
      this.refresh();
      this.on('clicked', this.processButtonAction.bind(this));
    },

    getBehaviorSettings () {
      return {
        normalImagePath: this.normalImagePath,
        hoverImagePath: this.hoverImagePath,
        clickedImagePath: this.clickedImagePath,
        commonEventId: this._commonEventId,
        evalScript: this._evalScript,
        openElementName: this._openElementName,
        buttonData: this.buttonData,
        keepOutline: this.keepOutline,
        keepAspectRatio: this.keepAspectRatio,
      };
    },

    destroyBehavior () { },

    preloadImages () {
      const paths = [this.normalImagePath, this.hoverImagePath, this.clickedImagePath];
      paths.forEach((path) => {
        if (path && path.filename.length > 0) {
          ImageManager.loadBitmap(path.folder, path.filename);
        }
      });
    },

    setCommonEvent (id) {
      this._commonEventId = Number(id);
    },

    setEvalScript (script) {
      this._evalScript = script;
    },

    setOpenElementName (name) {
      this._openElementName = name;
    },

    isButtonInFront () {
      return this.layer.isButtonElementInFront(this);
    },

    setBitmap (type, path) {
      switch (type.toLowerCase()) {
        case 'normalimage':
          this.normalImagePath = path;
          this.bitmap = ImageManager.loadBitmap(path.folder, path.filename);
          this.opacity = 0;
          break;
        case 'hoverimage':
          this.hoverImagePath = path;
          break;
        case 'clickedimage':
          this.clickedImagePath = path;
          break;
      }
      this.refresh();
    },

    setToBitmapDimensions () {
      this.bitmap.addLoadListener((bitmap) => {
        this.width = bitmap.width;
        this.height = bitmap.height;
        this.contents.resize(this.width, this.height);
      });
    },

    updateButtonState () {
      if (!this.isTouching && !TouchInput.isPressed()) {
        // process normal state
        this.emit('normal', this);
        this.isClicked = false;
        this.isHovering = false;
        this.isNormal = true;

        if (this.normalImagePath) {
          const { folder, filename } = this.normalImagePath;
          if (filename.length <= 0) return;
          const normalImageBitmap = ImageManager.loadBitmap(folder, filename);
          if (this.bitmap !== normalImageBitmap) {
            this.bitmap = normalImageBitmap;
            this.refresh();
          }
          this.bitmap = ImageManager.loadBitmap(folder, filename);
        }
      }

      if (this.isTouching && !TouchInput.isPressed()) {
        // process touching state
        if (this.hoverImagePath) {
          const { folder, filename } = this.hoverImagePath;
          this.emit('hover', this);
          this.isHovering = true;
          this.isClicked = false;
          this.isNormal = false;

          if (filename.length <= 0) return;
          const hoverBitmap = ImageManager.loadBitmap(folder, filename);
          if (this.bitmap !== hoverBitmap) {
            this.bitmap = hoverBitmap;
            this.refresh();
          }
        }
      }

      if (TouchInput.isPressed() && this.isTouching) {
        // Process click state
        if (this.clickedImagePath) {
          const { folder, filename } = this.clickedImagePath;

          // We only perform action when not in edit/drag mode
          if (!$gameTemp.isElementEditMode() && !this.isClicked) {
            this.emit('clicked', this);
            this.isClicked = true;
          }

          this.isHovering = false;
          this.isNormal = false;

          if (filename.length <= 0) return;
          const clickedBitmap = ImageManager.loadBitmap(folder, filename);

          if (this.bitmap !== clickedBitmap) {
            this.bitmap = clickedBitmap;
            this.refresh();
          }
        }
      } else if (TouchInput.isReleased()) {
        this.isClicked = false;
      }
    },

    processButtonAction () {
      if (this.canClick === false) {
        return;
      }
      if (this._commonEventId > 0 && this._commonEventId < $dataCommonEvents.length) {
        if (this.buttonData) {
          setCurrentButtonData(this.buttonData);
        }
        $gameTemp.reserveCommonEvent(this._commonEventId);
      }

      if (this._evalScript !== '') {
        const buttonPresets = Params.buttonScripts;
        if (this._buttonData && this.buttonData > 0) {
          setCurrentButtonData(this.buttonData);
        }
        // eslint-disable-next-line no-eval
        safeEval(buttonPresets[this._evalScript]);
      }

      if (this._openElementName !== '') {
        this.emit('request-toggle-element', this._openElementName);
      }
    },

    drawImage () {
      if (this.bitmap) {
        this.bitmap.addLoadListener((bitmap) => {
          const sw = bitmap.width;
          const sh = bitmap.height;
          // this.setToBitmapDimensions();
          this.contents.blt(bitmap, 0, 0, sw, sh, 0, 0, this.width, this.height);
        });
      }
    },

    _processFilter () {
      if (this.keepOutline === false && $gameTemp.isPlaytest() && !$gameTemp.isElementEditMode()) {
        return;
      }
      super._processFilter();
    },

    refresh () {
      this.contents.clear();
      this.drawImage();
      // this.updateVisibility()
    },

    updateBehavior () {
      if (this.worldVisible === false) {
        return;
      }
      this.updateButtonState();
    },

    onResize (newWidth, newHeight) {
      if (this.keepAspectRatio && this.bitmap && this.bitmap.isReady()) {
        const aspectRatio = this.bitmap.width / this.bitmap.height;

        if (newWidth / newHeight > aspectRatio) {
          newWidth = newHeight * aspectRatio;
        } else {
          newHeight = newWidth / aspectRatio;
        }
      }

      this.width = Math.max(1, newWidth);
      this.height = Math.max(1, newHeight);

      if (this.contents && this.contents.resize) {
        this.contents.resize(this.width, this.height);
      }

      this.refresh();
    },
  };
}

function GaugeBehavior (state) {
  return {
    _gaugeData: { maxValue:state.gaugeData.maxValue, value: state.gaugeData.value, isVar: state.gaugeData.isVar },
    opacity: 0,
    padding: 0,
    isAnimated: false,
    frameData: state.frameData || {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      blockX: 0,
      blockY: 0,
      imagePath: {},
      maxFrames: 0,
    },

    color1: state.color1 || ColorManager.textColor(28),
    color2: state.color2 || ColorManager.textColor(29),

    bitmap: new Bitmap(),

    initBehavior () {
      if (this.frameData.imagePath.filename) {
        this.loadGaugeBitmap(this.frameData.imagePath);
      }
      this.setDimensions(this.width, this.height);
      this.refresh();
    },

    getBehaviorSettings () {
      return {
        gaugeData: this._gaugeData,
        frameData: this.frameData,
        isAnimated: this.isAnimated,
        color1: this.color1,
        color2: this.color2,
      };
    },

    setToBitmapDimensions () {
      this.bitmap.addLoadListener((bitmap) => {
        this.width = bitmap.width;
        this.height = bitmap.height;
        this.contents.resize(this.width, this.height);
      });
    },

    setGaugeValue (value, maxValue, isVar) {
      this._gaugeData.isVar = isVar !== undefined ? isVar : this._gaugeData.isVar;

      this._gaugeData.value = value || this._gaugeData.value;
      this._gaugeData.maxValue = maxValue || this._gaugeData.maxValue;

      this.refresh(); // Refresh here? Or emit a signal?
    },

    loadGaugeBitmap (path) {
      this.bitmap = ImageManager.loadBitmap(path.folder, path.filename);
      this.frameData.image = path;
      this.refresh(); // Refresh here? Or emit a signal?
    },

    drawGauge (width, height = 15, rate, color1, color2) {
      const fillW = Math.floor(width * rate);
      const textColor = ColorManager.textColor(19);
      this.contents.fillRect(0, 0, width, height, textColor);
      this.contents.gradientFillRect(0, 0, fillW, height, color1, color2);
    },

    onResize (newWidth, newHeight) {
      this.setDimensions(newWidth, newHeight);
    },

    refresh () {
      this.contents.clear();
      this.updateVisibility();
      if (!this._gaugeData) {
        return;
      }
      let rate = this._gaugeData.value / this._gaugeData.maxValue || 0;
      if (this._gaugeData.isVar) {
        rate = $gameVariables.value(this._gaugeData.value) / $gameVariables.value(this._gaugeData.maxValue);
      }
      rate = isFinite(rate) ? rate : 0;
      this.contents.resize(this.width, this.height);

      if (this.isAnimated) {
        const currentFrame = Math.floor(this._gaugeData.maxValue / this._gaugeData.value);

        const d = this.frameData;
        if (this.bitmap && this.frameData.imagePath) {
          this.bitmap.addLoadListener((bitmap) => {
            const dw = Number(d.width);
            const dh = Number(d.height);
            const dx = Number(d.x);
            const dy = currentFrame * dh;

            this.contents.blt(bitmap, dx, dy, dw, dh, 0, 0);
          });
        }
      } else {
        this.drawGauge(this.width, this.height, rate, this.color1, this.color2);
      }
    },
  };
}

class ElementFactory {
  static _createElementBase (rect, state) {
    const element = new Window_Base(rect);

    Object.assign(element,
      Elementable(state),
      Touchable(),
      Draggable(state),
      Selectable(state),
      MethodMixin(), // @TODO Rename and decouple.....eventually
    );

    element._originalUpdate = element.update;

    element.update = function () {
      this._originalUpdate();

      if (element.updateBehavior) {
        element.updateBehavior();
      }
    };

    return element;
  }

  static createElement (type, rect, options) {
    const state = ElementState(options);
    const element = this._createElementBase(rect, state);

    switch (type) {
      case 'gauge':
        Object.assign(element, GaugeBehavior(state));
        break;

      case 'image':
        Object.assign(element, ImageBehavior(state));
        break;

      case 'text':
        Object.assign(element, TextBehavior(state));
        break;

      case 'button':
        Object.assign(element, ButtonBehavior(state));
        break;
    }

    element.opacity = state.opacity; // hacky way to set opacity for now
    element.setType(type);
    if (element.initBehavior) {
      element.initBehavior();
    }

    return element;
  }
}

class ElementLayer extends PIXI.Container {
  constructor () {
    super();
    // Used to have a flattened array of all children including sub children
    this._flatChildren = [];
    this._mouseX = 0;
    this._mouseY = 0;
    this.allowDragging = true;
    this.allowTouching = true;
    this._isMouseDown = false;
    this._isDragging = false;
    this._selectedElement = null;
    this._touchedElement = null;
    this._touchPoint = new PIXI.Point();
    this.on('childAdded', this.onChildAdded, this);
    this.on('childRemoved', this.onChildRemoved, this);
    this._onMouseMoveListener = this.onMouseMove.bind(this);
    this._onMouseDownListener = this.onMouseDown.bind(this);
    this._onMouseUpListener = this.onMouseUp.bind(this);
    document.addEventListener('mousemove', this._onMouseMoveListener);
    document.addEventListener('mousedown', this._onMouseDownListener);
    document.addEventListener('mouseup', this._onMouseUpListener);
  }

  isElementDragging () {
    return this._selectedElement && this._isMouseDown;
  }

  destroy () {
    document.removeEventListener('mousemove', this._onMouseMoveListener);
    document.removeEventListener('mousedown', this._onMouseDownListener);
    document.removeEventListener('mouseup', this._onMouseUpListener);
  }

  getAllChildren () {
    return this._flatChildren;
  }

  getAllTouched (mouseX, mouseY) {
    return this._flatChildren.filter((child) => child.isTouched(mouseX, mouseY));
  }

  getTopMostElement (elementsArray) {
    const topMostElement = [...elementsArray];

    return topMostElement.sort((a, b) => {
      return b.getZIndex() - a.getZIndex();
    })[0];
  }

  isTopMostElement (elementsArray, element) {
    const topMostElement = this.getTopMostElement(elementsArray);

    if (!topMostElement) {
      return true;
    }
    return topMostElement === element;
  }

  // TODO: Refactor this out? Window_Draggable is only thing that uses it
  isButtonElementInFront (element) {
    const buttonElements = this.getAllTouched().filter((el) => el.type() === 'button');
    return this.isTopMostElement(buttonElements, element);
  }

  isAnyElementTouched (mouseX, mouseY) {
    return this.getAllTouched(mouseX, mouseY).length > 0;
  }

  onChildAdded (child /* parent, index */) {
    child.layer = this; // @TODO : Is this needed? (we should'nt change state from here)
    child.on('childAdded', this.onChildAdded, this);
    child.on('childRemoved', this.updateHierarchy, this);
    this.updateHierarchy();
  }

  onChildRemoved (/* child */) {
    this.updateHierarchy();
  }

  setChildIndex (child, index) {
    super.setChildIndex(child, index);
    this.updateHierarchy();
  }

  updateHierarchy () {
    this.updateFlatChildren();
    this.recalculateZIndexes();
  }

  recalculateZIndexes () {
    this._flatChildren.forEach((child, index) => {
      child.setZIndex(index);
    });
  }

  updateFlatChildren () {
    this._flatChildren = this.flattenChildren(this.children);
  }

  flattenChildren (children) {
    const result = [];
    children.forEach((child) => {
      const { children } = child;
      if (child.isElement) {
        result.push(child);
      }
      if (children.length > 0) {
        result.push(...this.flattenChildren(children));
      }
    });
    return result;
  }

  onMouseMove (event) {
    this._mouseX = event.clientX;
    this._mouseY = event.clientY;
    const touchedElements = this.getAllTouched(event.clientX, event.clientY);
    const topMostElement = this.getTopMostElement(touchedElements);

    if (topMostElement !== this._touchedElement) {
      if (this._touchedElement) {
        this.emit('element-untouched', this._touchedElement);
      }

      this._touchedElement = topMostElement;

      if (topMostElement) {
        this.emit('element-touched', topMostElement);
      }
    }

    if (this.allowDragging && this.isElementDragging()) {
      this._isDragging = true;
      this.emit('element-drag-move', {
        element: this._selectedElement,
        x: event.clientX - this._touchPoint.x,
        y: event.clientY - this._touchPoint.y,
      });
    }
  }

  onMouseDown (event) {
    if (this.allowTouching && this.isAnyElementTouched(event.clientX, event.clientY)) {
      const topMostElement = this.getTopMostElement(this.getAllTouched(event.clientX, event.clientY));
      this._touchPoint.x = event.clientX - topMostElement.x;
      this._touchPoint.y = event.clientY - topMostElement.y;
      this._selectedElement = topMostElement;
      this.emit('element-selected', this._selectedElement);
      this._isMouseDown = true;
    } else {
      this.emit('unselected', this._selectedElement);
      if (this._selectedElement) {
        this.emit('element-deselected', this._selectedElement);
        this._selectedElement = null;
      }
    }
  }

  onMouseUp (/* event */) {
    if (this._selectedElement) {
      this.emit('element-drag-end', this._selectedElement);
    }
    this._isMouseDown = false;
    this._isDragging = false;
  }
}

function ElementsManager () {
  /**
   * Emitted events
   *
   * element-ready
   * map-elements-loaded
   * element-added
   * element-removed
   *
   */
  const _emitter = new PIXI.utils.EventEmitter();
  const _elements = [];

  const _elementsLayer = new ElementLayer();

  _elementsLayer.on('element-selected', (element) => {
    _emitter.emit('element-selected', element);
  });

  _elementsLayer.on('element-deselected', (element) => {
    _emitter.emit('element-deselected', element);
  });

  _elementsLayer.on('element-drag-move', (data) => {
    _emitter.emit('element-drag-move', data);
  });

  _elementsLayer.on('element-drag-end', (element) => {
    _emitter.emit('element-drag-end', element);
  });

  _elementsLayer.on('element-touched', (element) => {
    _emitter.emit('element-touched', element);
  });

  _elementsLayer.on('element-untouched', (element) => {
    _emitter.emit('element-untouched', element);
  });

  return {
    on (eventName, listener, context) {
      _emitter.on(eventName, listener, context);
    },

    getLayer () {
      return _elementsLayer;
    },

    getElements (elementId) {
      return elementId ? _elements[elementId] : _elements;
    },

    hasElements () {
      return _elements.length > 0;
    },

    getByName (name) {
      const elements = this.getElements();
      return elements.find((el) => el.name === name);
    },

    isAnyElementTouched () {
      return _elementsLayer.isAnyElementTouched();
    },

    getAllButtons () {
      return this.allChildren.filter((child) => child.isButton);
    },

    update () {
      _elements.forEach((element) => {
        element.update();
      });
    },

    addElement (element) {
      if (!element.isChild()) {
        _elementsLayer.addChild(element);
      }

      if (element.isButton) {
        element.on('request-toggle-element', this.toggleAssignedElement, this);
      }
      _elements.push(element);
      _emitter.emit('element-added', element);
    },

    removeElement (element) {
      const elementIndex = _elements.indexOf(element);
      if (elementIndex !== -1) _elements.splice(elementIndex, 1);

      _elementsLayer.removeChild(element);
      element.destroy();
      _emitter.emit('element-removed');
    },

    createElementFromData (data, disableInteraction = false) {
      const rect = new Rectangle(data.x, data.y, data.width, data.height);
      const element = ElementFactory.createElement(data.type, rect, data);

      if (disableInteraction) element.disableInteraction();

      this.addElement(element);

      if (data.childElements) {
        data.childElements.forEach((childData) => {
          const childElement = this.createElementFromData(childData, disableInteraction);
          element.addChildElement(childElement);
        });
      }

      return element;
    },

    requestRefresh () {
      _elements.forEach((el) => {
        if (el.type() === 'text') {
          el.refreshContentsDimensions();
          return;
        }

        if (el.refresh) {
          el.refresh();
        }

        el.updateVisibility();
      });
    },

    toggleAssignedElement (elementName) {
      if (elementName !== '') {
        const element = _elementsLayer.getAllChildren().find((el) => {
          return el.getName() === elementName;
        });

        if (element) {
          element.toggleVisibility();
        }
      }
    },

    addToLayer (child) {
      _elementsLayer.addChild(child);
    },

    removeFromLayer (child) {
      _elementsLayer.removeChild(child);
    },

    addLayerTo (parent) {
      parent.addChildAt(_elementsLayer, 1);
      _emitter.emit('elements-ready');
    },

    removeLayerFrom (parent) {
      if (parent.children.includes(_elementsLayer)) {
        parent.removeChild(_elementsLayer);
      }
    },
  };
}

const elementManager = ElementsManager();

const aliasInitialize$1 = Scene_Base.prototype.initialize;
Scene_Base.prototype.initialize = function () {
  aliasInitialize$1.call(this);
  this._elementManager = elementManager;
  this._elementManager.on('element-touched', this.onElementTouched, this);
  this._elementManager.on('element-untouched', this.onElementRemoved, this);
};


Scene_Base.prototype.onElementTouched = function (element) {
  if (element && element.isButton && !$gameTemp.isElementEditMode()) {
    // We change state here because this element is a button that needs
    // to work a production build of the game and the HUD is not available.
    element.isTouching = true;
  }
};

Scene_Base.prototype.onElementRemoved = function (element) {
  if (element && element.isButton && !$gameTemp.isElementEditMode()) {
    // We change state here because this element is a button that needs
    // to work a production build of the game and the HUD is not available.
    element.isTouching = false;
  }
};

// We create this method since current version of `@fenixengine/tools` is broken
// It references window.isNwjs and it should be `Utils.nwjs()`

function fileExists (url) {
  try {
    if (Utils.isNwjs()) {
      return localFileExists(url);
    } else {
      return webFileExists(url);
    }
  } catch (error) {
    return false;
  }
}

var theme = {
  dark: {
    background: '#191919',
    formBackground: '#272727',
    tooltipBackground: '#4d4d4d',
    button: '#ffffff',
    panelButton: '#272727',
    sliderButton: '#7d7d7d',
    outline: '#53E1FF',
    border: '#383838',
    text: '#ffffff',
    textCursor: '#ffffff',
    dropdownTriangle: '#ffffff',
    fontSizes: {
      formLabel: 16,
      panelButton: 18,
      tooltip: 16,
      cursor: 18,
    },
  },
  light: {
    background: '#ffffff',
    formBackground: '#fafafa',
    tooltipBackground: '#cccccc',
    button: '#191919',
    panelButton: '#fafafa',
    sliderButton: '#7d7d7d',
    dropdownTriangle: '#272727',
    outline: '#53E1FF',
    border: '#dbdbdb',
    text: '#272727',
    textCursor: '#58c6fd',
    fontSizes: {
      formLabel: 16,
      panelButton: 18,
      tooltip: 16,
      cursor: 18,
    },
  },
};

function string2hex (string) {
  if (typeof string === 'string') {
    string = string.toLowerCase() || string;
    if (string[0] === '#') {
      string = string.slice(1);
    }
  }
  return parseInt(string, 16);
}

let activeTheme = 'dark';

const mapData = [];

var state = {
  getTheme () {
    return activeTheme;
  },

  setTheme (value) {
    activeTheme = value;
  },

  getThemeData () {
    return theme[activeTheme];
  },

  getThemeHexColor (type) {
    return string2hex(this.getThemeData()[type]);
  },

  getMapData () {
    return mapData;
  },

  addMapData (id, name) {
    mapData.push({ id, name });
  },
};

const ROOT_DIR$3 = require('path').dirname(process.mainModule.filename);
const DATA_DIR$2 = `${ROOT_DIR$3}\\data\\`;

const aliasInitialize = Scene_Boot.prototype.initialize;
Scene_Boot.prototype.initialize = function () {
  aliasInitialize.call(this);

  if (fileExists(`${DATA_DIR$2}/Elements.json`) === false) {
    console.warn('Elements.json does not exist, creating a new one');
    const emptyData = JSON.stringify({ mapElements: [], globalElements: [] });
    tryWriteFile(`${DATA_DIR$2}/Elements.json`, emptyData);
  }

  loadJSON(`${DATA_DIR$2}/MapInfos.json`)
    .then((data) => {
      data.forEach((map) => {
        if (map) {
          state.addMapData(map.id, map.name);
        }
      });
      return null;
    })
    .catch((err) => {
      console.error('Error loading map data:', err);
    });
};

const tempPoint = new Point();

class Control extends PIXI.Sprite {
  constructor () {
    super();
    this._width = 0;
    this._height = 0;
    this.tooltip = '';
    this._touchTime = 0;
    this.tooltipDelay = 120;
    this.isTooltipEnabled = false;
    this.anchor = { x: 0, y: 0 };
    this._pressed = false;
    this._touchEnabled = true;
    this._boundsDirty = true;
    this._layoutDirty = true;
    this._padding = { top: 0, right: 0, bottom: 0, left: 0 };
    this.on('childAdded', this.onChildAdded, this);
    this.on('childRemoved', this.onChildRemoved, this);
  }

  onChildAdded (child) {
    child.on('child-added', this.onChildAdded, this);
    child.on('child-removed', this.onChildRemoved, this);

    if (child instanceof Control) {
      child.on('size-changed', () => {
        this._boundsDirty = true;
        this._layoutDirty = true;
      });

      child.on('moved', () => {
        this._boundsDirty = true;
        this._layoutDirty = true;
      });

      child.on('tooltip-enabled', (tooltip) => {
        if (tooltip) {
          this.emit('tooltip-enabled', tooltip);
        }
      });

      child.on('tooltip-disabled', () => {
        this.emit('tooltip-disabled', child.tooltip);
      });
    }

    child.x += this.padding.left;
    child.y += this.padding.top;
    this._boundsDirty = true;
  }

  onChildRemoved (child) {
    child.off('child-added', this.onChildAdded, this);
    child.off('child-removed', this.onChildRemoved, this);
    this._boundsDirty = true;
    this._layoutDirty = true;
  }

  get width () {
    if (this._boundsDirty) {
      this.updateBounds();
    }
    return this._width;
  }

  set width (value) {
    if (this._width !== value) {
      this._width = value;
      this.emit('size-changed');
    }
  }

  get height () {
    if (this._boundsDirty) {
      this.updateBounds();
    }
    return this._height;
  }

  set height (value) {
    if (this._height !== value) {
      this._height = value;
      this.emit('size-changed');
    }
  }

  get usableWidth () {
    if (this._boundsDirty) {
      this.updateBounds();
    }
    return this._width - this.padding.left - this.padding.right;
  }

  get usableHeight () {
    if (this._boundsDirty) {
      this.updateBounds();
    }
    return this._height - this.padding.top - this.padding.bottom;
  }

  get x () {
    if (this._boundsDirty) {
      this.updateBounds();
    }
    return this.position.x;
  }

  set x (value) {
    if (this.x !== value) {
      this.position.x = value;
      this.emit('moved');
    }
  }

  get y () {
    if (this._boundsDirty) {
      this.updateBounds();
    }
    return this.position.y;
  }

  set y (value) {
    if (this.y !== value) {
      this.position.y = value;
      this.emit('moved');
    }
  }

  get padding () {
    return { ...this._padding };
  }

  set padding (value) {
    if (typeof value === 'number') {
      this._padding.left = this._padding.top = this._padding.right = this._padding.bottom = value;
    } else if (typeof value === 'object') {
      this._padding.left = value.left || this._padding.left;
      this._padding.top = value.top || this._padding.top;
      this._padding.right = value.right || this._padding.right;
      this._padding.bottom = value.bottom || this._padding.bottom;
    }
    this._layoutDirty = true;
    this._boundsDirty = true;
  }

  get paddingRight () {
    return this._padding.right;
  }

  set paddingRight (v) {
    this._padding.right = v;
    this._boundsDirty = true;
    this._layoutDirty = true;
  }

  get paddingLeft () {
    return this._padding.left;
  }

  set paddingLeft (v) {
    this._padding.left = v;
    this._boundsDirty = true;
    this._layoutDirty = true;
  }

  get paddingTop () {
    return this._padding.top;
  }

  set paddingTop (v) {
    this._padding.top = v;
    this._boundsDirty = true;
    this._layoutDirty = true;
  }

  get paddingBottom () {
    return this._padding.bottom;
  }

  set paddingBottom (v) {
    this._padding.bottom = v;
    this._boundsDirty = true;
    this._layoutDirty = true;
  }

  get tooltip () {
    return this._tooltip;
  }

  set tooltip (value) {
    this._tooltip = value;
  }

  get enableTouch () {
    return this._touchEnabled;
  }

  set enableTouch (value) {
    this._touchEnabled = value;
  }

  hide () {
    this.visible = false;
    this.emit('hide', this);
  }

  show () {
    this.visible = true;
    this.emit('show', this);
  }

  updateBounds () {
    if (!this._boundsDirty) {
      return;
    }
    let minX = this.paddingLeft;
    let maxX = this._width - this.paddingRight;
    let minY = this.paddingTop;
    let maxY = this._height - this.paddingBottom;

    this.children.forEach((child) => {
      if (child.excludeFromBounds) {
        return;
      }

      if (child.x < minX) {
        minX = child.x;
      }

      if (child.x + child.width > maxX) {
        maxX = child.x + child.width;
      }

      if (child.y < minY) {
        minY = child.y;
      }

      if (child.y + child.height > maxY) {
        maxY = child.y + child.height;
      }

    });


    this._width = maxX;
    this._height = maxY;

    this._layoutDirty = true;
    this.layout();

    this._boundsDirty = false;
  }

  getBounds () {
    if (this._boundsDirty) {
      this.updateBounds();
    }
    return new Rectangle(this.x, this.y, this.width, this.height);
  }

  layout () {
    if (!this._layoutDirty) {
      return;
    }    this.children.forEach((child) => {
      if (child.excludeFromBounds) {
        return;
      }

      const contentWidth = this._width - this.padding.left - this.padding.right;
      const contentHeight = this._height - this.padding.top - this.padding.bottom;

      const childContentX = child.x - this.padding.left;
      const childContentY = child.y - this.padding.top;

      let changed = false;
      let newX = child.x;
      let newY = child.y;

      if (childContentX < 0) {
        newX = this.padding.left;
        changed = true;
      }
      if (childContentY < 0) {
        newY = this.padding.top;
        changed = true;
      }

      if (childContentX + child.width > contentWidth) {
        if (child.width <= contentWidth) {
          newX = this.padding.left + contentWidth - child.width;
          changed = true;
        }
      }

      if (childContentY + child.height > contentHeight) {
        if (child.height <= contentHeight) {
          newY = this.padding.top + contentHeight - child.height;
          changed = true;
        }
      }

      if (changed) {
        child.x = newX;
        child.y = newY;
        child.position.x = newX;
        child.position.y = newY;

        if (child instanceof Control) {
          child.emit('moved');
        }
      }
    });

    this._layoutDirty = false;
    return this;
  }

  toggle () {
    this.visible = !this.visible;
  }

  isTouched () {
    return this.containsPoint(new Point(TouchInput.x, TouchInput.y)) &&
      this.worldVisible && this._touchEnabled;
  }

  containsPoint (point) {
    this.worldTransform.applyInverse(point, tempPoint);
    const width = this._width;
    const height = this._height;
    const x1 = -width * this.anchor.x;
    let y1 = 0;
    if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
      y1 = -height * this.anchor.y;
      if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
        return true;
      }
    }
    return false;
  }

  refresh () {}

  processTouch () {
    if (this.isTouched()) {
      this._touchTime++;
      if (!this._hovered && TouchInput.isHovered()) {
        this._hovered = true;
        this.onMouseEnter();
        this.emit('mouse-enter', this);
      }
    } else {
      if (this._hovered) {
        this.onMouseExit();
        this.emit('mouse-exit', this);
      }
      this._touchTime = 0;
      this._hovered = false;
    }
  }

  updateTooltip () {
    if (this.isTouched() && this._tooltip) {
      if (this._touchTime > this.tooltipDelay && !this.isTooltipEnabled) {
        this.emit('tooltip-enabled', this._tooltip);
        this.isTooltipEnabled = true;
      }
    } else {
      if (this.isTooltipEnabled) {
        this.emit('tooltip-disabled');
        this.isTooltipEnabled = false;
      }
    }
  }

  update () {
    if (!this.visible) {
      return;
    }
    this.processTouch();
    this.updateTooltip();
    this.children.forEach((child) => {
      if (child.update) {
        child.update();
      }
    });
  }

  onMouseEnter () { }

  onMouseExit () { }
}

class Button extends Control {
  constructor (options) {
    super();
    const {
      textures = { normal: null, hover: null, click: null },
      x = 0,
      y = 0,
    } = options;
    this.position = { x, y };
    this._textures = {
      normal: this._setTexture(textures.normal),
      hover: this._setTexture(textures.hover),
      click: this._setTexture(textures.click),
    };
    this.tint = state.getThemeHexColor('button') || 0xffffff;
    this._pressed = false;
    if (this._textures.normal && this._textures.normal.valid) {
      this.onTextureReady(this._textures.normal);
    } else if (this._textures.normal) {
      this._textures.normal.on('update', (texture) => this.onTextureReady(texture));
    }
  }

  _setTexture (texture) {
    if (typeof texture === 'string') {
      return PIXI.Texture.from(texture);
    }
    if (texture instanceof PIXI.Texture) {
      return texture;
    }
    return null;
  }

  onTextureReady (texture) {
    this.texture = texture;
    this.width = this.texture.width;
    this.height = this.texture.height;
    this.emit('texture-ready');
  }

  _createSprite (texture) {
    this._sprite = new PIXI.Sprite(texture);
    this.addChild(this._sprite);
  }

  isClickEnabled () {
    return this.worldVisible;
  }

  update () {
    super.update();
    if (this.isTouched()) {
      if (TouchInput.isTriggered()) {
        this._pressed = true;
        this.onPress();
        this.emit('press');
      }
      if (this._pressed && TouchInput.isReleased()) {
        this._pressed = false;
        this.onClick();
        this.emit('click');
      }
    } else {
      this._pressed = false;
    }
    if (TouchInput.isReleased()) {
      this.emit('release');
    }
  }

  onPress () { }

  onClick () { }

  onMouseEnter () {}

  onMouseExit () {}
}

class PanelBase extends Control {
  constructor (options = {}) {
    super();
    const {
      width = 175,
      height = 300,
      isScrollable = false,
    } = options;
    this.isActive = false;
    this.scrollSpeed = 5;
    this.minScrollY = 0;
    this.maxScrollY = height;
    this._buttons = [];
    this._isScrollable = isScrollable || false;
    this.width = width;
    this.height = height;
    this._keyDownListener = this.onKeyDown.bind(this);
    this._onMouseWheelListener = this._onMouseWheel.bind(this);
    document.addEventListener('keydown', this._keyDownListener);
    document.addEventListener('wheel', this._onMouseWheelListener);
    this.create();
    this.refresh();
  }

  set isScrollable (value) {
    if (value) {
      this._maskGraphic.visible = true;
      this._contents.mask = this._maskGraphic;
    } else {
      this._contents.mask = null;
    }
    this._isScrollable = value;
    this.refresh();
  }

  get isScrollable () {
    return this._isScrollable;
  }

  scrollUp () {
    if (this._contents.y >= this.minScrollY) {
      return;
    }
    this._contents.y = Math.min(this._contents.y + this.scrollSpeed, this.minScrollY);
    this.refresh();
  }

  scrollDown () {
    if (this._contents.y <= -this.maxScrollY) {
      return;
    }
    const minY = Math.min(0, this.height - this._contents.height);
    this._contents.y = Math.max(this._contents.y - this.scrollSpeed, minY);
    this.refresh();
  }

  addContent (...children) {
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        this._contents.addChild(children[i]);
      }
    } else {
      this._contents.addChild(children[0]);
    }

    this.maxScrollY = Math.max(0, this._contents.height - this.height);
  }

  addContentAt (child, index) {
    this._contents.addChildAt(child, index);
  }

  create () {
    this._createBackground();
    this._createScrollArea();
    this._createContents();
    this._createScrollbar();
  }

  _backgroundGraphics (width, height) {
    const background = new PIXI.Graphics();
    background.lineStyle(1, state.getThemeHexColor('border'));
    background.beginFill(state.getThemeHexColor('background'));
    background.drawRect(0, 0, width, height);
    background.endFill();

    return background;
  }

  _createContents () {
    this._contents = new Control();
    this.addChild(this._contents);
  }

  _createScrollArea () {
    this._maskGraphic = new PIXI.Graphics();
    this._maskGraphic.beginFill(0xFF3300);
    this._maskGraphic.drawRect(0, 0, this.width, this.height);
    this._maskGraphic.endFill();
    this._maskGraphic.visible = false;
    this.addChild(this._maskGraphic);
  }

  _createScrollbar () {
    this._scrollbar = new PIXI.Graphics();
    this.addChild(this._scrollbar);
  }

  redrawScrollArea () {
    if (this._maskGraphic) {
      this._maskGraphic.clear();
      this._maskGraphic.beginFill(0xFF3300);
      this._maskGraphic.drawRect(0, 0, this.width, this.height);
      this._maskGraphic.endFill();
    }
  }

  updateScrollbar () {
    if (!this._scrollbar) { return; }
    this._scrollbar.clear();

    const visibleRatio = this.height / this._contents.height;
    const barHeight = this.height * visibleRatio;
    const scrollYRatio = -this._contents.y / (this._contents.height - this.height);
    const barY = scrollYRatio * (this.height - barHeight);

    this._scrollbar.beginFill(0x888888);
    this._scrollbar.drawRect(this.width - 6, barY, 4, barHeight);
    this._scrollbar.endFill();
  }

  _createBackground () {
    const background = this._backgroundGraphics(this.width, this.height);
    const texture = Graphics.generateTexture(background);
    this._background = new PIXI.Sprite(texture);

    this.addChild(this._background);
  }

  refresh () {
    this._background.texture = Graphics.generateTexture(this._backgroundGraphics(this.width, this.height));
    if (this.isScrollable) {
      this.redrawScrollArea();
      this.updateScrollbar();
    }
  }

  onKeyDown (event) {
    if (this.isScrollable === false && this.isActive === false) {
      return;
    }
    if (event.code === 'ArrowUp') {
      this.scrollUp();
    }
    if (event.code === 'ArrowDown') {
      this.scrollDown();
    }
  }

  _onMouseWheel (event) {
    if (this.isScrollable === false && this.isActive === false) {
      return;
    }
    if (event.deltaY > 0) {
      this.scrollDown();
    }
    if (event.deltaY < 0) {
      this.scrollUp();
    }
  }

  terminate () {
    document.removeEventListener('keydown', this._keyDownListener);
    document.removeEventListener('wheel', this._onMouseWheelListener);
    this.children.forEach((child) => {
      if (child.terminate) {
        child.terminate();
      }
    });
  }
}

class OptionsPanel extends Control {
  constructor (options = {}) {
    super();
    this.init(options);
    this.create();
  }

  init (options) {
    this.options = options;
    this._handler = null;
    this.isExpanded = false;
    this._title = 'Options';
  }

  onExpanded () {}

  setHandler (handler) {
    this._handler = handler;
  }

  callHandler (type, value) {
    this._handler(type, value);
  }

  hide () {
    this._contents.visible = false;
  }

  show () {
    this._contents.visible = true;
  }

  addToContents (child) {
    this._contents.addChild(child);
  }

  open () {
    this.show();
    this.onExpanded(this);
    this.isExpanded = true;
    this.emit('opened');
  }

  close () {
    this.hide();
    this.isExpanded = false;
    this.emit('closed');
  }

  expand () {
    if (this.isExpanded) {
      this.close();
    } else {
      this.open();
    }
  }

  isTouched () {
    return this._contents.isTouched();
  }

  create () {
    this.createPanelExpandButton();
    this.createPanelContents();
  }

  createPanelExpandButton () {
    const buttonBackground = new PIXI.Graphics()
      .lineStyle(1, state.getThemeHexColor('border'))
      .beginFill(state.getThemeHexColor('panelButton'))
      .drawRect(0, 0, this.options.buttonWidth || 173, this.options.buttonHeight || 35)
      .endFill();

    this._titleText = new PIXI.Text(this._title, {
      fontSize: state.getThemeData().fontSizes.panelButton,
      fill: state.getThemeHexColor('text'),
      align: this.options.textAlign || 'center',
    });
    this._titleText.y = buttonBackground.height / 2 - this._titleText.height / 2;
    this._titleText.x = buttonBackground.width / 2 - this._titleText.width / 2;

    this._button = new Button({
      textures: { normal: Graphics.generateTexture(buttonBackground) },
    });
    this._button.tint = 0xffffff; // disables the tint from the theme
    this._button.on('click', this.expand.bind(this));
    this.addChild(this._button);
    this._button.addChild(this._titleText);
    this.updateBounds();
  }

  refresh () {
    this._contents.refresh();
  }

  setText (text) {
    this._titleText.text = text;
    this._titleText.y = 8;
    this._titleText.x = this.width / 2 - this._titleText.width / 2;
  }

  createPanelContents () {
    this._contents = new PanelBase({
      width: this.options.width || 170,
      height: this.options.height || 160,
    });
    this._contents.excludeFromBounds = true;
    this._contents.x = 175;
    this._contents.visible = false;
    this._contents.on('tooltip-enabled', (t) => {
      this.emit('tooltip-enabled', t);
    });
    this._contents.on('tooltip-disabled', () => {
      this.emit('tooltip-disabled');
    });
    this.addChild(this._contents);
  }
}

class TextButton extends Button {
  constructor (options) {
    super(options);
    this._text = options.text;
    this.createText();
  }

  setText (newText) {
    this._textSprite.text = newText;
    this._text = newText;
  }

  createText () {
    this._textSprite = new PIXI.Text(this._text, {
      fill: state.getThemeHexColor('text'),
      fontSize: 18,
    });
    this.addChild(this._textSprite);
    this.filterArea = this.getBounds();
  }

  onMouseEnter () {}

  onMouseExit () {}
}

class DropDown extends OptionsPanel {
  constructor (options = {}) {
    super({
      width: 120,
      height: 100,
      buttonWidth: 120,
      buttonHeight: 25,
      textAlign: 'left',
      ...options,
    });
    this.x = options.x || 0;
    this.y = options.y || 0;
  }

  init (options) {
    super.init(options);
    this.labelText = options.label || '';
    this._entries = options.entries || [];
    this._entryButtons = [];
    this._selectedEntry = 0;
    this._maxVisible = 3;
  }

  setMaxVisible (amount) {
    if (this._entries.length < amount) {
      amount = this._entries.length;
    }
    this._maxVisible = amount;
    this.refresh();
  }

  maxWidth () {
    const defaultwidth = 100;
    const numbers = this._entryButtons.map((e) => e.width).filter((n) => n);
    return Math.max(...numbers, defaultwidth) + 5;
  }

  maxHeight () {
    let height = 0;
    const buttonHeight = this._entryButtons[0].height;
    for (let i = 0; i < this._maxVisible; i++) {
      height += buttonHeight + 5;
    }
    return height + 10;
  }

  maxScrollHeight () {
    let height = 0;
    const buttonHeight = this._entryButtons[0].height;
    for (let i = 0; i < this._entryButtons.length; i++) {
      height += buttonHeight + 5;
    }
    return height - this.maxHeight() + 10;
  }

  currentEntryName () {
    return this._entries[this._selectedEntry];
  }

  currentEntryIndex () {
    return this._entries.indexOf(this._selectedEntry);
  }

  create () {
    this.createEntryButtons();
    super.create();
    this.createTriangle();
    this.createSelectRectangle();
    this.createLabel();
  }

  createLabel () {
    this._label = new PIXI.Text(`${this.labelText}: `, {
      fontSize: state.getThemeData().fontSizes.formLabel,
      fill: state.getThemeHexColor('text'),
    });
    if (!this._label) {
      return;
    }
    this._label.x -= this._label.width + 3;
    this._label.y = 2;
    this.addChild(this._label);
  }

  _triangleGraphics () {
    const triangle = new PIXI.Graphics();
    triangle.lineStyle(1, state.getThemeHexColor('border'));
    triangle.beginFill(state.getThemeHexColor('dropdownTriangle'));
    triangle.moveTo(0, 0);
    triangle.lineTo(15, 0);
    triangle.lineTo(15 / 2, 15);
    triangle.lineTo(0, 0);
    triangle.endFill();

    return triangle;
  }

  createTriangle () {
    const tri = this._triangleGraphics();
    this._dropdownTriTexture = Graphics.generateTexture(tri);
    this._dropTri = new PIXI.Sprite(this._dropdownTriTexture);
    this._dropTri.anchor.set(0.5, 0.5);

    this._dropTri.x = this._button.width - this._dropTri.width + 3;
    this._dropTri.y = this._button.height / 2;

    this.addChild(this._dropTri);
  }

  createEntryButtons () {
    let y = 10;
    this._entries.forEach((entry) => {
      const entryButton = new TextButton({ x: 15, y: y, text: entry });
      this._entryButtonHeight = entryButton.height;

      entryButton.on('click', () => {
        this.onEntrySelected(entry);
        this.emit('selected', entry);
        this.hide();
      });

      entryButton.on('mouse-enter', this.onDropdownItemMouseEnter.bind(this));
      entryButton.on('mouse-exit', this.onDropdownItemMouseExit.bind(this));

      this._entryButtons.push(entryButton);

      y += entryButton.height + 5;
    });

    this._entryButtons.forEach((b) => { b.width = this.maxWidth(); });
  }

  createPanelExpandButton () {
    super.createPanelExpandButton();
    this._titleText.x = 3;
  }

  createPanelContents () {
    super.createPanelContents();

    this._contents.addContent(...this._entryButtons);
    this._contents.width = this.maxWidth();
    this._contents.height = this.maxHeight();
    this._contents.x = this._button.x;
    this._contents.y = this._button.y + this._button.height;

    this._contents.isScrollable = true;
    this._contents.maxScrollY = this.maxScrollHeight();

    this.refresh();
  }

  createSelectRectangle () {
    const background = new PIXI.Graphics()
      .beginFill(0x505050)
      .drawRect(0, 0, this.maxWidth() - 2, this._entryButtonHeight)
      .endFill();
    this._selectRect = new PIXI.Sprite(Graphics.generateTexture(background));
    this._selectRect.x = 2;
    this._selectRect.visible = false;
    this._contents.addContentAt(this._selectRect);
  }

  refresh () {
    this._titleText.text = this._entries[this._selectedEntry];
    if (this._titleText.width > this._button.width) {
      // shorten text to fit within button width
      const buttonWidth = this._button.width - 50;
      const textWidth = this._titleText.width;
      const charAmount = this._titleText.text.length;
      const newText = this._titleText.text.substr(0, buttonWidth / textWidth * charAmount) + '...';
      this._titleText.text = newText;
    }
    this._contents.height = this.maxHeight();
    super.refresh();
  }

  addEntry (entry) {
    this.entries.push(entry);
  }

  setEntry (entryName) {
    const index = this._entries.indexOf(entryName);
    if (index) {
      this._selectedEntry = index;
    }
    this.refresh();
  }

  update () {
    super.update();
  }

  onDropdownItemMouseEnter (entryButton) {
    this._selectRect.visible = true;
    this._selectRect.y = entryButton.y;
  }

  onDropdownItemMouseExit (/* entryButton */) {
    this._selectRect.visible = false;
  }

  onClick () {
    this._dropdown.show();
    this._contents.isActive = true;
  }

  onEntrySelected (entry) {
    this._contents.isActive = false;
    this._selectRect.visible = false;
    this._selectedEntry = this._entries.indexOf(entry);
    this.close();
    this.refresh();
  }
}

class ToggleButton extends Control {
  constructor (options) {
    super();
    const {
      x,
      y,
      texture,
      offTexture,
      label,
      toggleState,
    } = options;
    options.onTint = options.onTint || 0x15f59f;
    options.offTint = options.offTint || 0xf92665;
    this.options = options;
    this.x = x || 0;
    this.y = y || 0;
    this.toggleState = toggleState || false;
    this._toggleTextures = {
      on: texture || ImageManager.elementsUiTexture('toggle-on-solid-(small)'),
      off: offTexture || ImageManager.elementsUiTexture('toggle-off-solid-(small)'),
    };
    this.canToggle = true;
    this.formOffset = 0;
    this.isEnabled = true;
    this._createLabel(label);
    this._createToggleButton(options);
  }

  refresh () {
    this.refreshTextures();
    if (this.options.label && this.formOffset) {
      this._toggleButton.x = this.formOffset;
    }
  }

  labelWidth () {
    return this._label.width;
  }

  _createLabel (label) {
    if (!label) { return; }
    this._label = new PIXI.Text(`${label} `, {
      fontSize: state.getThemeData().fontSizes.formLabel,
      fill: state.getThemeHexColor('text'),
    });
    this.formOffset = this._label.x + this._label.width + 5;
    this.addChild(this._label);
  }

  _createToggleButton () {
    const normalTexture = this.toggleState
      ? this._toggleTextures.on
      : this._toggleTextures.off;
    this._toggleButton = new Button({
      x: this.formOffset,
      y: 0,
      textures: { normal: normalTexture },
    });
    this._toggleButton.tint = this.toggleState ? 0x15f59f : 0xf92665;
    this._toggleButton.on('click', () => {
      this.callClickHandler();
    });

    if (this.options.label) {
      this._toggleButton.y = this._label.y - this._label.height / 3;
    }

    this.addChild(this._toggleButton);
  }

  toggle () {
    if (this.toggleState === true) {
      this.toggleState = false;
    } else {
      this.toggleState = true;
    }

    this.emit('toggle', this.toggleState, this);

    if (!this.canToggle) {
      this.toggleState = !this.toggleState;
      return;
    }
    this.refresh();
  }

  isOn () {
    return this.toggleState === true;
  }

  setToggleState (value) {
    this.toggleState = value;
    this.refresh();
  }

  refreshTextures () {
    if (this.toggleState === true && this._toggleButton.texture !== this._toggleTextures.on) {
      this._toggleButton.texture = this._toggleTextures.on;
      this._toggleButton.tint = this.options.onTint;
    } else if (this.toggleState === false && this._toggleButton.texture !== this._toggleTextures.off) {
      this._toggleButton.texture = this._toggleTextures.off;
      this._toggleButton.tint = this.options.offTint;
    }
  }

  callClickHandler () {
    if (this.isEnabled) {
      this.toggle();
    }
  }
}

class ToolbarPanel extends PanelBase {
  constructor () {
    super({
      width: Graphics.width - 1,
      height: 50,
    });
    this._contents.padding = {
      top: 15,
      right: 5,
      bottom: 5,
      left: 5,
    };
    this._buttons = [];
    this.createButtons();
    this.setupButtonEvents();
    this._contents.updateBounds();
    this.refresh();
  }

  createButtons () {
    this._elementOptionsButton = new Button({
      x: 55,
      y: 0,
      textures: {
        normal: ImageManager.elementsUiTexture('sliders-h-solid'),
      },
    });

    this._elementTreeButton = new Button({
      x: this._elementOptionsButton.x + 45,
      y: 0,
      textures: {
        normal: ImageManager.elementsUiTexture('list-alt-solid-(small)'),
      },
    });

    this.gridToggleButton = new ToggleButton({
      x: this._elementTreeButton.x + 45,
      y: 0,
      toggleState: true,
      texture: ImageManager.elementsUiTexture('grid-on'),
      offTexture: ImageManager.elementsUiTexture('grid-off'),
    });

    this._isolateElementToggle = new ToggleButton({
      x: this.gridToggleButton.x + 45,
      y: 0,
      toggleState: false,
      label: 'Isolate',
    });

    this._saveButton = new Button({
      x: 0,
      y: 0,
      textures: {
        normal: ImageManager.elementsUiTexture('save-solid-(small)'),
      },
    });

    this._saveButton.x = this.width - (this._saveButton.width + 10);

    const maps = state.getMapData();
    const currentMap = maps.find((map) => map.id === $gameMap.mapId());
    const mapNames = maps.map((map) => map.name);

    this._mapSelector = new DropDown({
      x: this.width - (this._saveButton.width + 50),
      y: 0,
      entries: mapNames,
      label: 'Map',
    });

    this._mapSelector.on('selected', (entry) => {
      this.emit('map-change', entry);
    });

    this._mapSelector.x = this._mapSelector.x - this._mapSelector.maxWidth();
    this._mapSelector.setEntry(currentMap.name);
    this._mapSelector.setMaxVisible(5);

    this._buttons.push(
      this._elementOptionsButton,
      this._elementTreeButton,
      this._isolateElementToggle,
      this._mapSelector,
      this._saveButton,
      this.gridToggleButton,
    );

    this.addContent(...this._buttons);
  }

  setupButtonEvents () {
    this._elementOptionsButton.on('click', () => {
      this.emit('toggle-options');
    });

    this._elementTreeButton.on('click', () => {
      this.emit('toggle-list');
    });

    this._isolateElementToggle.on('toggle', (toggleState, button) => {
      this.emit('toggle-isolate', toggleState, button);
    });

    this._saveButton.on('click', () => {
      this.emit('save');
    });

    this._saveButton.on('texture-ready', () => {
      this._saveButton.x = this.width - (this._saveButton.width + 15);
    });

    this.gridToggleButton.on('toggle', (toggleState, button) => {
      this.emit('grid-toggle', toggleState, button);
    });
  }
}

const ROOT_DIR$2 = require('path').dirname(process.mainModule.filename);
const IMG_DIR = `${ROOT_DIR$2}\\img\\elements`;

class InputForm extends Control {
  constructor (label, value = 'No Value', options) {
    super();
    this.options = {
      width: 100,
      height: 20,
      wordWrap: false,
      label,
      value,
      expandable: true,
      selectable: false,
      fileInput: false,
      ...options,
    };
    this.formOffset = 0;
    this._onChange = options.onChange;
    this._formBackground = null;
    this._onInputListener = this._updateKeystrokes.bind(this);
    this._createLabelText(label);
    this._createValueText(value);
    this._createFormBackground();
    this.createCursor();
    this._createInputForm();
    this._createFileDialog();
    this._createEventListeners();
    this.refresh();
    this.isDialogOpen = false;
    this._isBackgroundFiltered = false;
    this._outlineFilter = new OutlineFilter(2, 0x53E1FF);
    this._outlineFilter.padding = 5;
    this._textMetrics = PIXI.TextMetrics.measureText(this._currentText.text, this._textStyle);
  }

  isActive () {
    return this._inputFormElement === document.activeElement;
  }

  text () {
    return this._currentText.text;
  }

  labelWidth () {
    return this._label.width;
  }

  setText (text) {
    text = text ? String(text) : '';
    this._currentText.text = text;
    this.options.value = text;
    this._textMetrics = PIXI.TextMetrics.measureText(text, this._textStyle);
    this._inputFormElement.value = text;
    this.updateCursor();
  }

  createCursor () {
    this._cursor = new PIXI.Text('|', {
      fontSize: state.getThemeData().fontSizes.cursor,
      fill: state.getThemeHexColor('textCursor'),
    });
    this._cursor.y -= 2;
    this._cursor.visible = false;
    this.addChild(this._cursor);
  }

  _createFileDialog () {
    this._fileDialog = document.createElement('input');
    this._fileDialog.type = 'file';
    this._fileDialog.accept = '.png';
    this._fileDialog.nwworkingdir = IMG_DIR;
  }

  _createLabelText (label) {
    this._label = new PIXI.Text(`${label}: `, {
      fontSize: state.getThemeData().fontSizes.formLabel,
      fill: state.getThemeHexColor('text'),
    });
    if (!label) {
      return;
    }
    this.formOffset = this._label.width + 3;
    this.addChild(this._label);
  }

  _createValueText (text) {
    this._textStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: state.getThemeData().fontSizes.formLabel,
      fill: state.getThemeHexColor('text'),
      align: 'left',
      wordWrap: this.options.wordWrap,
      wordWrapWidth: this.options.width,
    });
    this._currentText = new PIXI.Text(text, this._textStyle);

    this.addChild(this._currentText);
  }

  _createInputForm () {
    this._inputFormElement = document.createElement('textarea');
    this._inputFormElement.value = this._currentText.text;
    this._inputFormElement.style.opacity = 0;
    document.body.appendChild(this._inputFormElement);
  }

  _createEventListeners () {
    // eslint-disable-next-line n/no-missing-require
    const gui = require('nw.gui');
    const win = gui.Window.get();

    this._onMouseDownListener = this._onMousePress.bind(this);
    document.addEventListener('mousedown', this._onMouseDownListener);
    if (!this.options.selectable || !this.options.fileInput) {
      this._inputFormElement.oninput = this._onInputListener;
      this._inputFormElement.onblur = this._onBlur.bind(this);
      this._inputFormElement.addEventListener('keyup', this._onKeyUp.bind(this));
      this._inputFormElement.addEventListener('keydown', this._onKeyDown.bind(this));
    }
    if (this.options.fileInput) {
      this._fileDialog.addEventListener('change', () => {
        const path = this._fileDialog.value;
        const paths = path.split(/[//\\]/);
        const folder = `img/${paths[paths.length - 2]}/`;
        const filename = paths[paths.length - 1].replace('.png', '');
        this.setText(filename);
        this._onChange({ folder, filename });
        this.isDialogOpen = false;
        this.emit('dialog-close');
      });
      this._fileDialog.onclick = () => {
        event.target.value = null;
        this.isDialogOpen = true;
        this.emit('dialog-open');
      };

      win.once('focus', () => {
        setTimeout(() => {
          const value = this._fileDialog.value.trim();
          if (value.length === 0 && this.isDialogOpen) {
            this.isDialogOpen = false;
            this.emit('dialog-close');
          }
        }, 500);
      });
    }
  }

  _backgroundGraphics (width, height) {
    const background = new PIXI.Graphics();
    background.lineStyle(1, state.getThemeHexColor('border'));
    background.beginFill(state.getThemeHexColor('formBackground'));
    background.drawRect(0, 0, width, height);
    background.endFill();

    return background;
  }

  _createFormBackground () {
    const background = this._backgroundGraphics(this.options.width, this.options.height);
    this._formTexture = Graphics.generateTexture(background);
    this._formBackground = new PIXI.Sprite(this._formTexture);

    this._formBackground.x = this.formOffset;

    this.addChildAt(this._formBackground, 0);
  }

  _expandFormBackground () {
    if (this.options.expandable === false) {
      return;
    }
    const width = this._textMetrics.width + 10;
    if (this._currentText.text.length > 12) {
      const background = this._backgroundGraphics(width, this.options.height);
      this._formBackground.texture = Graphics.generateTexture(background);
    } else if (this._currentText.text.length <= 12) {
      this._formBackground.texture = this._formTexture;
    }
  }

  _onMousePress (event) {
    if (this.isFormBackgroundTouched()) {
      if (event.button === 2) {
        this.setText();
        this._focusForm(event);
        return;
      }

      if (this.options.selectable) {
        this.emit('clicked', this);
        return;
      }
      if (this.options.fileInput) {
        this._fileDialog.click();
      }
      this._focusForm(event);
      return;
    }
    this._inputFormElement.blur();
  }

  _focusForm (event) {
    const endPos = this._currentText.text.length;
    this._inputFormElement.value = this._currentText.text;
    event.preventDefault();
    this._inputFormElement.focus();
    this._inputFormElement.setSelectionRange(endPos, endPos);
    Input.isPreventDefault = false;
    this._cursor.visible = true;
    this.updateCursor();
  }

  _onBlur (/* event */) {
    if (document.activeElement !== this._inputFormElement) {
      this._inputFormElement.value = '';
      this._inputFormElement.removeEventListener('input', this._onInputListener);
      Input.isPreventDefault = true;
      this._cursor.visible = false;
    }
  }

  _updateKeystrokes (event) {
    if (document.activeElement === this._inputFormElement) {
      this.setText(event.target.value);
      this.updateCursor();
      if (this._onChange && typeof this._onChange === 'function') {
        this._onChange(event.target.value);
      }
    }
  }

  _onKeyUp (event) {
    if (event.key === 'Escape' || event.key === 'Delete') {
      this.setText();
      this._onChange(this._currentText.text);
    }
    this.updateCursor();
  }

  _onKeyDown (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      return;
    }
    this.updateCursor();
  }

  terminate () {
    document.removeEventListener('mousedown', this._onMouseDownListener);
    this._inputFormElement.removeEventListener('oninput', this._onInputListener);
    this._inputFormElement.value = '';
  }

  _clearOutlineFilter () {
    this._formBackground.filters = [];
    this._isBackgroundFiltered = false;
  }

  _applyOutlineFilter () {
    this._formBackground.filters = [this._outlineFilter];
    this._isBackgroundFiltered = true;
  }

  refresh () {
    super.refresh();
    if (this.options.label && this.formOffset) {
      this._formBackground.x = this.formOffset;
    }
    this._currentText.x = this._formBackground.x + 2;
    this._currentText.y = this._formBackground.y + 2;
  }

  isFormBackgroundTouched () {
    const local = this.toLocal(new Point(TouchInput.x, TouchInput.y));
    const x = local.x;
    const y = local.y;
    const rect = new Rectangle(
      this._formBackground.x,
      this._formBackground.y,
      this._formBackground.width,
      this._formBackground.height,
    );

    if (!this.visible || !this.parent.visible || !this.worldVisible) {
      return false;
    }
    return rect.contains(x, y);
  }

  _getLine (caretPosition) {
    let totalCharacters = 0;
    let lineIndex = 0;
    const lines = this._textMetrics.lines;

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      totalCharacters += (line.length + 1);
      if (caretPosition < totalCharacters) {
        lineIndex = index;
      }
    }

    return lineIndex;
  }

  updateCursor () {
    if (this.options.selectable || this.options.fileInput) {
      return;
    }
    let pos = this._inputFormElement.selectionStart;
    // Pixi.Text does not allow '' and auto inserts a space character
    let text = this._currentText.text === ' ' ? '' : this._currentText.text;
    let difference = 0;
    let lineIndex = this._getLine(pos);

    if (text === '') {
      this._cursor.y = -2;
      this._cursor.x = this._currentText.x;
      return;
    }

    for (let i = 0; i < this._textMetrics.lines.length; i++) {
      const line = this._textMetrics.lines[i];
      if (i < lineIndex) {
        difference += (line.length + 1);
      }
    }

    pos -= difference;

    if (pos < 0 && lineIndex > 0) {
      lineIndex--;
    }

    if (lineIndex === 0) {
      pos = this._inputFormElement.selectionStart;
    }

    text = this._textMetrics.lines[lineIndex];
    const caretMetrics = PIXI.TextMetrics.measureText(text.substring(0, pos), this._textStyle);
    this._cursor.y = lineIndex > 0 ? this._textMetrics.lineHeight * lineIndex : -2;
    this._cursor.x = this._currentText.x + caretMetrics.width - 3;
  }

  updateCursorBlink () {
    if (this.options.selectable || this.options.fileInput) {
      return;
    }
    if (this._inputFormElement !== document.activeElement) {
      this._cursor.visible = false;
      return;
    }
    if (this._cursor.visible) {
      setTimeout(() => {
        if (this._inputFormElement === document.activeElement) {
          this._cursor.visible = false;
        }
      }, 500);
    } else {
      setTimeout(() => {
        if (this._inputFormElement === document.activeElement) {
          this._cursor.visible = true;
        }
      }, 500);
    }
  }

  updateForm () {
    if (this.options.expandable === false) {
      return;
    }
    if (this.isFormBackgroundTouched() || this.isActive()) {
      this._expandFormBackground();
      this._currentText.text = this.options.value;
    } else if (this.isActive() === false) {
      if (this._currentText.text.length > 12) {
        this._formBackground.texture = this._formTexture;
        this._currentText.text = this._currentText.text.substring(0, 9) + '...';
      }
    }
  }

  updateOutlineFilter () {
    if (this.isActive() && !this._isBackgroundFiltered) {
      this._applyOutlineFilter();
      this._expandFormBackground();
    } else if (!this.isActive() && this._isBackgroundFiltered) {
      this._clearOutlineFilter();
    }
  }

  update () {
    super.update();
    this.updateCursorBlink();
    this.updateForm();
    this.updateOutlineFilter();
  }
}

class FormGroup extends Control {
  constructor () {
    super();
    this._forms = [];
  }

  addForm (...form) {
    this._forms.push(...form);
    this.addChild(...form);
    this.alignForms();
  }

  getForms () {
    return this._forms;
  }

  getForm (index) {
    return this._forms[index];
  }

  getFormByName (name) {
    return this._forms.find((form) => form.name === name);
  }

  getWidestForm () {
    return this._forms.reduce((a, b) => {
      return a.labelWidth() > b.labelWidth() ? a : b;
    }, this._forms[0]);
  }

  alignForms () {
    for (const form of this._forms) {
      const widestForm = this.getWidestForm();
      form.formOffset = widestForm.formOffset;
      form.refresh();
    }
  }

  update () {
    this.children.forEach((child) => {
      if (child.update) {
        child.update();
      }
    });
  }

  terminate () {
    this._forms.forEach((form) => form.terminate());
  }
}

class Slider extends Control {
  constructor (x, y, width, min, max, label, callback) {
    super();
    this.x = x;
    this.y = y;
    this.min = min;
    this.max = max;
    this.barWidth = width;
    this._callback = callback || null;
    this.value = null;
    this._buttonDragging = false;
    this.enableTouch = true;
    this.on('click', () => this._setValueByClick.bind(this));
    this._createLabel(label);
    this._createValueText();
    this._createBar();
    this._createDragButton();
  }

  _createLabel (label) {
    this._label = new PIXI.Text(`${label}: `, {
      fontSize: state.getThemeData().fontSizes.formLabel,
      fill: state.getThemeHexColor('text'),
    });
    this._label.x = 0;
    this._label.y = 0;
    this.addChild(this._label);
  }

  _createValueText () {
    const text = this._value ? this._value : 0;
    this._valueText = new PIXI.Text(text, {
      fontSize: state.getThemeData().fontSizes.formLabel,
      fill: state.getThemeHexColor('text'),
    });
    this._valueText.x = this._label.width + 5;
    this._valueText.y = 0;
    this.addChild(this._valueText);
  }

  _createBar () {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, state.getThemeHexColor('border'));
    graphics.beginFill(state.getThemeHexColor('formBackground'));
    graphics.drawRect(0, 0, this.barWidth, 3);
    this._bar = new PIXI.Sprite(Graphics.generateTexture(graphics));
    this._bar.y = 25;
    this.addChild(this._bar);
  }

  _createDragButton () {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(state.getThemeHexColor('sliderButton'));
    graphics.drawCircle(0, 0, 7);

    this._anchorButton = new Button({
      y: this._bar.y + this._bar.height / 2,
      textures: { normal: Graphics.generateTexture(graphics) },
    });
    this._anchorButton.anchor.set(0.5);

    this._anchorButton.on('press', () => {
      this.enableTouch = false;
      this._buttonPressed = true;
      this._buttonDragging = true;
    });

    this._anchorButton.on('release', () => {
      this.enableTouch = true;
      this._buttonDragging = false;
      this._buttonPressed = false;
      this._anchorButton.tint = 0xffffff;
    });

    this._anchorButton.on('mouse-enter', () => {
      this._anchorButton.tint = 0x489eff;
    });

    this._anchorButton.on('mouse-exit', () => {
      if (this._buttonPressed) { return; }
      this._buttonDragging = false;
      this._anchorButton.tint = 0xffffff;
    });
    this.addChild(this._anchorButton);
  }

  update () {
    super.update();
    if (this._anchorButton.isTouched()) {
      this._anchorButton.tint = 0x489eff;
    }
    if (this._buttonDragging) {
      this.updateDrag();
    }
    this._updateValueText();
  }

  _updateValueText () {
    if (this._valueText.text !== this.value) {
      this._valueText.text = this.value;
    }
  }

  updateDrag () {
    const { x, y } = TouchInput;
    const local = this.toLocal({ x, y });

    let position = local.x;

    if (position < 0) {
      position = 0;
    }

    if (position > this.barWidth) {
      position = this.barWidth;
    }

    this._anchorButton.x = position;
    this._updateValue(this._anchorButton.x);
  }

  setValue (value) {
    this.value = value;
    this._anchorButton.x = Math.floor((this.barWidth / this.max) * value);
  }

  _setValueByClick () {
    const { x, y } = TouchInput;
    const local = this.toLocal({ x, y });
    this._updateValue(local.x);
  }

  _updateValue (x) {
    const lastValue = this.value;
    this.value = Math.floor((x / this.barWidth) * (this.max - this.min));

    if (this.value !== lastValue) {
      this.onChange(this.value);
    }
  }

  clear () {
    this._buttonDragging = false;
    this._buttonPressed = false;
    this._anchorButton.tint = 0xffffff;
  }

  onChange (value) {
    this._callback(value);
  }

  getLabel () {
    return this._label;
  }
}

var EnumTooltips = {
  options: {
    name: 'The name of the element',
    x: 'The Position of the element on the X axis',
    y: 'The Position of the element on the Y axis',
    width: 'The width of the element',
    height: 'The height of the element',
  },

  conditions: {
    event: 'Assign an event that needs to be clicked for the element to toggle visibility',
    switch: 'Assign a switch that needs to be true for the element to be visible',
    varId: 'The variable ID',
    varValue: 'The value the variable needs to be for the element to be visible',
    forceOpacity: 'Use the opacity of the element to toggle visibility. This is useful if you don\'t want a parent to hide it\'s children',
    global: 'Whether or not this element is global and will be used across all maps in the game',
  },

  font: {
    face: 'The font to be used for this text',
    size: 'The size of the font',
    textVariable: 'Set this to a game variable ID if you want to display the text stored in a variable',
    scriptEval: 'The script will be evaluated and the value will be used as the text',
    characterId: 'Enter the character ID of the current party to display their health as the text',
    evalRefresh: 'This will refresh the text after you set the evaluation script',
  },

  gauge: {
    value: 'The value the gauge will use to fill the bar. If var is enabled, this will be a variable ID',
    maxValue: 'The maximum value the gauge will use to fill the bar. If var is enabled, this will be a variable ID',
    isVar: 'If enabled, the gauge will use the value of a variable instead of a fixed value',
  },

  gaugeFrame: {
    enable: 'Enable if you want to use an image for your gauge.(Settings below will not work unless enabled)',
    image: 'The filepath of the image to be displayed for the gauge.',
    maxFrames: 'The maximum number of frames in the animation.',
    frameWidth: 'The width of each frame in the animation.',
    frameHeight: 'The height of each frame in the animation.',
    frameX: 'The x position of the frame in the animation.(Used only if you have multiple gauges in one image)',
    frameY: 'The y position of the frame in the animation.(Used only if you have multiple gauges in one image)',
  },

  button: {
    image: 'The image to be displayed when the button is not being pressed or touched.',
    hoverImage: 'The image to be displayed when the button is being touched.',
    clickedImage: 'The image to be displayed when the button is being pressed.',
    commonEvent: 'The common event to be run when the button is pressed.',
    scriptPreset: 'The script preset to be run when the button is pressed.',
    buttonData: 'The button data to be used when the button is pressed.',
    openElementName: 'The name of the element to be opened when the button is pressed.',
    keepOutline: 'If enabled, the outline of the button on hover will be kept when not in edit mode',
  },

  image: {
    filepath: 'The filepath of the image to be displayed.',
  },

  text: {
    text: 'The text to be displayed.',
  },
};

class ColorPicker extends Control {
  constructor () {
    super();
    this.selectedColor = 0xffffff;
    this.mostUsedColors = [];
    this._colorRampWidth = 250;
    this._colorRampHeight = 250;
    this._lastSelectedPosition = new PIXI.Point(0, 0);
    this._pixels = [];

    this._isMouseDown = false;
    this._nmouseDownListener = this._mouseDown.bind(this);
    this._nmouseUpListener = this._mouseUp.bind(this);
    this._mouseMoveListener = this._mouseMove.bind(this);
    this._mouseClickListener = this._mouseClick.bind(this);
    document.addEventListener('mousedown', this._nmouseDownListener);
    document.addEventListener('mouseup', this._nmouseUpListener);
    document.addEventListener('mousemove', this._mouseMoveListener);
    document.addEventListener('click', this._mouseClickListener);


    this.createSwatchButton();
    this.createColorRamp(this._colorRampWidth , this._colorRampHeight);
    this.createIndicator();
  }

  hidePicker () {
    this._colorRamp.visible = false;
  }

  showPicker () {
    this._colorRamp.visible = true;
  }

  destroy () {
    super.destroy();
    document.removeEventListener('mousedown', this._nmouseDownListener);
    document.removeEventListener('mouseup', this._nmouseUpListener);
    document.removeEventListener('mousemove', this._mouseMoveListener);
    document.removeEventListener('click', this._mouseClickListener);
  }

  /*
  * All color conversion functions adapted from https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
  */
  rgbToHsl (r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
      s = delta / (1 - Math.abs(2 * l - 1));

      switch (max) {
        case r: h = ((g - b) / delta + (g < b ? 6 : 0)); break;
        case g: h = ((b - r) / delta + 2); break;
        case b: h = ((r - g) / delta + 4); break;
      }

      h *= 60;
    }

    return { h, s, l };
  }

  hslToRgb (h, s, l) {
    h /= 360;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return (r * 255 << 16) + (g * 255 << 8) + (b * 255) | 0;
  }


  createSwatchButton () {
    const graphics = new PIXI.Graphics()
      .lineStyle(2, state.getThemeHexColor('border'), 1)
      .beginFill(0xffffff)
      .drawRect(0, 0, 32, 32)
      .endFill();

    const texture = Graphics.generateTexture(graphics);
    this._swatchButton = new Button({
      textures: { normal: texture },
    });
    this._swatchButton.onClick = () => {
      this._colorRamp.visible = !this._colorRamp.visible;
      this._indicator.visible = !this._indicator.visible;
      this.emit('color-picker-toggle', this._colorRamp);
    };
    this._swatchButton.width = 32;
    this._swatchButton.height = 32;
    this._swatchButton.x = 0;
    this._swatchButton.y = 0;
    this.addChild(this._swatchButton);
  }

  createColorRamp (width, height) {
    const segments = 360;
    const segmentWidth = width / segments;
    const renderTexture = PIXI.RenderTexture.create({ width, height });
    const graphics = new PIXI.Graphics();

    for (let y = 0; y < height; y++) {
      const lightness = 1 - y / (height - 1);
      for (let x = 0; x < segments; x++) {
        const hue = (x / segments) * 360;
        const rgbColor = this.hslToRgb(hue, 1, lightness);
        graphics.beginFill(rgbColor)
          .drawRect(x * segmentWidth, y, segmentWidth + 1, 1)
          .endFill();
      }
    }

    Graphics.renderTo(graphics, renderTexture);
    graphics.destroy();

    this._pixels = Graphics.extractPixels(renderTexture);

    this._colorRamp = new PIXI.Sprite(renderTexture);
    this._colorRamp.x = this._swatchButton.x + this._swatchButton.width + 10;
    this._colorRamp.y = this._swatchButton.y;
    this._colorRamp.excludeFromBounds = true;
    this._colorRamp.visible = false;
    this.addChild(this._colorRamp);
  }

  createIndicator () {
    this._indicator = new PIXI.Graphics();
    this._indicator.visible = false;
    this._colorRamp.addChild(this._indicator);
  }

  updateIndicator (x, y, colorHex) {
    this._indicator.clear();
    this._indicator.lineStyle(2, 0xffffff);
    this._indicator.beginFill(colorHex);
    this._indicator.drawCircle(0, 0, 8);
    this._indicator.endFill();
    this._indicator.x = x;
    this._indicator.y = y;
  }

  _mouseDown (event) {
    const point = new PIXI.Point(event.clientX, event.clientY);
    if ((!this._colorRamp.containsPoint(point) || !this._colorRamp.visible)) {
      if (this._isMouseDown || this._swatchButton.isTouched()) {
        return;
      }
      this.hidePicker();
      return;
    }
    this._isMouseDown = true;
  }

  _mouseUp (/* event */) {
    this._isMouseDown = false;
  }

  _mouseClick (event) {
    const point = new PIXI.Point(event.clientX, event.clientY);

    if ((!this._colorRamp.containsPoint(point) || !this._colorRamp.visible)) {
      return;
    }
    this.pickColor(event.clientX, event.clientY);
  }

  _mouseMove (event) {
    if (!this._isMouseDown) return;
    this.pickColor(event.clientX, event.clientY);
  }

  pickColor (x, y) {
    const point = new PIXI.Point(x, y);
    const local = this._colorRamp.toLocal(point);

    const clampedX = Math.max(0, Math.min(local.x, this._colorRamp.texture.width - 1));
    const clampedY = Math.max(0, Math.min(local.y, this._colorRamp.texture.height - 1));

    this._indicator.x = clampedX;
    this._indicator.y = clampedY;

    const pixelX = Math.floor(clampedX);
    const pixelY = Math.floor(clampedY);

    const index = (pixelY * this._colorRamp.texture.width + pixelX) * 4;
    const r = this._pixels[index];
    const g = this._pixels[index + 1];
    const b = this._pixels[index + 2];
    const a = this._pixels[index + 3];

    const hex = PIXI.utils.rgb2hex([r / 255, g / 255, b / 255]);
    this._swatchButton.tint = hex;
    this.updateIndicator(clampedX, clampedY, hex);

    this.selectedColor = hex;

    this.emit('color-picked', hex);

    return { r, g, b, a };
  }

  setColor (color = 0xffffff) {
    if (typeof color === 'string') {
      color = parseInt(color.replace('#', ''), 16);
    }

    this._swatchButton.tint = color;
    this.selectedColor = color;

    const rgb = PIXI.utils.hex2rgb(color);
    const { h, l } = this.rgbToHsl(rgb[0], rgb[1], rgb[2]);

    const x = (h / 360) * this._colorRampWidth;
    const y = (1 - l) * this._colorRampHeight;

    this.updateIndicator(x, y, color);
  }

}

class GaugePanel extends OptionsPanel {
  constructor (options) {
    super(options);
    this.setText('Gauge Options');
    this.addTooltips();
  }

  isTouched () {
    return super.isTouched() || this._colorPicker1.isTouched() ||
    this._colorPicker2.isTouched();
  }

  setValue (type, value) {
    switch (type) {
      case 'value': this._gaugeValue.setText(value);
        break;

      case 'maxValue': this._gaugeMaxValue.setText(value);
        break;

      case 'isVar': this._varToggle.setToggleState(value);
        break;

      case 'color1': this._colorPicker1.setColor(value);
        break;

      case 'color2': this._colorPicker2.setColor(value);
        break;

      default: throw new Error('You must select type "value"');
    }
  }

  create () {
    super.create();
    this._varToggle = new ToggleButton({
      label: 'Enable Var',
      x: 5,
      y: 10,
      toggleState: false,
    });

    this._formGroup = new FormGroup();

    this._gaugeValue = new InputForm('Value', 0, {
      onChange: (value) => {
        this.callHandler('value', Number(value.trim()));
      },
    });
    this._gaugeValue.x = 5;
    this._gaugeValue.y = this._varToggle.y + 25;
    this._gaugeValue.setText(50);

    this._varToggle.on('toggle', (state) => {
      this.callHandler('isVar', state);
    });

    this._gaugeMaxValue = new InputForm('Max', 0, {
      onChange: (value) => {
        this.callHandler('max', Number(value.trim()));
      },
    });

    this._colorPicker1 = new ColorPicker();
    this._colorPicker1.on('color-picked', (color) => {
      this.callHandler('color1', color);
    });
    this._colorPicker1.on('color-picker-toggle', (visible) => {
      if (visible) this._colorPicker2.hidePicker();
    });

    this._colorPicker2 = new ColorPicker();
    this._colorPicker2.on('color-picked', (color) => {
      this.callHandler('color2', color);
    });
    this._colorPicker2.on('color-picker-toggle', (visible) => {
      if (visible) this._colorPicker1.hidePicker();
    });

    this._gaugeMaxValue.x = 5;
    this._gaugeMaxValue.y = this._gaugeValue.y + 25;
    this._gaugeMaxValue.setText(100);

    this._colorPicker1.x = 5;
    this._colorPicker1.y = this._gaugeMaxValue.y + 25;

    this._colorPicker2.x = this._colorPicker1.x;
    this._colorPicker2.y = this._colorPicker1.y + 32;

    this._formGroup.addForm(this._gaugeValue, this._gaugeMaxValue, this._varToggle);
    this.addToContents(this._formGroup);
    this.addToContents(this._colorPicker1);
    this.addToContents(this._colorPicker2);
  }

  addTooltips () {
    this._gaugeValue.tooltip = EnumTooltips.gauge.value;
    this._gaugeMaxValue.tooltip = EnumTooltips.gauge.maxValue;
    this._varToggle.tooltip = EnumTooltips.gauge.isVar;
  }
}

class GaugeAnimationPanel extends OptionsPanel {
  constructor (options) {
    super(options);
    this.setText('Animation Options');
    this.addTooltips();
  }

  setValue (type, value) {
    switch (type) {
      case 'isAnimated': this.animationToggle.setToggleState(value);
        break;

      case 'frameWidth': this._formFrameWidth.setText(value);
        break;

      case 'frameHeight': this._formFrameHeight.setText(value);
        break;

      case 'frameX': this._formFrameX.setText(value);
        break;

      case 'frameY': this._formFrameY.setText(value);
        break;

      case 'maxFrames': this._formMaxFrames.setText(value);
        break;

      case 'imagePath': this._imageForm.setText(value.filename);
        break;

      default: throw new Error('You must select type "value"');
    }
  }

  create () {
    super.create();
    this.animationToggle = new ToggleButton({
      label: 'Enable',
      x: 5,
      y: 10,
      toggleState: false,
    });

    this._formGroup = new FormGroup();

    this._imageForm = new InputForm('Image', '', {
      onChange: (filepath) => {
        this.callHandler('imagePath', filepath);
      },
      fileInput: true,
    });

    this._imageForm.x = 5;
    this._imageForm.y = this.animationToggle.y + 25;

    this._formMaxFrames = new InputForm('Max Frames', 0, (value) => {
      this.callHandler('maxFrames', value);
    });
    this._formMaxFrames.x = 5;
    this._formMaxFrames.y = this._imageForm.y + 25;

    this._formFrameWidth = new InputForm('Frame Width', 0, (value) => {
      this.callHandler('frameWidth', value);
    });
    this._formFrameWidth.x = 5;
    this._formFrameWidth.y = this._formMaxFrames.y + 25;

    this._formFrameHeight = new InputForm('Frame Height', 0, (value) => {
      this.callHandler('frameHeight', value);
    });
    this._formFrameHeight.x = 5;
    this._formFrameHeight.y = this._formFrameWidth.y + 25;

    this._formFrameX = new InputForm('Frame X', 0, (value) => {
      this.callHandler('frameX', value);
    });
    this._formFrameX.x = 5;
    this._formFrameX.y = this._formFrameHeight.y + 25;

    this._formFrameY = new InputForm('Frame Y', 0, (value) => {
      this.callHandler('frameY', value);
    });
    this._formFrameY.x = 5;
    this._formFrameY.y = this._formFrameX.y + 25;

    this.animationToggle.on('toggle', (state) => {
      this.callHandler('isAnimated', state);
    });

    this._formGroup.addForm(
      this._imageForm,
      this._formMaxFrames,
      this._formFrameWidth,
      this._formFrameHeight,
      this._formFrameX,
      this._formFrameY,
      this.animationToggle,
    );
    this.addToContents(this._formGroup);
  }

  addTooltips () {
    this.animationToggle.tooltip = EnumTooltips.gaugeFrame.enable;
    this._imageForm.tooltip = EnumTooltips.gaugeFrame.image;
    this._formMaxFrames.tooltip = EnumTooltips.gaugeFrame.maxFrames;
    this._formFrameWidth.tooltip = EnumTooltips.gaugeFrame.frameWidth;
    this._formFrameHeight.tooltip = EnumTooltips.gaugeFrame.frameHeight;
    this._formFrameX.tooltip = EnumTooltips.gaugeFrame.frameX;
    this._formFrameY.tooltip = EnumTooltips.gaugeFrame.frameY;
  }
}

class FontPanel extends OptionsPanel {
  constructor (options) {
    super(options);
    this.setText('Font Options');
    this.addTooltips();
  }

  setValue (type, value) {
    switch (type) {
      case 'fontFace': this._fontFaceForm.setText(value);
        break;

      case 'fontSize': this._fontSizeForm.setText(value);
        break;

      case 'textVariable': this._textVariable.setText(value);
        break;

      case 'scriptEval': this._scriptEval.setText(value);
        break;

      case 'charHP': this._charHp.setText(value);
        break;

      default: throw new Error('You must select type "value"');
    }
  }

  create () {
    super.create();
    this._formGroup = new FormGroup();

    this._fontFaceForm = new InputForm('Font Face', 'None', {
      onChange: (value) => {
        this.callHandler('face', value);
      },
    });

    this._fontFaceForm.x = 5;
    this._fontFaceForm.y = 15;

    this._fontSizeForm = new InputForm('Font Size', 'None', {
      onChange: (value) => {
        this.callHandler('size', value);
      },
    });
    this._fontSizeForm.x = 5;
    this._fontSizeForm.y = this._fontFaceForm.y + 25;

    this._textVariable = new InputForm('Variable', 'None', {
      onChange: (value) => {
        this.callHandler('textVariable', value);
      },
    });

    this._textVariable.x = 5;
    this._textVariable.y = this._fontSizeForm.y + 25;

    this._scriptEval = new InputForm('Eval', 'None', {
      onChange: (value) => {
        this.callHandler('scriptEval', value);
      },
    });

    this._scriptEval.x = 5;
    this._scriptEval.y = this._textVariable.y + 25;

    this._characterId = new InputForm('Char Health', 'None', {
      onChange: (value) => {
        this.callHandler('charHP', value);
      },
    });

    this._characterId.x = 5;
    this._characterId.y = this._scriptEval.y + 25;

    this._evalRefreshButton = new Button({
      x: 5,
      y: this._characterId.y + 30,
      textures: {
        normal: ImageManager.elementsUiTexture('save-solid-(small)'),
      },
    });

    this._evalRefreshButton.on('click', () => {
      this.emit('eval-script');
    });

    this._formGroup.addForm(
      this._fontFaceForm,
      this._fontSizeForm,
      this._textVariable,
      this._scriptEval,
      this._characterId,
    );
    this.addToContents(this._formGroup);
    this.addToContents(this._evalRefreshButton);
  }

  addTooltips () {
    this._fontFaceForm.tooltip = EnumTooltips.font.face;
    this._fontSizeForm.tooltip = EnumTooltips.font.size;
    this._textVariable.tooltip = EnumTooltips.font.textVariable;
    this._scriptEval.tooltip = EnumTooltips.font.scriptEval;
    this._characterId.tooltip = EnumTooltips.font.characterId;
    this._evalRefreshButton.tooltip = EnumTooltips.font.evalRefresh;
  }
}

class ImagePanel extends OptionsPanel {
  constructor (options) {
    super(options);
    this.setText('Image Options');
    this.addTooltips();
  }

  setValue (type, value) {
    switch (type) {
      case 'path': this.imageFilepathForm.setText(value);
        break;

      default: throw new Error('You must select type "value"');
    }
  }

  create () {
    super.create();
    this.imageFilepathForm = new InputForm('Filepath', '', {
      onChange: (value) => { this.callHandler('path', value); },
      fileInput: true,
    });
    this.imageFilepathForm.x = 5;
    this.imageFilepathForm.y = 15;
    this.imageFilepathForm.on('dialog-open', () => this.emit('dialog-open'));
    this.imageFilepathForm.on('dialog-close', () => this.emit('dialog-close'));

    this.addToContents(this.imageFilepathForm);
  }

  addTooltips () {
    this.imageFilepathForm.tooltip = EnumTooltips.image.filepath;
  }
}

class ButtonPanel extends OptionsPanel {
  constructor (options) {
    super(options);
    this.setText('Button Options');
    this.addTooltips();
  }

  setValue (type, value) {
    switch (type) {
      case 'normalImage': this._normalImageForm.setText(value);
        break;

      case 'hoverImage': this._hoverImageForm.setText(value);
        break;

      case 'clickedImage': this._clickedImageForm.setText(value);
        break;

      case 'commonEvent': this._commonEventIdForm.setText(value);
        break;

      case 'scriptPreset': this._scriptPresetForm.setText(value);
        break;

      case 'openElementName': this._openElementNameForm.setText(value);
        break;

      case 'buttonData': this._buttonDataForm.setText(value);
        break;

      case 'keepOutline': this._buttonDataForm.setText(value);
        break;

      default: throw new Error('You must select type "value"');
    }
  }

  create () {
    super.create();

    this._formGroup = new FormGroup();

    this._normalImageForm = new InputForm('Normal Image', '', {
      onChange: (value) => {
        this.callHandler('normalImage', value);
      },
      fileInput: true,
    });
    this._normalImageForm.x = 5;
    this._normalImageForm.y = 10;

    this._hoverImageForm = new InputForm('Hover Image', '', {
      onChange: (value) => {
        this.callHandler('hoverImage', value);
      },
      fileInput: true,
    });

    this._hoverImageForm.x = 5;
    this._hoverImageForm.y = this._normalImageForm.y + 25;

    this._clickedImageForm = new InputForm('Clicked Path', '', {
      onChange: (value) => {
        this.callHandler('clickedImage', value);
      },
      fileInput: true,
    });

    this._clickedImageForm.x = 5;
    this._clickedImageForm.y = this._hoverImageForm.y + 25;

    this._normalImageForm.on('dialog-open', () => this.emit('dialog-open'));
    this._normalImageForm.on('dialog-close', () => this.emit('dialog-close'));
    this._clickedImageForm.on('dialog-open', () => this.emit('dialog-open'));
    this._clickedImageForm.on('dialog-close', () => this.emit('dialog-close'));
    this._hoverImageForm.on('dialog-open', () => this.emit('dialog-open'));
    this._hoverImageForm.on('dialog-close', () => this.emit('dialog-close'));

    this._commonEventIdForm = new InputForm('Common Event', 0, {
      onChange: (value) => {
        this.callHandler('commonEvent', value);
      },
    });

    this._commonEventIdForm.x = 5;
    this._commonEventIdForm.y = this._clickedImageForm.y + 25;

    this._scriptPresetForm = new InputForm('Script Preset', 0, {
      onChange: (value) => {
        this.callHandler('scriptPreset', value);
      },
    });

    this._scriptPresetForm.x = 5;
    this._scriptPresetForm.y = this._commonEventIdForm.y + 25;

    this._buttonDataForm = new InputForm('Button Data', 0, {
      onChange: (value) => {
        this.callHandler('buttonData', value);
      },
    });

    this._buttonDataForm.x = 5;
    this._buttonDataForm.y = this._scriptPresetForm.y + 25;

    this._openElementNameForm = new InputForm('Open Element', 0, {
      onChange: (value) => {
        this.callHandler('openElementName', value);
      },
      selectable: true,
    });
    this._openElementNameForm.on('clicked', () => {
      this.emit('assign-element');
    });

    this._openElementNameForm.x = 5;
    this._openElementNameForm.y = this._buttonDataForm.y + 25;

    this._keepOutlineToggle = new ToggleButton({
      x: this._openElementNameForm.x,
      y: this._openElementNameForm.y + 30,
      toggleState: false,
      label: 'Keep Outline',
    });
    this._keepOutlineToggle.on('toggle', (state) => {
      this.callHandler.bind(this, 'keepOutline', state);
    });

    this._formGroup.addForm(
      this._normalImageForm,
      this._hoverImageForm,
      this._clickedImageForm,
      this._commonEventIdForm,
      this._scriptPresetForm,
      this._buttonDataForm,
      this._openElementNameForm,
      this._keepOutlineToggle,
    );
    this.addToContents(this._formGroup);
  }

  addTooltips () {
    this._normalImageForm.tooltip = EnumTooltips.button.image;
    this._hoverImageForm.tooltip = EnumTooltips.button.hoverImage;
    this._clickedImageForm.tooltip = EnumTooltips.button.clickedImage;
    this._commonEventIdForm.tooltip = EnumTooltips.button.commonEvent;
    this._scriptPresetForm.tooltip = EnumTooltips.button.scriptPreset;
    this._buttonDataForm.tooltip = EnumTooltips.button.buttonData;
    this._openElementNameForm.tooltip = EnumTooltips.button.openElementName;
    this._keepOutlineToggle.tooltip = EnumTooltips.button.keepOutline;
  }
}

class TextPanel extends OptionsPanel {
  constructor (options) {
    super(options);
    this.setText('Text');
    this.addTooltips();
  }

  setValue (type, value) {
    switch (type) {
      case 'text': this._textForm.setText(value);
        break;

      default: throw new Error('You must select type "value"');
    }
  }

  create () {
    super.create();
    this._textForm = new InputForm('', 'None', {
      onChange: (value) => { this.callHandler('text', value); },
      width: 180,
      height: 150,
      wordWrap: true,
      expandable: false,
    });
    this._textForm.x = 5;
    this._textForm.y = 5;

    this.addToContents(this._textForm);
  }

  addTooltips () {
    this._textForm.tooltip = EnumTooltips.text.text;
  }
}

class ConditionsPanel extends OptionsPanel {
  constructor (options) {
    super(options);
    this.setText('Conditions');
    this.addTooltips();
  }

  isGlobalToggleVisible () {
    return this._isGlobalToggle.visible;
  }

  setGlobalToggleVisibility (value) {
    this._isGlobalToggle.visible = value;
  }

  setValue (type, value) {
    switch (type) {
      case 'event': this._eventForm.setText(value);
        break;

      case 'switch': this._switchConditionForm.setText(value);
        break;

      case 'var': this._varConditionForm.setText(value);
        break;

      case 'varValue': this._varConditionValueForm.setText(value);
        break;

      case 'isGlobal': this._isGlobalToggle.setToggleState(value);
        break;

      case 'forceOpacity': this._forceOpacityToggle.setToggleState(value);
        break;

      default: throw new Error('You must select type "value"');
    }
  }

  create () {
    super.create();
    this._formGroup = new FormGroup();

    this._eventForm = new InputForm('Event', 0, {
      selectable: true,
    });

    this._eventForm.x = 5;
    this._eventForm.y = 5;
    this._eventForm.on('clicked', () => {
      this.emit('assign-event', this._element);
    });

    this._switchConditionForm = new InputForm('Switch', 0, {
      onChange: (value) => {
        this.callHandler('switch', Number(value));
      },
    });

    this._switchConditionForm.x = 5;
    this._switchConditionForm.y = this._eventForm.y + 25;

    this._varConditionForm = new InputForm('Var ID', 0, {
      onChange: (value) => {
        this.callHandler('var', Number(value.trim()));
      },
    });

    this._varConditionForm.x = 5;
    this._varConditionForm.y = this._switchConditionForm.y + 25;

    this._varConditionValueForm = new InputForm('Var Value', 0, {
      onChange: (value) => {
        this.callHandler('varValue', value);
      },
    });

    this._varConditionValueForm.x = 5;
    this._varConditionValueForm.y = this._varConditionForm.y + 25;

    this._forceOpacityToggle = new ToggleButton({
      x: 5,
      y: this._varConditionValueForm.y + 30,
      label: 'Use Opacity',
    });

    this._forceOpacityToggle.on('toggle', (state) => {
      this.callHandler('forceOpacity', state);
    });

    this._isGlobalToggle = new ToggleButton({
      x: 5,
      y: this._forceOpacityToggle.y + 30,
      label: 'Is global',
    });

    this._isGlobalToggle.on('toggle', (state) => {
      this.callHandler('isGlobal', state);
    });

    this._formGroup.addForm(
      this._eventForm,
      this._switchConditionForm,
      this._varConditionForm,
      this._varConditionValueForm,
      this._forceOpacityToggle,
      this._isGlobalToggle,
    );
    this.addToContents(this._formGroup);
  }

  addTooltips () {
    this._eventForm.tooltip = EnumTooltips.conditions.event;
    this._switchConditionForm.tooltip = EnumTooltips.conditions.switch;
    this._varConditionForm.tooltip = EnumTooltips.conditions.varId;
    this._varConditionValueForm.tooltip = EnumTooltips.conditions.varValue;
    this._isGlobalToggle.tooltip = EnumTooltips.conditions.global;
    this._forceOpacityToggle.tooltip = EnumTooltips.conditions.forceOpacity;
  }
}

class ElementOptionsPanel extends PanelBase {
  constructor () {
    super({
      width: 175,
      height: Graphics.height - 52,
    });
    /**
     * Emitted events
     *
     * element-changed
     * element-deleted
     * assign-event
     *
    */
    this._buttons = [];
    this._element = null;
    this._childButtons = [];
    this._globalElements = [];
    this._contents.padding = 5;
    this._contents.updateBounds();
  }

  isTouched () {
    if (this._buttonPanel.isTouched() || this._imagePanel.isTouched() ||
      this._fontPanel.isTouched() || this._gaugePanel.isTouched() ||
      this._gaugeAnimationPanel.isTouched() || this._conditionPanel.isTouched() ||
      this._textPanel.isTouched()) {
      return true;
    }

    return super.isTouched();
  }

  hide () {
    super.hide();
    this._opacitySlider.clear();
    this.children.forEach((child) => {
      if (child instanceof OptionsPanel) {
        child.close();
      }
    });
  }

  setElement (element) {
    if (this._element) {
      this._element.forceSelection(false);
    }
    this._element = element;
    if (element) {
      element.forceSelection(true);
      this._updateInputForms();
      this._updatePanels();
      this.refresh();
    }
  }

  setGlobalElements (elements) {
    this._globalElements = elements || this._globalElements;
  }

  create () {
    super.create();
    this.createInputForms();
    this.createPanels();
    // this.createChildrenListBackground()
    // this.createChildrenList()
    this.createSliders();
    this.createElementButtons();
    this.addTooltips();
  }

  createElementButtons () {
    this._deleteButton = new Button({
      x: 15,
      y: this.height - 35,
      textures: { normal: ImageManager.elementsUiTexture('trash-alt-solid-(small)') },
    });
    this._deleteButton.tint = 0xf92665;
    this._deleteButton.on('click', () => this.emit('element-deleted'));

    this._visibleButton = new ToggleButton({
      x: this.width - 45,
      y: this.height - 35,
      toggleState: true,
    });
    this._visibleButton.on('toggle', (state) => {
      if (state) {
        this._element.show();
        return;
      }
      this._element.hide();
    });

    this._buttons.push(this._deleteButton, this._visibleButton);
    this.addContent(this._deleteButton, this._visibleButton);
  }

  createInputForms () {
    this._generalInfoFormGroup = new FormGroup();

    this._nameInputForm = new InputForm('Name', 'None', {
      onChange: this.updateName.bind(this),
    });
    this._nameInputForm.y = 10;

    this._xPositionForm = new InputForm('X Pos', 0, {
      onChange: this.updateX.bind(this),
    });

    this._xPositionForm.y = 40;

    this._yPositionForm = new InputForm('Y Pos', 0, {
      onChange: this.updateY.bind(this),
    });

    this._yPositionForm.y = 70;

    this._widthForm = new InputForm('Width', 0, {
      onChange: this.updateWidth.bind(this),
    });

    this._widthForm.y = 100;

    this._heightForm = new InputForm('Height', 0, {
      onChange: this.updateHeight.bind(this),
    });

    this._heightForm.y = 130;

    this._generalInfoFormGroup.addForm(
      this._nameInputForm,
      this._xPositionForm,
      this._yPositionForm,
      this._widthForm,
      this._heightForm,
    );
    this.addContent(this._generalInfoFormGroup);
  }

  createSliders () {
    this._opacitySlider = new Slider(
      10,
      this.height - 100,
      this.width - 30,
      0,
      255,
      'Opacity',
      (value) => {
        this.updateOpacity(value);
      });

    this._opacitySlider.tooltip = 'Set the opacity of the selected element';
    this._opacitySlider.setValue(255);
    this.addContent(this._opacitySlider);
  }

  createPanels () {
    this._conditionPanel = new ConditionsPanel({ width: this._contents.width, height: 175 });
    this._conditionPanel.x = 2;
    this._conditionPanel.y = this._heightForm.y + 35;
    this._conditionPanel.setHandler(this.updateConditions.bind(this));
    this._conditionPanel.on('assign-event', () => this.emit('assign-event', this._element));

    this._gaugePanel = new GaugePanel({ width: 200, height: 160 });
    this._gaugePanel.x = 2;
    this._gaugePanel.y = this._conditionPanel.y + 50;
    this._gaugePanel.setHandler(this.updateGauge.bind(this));
    this._gaugePanel.on('opened', () => {
      this._gaugeAnimationPanel.close();
    });

    this._gaugeAnimationPanel = new GaugeAnimationPanel({ width: 220, height: 200 });
    this._gaugeAnimationPanel.x = 2;
    this._gaugeAnimationPanel.y = this._gaugePanel.y + 50;
    this._gaugeAnimationPanel.setHandler(this.updateGauge.bind(this));
    this._gaugeAnimationPanel.on('opened', () => {
      this._gaugePanel.close();
    });

    this._fontPanel = new FontPanel({ width: 210, height: 180 });
    this._fontPanel.x = 2;
    this._fontPanel.y = this._conditionPanel.y + 50;
    this._fontPanel.on('eval-script', this.evalTextScript.bind(this));
    this._fontPanel.setHandler(this.updateFont.bind(this));

    this._textPanel = new TextPanel({ width: 190, height: 160 });
    this._textPanel.x = 2;
    this._textPanel.y = this._fontPanel.y + 50;
    this._textPanel.setHandler(this.updateText.bind(this));

    this._imagePanel = new ImagePanel({ width: 200, height: 160 });
    this._imagePanel.x = 2;
    this._imagePanel.y = this._conditionPanel.y + 50;
    this._imagePanel.setHandler(this.updateImage.bind(this));

    this._buttonPanel = new ButtonPanel({ width: 240, height: 250 });
    this._buttonPanel.x = 2;
    this._buttonPanel.y = this._conditionPanel.y + 50;
    this._buttonPanel.setHandler(this.updateButton.bind(this));

    this._buttonPanel.on('assign-element', () => {
      this.emit('assign-element', this._selectedElement);
    });

    this._buttonPanel.on('dialog-open', () => this.emit('dialog-open'));
    this._buttonPanel.on('dialog-close', () => this.emit('dialog-close'));

    this._imagePanel.on('dialog-open', () => this.emit('dialog-open'));
    this._imagePanel.on('dialog-close', () => this.emit('dialog-close'));

    this.addContent(
      this._conditionPanel,
      this._gaugePanel,
      this._fontPanel,
      this._textPanel,
      this._imagePanel,
      this._buttonPanel,
      this._gaugeAnimationPanel,
    );
  }

  createChildrenListBackground () {
    const element = this._element;
    const height = element ? (this._element.children.length * 25) + 15 : 200;
    const background = new PIXI.Graphics();
    background.lineStyle(1, 0xfcfcfc, 1);
    background.beginFill(0x191919);
    background.drawRect(0, 0, this.width - 20, height);
    background.endFill();

    const texture = Graphics.generateTexture(background);
    this._childrenListBackground = new PIXI.Sprite(texture);
    this._childrenListBackground.x = 8;
    this._childrenListBackground.y = this.height - (height + 55);
    this._childrenListBackground.opacity = 150;
    this.addContent(this._childrenListBackground);
  }

  createChildrenList () {
    let y = this._childrenListBackground.y + 10;
    this._element.childElements.forEach((child, index) => {
      const childButton = new TextButton({
        x: 20,
        y: y,
        text: child.type() ? `${child.type()} ${index}` : `Child ${index}`,
        clickAction: () => {
          this.emit('child-selected', child);
        },
      });

      this._childButtons.push(childButton);
      this.addContent(childButton);

      y += 25;
    });
  }

  addTooltips () {
    this._nameInputForm.tooltip = EnumTooltips.options.name;
    this._xPositionForm.tooltip = EnumTooltips.options.x;
    this._yPositionForm.tooltip = EnumTooltips.options.y;
    this._widthForm.tooltip = EnumTooltips.options.width;
    this._heightForm.tooltip = EnumTooltips.options.height;
  }

  refresh () {
    super.refresh();
    if (!this._element) {
      return;
    }
    this._updateVisibleElements();
    this._updateInputForms();
    this._updatePanels();
    // this._updateChildList()
    this._updateVisibleButton();
  }

  _updateVisibleElements () {
    if (this._element.isChild()) {
      this._conditionPanel.setGlobalToggleVisibility(false);
    } else if (this._element.isChild() === false) {
      this._conditionPanel.setGlobalToggleVisibility(true);
    }

    switch (this._element.getType()) {
      case 'gauge':
        this._gaugePanel.visible = true;
        this._gaugeAnimationPanel.visible = true;
        this._fontPanel.visible = false;
        this._imagePanel.visible = false;
        this._buttonPanel.visible = false;
        this._textPanel.visible = false;
        break;

      case 'text':
        this._fontPanel.visible = true;
        this._textPanel.visible = true;
        this._gaugePanel.visible = false;
        this._gaugeAnimationPanel.visible = false;
        this._imagePanel.visible = false;
        this._buttonPanel.visible = false;
        break;

      case 'image':
        this._imagePanel.visible = true;
        this._fontPanel.visible = false;
        this._gaugePanel.visible = false;
        this._gaugeAnimationPanel.visible = false;
        this._buttonPanel.visible = false;
        this._textPanel.visible = false;
        break;

      case 'button':
        this._buttonPanel.visible = true;
        this._imagePanel.visible = false;
        this._fontPanel.visible = false;
        this._gaugePanel.visible = false;
        this._gaugeAnimationPanel.visible = false;
        this._textPanel.visible = false;
        break;

      default:
        this._gaugePanel.visible = false;
        this._gaugeAnimationPanel.visible = false;
        this._fontPanel.visible = false;
        this._imagePanel.visible = false;
        this._buttonPanel.visible = false;
        this._textPanel.visible = false;
        break;
    }
  }

  _updateInputForms () {
    this._nameInputForm.setText(this._element.getName());
    this._xPositionForm.setText(Math.round(this._element.x));
    this._yPositionForm.setText(Math.round(this._element.y));
    this._widthForm.setText(Math.round(this._element.width));
    this._heightForm.setText(Math.round(this._element.height));
    // Set width and height text
    this.emit('element-changed', this._element);
  }

  _updatePanels () {
    const settings = this._element.getElementState();
    this._conditionPanel.setValue('event', settings.eventId);
    this._conditionPanel.setValue('switch', settings.gameSwitch);
    this._conditionPanel.setValue('var', settings.gameVar.id);
    this._conditionPanel.setValue('varValue', settings.gameVar.value);
    this._conditionPanel.setValue('forceOpacity', settings.forceOpacity);
    this._conditionPanel.setValue('isGlobal', settings.isGlobal);
    this._opacitySlider.setValue(settings.opacity);

    switch (this._element.getType()) {
      case 'gauge':
        this._gaugePanel.setValue('value', settings.gaugeData.value);
        this._gaugePanel.setValue('maxValue', settings.gaugeData.maxValue);
        this._gaugePanel.setValue('isVar', settings.gaugeData.isVar);
        this._gaugePanel.setValue('color1', settings.color1);
        this._gaugePanel.setValue('color2', settings.color2);
        this._gaugeAnimationPanel.setValue('isAnimated', settings.isAnimated);
        this._gaugeAnimationPanel.setValue('imagePath', settings.frameData.imagePath);
        this._gaugeAnimationPanel.setValue('frameX', settings.frameData.x);
        this._gaugeAnimationPanel.setValue('frameY', settings.frameData.y);
        this._gaugeAnimationPanel.setValue('frameWidth', settings.frameData.width);
        this._gaugeAnimationPanel.setValue('frameHeight', settings.frameData.height);
        this._gaugeAnimationPanel.setValue('maxFrames', settings.frameData.maxFrames);
        break;

      case 'text':
        this._fontPanel.setValue('fontFace', settings.fontFace);
        this._fontPanel.setValue('fontSize', settings.fontSize);
        this._fontPanel.setValue('textVariable', settings.textVariable);
        this._fontPanel.setValue('scriptEval', settings.scriptEval);
        this._textPanel.setValue('text', settings.text);
        break;

      case 'image':
        this._imagePanel.setValue('path', settings.imagePath.filename);
        break;

      case 'button':
        this._buttonPanel.setValue('normalImage', settings.normalImagePath.filename);
        this._buttonPanel.setValue('hoverImage', settings.hoverImagePath.filename);
        this._buttonPanel.setValue('clickedImage', settings.clickedImagePath.filename);
        this._buttonPanel.setValue('commonEvent', settings.commonEventId);
        this._buttonPanel.setValue('scriptPreset', settings.evalScript);
        this._buttonPanel.setValue('buttonData', settings.buttonData);
        this._buttonPanel.setValue('openElementName', settings.openElementName);
        break;

      case 'window':
        this._opacitySlider.setValue(settings.opacity);
        break;

      default:
        console.log('Dont know how you got here');
        break;
    }
  }

  _updateChildList () {
    this.removeChild(...this._childButtons);
    this.createChildrenList();
  }

  _updateVisibleButton () {
    this._visibleButton.setToggleState(this._element.isVisible());
    this._conditionPanel.setValue('isGlobal', this._element.isGlobal());
  }

  updateName (name) {
    this._element.setName(name);
    this._updateInputForms();
  }

  updateX (x) {
    const y = Number(this._yPositionForm.text());
    const point = new PIXI.Point(Number(x), y);
    this._element.setPosition(point.x, point.y);
    this._updateInputForms();
  }

  updateY (y) {
    const x = Number(this._xPositionForm.text());
    const point = new PIXI.Point(x, Number(y));
    this._element.setPosition(point.x, point.y);
    this._updateInputForms();
  }

  updateWidth (width) {
    this._element.setDimensions(Number(width));
    this._updateInputForms();
  }

  updateHeight (height) {
    this._element.setDimensions(undefined, Number(height));
    this._updateInputForms();
  }

  updateOpacity (value) {
    this._element.opacity = value;
  }

  updateFont (type, value) {
    switch (type) {
      case 'face':
        this._element.setFontFace(value);
        break;

      case 'size':
        this._element.setFontSize(value);
        break;

      case 'textVariable':
        this._element.setTextVariable(value);
        break;

      case 'scriptEval':
        this._element.setScriptEval(value);
        break;

      case 'charHP':
        this._element.setCharacter(value);
        break;
    }
  }

  evalTextScript () {
    this._element.evaluateScript();
  }

  updateText (type, value) {
    if (type === 'text') {
      this._element.setText(value);
    }
  }

  updateImage (type, value) {
    switch (type) {
      case 'path':
        this._element.setImage(value);
        break;
    }
  }

  updateButton (type, value) {
    if (this._element.type() !== 'button') {
      return;
    }
    if (type === 'scriptPreset') {
      this._element.setEvalScript(value);
    } else if (type === 'commonEvent') {
      this._element.setCommonEvent(value);
    } else if (type === 'openElementName') {
      this._element.setOpenElementName(value);
    } else if (type === 'clickedImage' || type === 'hoverImage' || type === 'normalImage') {
      this._element.setBitmap(type, value);
    } else if (type === 'buttonData') {
      this._element.buttonData = value;
    } else if (type === 'keepOutline') {
      this._element.keepOutline = value;
    }
    this.refresh();
  }

  updateGauge (type, value) {
    switch (type) {
      case 'value':
        this._element.setGaugeValue(value);
        break;

      case 'max':
        this._element.setGaugeValue(undefined, value);
        break;

      case 'isVar':
        this._element.setGaugeValue(undefined, undefined, value);
        break;

      case 'isAnimated':
        this._element.isAnimated = value;
        break;

      case 'imagePath':
        this._element.loadGaugeBitmap(value);
        break;

      case 'frameX':
        this._element.frameData.x = Number(value);
        break;

      case 'frameY':
        this._element.frameData.y = Number(value);
        break;

      case 'frameWidth':
        this._element.frameData.width = Number(value);
        break;

      case 'frameHeight':
        this._element.frameData.height = Number(value);
        break;

      case 'maxFrames':
        this._element.frameData.maxFrames = Number(value);
        break;

      case 'color1':
        this._element.color1 = '#' + value.toString(16).padStart(6, '0').toUpperCase();
        break;

      case 'color2':
        this._element.color2 = '#' + value.toString(16).padStart(6, '0').toUpperCase();
        break;
    }
    this._element.refresh();
  }

  updateConditions (type, value) {
    switch (type) {
      case 'event':
        this._element.setEventId(value);
        break;
      case 'switch':
        this._element.setGameSwitch(value);
        break;
      case 'var':
        this._element.gameVar = {
          id: value,
        };
        break;
      case 'varValue':
        this._element.gameVar = {
          value: value.trim(),
        };
        break;
      case 'forceOpacity':
        this._element.forceOpacity = value;
        break;
      case 'isGlobal':
        this.updateGlobalFlag(value);
        break;
    }
  }

  updateGlobalFlag (isGlobal) {
    this._element.setIsGlobal(isGlobal);
    if (isGlobal) {
      const exists = this._globalElements.find((el) => this._element.getGlobalId() === el.getGlobalId());

      if (!exists) {
        this._element.setGlobalId(this._globalElements.length);
        this.emit('global-element-change', this._element.globalId, false);
      }
    } else {
      this.emit('global-element-change', this._element.globalId, true);
      this._element.setGlobalId('');
    }
  }

  terminate () {
    this.children.forEach((child) => {
      if (child.terminate) {
        child.terminate();
      }
    });
  }
}

class ElementListPanel extends PanelBase {
  constructor (elements) {
    super({
      width: 175,
      height: Graphics.boxHeight - 52,
    });
    /**
     * Emitted events
     *
     * element-changed
     * element-deleted
     *
    */
    this._elements = elements;
    this._buttons = [];
    this._selectedElement = 'world';
    this._elementListButtons = [];
  }

  setElements (elements) {
    this._elements = elements;
    this.refresh();
  }

  setSelectedElement (element) {
    this._selectedElement = element;
  }

  getSelectedElement () {
    return this._selectedElement;
  }

  create () {
    super.create();
    this.createElementListButtons();
  }

  createElementListButtons () {
    if (!this._elements) {
      return;
    }

    const x = 5;
    const y = 5;

    if (this._selectedElement === 'world' || this._selectedElement.type() === 'world') {
      const worldElements = this._elements.filter((el) => !el.isChild());
      this.createElementButtons(x, y, worldElements);
      return;
    }

    if (this._selectedElement.childElements) {
      this.createElementButton(x, y, {
        name: 'Back',
        childElements: this._elements,
        type: () => 'world',
      });
      this.createElementButton(x, y + 20, this._selectedElement);
      this.createElementButtons(x + 10, y + 40, this._selectedElement.childElements);
    } else {
      this._selectedElement = 'world';
      this.refresh();
    }
  }

  createElementButton (x, y, element) {
    const textButton = new TextButton({
      x,
      y,
      text: element.getName() || `${element.getType()}`,
    });
    textButton.on('click', () => {
      this.emit('element-selected', element);
      this._selectedElement = element;
      this.refresh();
    });

    this._elementListButtons.push({
      button: textButton,
      element: element,
    });

    this.addChild(textButton);
  }

  createElementButtons (x, y, elements) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const childElements = element.getChildElements();
      this.createElementButton(x, y, element);
      y += 20;

      if (childElements.length > 0) {
        for (let j = 0; j < childElements.length; j++) {
          const childElement = childElements[j];
          this.createElementButton(x + 10, y, childElement);
          y += 20;
        }
      }
    }
  }

  refresh () {
    super.refresh();
    if (this._elementListButtons) {
      this._elementListButtons.forEach((elb) => this.removeChild(elb.button));
      this._elementListButtons = [];
      this.createElementListButtons();
    }
  }

  refreshNames () {
    this._elementListButtons.forEach((textButton) => {
      textButton.button.setText(textButton.element.getName() || textButton.element.getType());
    });
  }
}

class ContextMenu extends PanelBase {
  constructor (entries) {
    super();
    this._entries = entries || [];
    this._entryButtons = [];
    this._entryButtonHeight = 0;
    this._mouseExitDelay = 15;
    this.createTextButtons();
    this.createSelectRectangle();
  }

  show () {
    this._mouseExitDelay = 15;
    super.show();
  }

  maxWidth () {
    const defaultwidth = 100;
    const numbers = this._entryButtons.map((e) => e.width).filter((n) => n);
    return Math.max(...numbers, defaultwidth) + 5;
  }

  maxHeight () {
    return (this._entries.length * 25) + 15;
  }

  createTextButtons () {
    let y = 10;
    this._entries.forEach((entry) => {
      const entryButton = new TextButton({
        x: 15,
        y: y,
        text: entry.name,
      });
      this._entryButtonHeight = entryButton.height;

      entryButton.on('click', () => {
        this.onEntryClicked(entry);
        this.emit('clicked', entry);
        this.hide();
      });

      entryButton.on('mouse-enter', this.onEntryButtonMouseEnter.bind(this));
      entryButton.on('mouse-exit', this.onEntryButtonMouseExit.bind(this));

      this._entryButtons.push(entryButton);
      this.addChild(entryButton);

      y += 25;
    });
    this._entryButtons.forEach((b) => { b.width = this.maxWidth(); });
    this.width = this.maxWidth();
    this.height = this.maxHeight();
    this.refresh();
  }

  createSelectRectangle () {
    const background = new PIXI.Graphics()
      .beginFill(0x505050)
      .drawRect(0, 0, this.maxWidth() - 2, this._entryButtonHeight)
      .endFill();
    this._selectRect = new PIXI.Sprite(Graphics.generateTexture(background));
    this._selectRect.x = 2;
    this._selectRect.visible = false;
    this.addChildAt(this._selectRect, 1);
  }

  update () {
    super.update();
    if (!this.isTouched() && this._mouseExitDelay > 0) {
      this._mouseExitDelay -= 1;
      if (this._mouseExitDelay <= 1) {
        this.onMouseExit();
      }
    }
  }

  onEntryButtonMouseEnter (entryButton) {
    this._selectRect.visible = true;
    this._selectRect.y = entryButton.y - 1;
  }

  onEntryButtonMouseExit () {
    this._selectRect.visible = false;
  }

  onEntryClicked (/* entry */) {}

  onMouseExit () {
    if (this._mouseExitDelay <= 0) {
      this.hide();
    }
  }
}

class Tooltip extends PanelBase {
  constructor () {
    super({
      height: 40,
      width: 250,
    });
    this.lock = false;
    this._text = '';
    this.createTextSprite();
  }

  _backgroundGraphics (width, height) {
    const background = new PIXI.Graphics();
    background.lineStyle(1, state.getThemeHexColor('border'));
    background.beginFill(state.getThemeHexColor('tooltipBackground'));
    background.drawRect(0, 0, width, height);
    background.endFill();

    return background;
  }

  createTextSprite () {
    this._textSprite = new PIXI.Text(this._text, {
      fontSize: state.getThemeData().fontSizes.tooltip,
      fill: state.getThemeHexColor('text'),
      wordWrap: true,
      wordWrapWidth: this.width - 5,
    });
    this._textSprite.x = 7;
    this._textSprite.y = 7;
    this.addChild(this._textSprite);
  }

  set text (text) {
    this._text = text;
    this.refresh();
  }

  get text () {
    return this._text;
  }

  refresh () {
    if (this._textSprite) {
      if (this._textSprite.text !== this._text && this.lock) {
        return;
      }
      this._textSprite.text = this._text;
      this.width = this._textSprite.width + 14;
      this.height = this._textSprite.height + 14;
    }
    super.refresh();
  }
}

class ResizeBox extends PIXI.Container {
  constructor () {
    super();

    this.target = null;
    this.isResizing = false;
    this.resizeHandle = null;
    this.grid = null;
    this.snapToGrid = false;

    this.createResizeHandles();
    this.visible = false;
    this._mouseX = 0;
    this._mouseY = 0;
    this.touchedHandle = null;
    this._onMouseMoveListener = this.onMouseMove.bind(this);
    this._onMouseDownListener = this.onMouseDown.bind(this);
    this._onMouseUpListener = this.onMouseUp.bind(this);
  }

  isAnyHandleTouched () {
    if (this.isResizing) { return true; }    if (!this.worldVisible) { return false; }    return this.resizeHandles.some((handle) => {
      return handle.containsPoint(new Point(this._mouseX, this._mouseY));
    });
  }

  createResizeHandles () {
    this.resizeHandles = [];
    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

    positions.forEach((pos) => {
      const handle = new PIXI.Sprite(PIXI.Texture.WHITE);
      // Object.assign(handle, Touchable());
      handle.tint = 0xFFFFFF;
      handle.width = 10;
      handle.height = 10;
      handle.positionType = pos;

      this.resizeHandles.push(handle);
      this.addChild(handle);
    });

    this.updateHandlePositions();
  }

  attachToElement (element) {
    if (this.target === element) return; // Already selected
    this.target = element;
    this.visible = true;
    this.updateHandlePositions();

    document.addEventListener('mousedown', this._onMouseDownListener);
    document.addEventListener('mousemove', this._onMouseMoveListener);
    document.addEventListener('mouseup', this._onMouseUpListener);
  }

  detach () {
    this.target = null;
    this.visible = false;

    document.removeEventListener('mousedown', this._onMouseDownListener);
    document.removeEventListener('mousemove', this._onMouseMoveListener);
    document.removeEventListener('mouseup', this._onMouseUpListener);
  }

  onMouseDown (event) {
    if (!this.isAnyHandleTouched()) return;
    this.touchedHandle = this.resizeHandles.find((handle) => handle.containsPoint(new Point(event.clientX, event.clientY)));
    this.onResizeStart(event.clientX, event.clientY, this.touchedHandle);
  }

  onMouseUp (/* event */) {
    if (!this.isResizing) return;
    this.onResizeEnd();
  }

  onMouseMove (event) {
    this._mouseX = event.clientX;
    this._mouseY = event.clientY;
    if (!this.isResizing) return;
    this.onResizeMove();
  }


  updateHandlePositions () {
    if (!this.target) return;

    const globalPos = this.target.parent.toGlobal(this.target.position);

    this.position.set(globalPos.x, globalPos.y);

    const { width, height } = this.target;

    this.resizeHandles.forEach((handle) => {
      switch (handle.positionType) {
        case 'top-left':
          handle.position.set(-handle.width, -handle.height);
          break;
        case 'top-right':
          handle.position.set(width, -handle.height);
          break;
        case 'bottom-left':
          handle.position.set(-handle.width, height);
          break;
        case 'bottom-right':
          handle.position.set(width, height);
          break;
      }
    });
  }

  onResizeStart (x, y, handle) {
    this.isResizing = true;
    this.resizeHandle = handle;
    this.startX = x;
    this.startY = y;
    this.startWidth = this.target.width;
    this.startHeight = this.target.height;
  }

  onResizeMove () {
    if (!this.isResizing || !this.target) return;
    const dx = this._mouseX - this.startX;
    const dy = this._mouseY - this.startY;
    const globalBefore = this.target.getGlobalPosition();

    let newX = this.target.x;
    let newY = this.target.y;
    let newWidth = this.target.width;
    let newHeight = this.target.height;

    // Handle horizontal resizing
    if (this.resizeHandle.positionType.includes('right')) {
      newWidth = Math.max(20, this.startWidth + dx);
      if (this.snapToGrid) {
        newWidth = this.grid.snapToGrid(newWidth, 0).x;
      }
    } else if (this.resizeHandle.positionType.includes('left')) {
      const originalRight = this.target.x + this.target.width;
      newWidth = Math.max(20, this.startWidth - dx);

      if (this.snapToGrid) {
        newWidth = this.grid.snapToGrid(newWidth, 0).x;
      }

      newX = originalRight - newWidth;

      if (this.snapToGrid) {
        const snappedX = this.grid.snapToGrid(newX, 0).x;
        newWidth = originalRight - snappedX;
        if (newWidth < 20) {
          newWidth = 20;
          newX = originalRight - newWidth;
        }
        newX = snappedX;
      }
    }

    // Handle vertical resizing
    if (this.resizeHandle.positionType.includes('bottom')) {
      newHeight = Math.max(20, this.startHeight + dy);
      if (this.snapToGrid) {
        newHeight = this.grid.snapToGrid(0, newHeight).y;
      }
    } else if (this.resizeHandle.positionType.includes('top')) {
      const originalBottom = this.target.y + this.target.height;
      newHeight = Math.max(20, this.startHeight - dy);

      if (this.snapToGrid) {
        newHeight = this.grid.snapToGrid(0, newHeight).y;
      }

      // Calculate new Y position based on the fixed bottom edge
      newY = originalBottom - newHeight;

      if (this.snapToGrid) {
        const snappedY = this.grid.snapToGrid(0, newY).y;
        newHeight = originalBottom - snappedY;
        if (newHeight < 20) {
          newHeight = 20;
          newY = originalBottom - newHeight;
        }
        newY = snappedY;
      }
    }

    // Update the element's position and size
    this.target.x = newX;
    this.target.y = newY;

    const maxWidth = Graphics.width - this.target.x;
    const maxHeight = Graphics.height - this.target.y;

    const clampedWidth = Math.min(newWidth, maxWidth);
    const clampedHeight = Math.min(newHeight, maxHeight);

    this.target.width = clampedWidth;
    this.target.height = clampedHeight;

    // Trick to prevent children from moving with the target
    const globalAfter = this.target.getGlobalPosition();
    const offsetX = globalBefore.x - globalAfter.x;
    const offsetY = globalBefore.y - globalAfter.y;

    this.target.children.forEach((child) => {
      if (!child.isElement) return;
      child.x += offsetX;
      child.y += offsetY;
    });

    // Emit the resize event with the updated position and dimensions
    this.emit('resize', this.target.width, this.target.height);
    this.updateHandlePositions();
  }


  onResizeEnd () {
    this.isResizing = false;
  }
}

class Grid extends PIXI.Container {
  constructor (gridSize = 32, width, height) {
    super();
    this.gridSize = gridSize;
    this.canvasWidth = width;
    this.canvasHeight = height;

    this.graphics = new PIXI.Graphics(); // Store Graphics instance
    this.addChild(this.graphics);

    this.drawGrid();
  }

  drawGrid () {
    this.graphics.clear();
    this.graphics.lineStyle(1, 0xAAAAAA, 1);

    for (let x = 0; x <= this.canvasWidth; x += this.gridSize) {
      this.graphics.moveTo(x, 0);
      this.graphics.lineTo(x, this.canvasHeight);
    }

    for (let y = 0; y <= this.canvasHeight; y += this.gridSize) {
      this.graphics.moveTo(0, y);
      this.graphics.lineTo(this.canvasWidth, y);
    }
  }

  snapToGrid (x, y) {
    return {
      x: Math.round(x / this.gridSize) * this.gridSize,
      y: Math.round(y / this.gridSize) * this.gridSize,
    };
  }
}

const ROOT_DIR$1 = require('path').dirname(process.mainModule.filename);
const DATA_DIR$1 = `${ROOT_DIR$1}/data/`;

class HUD extends PIXI.Container {
  constructor (rect) {
    super(rect.x, rect.y, rect.height, rect.width);
    this._rect = rect;
    this.opacity = 0;
    this._touchCount = 0;
    this._buttons = [];
    this._elements = [];
    this._clickableSprites = [];
    this._selectedElement = null;
    this._parentSelectedElement = null;
    this._isSelectedElementDragging = false;
    this._isIsolateMode = false;
    this._isGridActive = true;
    this._settings = {
      name: 'None',
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    };
    this._visibilityExclusions = [];
    this.currentGlobalSaveData = [];
    this._oldPanelVisibleState = {
      /* toolbarPanel: false, */
      elementOptionsPanel: false,
      elementListPanel: false,
    };
    elementManager.on('element-selected', (element) => {
      this._onElementSelected(element);
    });

    elementManager.on('element-deselected', () => {
      this._onElementDeselected();
    });

    elementManager.on('element-drag-move', (data) => {
      this._onElementDragMove(data);
    });

    elementManager.on('element-drag-end', (element) => {
      this._onElementDragEnd(element);
    });

    elementManager.on('element-added', (element) => {
      this._elements.push(element);
      this._elementListPanel.setElements(this._elements);
    });
    // Disable scrolling to prevent issues with too many textareas
    document.body.style.overflow = 'hidden';
    this.draw();
  }

  _mapElementsDataToSave () {
    const parentElements = this._elements.filter((el) => !el.isChild() && !el.isGlobal());
    return {
      mapId: $gameMap.mapId(),
      elements: parentElements.map((element) => {
        return {
          ...element.getElementState(),
        };
      }),
    };
  }

  _globalElementsDataToSave () {
    const globalElements = this._elements.filter((el) => el.isGlobal());
    return globalElements.map((element) => {
      return {
        ...element.getElementState(),
      };
    });
  }

  async _saveToJSON () {
    if (!Utils.isNwjs() || !$gameTemp.isPlaytest()) {
      console.error('You can only save when using playtest!');
    }

    try {
      const fs = require('fs');
      const filename = 'Elements.json';
      const currentData = await loadJSON(`${DATA_DIR$1}/Elements.json`);

      const mapSaveData = this._mapElementsDataToSave();
      const globalSaveData = this._globalElementsDataToSave();

      const dataExists = currentData.mapElements.some((d) => d.mapId === mapSaveData.mapId);

      if (dataExists) {
        currentData.mapElements.forEach((d) => {
          if (d.mapId === mapSaveData.mapId) {
            d.elements = mapSaveData.elements;
          }
        });
      } else {
        currentData.mapElements.push(mapSaveData);
      }

      if (this.currentGlobalSaveData.length <= 0) {
        this.currentGlobalSaveData = globalSaveData;
      }

      currentData.globalElements = globalSaveData;

      if (fs.existsSync(DATA_DIR$1) === false) {
        fs.mkdirSync(DATA_DIR$1);
      }

      fs.writeFile(`${DATA_DIR$1}/${filename}`, JSON.stringify(currentData), (err) => {
        if (err) {
          console.error(err);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  setSelectedEvent (eventId) {
    if (this._needsEventAssignment && eventId) {
      this._selectedElement.setEventId(eventId);
      this._elementOptionsPanel.refresh();
      this._selectedEventId = eventId;
      this._tooltip.visible = false;
      setTimeout(() => {
        this.showElements();
        this._needsEventAssignment = false;
      }, 500);
    }
  }

  setClickableSprites (events) {
    this._clickableSprites = events;
  }

  draw () {
    this.createGrid();
    this.createToolbar();
    this.createNewElementPanel();
    this.createElementsOptionPanel();
    this.createElementsListPanel();
    this.createResizeBox();
    this.createElementContextMenu();
    this.createTooltip();
  }

  show () {
    if (this._selectedElement) {
      this._selectedElement.forceSelection(true);
    }
    this.visible = true;
    this.enableElements();
    // this.disableButtonElementClicks()
    $gameSystem.disableMenu();
  }

  hide () {
    if (this._selectedElement) {
      this._selectedElement.forceSelection(false);
      this._selectedElement.update();
    }
    this.visible = false;
    this.disableElements();
    // this.enableButtonElementClicks()
    $gameSystem.enableMenu();
  }

  showPanels () {
    this._toolbarPanel.show();

    if (this._oldPanelVisibleState.elementOptionsPanel) {
      this._elementOptionsPanel.show();
    }

    if (this._oldPanelVisibleState.elementListPanel) {
      this._elementListPanel.show();
    }
  }

  hidePanels () {
    this._oldPanelVisibleState.toolbarPanel = this._toolbarPanel.visible;
    this._oldPanelVisibleState.elementOptionsPanel = this._elementOptionsPanel.visible;
    this._oldPanelVisibleState.elementListPanel = this._elementListPanel.visible;
    this._toolbarPanel.hide();
    this._elementOptionsPanel.hide();
    this._elementListPanel.hide();
  }

  isVisible () {
    return this.visible;
  }

  isToolSelected () {
    return this._currentTool || typeof this._currentTool !== 'undefined';
  }

  isMouseElementActive () {
    return this._mouseElement && this._mouseElement !== null;
  }

  isSelectedElementDragging () {
    return this._selectedElement && this._selectedElement.isDragging();
  }

  isHudTouched () {
    return this.isEditorPanelTouched();
  }

  isEditorPanelTouched () {
    const x = TouchInput.x;
    const y = TouchInput.y;
    if (this.visible) {
      return x >= 0 && y >= 0 && x < Graphics.boxWidth && y < 55;
    }
    return false;
  }

  isAnyButtonTouched () {
    const isHudButtonTouched = this._buttons.some((button) => button.isButtonTouched());

    return isHudButtonTouched;
  }

  isAnyElementTouched () {
    const isElementTouched = this._elements.some((element) => element.isTouched(TouchInput.x, TouchInput.y));

    return isElementTouched;
  }

  isAnyPanelTouched () {
    return this._elementOptionsPanel.isTouched() || this._elementListPanel.isTouched() ||
      this._toolbarPanel.isTouched() || this.isAnyContextMenuTouched();
  }

  isAnyContextMenuTouched () {
    return this._newElementContextMenu.isTouched() || this._elementContextMenu.isTouched();
  }

  isAnyClickableSpriteTouched () {
    return this._clickableSprites.some((sprite) => sprite.isTouched());
  }

  isActionRequired () {
    return this._needsElementAssignment || this._needsEventAssignment || this._needsReparent;
  }

  canTouchMap () {
    return this._selectedElement && !this._selectedElement.isDragging() &&
      !this.isAnyElementTouched() && !this.isAnyContextMenuTouched();
  }

  enableElements () {
    this._elements.forEach((element) => {
      if (this._isIsolateMode && element === this._selectedElement) {
        return;
      }
      element.enableInteraction();
    });
  }

  hideElements () {
    this._elements.forEach((element) => {
      if (element.visible === false) {
        this._visibilityExclusions.push(element);
      }
      element.hide();
    });
  }

  showElements () {
    this._elements.forEach((element) => {
      if (this._visibilityExclusions.includes(element)) {
        this._visibilityExclusions.splice(this._visibilityExclusions.indexOf(element), 1);
        return;
      }
      element.show();
    });
  }

  disableElementsWithExclusion (exclusions = []) {
    const elementsToDisable = this._elements.filter((element) => {
      return exclusions.some((exclusion) => element !== exclusion);
    });
    elementsToDisable.forEach((element) => element.disableInteraction());
  }

  disableElements () {
    this._elements.forEach((element) => element.disableInteraction());
  }

  reloadElements () {
    elementManager.getElements().forEach((el) => this._elements.push(el));
  }

  enableButtonElementClicks () {
    this._elements.forEach((element) => {
      if (element.isButton) {
        element.canClick = true;
      }
    });
  }

  disableButtonElementClicks () {
    this._elements.forEach((element) => {
      if (element.isButton) {
        element.canClick = false;
      }
    });
  }

  createGrid () {
    this._grid = new Grid(24, Graphics.width, Graphics.height);
    this._grid.x = 0;
    this._grid.y = 0;
    this.addChild(this._grid);
  }

  createToolbar () {
    this._toolbarPanel = new ToolbarPanel();
    this._toolbarPanel.on('toggle-options', this._onToggleElementsOptions.bind(this));
    this._toolbarPanel.on('toggle-list', this._onToggleElementsList.bind(this));
    this._toolbarPanel.on('toggle-isolate', this.onIsolateElement.bind(this));
    this._toolbarPanel.on('map-change', this.onMapChange.bind(this));
    this._toolbarPanel.on('save', this._onSave.bind(this));
    this._toolbarPanel.on('grid-toggle', this._onGridToggle.bind(this));
    this.addChild(this._toolbarPanel);
  }

  createElementsOptionPanel () {
    this._elementOptionsPanel = new ElementOptionsPanel(this._settings);
    this._elementOptionsPanel.on('element-changed', this._onElementSettingsChanged.bind(this));
    this._elementOptionsPanel.on('element-deleted', this._onDeleteElement.bind(this));
    // this._elementOptionsPanel.on('child-selected', this._onChildSelected.bind(this))
    this._elementOptionsPanel.on('assign-event', this._onAssignEvent.bind(this));
    this._elementOptionsPanel.on('assign-element', this._onAssignElement.bind(this));
    this._elementOptionsPanel.on('dialog-open', this._onDialogOpen.bind(this));
    this._elementOptionsPanel.on('dialog-close', this._onDialogClose.bind(this));
    this._elementOptionsPanel.on('global-element-change', this.onGlobalElementChange.bind(this));
    this._elementOptionsPanel.on('tooltip-enabled', this.onTooltipEnabled.bind(this));
    this._elementOptionsPanel.on('tooltip-disabled', this.onTooltipDisabled.bind(this));
    this._elementOptionsPanel.setGlobalElements(this.currentGlobalSaveData);
    this._elementOptionsPanel.y = this._toolbarPanel.height;
    this._elementOptionsPanel.hide();
    this.addChild(this._elementOptionsPanel);
  }

  createElementsListPanel () {
    this._elementListPanel = new ElementListPanel(this._elements);
    // this._elementListPanel.on('element-changed', this._onElementSettingsChanged.bind(this))
    // this._elementListPanel.on('element-deleted', this._onDeleteElement.bind(this))
    this._elementListPanel.x = Graphics.boxWidth - this._elementListPanel.width;
    this._elementListPanel.y = this._toolbarPanel.height;
    this._elementListPanel.on('element-selected', (element) => {
      this._onElementSelected(element, true);
    });
    this._elementListPanel.hide();
    this.addChild(this._elementListPanel);
  }

  createNewElementPanel () {
    const entries = [
      { name: 'Window', icon: null },
      { name: 'Gauge', icon: null },
      { name: 'Text', icon: null },
      { name: 'Image', icon: null },
      { name: 'Button', icon: null },
    ];
    this._newElementContextMenu = new ContextMenu(entries);
    this._newElementContextMenu.hide();

    this._newElementContextMenu.on('clicked', (entry) => {
      this._onNewElement(entry.name.toLowerCase());
    });
    this._newElementContextMenu.on('show', this._onNewElementContextMenuShow.bind(this));
    this._newElementContextMenu.on('hide', this._onNewElementContextMenuHide.bind(this));

    this.addChild(this._newElementContextMenu);
  }

  createElementContextMenu () {
    const entries = [
      { name: 'Add Child', icon: null },
      { name: 'Reparent', icon: null },
      { name: 'Decouple', icon: null },
      { name: 'Duplicate', icon: null },
      { name: 'To Back', icon: null },
      { name: 'To Front', icon: null },
      { name: 'Delete', icon: null },
    ];

    this._elementContextMenu = new ContextMenu(entries);
    this._elementContextMenu.hide();

    this._elementContextMenu.on('clicked', (entry) => {
      this._onElementContextMenu(entry.name.toLowerCase());
    });

    this._elementContextMenu.on('show', this._onElementContextMenuShow.bind(this));
    this._elementContextMenu.on('hide', this._onElementContextMenuHide.bind(this));

    this.addChild(this._elementContextMenu);
  }

  createTooltip () {
    this._tooltip = new Tooltip();
    this._tooltip.x = TouchInput.x;
    this._tooltip.y = TouchInput.y;
    this._tooltip.hide();

    this.addChild(this._tooltip);
  }

  createResizeBox () {
    this._resizeBox = new ResizeBox();
    this._resizeBox.on('resize', this._onResize.bind(this));
    this._resizeBox.grid = this._grid;
    this._resizeBox.snapToGrid = true;
    this.addChild(this._resizeBox);
  }

  createElements () {
  }

  updateOutOfBounds () {
    const element = this._selectedElement;
    if (element.x <= 0) {
      element.x = 0;
    }

    if (element.x + element.width > Graphics.width) {
      element.x = Graphics.width - element.width;
    }

    if (element.y <= 0) {
      element.y = 0;
    }

    if (element.y + element.height >= Graphics.height) {
      element.y = Graphics.height - element.height;
    }
  }

  _onElementSelected (element, forceSelect = false) {
    if (!forceSelect && (this.isAnyPanelTouched() || !this.visible || this._isIsolateMode)) {
      return;
    }

    if (this._resizeBox.isAnyHandleTouched()) { return; }

    if (this.isSelectedElementDragging()) {
      return;
    }

    if (element.getType() === 'world') {
      return;
    }

    this._resizeBox.attachToElement(element);

    if (this._needsElementAssignment) {
      this._tooltip.hide();
      this._elementOptionsPanel.updateButton('openElementName', element.state.name);
      this._needsElementAssignment = false;
      return;
    } else if (this._needsReparent) {
      this._needsReparent = false;

      if (this._selectedElement.state.childElements.find((c) => c === element)) {
        this._tooltip.text = 'Unable to reparent to a child of the current element';
        this._tooltip.lock = true;
        SoundManager.playBuzzer();
        setTimeout(() => {
          this._tooltip.hide();
          this._tooltip.lock = false;
        }, 1500);
        return;
      }

      if (this._selectedElement === element) {
        this._tooltip.text = 'Unable to reparent itself';
        this._tooltip.lock = true;
        SoundManager.playBuzzer();
        setTimeout(() => {
          this._tooltip.hide();
          this._tooltip.lock = false;
        }, 1500);
        return;
      }

      element.reparent(this._selectedElement);

      this._tooltip.hide();
      this._elementListPanel.refresh();
    }

    element.enableInteraction();
    this._selectedElement = element;
    this._elementOptionsPanel.setElement(this._selectedElement);
    this._elementOptionsPanel.setGlobalElements(this.currentGlobalSaveData);
  }

  _onElementDeselected () {
    if (this._resizeBox.isAnyHandleTouched()) {
      return;
    }
    if (!this.canTouchMap() || this.isAnyElementTouched() || this.isAnyPanelTouched()) {
      return;
    }
    if (this._selectedElement) {
      this._selectedElement.clearSelectionFilter();
      this._selectedElement = null;
      this._resizeBox.detach();
    }
  }

  _onElementDragMove (data) {
    if (this.isAnyPanelTouched()) { return; }
    if (this._needsElementAssignment) { return; }
    if (this._resizeBox.isAnyHandleTouched()) { return; }
    if (data.element.isInteractionDisabled()) { return; }
    const snapToGrid = this._isGridActive;
    let position = { x: data.x, y: data.y };
    if (snapToGrid) {
      position = this._grid.snapToGrid(data.x, data.y);
    }
    this._resizeBox.updateHandlePositions();
    this._selectedElement = data.element;
    this._selectedElement.setDragging(true);
    this._selectedElement.x = position.x;
    this._selectedElement.y = position.y;
    if (!this._selectedElement.isChild()) {
      this.updateOutOfBounds();
    }
    this.hidePanels();
  }

  _onElementDragEnd (/* element */) {
    if (this._selectedElement) {
      this._selectedElement.setDragging(false);
    }
    this.showPanels();
    this._elementOptionsPanel.refresh();
  }

  _onResize (newWidth, newHeight) {
    if (this._selectedElement.onResize) {
      this._selectedElement.onResize(newWidth, newHeight);
    }
    this._elementOptionsPanel.refresh();
  }

  _prepareSceneChange () {
    this._currentTool = null;
    this._selectedElement = null;
    document.removeEventListener('mousemove', this._buttonListener);
    this._elementOptionsPanel.terminate();
    this._elementListPanel.terminate();
    this._toolbarPanel.terminate();
    this.hide();
  }

  _onSelectTool () {
    this.clearMouseElement();
    this._currentTool = 'selectTool';
  }

  _onDeleteElement () {
    const index = this._elements.indexOf(this._selectedElement);
    this._elements.splice(index, 1);
    this._deleteChildrenElements(this._selectedElement);
    elementManager.removeElement(this._selectedElement);
    if (this._elementListPanel.getSelectedElement() === this._selectedElement) {
      this._elementListPanel.setSelectedElement('world');
    }
    this._elementOptionsPanel.hide();
    this._selectedElement = null;
    this._elementOptionsPanel.setElement(null);
    this._elementListPanel.setElements(this._elements);
  }

  _deleteChildrenElements (parent) {
    const getAllChildren = (parent, result = []) => {
      const parentChildren = parent.children.filter((c) => c.isElement);

      for (const child of parentChildren) {
        result.push(child);
        getAllChildren(child, result);
      }

      return result;
    };


    getAllChildren(parent).forEach((child) => {
      const index = this._elements.indexOf(child);
      this._elements.splice(index, 1);
      elementManager.removeElement(child);
      parent.removeChild(child);
    });

    this._resizeBox.detach();
  }

  _onNewElement (type) {
    let element = null;
    const rect = new Rectangle(
      TouchInput.x - 75,
      TouchInput.y - 75,
      150,
      150,
    );

    switch (type) {
      case 'gauge':
        element = ElementFactory.createElement(type, rect, { name: 'Gauge' });
        element.setDimensions(150, 20);
        break;

      case 'image':
        element = ElementFactory.createElement(type, rect, { name: 'Image' });
        break;

      case 'text':
        element = ElementFactory.createElement(type, rect, { name: 'Text' });
        break;

      case 'button':
        element = ElementFactory.createElement(type, rect, { name: 'Button' });
        break;

      default:
        element = ElementFactory.createElement(type, rect, { name: 'Window' });
        break;
    }

    element.enableInteraction();

    if (this._parentSelectedElement) {
      element.x = 0;
      element.y = 0;

      this._selectedElement.addChildElement(element);
      elementManager.addElement(element, true);
      this._parentSelectedElement = null;
      return;
    }

    elementManager.addElement(element);
  }

  _onElementContextMenu (entry) {
    switch (entry) {
      case 'duplicate': {
        const settings = this._selectedElement.getElementSettings();
        const element = elementManager.createElementFromData({
          ...settings,
          x: settings.x + 15,
          y: settings.y + 15,
        });
        element.enableInteraction();
        // Enable children here or in the enable() method?
        if (this._selectedElement.isChild()) {
          this._selectedElement.parent.addChildElement(element);
        }
        element.childElements.forEach((c) => c.enableInteraction());
        break;
      }

      case 'delete':
        this._onDeleteElement();
        break;

      case 'add child':
        this._elementContextMenu.hide();
        this._newElementContextMenu.x = this._elementContextMenu.x;
        this._newElementContextMenu.y = this._elementContextMenu.y;
        this._newElementContextMenu.show();
        break;

      case 'reparent':
        this._onReparentElement(this._selectedElement);
        this._selectedElement.enableInteraction();
        break;

      case 'decouple':
        this._onDecoupleElement(this._selectedElement);
        this._selectedElement.enableInteraction();
        break;

      case 'to back': {
        this._selectedElement.moveToBack();
        this._selectedElement.enableInteraction();
        break;
      }

      case 'to front': {
        this._selectedElement.moveToFront();
        this._selectedElement.enableInteraction();
        break;
      }
    }
  }

  _onToggleElementsList () {
    this._elementListPanel.toggle();
  }

  _onToggleElementsOptions () {
    this._selectedElement = null;
    this._elementOptionsPanel.toggle();
  }

  _onSave () {
    this._saveToJSON();
  }

  _onGridToggle (state) {
    this._isGridActive = state;
    this._grid.visible = state;
    this._resizeBox.snapToGrid = state;
  }

  _onElementSettingsChanged (/* element */) {
    this._elementListPanel.refreshNames();
  }

  _onChildSelected (childElement) {
    childElement.enableInteraction();
    this._selectedElement = childElement;
    this._elementOptionsPanel.setElement(this._selectedElement);
  }

  _onAssignEvent (/* element */) {
    const elementName = this._selectedElement.name || this._selectedElement.type();
    this._needsEventAssignment = true;
    this._tooltip.text = `Assign an event to (${elementName})`;
    this._tooltip.show();
    this.hideElements();
  }

  _onAssignElement (/* element */) {
    const elementName = this._selectedElement.name || this._selectedElement.type();
    this._needsElementAssignment = true;
    this._tooltip.text = `Assign an element to (${elementName})`;
    this._tooltip.show();
    this._tooltip.lock = true;
    this.enableElements();
  }

  _onReparentElement (/* element */) {
    const elementName = this._selectedElement.name || this._selectedElement.type();
    this._needsReparent = true;
    this._tooltip.text = `Assign element (${elementName}) to a new parent element`;
    this._tooltip.show();
    this._tooltip.lock = true;
    this.enableElements();
  }

  _onDecoupleElement (element) {
    element.decouple();
    this.enableElements();
  }

  _onDialogOpen () {
    this._isDialogOpen = true;
    this.disableElements();
  }

  _onDialogClose () {
    this._isDialogOpen = false;
    TouchInput.clear();
    setTimeout(() => {
      this.enableElements();
    }, 250);
  }

  onGlobalElementChange (globalId, toRemove) {
    if (toRemove) {
      this.currentGlobalSaveData.find((el, i) => {
        if (el.globalId === globalId) {
          this.currentGlobalSaveData.slice(i, 0);
        }
        return false;
      });
    }
  }

  onIsolateElement (value, button) {
    if (this._isIsolateMode) {
      this.enableElements();
      this._isIsolateMode = false;
      return;
    }
    if (!this._selectedElement) {
      button.canToggle = false;
      return;
    }
    button.canToggle = true;
    this._isIsolateMode = true;
    this.disableElements();
    this._selectedElement.enableInteraction();
    this._selectedElement.enableDragging(); // redundant?
  }

  onMapChange (mapName) {
    const maps = state.getMapData();
    const mapData = maps.filter((map) => map.name === mapName)[0];
    if ($gameMap.mapId() !== mapData.id) {
      $gamePlayer.reserveTransfer(mapData.id, 10, 10);
    }
  }

  _onNewElementContextMenuShow () {
    if (this._selectedElement) {
      this._selectedElement.forceSelection(true);
      this._elementListPanel.setSelectedElement(this._selectedElement);
      // this._elementOptionsPanel.setElement(this._selectedElement)
      this.disableElements();
    }
  }

  _onNewElementContextMenuHide () {
    if (this._elementContextMenu.visible === false) {
      this.enableElements();
    }
  }

  _onElementContextMenuShow () {
    this._elementListPanel.setSelectedElement(this._selectedElement);
    this._elementOptionsPanel.setElement(this._selectedElement);
    this._selectedElement.forceSelection(true);
    this.disableElements();
  }

  _onElementContextMenuHide () {
    if (this._newElementContextMenu.visible === false) {
      this.enableElements();
    }
  }

  onTooltipEnabled (tooltip) {
    if (!tooltip || tooltip === '') {
      return;
    }
    this._tooltip.text = tooltip;
    this._tooltip.show();
    this._tooltip.x = TouchInput.x;
    this._tooltip.y = TouchInput.y;
  }

  onTooltipDisabled () {
    this._tooltip.text = '';
    this._tooltip.hide();
    this._tooltip.lock = false;
  }

  _processMapTouch () {
    if (this.isAnyPanelTouched() || this.isActionRequired() || this._isDialogOpen) {
      return;
    }
    if (TouchInput.isCancelled() && this.visible && !this.isActionRequired()) {
      this._processContextMenus();
    }
    if (TouchInput.isTriggered() || this._touchCount > 0) {
      if (TouchInput.isPressed() && (this._touchCount === 0 || this._touchCount >= 30)) {
        this._onMapTouch();
      }
      this._touchCount++;
    } else {
      this._touchCount = 0;
    }
  }

  _onMapTouch () {
    if (!this.canTouchMap() || this.isAnyElementTouched()) {
      return;
    }
    if (this._needsElementAssignment && !this.isAnyElementTouched()) {
      this._needsElementAssignment = false;
    }
    this._tooltip.hide();
    this.enableElements();
    this._touchCount = 0;
  }

  _processContextMenus () {
    if (this._selectedElement && this._selectedElement.isTouched(TouchInput.x, TouchInput.y)) {
      if (this._newElementContextMenu.visible) {
        return;
      }
      this._elementContextMenu.x = TouchInput.x - 10;
      this._elementContextMenu.y = TouchInput.y - 10;
      this._parentSelectedElement = this._selectedElement;
      this._elementContextMenu.show();
    } else if (!this.isAnyElementTouched()) {
      if (this._elementContextMenu.visible) {
        return;
      }
      this._parentSelectedElement = null;
      this._newElementContextMenu.x = TouchInput.x - 10;
      this._newElementContextMenu.y = TouchInput.y - 10;
      this._newElementContextMenu.show();
    }
  }

  update () {
    if (SceneManager.isSceneChanging()) {
      this._prepareSceneChange();
    }
    if (!this.visible) {
      return;
    }
    if (this.isActionRequired() && TouchInput.isCancelled()) {
      this._needsEventAssignment = false;
      this._needsElementAssignment = false;
      this._needsReparent = false;
      this._tooltip.text = '';
      this._tooltip.hide();
      this._tooltip.lock = false;
      this.showElements();
      return;
    }

    // We assign elements form the manager because on map reload
    // elements or the list is not re-assigned
    if (elementManager.getElements().length > 0 && this._elements.length <= 0) {
      this._elements = elementManager.getElements();
      this._elementListPanel.setElements(this._elements);
    }

    this._processMapTouch();
    // this._updateMenuAvailability()
    this._updateElementsPanel();
    this._newElementContextMenu.update();
    this._elementContextMenu.update();
    this._elementListPanel.update();
    this._toolbarPanel.update();
    this._tooltip.x = TouchInput.x + 15;
    this._tooltip.y = TouchInput.y;
  }

  _updateElementsPanel () {
    this._elementOptionsPanel.update();
    if (this.isAnyPanelTouched()) {
      return;
    }
    if (this._selectedElement && this.isSelectedElementDragging()) {
      if (this._elementOptionsPanel.visible) {
        this._elementOptionsPanel.hide();
      }
    } else if (this._selectedElement && !this._elementOptionsPanel.visible) {
      this._elementOptionsPanel.show();
    } else if (!this._selectedElement && this._elementOptionsPanel.visible) {
      this._elementOptionsPanel.hide();
    }
  }

  _updateMenuAvailability () {
    if ($gameSystem.isMenuEnabled() && this.isVisible) {
      $gameSystem.disableMenu();
    } else if (!$gameSystem.isMenuEnabled() && !this.isVisible) {
      $gameSystem.enableMenu();
    }
  }
}

/* globals mv3d  */

const ROOT_DIR = require('path').dirname(process.mainModule.filename);
const DATA_DIR = `${ROOT_DIR}/data/`;

let eventClickProcessing = false;

const aliasProcessMapTouch = Scene_Map.prototype.processMapTouch;
Scene_Map.prototype.processMapTouch = function () {
  if (TouchInput.isPressed()) {
    if (this._editorToggleButton.isTouched() || elementManager.isAnyElementTouched()) {
      return;
    }
  }

  if (typeof mv3d !== 'undefined') {
    this.processClickableSpriteTouch3d();
  } else {
    this.processClickableSpriteTouch();
  }
  if (this._elementsEditor.isVisible()) {
    return;
  }
  aliasProcessMapTouch.call(this);
};

Scene_Map.prototype.processClickableSpriteTouch3d = function () {
  if (TouchInput.isPressed() || mv3d._touchState.isTapped) {
    if (this._touchCount === 0 || this._touchCount >= 15 || mv3d._touchState.isTapped) {
      const touchPos = { x: TouchInput.x, y: TouchInput.y };

      if (!this._elementsEditor.isAnyPanelTouched()) {
        const intersection = window.mv3d.scene.pick(touchPos.x, touchPos.y, this.predicate);
        if (intersection.hit) {
          if (intersection.pickedMesh.character) {
            this.onClickable(intersection.pickedMesh.character);
          }
        }
      }
    }
    this._touchCount++;
  } else {
    this._touchCount = 0;
  }
};

Scene_Map.prototype.processClickableSpriteTouch = function () {
  if (TouchInput.isPressed()) {
    if (this._touchCount === 0 || this._touchCount >= 15) {
      if (this._clickableSprites) {
        const touchPos = new Point(TouchInput.x, TouchInput.y);
        const localPos = this.worldTransform.applyInverse(touchPos);
        if (!this._elementsEditor.isAnyPanelTouched()) {
          this._clickableSprites.forEach((clickable) => {
            const char = clickable.char;
            const rect = new Rectangle(char.screenX() - 24, char.screenY() - 48, 48, 48);
            if (rect.contains(localPos.x, localPos.y)) {
              this.onClickable(clickable);
            }
          });
        }
      }
    }
    this._touchCount++;
  } else {
    this._touchCount = 0;
  }
};

Scene_Map.prototype.loadElementWindows = function () {
  const currentMapId = $gameMap.mapId();

  loadJSON(`${DATA_DIR}/Elements.json`)
    .then((data) => {
      let elements = [];
      data.mapElements.forEach((map) => {
        if (map.mapId === currentMapId) {
          elements = map.elements.concat(data.globalElements);
        }
      });
      elements.forEach((elementData) => {
        elementManager.createElementFromData(elementData, true);
      });
      this._elementsEditor.currentGlobalSaveData = data.globalElements;
      return null;
    })
    .catch((e) => console.error(e));
};

const aliasOnMapLaoded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function () {
  aliasOnMapLaoded.call(this);
  this._clickableSprites = [];
  if (typeof mv3d === 'undefined') {
    this.createClickableSprites();
  }
};

Scene_Map.prototype.createClickableSprites = function () {
  const followers = Utils.RPGMAKER_NAME === 'MZ'
    ? $gamePlayer.followers().data()
    : $gamePlayer.followers();

  $gameMap.events().forEach((event) => {
    this._clickableSprites.push({
      isEvent: true,
      char: event,
    });
  });

  followers.forEach((follower) => {
    this._clickableSprites.push({
      isFollower: true,
      char: follower,
    });
  });

  this._clickableSprites.push({
    isPlayer: true,
    char: $gamePlayer,
  });

  this._elementsEditor.setClickableSprites(this._clickableSprites);
};

const aliasCreateAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function () {
  elementManager.addLayerTo(this);
  aliasCreateAllWindows.call(this);
  this.createElementsEditor();
  this.createElementsEditorToggle();
  if (!elementManager.hasElements()) {
    this.loadElementWindows();
  } else {
    this._elementsEditor.reloadElements();
  }
};

Scene_Map.prototype.createElementsEditorToggle = function () {
  this._editorToggleButton = new Button({
    x: 15,
    y: 15,
    textures: {
      normal: ImageManager.elementsUiTexture('ellipsis-h-solid'),
    },
  });
  this._editorToggleButton.on('click', this.onEditorToggle.bind(this));
  this.addChild(this._editorToggleButton);
};

Scene_Map.prototype.elementsEditorRect = function () {
  return new Rectangle(
    0,
    0,
    Graphics.boxWidth,
    Graphics.boxHeight,
  );
};

Scene_Map.prototype.createElementsEditor = function () {
  const rect = this.elementsEditorRect();
  this._elementsEditor = new HUD(rect);
  this._elementsEditor.hide();
  this.addChild(this._elementsEditor);
};

Scene_Map.prototype.updateElementsEditorVisibility = function () {
  if (Input.isTriggered('#l') && this._elementsEditor.isVisible() === false) {
    this._elementsEditor.show();
    $gameTemp.setElementEditMode(true);
    // SceneManager
  } else if (Input.isTriggered('#l') && this._elementsEditor.isVisible() === true) {
    this._elementsEditor.hide();
    $gameTemp.setElementEditMode(false);
  }
};

const aliasUpdateScene = Scene_Map.prototype.updateScene;
Scene_Map.prototype.updateScene = function () {
  aliasUpdateScene.call(this);
  this.updateElementsEditorVisibility();
  this._elementsEditor.update();
  elementManager.update();
};

Scene_Map.prototype.onEditorToggle = function () {
  if (this._elementsEditor && this._elementsEditor.isVisible() === false) {
    this._elementsEditor.show();
    $gameTemp.setElementEditMode(true);
  } else if (this._elementsEditor && this._elementsEditor.isVisible() === true) {
    this._elementsEditor.hide();
    $gameTemp.setElementEditMode(false);
  }
};

Scene_Map.prototype.getEventType = function (clickable) {
  let eventId = null;

  if (clickable.isEvent) {
    eventId = clickable.char.eventId();
  } else if (clickable.isPlayer) {
    eventId = 'player';
  } else if (clickable.isFollower) {
    const clickedFollower = clickable.char;
    let followerIndex = null;

    for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
      const follower = $gamePlayer.followers().follower(i);
      if (follower === clickedFollower) {
        followerIndex = i;
        eventId = `follower-${followerIndex}`;
        break;
      }
    }
  }
  return eventId;
};

Scene_Map.prototype.onClickable = function (clickable) {
  const eventId = this.getEventType(clickable);
  let elements = [];

  if (eventId) {
    elements = elementManager.getElements().filter((element) => {
      return element.getEventId() === eventId && !element.isChild();
    });
  }

  if (elements.length > 0) {
    elements.forEach((element) => {
      const { gameVar, gameSwitch } = element;

      if ((gameVar.id > 0 || gameSwitch > 0)) {
        if ($gameVariables.value(gameVar.id) > 0 ||
          $gameSwitches.value(element.getGameSwitch())) {
          if (!this._elementsEditor.visible && !eventClickProcessing) {
            eventClickProcessing = true;
            element.toggleVisibility();
          }
        }
      } else if (!this._elementsEditor.visible && !eventClickProcessing) {
        element.toggleVisibility();
      }
    });
  }

  setTimeout(() => {
    eventClickProcessing = false;
  }, 500);

  this._elementsEditor.setSelectedEvent(eventId);
};

const aliasTerminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function () {
  aliasTerminate.call(this);
  this._editorToggleButton.destroy();
  elementManager.removeLayerFrom(this);
  this.removeChild(this._elementsEditor);
};

const aliasInitalize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function () {
  aliasInitalize.call(this);
  this._isElementEditMode = false;
};

Game_Temp.prototype.setElementEditMode = function (value) {
  this._isElementEditMode = value;
};

Game_Temp.prototype.isElementEditMode = function () {
  return this._isElementEditMode;
};

Game_Event.prototype.note = function () {
  const eventData = $dataMap.events[this.eventId()];
  const note = eventData.note;
  return note;
};

/* global Game_Switches */


const aliasOnChange$1 = Game_Switches.prototype.onChange;
Game_Switches.prototype.onChange = function () {
  aliasOnChange$1.call(this);
  elementManager.requestRefresh();
};

const aliasOnChange = Game_Variables.prototype.onChange;
Game_Variables.prototype.onChange = function () {
  aliasOnChange.call(this);
  elementManager.requestRefresh();
};

const getCurrentButtonData = getCurrentButtonData$1;

var main = {
  getCurrentButtonData,
  ...elementManager,
};

return main;

})();
