/*:
 * @target MZ
 * @plugindesc Transform your scene item into a grid-based one. Highly customizable.
 * @author Sang Hendrix
 * @url https://sanghendrix.itch.io/
 * 
 * @help
 * Verion 1.3.6
 * ----------------------------------------------------------------------------
 * This is a plugin for RPG Maker MZ that will transform your scene item
 * into a grid-based one. Use your own images to make the design yours.
 * ----------------------------------------------------------------------------
 * FEATURES
 * - Easy to use. Usable instantly when enabled
 * - Highly customizable: Fonts, size, position, background images, 
 *   foreground images, item backgrounds, etc
 * - Item/Weapon/Armor custom images are loaded automatically so you don't need to do
 *   all manual work like assigning notetag or assigning each pictures for each item id.
 * - Add unlimited images to the scene
 * - An awesome dev who will support you 24/7
 * ----------------------------------------------------------------------------
 * TUTORIAL
 * CUSTOM IMAGES (AUTOMATIC METHOD)
 * Put all your custom images (if you seek to use this feature) inside pictures/inventory/
 * Create inventory folder if your pictures folder doesn't have one.
 * Your files have to have the same name as your item name.
 * Example: Heavy Sword -> Heavy_Sword.png or heavy_sword.png
 * 
 * CUSTOM IMAGES (MANUAL METHOD)
 * Put this notetag to your item/weapon/armor: <customImage: filename without .png>
 * ----------------------------------------------------------------------------
 * For questions, please visit Discord.
 * Discord: https://discord.gg/YKPscqHV8b
 * 
 * 
 * @param zz2
 * @text -------------------------
 * 
 * @param zz2c
 * @text ■ WINDOW ITEM LIST
 * 
 * @param zz2x
 * @text -------------------------
 * 
 * @param Max Column & Row
 * @desc Maximum columns and rows in format: columns, rows (e.g., 5, 4)
 * @type string
 * @default 5, 4
 *
 * @param Item Box Size & Spacing
 * @desc Item box size and spacing in format: box size, spacing (e.g., 64, 8)
 * @type string
 * @default 64, 8
 * 
 * @param Item Background
 * @desc Select background image for item selection from img/system/
 * @type file
 * @dir img/system/
 * @default 
 * 
 * @param Item Selection Image
 * @desc Select image to use for item selection from img/system/
 * @type file
 * @dir img/system/
 * @default 
 *
 * @param Window Item List Windowskin
 * @text Item List WindowSkin
 * @desc Select windowskin file from img/system/
 * @type file
 * @dir img/system/
 * @default Window
 * 
 * @param Item List Optional Settings
 * @text Optional Settings
 * @type struct<ItemListSettings>
 * @desc Optional settings for item list window position and size
 * @default {"Width":"","Height":"","X":"","Y":""}
 * 
 * @param zz2xc
 * @text -------------------------
 * 
 * @param zz2cx
 * @text ■ WINDOW ITEM INFO
 * 
 * @param zz2xx
 * @text -------------------------
 * 
 * @param Show Item Image
 * @type boolean
 * @desc Show item image in the help window
 * @default true
 *
 * @param Name Font Size & Color
 * @desc Item name font size and color in format: size, color (e.g., 28, #6495ED)
 * @type string
 * @default 28, #6495ED
 *
 * @param Description Font Size & Color
 * @desc Item description font size and color in format: size, color (e.g., 22, #FFFFFF)
 * @type string
 * @default 22, #FFFFFF
 * 
 * @param Window Help Font File
 * @desc Font file to use for help window (place in fonts/ folder)
 * @type string
 * @default 
 * 
 * @param Window Help Windowskin
 * @desc Select windowskin file for help window from img/system/
 * @type file
 * @dir img/system/
 * @default Window
 * 
 * @param Help Window Optional Settings
 * @text Optional Settings
 * @type struct<HelpWindowSettings>
 * @desc Optional settings for help window position and size
 * @default {"Width":"","Height":"","X Offset":"8","Y Offset":"0"}
 * 
 * @param zz2xcxxcx
 * @text -------------------------
 * 
 * @param zz2cxxxcx
 * @text ■ CATEGORIES SETTING
 * 
 * @param zz2xxxxcx
 * @text -------------------------
 * 
 * @param Show Categories
 * @type boolean
 * @desc Show item categories in the scene
 * @default false
 * 
 * @param Categories Customization
 * @text Categories Customization
 * @type struct<CategorySettings>
 * @desc Customize the appearance of the category window
 * @default {"Width":"500","Height":"","Position":"top","Font":"{\"File\":\"\",\"Size\":\"\",\"Color\":\"\"}","Windowskin":""}
 * 
 * @param zz2xcxx
 * @text -------------------------
 * 
 * @param zz2cxxx
 * @text ■ ADDITIONAL SETTINGS
 * 
 * @param zz2xxxx
 * @text -------------------------
 * 
 * @param Additional Images
 * @type struct<AdditionalImage>[]
 * @text Additional Images
 * @desc Add images to the scene with layer support
 * @default []
 * 
 * @param Auto Match Custom Image
 * @text Automatic Custom Image
 * @type boolean
 * @desc ON: Items find matching image file in pictures/inventory. OFF: Only find if item has note <customImage>
 * @default false
 */
/*~struct~AdditionalImage:
 * @param Image
 * @text Image File
 * @type file
 * @dir img/system
 * @desc Select an image from the system folder
 * @default
 * 
 * @param X
 * @text X Position
 * @type text
 * @desc X position of the image.
 * @default 0
 * 
 * @param Y
 * @text Y Position
 * @type text
 * @desc Y position of the image.
 * @default 0
 * 
 * @param Layer
 * @text Layer Position
 * @type select
 * @option Above Windows
 * @value above
 * @option Below Windows
 * @value below
 * @desc Whether to show the image above or below the windows
 * @default below
 */
/*~struct~ItemListSettings:
 * @param Width
 * @desc The width of item list window. Empty for auto-scale depending on max columns
 * @type string
 * @default 
 * 
 * @param Height
 * @desc The height of item list window. Empty for auto-scale depending on max rows
 * @type string
 * @default 
 * 
 * @param X
 * @desc The X position of the item window relative to center. Empty is center
 * @type string
 * @default 
 *
 * @param Y
 * @desc The Y position of the item window relative to center. Empty is center
 * @type string
 * @default 
 */
/*~struct~HelpWindowSettings:
 * @param Width
 * @desc The width of help window. Empty = Window Item List width
 * @type string
 * @default 
 *
 * @param Height
 * @desc The height of help window. Empty = Window Item List height
 * @type string
 * @default 
 *
 * @param X Offset
 * @desc X offset from the item window's right edge
 * @type string
 * @default 8
 *
 * @param Y Offset
 * @desc Y offset from the item window's Y position
 * @type string
 * @default 0
 */
/*~struct~CategorySettings:
 * @param Width
 * @desc Width of the category window. Leave empty for default
 * @type string
 * @default 500
 *
 * @param Height
 * @desc Height of the category window. Leave empty for default
 * @type string
 * @default 
 *
 * @param Position
 * @desc Position relative to item list window. 'top'/'bottom' for auto-positioning, or use coordinates x, y
 * @type string
 * @default top
 *
 * @param Font
 * @type struct<FontSettings>
 * @desc Font settings for category window
 *
 * @param Windowskin
 * @desc Windowskin file for category window. Leave empty for default
 * @type file
 * @dir img/system/
 * @default 
 */
/*~struct~FontSettings:
 * @param File
 * @desc Font file to use (place in fonts/ folder). Leave empty for default
 * @type string
 * @default 
 *
 * @param Size
 * @desc Font size. Leave empty for default
 * @type number
 * @min 1
 * @default 
 *
 * @param Color
 * @desc Text color (hex code, e.g. #ffffff). Leave empty for default
 * @type string
 * @default 
 */

var Imported = Imported || {};
Imported.Hendrix_Grid_Item_Scene = true;

(() => {
  const pluginName = "Hendrix_Grid_Item_Scene";
  const parameters = PluginManager.parameters(pluginName);
  const isSceneItem = () => {
    return SceneManager._scene instanceof Scene_Item;
  };

  const ItemBoxSizeSpacing = (paramStr) => {
    const parts = (paramStr || '64, 8').split(',').map(s => s.trim());
    return {
      boxSize: Number(parts[0]) || 64,
      spacing: Number(parts[1]) || 8
    };
  };
  const itemBoxSizeSpacingData = ItemBoxSizeSpacing(parameters['Item Box Size & Spacing']);
  const itemBoxSize = itemBoxSizeSpacingData.boxSize;
  const itemSpacing = itemBoxSizeSpacingData.spacing;
  const MaxColumnRow = (paramStr) => {
    const parts = (paramStr || '5, 4').split(',').map(s => s.trim());
    return {
      columns: Number(parts[0]) || 5,
      rows: Number(parts[1]) || 4
    };
  };
  const maxColumnRowData = MaxColumnRow(parameters['Max Column & Row']);
  const maxColumns = maxColumnRowData.columns;
  const itemListRow = maxColumnRowData.rows;
  const NameFontSizeColor = (paramStr) => {
    const parts = (paramStr || '28, #6495ED').split(',').map(s => s.trim());
    return {
      fontSize: Number(parts[0]) || 28,
      fontColor: parts[1] || '#6495ED'
    };
  };

  const DescFontSizeColor = (paramStr) => {
    const parts = (paramStr || '22, #FFFFFF').split(',').map(s => s.trim());
    return {
      fontSize: Number(parts[0]) || 22,
      fontColor: parts[1] || '#FFFFFF'
    };
  };
  const nameFontData = NameFontSizeColor(parameters['Name Font Size & Color']);
  const itemNameFontSize = nameFontData.fontSize;
  const itemNameColor = nameFontData.fontColor;
  const descFontData = DescFontSizeColor(parameters['Description Font Size & Color']);
  const itemDescFontSize = descFontData.fontSize;
  const itemDescColor = descFontData.fontColor;
  const helpFontFile = parameters['Window Help Font File'] || '';
  const showCategories = String(parameters['Show Categories'] || 'false') === 'true';
  const autoMatchCustomImage = String(parameters['Auto Match Custom Image'] || 'false') === 'true';
  const showItemImage = String(parameters['Show Item Image'] || 'true') === 'true';

  let itemBackgroundBitmap = null;
  let isItemBgLoaded = false;
  let selectionBitmap = null;
  let isSelectionLoaded = false;
  let itemListSettings = {};
  let helpWindowSettings = {};
  let categorySettings = {};

  itemListSettings = JSON.parse(parameters['Item List Optional Settings'] || '{}');
  helpWindowSettings = JSON.parse(parameters['Help Window Optional Settings'] || '{}');
  categorySettings = JSON.parse(parameters['Categories Customization'] || '{}');
  if (categorySettings.Font) {
    categorySettings.Font = JSON.parse(categorySettings.Font);
  }

  if (parameters['Item Selection Image']) {
    const bitmap = ImageManager.loadSystem(parameters['Item Selection Image']);
    bitmap.addLoadListener(() => {
      selectionBitmap = bitmap;
      isSelectionLoaded = true;
    });
  }

  if (parameters['Item Background']) {
    const bitmap = ImageManager.loadSystem(parameters['Item Background']);
    bitmap.addLoadListener(() => {
      itemBackgroundBitmap = bitmap;
      isItemBgLoaded = true;
    });
  }

  const getCustomItemImage = (item) => {
    if (!item) return null;

    // 1st, Check for notetag
    if (item.meta && item.meta.customImage) {
      const path = item.meta.customImage.trim();
      const fullPath = path.includes('/') ? path : `inventory/${path}`;
      const bitmap = ImageManager.loadPicture(fullPath);

      if (bitmap && bitmap._url && !bitmap._customLoadListenerAdded) {
        bitmap._customLoadListenerAdded = true;
        bitmap.addLoadListener(() => {
          if (SceneManager._scene &&
            SceneManager._scene._itemWindow &&
            SceneManager._scene._itemWindow._helpWindow) {
            SceneManager._scene._itemWindow.updateHelp();
          }
        });
      }

      return bitmap;
    }

    // 2nd, Automatic filename matching
    if (autoMatchCustomImage) {
      const matchingFile = findMatchingImageFile(item);
      if (matchingFile) {
        return ImageManager.loadPicture(matchingFile);
      }
    }

    return null;
  };

  const loadCustomFont = (fontFile) => {
    if (!fontFile) return null;

    const fontFace = fontFile.split('.')[0];
    const fontPath = `fonts/${fontFile}`;

    const customFont = new FontFace(fontFace, `url('${fontPath}')`);
    customFont.load().then(function (loadedFont) {
      document.fonts.add(loadedFont);
    }).catch(function (error) {
      console.error('Font loading failed:', error);
    });

    return fontFace;
  };

  const parseAdditionalImages = () => {
    const images = JSON.parse(parameters['Additional Images'] || '[]');
    return images.map(imageJson => {
      const image = JSON.parse(imageJson);
      return {
        image: image.Image,
        x: image.X,
        y: image.Y,
        layer: image.Layer
      };
    });
  };

  const additionalImages = parseAdditionalImages();
  const categoryFontName = categorySettings?.Font?.File ? loadCustomFont(categorySettings.Font.File) : null;
  const helpWindowFontName = loadCustomFont(helpFontFile);

  // Check all kind of cases of file name. Can be potion or Potion or Heavy_Sword or heavy_sword
  const generateFileNameVariations = (name) => {
    if (!name || typeof name !== 'string') return [];
    const variations = [];
    variations.push(name);
    variations.push(name.toLowerCase());
    variations.push(name.replace(/\s+/g, '_'));
    variations.push(name.toLowerCase().replace(/\s+/g, '_'));
    variations.push(name);
    variations.push(name.toLowerCase());
    return [...new Set(variations)];
  };

  const findMatchingImageFile = (item) => {
    if (!item || !item.name) return null;

    const variations = generateFileNameVariations(item.name);

    for (const variation of variations) {
      const fileName = `inventory/${variation.replace(/\s+/g, '_')}`;
      const bitmap = ImageManager.loadPicture(fileName);
      if (bitmap && bitmap.isReady()) {
        return fileName;
      }
    }

    for (const variation of variations) {
      const fileName = `inventory/${variation.replace(/\s+/g, '_')}`;
      const bitmap = ImageManager.loadPicture(fileName);
      if (bitmap && bitmap._url) {
        if (!bitmap._loadListeners) bitmap._loadListeners = [];
        if (!bitmap._customLoadListenerAdded) {
          bitmap._customLoadListenerAdded = true;
          bitmap.addLoadListener(() => {
            if (SceneManager._scene &&
              SceneManager._scene._itemWindow &&
              SceneManager._scene._itemWindow._helpWindow) {
              SceneManager._scene._itemWindow.updateHelp();
            }
          });
        }
        return fileName;
      }
    }

    return null;
  };

  const _Scene_Item_terminate = Scene_Item.prototype.terminate;
  Scene_Item.prototype.terminate = function () {
    _Scene_Item_terminate.call(this);
    ImageManager.clear();
  };

  Window_Help.prototype.setCustomFont = function () {
    if (helpWindowFontName) {
      this.contents.fontFace = helpWindowFontName;
    }
  };

  Window_Help.prototype.setNameFontSettings = function () {
    if (itemNameFontSize > 0) {
      this.contents.fontSize = itemNameFontSize;
    }
    if (helpWindowFontName) {
      this.contents.fontFace = helpWindowFontName;
    }
    this.changeTextColor(itemNameColor);
  };

  Window_Help.prototype.setDescriptionFontSettings = function () {
    if (itemDescFontSize > 0) {
      this.contents.fontSize = itemDescFontSize;
    }
    if (helpWindowFontName) {
      this.contents.fontFace = helpWindowFontName;
    }
    this.changeTextColor(itemDescColor);
  };

  Window_Help.prototype.getDescriptionLineHeight = function () {
    return (itemDescFontSize > 0 ? itemDescFontSize : this.contents.fontSize) + 6;
  };

  const _Window_ItemList_initialize = Window_ItemList.prototype.initialize;
  Window_ItemList.prototype.initialize = function (rect) {
    if (isSceneItem()) {
      _Window_ItemList_initialize.call(this, rect);
      this.windowskin = ImageManager.loadSystem(parameters['Window Item List Windowskin']);
    } else { _Window_ItemList_initialize.call(this, rect); }
  };

  const _Window_Help_initialize = Window_Help.prototype.initialize;
  Window_Help.prototype.initialize = function (rect) {
    if (isSceneItem()) {
      _Window_Help_initialize.call(this, rect);
      this.windowskin = ImageManager.loadSystem(parameters['Window Help Windowskin']);
      this.contents._drawTextOutline = function () { };
      this.contents._drawTextShadow = function () { };
    } else { _Window_Help_initialize.call(this, rect); }
  };

  Window_Help.prototype.wrapText = function (text, maxWidth) {
    const isAsian = /[\u3000-\u9fff]/.test(text);
    const lines = [''];
    let currentLine = 0;

    const segments = isAsian ? [...text] : text.split(/([\s\n])/);

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (!segment) continue;

      const testLine = lines[currentLine] + segment;

      if (this.contents.measureTextWidth(testLine) <= maxWidth) {
        lines[currentLine] += segment;
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

    return lines.filter(line => line.trim().length > 0);
  };

  const _Window_ItemList_updateHelp = Window_ItemList.prototype.updateHelp;
  Window_ItemList.prototype.updateHelp = function () {
    if (isSceneItem()) {
      if (this._helpWindow) {
        const item = this.item();
        if (item) {
          this._helpWindow.contents.clear();

          const rect = this._helpWindow.baseTextRect();
          let nameY, descY;

          if (showItemImage) {
            const scale = 4;
            const iconWidth = ImageManager.iconWidth;
            const iconHeight = ImageManager.iconHeight;
            const scaledIconWidth = iconWidth * scale;
            const scaledIconHeight = iconHeight * scale;

            // Center horizontally
            const iconX = rect.x + (rect.width - scaledIconWidth) / 2;

            const customImage = getCustomItemImage(item);

            if (customImage && customImage.isReady()) {
              const aspectRatio = customImage.width / customImage.height;
              let drawWidth = scaledIconWidth;
              let drawHeight = scaledIconHeight;

              if (aspectRatio > 1) {
                drawHeight = drawWidth / aspectRatio;
              } else {
                drawWidth = drawHeight * aspectRatio;
              }

              // Center the image
              const adjustedX = rect.x + (rect.width - drawWidth) / 2;
              const adjustedY = rect.y + (scaledIconHeight - drawHeight) / 2;

              this._helpWindow.contents.context.imageSmoothingEnabled = false;
              this._helpWindow.contents.blt(
                customImage,
                0, 0,
                customImage.width, customImage.height,
                adjustedX, adjustedY,
                drawWidth, drawHeight
              );
              this._helpWindow.contents.context.imageSmoothingEnabled = true;
            } else {
              // Default icon
              const bitmap = ImageManager.loadSystem("IconSet");
              const iconIndex = item.iconIndex;
              const sx = (iconIndex % 16) * iconWidth;
              const sy = Math.floor(iconIndex / 16) * iconHeight;

              this._helpWindow.contents.context.imageSmoothingEnabled = false;
              this._helpWindow.contents.blt(
                bitmap,
                sx, sy,
                iconWidth, iconHeight,
                iconX, rect.y,
                scaledIconWidth, scaledIconHeight
              );
              this._helpWindow.contents.context.imageSmoothingEnabled = true;
            }

            nameY = rect.y + scaledIconHeight + 8;
          } else {
            nameY = rect.y;
          }

          // Item name and description
          this._helpWindow.setNameFontSettings();
          const convertedName = this._helpWindow.convertEscapeCharacters(item.name);
          this._helpWindow.drawText(convertedName, rect.x, nameY, rect.width, 'left');

          descY = nameY + this._helpWindow.lineHeight() + 8;
          this._helpWindow.setDescriptionFontSettings();
          let convertedDescription;
          if (Imported.Hendrix_Localization) {
            convertedDescription = this._helpWindow.convertEscapeCharacters(Hendrix_Localization(item.description));
          } else {
            convertedDescription = this._helpWindow.convertEscapeCharacters(item.description);
          }
          const wrappedLines = this._helpWindow.wrapText(convertedDescription, rect.width);
          let currentY = descY;

          for (const line of wrappedLines) {
            this._helpWindow.drawText(line, rect.x, currentY, rect.width, 'left');
            currentY += this._helpWindow.getDescriptionLineHeight();
          }

          this._helpWindow.resetFontSettings();
        } else {
          this._helpWindow.setText('');
        }
      }
    } else {
      _Window_ItemList_updateHelp.call(this);
    }
  };

  const _Window_Selectable_drawItemBackground = Window_Selectable.prototype.drawItemBackground;
  Window_ItemList.prototype.drawItemBackground = function (index) {
    if (isSceneItem()) {
      if (isItemBgLoaded) {
        const rect = this.itemRect(index);
        this.contents.context.imageSmoothingEnabled = true;
        this.contents.blt(
          itemBackgroundBitmap,
          0, 0,
          itemBackgroundBitmap.width, itemBackgroundBitmap.height,
          rect.x, rect.y,
          rect.width, rect.height
        );
      } else {
        _Window_Selectable_drawItemBackground.call(this, index);
      }
    } else { _Window_Selectable_drawItemBackground.call(this, index); }
  };

  const _Window_Selectable_setCursorRect = Window_Selectable.prototype.setCursorRect;
  Window_Selectable.prototype.setCursorRect = function (x, y, width, height) {
    _Window_Selectable_setCursorRect.call(this, x, y, width, height);
    if (isSceneItem() && isSelectionLoaded && selectionBitmap && this._cursorSprite) {
      const cursor = new Bitmap(width, height);
      cursor.blt(
        selectionBitmap,
        0, 0,
        selectionBitmap.width, selectionBitmap.height,
        0, 0,
        width, height
      );
      this._cursorSprite.bitmap = cursor;
      this._cursorSprite.setFrame(0, 0, width, height);
      this._cursorSprite.move(x, y);

      this._clientArea.removeChild(this._cursorSprite);
      this._clientArea.addChild(this._cursorSprite);
    }
  };

  const _Window_ItemList_maxCols = Window_ItemList.prototype.maxCols;
  Window_ItemList.prototype.maxCols = function () {
    return isSceneItem() ? maxColumns : _Window_ItemList_maxCols.call(this);
  };

  const _Window_ItemList_itemHeight = Window_ItemList.prototype.itemHeight;
  Window_ItemList.prototype.itemHeight = function () {
    return isSceneItem() ? itemBoxSize : _Window_ItemList_itemHeight.call(this);
  };

  const _Window_ItemList_itemWidth = Window_ItemList.prototype.itemWidth;
  Window_ItemList.prototype.itemWidth = function () {
    return isSceneItem() ? itemBoxSize : _Window_ItemList_itemWidth.call(this);
  };

  const _Window_ItemList_colSpacing = Window_ItemList.prototype.colSpacing;
  Window_ItemList.prototype.colSpacing = function () {
    return isSceneItem() ? itemSpacing : _Window_ItemList_colSpacing.call(this);
  };

  const _Window_ItemList_rowSpacing = Window_ItemList.prototype.rowSpacing;
  Window_ItemList.prototype.rowSpacing = function () {
    return isSceneItem() ? itemSpacing : _Window_ItemList_rowSpacing.call(this);
  };

  const _Window_ItemList_itemPadding = Window_ItemList.prototype.itemPadding;
  Window_ItemList.prototype.itemPadding = function () {
    return isSceneItem() ? 0 : _Window_ItemList_itemPadding.call(this);
  };

  const _Scene_Item_itemWindowRect = Scene_Item.prototype.itemWindowRect;
  Scene_Item.prototype.itemWindowRect = function () {
    if (isSceneItem()) {
      const width = eval(itemListSettings.Width) ||
        (itemBoxSize * maxColumns) + (itemSpacing * maxColumns);
      const height = eval(itemListSettings.Height) ||
        (itemBoxSize * itemListRow) + (itemSpacing * itemListRow);

      const helpWidth = eval(helpWindowSettings.Width) || width;
      const totalWidth = width + helpWidth;

      const x = itemListSettings.X ? eval(itemListSettings.X) :
        (Graphics.boxWidth - totalWidth) / 2;
      const y = itemListSettings.Y ? eval(itemListSettings.Y) :
        (Graphics.boxHeight - height) / 2;

      return new Rectangle(x, y, width, height);
    } else {
      return _Scene_Item_itemWindowRect.call(this);
    }
  };

  const _Scene_Item_helpWindowRect = Scene_Item.prototype.helpWindowRect;
  Scene_Item.prototype.helpWindowRect = function () {
    if (isSceneItem()) {
      const itemRect = this.itemWindowRect();
      const width = eval(helpWindowSettings.Width) || itemRect.width;
      const height = eval(helpWindowSettings.Height) || itemRect.height;
      const x = itemRect.x + itemRect.width + eval(helpWindowSettings['X Offset'] || '8');
      const y = itemRect.y + eval(helpWindowSettings['Y Offset'] || '0');

      return new Rectangle(x, y, width, height);
    } else {
      return _Scene_Item_helpWindowRect.call(this);
    }
  };

  const _Scene_Item_createItemWindow = Scene_Item.prototype.createItemWindow;
  Scene_Item.prototype.createItemWindow = function () {
    if (isSceneItem()) {
      const rect = this.itemWindowRect();
      this._itemWindow = new Window_ItemList(rect);
      this._itemWindow.setHelpWindow(this._helpWindow);
      this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
      if (showCategories) {
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this._categoryWindow.setItemWindow(this._itemWindow);
      } else {
        this._itemWindow.setHandler("cancel", this.popScene.bind(this));
        setTimeout(() => {
          this._itemWindow.refresh();
          this._itemWindow.select(0);
          this._itemWindow.updateHelp();
        }, 5);
      }
      this.addWindow(this._itemWindow);
    } else {
      _Scene_Item_createItemWindow.call(this);
    }
  };

  const _Window_ItemList_includes = Window_ItemList.prototype.includes;
  Window_ItemList.prototype.includes = function (item) {
    if (isSceneItem()) {
      if (showCategories) {
        return this._category === 'item' ? item && item.itypeId === 1 :
          this._category === 'weapon' ? DataManager.isWeapon(item) :
            this._category === 'armor' ? DataManager.isArmor(item) :
              this._category === 'keyItem' ? item && item.itypeId === 2 :
                false;
      } else {
        return item && (item.itypeId === 1 ||
          item.itypeId === 2 ||
          DataManager.isWeapon(item) ||
          DataManager.isArmor(item));
      }
    } else {
      return _Window_ItemList_includes.call(this);
    }
  };

  const _Window_ItemList_prototype_drawItem = Window_ItemList.prototype.drawItem;
  Window_ItemList.prototype.drawItem = function (index) {
    if (isSceneItem()) {
      _Window_ItemList_prototype_drawItem.call(this);
      const item = this.itemAt(index);
      if (item) {
        const rect = this.itemRect(index);

        const iconX = rect.x + (rect.width - ImageManager.iconWidth) / 2;
        const iconY = rect.y + (rect.height - ImageManager.iconHeight) / 2;
        this.drawIcon(item.iconIndex, iconX, iconY);

        if (this.needsNumber()) {
          const number = $gameParty.numItems(item);
          if (number > 1) {
            this.contents.fontSize = 16;
            const numberText = number.toString();
            const padding = 5;
            this.drawText(
              numberText,
              rect.x + padding,
              rect.y + rect.height - this.contents.fontSize - padding,
              rect.width - padding * 2,
              'left'
            );
            this.resetFontSettings();
          }
        }
      }
    } else {
      _Window_ItemList_prototype_drawItem.call(this, index);
    }
  };

  Scene_Item.prototype.createBackgroundImages = function () {
    this._backgroundImages = [];
    additionalImages.forEach(imgData => {
      if (imgData.layer === 'below' && imgData.image) {
        const sprite = new Sprite();
        sprite.bitmap = ImageManager.loadSystem(imgData.image);
        sprite.x = eval(imgData.x);
        sprite.y = eval(imgData.y);
        this.addChild(sprite);
        this._backgroundImages.push(sprite);
      }
    });
  };

  Scene_Item.prototype.createForegroundImages = function () {
    this._foregroundImages = [];
    additionalImages.forEach(imgData => {
      if (imgData.layer === 'above' && imgData.image) {
        const sprite = new Sprite();
        sprite.bitmap = ImageManager.loadSystem(imgData.image);
        sprite.x = eval(imgData.x);
        sprite.y = eval(imgData.y);
        this.addChild(sprite);
        this._foregroundImages.push(sprite);
      }
    });
  };

  const _Scene_Item_create = Scene_Item.prototype.create;
  Scene_Item.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    if (isSceneItem()) {
      this.createBackgroundImages();
      this.createWindowLayer();
      this.createHelpWindow();
      if (showCategories) {
        this.createCategoryWindow();
      }
      this.createItemWindow();
      this.createActorWindow();
      this.createButtons();
      this.createForegroundImages();
      if (showCategories) {
        this._categoryWindow.activate();
        this._itemWindow.deactivate();
      } else {
        this._itemWindow.activate();
      }
    } else {
      _Scene_Item_create.call(this);
    }
  };

  const _Window_ItemCategory_drawItem = Window_ItemCategory.prototype.drawItem;
  Window_ItemCategory.prototype.drawItem = function (index) {
    if (isSceneItem() && showCategories) {
      if (categoryFontName) {
        this.contents.fontFace = categoryFontName;
      }
      if (categorySettings?.Font?.Size) {
        this.contents.fontSize = Number(categorySettings.Font.Size);
      }
      if (categorySettings?.Font?.Color) {
        this.changeTextColor(categorySettings.Font.Color);
      }

      _Window_ItemCategory_drawItem.call(this, index);
      this.resetFontSettings();
    } else {
      _Window_ItemCategory_drawItem.call(this, index);
    }
  };

  const _Window_ItemCategory_maxCols = Window_ItemCategory.prototype.maxCols;
  Window_ItemCategory.prototype.maxCols = function () {
    if (isSceneItem() && showCategories) {
      return this._list ? this._list.length : 4;
    } else {
      return _Window_ItemCategory_maxCols.call(this);
    }
  };

  Scene_Item.prototype.createCategoryWindow = function () {
    if (isSceneItem() && showCategories) {
      const rect = this.categoryWindowRect();
      this._categoryWindow = new Window_ItemCategory(rect);
      this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
      this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
      if (categorySettings.Windowskin) {
        this._categoryWindow.windowskin = ImageManager.loadSystem(categorySettings.Windowskin);
      }
      this.addWindow(this._categoryWindow);
    } else {
      _Scene_Item_createCategoryWindow.call(this);
    }
  };

  const _Scene_Item_categoryWindowRect = Scene_Item.prototype.categoryWindowRect;
  Scene_Item.prototype.categoryWindowRect = function () {
    if (isSceneItem() && showCategories) {
      const itemRect = this.itemWindowRect();
      const width = categorySettings.Width ? eval(categorySettings.Width) : Graphics.boxWidth;
      const height = categorySettings.Height ? eval(categorySettings.Height) : this.calcWindowHeight(1, true);

      let x = Graphics.boxWidth / 2 - width / 2;
      let y = 0;

      if (categorySettings.Position === 'top') {
        y = itemRect.y - height;
      } else if (categorySettings.Position === 'bottom') {
        y = itemRect.y + itemRect.height;
      } else if (categorySettings.Position) {
        const pos = categorySettings.Position.split(',').map(coord => eval(coord.trim()));
        if (pos.length === 2) {
          [x, y] = pos;
        }
      }

      return new Rectangle(x, y, width, height);
    } else {
      return _Scene_Item_categoryWindowRect.call(this);
    }
  };

})();