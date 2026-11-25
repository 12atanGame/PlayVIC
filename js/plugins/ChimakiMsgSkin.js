/*:
 * @target MZ
 * @plugindesc msg skin plugin 2.0
 * @author Chimaki
 * @url https://www.patreon.com/cw/chimakier
 * 
 * 
 * @param centerSwitchIdForver
 * @text center switch ID forver
 * @desc when this switch is ON, the text will be centered until this switch is turned off
 * @type switch
 * @default 3
 * 
 * @param useDefaultBgSwitchId
 * @text use default bg switch id
 * @type switch
 * @default 2
 * 
 * 
 * @param autoBreak
 * @text use auto break 
 * @type boolean
 * @default true
 * 
 * 
 * @param CtrlToSkip    
 * @text use Ctrl to skip msg
 * @type boolean
 * @default true
 * 
 * 
 * @param MsgSetting
 * 
 * 
 * 
 * @param defaultOutlineColor
 * @parent MsgSetting
 * @text default outline color
 * @default #00000080;
 * @desc default outline color, alpha is supported, such as #00000080. Default is translucent black
 * 
 * @param defaultOutlineWidth
 * @parent MsgSetting
 * @text default outline width
 * @default 3
 * 
 * @param defaultFontSize
 * @parent MsgSetting
 * @text default font size
 * @default 28
 * 
 * 
 * 
 * 
 * @param msgMaxWidth
 * @parent MsgSetting
 * @text msg max width
 * @default 400
 * 
 * @param backImag
 * @parent MsgSetting
 * @text msg back img 
 * @type file
 * @dir img/system
 * 
 * @param startXOffset
 * @parent MsgSetting
 * @text start x offset
 * @default 0
 * 
 * @param startYOffset
 * @parent MsgSetting
 * @text start y offset , dont < 0
 * @default 0
 * 
 * @param faceImageOffsetX
 * @parent MsgSetting
 * @text face image offset X
 * @default 0
 * 
 * @param faceImageOffsetY
 * @parent MsgSetting
 * @text face image offset Y
 * @default 0
 * 
 * 
 * @param backPosOffsetX
 * @parent MsgSetting
 * @text back img offset X
 * @default 0
 * 
 * @param backPosOffsetY
 * @parent MsgSetting
 * @text back img offset y
 * @default 0
 * 
 * 
 * @param enbaleMsgBaseY
 * @parent MsgSetting
 * @text enable msg base y offset
 * @desc only work when window position is bottom
 * @type boolean
 * 
 * @param msgBaseY
 * @parent MsgSetting
 * @text msg base y offset
 * @default 0
 * 
 * @param charSpacing
 * @parent MsgSetting
 * @text character spacing
 * @desc Extra spacing between each character in pixels. 0 = default.
 * @type number
 * @min 0
 * @default 0
 * 
 * @param backFrameCloseMode
 * @parent MsgSetting
 * @text back frame close mode
 * @desc Controls whether _backFrame closes with the message window.
 * @type select
 * @option default (close with window)
 * @value 0
 * @option stay open (use command to close)
 * @value 1
 * @default 0
 * 
 * @param hideBackFrameSwitchId
 * @parent MsgSetting
 * @text force hide back frame switch id
 * @desc When this switch is ON, _backFrame stays hidden while other message skin effects continue.
 * @type switch
 * @default 0
 * 
 * 
 * 
 * 
 * @param nameBoxSetting
 * 

 * 
 * 
 * @param nameBoxOutlineColor
 * @parent nameBoxSetting
 * @text name box outline color
 * @default #00000080
 * 
 * @param nameBoxOutlineWidth
 * @parent nameBoxSetting
 * @text name box outline width
 * @default 3
 * 
 * @param nameBoxFontSize
 * @parent nameBoxSetting
 * @text name box font size
 * @default 28
 * 
 * 
 * 
 * 
 * @param nameBoxCenter
 * @parent nameBoxSetting
 * @text name box center
 * @type select
 * 
 * @option left
 * @value 0
 * @option center
 * @value 1
 * @option right
 * @value 2
 * 
 * @param nameBoxPosX
 * @parent nameBoxSetting
 * @text name box pos X
 * @default 0
 * 
 * @param nameBoxPosY
 * @parent nameBoxSetting
 * @text name box pos Y
 * @default 0
 * 
 * @param nameBoxImag
 * @parent nameBoxSetting
 * @text name box img
 * @type file
 * @dir img/system
 
 * 
 * @param nameBoxImgOffsetX
 * @parent nameBoxSetting
 * @text name box img offset X
 * @default 0
 * 
 * 
 * @param nameBoxImgOffsetY
 * @parent nameBoxSetting
 * @text name box img offset Y
 * @default 0
 * 
 * 
 * 
 

 * 
 * 
 * 
 * @param TextWidthSe
 * 
 * 
 * @param useTextWidthSe
 * @parent TextWidthSe
 * @text Enable Text Width SE
 * @type boolean
 * @default false
 * 
 * 
 * @param SeName
 * @parent TextWidthSe
 * @type file
 * @dir audio/se
 * 
 * 
 * 
 * @param ChoiceSetting
 * 
 * @param enableChoice
 * @parent ChoiceSetting
 * @text enable choice features
 * @type boolean
 * 
 * @param choiceImageNoraml
 * @parent ChoiceSetting
 * @text choice background img
 * @type file
 * @dir img/system
 * 
 * @param choiceImageHover
 * @parent ChoiceSetting
 * @text choice hover background img
 * @type file
 * @dir img/system
 * 
 * @param ImageHeight
 * @parent ChoiceSetting
 * @text space between choices
 * @default 76
 * 
 * @param choiceFontSize
 * @parent ChoiceSetting
 * @text choice text size
 * @type number
 * @min 1
 * @default 28
 *
 * @param choiceTextColor
 * @parent ChoiceSetting
 * @text choice default text color
 * @type string
 * @default #ffffff
 * @desc CSS color used by default. Text color control codes can still override it.
 *
 * @param choiceOutlineWidth
 * @parent ChoiceSetting
 * @text choice outline width
 * @type number
 * @min 0
 * @default 3
 *
 * @param enableTouch
 * @parent ChoiceSetting
 * @text enable touch choice
 * @type boolean
 * @default true
 * 
 * @param centerYOffset
 * @parent ChoiceSetting
 * @text choice Y offset
 * default 40
 * 
 * @param choiceHoverScale
 * @parent ChoiceSetting
 * @text choice hover scale
 * @type number
 * @decimals 2
 * @default 1.05
 * 
 * @param choiceHoverSeName
 * @parent ChoiceSetting
 * @text choice hover SE
 * @type file
 * @dir audio/se
 * 
 * @param choiceHoverSeVolume
 * @parent ChoiceSetting
 * @text choice hover SE volume
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * 
 * @param choiceHoverSePitch
 * @parent ChoiceSetting
 * @text choice hover SE pitch
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param choiceHoverSePan
 * @parent ChoiceSetting
 * @text choice hover SE pan
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * 
 * 
 * 
 * @command changeMsgSetting
 * @text change message setting
 * @desc Change message outline color, outline width, and font size immediately for the current and following messages
 * 
 * @arg color
 * @text outline color
 * @desc Leave empty to keep the current outline color
 * @type string
 * 
 * @arg width
 * @text outline width
 * @desc Leave empty to keep the current outline width
 * @type number
 * 
 * @arg fontSize
 * @text font size
 * @desc Leave empty to keep the current font size
 * @type number
 * 
 * 
 * @command changeNamBoxSetting
 * @text change name box setting
 * @desc Change name box outline color, outline width, and font size immediately for the current and following messages
 * 
 * @arg color
 * @text outline color
 * @desc Leave empty to keep the current outline color
 * @type string
 * 
 * @arg width
 * @text outline width
 * @desc Leave empty to keep the current outline width
 * @type number
 * 
 * @arg fontSize
 * @text font size
 * @desc Leave empty to keep the current font size
 * @type number
 * 
 * 
 * @command changeTextAlign
 * @text change text alignment
 * @desc Set text alignment for current and following messages
 * 
 * @arg align
 * @text alignment
 * @type select
 * @default left
 * @option left
 * @option center
 * @option right
 * 
 * 
 * @command closeBackFrame
 * @text close back frame
 * @desc Directly hide the message back frame sprite immediately.
 * 
 * @command hideNameBoxCustomImage
 * @text hide name box background
 * @desc Hide the custom name box background until the show command is called.
 *
 * @command showNameBoxCustomImage
 * @text show name box background
 * @desc Show the custom name box background again.
 *
 *
 * @command changeAutoBreak
 * @text change auto line break
 * @desc Enable or disable automatic line breaks for current and following messages.
 *
 * @arg enabled
 * @text enable auto line break
 * @type boolean
 * @default true
 *
 *
 * @help 
 * 
 * how to use 使用教學 (open cc plz): 
 * https://youtu.be/G0wtd7krv94
 * 
 * change log:
 *  v 1.4.8
 * - fix: 多行置中錯誤
 * * v 1.4.7
 * - feat: 追加文本常駐置中開關參數
 * 
 * v 1.4.6
 * - fix : 優化選項的touch的時, msgback取消預設值
 * v 1.4.5
 * - fix : ChimakiLang.js 兼容問題
 * v 1.4.4
 * - name box 支援ChimakiLang.js
 * v 1.4.3
 * - 修正名稱底圖對位置
 * v 1.4.2
 * - fix show text line
 * v 1.4.1
 * - fix 防呆
 * v 1.4
 * - fix 鍵盤選縣沒有顯示hover圖片問題
 * 
 * v 1.3 
 * - 追加修改訊息視窗基本y軸選項，只有在設定底部時有效
 * 
 * v 1.2
 * - 修正選擇框滑鼠觸碰錯誤問題
 * 
 * v 1.1 
 * - 名稱框加入定位點選項,
 * - 一次性置中支援多行
 * 
 * 
 * 
 */
 
 
/*:zh_TW
 * @target MZ
 * @plugindesc  msg skin plugin 2.0
 * @author Chimaki
 * @url https://www.patreon.com/cw/chimakier
 * 
 * 
 * @param centerSwitchIdForver
 * @text 文字置中開關
 * @desc 開啟後，顯示文本會文字置中顯示，直到關閉此開關
 * @type switch
 * @default 3
 * 
 * @param useDefaultBgSwitchId
 * @text 恢復預設視窗開關
 * @desc 開啟此開關時，使用系統預設訊息框背景
 * @type switch
 * @default 2
 * 
 * 
 * @param autoBreak
 * @text 啟用自動換行
 * @type boolean
 * @default true
 * 
 * 
 * @param CtrlToSkip    
 * @text 啟用ctrl快進訊息
 * @type boolean
 * @default true
 * 
 * 
 * @param MsgSetting
 * 
 * 
 * 
 * @param defaultOutlineColor
 * @parent MsgSetting
 * @text 預設描邊顏色
 * @default #00000080;
 * @desc 預設描邊顏色，支援alpha，例如#00000080，預設是半透明黑色
 * 
 * @param defaultOutlineWidth
 * @parent MsgSetting
 * @text 預設描邊寬度
 * @default 3
 * 
 * @param defaultFontSize
 * @parent MsgSetting
 * @text 預設字體大小
 * @default 28
 * 
 * 
 * 
 * @param msgMaxWidth
 * @parent MsgSetting
 * @text 訊息框最大寬度
 * @default 400
 * 
 * @param backImag
 * @parent MsgSetting
 * @text 訊息框背景圖
 * @type file
 * @dir img/system
 * 
 * @param startXOffset
 * @parent MsgSetting
 * @text 文字起始X偏移
 * @default 0
 * 
 * @param startYOffset
 * @parent MsgSetting
 * @text 文字起始Y偏移，請勿 < 0
 * @default 0
 * 
 * @param faceImageOffsetX
 * @parent MsgSetting
 * @text 臉圖偏移 X
 * @default 0
 * 
 * @param faceImageOffsetY
 * @parent MsgSetting
 * @text 臉圖偏移 Y
 * @default 0
 * 
 * 
 * @param backPosOffsetX
 * @parent MsgSetting
 * @text 背景圖偏移 X
 * @default 0
 * 
 * @param backPosOffsetY
 * @parent MsgSetting
 * @text 背景圖偏移 Y
 * @default 0
 * 
 * 
 * @param enbaleMsgBaseY
 * @parent MsgSetting
 * @text 啟用訊息框本體y座標偏移
 * @desc 只有視窗位置在底部時有效
 * @type boolean
 * @default false
 * 
 * @param msgBaseY
 * @parent MsgSetting
 * @text 訊息框本體 y 座標偏移
 * @default 0
 * 
 * @param charSpacing
 * @parent MsgSetting
 * @text 字元間距
 * @desc 每個字元之間額外增加的像素間距，0 為預設值
 * @type number
 * @min 0
 * @default 0
 * 
 * @param backFrameCloseMode
 * @parent MsgSetting
 * @text 背景框關閉模式
 * @desc 設定訊息背景框(_backFrame)的關閉行為
 * @type select
 * @option 預設(跟隨視窗關閉)
 * @value 0
 * @option 常駐顯示(使用指令關閉)
 * @value 1
 * @default 0
 * 
 * @param hideBackFrameSwitchId
 * @parent MsgSetting
 * @text 強制隱藏背景框開關
 * @desc 開啟此開關時，訊息背景框(_backFrame)會保持隱藏，其他訊息框效果照常使用。
 * @type switch
 * @default 0
 * 
 * @param nameBoxSetting
 * 
 * 
 * 
 * @param nameBoxOutlineColor
 * @parent nameBoxSetting
 * @text 名字框描邊顏色
 * @default #00000080
 * 
 * @param nameBoxOutlineWidth
 * @parent nameBoxSetting
 * @text 名字框描邊寬度
 * @default 3
 * 
 * @param nameBoxFontSize
 * @parent nameBoxSetting
 * @text 名字框字體大小
 * @default 28
 * 
 * 
 * 
 * 
 * @param nameBoxCenter
 * @parent nameBoxSetting
 * @text 人名視窗定位
 * @type select
 * @option 靠左(預設)
 * @value 0
 * 
 * @option 置中
 * @value 1
 * 
 * @option 靠右
 * @value 2
 * 
 * 
 * @param nameBoxPosX
 * @parent nameBoxSetting
 * @text 人名視窗 pos X
 * @default 0
 * 
 * @param nameBoxPosY
 * @parent nameBoxSetting
 * @text 人名視窗 pos Y
 * @default 0
 * 
 * 
 * @param nameBoxImag 
 * @parent nameBoxSetting
 * @text 人名視窗背景圖
 * @type file
 * @dir img/system
 * 
 * @param nameBoxImgOffsetX
 * @parent nameBoxSetting
 * @text 人名視窗背景圖偏移 X
 * @default 0
 * 
 * @param nameBoxImgOffsetY
 * @parent nameBoxSetting
 * @text 人名視窗背景圖偏移 Y
 * @default 0
 * 

 * 
 * 
 * 
 * 
 * 
 * 
 * @param TextWidthSe
 * 
 * 
 * @param useTextWidthSe
 * @parent TextWidthSe
 * @text 文字訊息搭配音效
 * @type boolean
 * @default false
 * 
 * 
 * @param SeName
 * @parent TextWidthSe
 * @text 文字音效名稱
 * @type file
 * @dir audio/se
 *
 * 
 * 
 * @param ChoiceSetting
 * 
 * @param enableChoice
 * @parent ChoiceSetting
 * @text 啟用選項相關功能
 * @type boolean
 * 
 * 
 * @param choiceImageNoraml
 * @parent ChoiceSetting
 * @text 選項背景圖
 * @type file
 * @dir img/system
 * 
 * 
 * @param choiceImageHover
 * @parent ChoiceSetting
 * @text 選項滑鼠經過背景圖
 * @type file
 * @dir img/system
 * 
 * 
 * @param ImageHeight
 * @parent ChoiceSetting
 * @text 選項之間的間距
 * @default 76
 * 
 * @param choiceFontSize
 * @parent ChoiceSetting
 * @text 選項文字大小
 * @type number
 * @min 1
 * @default 28
 *
 * @param choiceTextColor
 * @parent ChoiceSetting
 * @text 選項文字預設顏色
 * @type string
 * @default #ffffff
 * @desc 支援 CSS 顏色格式；文字顏色控制碼仍可覆蓋此預設值。
 *
 * @param choiceOutlineWidth
 * @parent ChoiceSetting
 * @text 選項文字描邊寬度
 * @type number
 * @min 0
 * @default 3
 *
 * 
 * @param enableTouch
 * @parent ChoiceSetting
 * @text 啟用觸控選項
 * @type boolean
 * @default true
 * 
 * 
 * @param centerYOffset
 * @parent ChoiceSetting
 * @text 選項Y偏移
 * @default 40
 *  
 * @param choiceHoverScale
 * @parent ChoiceSetting
 * @text 選項滑鼠經過縮放
 * @type number
 * @decimals 2
 * @default 1.05
 * 
 * @param choiceHoverSeName
 * @parent ChoiceSetting
 * @text 選項滑鼠經過音效
 * @type file
 * @dir audio/se
 * 
 * @param choiceHoverSeVolume
 * @parent ChoiceSetting
 * @text 選項滑鼠經過音效音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * 
 * @param choiceHoverSePitch
 * @parent ChoiceSetting
 * @text 選項滑鼠經過音效音調
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param choiceHoverSePan
 * @parent ChoiceSetting
 * @text 選項滑鼠經過音效聲相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *  
 * 
 * 
 * 
 * @command changeMsgSetting
 * @text 更改對話設定
 * @desc 即時更改訊息描邊顏色、寬度和字體大小，適用於當前和後續訊息
 * 
 * @arg color
 * @text 描邊顏色
 * @desc 描邊顏色，不修改就留空
 * @type string
 * 
 * @arg width
 * @text 描邊寬度
 * @desc 描邊寬度，不修改就留空
 * @type number
 * @arg fontSize
 * 
 * @arg fontSize
 * @text 字體大小
 * @desc 字體大小，不修改就留空
 * @type number
 * 
 * 
 * 
 * @command changeNamBoxSetting
 * @text 更改名稱框設定
 * @desc 即時更改名稱框描邊顏色、寬度和字體大小，適用於當前和後續訊息
 * 
 * 
 * @arg color
 * @text 描邊顏色
 * @desc 描邊顏色，不修改就留空
 * @type string
 * 
 * @arg width
 * @text 描邊寬度
 * @desc 描邊寬度，不修改就留空
 * @type number
 * 
 * @arg fontSize
 * @text 字體大小
 * @desc 字體大小，不修改就留空
 * @type number
 * 
 * 
 * @command changeTextAlign
 * @text 更改文字對齊
 * @desc 設定當前及後續訊息的文字對齊方式
 * 
 * @arg align
 * @text 對齊方式
 * @type select
 * @default left
 * @option 靠左
 * @value left
 * @option 置中
 * @value center
 * @option 靠右
 * @value right
 * 
 * 
 * @command closeBackFrame
 * @text 關閉訊息背景框
 * @desc 立即隱藏訊息背景框 Sprite (_backFrame)
 * 
 * @command hideNameBoxCustomImage
 * @text 不顯示名字底圖
 * @desc 隱藏名字底圖，直到呼叫「顯示名字底圖」為止，不影響名稱文字。
 *
 * @command showNameBoxCustomImage
 * @text 顯示名字底圖
 * @desc 重新顯示名字底圖。
 *
 *
 * @command changeAutoBreak
 * @text 更改自動換行設定
 * @desc 設定當前及後續訊息是否啟用自動換行
 *
 * @arg enabled
 * @text 啟用自動換行
 * @type boolean
 * @default true
 *
 *
 * 
 * 
 * @help 
 * 
 * how to use 使用教學 (open cc plz): 
 * https://youtu.be/G0wtd7krv94
 * 
 * change log:
 * v 1.5 追加文字設定
 * 
 * v 1.4.8
 * - fix: 多行置中錯誤
 * v 1.4.7
 * - feat: 追加文本常駐置中開關參數
 * 
 * v 1.4.6
 * - fix : 優化選項的touch的時, msgback取消預設值
 * v 1.4.5
 * - fix : ChimakiLang.js 兼容問題
 * v 1.4.4
 * - name box 支援ChimakiLang.js
 * v 1.4.3
 * - 修正名稱底圖對位置
 * v 1.4.2
 * - fix show text line
 * v 1.4.1
 * - fix 防呆
 * v 1.4
 * - fix 鍵盤選縣沒有顯示hover圖片問題
 * v 1.3 
 * - 追加修改訊息視窗基本y軸選項，只有在設定底部時有效
 * v 1.2
 * - 修正選擇框滑鼠觸碰錯誤問題
 * v 1.1 
 * - 名稱框加入定位點選項,
 * - 一次性置中支援多行
 * 
 * 
 * 
 */

function a0_0x50fb(){const _0x1f9695=['contentsWidth','getLangDataText','_canvas','_lastText','msgSkin_textAlign','iconWidth','refresh','none','enabled','clear','select','startPause','openness','choiceHoverScale','42bPNRKb','isArray','_hitElements','defaultOutlineColor','style','_clickHandler','toUpperCase','callCancelHandler','choiceImageHover','newPage','_opening','drawing','1477045rhkHaa','useDefaultBgSwitchId','needsNewPage','standardFaceWidth','updateInputData','control','processCharacter','textWindowWidth','messageWindowRect','set','push','static','updateTransitionScale','centerYOffset','slice','registerCommand','textSizeEx','isPressedMsgSkipButton','startXOffset','playSe','isPressed','contentsHeight','backFrameCloseMode','initHanlder','msgSkin_nameOutlineWidth','locale','boxHeight','onEndOfText','forEach','msgBaseY','loadMessageFace','createNameBoxWindow','prototype','choiceOutlineWidth','fontSize','createSelectImage','resetOver','_createPauseSignSprites','_updateCanvas','windowWidth','createTextBuffer','_isPointerMoveEvent','choiceHoverSeName','pointerout','getStyledTextWidth','updateMessage','left','visible','addLoadListener','mainFontFace','update','lang','createChoiceListWindow','drawText','_msgSkinNameBoxImageVisible','boxWidth','choiceHoverSePitch','nameBoxOutlineWidth','clearFlags','978756ARqiJL','_hoverScale','faceImageOffsetX','value','setBitmap','onLeave','updatePlacement','4dkyZhO','text','sequence','onSceneTerminate','width','1104790xhQaPe','isWaiting','test','body','totalText','nameBoxImgOffsetY','pointerup','maxFontSizeInLine','_openness','setMsgTextAlign','terminateMessage','some','resetPointerState','choiceTextColor','nextIndex','isFinite','isMsgSkinNameBoxImageVisible','renderer','_text','max','updateBackground','useTextWidthSe','setBackgroundType','waitSystemBack','faceImageOffsetY','AVG_area','cancel','right','setCursor','enbaleMsgBaseY','replace','1372482MJtfwn','parent','_upArrowSprite','isBackFrameForcedHidden','msgSkin_nameFontSize','createText','close','playOkSound','events','nameBoxPosY','outlineColor','setPointerInteractionEnabled','_selectContainer','startYOffset','defaultOutlineWidth','#ffffff','indexOf','height','centerSwitchIdForver','includes','_index','setMainHandler','word','_downArrowSprite','enableTouch','deactivate','_msgTextAlign','playCancel','button','showNameBoxCustomImage','20527gyVSvv','true','onPress','updateCustomImageVisibility','onClick','clamp','ChimakiMsgSkin','lastYIndex','opacity','setName','extractWord','min','allText','hideNameBoxCustomImage','nameBoxCenter','_tempHandler','isDown','getWordWidth','textWidth','zIndex','createTextState','touchUI','removeChild','click','_choiceOpenness','match','updateBackFrameForceHide','onOver','onUp','_over','trackingData','processTouch','updateOpen','setClickHandler','initialize','open','drawMessageFace','backPosOffsetY','_positionType','extractEscapeSequence','initMembers','startX','imageHeight','_baseWindow','_backFrame','getCleanTextWidth','faceIndex','msgTextAlign','bind','_chimakiMsgSkinPointerTrackingAlias','function','msgSkin_outlineColor','CtrlToSkip','closeBackFrame','fontFace','index','_textState','resetFontSettings','msgSkin_outlineWidth','calcTextHeight','start','_showList','center','addChild','updateText','choiceHoverSePan','_nameBoxWindow','setMsgSkinNameBoxImageVisible','changeTextAlign','interactive','updateSpeakerName','anchor','newLineX','addChildToBack','_mainWindow','drawTextEx','SeName','279CFlIbh','_createArrowSprites','buffer','nameBoxImgOffsetX','choice','textColor','choices','changeAutoBreak','startMessage','rtl','removeEventListener','nameBoxOutlineColor','baseTextRect','backPosOffsetX','updateInput','app','drawFace','isPictureChoices','_choiceListWindow','loadSystem','call','backImag','enableChoice','_allInteractiveElements','length','792323dBhXcj','contents','disableChimakiChoiceInteraction','setBackFrameOpacity','split','#00000080','getControlSequenceWidth','_scene','isOver','nameBoxPosX','mappingState','shouldBreakHere','_dimmerSprite','color','_hoverBitmap','_selectImgList','6897768xNzbbP','_normalBitmap','windowHeight','onMove','pointerdown','flushTextState','option','updateShowFast','lineHeight','msgSkin_fontSize','_down','hideBackFrameSwitchId','pause','scale','getWrappedText','_name','processNewLine','_nameBoxImage','outlineWidth','_textSountWait','addEventListener','_cancelButton','_closing','choiceHoverSeVolume','faceName','innerHeight','_messageWindow','_showFast','bitmap','_pauseSignSprite','charSpacing'];a0_0x50fb=function(){return _0x1f9695;};return a0_0x50fb();}(function(_0x367be9,_0x17dca4){const _0x394ed5=a0_0x2f90,_0x3e3611=_0x367be9();while(!![]){try{const _0x401400=-parseInt(_0x394ed5(0x167))/0x1+-parseInt(_0x394ed5(0x149))/0x2+-parseInt(_0x394ed5(0x11e))/0x3+parseInt(_0x394ed5(0x125))/0x4*(-parseInt(_0x394ed5(0xe3))/0x5)+parseInt(_0x394ed5(0xd7))/0x6*(-parseInt(_0x394ed5(0x1cd))/0x7)+-parseInt(_0x394ed5(0x1dd))/0x8+parseInt(_0x394ed5(0x1b4))/0x9*(parseInt(_0x394ed5(0x12a))/0xa);if(_0x401400===_0x17dca4)break;else _0x3e3611['push'](_0x3e3611['shift']());}catch(_0x12a1c4){_0x3e3611['push'](_0x3e3611['shift']());}}}(a0_0x50fb,0x6be14));function a0_0x2f90(_0x1988d6,_0x45eb34){_0x1988d6=_0x1988d6-0xbf;const _0x50fb70=a0_0x50fb();let _0x2f9069=_0x50fb70[_0x1988d6];return _0x2f9069;}var chimakiMsgSkinParams=chimakiMsgSkinParams||{};((()=>{const _0x42eb1e=a0_0x2f90,_0x567497=_0x42eb1e(0x16d),_0x31b307=PluginManager['parameters'](_0x567497),_0x5eb9c5=Number(_0x31b307[_0x42eb1e(0x15b)])||0x3,_0x14a456=String(_0x31b307[_0x42eb1e(0x1c9)]||''),_0x13d33c=Number(_0x31b307[_0x42eb1e(0xe4)])||0x2;let _0x29ddac=_0x31b307['autoBreak']===_0x42eb1e(0x168);const _0x1b7c22=Number(_0x31b307[_0x42eb1e(0x1c1)])||0x0,_0x29f9b6=Number(_0x31b307[_0x42eb1e(0x18c)])||0x0,_0x378eee=Number(_0x31b307[_0x42eb1e(0xf5)])||0x0,_0x247fdb=Number(_0x31b307[_0x42eb1e(0x156)])||0x0,_0x533ea4=Number(_0x31b307[_0x42eb1e(0x120)])||0x0,_0x5e5339=Number(_0x31b307[_0x42eb1e(0x142)])||0x0,_0x1d0270=_0x31b307[_0x42eb1e(0x147)]===_0x42eb1e(0x168)?!![]:![],_0xe8484d=Number(_0x31b307[_0x42eb1e(0x100)])||0x0,_0x230c45=Number(_0x31b307['msgMaxWidth'])||0x190,_0x3044c4=Number(_0x31b307[_0x42eb1e(0x1d6)])||0x0,_0x427c39=Number(_0x31b307[_0x42eb1e(0x152)])||0x0,_0x6eb258=String(_0x31b307[_0x42eb1e(0x1b3)]||''),_0x2c61d7=_0x31b307[_0x42eb1e(0x13f)]==='true'?!![]:![],_0x2fe282=String(_0x31b307['nameBoxImag']),_0x161d77=Number(_0x31b307[_0x42eb1e(0x1b7)])||0x0,_0x26b2a3=Number(_0x31b307[_0x42eb1e(0x12f)])||0x0,_0x1cec6f=Number(_0x31b307[_0x42eb1e(0x175)])||0x0,_0x3242b2=_0x31b307[_0x42eb1e(0x19b)]==='true'?!![]:![],_0x531f41=String(_0x31b307['choiceImageNoraml']||''),_0x157a06=String(_0x31b307[_0x42eb1e(0xdf)]||''),_0x41745b=Number(_0x31b307['ImageHeight'])||0x4c,_0x3762a3=Number(_0x31b307['choiceFontSize'])||0x1c,_0x5ec313=String(_0x31b307[_0x42eb1e(0x137)]||'#ffffff'),_0x2c03c3=Number(_0x31b307[_0x42eb1e(0x104)]),_0x287b99=Number['isFinite'](_0x2c03c3)?_0x2c03c3:0x3,_0x28dab2=_0x31b307[_0x42eb1e(0x161)]===_0x42eb1e(0x168)?!![]:![],_0x30cfd8=Number(_0x31b307[_0x42eb1e(0xf0)])||0x28,_0x3bf41b=_0x31b307[_0x42eb1e(0x1ca)]===_0x42eb1e(0x168)?!![]:![],_0x1d2479=Number(_0x31b307[_0x42eb1e(0xd6)])||1.05,_0x52f5ed=String(_0x31b307[_0x42eb1e(0x10d)]||''),_0x120c31=Number(_0x31b307[_0x42eb1e(0xc1)])||0x5a,_0x37dc2e=Number(_0x31b307[_0x42eb1e(0x11b)])||0x64,_0x50d7d4=Number(_0x31b307[_0x42eb1e(0x1a8)])||0x0,_0x3b2050=Number(_0x31b307[_0x42eb1e(0xc8)])||0x0,_0x16dcc0=Number(_0x31b307[_0x42eb1e(0xf9)])||0x0,_0x2fba29=Number(_0x31b307[_0x42eb1e(0x1e8)])||0x0;window[_0x42eb1e(0x19a)]=String(_0x31b307[_0x42eb1e(0xda)]||'#00000080');const _0x3ac6cd=Number(_0x31b307[_0x42eb1e(0x157)]);window[_0x42eb1e(0x1a1)]=Number[_0x42eb1e(0x139)](_0x3ac6cd)?_0x3ac6cd:0x3,window[_0x42eb1e(0x1e6)]=Number(_0x31b307['defaultFontSize'])||0x1c,window['msgSkin_nameOutlineColor']=String(_0x31b307[_0x42eb1e(0x1bf)]||_0x42eb1e(0x1d2));const _0x335d8a=Number(_0x31b307[_0x42eb1e(0x11c)]);window[_0x42eb1e(0xfb)]=Number[_0x42eb1e(0x139)](_0x335d8a)?_0x335d8a:0x3,window[_0x42eb1e(0x14d)]=Number(_0x31b307['nameBoxFontSize'])||0x1c,window[_0x42eb1e(0xcd)]=_0x42eb1e(0x111);const _0x488d94=Game_System[_0x42eb1e(0x103)][_0x42eb1e(0x189)];Game_System[_0x42eb1e(0x103)]['initialize']=function(){const _0x541fe7=_0x42eb1e;_0x488d94[_0x541fe7(0x1c8)](this),this['_msgTextAlign']=_0x541fe7(0x111),this[_0x541fe7(0x119)]=!![];},Game_System[_0x42eb1e(0x103)][_0x42eb1e(0x196)]=function(){return this['_msgTextAlign']||'left';},Game_System[_0x42eb1e(0x103)][_0x42eb1e(0x133)]=function(_0x9587b3){const _0x377e81=_0x42eb1e;this['_msgTextAlign']=_0x9587b3||_0x377e81(0x111),window[_0x377e81(0xcd)]=this[_0x377e81(0x163)];},Game_System['prototype'][_0x42eb1e(0x13a)]=function(){const _0x2caf02=_0x42eb1e;return this[_0x2caf02(0x119)]!==![];},Game_System[_0x42eb1e(0x103)]['setMsgSkinNameBoxImageVisible']=function(_0x2553a6){this['_msgSkinNameBoxImageVisible']=!!_0x2553a6;};function _0xe0537a(){const _0x3ba9b5=_0x42eb1e;return!$gameSystem||$gameSystem[_0x3ba9b5(0x13a)]();}chimakiMsgSkinParams['choiceImageNormal']=_0x531f41,chimakiMsgSkinParams[_0x42eb1e(0xdf)]=_0x157a06,chimakiMsgSkinParams[_0x42eb1e(0x191)]=_0x41745b,chimakiMsgSkinParams['choiceFontSize']=_0x3762a3,chimakiMsgSkinParams[_0x42eb1e(0x137)]=_0x5ec313,chimakiMsgSkinParams[_0x42eb1e(0x104)]=_0x287b99,chimakiMsgSkinParams[_0x42eb1e(0x161)]=_0x28dab2,chimakiMsgSkinParams[_0x42eb1e(0xf0)]=_0x30cfd8,chimakiMsgSkinParams[_0x42eb1e(0x1ca)]=_0x3bf41b,chimakiMsgSkinParams['choiceHoverScale']=_0x1d2479,chimakiMsgSkinParams[_0x42eb1e(0x10d)]=_0x52f5ed,chimakiMsgSkinParams[_0x42eb1e(0xc1)]=_0x120c31,chimakiMsgSkinParams['choiceHoverSePitch']=_0x37dc2e,chimakiMsgSkinParams[_0x42eb1e(0x1a8)]=_0x50d7d4,PluginManager[_0x42eb1e(0xf2)](_0x567497,'changeMsgSetting',_0xf228cc=>{const _0x3a6561=_0x42eb1e;let {color:_0x6a1b6d,width:_0x26a6b9,fontSize:_0x1b827f}={..._0xf228cc};if(_0x6a1b6d)msgSkin_outlineColor=_0xf228cc[_0x3a6561(0x1da)]||_0x3a6561(0x1d2);if(_0x26a6b9!==undefined&&_0x26a6b9!==''){const _0x48c49d=Number(_0x26a6b9);if(Number[_0x3a6561(0x139)](_0x48c49d))msgSkin_outlineWidth=_0x48c49d;}if(_0x1b827f)msgSkin_fontSize=Number(_0xf228cc[_0x3a6561(0x105)])||0x1c;}),PluginManager[_0x42eb1e(0xf2)](_0x567497,'changeNamBoxSetting',_0x3eae59=>{const _0x1f4c13=_0x42eb1e;let {color:_0x230e7a,width:_0x52bbc0,fontSize:_0xd93f86}={..._0x3eae59};if(_0x230e7a)msgSkin_nameOutlineColor=_0x3eae59['color']||'#00000080';if(_0x52bbc0!==undefined&&_0x52bbc0!==''){const _0x4413ca=Number(_0x52bbc0);if(Number[_0x1f4c13(0x139)](_0x4413ca))msgSkin_nameOutlineWidth=_0x4413ca;}if(_0xd93f86)msgSkin_nameFontSize=Number(_0x3eae59[_0x1f4c13(0x105)])||0x1c;}),PluginManager['registerCommand'](_0x567497,_0x42eb1e(0x1ab),_0x5a8e5e=>{const _0x5cf49b=_0x42eb1e;$gameSystem[_0x5cf49b(0x133)](_0x5a8e5e['align']||'left');}),PluginManager['registerCommand'](_0x567497,_0x42eb1e(0x19c),()=>{const _0x4322ce=_0x42eb1e,_0x27e436=SceneManager[_0x4322ce(0x1d4)]&&SceneManager[_0x4322ce(0x1d4)]['_messageWindow'];if(_0x27e436)_0x27e436[_0x4322ce(0x19c)]();}),PluginManager[_0x42eb1e(0xf2)](_0x567497,_0x42eb1e(0x174),()=>{const _0x1536e3=_0x42eb1e;$gameSystem[_0x1536e3(0x1aa)](![]);const _0x280cd3=SceneManager[_0x1536e3(0x1d4)]&&SceneManager[_0x1536e3(0x1d4)]['_nameBoxWindow'];if(_0x280cd3)_0x280cd3[_0x1536e3(0x16a)]();}),PluginManager[_0x42eb1e(0xf2)](_0x567497,_0x42eb1e(0x166),()=>{const _0xdefada=_0x42eb1e;$gameSystem[_0xdefada(0x1aa)](!![]);const _0x4c68c5=SceneManager[_0xdefada(0x1d4)]&&SceneManager[_0xdefada(0x1d4)][_0xdefada(0x1a9)];if(_0x4c68c5)_0x4c68c5['updateCustomImageVisibility']();}),PluginManager[_0x42eb1e(0xf2)](_0x567497,_0x42eb1e(0x1bb),_0x257f1b=>{const _0x88857=_0x42eb1e;_0x29ddac=_0x257f1b[_0x88857(0xd1)]!=='false';});function _0x560f84(){const _0xf00c95=_0x42eb1e,_0x2ec48b=Graphics[_0xf00c95(0x1c3)],_0x52ec8b=_0x2ec48b&&_0x2ec48b['renderer']&&_0x2ec48b[_0xf00c95(0x13b)][_0xf00c95(0x151)],_0x1779a2=_0x52ec8b&&_0x52ec8b['rootBoundary'];if(!_0x1779a2)return;_0x1779a2[_0xf00c95(0x1d7)]&&(_0x1779a2[_0xf00c95(0x1d7)][_0xf00c95(0x185)]={}),Array[_0xf00c95(0xd8)](_0x1779a2[_0xf00c95(0x1cb)])&&(_0x1779a2[_0xf00c95(0x1cb)]['length']=0x0),Array[_0xf00c95(0xd8)](_0x1779a2[_0xf00c95(0xd9)])&&(_0x1779a2[_0xf00c95(0xd9)][_0xf00c95(0x1cc)]=0x0),_0x1779a2[_0xf00c95(0x10c)]=![],_0x1779a2['cursor']=null,_0x52ec8b&&typeof _0x52ec8b[_0xf00c95(0x146)]==='function'&&_0x52ec8b[_0xf00c95(0x146)](null);}if(!SceneManager[_0x42eb1e(0x198)]){const _0x4457d1=SceneManager['onSceneTerminate'];SceneManager[_0x42eb1e(0x128)]=function(){const _0x4604d5=_0x42eb1e,_0x1594e7=this[_0x4604d5(0x1d4)],_0x4b73f6=_0x1594e7&&_0x1594e7[_0x4604d5(0x1c6)];_0x4b73f6&&typeof _0x4b73f6['disableChimakiChoiceInteraction']===_0x4604d5(0x199)&&_0x4b73f6[_0x4604d5(0x1cf)](),_0x560f84(),_0x4457d1[_0x4604d5(0x1c8)](this);},SceneManager[_0x42eb1e(0x198)]=!![];}let _0x102b68=Graphics[_0x42eb1e(0x109)];Graphics['_updateCanvas']=function(){const _0x4d4c21=_0x42eb1e;_0x102b68['call'](this),this[_0x4d4c21(0xcb)]&&this[_0x4d4c21(0xcb)]['style']&&(this[_0x4d4c21(0xcb)][_0x4d4c21(0xdb)][_0x4d4c21(0x17a)]=0x9);};let _0x41edd4=Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x1ed)];Window_Message['prototype'][_0x42eb1e(0x1ed)]=function(_0x56ce2d){const _0x3208a0=_0x42eb1e,_0x5259f9=$gameSwitches[_0x3208a0(0x121)](_0x5eb9c5)||$gameSystem[_0x3208a0(0x196)]()===_0x3208a0(0x1a5),_0x2ec987=$gameSystem[_0x3208a0(0x196)]()===_0x3208a0(0x145);if(!_0x5259f9&&!_0x2ec987)_0x41edd4['call'](this,_0x56ce2d);else{_0x56ce2d[_0x3208a0(0x16e)]++;if(_0x56ce2d[_0x3208a0(0x12e)]){let _0x116793=_0x56ce2d['totalText'][_0x56ce2d[_0x3208a0(0x16e)]],_0x42d67e=this[_0x3208a0(0x178)](_0x116793);const _0x3d9cdb=this[_0x3208a0(0x1af)](_0x56ce2d);_0x2ec987?_0x56ce2d['x']=_0x3d9cdb+_0x230c45-_0x42d67e:_0x56ce2d['x']=_0x3d9cdb+(_0x230c45-_0x42d67e)/0x2;}else _0x56ce2d['x']=_0x56ce2d[_0x3208a0(0x190)];_0x56ce2d['y']+=_0x56ce2d[_0x3208a0(0x15a)],_0x56ce2d[_0x3208a0(0x15a)]=this[_0x3208a0(0x1a2)](_0x56ce2d);}};const _0x12085b=Window_Message['prototype'][_0x42eb1e(0x17b)];Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x17b)]=function(){const _0x5d0c15=_0x42eb1e,_0x3c811b=_0x12085b['call'](this,...arguments);if(!_0x29ddac)return _0x3c811b;const _0x579bd8=[];for(let _0x405922=0x0;_0x405922<_0x3c811b[_0x5d0c15(0x126)][_0x5d0c15(0x1cc)];_0x405922++){_0x3c811b[_0x5d0c15(0x126)][_0x405922]==='\x0a'&&_0x579bd8[_0x5d0c15(0xed)](_0x405922);}return _0x3c811b['text']=this['getWrappedText'](_0x3c811b['text'],this['contents'][_0x5d0c15(0x129)]-this[_0x5d0c15(0x1af)](_0x3c811b),_0x579bd8),_0x3c811b[_0x5d0c15(0x15a)]=this[_0x5d0c15(0x1a2)](_0x3c811b),_0x3c811b['buffer']=this[_0x5d0c15(0x10b)](_0x3c811b['rtl']),_0x3c811b;},Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x1bc)]=function(){const _0x29781d=_0x42eb1e;let _0x3ef64d=$gameMessage[_0x29781d(0x173)]();this[_0x29781d(0x1a0)]();const _0x2b816a=this[_0x29781d(0x17b)](_0x3ef64d,0x0,0x0,0x0);_0x2b816a[_0x29781d(0x16e)]=0x0,_0x2b816a[_0x29781d(0x126)]=_0x2b816a['text'][_0x29781d(0x148)](/\r\n/g,'\x0a')[_0x29781d(0x148)](/\r/g,'\x0a'),_0x2b816a['totalText']=_0x2b816a['text'][_0x29781d(0x1d1)]('\x0a');let _0x138c2d=[];for(let _0x12028a=0x0;_0x12028a<_0x2b816a[_0x29781d(0x12e)]['length'];_0x12028a++){let _0x2f1995=_0x2b816a[_0x29781d(0x12e)][_0x12028a];if(_0x2f1995[_0x29781d(0x180)](/\x1B$/)){let _0x7eecdc=_0x2b816a[_0x29781d(0x12e)][_0x12028a+0x1];_0x7eecdc&&(_0x7eecdc='\x1b'+_0x7eecdc,_0x2b816a[_0x29781d(0x12e)][_0x12028a+0x1]=_0x7eecdc),_0x2f1995=_0x2f1995['substring'](0x0,_0x2f1995[_0x29781d(0x1cc)]-0x1);}_0x138c2d['push'](_0x2f1995);}_0x2b816a['totalText']=_0x138c2d,_0x2b816a[_0x29781d(0x126)]='';for(let _0x4f8c7e=0x0;_0x4f8c7e<_0x2b816a[_0x29781d(0x12e)][_0x29781d(0x1cc)];_0x4f8c7e++){_0x2b816a['text']+=_0x2b816a[_0x29781d(0x12e)][_0x4f8c7e]+'\x0a';}let _0x57665c=this[_0x29781d(0x178)](_0x2b816a[_0x29781d(0x12e)][_0x2b816a[_0x29781d(0x16e)]]);const _0x32c4f7=$gameSwitches[_0x29781d(0x121)](_0x5eb9c5)||$gameSystem[_0x29781d(0x196)]()==='center',_0x47e9c9=$gameSystem[_0x29781d(0x196)]()===_0x29781d(0x145),_0x53d7fb=this[_0x29781d(0x1af)](_0x2b816a);if(_0x32c4f7)_0x2b816a[_0x29781d(0x190)]=_0x2b816a['x']=_0x53d7fb+(_0x230c45-_0x57665c)/0x2;else _0x47e9c9?_0x2b816a[_0x29781d(0x190)]=_0x2b816a['x']=_0x53d7fb+_0x230c45-_0x57665c:_0x2b816a[_0x29781d(0x190)]=_0x2b816a['x']=_0x53d7fb;this[_0x29781d(0x19f)]=_0x2b816a,this[_0x29781d(0xe0)](this['_textState']),this[_0x29781d(0x124)](),this[_0x29781d(0x13e)](),this['open'](),this[_0x29781d(0x1a9)][_0x29781d(0x1a3)]();},Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x1eb)]=function(_0x471091,_0x22f95e=_0x230c45,_0x315e85){const _0x54579a=_0x42eb1e;_0x22f95e=_0x230c45;if(_0x471091===''||_0x471091==null)return'';_0x471091=String(_0x471091);if(!ConfigManager['lang']){let _0x3e85e1=$dataSystem[_0x54579a(0xfc)];_0x3e85e1==='zh-TW'?ConfigManager[_0x54579a(0x116)]='tw':ConfigManager[_0x54579a(0x116)]='en';}const _0x17c0a7=ConfigManager['lang']||'tw',_0x2586fc=_0x17c0a7==='cn'||_0x17c0a7==='tw'||_0x17c0a7==='ja',_0x4da8dd=_0x17c0a7==='en';let _0x139e63='',_0x32f4ce='',_0x8fdeca=0x0,_0x2e4ea5=0x0;while(_0x2e4ea5<_0x471091[_0x54579a(0x1cc)]){let _0x34cccf=_0x471091[_0x2e4ea5],_0x1165ff='';if(_0x34cccf==='\x5c'||_0x34cccf==='\x1b'){let _0x57fdb3=this['extractEscapeSequence'](_0x471091,_0x2e4ea5);_0x1165ff=_0x57fdb3[_0x54579a(0x127)],_0x2e4ea5=_0x57fdb3['nextIndex'],_0x32f4ce+=_0x1165ff,_0x8fdeca=this[_0x54579a(0x10f)](_0x32f4ce);}else{if(_0x34cccf==='\x0a')_0x139e63+=_0x32f4ce+'\x0a',_0x32f4ce='',_0x8fdeca=0x0,_0x2e4ea5++;else{let _0x5b8b7a=this[_0x54579a(0x171)](_0x471091,_0x2e4ea5),_0x44e76f=_0x5b8b7a[_0x54579a(0x15f)],_0x38910c=this[_0x54579a(0x10f)](_0x32f4ce+_0x44e76f)-_0x8fdeca;if(_0x8fdeca+_0x38910c>_0x22f95e&&_0x32f4ce[_0x54579a(0x1cc)]>0x0){if(_0x2586fc)_0x139e63+=_0x32f4ce+'\x0a',_0x32f4ce=_0x34cccf,_0x8fdeca=this[_0x54579a(0x10f)](_0x32f4ce),_0x2e4ea5++;else{if(_0x4da8dd){const _0x4cd123=/[A-Za-z0-9]/[_0x54579a(0x12c)](_0x34cccf);_0x4cd123?_0x38910c>_0x22f95e?(_0x139e63+=_0x32f4ce+'\x0a',_0x32f4ce=_0x34cccf,_0x8fdeca=this[_0x54579a(0x10f)](_0x32f4ce),_0x2e4ea5++):(_0x139e63+=_0x32f4ce+'\x0a',_0x32f4ce=_0x44e76f,_0x8fdeca=this[_0x54579a(0x10f)](_0x32f4ce),_0x2e4ea5=_0x5b8b7a[_0x54579a(0x138)]):(_0x139e63+=_0x32f4ce+'\x0a',_0x32f4ce=_0x34cccf,_0x8fdeca=this['getStyledTextWidth'](_0x32f4ce),_0x2e4ea5++);}else _0x139e63+=_0x32f4ce+'\x0a',_0x32f4ce=_0x34cccf,_0x8fdeca=this['getStyledTextWidth'](_0x32f4ce),_0x2e4ea5++;}}else _0x4da8dd&&/[A-Za-z0-9]/['test'](_0x34cccf)&&_0x5b8b7a['word'][_0x54579a(0x1cc)]>0x1?(_0x32f4ce+=_0x44e76f,_0x8fdeca=this[_0x54579a(0x10f)](_0x32f4ce),_0x2e4ea5=_0x5b8b7a[_0x54579a(0x138)]):(_0x32f4ce+=_0x34cccf,_0x8fdeca=this[_0x54579a(0x10f)](_0x32f4ce),_0x2e4ea5++);}}}return _0x32f4ce[_0x54579a(0x1cc)]>0x0&&(_0x139e63+=_0x32f4ce),_0x139e63;},Window_Message[_0x42eb1e(0x103)]['getStyledTextWidth']=function(_0x5c2a5e=''){const _0x2e583d=_0x42eb1e;if(!_0x5c2a5e)return 0x0;let _0x359d08=0x0,_0x2e68fb=0x0;const _0x1bcbfc=this[_0x2e583d(0x1ce)][_0x2e583d(0x105)];while(_0x2e68fb<_0x5c2a5e[_0x2e583d(0x1cc)]){let _0x48c40b=_0x5c2a5e[_0x2e68fb];if(_0x48c40b==='\x5c'||_0x48c40b==='\x1b'){let _0x54a2a9=this[_0x2e583d(0x18e)](_0x5c2a5e,_0x2e68fb);const _0x463563=_0x54a2a9[_0x2e583d(0x127)],_0x25cb27=_0x463563[_0x2e583d(0x1cc)]>0x1?_0x463563[0x1]:'';if(_0x25cb27==='{'){if(this['contents'][_0x2e583d(0x105)]<0x60)this[_0x2e583d(0x1ce)]['fontSize']+=0xc;}else{if(_0x25cb27==='}'){if(this['contents'][_0x2e583d(0x105)]>0xc)this['contents'][_0x2e583d(0x105)]-=0xc;}else _0x359d08+=this[_0x2e583d(0x1d3)](_0x463563);}_0x2e68fb=_0x54a2a9[_0x2e583d(0x138)];}else _0x359d08+=this[_0x2e583d(0x179)](_0x48c40b)+_0x3b2050,_0x2e68fb++;}return this[_0x2e583d(0x1ce)][_0x2e583d(0x105)]=_0x1bcbfc,_0x359d08;},Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x178)]=function(_0x49ee0a=''){const _0x39435a=_0x42eb1e;return this[_0x39435a(0x10f)](_0x49ee0a);},Window_Message[_0x42eb1e(0x103)]['extractEscapeSequence']=function(_0x3c941b,_0x1c1d8c){const _0x56c051=_0x42eb1e;let _0x2b1261=_0x1c1d8c,_0x2a83e1=_0x3c941b[_0x2b1261];_0x2b1261++;if(_0x2b1261>=_0x3c941b['length'])return{'sequence':_0x2a83e1,'nextIndex':_0x2b1261};let _0x5200af=_0x3c941b[_0x2b1261][_0x56c051(0xdd)]();_0x2a83e1+=_0x5200af,_0x2b1261++;if('CVNPG'[_0x56c051(0x15c)](_0x5200af)||_0x5200af==='I'){if(_0x2b1261<_0x3c941b[_0x56c051(0x1cc)]&&_0x3c941b[_0x2b1261]==='['){_0x2a83e1+='[',_0x2b1261++;while(_0x2b1261<_0x3c941b[_0x56c051(0x1cc)]&&_0x3c941b[_0x2b1261]!==']'){_0x2a83e1+=_0x3c941b[_0x2b1261],_0x2b1261++;}_0x2b1261<_0x3c941b['length']&&_0x3c941b[_0x2b1261]===']'&&(_0x2a83e1+=']',_0x2b1261++);}}return{'sequence':_0x2a83e1,'nextIndex':_0x2b1261};},Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x1d3)]=function(_0x5a083a){const _0x3f9bb1=_0x42eb1e;if(_0x5a083a['match'](/\\I\[\d+\]|\x1bI\[\d+\]/i))return ImageManager[_0x3f9bb1(0xce)]+0x4;return 0x0;},Window_Message[_0x42eb1e(0x103)]['extractWord']=function(_0xe3a3b4,_0x3bf46a){const _0x32979f=_0x42eb1e;let _0x5e5299=_0x3bf46a,_0x8c4524='';const _0x56f935=ConfigManager['lang']||'ja',_0x3130cb=_0x56f935==='en';if(_0x3130cb&&/[A-Za-z0-9]/['test'](_0xe3a3b4[_0x5e5299]))while(_0x5e5299<_0xe3a3b4[_0x32979f(0x1cc)]&&/[A-Za-z0-9]/[_0x32979f(0x12c)](_0xe3a3b4[_0x5e5299])){_0x8c4524+=_0xe3a3b4[_0x5e5299],_0x5e5299++;}else _0x8c4524=_0xe3a3b4[_0x5e5299],_0x5e5299++;return{'word':_0x8c4524,'nextIndex':_0x5e5299};},Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x194)]=function(_0x1c91e0){const _0x22117b=_0x42eb1e;return this[_0x22117b(0x10f)](_0x1c91e0);};const _0x61791f=Window_Base[_0x42eb1e(0x103)][_0x42eb1e(0x1e2)];Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x1e2)]=function(_0x2947ae){const _0x2f2351=_0x42eb1e;if(_0x3b2050===0x0||_0x2947ae[_0x2f2351(0x1bd)]){_0x61791f['call'](this,_0x2947ae);return;}const _0x393ef8=_0x2947ae[_0x2f2351(0x1b6)];if(!_0x393ef8||_0x393ef8[_0x2f2351(0x1cc)]===0x0){_0x2947ae[_0x2f2351(0x1b6)]=this[_0x2f2351(0x10b)](_0x2947ae[_0x2f2351(0x1bd)]);return;}const _0x39bb07=_0x2947ae[_0x2f2351(0x15a)];for(let _0x355feb=0x0;_0x355feb<_0x393ef8[_0x2f2351(0x1cc)];_0x355feb++){const _0x20a205=_0x393ef8[_0x355feb],_0x4e0c04=this[_0x2f2351(0x179)](_0x20a205);_0x2947ae[_0x2f2351(0xe2)]&&this[_0x2f2351(0x1ce)][_0x2f2351(0x118)](_0x20a205,_0x2947ae['x'],_0x2947ae['y'],_0x4e0c04+_0x3b2050+0x8,_0x39bb07),_0x2947ae['x']+=_0x4e0c04+_0x3b2050;}_0x2947ae[_0x2f2351(0x1b6)]=this[_0x2f2351(0x10b)](_0x2947ae[_0x2f2351(0x1bd)]);};let _0x4444f1=Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x1e4)];Window_Message[_0x42eb1e(0x103)]['updateShowFast']=function(){const _0x2385fb=_0x42eb1e;_0x4444f1['call'](this),this[_0x2385fb(0xf4)]()&&(this[_0x2385fb(0xc5)]=!![],this['_pauseSkip']=!![]);},Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x1a2)]=function(_0x4646ea){const _0x448fea=_0x42eb1e,_0x203108=this[_0x448fea(0x1e5)]()-this[_0x448fea(0x1ce)][_0x448fea(0x105)],_0x4737fd=this['contents'][_0x448fea(0x105)],_0x4942fd=_0x4646ea[_0x448fea(0x126)][_0x448fea(0xf1)](_0x4646ea[_0x448fea(0x19e)])[_0x448fea(0x1d1)]('\x0a'),_0x58cfee=this[_0x448fea(0x131)](_0x4942fd[0x0])+_0x203108;return this[_0x448fea(0x1ce)]['fontSize']=_0x4737fd,_0x58cfee;};var _0x12245c=Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x1c2)];Window_Message[_0x42eb1e(0x103)]['updateInput']=function(){const _0x5c2876=_0x42eb1e;var _0x3896ed=_0x12245c[_0x5c2876(0x1c8)](this);if(window[_0x5c2876(0x141)]>0x0)return!![];if(this[_0x5c2876(0x1e9)]&&this[_0x5c2876(0xf4)]())return this[_0x5c2876(0x1e9)]=![],!this[_0x5c2876(0x19f)]&&this[_0x5c2876(0x134)](),!![];return _0x3896ed;},Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0xf4)]=function(){const _0x1a2267=_0x42eb1e;if(!_0x3242b2)return![];return Input[_0x1a2267(0xf7)](_0x1a2267(0xe8));},Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0xe9)]=function(_0x4b85c9){const _0x374d0c=_0x42eb1e,_0x318a48=_0x4b85c9[_0x374d0c(0x126)][_0x4b85c9[_0x374d0c(0x19e)]++];_0x318a48['charCodeAt'](0x0)<0x20?(this[_0x374d0c(0x1e2)](_0x4b85c9),this['processControlCharacter'](_0x4b85c9,_0x318a48)):(_0x2c61d7&&_0x6eb258&&(this[_0x374d0c(0x1f0)]>0x0&&this[_0x374d0c(0x1f0)]--,this[_0x374d0c(0x1f0)]<=0x0&&(AudioManager[_0x374d0c(0xf6)]({'name':_0x6eb258,'pan':0x0,'pitch':0x82,'volume':0xa}),this[_0x374d0c(0x1f0)]=0x3)),_0x4b85c9['buffer']+=_0x318a48);},Window_Message['prototype'][_0x42eb1e(0x110)]=function(){const _0x13e7d0=_0x42eb1e,_0x2cfc69=this[_0x13e7d0(0x19f)];if(_0x2cfc69){while(!this['isEndOfText'](_0x2cfc69)){this[_0x13e7d0(0xe5)](_0x2cfc69)&&this[_0x13e7d0(0xe0)](_0x2cfc69);this[_0x13e7d0(0x1e4)](),this[_0x13e7d0(0xe9)](_0x2cfc69);if(this[_0x13e7d0(0x1d8)](_0x2cfc69))break;}return this[_0x13e7d0(0x1e2)](_0x2cfc69),this['isEndOfText'](_0x2cfc69)&&!this[_0x13e7d0(0x12b)]()&&this[_0x13e7d0(0xfe)](),!![];}else return![];};let _0x5ccfeb=Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0xd4)];Window_Message['prototype']['startPause']=function(){_0x5ccfeb['call'](this);};let _0x253041=Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x18f)];Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x18f)]=function(){const _0x202c4a=_0x42eb1e;_0x253041[_0x202c4a(0x1c8)](this);},Window_Message['prototype']['closeBackFrame']=function(){const _0x379a7e=_0x42eb1e;this['_backFrame']&&(this[_0x379a7e(0x193)][_0x379a7e(0x16f)]=0x0,this['_backFrame'][_0x379a7e(0x132)]=0x0);},Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x14c)]=function(){const _0x3a3a77=_0x42eb1e;return _0x2fba29>0x0&&$gameSwitches[_0x3a3a77(0x121)](_0x2fba29);},Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x1d0)]=function(_0x3e4a23){const _0x4aef0f=_0x42eb1e;this['_backFrame']&&(this[_0x4aef0f(0x193)][_0x4aef0f(0x16f)]=this[_0x4aef0f(0x14c)]()?0x0:_0x3e4a23);},Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x181)]=function(){const _0x33a12d=_0x42eb1e;this[_0x33a12d(0x193)]&&this['isBackFrameForcedHidden']()&&(this[_0x33a12d(0x193)]['opacity']=0x0);};let _0x32caab=Window_Message['prototype'][_0x42eb1e(0x189)];;Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x189)]=function(_0x24722d){const _0x859554=_0x42eb1e;_0x32caab[_0x859554(0x1c8)](this,_0x24722d);;this['_backFrame']=new _0x565e2a();let _0x3b79df=ImageManager[_0x859554(0x1c7)](_0x14a456);_0x3b79df[_0x859554(0x113)](()=>{this['_backFrame']['bitmap']=_0x3b79df;}),_0x16dcc0===0x0&&this[_0x859554(0x1b0)](this[_0x859554(0x193)]),this[_0x859554(0x1f0)]=0x3;};let _0x46f8f8=Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x1a0)];Window_Message['prototype'][_0x42eb1e(0x1a0)]=function(){const _0x374427=_0x42eb1e;_0x46f8f8[_0x374427(0x1c8)](this),this[_0x374427(0x1ce)][_0x374427(0x105)]=msgSkin_fontSize,this['contents'][_0x374427(0x153)]=msgSkin_outlineColor,this[_0x374427(0x1ce)][_0x374427(0x1ef)]=msgSkin_outlineWidth;},Window_Message['prototype'][_0x42eb1e(0xe0)]=function(_0x398112){const _0x213efc=_0x42eb1e;this[_0x213efc(0x1ce)][_0x213efc(0xd2)](),this[_0x213efc(0x1a0)](),this[_0x213efc(0x11d)](),this[_0x213efc(0x1ad)](),this[_0x213efc(0x101)](),_0x398112['x']=_0x398112[_0x213efc(0x190)],_0x398112['y']=_0x247fdb,_0x398112[_0x213efc(0x15a)]=this[_0x213efc(0x1a2)](_0x398112);},Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x18b)]=function(){const _0x5c271c=_0x42eb1e,_0x21f1ee=$gameMessage[_0x5c271c(0xc2)](),_0x5ce8d=$gameMessage[_0x5c271c(0x195)](),_0x52c871=$gameMessage['isRTL'](),_0x314068=ImageManager[_0x5c271c(0xe6)],_0x40a564=this[_0x5c271c(0xc3)],_0x4761d2=(_0x52c871?this['innerWidth']-_0x314068-0x4:0x4)+_0x533ea4,_0x54d4de=_0x5e5339;this[_0x5c271c(0x1c4)](_0x21f1ee,_0x5ce8d,_0x4761d2,_0x54d4de,_0x314068,_0x40a564);};let _0x525766=Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x14f)];Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x14f)]=function(){_0x525766['call'](this);};let _0x3699d4=Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x115)];Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x115)]=function(){const _0x54ed7f=_0x42eb1e;_0x3699d4[_0x54ed7f(0x1c8)](this),this['updateBackFrameForceHide']();};let _0x5f0dad=Window_Message['prototype'][_0x42eb1e(0x18a)];Window_Message[_0x42eb1e(0x103)]['open']=function(){const _0xc74b7e=_0x42eb1e;!$gameSwitches[_0xc74b7e(0x121)](_0x13d33c)?this[_0xc74b7e(0x1d0)](0xff):this['setBackFrameOpacity'](0x0);if(_0x16dcc0===0x1&&!this[_0xc74b7e(0x193)]['parent']){const _0x360c62=this[_0xc74b7e(0x14a)]&&this[_0xc74b7e(0x14a)][_0xc74b7e(0x14a)];if(_0x360c62){const _0x50a2d9=_0x360c62['children'][_0xc74b7e(0x159)](this[_0xc74b7e(0x14a)]);_0x360c62['addChildAt'](this[_0xc74b7e(0x193)],_0x50a2d9>=0x0?_0x50a2d9:0x0);}}_0x16dcc0===0x1&&(this['_backFrame']['x']=this['x']+_0x1b7c22,this[_0xc74b7e(0x193)]['y']=this['y']+_0x29f9b6),_0x5f0dad[_0xc74b7e(0x1c8)](this);};let _0x349ec6=Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x140)];Window_Message['prototype']['setBackgroundType']=function(_0x3de6ef){const _0x42feca=_0x42eb1e;if($gameSwitches[_0x42feca(0x121)](_0x13d33c)==!![])this[_0x42feca(0x1d0)](0x0),_0x349ec6['call'](this,_0x3de6ef);else{this['setBackFrameOpacity'](0xff);if(this['_dimmerSprite'])this[_0x42feca(0x1d9)]['visible']=![];this[_0x42feca(0x16f)]=0x0;}};let _0x5d873a=Window_Message[_0x42eb1e(0x103)]['newLineX'];Window_Message['prototype'][_0x42eb1e(0x1af)]=function(_0x1a19ad){const _0x16ebd0=_0x42eb1e;let _0x29a8f2=_0x5d873a[_0x16ebd0(0x1c8)](this,_0x1a19ad);return _0x29a8f2+=_0x378eee,_0x29a8f2;};let _0x4d54f6=Window_Message[_0x42eb1e(0x103)]['updateOpen'];Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x187)]=function(){const _0x17148b=_0x42eb1e;_0x4d54f6[_0x17148b(0x1c8)](this),_0x16dcc0===0x0?this['_backFrame'][_0x17148b(0xd5)]=this[_0x17148b(0xd5)]:(this[_0x17148b(0x193)]['x']=this['x']+_0x1b7c22,this[_0x17148b(0x193)]['y']=this['y']+_0x29f9b6);};let _0x245230=Window_Message[_0x42eb1e(0x103)]['updateClose'];Window_Message[_0x42eb1e(0x103)]['updateClose']=function(){const _0x472154=_0x42eb1e;_0x245230[_0x472154(0x1c8)](this),_0x16dcc0===0x0?this[_0x472154(0x193)][_0x472154(0xd5)]=this[_0x472154(0xd5)]:(this['_backFrame']['x']=this['x']+_0x1b7c22,this[_0x472154(0x193)]['y']=this['y']+_0x29f9b6);};let _0x326dd7=Window_Message['prototype'][_0x42eb1e(0x124)];Window_Message[_0x42eb1e(0x103)][_0x42eb1e(0x124)]=function(){const _0x5587df=_0x42eb1e;_0x326dd7[_0x5587df(0x1c8)](this,...arguments),_0x16dcc0===0x1?(this['_backFrame']['x']=this['x']+_0x1b7c22,this['_backFrame']['y']=this['y']+_0x29f9b6):this[_0x5587df(0x193)]['x']=_0x1b7c22,_0x1d0270&&this[_0x5587df(0x18d)]===0x2&&(this['y']+=_0xe8484d);};let _0x1b4041=Window_NameBox[_0x42eb1e(0x103)][_0x42eb1e(0x189)];Window_NameBox[_0x42eb1e(0x103)]['initialize']=function(){const _0x4adbe6=_0x42eb1e;_0x1b4041[_0x4adbe6(0x1c8)](this),this[_0x4adbe6(0x1ee)]=new _0x2c68ff();if(_0x2fe282){let _0x194570=ImageManager[_0x4adbe6(0x1c7)](_0x2fe282);_0x194570['addLoadListener'](()=>{const _0x1896c8=_0x4adbe6;this[_0x1896c8(0x1ee)][_0x1896c8(0xc6)]=_0x194570;});}this['addChildToBack'](this[_0x4adbe6(0x1ee)],0x0),this['_nameBoxImage'][_0x4adbe6(0xd5)]=0xff,this[_0x4adbe6(0x1ee)]['x']=_0x161d77,this[_0x4adbe6(0x1ee)]['y']=_0x26b2a3,this[_0x4adbe6(0x16a)]();},Window_NameBox[_0x42eb1e(0x103)][_0x42eb1e(0x16a)]=function(){const _0x1adfca=_0x42eb1e;if(!this[_0x1adfca(0x1ee)])return;this[_0x1adfca(0x1ee)][_0x1adfca(0x16f)]=_0xe0537a()&&this[_0x1adfca(0x1ec)]?0xff:0x0;};let _0x54474d=Window_NameBox['prototype'][_0x42eb1e(0x1a0)];Window_NameBox[_0x42eb1e(0x103)][_0x42eb1e(0x1a0)]=function(){const _0x431b9d=_0x42eb1e;_0x54474d[_0x431b9d(0x1c8)](this),this['contents'][_0x431b9d(0x105)]=msgSkin_nameFontSize,this[_0x431b9d(0x1ce)]['outlineColor']=msgSkin_nameOutlineColor,this[_0x431b9d(0x1ce)]['outlineWidth']=msgSkin_nameOutlineWidth;},Window_NameBox['prototype'][_0x42eb1e(0x124)]=function(){const _0x1f3ff6=_0x42eb1e;this['width']=this[_0x1f3ff6(0x10a)](),this['height']=this[_0x1f3ff6(0x1df)]();const _0x51ee81=this[_0x1f3ff6(0xc4)];let _0x561362=this[_0x1f3ff6(0xf3)](this[_0x1f3ff6(0x1ec)])[_0x1f3ff6(0x129)];if(_0x1cec6f=='1')this['x']=_0x3044c4+-_0x561362/0x2,this['_nameBoxImage'][_0x1f3ff6(0x1ae)]['x']=0.5,this['_nameBoxImage']['x']=_0x161d77+this['width']/0x2;else _0x1cec6f=='2'?(this['x']=-_0x561362+_0x3044c4,this[_0x1f3ff6(0x1ee)]['anchor']['x']=0x1,this['_nameBoxImage']['x']=_0x161d77+this['width']):(this['x']=_0x3044c4,this[_0x1f3ff6(0x1ee)][_0x1f3ff6(0x1ae)]['x']=0x0,this[_0x1f3ff6(0x1ee)]['x']=_0x161d77);_0x51ee81['y']>0x0?this['y']=_0x51ee81['y']-this[_0x1f3ff6(0x15a)]:this['y']=_0x51ee81['y']+_0x51ee81[_0x1f3ff6(0x15a)],this['y']+=_0x427c39;},Window_NameBox[_0x42eb1e(0x103)][_0x42eb1e(0xcf)]=function(){const _0x208a10=_0x42eb1e,_0x174d57=this[_0x208a10(0x1c0)]();this[_0x208a10(0x1ce)][_0x208a10(0xd2)](),this['resetFontSettings']();let _0x4e683b='';try{_0x4e683b=LangManager[_0x208a10(0x126)](this[_0x208a10(0x1ec)])||'';}catch(_0x598f29){_0x4e683b=this[_0x208a10(0x1ec)]||'';}try{_0x4e683b=_0x4e683b[_0x208a10(0x148)](/\\/g,'\x1b'),_0x4e683b=_0x4e683b[_0x208a10(0x148)](/\x1b\x1b/g,'\x5c'),_0x4e683b=_0x4e683b[_0x208a10(0x148)](/\x1bT\[(\w+)\]/gi,(_0x2347bd,_0xbb06e6)=>{return _0xbb06e6;});}catch(_0x365088){}this['_name']=_0x4e683b;let _0x1ffeed=this[_0x208a10(0xf3)](this[_0x208a10(0x1ec)]),_0x3a706f=_0x1ffeed[_0x208a10(0x129)];this[_0x208a10(0x1b2)](_0x4e683b,(this[_0x208a10(0x1ce)]['width']-_0x3a706f)/0x2,_0x174d57['y'],_0x174d57[_0x208a10(0x129)]);};let _0x32ed52=Window_NameBox[_0x42eb1e(0x103)][_0x42eb1e(0x13e)];Window_NameBox[_0x42eb1e(0x103)][_0x42eb1e(0x13e)]=function(){const _0x3858e9=_0x42eb1e;$gameSwitches[_0x3858e9(0x121)](_0x13d33c)?_0x32ed52[_0x3858e9(0x1c8)](this):this[_0x3858e9(0x140)](0x2);};let _0x56385a=Window_NameBox[_0x42eb1e(0x103)][_0x42eb1e(0x187)];Window_NameBox['prototype']['updateOpen']=function(){const _0xc0edb=_0x42eb1e;_0x56385a[_0xc0edb(0x1c8)](this),this['_nameBoxImage'][_0xc0edb(0xd5)]=this['openness'];};let _0x4b1941=Window_NameBox[_0x42eb1e(0x103)]['updateClose'];Window_NameBox['prototype']['updateClose']=function(){const _0x4f6b0d=_0x42eb1e;_0x4b1941['call'](this),this[_0x4f6b0d(0x1ee)][_0x4f6b0d(0xd5)]=this[_0x4f6b0d(0xd5)];};let _0x4e4cb2=Window_NameBox['prototype'][_0x42eb1e(0x170)];Window_NameBox[_0x42eb1e(0x103)][_0x42eb1e(0x170)]=function(_0x230192){const _0x22e5be=_0x42eb1e;_0x230192=_0x47280e(_0x230192);try{_0x230192=LangManager[_0x22e5be(0x126)](_0x230192);}catch(_0x2990c6){}_0x230192=_0x230192||'',_0x4e4cb2[_0x22e5be(0x1c8)](this,_0x230192);};let _0x233b40=Window_NameBox['prototype'][_0x42eb1e(0x10a)];Window_NameBox[_0x42eb1e(0x103)][_0x42eb1e(0x10a)]=function(){const _0x1d7a28=_0x42eb1e;let _0x4ff004=_0x233b40['call'](this);return this[_0x1d7a28(0x1ee)]&&(this[_0x1d7a28(0x1ee)][_0x1d7a28(0x16f)]=_0x4ff004>0x0&&_0xe0537a()?0xff:0x0),_0x4ff004;},Scene_Message['prototype'][_0x42eb1e(0x102)]=function(){const _0x521c75=_0x42eb1e;this[_0x521c75(0x1a9)]=new Window_NameBox(),this[_0x521c75(0x1a6)](this[_0x521c75(0x1a9)]);},Scene_Message[_0x42eb1e(0x103)][_0x42eb1e(0x117)]=function(){const _0x3af564=_0x42eb1e;this[_0x3af564(0x1c6)]=new Window_ChoiceList(),this[_0x3af564(0x1a6)](this[_0x3af564(0x1c6)]);};class _0x565e2a extends Sprite{get[_0x42eb1e(0xd5)](){const _0x2021c6=_0x42eb1e;return this[_0x2021c6(0x132)]||0x0;}set[_0x42eb1e(0xd5)](_0x183ad0){const _0x2b547e=_0x42eb1e;this['_openness']!==_0x183ad0&&(this['_openness']=_0x183ad0[_0x2b547e(0x16c)](0x0,0xff),this['y']=_0x29f9b6);}}class _0x2c68ff extends Sprite{get[_0x42eb1e(0xd5)](){const _0x5948fb=_0x42eb1e;return this[_0x5948fb(0x132)]||0x0;}set[_0x42eb1e(0xd5)](_0xcb687c){const _0x247634=_0x42eb1e;this[_0x247634(0x132)]!==_0xcb687c&&(this['_openness']=_0xcb687c[_0x247634(0x16c)](0x0,0xff),this['scale']['y']=this[_0x247634(0x132)]/0xff,this['y']=this[_0x247634(0x15a)]/0x2*(0x1-this[_0x247634(0x132)]/0xff)+_0x26b2a3);}}let _0x1f9f53=Scene_Message[_0x42eb1e(0x103)][_0x42eb1e(0xeb)];Scene_Message[_0x42eb1e(0x103)][_0x42eb1e(0xeb)]=function(){const _0x5356ff=_0x42eb1e;let _0x158dc7=_0x1f9f53[_0x5356ff(0x1c8)](this);return _0x158dc7[_0x5356ff(0x15a)]+=_0x247fdb+0x3,_0x158dc7;};function _0x47280e(_0x13cbae){const _0x577573=_0x42eb1e;try{_0x13cbae=_0x13cbae[_0x577573(0x148)](/(?:\\|\x1b)Say\[([^\]]+)\]/gi,(_0x1e2ac8,_0x154937)=>_0x154937),_0x13cbae=MulitLanguageArgs[_0x577573(0xca)](_0x13cbae);}catch(_0x22a76d){}return _0x13cbae;}})());var a;function testBack(){const _0x11b18a=a0_0x2f90;let _0xc1c692=new Sprite();_0xc1c692['opacity']=0x64;let _0x3ac373=ImageManager[_0x11b18a(0x1c7)](_0x11b18a(0x143));_0x3ac373[_0x11b18a(0x113)](()=>{const _0x3a959e=_0x11b18a;_0xc1c692[_0x3a959e(0xc6)]=_0x3ac373,SceneManager[_0x3a959e(0x1d4)][_0x3a959e(0x1a6)](_0xc1c692);;});}var chimakiMsgSkinParams=chimakiMsgSkinParams||{};((()=>{const _0x24cce6=a0_0x2f90,{choiceImageNormal:_0x1fe775,choiceImageHover:_0x1cea7c,imageHeight:_0x41cdda,choiceFontSize:_0x13d182,choiceTextColor:_0x50dc77,choiceOutlineWidth:_0x147edd,enableTouch:_0x3f7d3b,centerYOffset:_0x8979ed,enableChoice:_0x20ffd7,choiceHoverScale:_0x397ff7,choiceHoverSeName:_0x3b76cf,choiceHoverSeVolume:_0x12003e,choiceHoverSePitch:_0x5402cd,choiceHoverSePan:_0x2aa45a}={...chimakiMsgSkinParams};if(!_0x20ffd7)return;const _0x1e660c=_0x41cdda||0x4c,_0x2a0140=_0x3f7d3b||![],_0x534b74=_0x8979ed||0x28,_0x1fca3c=_0x1fe775||_0x24cce6(0x1e3),_0x2467be=_0x1cea7c||'option_hover',_0x58221f=Number(_0x13d182)||0x1c,_0x5318e5=String(_0x50dc77||_0x24cce6(0x158)),_0x580832=Number(_0x147edd),_0x44624f=Number[_0x24cce6(0x139)](_0x580832)?_0x580832:0x3,_0x50b3af=Number(_0x397ff7)||1.05,_0x8f463a=String(_0x3b76cf||''),_0x2d264b=Number(_0x12003e)||0x5a,_0x561914=Number(_0x5402cd)||0x64,_0x2e8a3e=Number(_0x2aa45a)||0x0,_0x4b353b=0x20;class _0x42e812 extends Sprite{[_0x24cce6(0x189)](){const _0x5af091=_0x24cce6;super['initialize'](...arguments),this[_0x5af091(0x192)]=new Window_Base(new Rectangle(0x0,0x0,0x1,0x1)),this[_0x5af091(0x1ae)][_0x5af091(0xec)](0.5),this[_0x5af091(0x1de)]=new Bitmap(0x1,0x1),this[_0x5af091(0x1db)]=new Bitmap(0x1,0x1),this[_0x5af091(0xcc)]='',this['_choiceOpenness']=0x0,this['_opening']=![],this[_0x5af091(0xc0)]=![],this[_0x5af091(0x11f)]=0x1,this[_0x5af091(0x1ea)][_0x5af091(0xec)](0x1,0x0),this[_0x5af091(0x154)](![]),this[_0x5af091(0xfa)](),this['createText']();}[_0x24cce6(0x115)](){const _0x215014=_0x24cce6;super[_0x215014(0x115)](),this[_0x215014(0x187)](),this['updateClose']();}[_0x24cce6(0x18a)](){const _0xf35219=_0x24cce6;this[_0xf35219(0x112)]=!![],this['setPointerInteractionEnabled'](![]),this[_0xf35219(0xe1)]=!![],this[_0xf35219(0xc0)]=![],this['_choiceOpenness']=0x0,this[_0xf35219(0x136)]();}[_0x24cce6(0x14f)](){const _0x59d803=_0x24cce6;this[_0x59d803(0x154)](![]),this[_0x59d803(0xe1)]=![],this[_0x59d803(0xc0)]=!![],this[_0x59d803(0x136)]();}['updateOpen'](){const _0x2f596d=_0x24cce6;if(!this['_opening'])return;this[_0x2f596d(0x17f)]=Math[_0x2f596d(0x172)](this[_0x2f596d(0x17f)]+_0x4b353b,0xff),this[_0x2f596d(0xef)]();if(this[_0x2f596d(0x17f)]>=0xff){this[_0x2f596d(0xe1)]=![];if(_0x2a0140)this[_0x2f596d(0x154)](!![]);}}['updateClose'](){const _0x4cf42b=_0x24cce6;if(!this[_0x4cf42b(0xc0)])return;this['_choiceOpenness']=Math[_0x4cf42b(0x13d)](this[_0x4cf42b(0x17f)]-_0x4b353b,0x0),this[_0x4cf42b(0xef)](),this[_0x4cf42b(0x17f)]<=0x0&&(this['_closing']=![],this[_0x4cf42b(0x112)]=![]);}[_0x24cce6(0xef)](){const _0x595fd8=_0x24cce6;this[_0x595fd8(0x1ea)]['x']=this[_0x595fd8(0x11f)],this[_0x595fd8(0x1ea)]['y']=this[_0x595fd8(0x11f)]*this[_0x595fd8(0x17f)]/0xff;}[_0x24cce6(0x154)](_0x19595b){const _0x442cbe=_0x24cce6;this[_0x442cbe(0x1ac)]=!!_0x19595b,'eventMode'in this&&(this['eventMode']=_0x19595b?_0x442cbe(0xee):_0x442cbe(0xd0));}[_0x24cce6(0x136)](){const _0x362a92=_0x24cce6;this['_over']=![],this['_down']=![],this[_0x362a92(0x11f)]=0x1,this[_0x362a92(0xc6)]=this[_0x362a92(0x1de)],this[_0x362a92(0xef)]();}['isChoiceOpen'](){const _0x42ad78=_0x24cce6;return this['_choiceOpenness']>=0xff&&!this[_0x42ad78(0xc0)];}[_0x24cce6(0x1a0)](){const _0x2313f2=_0x24cce6;this[_0x2313f2(0x1de)]&&(this['_normalBitmap'][_0x2313f2(0x105)]=_0x58221f,this[_0x2313f2(0x1de)]['fontFace']=$gameSystem[_0x2313f2(0x114)](),this[_0x2313f2(0x1de)][_0x2313f2(0x1b9)]=_0x5318e5,this[_0x2313f2(0x1de)]['outlineWidth']=_0x44624f),this[_0x2313f2(0x1db)]&&(this[_0x2313f2(0x1db)][_0x2313f2(0x105)]=_0x58221f,this['_hoverBitmap'][_0x2313f2(0x19d)]=$gameSystem[_0x2313f2(0x114)](),this[_0x2313f2(0x1db)]['textColor']=_0x5318e5,this[_0x2313f2(0x1db)][_0x2313f2(0x1ef)]=_0x44624f),this[_0x2313f2(0x13c)]&&this[_0x2313f2(0x13c)][_0x2313f2(0x1a0)]();}[_0x24cce6(0x14e)](){const _0x453f0a=_0x24cce6,_0x37dd71=this[_0x453f0a(0xea)]();this['_text']&&(this[_0x453f0a(0x17d)](this[_0x453f0a(0x13c)]),this[_0x453f0a(0x13c)]['destroy']({'children':!![]}));const _0x3e0ee4=Math['max'](0x3c,_0x58221f+_0x44624f*0x2+0x18);this['_text']=new Window_Base(new Rectangle(0x0,0x0,_0x37dd71,_0x3e0ee4)),this[_0x453f0a(0x13c)][_0x453f0a(0x1a0)]=function(){const _0x341ea7=_0x453f0a;Window_Base[_0x341ea7(0x103)][_0x341ea7(0x1a0)]['call'](this),this[_0x341ea7(0x1ce)][_0x341ea7(0x105)]=_0x58221f,this[_0x341ea7(0x1ce)][_0x341ea7(0x1b9)]=_0x5318e5,this[_0x341ea7(0x1ce)][_0x341ea7(0x1ef)]=_0x44624f;},this['_text'][_0x453f0a(0x140)](0x2),this[_0x453f0a(0x13c)]['frameVisible']=![],this['_text'][_0x453f0a(0xc7)]&&this['_text']['removeChild'](this['_text'][_0x453f0a(0xc7)]),this['_text'][_0x453f0a(0x160)]&&this['_text']['removeChild'](this[_0x453f0a(0x13c)][_0x453f0a(0x160)]),this[_0x453f0a(0x13c)][_0x453f0a(0x14b)]&&this['_text'][_0x453f0a(0x17d)](this[_0x453f0a(0x13c)]['_upArrowSprite']),this['_text']['x']=-_0x37dd71/0x2,this[_0x453f0a(0x13c)]['y']=-this['_text'][_0x453f0a(0x15a)]/0x2,this[_0x453f0a(0x1a6)](this[_0x453f0a(0x13c)]),this[_0x453f0a(0xcc)]&&this[_0x453f0a(0x1a7)](this[_0x453f0a(0xcc)]);}[_0x24cce6(0xea)](){const _0x47de21=_0x24cce6,_0x563d02=this[_0x47de21(0x1de)]&&this[_0x47de21(0x1de)][_0x47de21(0x129)]>0x1?this[_0x47de21(0x1de)]:this[_0x47de21(0xc6)];return _0x563d02&&_0x563d02['width']>0x1?_0x563d02[_0x47de21(0x129)]:Graphics['width'];}[_0x24cce6(0x1a7)](_0x3b34d8){const _0x561a7b=_0x24cce6;this[_0x561a7b(0xcc)]=_0x3b34d8,this['_text'][_0x561a7b(0x1ce)]['clear'](),this[_0x561a7b(0x13c)]['resetFontSettings']();const _0x5780ca=this[_0x561a7b(0x13c)][_0x561a7b(0xf3)](_0x3b34d8),_0x5ed7fa=(this[_0x561a7b(0x13c)][_0x561a7b(0xc9)]()-_0x5780ca['width'])/0x2,_0x46bb06=Math['max']((this['_text'][_0x561a7b(0xf8)]()-_0x5780ca[_0x561a7b(0x15a)])/0x2,0x0);this[_0x561a7b(0x13c)][_0x561a7b(0x1b2)](_0x3b34d8,_0x5ed7fa,_0x46bb06,this[_0x561a7b(0x13c)]['contentsWidth']());}[_0x24cce6(0xfa)](){const _0x318dd2=_0x24cce6;this['on']('pointerover',this[_0x318dd2(0x182)][_0x318dd2(0x197)](this)),this['on'](_0x318dd2(0x130),this['onUp']['bind'](this)),this['on'](_0x318dd2(0x1e1),this[_0x318dd2(0x169)][_0x318dd2(0x197)](this)),this['on'](_0x318dd2(0x10e),this[_0x318dd2(0x123)][_0x318dd2(0x197)](this)),this['on']('pointermove',this['onMove']['bind'](this)),this['on'](_0x318dd2(0x17e),this[_0x318dd2(0x16b)][_0x318dd2(0x197)](this));}[_0x24cce6(0x15e)](_0x5e531b,_0x5d28b4){const _0x5263de=_0x24cce6;this[_0x5263de(0x15d)]=_0x5d28b4,this[_0x5263de(0x1b1)]=_0x5e531b;}[_0x24cce6(0x1d5)](){const _0x109b16=_0x24cce6;return this[_0x109b16(0x184)];}[_0x24cce6(0x177)](){const _0x3512c3=_0x24cce6;return this[_0x3512c3(0x1e7)];}['isUp'](){const _0x440b09=_0x24cce6;return!this[_0x440b09(0x1e7)];}['isHover'](){const _0x50e15f=_0x24cce6;return this[_0x50e15f(0x184)]&&!this[_0x50e15f(0x1e7)];}[_0x24cce6(0xf7)](){const _0x2d1aa8=_0x24cce6;return this[_0x2d1aa8(0x184)]&&this[_0x2d1aa8(0x1e7)];}['onOver'](){const _0x41b767=_0x24cce6,_0x20858c=this[_0x41b767(0x184)];this[_0x41b767(0x1b1)]&&(this[_0x41b767(0x1b1)][_0x41b767(0x107)](),this[_0x41b767(0x1b1)][_0x41b767(0xd3)](this[_0x41b767(0x15d)])),this[_0x41b767(0x184)]=!![],this[_0x41b767(0x11f)]=_0x50b3af,this['updateTransitionScale'](),this['bitmap']=this[_0x41b767(0x1db)],!_0x20858c&&_0x8f463a&&AudioManager[_0x41b767(0xf6)]({'name':_0x8f463a,'volume':_0x2d264b,'pitch':_0x561914,'pan':_0x2e8a3e});}[_0x24cce6(0x183)](_0x1979bc){const _0x2b4e95=_0x24cce6;this[_0x2b4e95(0xdc)]&&this[_0x2b4e95(0xdc)](),this[_0x2b4e95(0x1e7)]=![];}[_0x24cce6(0x169)](){const _0x371472=_0x24cce6;this[_0x371472(0x1e7)]=!![];}[_0x24cce6(0x123)](){const _0x2bfc95=_0x24cce6;this['_over']=![],this['_down']=![],this[_0x2bfc95(0x11f)]=0x1,this[_0x2bfc95(0xef)](),this[_0x2bfc95(0xc6)]=this['_normalBitmap'];}[_0x24cce6(0x1e0)](){const _0x5a0a92=_0x24cce6;this[_0x5a0a92(0x1e7)]=![];}[_0x24cce6(0x16b)](){this['_down']=![];}[_0x24cce6(0x188)](_0x37f7a0){const _0x176eac=_0x24cce6;this[_0x176eac(0xdc)]=_0x37f7a0;}[_0x24cce6(0x122)](_0x40ae39,_0x4b7728){const _0x38bb72=_0x24cce6;let _0x2df94c=ImageManager[_0x38bb72(0x1c7)](_0x1fca3c),_0x581e5c=ImageManager['loadSystem'](_0x2467be);_0x2df94c[_0x38bb72(0x113)](()=>{const _0xd588aa=_0x38bb72;this[_0xd588aa(0xc6)]=_0x2df94c,this[_0xd588aa(0x1de)]=_0x2df94c,this[_0xd588aa(0x14e)]();}),_0x581e5c[_0x38bb72(0x113)](()=>{const _0x1ce357=_0x38bb72;this[_0x1ce357(0x1db)]=_0x581e5c;});}}let _0x32c9db=Window_ChoiceList[_0x24cce6(0x103)][_0x24cce6(0x189)];Window_ChoiceList[_0x24cce6(0x103)]['initialize']=function(_0x1f1cf6){const _0x506522=_0x24cce6;this[_0x506522(0x1dc)]=[],_0x32c9db[_0x506522(0x1c8)](this,_0x1f1cf6),this[_0x506522(0x106)]();};let _0x392c0f=Window_ChoiceList[_0x24cce6(0x103)][_0x24cce6(0x186)];Window_ChoiceList[_0x24cce6(0x103)][_0x24cce6(0x186)]=function(){const _0x518725=_0x24cce6,_0x4e547f=this['_showList']&&this[_0x518725(0x1a4)][_0x518725(0x135)](_0x1257b1=>!_0x1257b1['isChoiceOpen']());if(!_0x4e547f)_0x392c0f[_0x518725(0x1c8)](this);},Window_ChoiceList['prototype']['createCancelButton']=function(){const _0x5f5d8b=_0x24cce6;ConfigManager[_0x5f5d8b(0x17c)]&&(this['_cancelButton']=new Sprite_Button(_0x5f5d8b(0x144)),this[_0x5f5d8b(0xbf)]['visible']=![]);},Window_ChoiceList['prototype'][_0x24cce6(0x108)]=function(){const _0x5df79f=_0x24cce6;this[_0x5df79f(0xc7)]=new Sprite();},Window_ChoiceList[_0x24cce6(0x103)][_0x24cce6(0x1b5)]=function(){const _0x2f5965=_0x24cce6;this[_0x2f5965(0x160)]=new Sprite(),this[_0x2f5965(0x14b)]=new Sprite();},Window_ChoiceList[_0x24cce6(0x103)][_0x24cce6(0x107)]=function(){const _0x337da7=_0x24cce6;this[_0x337da7(0x1a4)]&&this[_0x337da7(0x1a4)][_0x337da7(0x1cc)]>0x0&&this[_0x337da7(0x1a4)][_0x337da7(0xff)](_0x32974e=>{const _0x1b4106=_0x337da7;_0x32974e[_0x1b4106(0x123)]();});};let _0x1ab7c2=Window_ChoiceList[_0x24cce6(0x103)]['select'];Window_ChoiceList[_0x24cce6(0x103)]['select']=function(_0x57d102){const _0xd61383=_0x24cce6;_0x1ab7c2[_0xd61383(0x1c8)](this,_0x57d102);;if(!this[_0xd61383(0x1a4)])return;this['_showList']['forEach'](_0x1d9e61=>{const _0x3e70e2=_0xd61383;_0x1d9e61[_0x3e70e2(0xc6)]=this[_0x3e70e2(0x1dc)][_0x1d9e61[_0x3e70e2(0x15d)]][_0x3e70e2(0x1de)];});let _0x282542=this['_showList'][_0x57d102];_0x282542&&(_0x282542[_0xd61383(0xc6)]=this[_0xd61383(0x1dc)][_0x282542[_0xd61383(0x15d)]]['_hoverBitmap']);},Window_ChoiceList[_0x24cce6(0x103)]['updatePlacement']=function(){const _0x2c8cdb=_0x24cce6;this['x']=Graphics[_0x2c8cdb(0x11a)]/0x2,this['y']=Graphics[_0x2c8cdb(0xfd)]/0x2;},Window_ChoiceList[_0x24cce6(0x103)]['createSelectImage']=function(){const _0x8524d5=_0x24cce6;this['_selectContainer']=new Sprite(),this[_0x8524d5(0x1a6)](this[_0x8524d5(0x155)]);for(let _0x153297=0x0;_0x153297<0x6;_0x153297++){let _0x4a12d3=new _0x42e812();_0x4a12d3[_0x8524d5(0x15e)](this,_0x153297),_0x4a12d3[_0x8524d5(0x122)]('option','option_hover'),_0x4a12d3['x']=0x0,_0x4a12d3['y']=0x0,_0x4a12d3['visible']=![],_0x4a12d3[_0x8524d5(0x154)](![]),this[_0x8524d5(0x1dc)]['push'](_0x4a12d3),this[_0x8524d5(0x155)][_0x8524d5(0x1a6)](_0x4a12d3);}},Window_ChoiceList[_0x24cce6(0x103)][_0x24cce6(0x1cf)]=function(){const _0x154a9c=_0x24cce6;if(!this[_0x154a9c(0x1dc)])return;this[_0x154a9c(0x1dc)]['forEach'](_0x3904bd=>{const _0xe06b35=_0x154a9c;_0x3904bd[_0xe06b35(0x154)](![]),_0x3904bd[_0xe06b35(0x136)]();});};let _0x348c52=Window_ChoiceList[_0x24cce6(0x103)]['callOkHandler'];Window_ChoiceList[_0x24cce6(0x103)]['callOkHandler']=function(){const _0x4ad482=_0x24cce6;if(!this[_0x4ad482(0x1a4)]||this[_0x4ad482(0x1a4)][_0x4ad482(0x1cc)]===0x0){_0x348c52[_0x4ad482(0x1c8)](this);return;}this[_0x4ad482(0x1cf)](),this[_0x4ad482(0x1dc)][_0x4ad482(0xff)](_0x16b022=>_0x16b022[_0x4ad482(0x14f)]()),_0x348c52[_0x4ad482(0x1c8)](this),this[_0x4ad482(0x176)]&&(document[_0x4ad482(0x12d)][_0x4ad482(0x1be)](_0x4ad482(0x17e),this[_0x4ad482(0x176)]),this[_0x4ad482(0x176)]=null);};let _0x262dac=Window_ChoiceList[_0x24cce6(0x103)][_0x24cce6(0xde)];Window_ChoiceList[_0x24cce6(0x103)][_0x24cce6(0xde)]=function(){const _0x3654a0=_0x24cce6;if(!this[_0x3654a0(0x1a4)]||this['_showList'][_0x3654a0(0x1cc)]===0x0){_0x262dac[_0x3654a0(0x1c8)](this,...arguments);return;}this[_0x3654a0(0x1cf)](),this[_0x3654a0(0x1dc)][_0x3654a0(0xff)](_0x2b1701=>_0x2b1701['close']()),_0x262dac[_0x3654a0(0x1c8)](this,...arguments),this[_0x3654a0(0x176)]&&(document[_0x3654a0(0x12d)][_0x3654a0(0x1be)](_0x3654a0(0x17e),this[_0x3654a0(0x176)]),this[_0x3654a0(0x176)]=null);};let _0x196a6e=Window_ChoiceList[_0x24cce6(0x103)][_0x24cce6(0x14f)];Window_ChoiceList[_0x24cce6(0x103)]['close']=function(){const _0x45efea=_0x24cce6;this[_0x45efea(0x1cf)](),_0x196a6e['call'](this);},Window_ChoiceList[_0x24cce6(0x103)]['makeCommandList']=function(){const _0x3aeb1c=_0x24cce6;this[_0x3aeb1c(0x176)]&&(document[_0x3aeb1c(0x12d)]['removeEventListener'](_0x3aeb1c(0x17e),this[_0x3aeb1c(0x176)]),this[_0x3aeb1c(0x176)]=null);this[_0x3aeb1c(0x176)]=_0x24f4a5=>{const _0x2234c1=_0x3aeb1c;_0x24f4a5[_0x2234c1(0x165)]===0x2&&(SoundManager[_0x2234c1(0x164)](),this[_0x2234c1(0xe7)](),this[_0x2234c1(0x162)](),this['callCancelHandler']());},document[_0x3aeb1c(0x12d)][_0x3aeb1c(0x1f1)]('click',this[_0x3aeb1c(0x176)]),this[_0x3aeb1c(0x1dc)][_0x3aeb1c(0xff)](_0x4f832c=>{const _0x59f0fa=_0x3aeb1c;_0x4f832c[_0x59f0fa(0x112)]=![],_0x4f832c[_0x59f0fa(0x17f)]=0x0,_0x4f832c[_0x59f0fa(0x154)](![]),_0x4f832c[_0x59f0fa(0x136)]();}),this[_0x3aeb1c(0x1a4)]=[];var _0x219f80=$gameMessage[_0x3aeb1c(0x1ba)]();for(let _0x38426e=0x0;_0x38426e<_0x219f80['length'];_0x38426e++){let _0x3b1ebf=_0x219f80[_0x38426e];while(_0x3b1ebf['match'](/\x1bV\[(\d+)\]/gi)){_0x3b1ebf=_0x3b1ebf[_0x3aeb1c(0x148)](/\x1bV\[(\d+)\]/gi,(_0x23fb15,_0x5cee0e)=>$gameVariables[_0x3aeb1c(0x121)](parseInt(_0x5cee0e)));}this['addCommand'](_0x3b1ebf,_0x3aeb1c(0x1b8));if(!$gameMessage[_0x3aeb1c(0x1c5)]){let _0x48444b=this['_selectImgList'][_0x38426e];;if(!_0x48444b)continue;_0x48444b[_0x3aeb1c(0x1a7)](_0x3b1ebf),_0x48444b['resetFontSettings'](),_0x48444b[_0x3aeb1c(0x188)](_0x1146b7=>{const _0x2e5b97=_0x3aeb1c;this[_0x2e5b97(0xd3)](_0x38426e),this[_0x2e5b97(0x150)](),this[_0x2e5b97(0xe7)](),this[_0x2e5b97(0x162)](),this['callOkHandler']();}),_0x48444b[_0x3aeb1c(0x18a)](),this[_0x3aeb1c(0x1a4)][_0x3aeb1c(0xed)](_0x48444b);}}let _0x9f63e6=this['_showList'][_0x3aeb1c(0x1cc)],_0xbb98f1=_0x1e660c,_0x2d3a78=_0xbb98f1*_0x9f63e6,_0x327c9a=-_0x2d3a78/0x2+_0xbb98f1/0x2+_0x534b74;this['_showList'][_0x3aeb1c(0xff)]((_0x50d5a3,_0x4aece8)=>{_0x50d5a3['y']=_0x327c9a+_0x4aece8*_0xbb98f1;});};})());