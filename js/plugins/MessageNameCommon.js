/*=============================================================================
 MessageNameCommon.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.3.1 2024/05/04 ゲームスタート直後にメッセージウィンドウを一度も表示せずに
                  選択肢の表示を使用した場合にエラーが発生する不具合の修正
 1.3.0 2024/04/06 名前欄に制御文字\v[n]などが含まれていた場合は、変換後の値で一致するコモンイベントの呼び出しを行うよう修正
 1.2.0 2024/02/15 タイミングにメッセージ終了待機時を追加
 1.1.0 2024/02/14 メッセージ終了時にもコモンイベントを呼べるよう修正
 1.0.0 2023/09/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc メッセージ名前コモンプラグイン (開關23為OFF時才生效)
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageNameCommon.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン (Customized)
 *
 * @param commonList
 * @text コモンイベントリスト
 * @desc 名前指定で呼び出すコモンイベントのリストです。
 * @default []
 * @type struct<COMMON>[]
 *
 * @help MessageNameCommon.js
 *
 * メッセージの表示で名前を指定したときに自動でコモンイベントを呼び出します。
 * 名前とコモンイベントのIDをプラグインパラメータから指定してください。
 * このイベント呼び出しは、マップ画面でのみ有効です。
 *
 * 【客製化修改】當 RMMZ 開關第 23 號為 OFF 時，此插件才會生效。
 *
 * 名前欄に制御文字\v[n]などが含まれていた場合は、変換後の値で
 * 一致するコモンイベントの呼び出しを行います。
 * 
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 * 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 * についても制限はありません。
 * このプラグインはもうあなたのものです。
 */

/*~struct~COMMON:
 * @param commonEventId
 * @text コモンイベントID
 * @desc 呼び出すコモンイベントのIDです。
 * @default 1
 * @type common_event
 *
 * @param SpeakerName
 * @text 名前
 * @desc 文章の表示の「名前」が指定値と一致するときにコモンイベントを呼び出します。（正規表現が使えます）
 * @default
 * @type string
 *
 * @param timing
 * @text メッセージタイミング
 * @desc コモンイベントの呼び出しタイミングを選択します。
 * @default start
 * @type select
 * @option 開始時
 * @value start
 * @option 終了待機時
 * @value waiting
 * @option 終了時
 * @value end
 * @option 終了時(継続メッセージがない場合のみ)
 * @value all_end
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.apply(this, arguments);
        if ($gameParty.inBattle()) {
            return;
        }
        this.callSpeakerCommon('start');
    };

    const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        _Window_Message_terminateMessage.apply(this, arguments);
        if ($gameParty.inBattle()) {
            return;
        }
        this.callSpeakerCommon('end');
    };

    const _Window_Message_checkToNotClose = Window_Message.prototype.checkToNotClose;
    Window_Message.prototype.checkToNotClose = function() {
        _Window_Message_checkToNotClose.apply(this, arguments);
        if ($gameParty.inBattle()) {
            return;
        }
        if (this.isOpen() && this.isClosing() && !this.doesContinue()) {
            this.callSpeakerCommon('all_end');
        }
    };

    const _Window_Message_onEndOfText = Window_Message.prototype.onEndOfText;
    Window_Message.prototype.onEndOfText = function() {
        _Window_Message_onEndOfText.apply(this, arguments);
        if ($gameParty.inBattle()) {
            return;
        }
        this.callSpeakerCommon('waiting');
    };

    Window_Message.prototype.callSpeakerCommon = function(timing) {
        // 核心修改：如果 23 號開關為 ON (true)，則直接 return 不執行後續的公共事件呼叫
        if ($gameSwitches.value(23)) {
            return;
        }

        // 1. 抓取並轉換對話框顯示的「當前說話者名字」
        let speakerName = $gameMessage.getLastSpeakerName() || '';
        const vMatch = speakerName.match(/\\*[vV]\[(\d+)\]/);
        if (vMatch) {
            const varId = parseInt(vMatch[1], 10);
            speakerName = speakerName.replace(/\\*[vV]\[\d+\]/, $gameVariables.value(varId));
        }
        const nMatch = speakerName.match(/\\*[nN]\[(\d+)\]/);
        if (nMatch) {
            const actorId = parseInt(nMatch[1], 10);
            const actorName = $gameActors.actor(actorId) ? $gameActors.actor(actorId).name() : '';
            speakerName = speakerName.replace(/\\*[nN]\[\d+\]/, actorName);
        }

        // 2. 進行公共事件比對與呼叫
        const commonEvents = param.commonList.filter(common => {
            if (!common.SpeakerName) return false;
            
            // 【核心修正】把外掛參數裡填寫的名稱（例如 \V[108]）也拿出來轉換成實際的玩家名字
            let targetParamName = common.SpeakerName;
            const paramVMatch = targetParamName.match(/\\*[vV]\[(\d+)\]/);
            if (paramVMatch) {
                const varId = parseInt(paramVMatch[1], 10);
                targetParamName = targetParamName.replace(/\\*[vV]\[\d+\]/, $gameVariables.value(varId));
            }
            const paramNMatch = targetParamName.match(/\\*[nN]\[(\d+)\]/);
            if (paramNMatch) {
                const actorId = parseInt(paramNMatch[1], 10);
                const actorName = $gameActors.actor(actorId) ? $gameActors.actor(actorId).name() : '';
                targetParamName = targetParamName.replace(/\\*[nN]\[\d+\]/, actorName);
            }
            
            try {
                // 用轉換後的玩家名字進行精準比對
                return speakerName.match(new RegExp(targetParamName)) && timing === (common.timing || 'start');
            } catch (e) {
                return false;
            }
        });
        
        commonEvents.forEach(common => {
            $gameMap.setupDynamicCommon(common.commonEventId);
        });
    };

    const _Game_Message_setSpeakerName = Game_Message.prototype.setSpeakerName;
    Game_Message.prototype.setSpeakerName = function(speakerName) {
        _Game_Message_setSpeakerName.apply(this, arguments);
        this._lastSpakerName = speakerName;
    };

    Game_Message.prototype.getLastSpeakerName = function() {
        return this._lastSpakerName || '';
    };
})();