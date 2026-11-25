//=============================================================================
// MonakaEasing.js
//=============================================================================
// Copyright (c) 2024- 牛乳もなか
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//
// X
// https://x.com/milkmonaka_1
//----------------------------------------------------------------------------
// Version
// 1.2.0 2026/05/20 プラグインコマンドでウインドウのスライド方向等を一時上書きする機能を追加。
// 1.1.0 2025/04/17 若干の構造変更、一部のウインドウで動作していない不具合を修正。
// 1.0.2 2024/03/21 ピクチャの透明度が0などからアニメーション開始した場合、透明度が正常に更新されない不具合を修正。
// 1.0.1 2024/03/20 一部の動作が行われないウインドウがあった不具合を修正。
// 1.0.0 2024/03/19 初版公開
//----------------------------------------------------------------------------
/*:
* @target MZ
* @url https://x.com/milkmonaka_1
* @plugindesc v1.2.0 Easily set easing for pictures and windows.
* @author milkmonaka
* @help
* How to Use
*
* Pictures:
* Use the plugin command to select an easing function before moving a picture.
* The selected easing will be applied to picture movement until you explicitly
* reset it.
* Run ResetEasingFunction when you are done.
*
* Windows:
* Set a window class, slide direction, speed, and easing function in the
* parameters.
* This plugin may conflict with other plugins that also animate windows.
* Custom windows that inherit from Window_Base may work if you enter their
* class name, such as Window_XXXXX, but this is not guaranteed.
*
* ■ License
*  MIT License
*
* @command SetEasingFunction
* @text Set Easing Function
* @desc Sets the easing function used for picture movement.
*
* @arg easingFunction
* @text Easing Function
* @desc Select the easing function to use.
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
* @command ResetEasingFunction
* @text Reset Easing Function
* @desc Clears the easing function used for picture movement.
*
* @command OverrideWindowSlide
* @text Override Window Slide
* @desc Temporarily overrides the next slide direction, speed, and easing for the specified window.
*
* @arg WindowClass
* @text Target Window
* @desc Window class name to override, such as Window_Message.
* @type select
* @default Window_Message
* @option Help Window
* @value Window_Help
* @option Gold Window
* @value Window_Gold
* @option Menu Command Window
* @value Window_MenuCommand
* @option Menu Status Window
* @value Window_MenuStatus
* @option Item Category Window
* @value Window_ItemCategory
* @option Item List Window
* @value Window_ItemList
* @option Actor Selection Window
* @value Window_MenuActor
* @option Skill Type Window
* @value Window_SkillType
* @option Skill Status Window
* @value Window_SkillStatus
* @option Skill List Window
* @value Window_SkillList
* @option Equip Status Window
* @value Window_EquipStatus
* @option Equip Command Window
* @value Window_EquipCommand
* @option Equip Slot Window
* @value Window_EquipSlot
* @option Equip Item Window
* @value Window_EquipItem
* @option Status Window
* @value Window_Status
* @option Options Window
* @value Window_Options
* @option Savefile List Window
* @value Window_SavefileList
* @option Shop Command Window
* @value Window_ShopCommand
* @option Shop Buy Window
* @value Window_ShopBuy
* @option Shop Sell Window
* @value Window_ShopSell
* @option Shop Number Window
* @value Window_ShopNumber
* @option Shop Status Window
* @value Window_ShopStatus
* @option Name Edit Window
* @value Window_NameEdit
* @option Name Input Window
* @value Window_NameInput
* @option Choice List Window
* @value Window_ChoiceList
* @option Number Input Window
* @value Window_NumberInput
* @option Event Item Window
* @value Window_EventItem
* @option Message Window
* @value Window_Message
* @option Name Box Window
* @value Window_NameBox
* @option Map Name Window
* @value Window_MapName
* @option Title Command Window
* @value Window_TitleCommand
* @option Game End Window
* @value Window_GameEnd
*
* @arg Direction
* @text Direction
* @desc Slide direction to override.
* @type select
* @option Up
* @value up
* @option Down
* @value down
* @option Left
* @value left
* @option Right
* @value right
* @default left
*
* @arg MoveSpeed
* @text Move Speed (Optional)
* @desc Override movement speed in milliseconds. Set to 0 or leave blank to use the plugin parameter.
* @type number
* @default 0
*
* @arg WindowEasing
* @text Easing Function
* @desc Override easing function. Leave blank to use the plugin parameter.
* @type select
* @default
* @option (Use Default)
* @value
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
*
* @arg Persistent
* @text Persistent
* @desc If true, the override is applied every time until cleared. If false, it is used once.
* @type boolean
* @default false
*
* @command ClearWindowSlideOverride
* @text Clear Window Slide Override
* @desc Clears the window slide override. Leave the target blank to clear all overrides.
*
* @arg WindowClass
* @text Target Window
* @desc Window class name to clear. Leave blank to clear all overrides.
* @type string
* @default
*
* @param Window Settings
* @text Window Settings
* @desc Movement settings for each window.
* @type struct<WindowAnimation>[]
* @default []
*/

/*~struct~WindowAnimation:
* @param WindowClass
* @text Window Class
* @desc Window class to slide. Enter the class name directly if it is not listed.
* @type select
* @default
* @option Help Window
* @value Window_Help
* @option Gold Window
* @value Window_Gold
* @option Menu Command Window
* @value Window_MenuCommand
* @option Menu Status Window
* @value Window_MenuStatus
* @option Item Category Window
* @value Window_ItemCategory
* @option Item List Window
* @value Window_ItemList
* @option Actor Selection Window
* @value Window_MenuActor
* @option Skill Type Window
* @value Window_SkillType
* @option Skill Status Window
* @value Window_SkillStatus
* @option Skill List Window
* @value Window_SkillList
* @option Equip Status Window
* @value Window_EquipStatus
* @option Equip Command Window
* @value Window_EquipCommand
* @option Equip Slot Window
* @value Window_EquipSlot
* @option Equip Item Window
* @value Window_EquipItem
* @option Status Window
* @value Window_Status
* @option Status Params Window
* @value Window_StatusParams
* @option Status Equip Window
* @value Window_StatusEquip
* @option Options Window
* @value Window_Options
* @option Savefile List Window
* @value Window_SavefileList
* @option Shop Command Window
* @value Window_ShopCommand
* @option Shop Buy Window
* @value Window_ShopBuy
* @option Shop Sell Window
* @value Window_ShopSell
* @option Shop Number Window
* @value Window_ShopNumber
* @option Shop Status Window
* @value Window_ShopStatus
* @option Name Edit Window
* @value Window_NameEdit
* @option Name Input Window
* @value Window_NameInput
* @option Choice List Window
* @value Window_ChoiceList
* @option Number Input Window
* @value Window_NumberInput
* @option Event Item Window
* @value Window_EventItem
* @option Message Window
* @value Window_Message
* @option Name Box Window
* @value Window_NameBox
* @option Map Name Window
* @value Window_MapName
* @option Title Command Window
* @value Window_TitleCommand
* @option Game End Window
* @value Window_GameEnd
*
* @param Move Speed
* @text Move Speed
* @desc Window movement speed in milliseconds. The default is 500 ms.
* @type number
* @default 500
*
* @param Direction
* @text Direction
* @desc Direction the window slides in from.
* @type select
* @option Up
* @value up
* @option Down
* @value down
* @option Left
* @value left
* @option Right
* @value right
* @default up
*
* @param WindowEasing
* @text Easing Function
* @desc Select the easing function to use.
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
* @plugindesc v1.2.0 ピクチャやウインドウに簡単にイージングを設定します。
* @author milkmonaka
* @help
* 【使い方】
*
* ピクチャ:
* ピクチャの移動の前にプラグインコマンドでイージング関数を指定します。
* 明示的にイージング解除を実行しない限り以降の全てのピクチャの移動に適応されます。
* 終了時にはResetEasingFunctionを実行してください。
*
* ウインドウ:
* イージングを実装したいウインドウに方向やイージング関数を設定します。
* 他のイージング系プラグインと併用する場合は競合するとは思います。
* Window_Baseを継承していれば独自に作成したウインドウも、
* Window_XXXXX(XXXXXはウインドウクラス名)と入力すれば使用できる可能性がありますが、
* 保証はできません。
*
* ■ ライセンス
*  MIT License
*
* @command SetEasingFunction
* @text イージング関数の設定
* @desc ピクチャの移動に使用するイージング関数を設定します。
*
* @arg easingFunction
* @text イージング関数
* @desc 使用するイージング関数を選択します。
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
* @command ResetEasingFunction
* @text イージングを解除
* @desc ピクチャの移動に使用するイージングを解除します。
*
* @command OverrideWindowSlide
* @text ウインドウスライドの一時上書き
* @desc 指定したウインドウの次回スライド方向(任意で速度・イージング)を一時的に上書きします。次回1回だけ有効です。
*
* @arg WindowClass
* @text 対象ウインドウ
* @desc 上書き対象のウィンドウクラス名(例: Window_Message)。
* @type select
* @default Window_Message
* @option ヘルプウィンドウ
* @value Window_Help
* @option 所持金ウィンドウ
* @value Window_Gold
* @option メニューコマンドウィンドウ
* @value Window_MenuCommand
* @option メニューステータスウィンドウ
* @value Window_MenuStatus
* @option アイテムカテゴリウィンドウ
* @value Window_ItemCategory
* @option アイテムリストウィンドウ
* @value Window_ItemList
* @option アクター選択ウィンドウ
* @value Window_MenuActor
* @option スキルタイプウィンドウ
* @value Window_SkillType
* @option スキルステータスウィンドウ
* @value Window_SkillStatus
* @option スキルリストウィンドウ
* @value Window_SkillList
* @option 装備ステータスウィンドウ
* @value Window_EquipStatus
* @option 装備コマンドウィンドウ
* @value Window_EquipCommand
* @option 装備スロットウィンドウ
* @value Window_EquipSlot
* @option 装備リストウィンドウ
* @value Window_EquipItem
* @option ステータスウィンドウ
* @value Window_Status
* @option オプションウィンドウ
* @value Window_Options
* @option セーブファイルウィンドウ
* @value Window_SavefileList
* @option ショップコマンドウィンドウ
* @value Window_ShopCommand
* @option 購入アイテムウィンドウ
* @value Window_ShopBuy
* @option 売却アイテムウィンドウ
* @value Window_ShopSell
* @option 購入数入力ウィンドウ
* @value Window_ShopNumber
* @option ショップステータスウィンドウ
* @value Window_ShopStatus
* @option 名前編集ウィンドウ
* @value Window_NameEdit
* @option 名前入力ウィンドウ
* @value Window_NameInput
* @option 選択肢ウィンドウ
* @value Window_ChoiceList
* @option 数値入力ウィンドウ
* @value Window_NumberInput
* @option アイテム選択ウィンドウ
* @value Window_EventItem
* @option メッセージウィンドウ
* @value Window_Message
* @option ネームボックスウィンドウ
* @value Window_NameBox
* @option マップ名ウィンドウ
* @value Window_MapName
* @option タイトルウィンドウ
* @value Window_TitleCommand
* @option ゲーム終了ウィンドウ
* @value Window_GameEnd
*
* @arg Direction
* @text 移動方向
* @desc 上書きする移動方向。
* @type select
* @option 上
* @value up
* @option 下
* @value down
* @option 左
* @value left
* @option 右
* @value right
* @default left
*
* @arg MoveSpeed
* @text 移動速度(任意)
* @desc 上書きする移動速度(ミリ秒)。0または空欄でプラグインパラメータの値を使用。
* @type number
* @default 0
*
* @arg WindowEasing
* @text イージング関数
* @desc 上書きするイージング関数。空欄でプラグインパラメータの値を使用。
* @type select
* @default
* @option (デフォルトを使用)
* @value
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
*
* @arg Persistent
* @text 継続適用
* @desc trueにすると、解除されるまで毎回上書きを適用します。falseは次回1回のみ。
* @type boolean
* @default false
*
* @command ClearWindowSlideOverride
* @text ウインドウスライド上書きの解除
* @desc 指定したウインドウのスライド上書きを解除します。対象を空欄にすると全て解除します。
*
* @arg WindowClass
* @text 対象ウインドウ
* @desc 解除対象のウィンドウクラス名。空欄ですべての上書きを解除。
* @type string
* @default
*
* @param Window Settings
* @text ウインドウ設定
* @desc 各ウインドウの動きの設定
* @type struct<WindowAnimation>[]
* @default []
*/

/*~struct~WindowAnimation:ja
* @param WindowClass
* @desc スライドを実行するウィンドウ。一覧にない場合は直接入力。
* @type select
* @default
* @option ヘルプウィンドウ
* @value Window_Help
* @option 所持金ウィンドウ
* @value Window_Gold
* @option メニューコマンドウィンドウ
* @value Window_MenuCommand
* @option メニューステータスウィンドウ
* @value Window_MenuStatus
* @option アイテムカテゴリウィンドウ
* @value Window_ItemCategory
* @option アイテムリストウィンドウ
* @value Window_ItemList
* @option アクター選択ウィンドウ
* @value Window_MenuActor
* @option スキルタイプウィンドウ
* @value Window_SkillType
* @option スキルステータスウィンドウ
* @value Window_SkillStatus
* @option スキルリストウィンドウ
* @value Window_SkillList
* @option 装備ステータスウィンドウ
* @value Window_EquipStatus
* @option 装備コマンドウィンドウ
* @value Window_EquipCommand
* @option 装備スロットウィンドウ
* @value Window_EquipSlot
* @option 装備リストウィンドウ
* @value Window_EquipItem
* @option ステータスウィンドウ
* @value Window_Status
* @option ステータス能力値ウィンドウ
* @value Window_StatusParams
* @option ステータス装備ウィンドウ
* @value Window_StatusEquip
* @option オプションウィンドウ
* @value Window_Options
* @option セーブファイルウィンドウ
* @value Window_SavefileList
* @option ショップコマンドウィンドウ
* @value Window_ShopCommand
* @option 購入アイテムウィンドウ
* @value Window_ShopBuy
* @option 売却アイテムウィンドウ
* @value Window_ShopSell
* @option 購入数入力ウィンドウ
* @value Window_ShopNumber
* @option ショップステータスウィンドウ
* @value Window_ShopStatus
* @option 名前編集ウィンドウ
* @value Window_NameEdit
* @option 名前入力ウィンドウ
* @value Window_NameInput
* @option 選択肢ウィンドウ
* @value Window_ChoiceList
* @option 数値入力ウィンドウ
* @value Window_NumberInput
* @option アイテム選択ウィンドウ
* @value Window_EventItem
* @option メッセージウィンドウ
* @value Window_Message
* @option ネームボックスウィンドウ
* @value Window_NameBox
* @option マップ名ウィンドウ
* @value Window_MapName
* @option タイトルウィンドウ
* @value Window_TitleCommand
* @option ゲーム終了ウィンドウ
* @value Window_GameEnd
*
* @param Move Speed
* @text 移動速度
* @desc ウインドウが移動する速度(ミリ秒:デフォルト値の場合0.5秒)
* @type number
* @default 500
*
* @param Direction
* @text 移動方向
* @desc ウインドウが開く時の移動方向
* @type select
* @option 上
* @value up
* @option 下
* @value down
* @option 左
* @value left
* @option 右
* @value right
* @default up
*
* @param WindowEasing
* @text イージング関数
* @desc 使用するイージング関数を選択します。
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

	let windowSettings = [];
	try {
		windowSettings = JSON.parse(parameters['Window Settings'] || '[]').map(e => JSON.parse(e));
	} catch (e) {
		console.error('Failed to parse Window Settings:', e);
	}

	// プラグインコマンド
	PluginManager.registerCommand(pluginName, "SetEasingFunction", function (args) {
	    const easingFunction = args.easingFunction;
	    if (MM.monakaEasing[easingFunction]) {
	        $gameTemp.selectedEasingFunction = easingFunction;
	    } else {
	        console.warn(`Invalid easing function: ${easingFunction}`);
	        $gameTemp.selectedEasingFunction = null;
	    }
	});

	PluginManager.registerCommand(pluginName, "ResetEasingFunction", args => {
	   $gameTemp.selectedEasingFunction = null;
	});

	PluginManager.registerCommand(pluginName, "OverrideWindowSlide", function (args) {
		const windowClass = String(args.WindowClass || '').trim();
		if (!windowClass) {
			console.warn('OverrideWindowSlide: WindowClass is empty.');
			return;
		}
		$gameTemp._monakaSlideOverrides = $gameTemp._monakaSlideOverrides || {};
		const speed = Number(args.MoveSpeed || 0);
		const easing = String(args.WindowEasing || '').trim();
		$gameTemp._monakaSlideOverrides[windowClass] = {
			direction: String(args.Direction || '').trim() || null,
			moveSpeed: speed > 0 ? speed : null,
			easing: easing || null,
			persistent: String(args.Persistent) === 'true'
		};
	});

	PluginManager.registerCommand(pluginName, "ClearWindowSlideOverride", function (args) {
		const windowClass = String(args.WindowClass || '').trim();
		if (!$gameTemp._monakaSlideOverrides) return;
		if (!windowClass) {
			$gameTemp._monakaSlideOverrides = {};
		} else {
			delete $gameTemp._monakaSlideOverrides[windowClass];
		}
	});

	window.MM = window.MM || {};

	// イージング関数
	MM.monakaEasing = {
		linear: function(t) {
			return t;
		},
		easeInSine: function(t) {
			return 1 - Math.cos((t * Math.PI) / 2);
		},
		easeOutSine: function(t) {
			return Math.sin((t * Math.PI) / 2);
		},
		easeInOutSine: function(t) {
			return -(Math.cos(Math.PI * t) - 1) / 2;
		},
		easeInQuad: function(t) {
			return t * t;
		},
		easeOutQuad: function(t) {
			return t * (2 - t);
		},
		easeInOutQuad: function(t) {
			return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
		},
		easeInCubic: function(t) {
			return t * t * t;
		},
		easeOutCubic: function(t) {
			return (--t) * t * t + 1;
		},
		easeInOutCubic: function(t) {
			return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
		},
		easeInQuart: function(t) {
			return t * t * t * t;
		},
		easeOutQuart: function(t) {
			return 1 - (--t) * t * t * t;
		},
		easeInOutQuart: function(t) {
			if (t < 0.5) {
				return 8 * t * t * t * t;
			} else {
				return 1 - 8 * (--t) * t * t * t;
			}
		},
		easeInQuint: function(t) {
			return t * t * t * t * t;
		},
		easeOutQuint: function(t) {
			return 1 + (--t) * t * t * t * t;
		},
		easeInOutQuint: function(t) {
			return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
		},
		easeInBack: function(t) {
			const c1 = 1.70158;
			const c3 = c1 + 1;
			return c3 * t * t * t - c1 * t * t;
		},
		easeOutBack: function(t) {
			const c1 = 1.90158;
			const c3 = c1 + 1;
			return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
		},
		easeOutBack2: function(t) { // 個人的な好みの値なので用途は少ないと思う
			const c1 = 1.00158;
			const c3 = c1 + 1;
			return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
		},
		easeInOutBack: function(t) {
			const c1 = 1.70158;
			const c2 = c1 * 1.525;
			return t < 0.5
			? 0.5 * ((2 * t) ** 2 * ((c2 + 1) * 2 * t - c2))
			: 0.5 * ((2 * t - 2) ** 2 * ((c2 + 1) * (t * 2 - 2) + c2) + 2);
		},
		easeInElastic: function(t) {
			const c4 = (2 * Math.PI) / 3;

			return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
		},
		easeOutElastic: function(t) {
			const c4 = (2 * Math.PI) / 3;
			return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
		},
		easeInOutElastic: function(t) {
			const c5 = (2 * Math.PI) / 4.5;
			return t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2 : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
		},
		bounceIn: function(t) {
			return 1 - MM.monakaEasing.bounceOut(1 - t);
		},
		bounceOut: function(t) {
			const n1 = 7.5625;
			const d1 = 2.75;

			if (t < 1 / d1) {
				return n1 * t * t;
			} else if (t < 2 / d1) {
				return n1 * (t -= 1.5 / d1) * t + 0.75;
			} else if (t < 2.5 / d1) {
				return n1 * (t -= 2.25 / d1) * t + 0.9375;
			} else {
				return n1 * (t -= 2.625 / d1) * t + 0.984375;
			}
		},
		bounceInOut: function(t) {
			if (t < 0.5) {
				return (1 - MM.monakaEasing.bounceOut(1 - 2 * t)) / 2;
			} else {
				return (1 + MM.monakaEasing.bounceOut(2 * t - 1)) / 2;
			}
		}
	};

	const _Game_Picture_move = Game_Picture.prototype.move;
	Game_Picture.prototype.move = function(
		origin, x, y, scaleX, scaleY, opacity, blendMode, duration, easingType
	) {
		_Game_Picture_move.apply(this, arguments);

		const selectedEasing = $gameTemp.selectedEasingFunction;
		const useMonakaEasing = selectedEasing && MM.monakaEasing[selectedEasing] && duration > 0;
		this._monakaEasingActive = !!useMonakaEasing;

		if (useMonakaEasing) {
			this._monakaEasingName = selectedEasing;
			this._monakaCurrentFrame = 0;
			this._monakaMoveDuration = duration;
			this._monakaStartX = this._x;
			this._monakaStartY = this._y;
			this._monakaStartScaleX = this._scaleX;
			this._monakaStartScaleY = this._scaleY;
			this._monakaStartOpacity = this._opacity;
			this._monakaDistanceX = this._targetX - this._monakaStartX;
			this._monakaDistanceY = this._targetY - this._monakaStartY;
			this._monakaDistanceScaleX = this._targetScaleX - this._monakaStartScaleX;
			this._monakaDistanceScaleY = this._targetScaleY - this._monakaStartScaleY;
			this._monakaDistanceOpacity = this._targetOpacity - this._monakaStartOpacity;
		}
	};

	const _Game_Picture_updateMove = Game_Picture.prototype.updateMove;
	Game_Picture.prototype.updateMove = function() {

		if (this._monakaEasingActive) {

			if (this._monakaCurrentFrame >= this._monakaMoveDuration) {
				this._monakaEasingActive = false;
				this._duration = 0;
				return;
			}

			this._monakaCurrentFrame++;

			const progress = Math.min(this._monakaCurrentFrame / this._monakaMoveDuration, 1);
			const easingFunction = MM.monakaEasing[this._monakaEasingName] || MM.monakaEasing.linear;
			const easing = easingFunction(progress);
			this._x = this._monakaStartX + this._monakaDistanceX * easing;
			this._y = this._monakaStartY + this._monakaDistanceY * easing;
			this._scaleX = this._monakaStartScaleX + this._monakaDistanceScaleX * easing;
			this._scaleY = this._monakaStartScaleY + this._monakaDistanceScaleY * easing;
			this._opacity = this._monakaStartOpacity + this._monakaDistanceOpacity * easing;
			this._duration = Math.max(this._monakaMoveDuration - this._monakaCurrentFrame, 0);

			if (this._monakaCurrentFrame >= this._monakaMoveDuration) {
				this._x = this._targetX;
				this._y = this._targetY;
				this._scaleX = this._targetScaleX;
				this._scaleY = this._targetScaleY;
				this._opacity = this._targetOpacity;
				this._monakaEasingActive = false;
				this._duration = 0;
			}
		} else {
			_Game_Picture_updateMove.apply(this, arguments);
		}
	};

	const _Window_Base_initialize = Window_Base.prototype.initialize;
	Window_Base.prototype.initialize = function(rect) {
		_Window_Base_initialize.apply(this, arguments);
		this.applyWindowSettings();
	};

	// ウインドウのセッティングを見つけてイージングを開始
	Window_Base.prototype.applyWindowSettings = function() {
	    const setting = windowSettings.find(e => e['WindowClass'] === this.constructor.name);

	    if (setting) {
	        let moveSpeed = Number(setting['Move Speed'] || 10);
	        let direction = setting['Direction'] || 'up';
	        let easingName = setting['WindowEasing'];

	        const overrides = $gameTemp && $gameTemp._monakaSlideOverrides;
	        const override = overrides ? overrides[this.constructor.name] : null;
	        if (override) {
	            if (override.direction) direction = override.direction;
	            if (override.moveSpeed) moveSpeed = override.moveSpeed;
	            if (override.easing) easingName = override.easing;
	            if (!override.persistent) {
	                delete overrides[this.constructor.name];
	            }
	        }

	        this.easingFunction = MM.monakaEasing[easingName] || MM.monakaEasing.linear;
	        const rect = new Rectangle(this.x, this.y, this.width, this.height);
			this.visible = false; // 初期描画を抑制
	        this.setupInitialPosition(moveSpeed, direction, rect);
	        this.moveDirection = direction;
	        this.showAnimation = true;
	    }
	};

	const _Window_ChoiceList_start = Window_ChoiceList.prototype.start;
	Window_ChoiceList.prototype.start = function() {
		_Window_ChoiceList_start.apply(this, arguments);
		this.applyWindowSettings();
	};

	const _Window_NumberInput_start = Window_NumberInput.prototype.start;
	Window_NumberInput.prototype.start = function() {
		_Window_NumberInput_start.apply(this, arguments);
		this.applyWindowSettings();
	};

	const _Window_EventItem_start = Window_EventItem.prototype.start;
	Window_EventItem.prototype.start = function() {
		_Window_EventItem_start.apply(this, arguments);
		this.applyWindowSettings();
	};

	const _Window_NameBox_start = Window_NameBox.prototype.start;
	Window_NameBox.prototype.start = function() {
		_Window_NameBox_start.apply(this, arguments);
		this.applyWindowSettings();
	};

	const _Window_Message_startMessage = Window_Message.prototype.startMessage;
	Window_Message.prototype.startMessage = function() {
		_Window_Message_startMessage.apply(this, arguments);
		this.applyWindowSettings();
	};

	Window_Base.prototype.setupInitialPosition = function(moveSpeed, direction, rect) {
		this.animationFrame = 0;
		this.totalFrames = moveSpeed / (1000 / 60);

		switch (direction) {
			case 'up':
			this.startY = Graphics.height;
			this.targetY = rect.y;
			break;
			case 'down':
			this.startY = -this.height;
			this.targetY = rect.y;
			break;
			case 'left':
			this.startX = Graphics.width;
			this.targetX = rect.x;
			break;
			case 'right':
			this.startX = -this.width;
			this.targetX = rect.x;
			break;
		}
	};

	const _Window_Base_update = Window_Base.prototype.update;
	Window_Base.prototype.update = function() {
		_Window_Base_update.apply(this, arguments);

		if (this.showAnimation && this.isOpen()) {

			if (!this.visible) this.visible = true;

			this.animationFrame++;
			let progress = this.animationFrame / this.totalFrames;
			progress = this.easingFunction(Math.min(progress, 1));

			switch (this.moveDirection) {
				case 'up':
				case 'down':
				this.y = this.startY + (this.targetY - this.startY) * progress;
				break;
				case 'left':
				case 'right':
				this.x = this.startX + (this.targetX - this.startX) * progress;
				break;
			}

			if (this.animationFrame >= this.totalFrames) {
				this.showAnimation = false; // アニメーション終了
				switch (this.moveDirection) {
					case 'up':
					case 'down':
					this.y = this.targetY;
					break;
					case 'left':
					case 'right':
					this.x = this.targetX;
					break;
				}
			}
		}
	};
})();
