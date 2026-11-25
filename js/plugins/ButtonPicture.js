//=============================================================================
// RPG Maker MZ - Button Picture (ATAN battle extension)
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 圖片按鈕：支援戰鬥等待點擊、單次觸發及原技能目標傷害 v2.0
 * @author Yoji Ojima / ATAN extension
 * @help ButtonPicture.js
 * 保持檔名 ButtonPicture.js，取代原插件，勿同時啟用兩份。
 * 保留原本圖片按鈕與滑鼠移入音效、放大。
 *
 * 戰鬥範例：技能範圍選敵方單體，傷害類型「無」，效果呼叫公共事件A。
 * A：顯示圖片 → Set Button Picture（公共事件B）→ 等待圖片點擊。
 * B：消除圖片 → 對原技能目標造成傷害。
 * A、B 的觸發方式都設「無」。不要用迴圈等待。
 * 點擊後先執行B，B結束才繼續A的後續指令。
 * 等待時標準戰鬥流程暫停；不是敵人仍可攻擊的即時QTE系統。
 * 第三方戰鬥插件若改寫公共事件/戰鬥更新流程，需另外實機測試。
 *
 * 等待只接收指定圖片；等待中的圖片強制單次觸發。
 * 超時或圖片被刪除時不呼叫B，結果開關保持OFF。
 * 超時後按鈕停用；可在A後續處理失敗與消除圖片。
 * 傷害指令為固定HP傷害，不計算防禦、屬性、命中、暴擊或原技能公式。
 * 目標來自最近一次開始的戰鬥行動；技能全體目標會各受傷一次。
 * 地圖上不可使用目標傷害指令。舊存檔不需初始化。
 *
 * @command set
 * @text Set Button Picture
 * @desc 設定圖片點擊呼叫的公共事件（相容原指令）。
 * @arg pictureId
 * @text Picture Number
 * @type number
 * @min 1
 * @default 1
 * @arg commonEventId
 * @text Common Event
 * @type common_event
 * @default 1
 * @arg once
 * @text 僅觸發一次
 * @type boolean
 * @default false
 *
 * @command waitClick
 * @text 等待圖片點擊
 * @desc 必須先顯示圖片及設定按鈕。點擊後先執行按鈕公共事件，再繼續本事件。
 * @arg pictureId
 * @text 圖片編號
 * @type number
 * @min 1
 * @default 1
 * @arg timeout
 * @text 等待上限（幀，0為無限）
 * @type number
 * @min 0
 * @default 600
 * @arg resultSwitch
 * @text 點擊成功開關（0為不用）
 * @type switch
 * @default 0
 *
 * @command damageTargets
 * @text 對原技能目標造成傷害
 * @desc 對記住的敵方目標造成固定HP傷害；不套用原技能公式。
 * @arg amount
 * @text 傷害量
 * @type number
 * @min 0
 * @default 100
 */
(() => {
    'use strict';
    const pluginName = 'ButtonPicture';
    const state = () => {
        if (!$gameTemp._atanButtonPicture) {
            $gameTemp._atanButtonPicture = { targets: [], waiter: null };
        }
        return $gameTemp._atanButtonPicture;
    };
    PluginManager.registerCommand(pluginName, 'set', args => {
        const picture = $gameScreen.picture(Number(args.pictureId));
        if (picture) {
            picture.mzkp_commonEventId = Number(args.commonEventId);
            picture._atanButtonOnce = args.once === 'true';
        }
    });
    PluginManager.registerCommand(pluginName, 'waitClick', function(args) {
        const pictureId = Number(args.pictureId);
        const resultSwitch = Number(args.resultSwitch) || 0;
        if (resultSwitch) $gameSwitches.setValue(resultSwitch, false);
        const picture = $gameScreen.picture(pictureId);
        if (!picture || !$dataCommonEvents[picture.mzkp_commonEventId]) {
            console.warn('ButtonPicture: 等待前請先顯示圖片並設定有效公共事件。');
            return;
        }
        if (state().waiter) {
            console.warn('ButtonPicture: 已有另一個事件正在等待圖片。');
            return;
        }
        this._atanPictureWait = {
            pictureId, picture, resultSwitch,
            remaining: Math.max(0, Number(args.timeout) || 0),
            clickedEvent: 0
        };
        state().waiter = this;
        this.setWaitMode('atanPictureClick');
    });
    const updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode !== 'atanPictureClick') {
            return updateWaitMode.apply(this, arguments);
        }
        const wait = this._atanPictureWait;
        if (!wait) { this._waitMode = ''; return false; }
        const picture = $gameScreen.picture(wait.pictureId);
        const clicked = wait.clickedEvent > 0;
        const expired = wait.remaining > 0 && --wait.remaining === 0;
        if (!clicked && picture === wait.picture && !expired) return true;
        if (picture === wait.picture) picture.mzkp_commonEventId = 0;
        if (state().waiter === this) state().waiter = null;
        this._atanPictureWait = null;
        this._waitMode = '';
        if (clicked) {
            if (wait.resultSwitch) $gameSwitches.setValue(wait.resultSwitch, true);
            const event = $dataCommonEvents[wait.clickedEvent];
            if (event) {
                this.setupChild(event.list, this._eventId);
                // Yield one update so the child runs before the parent's next command.
                return true;
            }
        }
        return false;
    };
    Sprite_Picture.prototype.isClickEnabled = function() {
        const picture = this.picture();
        if (!picture || !picture.mzkp_commonEventId || $gameMessage.isBusy()) return false;
        const waiter = state().waiter;
        return !waiter || (waiter._atanPictureWait &&
            waiter._atanPictureWait.picture === picture &&
            !waiter._atanPictureWait.clickedEvent);
    };
    Sprite_Picture.prototype.onClick = function() {
        if (!this.isClickEnabled()) return;
        const picture = this.picture();
        const eventId = picture.mzkp_commonEventId;
        if (!$dataCommonEvents[eventId]) return;
        const waiter = state().waiter;
        if (waiter && waiter._atanPictureWait.picture === picture) {
            waiter._atanPictureWait.clickedEvent = eventId;
            picture.mzkp_commonEventId = 0;
        } else {
            if (picture._atanButtonOnce) picture.mzkp_commonEventId = 0;
            $gameTemp.reserveCommonEvent(eventId);
        }
    };
    Sprite_Picture.prototype.onMouseEnter = function() {
        if (this.isClickEnabled()) {
            AudioManager.playSe({ name: '000_VIC_Select_Lab', pan: 0, pitch: 100, volume: 60 });
        }
    };
    const updateScale = Sprite_Picture.prototype.updateScale;
    Sprite_Picture.prototype.updateScale = function() {
        updateScale.call(this);
        if (this._hovered && this.isClickEnabled()) {
            this.scale.x *= 1.08;
            this.scale.y *= 1.08;
        }
    };
    Spriteset_Base.prototype.mzkp_isAnyPicturePressed = function() {
        return this._pictureContainer.children.some(sprite =>
            sprite.isClickEnabled && sprite.isClickEnabled() && sprite.isPressed());
    };
    const isAnyButtonPressed = Scene_Map.prototype.isAnyButtonPressed;
    Scene_Map.prototype.isAnyButtonPressed = function() {
        return isAnyButtonPressed.apply(this, arguments) ||
            !!(this._spriteset && this._spriteset.mzkp_isAnyPicturePressed());
    };
    const startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        startAction.apply(this, arguments);
        state().targets = Array.from(new Set(this._targets || []));
    };
    const setup = BattleManager.setup;
    BattleManager.setup = function() {
        $gameTemp._atanButtonPicture = null;
        return setup.apply(this, arguments);
    };
    const endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function() {
        $gameTemp._atanButtonPicture = null;
        return endBattle.apply(this, arguments);
    };
    PluginManager.registerCommand(pluginName, 'damageTargets', args => {
        if (!$gameParty.inBattle()) return;
        const amount = Math.max(0, Math.floor(Number(args.amount) || 0));
        for (const target of state().targets) {
            if (!target.isEnemy() || !target.isAlive()) continue;
            target.clearResult();
            target.gainHp(-amount);
            target.startDamagePopup();
            if (amount > 0) target.performDamage();
            if (target.isDead()) target.performCollapse();
        }
    });
})();
