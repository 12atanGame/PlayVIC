//==========================================================================
// EliMZ_PictureManager.js
//==========================================================================

/*:
@target MZ
@base EliMZ_Book

@plugindesc ♦1.4.5♦ Implements a new and powerful picture system!
@author Hakuen Studio
@url https://docs.google.com/document/d/1c3RTP3-L57nTEmnxpWtmxRH7RaeLSWlB9KiaJ9s_njU/edit?usp=sharing

@help
↑↑↑ HOW TO USE / HELP FILE ABOVE ↑↑↑

★★★★★ → Rate the plugin! Please, is very important to me ^^
https://hakuenstudio.itch.io/hakuen-studio-picture-manager-for-rpg-maker-mz/rate?source=game

♦ TERMS OF USE
https://www.hakuenstudio.com/terms-of-use-5-0-0

♦ DOWNLOAD
https://hakuenstudio.itch.io/hakuen-studio-picture-manager-for-rpg-maker-mz

♦ SUPPORT
https://hakuenstudio.itch.io/hakuen-studio-picture-manager-for-rpg-maker-mz/community

♦ FEATURES
- Show and Move pictures at the same time!
- Show pictures on different layers:
    - Default
    - Below Weather
    - Below Windows
    - Above Windows
    - Above Everything
- You can Bind pictures to the map or to the screen!
- Apply Mask images or shapes to the pictures!
- Show pictures positions relative to another game object!
- Plays a common event when clicking/touching a picture, enters the mouse 
above a picture, leaves the mouse out of a picture!
- Change all these picture settings, using easing animations:
- Anchor, Blend mode, X, Y, Opacity, Scale, Skew, Angle and Rotation, 
Tone Color, Blend Color, and Hue.
- You can make picture animations loop from initial to target values!
- Set Breath, Float, Shake, and Card effects to the pictures!
- Move and change settings for multiple pictures at the same time!
- Erase one or more pictures at the same time!
- Apply filters to the pictures!
- You can use variables to set values on the arguments of almost all 
plugin commands!

@param clickVariable
@text Clicked Picture Id
@type variable
@desc This variable will store the last clicked picture id.
@default 0

@param mouseEnterVariable
@text Mouse Enter Picture Id
@type variable
@desc This variable will store the picture id when the mouse starts hovering the picture.
@default 0

@param mouseExitVariable
@text Mouse Exit Picture Id
@type variable
@desc This variable will store the picture id when the mouse stops hovering the picture
@default 0

@param touchOpacity
@text Touch opacity
@type number
@min 0
@max 255
@desc For the mouse/touch operations to work, the picture area must have an opacity value equal or higher than that.
@default 0

@command cmd_fullShow
@text Full Show Picture
@desc A complete command to show a picture on the screen.

    @arg filename
    @text Filename
    @type file
    @dir img/pictures
    @desc The filename of the picture. Accept \v[id]
    @default

    @arg id
    @text ID
    @type text
    @desc The id of the picture. Can be a number or text. Is case-sensitive. Accept \v[id]
    @default 1

    @arg groupName
    @text Group Name
    @type text
    @desc It is NOT case-sensitive. Don't use numbers or spaces. Accept \v[id]
    @default 

    @arg mainSettings
    @text Main Settings
    @type struct<mainSt>
    @desc The main settings of the picture, like coordinates, opacity, etc.
    @default {"anchor":"UpperLeft","blendMode":"Normal","Default Anime Settings":"","duration":"1","easing":"linear","loop":"0","direction":"normal","separator1":"","initialAlignX":"left","initialOffsetX":"0","initialAlignY":"top","initialOffsetY":"0","initialAlpha":"0","initialScale":"1, 1","initialSkew":"0, 0","initialAngleRotation":"0, 0","initialTone":"0, 0, 0, 0","initialBlendColor":"0, 0, 0, 0","initialHue":"0","enableTarget":"true","targetAlignX":"left","targetOffsetX":"0","targetAlignY":"top","targetOffsetY":"0","targetAlpha":"1","targetScale":"1, 1","targetSkew":"0, 0","targetAngleRotation":"0, 0","targetTone":"0, 0, 0, 0","targetBlendColor":"0, 0, 0, 0","targetHue":"0"}

    @arg mask
    @text Mask
    @type struct<maskSt>
    @desc A mask image or shape to be on the picture.
    @default {"type":"none","image":"","alignX":"left","alignY":"top","offsetX":"0","offsetY":"0","- Only Works for Type Masks -":"","size":"200, 200","circleRadius":"90","roundedRectBorder":"20","starEdges":"5","starOuterRadius":"90","starInnerRadius":"90"}

    @arg filters
    @text Filters
    @type struct<filterSt>[]
    @desc Filters to apply on the picture.
    @default

    @arg container
    @text Picture Container
    @type combo
    @option Default 
    @option Tilemap 
    @option Below Weather
    @option Below Window
    @option Above Window
    @option Above Everything
    @desc On what container the picture will be put on.
    @default Above Everything

    @arg zIndex
    @text Layer Index
    @type text
    @desc The index of this picture inside the choosen container.
    @default 0
    @parent container

    @arg fixedPosition
    @text Bind to the Map
    @type boolean
    @desc If true, the picture will be bind to the map instead of the screen.
    @default false

    @arg relativeObject
    @text Relative Object
    @type combo
    @option none
    @desc Any object that has .x and .y properties. See help file.
    @default none

    @arg refreshOnSceneChange
    @text Refresh On Scene Change
    @type boolean
    @desc If true, when changing scenes the pictures will play their animation again.
    @default false

    @arg clickCommonEventId
    @text Click Common Event Id
    @type common_event
    @desc A common event to play when clicking on this picture.
    @default 0

    @arg hoverCommonEventId
    @text Mouse Enter Common Event Id
    @type common_event
    @desc A common event to play when the mouse starts hovering the picture.
    @default 0

    @arg unhoverCommonEventId
    @text Mouse Exit Common Event Id
    @type common_event
    @desc A common event to play when the mouse stops hovering the picture.
    @default 0

    @arg wait
    @text Wait
    @type boolean
    @desc If the current event will wait the picture finish his movement.
    @default false

@command cmd_movePicture
@text Move Picture
@desc Move/Change all the picture properties at once.

    @arg id
    @text Picture Id
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

    @arg wait
    @text Wait
    @type boolean
    @desc If the current event will wait the picture finish his movement.
    @default false

    @arg operationType
    @text Operation Type
    @type select
    @option Add
    @option Set
    @desc If Add, the values will be increased from the current ones.
    @default Add

    @arg settings
    @text Picture Settings
    @type struct<moveSt>
    @desc The picture properties.
    @default

@command cmd_advancedMovePicture
@text Advanced Move Picture
@desc An advanced way to change one or more picture properties.

    @arg id
    @text ID
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

    @arg wait
    @text Wait
    @type boolean
    @desc If the current event will wait the picture finish his movement.
    @default false

    @arg animeSettings
    @text Anime Settings
    @type struct<animeSt>[]
    @desc Advanced and individual anime settings to each property of the picture.
    @default []

@command cmd_advancedMoveProp
@text Advanced Move Prop
@desc Change a single prop.

    @arg id
    @text ID
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

    @arg prop
    @text Property
    @type select
    @option x @option y @option alpha @option scaleX @option scaleY @option skewX @option skewY @option angle @option rotationSpeed @option toneRed @option toneGreen @option toneBlue @option toneGray @option blendRed @option blendGreen @option blendBlue @option blendAlpha @option hue
    @desc The property to apply the changes.
    @default x

    @arg operationType
    @text Operation Type
    @type select
    @option Set
    @option Add
    @desc The type of operation.
    @default Add

    @arg value
    @text Values
    @type multiline_text
    @desc The initial and target value. Separate each one by comma.
    @default 0, 0

    @arg duration
    @text Duration
    @type text
    @desc The duration of the transition from initial to target properties.
    @default 1

    @arg easing
    @text Easing
    @type combo
    @option --- Default --- @option linear @option slowStart @option slowEnd @option slowStartEnd @option --- In --- @option easeInQuad @option easeInCubic @option easeInQuart @option easeInQuint @option easeInSine @option easeInExpo @option easeInCirc @option easeInBack @option easeInBounce @option easeInElastic @option --- Out --- @option easeOutQuad @option easeOutCubic @option easeOutQuart @option easeOutQuint @option easeOutSine @option easeOutExpo @option easeOutCirc @option easeOutBack @option easeOutBounce @option easeOutElastic @option --- In / Out --- @option easeInOutQuad @option easeInOutCubic @option easeInOutQuart @option easeInOutQuint @option easeInOutSine @option easeInOutExpo @option easeInOutCirc @option easeInOutBack @option easeInOutBounce @option easeInOutElastic @option --- Out / In --- @option easeOutInQuad @option easeOutInCubic @option easeOutInQuart @option easeOutInQuint @option easeOutInSine @option easeOutInCirc @option easeOutInExpo @option easeOutInBack @option easeOutInBounce @option easeOutInElastic
    @desc The ease animation that will be used.
    @default linear
    @parent Static Settings

    @arg loop
    @text Loop
    @type text
    @option true
    @desc Set to -1, to loop infinitely. Or put a number to set the amount of times the loop will happen.
    @default 0

    @arg direction
    @text Direction
    @type select
    @option normal
    @option alternate
    @desc Choose the direction the animation will play.
    @default normal

    @arg wait
    @text Wait
    @type boolean
    @desc If the current event will wait the picture finish his movement.
    @default false

@command cmd_changeSettings
@text Change Settings
@desc Change some picture settings that are not animated.

    @arg id
    @text Picture Id
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

    @arg filename
    @text Filename
    @type file
    @dir img/pictures
    @desc The filename of the picture. Accept \v[id]
    @default

    @arg groupName
    @text Group Name
    @type text
    @desc The group name you want to move that picture to.
    @default

    @arg relativeObject
    @text Relative Object
    @type combo
    @option none
    @option same
    @desc Any object that has .x and .y properties. 
    @default none

    @arg refreshOnSceneChange
    @text Refresh On Scene Change
    @type boolean
    @desc If true, when changing scenes the pictures will play the animation again.
    @default

    @arg clickCommonEventId
    @text Click Common Event Id
    @type common_event
    @desc A common event to play when clicking on this picture.
    @default

    @arg hoverCommonEventId
    @text Mouse Enter Common Event Id
    @type common_event
    @desc A common event to play when the mouse starts hovering the picture.
    @default

    @arg unhoverCommonEventId
    @text Mouse Exit Common Event Id
    @type common_event
    @desc A common event to play when the mouse stops hovering the picture.
    @default

@command cmd_breathEffect
@text Breath Effect
@desc Applies a breath effect into the picture.

    @arg id
    @text ID
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

    @arg enableBreathX
    @text Apply Breath X(Horizontal)
    @type boolean
    @desc 
    @default false
    
    @arg breathX
    @text Power
    @type text
    @desc If true, the effect will be applied vertically.
    @default 0.025
    @parent enableBreathX

    @arg durationX
    @text Duration
    @type text
    @desc How many frames it will take to apply the power.
    @default 120
    @parent enableBreathX

    @arg enableBreathY
    @text Apply Breath Y(Vertical)
    @type boolean
    @desc 
    @default false

    @arg breathY
    @text Power
    @type text
    @desc If true, the effect will be applied vertically.
    @default 0.025
    @parent enableBreathY

    @arg durationY
    @text Duration
    @type text
    @desc How many frames it will take to apply the power.
    @default 120
    @parent enableBreathY

@command cmd_disableBreath
@text Disable Breath Effect
@desc Disable breath effect into the picture.

    @arg id
    @text ID
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

    @arg disableBreathX
    @text Disable X(Horizontal)
    @type boolean
    @desc 
    @default true

    @arg disableBreathY
    @text Disable Y(Horizontal)
    @type boolean
    @desc 
    @default true

@command cmd_floatEffect
@text Float Effect
@desc Applies a float effect into the picture.

    @arg id
    @text ID
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

    @arg floatY
    @text Float Power
    @type text
    @desc How higher the picture will float from it's original position Y.
    @default 10

    @arg duration
    @text Duration
    @type text
    @desc 
    @default 120

@command cmd_disableFloat
@text Disable Float Effect
@desc Disable the float effect of the picture.

    @arg id
    @text ID
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

    @arg disableFloat
    @text Disable
    @type boolean
    @desc 
    @default true

@command cmd_shakeEffect
@text Shake Effect
@desc Applies a shake effect on the picture.

    @arg id
    @text Picture Id
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1
    
    @arg shakeX
    @text Shake X Power
    @type text
    @desc 
    @default 25

    @arg durationX
    @text Duration
    @type text
    @desc How many frames it will shake on this direction.
    @default 120
    @parent shakeX

    @arg shakeY
    @text Shake Y Power
    @type text
    @desc 
    @default 25

    @arg durationY
    @text Duration
    @type text
    @desc How many frames it will shake on this direction.
    @default 120
    @parent shakeY

@command cmd_cardEffect
@text Card Effect
@desc Can flip a picture like a card. This command cannot be used by himself. Read help file.

    @arg id
    @text Picture Id
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

    @arg frontFilename
    @text Front Filename
    @type file
    @dir img/pictures
    @desc The filename of the picture, when the scale is positive.
    @default

    @arg backFilename
    @text Back Filename
    @type file
    @dir img/pictures
    @desc The filename of the picture, when the scale is negative.
    @default

    @arg flipType
    @text Flip Type
    @type select
    @option horizontal
    @option vertical
    @option both
    @desc The orientation of the flip.
    @default horizontal

@command cmd_changeMask
@text Change Mask
@desc Changes or apply a new mask to the picture.

    @arg id
    @text Picture Id
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

    @arg type
    @text Type
    @type select
    @option rect
    @option circle
    @option roundedRect
    @option star
    @option none
    @desc The type of the mask. 
    If circle, the width and height must always be the same value.
    @default none

    @arg image
    @text Mask Image
    @type file
    @dir img/pictures
    @desc The image used as a mask. If set, it will ignore the Type argument.
    @default

    @arg alignX
    @text Align X
    @type select
    @option left
    @option center
    @option right
    @desc Select left to only use offset value.
    @default left

    @arg alignY
    @text Align Y
    @type select
    @option top
    @option center
    @option bottom
    @desc Select top to only use offset value.
    @default top

    @arg offsetX
    @text Offset X
    @type text
    @desc The Offset X position.
    @default 0

    @arg offsetY
    @text Offset Y
    @type text
    @desc The offset Y position.
    @default 0

    @arg - Only Works for Type Masks -

    @arg size
    @text Size
    @type text
    @desc The width and height of the mask.
    @default 200, 200

    @arg circleRadius
    @text Circle radius
    @type text
    @desc The radius of the circle. This value must be always less than the height/width.
    @default 90

    @arg roundedRectBorder
    @text Rounded Rect Border
    @type text
    @desc The size of the rounded borders.
    @default 20

    @arg starEdges
    @text Star Edges
    @type text
    @desc How much points the star will have.
    @default 5

    @arg starOuterRadius
    @text Star Radius
    @type text
    @desc The outer radius of the star.
    @default 90

    @arg starInnerRadius
    @text Star Inner Radius
    @type text
    @desc The inner radius of the star.
    @default 90

@command cmd_removeMask
@text Remove Mask
@desc Remove mas from one or more pictures.

    @arg id
    @text Picture Id
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

@command cmd_erase
@text Erase Picture
@desc Erase one or more pictures.

    @arg id
    @text Picture Id
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

@command cmd_changeFilters
@text Add / Change Filters
@desc Add or Change filters from the picture. If a filter is disabled, it will be enabled.

    @arg id
    @text Picture Ids
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

    @arg filters
    @text Add Filters
    @type struct<filterSt>[]
    @desc Add new filters to the picture or change ones already created.
    @default []

@command cmd_operateFilters
@text Operate Filters
@desc Enable, Disable, Toggle, or Delete filters from the picture.

    @arg id
    @text Picture Ids
    @type combo
    @option All
    @desc The id of the pictures. Can be a number or text. Accept \v[id] and multiple ids.
    @default 1

    @arg operation
    @text Operation
    @type select
    @option Enable 
    @option Disable 
    @option Toggle 
    @option Delete
    @desc Choose what you want to do with the filters.
    @default Delete

    @arg filterList
    @text Filter List
    @type select[]
    @option Blur Filter @option Bulge Pinch Filter @option Color Matrix Filter @option Glow Filter @option Outline Filter
    @desc Choose the filters you want to apply the operation.
    @default []

*/

/* ------------------------------ MAIN SETTINGS ----------------------------- */
{
    /*~struct~mainSt:
    
        @param anchor
        @text Origin (Anchor)
        @type select
        @option UpperLeft @option UpperCenter @option UpperRight @option CenterLeft @option Center @option CenterRight @option LowLeft @option LowCenter @option LowRight
        @desc Choose the origin of the picture.
        @default UpperLeft
    
        @param blendMode
        @text Blend Mode
        @type combo
        @option Normal @option Additive @option Multiply @option Screen
        @desc The blend mode of the picture.
        @default Normal
    
        @param Default Anime Settings
    
        @param duration
        @text Duration
        @type text
        @desc The duration of the transition from initial to target properties.
        @default 1
        @parent Default Anime Settings
    
        @param easing
        @text Easing
        @type combo
        @option --- Default --- @option linear @option slowStart @option slowEnd @option slowStartEnd @option --- In --- @option easeInQuad @option easeInCubic @option easeInQuart @option easeInQuint @option easeInSine @option easeInExpo @option easeInCirc @option easeInBack @option easeInBounce @option easeInElastic @option --- Out --- @option easeOutQuad @option easeOutCubic @option easeOutQuart @option easeOutQuint @option easeOutSine @option easeOutExpo @option easeOutCirc @option easeOutBack @option easeOutBounce @option easeOutElastic @option --- In / Out --- @option easeInOutQuad @option easeInOutCubic @option easeInOutQuart @option easeInOutQuint @option easeInOutSine @option easeInOutExpo @option easeInOutCirc @option easeInOutBack @option easeInOutBounce @option easeInOutElastic @option --- Out / In --- @option easeOutInQuad @option easeOutInCubic @option easeOutInQuart @option easeOutInQuint @option easeOutInSine @option easeOutInCirc @option easeOutInExpo @option easeOutInBack @option easeOutInBounce @option easeOutInElastic
        @desc The ease animation that will be used.
        @default linear
        @parent Default Anime Settings
    
        @param loop
        @text Loop
        @type text
        @option true
        @desc Set to -1, to loop infinitely. Or put a number to set the amount of times the loop will happen.
        @default 0
        @parent Default Anime Settings
    
        @param direction
        @text Direction
        @type select
        @option normal
        @option alternate
        @desc Choose the direction the animation will play.
        @default normal
        @parent Default Anime Settings
    
        @param separator1
        @text Initial
    
        @param initialAlignX
        @text Align X
        @type select
        @option left
        @option center
        @option right
        @option left_offScreen
        @option right_offScreen
        @desc Select left to only use offset value.
        @default left
        @parent separator1
    
        @param initialOffsetX
        @text Offset X
        @type text
        @desc The Offset X position.
        @default 0
        @parent separator1
    
        @param initialAlignY
        @text Align Y
        @type select
        @option top
        @option center
        @option bottom
        @option top_offScreen
        @option bottom_offScreen
        @desc Select top to only use offset value.
        @default top
        @parent separator1
    
        @param initialOffsetY
        @text Offset Y
        @type text
        @desc The offset Y position.
        @default 0
        @parent separator1
    
        @param initialAlpha
        @text Alpha (Opacity)
        @type text
        @desc The alpha value. From 0 to 1. Can use decimals.
        @default 0
        @parent separator1
    
        @param initialScale
        @text Scale X Y
        @type text
        @desc The scale values. Can use decimals.
        @default 1, 1
        @parent separator1
    
        @param initialSkew
        @text Skew X Y
        @type text
        @desc The skew values. Can use decimals.
        @default 0, 0
        @parent separator1
    
        @param initialAngleRotation
        @text Angle & Rotation
        @type text
        @desc The angle value from 0 to 360. If Rotation is set, it will ignore the angle.
        @default 0, 0
        @parent separator1
    
        @param initialTone
        @text Tone Color(Tint)
        @type text
        @desc Red, Green, Blue, Gray → All on RGB format. From -255 to 255.
        @default 0, 0, 0, 0
        @parent separator1
    
        @param initialBlendColor
        @text Blend Color
        @type text
        @desc Red, Green, Blue, Alpha → ALL ON RGB format. From -255 to 255. Alpha from 0 to 1.
        @default 0, 0, 0, 0
        @parent separator1
    
        @param initialHue
        @text Hue Color
        @type text
        @desc The hue number. From 0 to 360.
        @default 0
        @parent separator1
    
        @param enableTarget
        @text Enable Target
        @type boolean
        @desc If true, it will use target values.
        @default true
    
        @param targetAlignX
        @text Align X
        @type select
        @option left
        @option center
        @option right
        @desc Select left to only use offset value.
        @default left
        @parent enableTarget
    
        @param targetOffsetX
        @text Offset X
        @type text
        @desc The Offset X position.
        @default 0
        @parent enableTarget
    
        @param targetAlignY
        @text Align Y
        @type select
        @option top
        @option center
        @option bottom
        @desc Select top to only use offset value.
        @default top
        @parent enableTarget
    
        @param targetOffsetY
        @text Offset Y
        @type text
        @desc The offset Y position.
        @default 0
        @parent enableTarget
    
        @param targetAlpha
        @text Alpha (Opacity)
        @type text
        @desc The alpha value. From 0 to 1. Can use decimals.
        @default 1
        @parent enableTarget
    
        @param targetScale
        @text Scale X Y
        @type text
        @desc The scale values. From 0 to 1. Can use decimals.
        @default 1, 1
        @parent enableTarget
    
        @param targetSkew
        @text Skew X Y
        @type text
        @desc The skew values. Can use decimals.
        @default 0, 0
        @parent enableTarget
    
        @param targetAngleRotation
        @text Angle & Rotation
        @type text
        @desc The angle value from 0 to 360. If Rotation is set, it will ignore the angle.
        @default 0, 0
        @parent enableTarget
    
        @param targetTone
        @text Tone Color(Tint)
        @type text
        @desc Red, Green, Blue, Gray → All on RGB format. From -255 to 255.
        @default 0, 0, 0, 0
        @parent enableTarget
    
        @param targetBlendColor
        @text Blend Color
        @type text
        @desc Red, Green, Blue, Alpha → ALL ON RGB format. From -255 to 255. Alpha from 0 to 1.
        @default 0, 0, 0, 0
        @parent enableTarget
    
        @param targetHue
        @text Hue Color
        @type text
        @desc The hue number. From 0 to 360.
        @default 0
        @parent enableTarget
    
    */
}

/* ------------------------------ MOVE SETTINGS ----------------------------- */
{
    /*~struct~moveSt:
    
        @param duration
        @text Duration
        @type text
        @desc The duration of the transition from initial to target properties.
        @default 1
    
        @param easing
        @text Easing
        @type combo
        @option --- Default --- @option linear @option slowStart @option slowEnd @option slowStartEnd @option --- In --- @option easeInQuad @option easeInCubic @option easeInQuart @option easeInQuint @option easeInSine @option easeInExpo @option easeInCirc @option easeInBack @option easeInBounce @option easeInElastic @option --- Out --- @option easeOutQuad @option easeOutCubic @option easeOutQuart @option easeOutQuint @option easeOutSine @option easeOutExpo @option easeOutCirc @option easeOutBack @option easeOutBounce @option easeOutElastic @option --- In / Out --- @option easeInOutQuad @option easeInOutCubic @option easeInOutQuart @option easeInOutQuint @option easeInOutSine @option easeInOutExpo @option easeInOutCirc @option easeInOutBack @option easeInOutBounce @option easeInOutElastic @option --- Out / In --- @option easeOutInQuad @option easeOutInCubic @option easeOutInQuart @option easeOutInQuint @option easeOutInSine @option easeOutInCirc @option easeOutInExpo @option easeOutInBack @option easeOutInBounce @option easeOutInElastic
        @desc The ease animation that will be used.
        @default linear
    
        @param loop
        @text Loop
        @type text
        @option true
        @desc Set to -1, to loop infinitely. Or put a number to set the amount of times the loop will happen.
        @default 0
    
        @param direction
        @text Direction
        @type select
        @option normal
        @option alternate
        @desc Choose the direction the animation will play.
        @default normal
    
        @param alignX
        @text Align X
        @type select
        @option left
        @option center
        @option right
        @option left_offScreen
        @option right_offScreen
        @desc Select left to only use offset value.
        @default left
    
        @param alignY
        @text Align Y
        @type select
        @option top
        @option center
        @option bottom
        @option top_offScreen
        @option bottom_offScreen
        @desc Select top to only use offset value.
        @default top
    
        @param -------------------
    
        @param offsetX
        @text Offset X
        @type text
        @desc The Offset X position.
        @default x
    
        @param offsetY
        @text Offset Y
        @type combo
        @option y
        @desc The offset Y position.
        @default y
    
        @param alpha
        @text Alpha (Opacity)
        @type combo
        @option alpha
        @desc The alpha value. From 0 to 1. Can use decimals.
        @default alpha
    
        @param scaleX
        @text Scale X
        @type combo
        @option scaleX
        @desc The scale X value. From 0 to 1.
        @default scaleX
    
        @param scaleY
        @text Scale Y
        @type combo
        @option scaleY
        @desc The scale Y value. From 0 to 1.
        @default scaleY
    
        @param anchor
        @text Origin (Anchor)
        @type select
        @option anchor @option UpperLeft @option UpperCenter @option UpperRight @option CenterLeft @option Center @option CenterRight @option LowLeft @option LowCenter @option LowRight
        @desc Choose the origin of the picture.
        @default anchor
    
        @param blendMode
        @text Blend Mode
        @type combo
        @option blendMode @option Normal @option Additive @option Multiply @option Screen
        @desc The blend mode of the picture.
        @default blendMode
    
        @param skewX
        @text Skew X
        @type combo
        @option skewX
        @desc
        @default skewX
    
        @param skewY
        @text Skew Y
        @type combo
        @option skewY
        @desc
        @default skewY
    
        @param angle
        @text Angle
        @type combo
        @option angle
        @desc
        @default angle
    
        @param rotationSpeed
        @text Rotation Speed
        @type combo
        @option rotationSpeed
        @desc
        @default rotationSpeed
    
        @param toneRed
        @text Tone Red (Tint)
        @type combo
        @option toneRed
        @desc Red
        @default toneRed
    
        @param toneGreen
        @text Tone Green (Tint)
        @type combo
        @option toneGreen
        @desc Green
        @default toneGreen
    
        @param toneBlue
        @text Tone Blue (Tint)
        @type combo
        @option toneBlue
        @desc Blue
        @default toneBlue
    
        @param toneGray
        @text Tone Gray (Tint)
        @type combo
        @option toneGray
        @desc Gray
        @default toneGray
    
        @param blendRed
        @text Blend Red
        @type combo
        @option blendRed
        @desc Red
        @default blendRed
    
        @param blendGreen
        @text Blend Green
        @type combo
        @option blendGreen
        @desc Green
        @default blendGreen
    
        @param blendBlue
        @text Blend Blue
        @type combo
        @option blendBlue
        @desc Blue
        @default blendBlue
    
        @param blendAlpha
        @text Blend Alpha
        @type combo
        @option blendAlpha
        @desc Alpha
        @default blendAlpha
    
        @param hue
        @text Hue Color
        @type combo
        @option hue
        @desc The hue number. From 0 to 360.
        @default hue
    
    */
}

/* ----------------------------- ANIME SETTINGS ----------------------------- */
{
    /*~struct~animeSt:
    
        @param prop
        @text Property
        @type select
        @option x
        @option y
        @option alpha
        @option scaleX
        @option scaleY
        @option skewX
        @option skewY
        @option angle
        @option rotationSpeed
        @option toneRed
        @option toneGreen
        @option toneBlue
        @option toneGray
        @option blendRed
        @option blendGreen
        @option blendBlue
        @option blendAlpha
        @option hue
        @desc The property to apply the anime changes.
        @default x
    
        @param operationType
        @text Operation Type
        @type select
        @option Set
        @option Add
        @desc The type of operation.
        @default Add
    
        @param value
        @text Values
        @type multiline_text
        @desc The initial and target value. Separate each one by comma.
        @default 0, 0
    
        @param duration
        @text Duration
        @type text
        @desc The duration of the transition from initial to target properties.
        @default 1
    
        @param easing
        @text Easing
        @type combo
        @option --- Default --- @option linear @option slowStart @option slowEnd @option slowStartEnd @option --- In --- @option easeInQuad @option easeInCubic @option easeInQuart @option easeInQuint @option easeInSine @option easeInExpo @option easeInCirc @option easeInBack @option easeInBounce @option easeInElastic @option --- Out --- @option easeOutQuad @option easeOutCubic @option easeOutQuart @option easeOutQuint @option easeOutSine @option easeOutExpo @option easeOutCirc @option easeOutBack @option easeOutBounce @option easeOutElastic @option --- In / Out --- @option easeInOutQuad @option easeInOutCubic @option easeInOutQuart @option easeInOutQuint @option easeInOutSine @option easeInOutExpo @option easeInOutCirc @option easeInOutBack @option easeInOutBounce @option easeInOutElastic @option --- Out / In --- @option easeOutInQuad @option easeOutInCubic @option easeOutInQuart @option easeOutInQuint @option easeOutInSine @option easeOutInCirc @option easeOutInExpo @option easeOutInBack @option easeOutInBounce @option easeOutInElastic
        @desc The ease animation that will be used.
        @default linear
        @parent Static Settings
    
        @param loop
        @text Loop
        @type text
        @option true
        @desc Set to -1, to loop infinitely. Or put a number to set the amount of times the loop will happen.
        @default 0
    
        @param direction
        @text Direction
        @type select
        @option normal
        @option alternate
        @desc Choose the direction the animation will play.
        @default normal
    
    */
}

/* ---------------------------------- MASK ---------------------------------- */
{
    /*~struct~maskSt:
    
        @param type
        @text Type
        @type select
        @option rect
        @option circle
        @option roundedRect
        @option star
        @option none
        @desc The type of the mask. 
        If circle, the width and height must always be the same value.
        @default none
    
        @param image
        @text Mask Image
        @type file
        @dir img/pictures
        @desc The image used as a mask. If set, it will ignore the Type argument.
        @default
    
        @param alignX
        @text Align X
        @type select
        @option left
        @option center
        @option right
        @desc Select left to only use offset value.
        @default left
    
        @param alignY
        @text Align Y
        @type select
        @option top
        @option center
        @option bottom
        @desc Select top to only use offset value.
        @default top
    
        @param offsetX
        @text Offset X
        @type text
        @desc The Offset X position.
        @default 0
    
        @param offsetY
        @text Offset Y
        @type text
        @desc The offset Y position.
        @default 0
    
        @param - Only Works for Type Masks -
    
        @param size
        @text Size
        @type text
        @desc The width and height of the mask.
        @default 200, 200
    
        @param circleRadius
        @text Circle radius
        @type text
        @desc The radius of the circle. This value must be always less than the height/width.
        @default 90
    
        @param roundedRectBorder
        @text Rounded Rect Border
        @type text
        @desc The size of the rounded borders.
        @default 20
    
        @param starEdges
        @text Star Edges
        @type text
        @desc How much points the star will have.
        @default 5
    
        @param starOuterRadius
        @text Star Radius
        @type text
        @desc The outer radius of the star.
        @default 90
    
        @param starInnerRadius
        @text Star Inner Radius
        @type text
        @desc The inner radius of the star.
        @default 90
    
    */
}

/* -------------------------------- FILTER ST ------------------------------- */
{

    /*~struct~filterSt:
    
        @param type
        @text Filter Select
        @type combo
        @option Blur Filter
        @option Bulge Pinch Filter
        @option Color Matrix Filter
        @option Glow Filter
        @option Outline Filter
        @desc Select a filter to use, then build his settings according to the list below.
        @default Blur Filter
    
        @param blur
        @text Blur
        @type struct<blurFilterSt>
        @desc
        @default
        @parent type
    
        @param bulgePinch
        @text Bulge Pinch
        @type struct<bulgePinchFilterSt>
        @desc
        @default
        @parent type
    
        @param colorMatrix
        @text Color Matrix
        @type struct<colorMatrixSt>
        @desc
        @default
    
        @param glow
        @text Glow
        @type struct<glowFilterSt>
        @desc
        @default
        @parent type
    
        @param outline
        @text Outline
        @type struct<outlineFilterSt>
        @desc
        @default
        @parent type
    
    */

}

/* ------------------------------- BLUR FILTER ------------------------------ */
{

    /*~struct~blurFilterSt:
    
        @param strength
        @text Strength
        @type text
        @desc The strength of the blur filter.
        @default 8
    
        @param quality
        @text Quality
        @type text
        @desc The quality of the blur filter.
        @default 4
    
        @param resolution
        @text Resolution
        @type text
        @desc The resolution of the blur filter. Can use decimals.
        @default 1
    
        @param kernelSize
        @text Kernel Size
        @type text
        @desc The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
        @default 5
    
    */

}

/* ------------------------------ COLOR MATRIX ------------------------------ */
{

    /*~struct~colorMatrixSt:
    
        @param blackAndWhite
        @text Black and White
        @type select
        @option true
        @option false
        @option none
        @desc Set the black and white matrice. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param browni
        @text Browni
        @type select
        @option true
        @option false
        @option none
        @desc Brown delicious browni filter. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param desaturate
        @text Desaturate
        @type select
        @option true
        @option none
        @desc Desaturate image (remove color). Set true to use. Set none to not use this.
        @default none
    
        @param kodachrome
        @text Kodachrome
        @type select
        @option true
        @option false
        @option none
        @desc Color reversal film introduced by Eastman Kodak in 1935. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param lsd
        @text LSD
        @type select
        @option true
        @option false
        @option none
        @desc LSD effect. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param negative
        @text Negative
        @type select
        @option true
        @option false
        @option none
        @desc Negative image. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param polaroid
        @text Polaroid
        @type select
        @option true
        @option false
        @option none
        @desc Polaroid filter. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param sepia
        @text Sepia
        @type select
        @option true
        @option false
        @option none
        @desc Sepia image. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param technicolor
        @text Technicolor
        @type select
        @option true
        @option false
        @option none
        @desc Color motion picture process invented in 1916. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param vintage
        @text Vintage
        @type select
        @option true
        @option false
        @option none
        @desc Vintage filter. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param brightness
        @text Brightness
        @type select
        @option true
        @option false
        @option none
        @desc Adjusts brightness. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param brightnessAmount
        @text Amount
        @type text
        @desc Value of the brigthness (0-1, where 0 is black)
        @default 1
        @parent brightness
    
        @param contrast
        @text Contrast
        @type select
        @option true
        @option false
        @option none
        @desc Increase contrast. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param contrastAmount
        @text Amount
        @type text
        @desc From 0 to 1.
        @default 1
        @parent contrast
    
        @param greyscale
        @text Greyscale
        @type select
        @option true
        @option false
        @option none
        @desc Set the matrices in grey scales. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param greyscaleAmount
        @text Amount
        @type text
        @desc Value of the grey (0-1, where 0 is black)
        @default 1
        @parent greyscale
    
        @param night
        @text Night
        @type select
        @option true
        @option false
        @option none
        @desc Night effect. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param nightAmount
        @text Intensity
        @type text
        @desc The intensity of the night effect.
        @default 1
        @parent night
    
        @param predator
        @text Predator
        @type select
        @option true
        @option false
        @option none
        @desc Predator effect. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param predatorAmount
        @text Amount
        @type text
        @desc how much the predator feels his future victim
        @default 5
        @parent predator
    
        @param saturate
        @text Saturate
        @type select
        @option true
        @option false
        @option none
        @desc Saturate the sprite. Multiply can be true or false. Set none to not use this.
        @default none
    
        @param saturateAmount
        @text Amount
        @type text
        @desc From 0 to 1.
        @default 1
        @parent saturate
    
    */

}

/* --------------------------- BULGE PINCH FILTER --------------------------- */
{

    /*~struct~bulgePinchFilterSt:
    
        @param center
        @text Center of the Effect
        @type select
        @option UpperLeft @option UpperCenter @option UpperRight @option CenterLeft @option Center @option CenterRight @option LowLeft @option LowCenter @option LowRight
        @desc Sets the center of the effect. 
        @default Center
    
        @param radius
        @text Radius
        @type text
        @desc The radius of the circle of effect
        @default 100
    
        @param strength
        @text Strength
        @type text
        @desc A value between -1 and 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge
        @default 1
    
    */

}

/* ------------------------------- GLOW FILTER ------------------------------ */
{

    /*~struct~glowFilterSt:
    
        @param color
        @text Color
        @type text
        @desc A hex color to apply to the glow.
        @default #ffffff
    
        @param distance
        @text Distance
        @type text
        @desc From 0 to 1. Can use decimals.
        @default 10
    
        @param outerStrength
        @text Outer Strength
        @type text
        @desc The strength of the glow outward from the edge of the sprite
        @default 10
    
        @param innerStrength
        @text Inner Strength
        @type text
        @desc The strength of the glow inward from the edge of the sprite
        @default 0
    
        @param quality
        @text Quality
        @type text
        @desc From 0 to 1. Can use decimals. Low numbers, better performance.
        @default 0.1
    
        @param knockout
        @text Knockout
        @type boolean
        @desc If true, will hide the picture leaving only the outline.
        @default false
    
    */

}

/* ----------------------------- OUTLINE FILTER ----------------------------- */
{

    /*~struct~outlineFilterSt:
    
        @param thickness
        @text Thickness
        @type text
        @desc The thickness of the outline.
        @default 5
    
        @param color
        @text Color
        @type text
        @desc A hex color to apply to the outline.
        @default #ffffff
    
        @param quality
        @text Quality
        @type text
        @desc From 0 to 1. Can use decimals. Low numbers, better performance.
        @default 0.1
    
    */

}

"use strict"

var Eli = Eli || {}
var Imported = Imported || {}
Imported.Eli_PictureManager = true

if(!Imported.Eli_Book && !window.eliErrorTriggered) {
    window.eliErrorTriggered = true
    if(confirm(`All EliMZ plugins need the core plugin EliMZ_Book. Click OK to download it and install somewhere above all other EliMZ plugins.`)) {
        window.location.href = "https://hakuenstudio.itch.io/eli-book-rpg-maker-mv-mz"
    }
    SceneManager.exit()
}

/* ========================================================================== */
/*                                   PLUGIN                                   */
/* ========================================================================== */

/* ----------------------------------- DOC ---------------------------------- */

/**
 * 
 * @typedef {object} AnimeProp
 * @property {number[]} value - The initial and target value.
 * @property {number} duration - The duration of the animation.
 * @property {number} loop - How many times the animation will play.
 * @property {string} direction - The direction on which the animation values will go. 
 * normal → From Initial to Target. 
 * alternate → To be used when loop is higher than 0.
 * @property {string} easing - The ease type of the animation.
 */

/**
 * 
 * @typedef {object} AnimePropList
 * @property {AnimeProp} x - The x coordinate.
 * @property {AnimeProp} y - The y coordinate.
 * @property {AnimeProp} scaleX - The horizontal scale.
 * @property {AnimeProp} scaleY - The vertical scale.
 * @property {AnimeProp} skewX - The horizontal skew.
 * @property {AnimeProp} skewY - The vertical skew.
 * @property {AnimeProp} alpha - The alpha, transparency value. From 0 to 1.
 * @property {AnimeProp} angle - The angle in degrees. From 0 to 360.
 * @property {AnimeProp} rotationSpeed - How many angles per frame it will rotate.
 * @property {AnimeProp} toneRed - The red value for tone color. From -255 to 255.
 * @property {AnimeProp} toneGreen - The green value for tone color. From -255 to 255.
 * @property {AnimeProp} toneBlue - The blue value for tone color. From -255 to 255.
 * @property {AnimeProp} toneGray - The gray value for tone color. From -255 to 255.
 * @property {AnimeProp} blendRed - The red value for blend color. From -255 to 255.
 * @property {AnimeProp} blendGreen - The red value for blend color. From -255 to 255.
 * @property {AnimeProp} blendBlue - The red value for blend color. From -255 to 255.
 * @property {AnimeProp} blendAlpha - The alpha value for blend color. From 0 to 1.
 * @property {AnimeProp} hue - The hue color value. From 0 to 360.
 * @property {AnimeProp} breathX - The breath X power.
 * @property {AnimeProp} breathY - The breath Y power.
 * @property {AnimeProp} floatY - The float Y power.
 */

/**
 * The Picture Manager plugin parameters.
 * @typedef {object} PictureManagerParameters
 * @property {number} clickVariable - The variable Id that holds the picture id when it is clicked/touched.
 * @property {number} mouseEnterVariable The variable Id that holds the picture id when the mouse enter on the picture.
 * @property {number} mouseExitVariable The variable Id that holds the picture id when the mouse leaves the picture.
 */

/* ---------------------------------- CODE ---------------------------------- */

/**
 * The Super Picture game object. It is saved on the save file.
 * @class 
 * 
 */
function Game_AnimePicture() {
    this.initialize(...arguments)
}

{

/**
 * The Picture Manager plugin namespace.
 * @memberof Eli
 * @namespace PictureManager
 */
Eli.PictureManager = {

    Parameters: class Parameters {

        constructor(parameters) {
            this.clickVariable = Number(parameters.clickVariable)
            this.mouseEnterVariable = Number(parameters.mouseEnterVariable)
            this.mouseExitVariable = Number(parameters.mouseExitVariable)
            this.touchOpacity = Number(parameters.touchOpacity || "0")
        }
    },
    /**
    * @class
    * @extends PIXI.Container
    */
    Container_AnimePicture: class Container_AnimePicture extends PIXI.Container {

        /**
         * Create a Super Picture Container to hold and sort Super Picture sprites.
         * @constructor
         */
        constructor() {
            super()
            this.initialize()
        }

        initialize() {
            this.width = Graphics.width
            this.height = Graphics.height
        }

        onChildrenChange() {
            this.sortChildren()
        }

        update() {
            for(const child of this.children) {
                child.update()
            }
        }


    },
    /**
     * The Sprite for the Super Picture game object.
     * @class
     * @extends Sprite
     */
    Sprite_MainPicture: class Sprite_MainPicture extends Sprite {

        /**
         * @param {Game_AnimePicture} gamePic The Super Picture game object.
         * @returns {void}
         */
        initialize(gamePic) {
            super.initialize()
            this.initMembers(gamePic)
        }

        initMembers(gamePic) {
            this.gamePicture = gamePic
            this.maskOffsetX = 0
            this.maskOffsetY = 0
            this.pictureSprite = new Eli.PictureManager.Sprite_AnimePicture(gamePic, this)
            this.addChild(this.pictureSprite)
        }

        /**
         * 
         * @returns {Game_AnimePicture}
         */
        getGamePicture() {
            return this.gamePicture
        }

        getPictureTopLeftCoordinates() {
            const pic = this.pictureSprite
            const w = pic.bitmap ? pic.bitmap.width : 0
            const h = pic.bitmap ? pic.bitmap.height : 0

            return {
                x: pic.x - (w * pic.anchor.x * pic.scale.x),
                y: pic.y - (h * pic.anchor.y * pic.scale.y)
            }
        }

        updateMaskPosition(finalX, finalY) {
            if(isNaN(finalX)) {
                const {x, y} = this.getPictureTopLeftCoordinates()
                this.mask.x = x + this.maskOffsetX
                this.mask.y = y + this.maskOffsetY
            } else {
                this.mask.x = this.pictureSprite.relativeObject().x + finalX + this.maskOffsetX
                this.mask.y = this.pictureSprite.relativeObject().y + finalY + this.maskOffsetY
            }
        }

        createMask() {
            const gamePic = this.getGamePicture()

            if(gamePic.mask.image) {
                const bitmap = ImageManager.loadPicture(gamePic.mask.image)
                bitmap.addLoadListener(this.createSpriteMask.bind(this, gamePic, bitmap))

            } else if(gamePic.mask.type !== "none") {
                this.createShapeMask(gamePic)

            } else {
                this.removeMask()
            }
        }

        createSpriteMask(gamePic, bitmap) {
            const [x, y] = this.createMaskPosition(gamePic.mask, bitmap.width, bitmap.height)
            const sprite = new Eli.PictureManager.Sprite_MaskAnimePicture(bitmap, 0, 0)

            this.removeMask()
            this.maskOffsetX = x
            this.maskOffsetY = y
            this.mask = sprite
            this.updateMaskPosition()
            this.addChild(this.mask)
        }

        createShapeMask(gamePic) {
            const {width, height} = gamePic.mask
            const [x, y] = this.createMaskPosition(gamePic.mask, width, height)

            this.removeMask()
            this.maskOffsetX = x
            this.maskOffsetY = y
            this.mask = new PIXI.Graphics().beginFill(0xFF3300)
            this.refreshMaskShape(0, 0, width, height)
            this.updateMaskPosition()
            this.addChild(this.mask)
        }

        removeMask() {
            if(this.mask) {
                this.removeChild(this.mask)
                this.mask = null
            }
        }

        createMaskPosition(position, maskWidth, maskHeight) {
            const {alignX, alignY, offsetX, offsetY} = position
            const realOffsetX = new Function(`return ${offsetX}`).bind(this)
            const realOffsetY = new Function(`return ${offsetY}`).bind(this)
            const mainWidth = this.pictureSprite.bitmap.width
            const mainHeight = this.pictureSprite.bitmap.height

            const x = {
                left: realOffsetX(),
                center: (mainWidth / 2 - maskWidth / 2) + realOffsetX(),
                right: (mainWidth - maskWidth) + realOffsetX(),
            }[alignX]

            const y = {
                top: realOffsetY(),
                center: (mainHeight / 2 - maskHeight / 2) + realOffsetY(),
                bottom: (mainHeight - maskHeight) + realOffsetY(),
            }[alignY]

            return [Math.round(x), Math.round(y)]
        }

        refreshMaskShape(x, y, width, height) {
            const {
                type, circleRadius,
                roundedRectBorder, starEdges,
                starOuterRadius, starInnerRadius
            } = this.getGamePicture().mask

            switch(type) {
                case "rect":
                    this.mask.drawRect(x, y, width, height)
                    break
                case "circle":
                    this.mask.drawCircle(x + width / 2, y + height / 2, circleRadius)
                    break
                case "roundedRect":
                    this.mask.drawRoundedRect(x, y, width, height, roundedRectBorder)
                    break
                case "star":
                    this.mask.drawStar(x + width / 2, y + height / 2, starEdges, starOuterRadius, starInnerRadius, 0)
                    break
            }

            this.mask.endFill()
        }

        update() {
            super.update()
            this._zIndex = this.getGamePicture().zIndex
            this.z = this.getGamePicture().zIndex
        }

        start() {
            this.pictureSprite.start()
        }

    },
    Sprite_AnimePicture: class Sprite_AnimePicture extends Sprite_Clickable {

        /**
         * @param {Game_AnimePicture} gamePic The Super Picture game object.
         * @returns {void}
         */
        initialize(gamePic, mainSprite) {
            super.initialize()
            this.initMembers(gamePic, mainSprite)
            this.initFilters()
            this.refreshRelativeObject()
            this.updateProps(this.getGamePicture())
            this.refreshMembers()
            this.loadBitmap()
            this.bitmap.addLoadListener(this.onBitmapLoad.bind(this))
        }

        refreshRelativeObject() {
            if(this.getGamePicture().relativeObject === "none") {
                this.relativeObject = new Function("return {x: 0, y:0}")

            } else {
                this.relativeObject = new Function(`return ${this.getGamePicture().relativeObject}`)

                try {
                    this.relativeObject().x
                } catch(error) {
                    alert(`The relative object: ${this.getGamePicture().relativeObject}, does not exist or it is not defined yet.`)
                    this.relativeObject = new Function("return {x: 0, y:0}")
                }
            }
        }

        initMembers(gamePic, mainSprite) {
            this.gamePicture = gamePic
            this.mainSprite = mainSprite
            this.mainSprite.pictureSprite = this
            this.animeGroup = new Eli.AnimeGroup([], {paused: false})
            this.animeAnimations = []
            this.visible = false
            this.relativeObject = new Function("return {x: 0, y:0}")
        }

        initFilters() {
            this.blurFilter = null
            this.bulgePinchFilter = null
            this.colorMatrixFilter = null
            this.glowFilter = null
            this.outlineFilter = null
            this.filters = []
        }

        refreshMembers() {
            this.refreshAnchor(true, true)
            this.refreshBlendMode()
        }

        refreshAnchor(refreshX, refreshY) {
            const {x, y} = {
                UpperLeft: {x: 0, y: 0}, // Default
                UpperCenter: {x: 0.5, y: 0},
                UpperRight: {x: 1, y: 0},

                CenterLeft: {x: 0, y: 0.5},
                Center: {x: 0.5, y: 0.5}, // Default
                CenterRight: {x: 1, y: 0.5},

                LowLeft: {x: 0, y: 1},
                LowCenter: {x: 0.5, y: 1},
                LowRight: {x: 1, y: 1},
            }[this.getGamePicture().anchor]

            if(refreshX) {
                this.anchor.x = x
            }

            if(refreshY) {
                this.anchor.y = y
            }
        }

        refreshBlendMode() {
            const blendType = {
                Normal: 0,
                Additive: 1,
                Multiply: 2,
                Screen: 3,
            }[this.getGamePicture().blendMode]
            this.blendMode = blendType
        }

        refreshFilters() {
            this.refreshBlurFilter()
            this.refreshBulgePinchFilter()
            this.refreshColorMatrixFilter()
            this.refreshGlowFilter()
            this.refreshOutlineFilter()
        }

        refreshBlurFilter() {
            if(this.getGamePicture().blurFilterCreated) {
                const {strength, quality, resolution, kernelSize} = this.getGamePicture().getBlurFilterOptions()
                this.blurFilter = new PIXI.filters.BlurFilter(strength, quality, resolution, kernelSize)

                if(!this.filters.includes(this.blurFilter)) {
                    this.filters.push(this.blurFilter)
                }

            } else {
                Eli.Array.remove(this.filters, this.blurFilter)
                this.blurFilter = null
                delete this.getGamePicture().blurFilterOptions
            }
        }

        refreshBulgePinchFilter() {
            if(this.getGamePicture().bulgePinchFilterCreated) {
                const options = this.getGamePicture().getBulgePinchFilterOptions()
                options.center = {x: options.centerX, y: options.centerY}
                this.bulgePinchFilter = new PIXI.filters.BulgePinchFilter(options)

                if(!this.filters.includes(this.bulgePinchFilter)) {
                    this.filters.push(this.bulgePinchFilter)
                }

            } else {
                Eli.Array.remove(this.filters, this.bulgePinchFilter)
                this.bulgePinchFilter = null
                delete this.getGamePicture().bulgePinchFilterOptions
            }
        }

        refreshColorMatrixFilter() {
            if(this.getGamePicture().colorMatrixFilterCreated) {

                if(this.colorMatrixFilter) {
                    this.colorMatrixFilter.reset()
                    this.applyColorMatrixFilterOptions(this.getGamePicture().getColorMatrixFilterOptions())
                } else {
                    this.colorMatrixFilter = new PIXI.filters.ColorMatrixFilter()
                    this.applyColorMatrixFilterOptions(this.getGamePicture().getColorMatrixFilterOptions())
                    this.filters.push(this.colorMatrixFilter)
                }

            } else {
                this.colorMatrixFilter?.reset()
                Eli.Array.remove(this.filters, this.colorMatrixFilter)
                this.colorMatrixFilter = null
                delete this.getGamePicture().colorMatrixFilterOptions
            }
        }

        applyColorMatrixFilterOptions(options) {
            for(const name in options.type1) {
                const multiply = options.type1[name]

                if(multiply !== "none") {
                    this.colorMatrixFilter[name](multiply === "true")
                }
            }

            for(const name of ["brightness", "contrast", "greyscale", "night", "predator", "saturate"]) {
                const multiply = options.type2[name]
                const amount = options.type2[`${name}Amount`]

                if(multiply !== "none") {
                    this.colorMatrixFilter[name](amount, multiply === "true")
                }
            }
        }

        refreshGlowFilter() {
            if(this.getGamePicture().glowFilterCreated) {
                this.glowFilter = new PIXI.filters.GlowFilter(this.getGamePicture().getGlowFilterOptions())

                if(!this.filters.includes(this.glowFilter)) {
                    this.filters.push(this.glowFilter)
                }

            } else {
                Eli.Array.remove(this.filters, this.glowFilter)
                this.glowFilter = null
                delete this.getGamePicture().glowFilterOptions
            }
        }

        refreshOutlineFilter() {
            if(this.getGamePicture().outlineFilterCreated) {
                const {thickness, color, quality} = this.getGamePicture().getOutlineFilterOptions()
                this.outlineFilter = new PIXI.filters.OutlineFilter(thickness, color, quality)

                if(!this.filters.includes(this.outlineFilter)) {
                    this.filters.push(this.outlineFilter)
                }

            } else {
                Eli.Array.remove(this.filters, this.outlineFilter)
                this.outlineFilter = null
                delete this.getGamePicture().outlineFilterOptions
            }
        }

        /**
         * 
         * @returns {Game_AnimePicture}
         */
        getGamePicture() {
            return this.gamePicture
        }

        loadBitmap() {
            if(this.getGamePicture().backFilename) {
                this.backBitmap = ImageManager.loadPicture(this.getGamePicture().backFilename)
            } else {
                this.backBitmap = null
            }

            this.frontBitmap = ImageManager.loadPicture(this.getGamePicture().frontFilename)
            this.bitmap = this.frontBitmap
        }

        onBitmapLoad() {
            this.refreshFilters()
            this.createAnimeGroup()
            this.createMask()
        }

        createAnimeGroup() {
            const gamePic = this.getGamePicture()
            this.refreshXYProps(gamePic)
            this.animeAnimations = Eli.AnimeManager.createAnimations(gamePic, gamePic.getAllAnimeProps(), Eli.AnimeManager.createDefaultData())
            this.animeGroup.setAnimations(this.animeAnimations)
            this.animeGroup.onStart = this.onAnimeStart.bind(this)
            this.animeGroup.onComplete = this.onAnimeComplete.bind(this)
        }

        refreshXYProps(gamePic) {
            if(isNaN(gamePic.getAnimeProp("x").value[0])) {
                const {x, y} = this.createAnimePositionProps(gamePic.positionPreset)
                gamePic.getAnimeProp("x").value = x
                gamePic.getAnimeProp("y").value = y
            }
        }

        createAnimePositionProps(presetPos) {
            const [x1, y1] = this.createPosition(presetPos.initial, presetPos.target.offsetX, presetPos.target.offsetY)
            const [x2, y2] = this.createPosition(presetPos.target)

            return {
                x: [x1, x2],
                y: [y1, y2],
            }
        }

        createPosition(position, targetOffsetX = 0, targetOffsetY = 0) {
            const {alignX, alignY, offsetX, offsetY} = position
            const realOffsetX = new Function(`return ${offsetX}`).bind(this)
            const realOffsetY = new Function(`return ${offsetY}`).bind(this)
            const realTargetOffsetX = new Function(`return ${targetOffsetX}`).bind(this)
            const realTargetOffsetY = new Function(`return ${targetOffsetY}`).bind(this)
            const mainWidth = this.relativeObject().width ?? Graphics.boxWidth
            const mainHeight = this.relativeObject().height ?? Graphics.boxHeight

            const x = {
                left: realOffsetX(),
                center: (mainWidth / 2 - this.width / 2) + realOffsetX(),
                right: (mainWidth - this.width) + realOffsetX(),
                left_offScreen: 0 - (Math.abs(realTargetOffsetX()) + this.width),
                right_offScreen: Graphics.width + this.width + Math.abs(realTargetOffsetX()),
            }[alignX]

            const y = {
                top: realOffsetY(),
                center: (mainHeight / 2 - this.height / 2) + realOffsetY(),
                bottom: (mainHeight - this.height) + realOffsetY(),
                top_offScreen: 0 - (Math.abs(realTargetOffsetY()) + this.height),
                bottom_offScreen: Graphics.height + this.height + Math.abs(realTargetOffsetY()),
            }[alignY]

            return [Math.round(x), Math.round(y)]
        }

        onAnimeStart(anime) {
            this.visible = true
        }

        onAnimeComplete(anime) {
            const gamePic = this.getGamePicture()
            gamePic.animeRunning = false

            if(!gamePic.refreshOnSceneChange) {
                gamePic.reverseAnimePropValues()
            }

            Eli.Array.remove(Plugin.holdInterpreterIds, gamePic.id)
        }

        createMask() {
            this.mainSprite.createMask()

            if(this.mainSprite.mask) {
                const x = this.animeAnimations.find(item => item.data.propName === "x").getTargetValue()
                const y = this.animeAnimations.find(item => item.data.propName === "y").getTargetValue()
                this.mainSprite.updateMaskPosition(x, y)
            }

        }

        onMouseEnter() {
            $gameVariables.setValue(Plugin.getParam().mouseEnterVariable, this.getGamePicture().id)
            Plugin.clearDestination = this.getGamePicture().clickCommonEventId > 0
            const ceId = this.getGamePicture().hoverCommonEventId

            if(ceId) {
                Plugin.commonEventIds[ceId] = true
                $gameMap._commonEvents.push(new Game_CommonEvent(ceId))
            }
        }

        onMouseExit() {
            Plugin.clearDestination = false
            $gameVariables.setValue(Plugin.getParam().mouseExitVariable, this.getGamePicture().id)
            const ceId = this.getGamePicture().unhoverCommonEventId

            if(ceId) {
                Plugin.commonEventIds[ceId] = true
                $gameMap._commonEvents.push(new Game_CommonEvent(ceId))
            }
        }

        onPress() {

        }

        onClick() {
            $gameVariables.setValue(Plugin.getParam().clickVariable, this.getGamePicture().id)
            Plugin.clearDestination = this.getGamePicture().clickCommonEventId > 0
            const ceId = this.getGamePicture().clickCommonEventId

            if(ceId) {
                Plugin.commonEventIds[ceId] = true
                $gameMap._commonEvents.push(new Game_CommonEvent(ceId))
            }
        }

        update() {
            if(this.isReady()) {
                super.update()
                this.updateReady()
            }
        }

        isReady() {
            return this.bitmap && this.bitmap.isReady() && this.visible
        }

        updateReady() {
            const gamePic = this.getGamePicture()

            if(gamePic.animeRunning) {
                this.animeGroup.update()
            }

            this.updateProps(gamePic)

            this.updateBreathEffect(gamePic)

            if(gamePic.isFloating) {
                this.updateFloatEffect(gamePic)
            }

            this.updateShakeEffect(gamePic)

            if(gamePic.card.enable) {
                this.updateCardEffect(gamePic.card)
            }

            this.updateFilters(gamePic)
        }

        updateProps(gamePic) {
            this.updatePosition(gamePic)
            this.alpha = gamePic.alpha
            this.scale.set(gamePic.scaleX + gamePic.breathX, gamePic.scaleY + gamePic.breathY)
            this.skew.set(gamePic.skewX, gamePic.skewY)
            this.setColorTone([gamePic.toneRed, gamePic.toneGreen, gamePic.toneBlue, gamePic.toneGray])
            this.setBlendColor([gamePic.blendRed, gamePic.blendGreen, gamePic.blendBlue, gamePic.blendAlpha])
            this.setHue(gamePic.hue)
            this.updateAngle(gamePic)
        }

        updatePosition(gamePic) {
            this.x = this.relativeObject().x
            this.y = this.relativeObject().y

            if(gamePic.fixedPosition) {
                this.updateMapPosition(gamePic)
            } else {
                this.updateScreenPosition(gamePic)
            }
        }

        updateMapPosition(gamePic) {
            const tileWidth = $gameMap.tileWidth()
            const tileHeight = $gameMap.tileHeight()
            const tileX = gamePic.x / tileWidth
            const tileY = (gamePic.y - gamePic.floatY) / tileHeight

            this.x += $gameMap.adjustX(tileX) * tileWidth
            this.y += $gameMap.adjustY(tileY) * tileHeight
        }

        updateScreenPosition(gamePic) {
            this.x += gamePic.x
            this.y += gamePic.y - gamePic.floatY
        }

        setColorTone(tone) {
            if(this._colorTone.toString() !== tone.toString()) {
                this._colorTone = [...tone]
                this._updateColorFilter()
            }
        }

        setBlendColor(color) {
            if(this._blendColor.toString() !== color.toString()) {
                this._blendColor = [...color]
                this._updateColorFilter()
            }
        }

        setHue(hue) {
            if(this._hue !== hue) {
                this._hue = hue
                this._updateColorFilter()
            }
        }

        updateAngle(gamePic) {
            if(gamePic.rotationSpeed !== 0) {
                this.angle += gamePic.rotationSpeed
                gamePic.angle = this.angle
            } else {
                this.angle = gamePic.angle
            }
        }

        updateBreathEffect(gamePic) {
            if(gamePic.isBreathingX) {
                this.updateBreathEffectX(gamePic)
            }

            if(gamePic.isBreathingY) {
                this.updateBreathEffectY(gamePic)
            }
        }

        updateBreathEffectX(gamePic) {
            this.anchor.x = 0.5

            if(this.scale.x >= 0) {
                this.x += this.bitmap.width / 2
            } else {
                this.x -= this.bitmap.width / 2
            }

            if(gamePic.needStopBreathX && gamePic.breathX === 0) {
                this.stopBreathEffectX(gamePic)
            }
        }

        stopBreathEffectX(gamePic) {
            gamePic.isBreathingX = false
            this.refreshAnchor(true, false)
            this.x = gamePic.x
            this.animeGroup.childrens.find(child => child.data.propName === "breathX").pause()
        }

        updateBreathEffectY(gamePic) {
            this.anchor.y = 1
            this.y += this.bitmap.height * this.anchor.y

            if(gamePic.needStopBreathY && gamePic.breathY === 0) {
                this.stopBreathEffectY(gamePic)
            }
        }

        stopBreathEffectY(gamePic) {
            gamePic.isBreathingY = false
            this.refreshAnchor(false, true)
            this.y = gamePic.y
            this.animeGroup.childrens.find(child => child.data.propName === "breathY").pause()
        }

        updateFloatEffect(gamePic) {
            if(gamePic.needStopFloating && gamePic.floatY === 0) {
                gamePic.needStopFloating = false
                gamePic.isFloating = false
                this.animeGroup.childrens.find(child => child.data.propName === "floatY").pause()
            }
        }

        updateShakeEffect(gamePic) {
            if(gamePic.shakeDurationX > 0) {
                const value = Math.randomInt(gamePic.shakeX) * [1, -1][Math.randomInt(2)]
                this.x += value
                gamePic.shakeDurationX--
            }

            if(gamePic.shakeDurationY > 0) {
                const value = Math.randomInt(gamePic.shakeY) * [1, -1][Math.randomInt(2)]
                this.y += value
                gamePic.shakeDurationY--
            }
        }

        updateCardEffect(card) {
            if(card.flipType === "horizontal") {
                this.updateHorizontalCardFlip()

            } else if(card.flipType === "vertical") {
                this.updateVerticalCardFlip()

            } else {
                this.updateHorizontalCardFlip()
                this.updateVerticalCardFlip()
            }
        }

        updateHorizontalCardFlip() {
            if(this.scale.x < 0) {

                if(this.backBitmap) {
                    this.bitmap = this.backBitmap
                }

            } else if(this.scale.x > 0) {
                this.bitmap = this.frontBitmap
            }
        }

        updateVerticalCardFlip() {
            if(this.scale.y < 0) {

                if(this.backBitmap) {
                    this.bitmap = this.backBitmap
                }

            } else if(this.scale.y > 0) {
                this.bitmap = this.frontBitmap
            }
        }

        updateFilters(gamePic) {
            if(this.blurFilter) {
                this.blurFilter.enabled = gamePic.blurFilterEnabled
            }

            if(this.bulgePinchFilter) {
                this.bulgePinchFilter.enabled = gamePic.bulgePinchFilterEnabled
            }

            if(this.colorMatrixFilter) {
                this.colorMatrixFilter.enabled = gamePic.colorMatrixFilterEnabled
            }

            if(this.glowFilter) {
                this.glowFilter.enabled = gamePic.glowFilterEnabled
            }

            if(this.outlineFilter) {
                this.outlineFilter.enabled = gamePic.outlineFilterEnabled
            }
        }

        start() {
            this.visible = true
            this.getGamePicture().animeRunning = true
            this.animeGroup.play("normal")
        }

    },
    Sprite_MaskAnimePicture: class Sprite_MaskAnimePicture extends Sprite {

        initialize(bitmap, x, y) {
            super.initialize(bitmap)
            this.x = x
            this.y = y
        }
    },

    /**@type {string[]} */
    animePropList: [
        "x", "y", "alpha", "scaleX", "scaleY", "skewX", "skewY", "angle",
        "rotationSpeed", "toneRed", "toneGreen", "toneBlue",
        "toneGray", "blendRed", "blendGreen", "blendBlue", "blendAlpha", "hue",
        "breathX", "breathY", "floatY"
    ],

    /**@type {number[]} */
    commonEventIds: [],

    /**@type {boolean} */
    clearDestination: false,

    /**
     * All picture ids that are making the game interpreter wait for them finish theit movements.
     * @type {number[]} 
     * */
    holdInterpreterIds: [],

    sprites: {},

    initialize() {
        this.initParameters()
        this.registerPluginCommands()
    },

    initParameters() {
        const parameters = PluginManager.parameters("EliMZ_PictureManager")
        this.parameters = new this.Parameters(parameters)
    },

    /**
     * Register all plugin commands.
     */
    registerPluginCommands() {
        const commands = [
            "cmd_fullShow", "cmd_movePicture", "cmd_advancedMovePicture",
            "cmd_changeSettings", "cmd_advancedMoveProp", "cmd_cardEffect",
            "cmd_breathEffect", "cmd_disableBreath", "cmd_floatEffect", "cmd_disableFloat",
            "cmd_shakeEffect", "cmd_changeMask", "cmd_removeMask",
            "cmd_erase", "cmd_changeFilters", "cmd_operateFilters"
        ]
        Eli.PluginManager.registerCommands(this, commands)
    },

    /**
     * Gets the plugin parameters.
     * @returns {PictureManagerParameters}
     */
    getParam() {
        return this.parameters
    },

    /**
     * Gets an object with all the Super Picture game objects
     * @returns {Game_AnimePicture[]}
     */
    getAllGamePictures() {
        return $eliData.superPictures
    },

    /**
     * Gets a Super Picture game object.
     * @param {string|number} id The id of the picture.
     * @returns {Game_AnimePicture}
     */
    getGamePicture(id) {
        return $eliData.superPictures[id]
    },

    /**
     * Gets a Super Picture sprite.
     * @param {string|number} id The id of the picture.
     * @returns {Sprite_AnimePicture2}
     */
    getMainSpritePicture(id) {
        return this.sprites[id]
    },

    getAnimeSpritePicture(id) {
        return this.sprites[id].pictureSprite
    },
    // backwards compatibility
    getSpritePicture(id) {
        return this.getAnimeSpritePicture(id)
    },

    /**
     * Returns true if there are any picture holding the interpreter.
     * @returns {boolean}
     */
    isHoldingInterpreter() {
        return this.holdInterpreterIds.length > 0
    },

    cmd_fullShow(args) {
        const layerContainer = this.findContainer(args.container)

        if(!layerContainer) {
            alert(`The container "${args.container}" does not exist`)
            return
        }

        const id = this.parseIdArg(args.id)
        const filename = Eli.PluginManager.parseVariables(args.filename)
        const fixedPosition = args.fixedPosition === "true"
        const refreshOnSceneChange = args.refreshOnSceneChange === "true"

        const mainSettings = JSON.parse(Eli.PluginManager.parseVariables(args.mainSettings))
        const positionPreset = this.createPositionPreset(mainSettings, fixedPosition)
        const anchor = mainSettings.anchor
        const blendMode = mainSettings.blendMode
        const animeData = this.parseShowPictureAnimeData(mainSettings)
        const animeProps = this.createAllAnimeProps(animeData)
        const mask = this.parseMask(JSON.parse(args.mask))
        const zIndex = Number(Eli.PluginManager.parseVariables(args.zIndex))
        const relativeObject = args.relativeObject

        const basicMembers = {
            id, filename, fixedPosition, anchor, blendMode,
            refreshOnSceneChange, positionPreset, zIndex, relativeObject,
            easing: mainSettings.easing,
            duration: Number(mainSettings.duration),
            hoverCommonEventId: Number(args.hoverCommonEventId),
            clickCommonEventId: Number(args.clickCommonEventId),
            unhoverCommonEventId: Number(args.unhoverCommonEventId),
            container: args.container,
            groupName: Eli.PluginManager.parseVariables(args.groupName || "").toLowerCase().replaceAll(" ", ""),
        }

        const filters = this.parseFilters(JSON.parse(args.filters || "[]"))

        const gamePicture = new Game_AnimePicture(basicMembers, animeProps, mask, filters)

        if($eliData.superPictures[gamePicture.id]) {
            this.erasePicture($eliData.superPictures[gamePicture.id])
        }

        $eliData.superPictures[id] = gamePicture
        this.sprites[id] = new this.Sprite_MainPicture(gamePicture)
        layerContainer.addChild(this.getMainSpritePicture(id))

        this.getAnimeSpritePicture(id).bitmap.addLoadListener(() => {
            this.getAnimeSpritePicture(id).start()
        })

        if(args.wait === "true") {
            this.holdInterpreterIds.push(gamePicture.id)
        }
    },

    parseFilters(filters) {
        const filterConfig = {}

        for(const filter of filters) {
            const item = JSON.parse(filter)
            const name = this.getFilterName(item.type)
            filterConfig[name] = JSON.parse(item[name])
        }

        return filterConfig
    },

    getFilterName(type) {
        return {
            "Blur Filter": "blur",
            "Bulge Pinch Filter": "bulgePinch",
            "Color Matrix Filter": "colorMatrix",
            "Glow Filter": "glow",
            "Outline Filter": "outline",
        }[type]
    },

    cmd_movePicture(args) {
        const ids = this.parseIdList(args.id)
        const holdInterpreterIds = []

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {
                this.movePicture(gamePic, args.operationType, args.settings)
                holdInterpreterIds.push(id)
            }
        }

        if(args.wait === "true") {
            this.holdInterpreterIds.push(...holdInterpreterIds)
        }
    },

    movePicture(gamePic, operationType, settings) {
        const spritePic = this.getAnimeSpritePicture(gamePic.id)
        const animeData = this.parseMovePictureAnimeData(gamePic, settings, operationType)

        gamePic.animeProps = this.createAllAnimeProps(animeData)

        spritePic.createAnimeGroup()
        spritePic.start()
    },

    cmd_advancedMovePicture(args) {
        const ids = this.parseIdList(args.id)
        const holdInterpreterIds = []

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {
                this.advancedMovePicture(gamePic, args)
                holdInterpreterIds.push(id)
            }
        }

        if(args.wait === "true") {
            this.holdInterpreterIds.push(...holdInterpreterIds)
        }
    },

    advancedMovePicture(gamePic, args) {
        const animeSettings = JSON.parse(args.animeSettings)

        for(const param of animeSettings) {
            const settings = JSON.parse(Eli.PluginManager.parseVariables(param))
            const propName = settings.prop
            const animation = this.getPictureAnimation(gamePic.id, propName)

            if(!animation) continue

            const propData = this.parsePropData(settings, gamePic, propName)
            const animeProp = this.createAnimeProp(...propData)

            gamePic.setAnimeProp(propName, animeProp)
            this.restartAnimation(animation, ...propData)
        }

        gamePic.animeRunning = true
    },

    cmd_advancedMoveProp(args) {
        const ids = this.parseIdList(args.id)
        const holdInterpreterIds = []

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {
                this.processAdvancedProp(gamePic, args)
                holdInterpreterIds.push(id)
            }
        }

        if(args.wait === "true") {
            this.holdInterpreterIds.push(...holdInterpreterIds)
        }
    },

    processAdvancedProp(gamePic, args) {
        const propName = args.prop
        const animation = this.getPictureAnimation(gamePic.id, propName)
        const propData = this.parsePropData(args, gamePic, propName)
        const animeProp = this.createAnimeProp(...propData)

        gamePic.getAllAnimeProps()[propName] = animeProp
        this.restartAnimation(animation, ...propData)
        gamePic.animeRunning = true
    },

    cmd_changeSettings(args) {
        const ids = this.parseIdList(args.id)

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {
                this.changeSettings(gamePic, args)
            }
        }
    },

    changeSettings(gamePic, args) {
        const oldFrontFilename = gamePic.frontFilename

        gamePic.frontFilename = args.filename || gamePic.frontFilename
        gamePic.refreshOnSceneChange = args.refreshOnSceneChange ? args.refreshOnSceneChange === "true" : gamePic.refreshOnSceneChange
        gamePic.hoverCommonEventId = args.hoverCommonEventId ? Number(args.hoverCommonEventId) : gamePic.hoverCommonEventId
        gamePic.clickCommonEventId = args.clickCommonEventId ? Number(args.clickCommonEventId) : gamePic.clickCommonEventId
        gamePic.unhoverCommonEventId = args.unhoverCommonEventId ? Number(args.unhoverCommonEventId) : gamePic.unhoverCommonEventId

        if(args.relativeObject !== "same") {
            gamePic.relativeObject = args.relativeObject
            this.getAnimeSpritePicture(gamePic.id).refreshRelativeObject()
        }

        if(gamePic.frontFilename !== oldFrontFilename) {
            this.getAnimeSpritePicture(gamePic.id).bitmap = ImageManager.loadPicture(gamePic.frontFilename)
        }

        if(args.groupName) {
            gamePic.groupName = Eli.PluginManager.parseVariables(args.groupName).replaceAll(" ", "").toLowerCase()
        }
    },

    cmd_breathEffect(args) {
        const ids = this.parseIdList(args.id)
        const enableBreathX = args.enableBreathX
        const enableBreathY = args.enableBreathY

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {

                if(enableBreathX) {
                    const prop = this.createSpecialAdvancedProp("breathX", args.breathX, args.durationX)
                    this.processAdvancedProp(gamePic, prop)
                    gamePic.isBreathingX = true
                    gamePic.needStopBreathX = false
                    this.getPictureAnimation(id, "breathX").resume()
                } else {
                    gamePic.needStopBreathX = true
                }

                if(enableBreathY) {
                    const prop = this.createSpecialAdvancedProp("breathY", args.breathY, args.durationY)
                    this.processAdvancedProp(gamePic, prop)
                    gamePic.isBreathingY = true
                    gamePic.needStopBreathY = false
                    this.getPictureAnimation(id, "breathY").resume()
                } else {
                    gamePic.needStopBreathY = true
                }
            }
        }
    },

    createSpecialAdvancedProp(propName, target, duration) {
        return {
            prop: propName,
            operationType: "Set",
            value: `0,${target}`,
            duration: duration,
            easing: "linear",
            loop: "-1",
            direction: "alternate",
            wait: false,
        }
    },

    cmd_disableBreath(args) {
        const ids = this.parseIdList(args.id)

        const disableBreathX = args.disableBreathX === "true"
        const disableBreathY = args.disableBreathY === "true"

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {

                if(disableBreathX) {
                    gamePic.needStopBreathX = true

                } else {
                    gamePic.isBreathingX = true
                    gamePic.needStopBreathX = false
                    this.getPictureAnimation(id, "breathX").resume()
                }

                if(disableBreathY) {
                    gamePic.needStopBreathY = true

                } else {
                    gamePic.isBreathingY = true
                    gamePic.needStopBreathY = false
                    this.getPictureAnimation(id, "breathY").resume()
                }
            }
        }
    },

    cmd_floatEffect(args) {
        const ids = this.parseIdList(args.id)

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {

                const prop = this.createSpecialAdvancedProp("floatY", args.floatY, args.duration)
                this.processAdvancedProp(gamePic, prop)
                gamePic.isFloating = true
                gamePic.needStopFloating = false
                this.getPictureAnimation(id, "floatY").resume()
            }
        }
    },

    cmd_disableFloat(args) {
        const ids = this.parseIdList(args.id)

        const disableFloat = args.disableFloat === "true"

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {

                if(disableFloat) {
                    gamePic.needStopFloating = true

                } else {
                    gamePic.isFloating = true
                    gamePic.needStopFloating = false
                    this.getPictureAnimation(id, "floatY").resume()
                }
            }
        }
    },

    cmd_shakeEffect(args) {
        const ids = this.parseIdList(args.id)
        const shakeX = Number(args.shakeX)
        const shakeY = Number(args.shakeY)
        const durationX = Number(args.durationX)
        const durationY = Number(args.durationY)

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {
                gamePic.startShake(shakeX, durationX, shakeY, durationY)
            }
        }
    },

    cmd_cardEffect(args) {
        const ids = this.parseIdList(args.id)

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {
                const spritePic = this.getAnimeSpritePicture(id)
                gamePic.card.enable = true
                gamePic.card.flipType = args.flipType
                gamePic.anchor = "Center"
                spritePic.refreshAnchor(true, true)

                if(args.frontFilename) {
                    gamePic.frontFilename = args.frontFilename
                }

                gamePic.backFilename = args.backFilename
                spritePic.loadBitmap()
            }
        }
    },

    cmd_changeMask(args) {
        const ids = this.parseIdList(args.id)

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {
                const sprite = this.getAnimeSpritePicture(id)
                const maskArg = {...args}
                const mask = this.parseMask(maskArg)

                gamePic.mask = mask
                sprite.createMask()
            }
        }
    },

    cmd_removeMask(args) {
        const ids = this.parseIdList(args.id)

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {
                const sprite = this.getMainSpritePicture(id)

                gamePic.mask.type = "none"
                gamePic.mask.image = ""
                sprite.createMask()
            }
        }
    },

    cmd_erase(args) {
        const ids = this.parseIdList(args.id)

        for(const id of ids) {
            const gamePic = this.getGamePicture(id)

            if(gamePic) {
                this.erasePicture(gamePic)
            }
        }
    },

    erasePicture(gamePic) {
        const layerContainer = Plugin.findContainer(gamePic.container)

        if(layerContainer) {
            const oldSprite = layerContainer.children.find(child => child.getGamePicture().id == gamePic.id)
            layerContainer.removeChild(oldSprite)
            oldSprite.destroy()
            Eli.Array.remove(Plugin.holdInterpreterIds, gamePic.id)
            delete $eliData.superPictures[gamePic.id]
        }

    },

    createPositionPreset(param, fixedPosition) {
        const positionPreset = {
            initial: {
                alignX: param.initialAlignX,
                alignY: param.initialAlignY,
                offsetX: param.initialOffsetX,
                offsetY: param.initialOffsetY,
            },
            target: {
                alignX: param.targetAlignX,
                alignY: param.targetAlignY,
                offsetX: param.targetOffsetX,
                offsetY: param.targetOffsetY,
            }
        }

        if(param.enableTarget === "false") {
            positionPreset.target = {...positionPreset.initial}
        }

        if(fixedPosition) {
            positionPreset.initial.alignX = "left"
            positionPreset.initial.alignY = "top"
            positionPreset.initial.alignX = "left"
            positionPreset.initial.alignY = "top"
        }

        return positionPreset
    },

    parseShowPictureAnimeData(param) {
        const easing = param.easing
        const loop = this.parseLoopArg(param.loop)
        const direction = param.direction
        const initial = this.parseAnimeValues(param, "initial")
        let duration = Number(param.duration) || 1

        if(param.enableTarget === "true") {
            var target = this.parseAnimeValues(param, "target")

        } else {
            var target = {...initial}
            duration = 1
        }

        return {initial, target, duration, loop, direction, easing}
    },

    parseAnimeValues(param, type) {
        const [scaleX, scaleY] = param[`${type}Scale`].split(",")
        const [skewX, skewY] = param[`${type}Skew`].split(",")
        const [angle, rotation] = param[`${type}AngleRotation`].split(",")
        const tone = param[`${type}Tone`].split(",")
        const blendColor = param[`${type}BlendColor`].split(",")
        const alpha = param[`${type}Alpha`]
        const hue = param[`${type}Hue`]

        return {
            scaleX: Number(scaleX),
            scaleY: Number(scaleY),
            skewX: Number(skewX),
            skewY: Number(skewY),
            alpha: Number(alpha),
            angle: Number(angle),
            rotationSpeed: Number(rotation),
            toneRed: Number(tone[0]),
            toneGreen: Number(tone[1]),
            toneBlue: Number(tone[2]),
            toneGray: Number(tone[3]),
            blendRed: Number(blendColor[0]),
            blendGreen: Number(blendColor[1]),
            blendBlue: Number(blendColor[2]),
            blendAlpha: Number(blendColor[3] * 255),
            hue: Number(hue),
            // Special Members
            breathX: 0,
            breathY: 0,
            floatY: 0,
        }
    },

    parseMask(mask) {
        const [width, height] = mask.size.split(",")

        return {
            type: mask.type,
            image: Eli.PluginManager.parseVariables(mask.image),
            alignX: mask.alignX,
            alignY: mask.alignY,
            offsetX: Number(mask.offsetX),
            offsetY: Number(mask.offsetY),
            width: Number(width),
            height: Number(height),
            circleRadius: Number(mask.circleRadius),
            roundedRectBorder: Number(mask.roundedRectBorder),
            starEdges: Number(mask.starEdges),
            starOuterRadius: Number(mask.starOuterRadius),
            starInnerRadius: Number(mask.starInnerRadius),
        }
    },

    createAllAnimeProps(animeData) {
        const {initial, target, duration, loop, direction, easing} = animeData
        const animeProps = {}

        for(const propName of this.animePropList) {
            const value1 = initial[propName]
            const value2 = target[propName]

            animeProps[propName] = this.createAnimeProp(value1, value2, duration, loop, direction, easing)
        }

        return animeProps
    },

    createAnimeProp(initial, target, duration, loop, direction, easing) {
        return {
            value: [initial, target],
            duration: duration,
            loop: loop,
            direction: direction,
            easing: easing
        }
    },

    parseMovePictureAnimeData(gamePic, args, operationType) {
        const param = JSON.parse(Eli.PluginManager.parseVariables(args))
        const loop = this.parseLoopArg(param.loop)
        const direction = param.direction || "normal"
        const easing = param.easing || "linear"
        const duration = Number(param.duration) || 1
        const isXSame = param.alignX === "left" && param.offsetX === "x"
        const isYSame = param.alignY === "top" && param.offsetY === "y"
        const initial = {}
        const target = {}

        for(const propName of this.animePropList) {
            initial[propName] = gamePic[propName]
        }

        if(operationType === "Add") {
            var valueCallback = this.addPropValueForMovePicture.bind(this)
            var targetX = isXSame ? gamePic.x : gamePic.x + this.createPositionX(param.alignX, param.offsetX, gamePic)
            var targetY = isYSame ? gamePic.y : gamePic.y + this.createPositionY(param.alignY, param.offsetY, gamePic)
        } else {
            var valueCallback = this.setPropValueForMovePicture.bind(this)
            var targetX = isXSame ? gamePic.x : this.createPositionX(param.alignX, param.offsetX, gamePic)
            var targetY = isYSame ? gamePic.y : this.createPositionY(param.alignY, param.offsetY, gamePic)
        }

        for(const propName of this.animePropList) {
            const value = valueCallback(gamePic, param, propName)
            target[propName] = value ?? gamePic[propName]
        }

        target.x = targetX
        target.y = targetY

        return {initial, target, loop, direction, easing, duration}
    },

    addPropValueForMovePicture(pic, param, propName) {
        if(isNaN(param[propName])) {
            return pic[propName]
        } else {
            const value = this.evalValue(param[propName], pic.id)
            return pic[propName] + value
        }
    },

    setPropValueForMovePicture(pic, param, propName) {
        if(!isNaN(pic[param[propName]])) {
            return pic[param[propName]]
        } else {
            return this.evalValue(param[propName], pic.id)
        }
    },

    evalValue(value, id) {
        const textFunc = `const spritePic = this.getAnimeSpritePicture("${id}");
    const gamePic = this.getGamePicture("${id}")`
        const func = new Function(`${textFunc};return ${value}`).bind(this)

        return func()
    },

    createPositionX(alignX, offsetX, gamePic) {
        const realOffsetX = this.evalValue(offsetX, gamePic.id)
        const sprite = this.getAnimeSpritePicture(gamePic.id)
        const x = {
            left: realOffsetX,
            center: (Graphics.width / 2 - sprite.width / 2) + realOffsetX,
            right: (Graphics.width - sprite.width) + realOffsetX,
            left_offScreen: 0 - sprite.width,
            right_offScreen: Graphics.width + sprite.width,
        }[alignX]

        return Math.round(x)

    },

    createPositionY(alignY, offsetY, gamePic) {
        const realOffsetY = this.evalValue(offsetY, gamePic.id)
        const sprite = this.getAnimeSpritePicture(gamePic.id)
        const y = {
            top: realOffsetY,
            center: (Graphics.height / 2 - sprite.height / 2) + realOffsetY,
            bottom: (Graphics.height - sprite.height) + realOffsetY,
            top_offScreen: 0 - sprite.height,
            bottom_offScreen: Graphics.height + sprite.height,
        }[alignY]

        return Math.round(y)
    },

    getPictureAnimation(id, propName) {
        const spritePic = this.getAnimeSpritePicture(id)
        const index = this.animePropList.indexOf(propName)

        return spritePic.animeGroup.childrens[index]
    },

    parsePropData(param, gamePic, propName) {
        const duration = Number(param.duration)
        const values = param.value.split(",")
        const loop = this.parseLoopArg(param.loop)
        const id = gamePic.id

        if(values.length === 1) {
            const currentPropValue = gamePic[propName]
            values.unshift(currentPropValue)
        }

        values[0] = this.evalValue(values[0], id)

        if(param.operationType === "Add") {
            values[1] = values[0] + this.evalValue(values[1], id)
        } else {
            values[1] = this.evalValue(values[1], id)
        }

        return [...values, duration, loop, param.direction, param.easing]
    },

    restartAnimation(animation, initial, target, duration, loop, direction, easing) {
        animation.data.value.start = initial
        animation.data.value.target = target
        animation.data.duration.target = duration
        animation.data.easing = easing
        animation.data.direction.type = direction
        animation.data.loop.target = loop
        animation.data.loop.current = 0
        animation.restart("normal")
    },

    parseIdArg(id) {
        const parsedId = Eli.PluginManager.parseVariables(id)
        return isNaN(parsedId) ? parsedId : Number(parsedId)
    },

    parseLoopArg(loop) {
        const value = Number(loop)
        return loop < 0 ? Infinity : value
    },

    /**
     * 
     * @param {string} layerPosition 
     * @returns {Container_AnimePicture}
     */
    findContainer(layerPosition) {
        switch(layerPosition) {
            case "Tilemap":
                return SceneManager._scene._spriteset?._tilemap
            case "Below Weather":
                return SceneManager._scene._spriteset?.belowWeatherSuperPictureContainer
            case "Below Window":
                return SceneManager._scene.belowWindowSuperPictureContainer
            case "Above Window":
                return SceneManager._scene.aboveWindowSuperPictureContainer
            case "Above Everything":
                return SceneManager._scene.topSuperPictureContainer
            default:
                return SceneManager._scene._spriteset?.superPictureContainer
        }
    },

    restorePictures() {
        for(const id in Plugin.getAllGamePictures()) {
            const gamePicture = Plugin.getGamePicture(id)
            const container = Plugin.findContainer(gamePicture.container)

            if(container) {
                const mainSprite = new this.Sprite_MainPicture(gamePicture)
                container.addChild(mainSprite)

                if(gamePicture.refreshOnSceneChange) {
                    mainSprite.pictureSprite.bitmap.addLoadListener(mainSprite.pictureSprite.start.bind(mainSprite.pictureSprite))

                } else {
                    mainSprite.pictureSprite.visible = true
                }

                Plugin.sprites[id] = mainSprite
            }
        }
    },

    parseIdList(id) {
        if(id === "All") {
            return Object.keys(this.getAllGamePictures())

        } else if(id.toLowerCase().includes("group:")) {
            const groupName = id.substring(6).replaceAll(" ", "").toLowerCase()
            const picIds = []

            for(const key in this.getAllGamePictures()) {
                const pic = this.getGamePicture(key)

                if(pic.groupName === groupName) {
                    picIds.push(pic.id)
                }
            }

            return picIds

        } else {
            return Eli.PluginManager.createIdList(id)
        }
    },

    cmd_changeFilters(args) {
        const ids = this.parseIdList(args.id)
        const filterConfigs = this.parseFilters(JSON.parse(args.filters))

        for(const id of ids) {
            const pic = this.getGamePicture(id)

            if(pic) {

                for(const name in filterConfigs) {
                    const camelCaseName = this.stringToCamelCase(name)
                    const spr = this.getAnimeSpritePicture(id)
                    pic[`create${camelCaseName}Filter`](filterConfigs[name])

                    if(spr) {
                        spr[`refresh${camelCaseName}Filter`]()
                    }
                }
            }
        }

    },

    stringToCamelCase(str) {
        return str[0].toUpperCase() + str.substring(1)
    },

    cmd_operateFilters(args) {
        const ids = this.parseIdList(args.id)
        const operation = args.operation
        const filterList = JSON.parse(args.filterList)
        const func = this[`filterOperation${operation}`].bind(this)

        for(const id of ids) {
            const pic = this.getGamePicture(id)

            if(pic) {
                const spr = this.getAnimeSpritePicture(id)

                for(const type of filterList) {
                    const name = this.getFilterName(type)
                    func(name, pic, spr)
                }
            }
        }
    },

    filterOperationEnable(name, gamePic, spr) {
        gamePic[`${name}FilterEnabled`] = true
    },

    filterOperationDisable(name, gamePic, spr) {
        gamePic[`${name}FilterEnabled`] = false
    },

    filterOperationToggle(name, gamePic, spr) {
        gamePic[`${name}FilterEnabled`] = !gamePic[`${name}FilterEnabled`]
    },

    filterOperationDelete(name, gamePic, spr) {
        gamePic[`${name}FilterEnabled`] = false
        gamePic[`${name}FilterCreated`] = false

        if(spr) {
            spr[`refresh${this.stringToCamelCase(name)}Filter`]()
        }
    },
}

const Plugin = Eli.PictureManager
const Alias = {}

Plugin.initialize()

/* --------------------------------- TILEMAP -------------------------------- */
Tilemap.CombinedLayer.prototype.getGamePicture = function() {
    return {id: null}
}

/* --------------------------------- SPRITE --------------------------------- */
Sprite.prototype.getGamePicture = function() {
    return {id: null}
}

/* -------------------------------- SAVE DATA ------------------------------- */
Alias.Eli_SavedContents_initialize = Eli_SavedContents.prototype.initialize
Eli_SavedContents.prototype.initialize = function() {
    Alias.Eli_SavedContents_initialize.call(this)
    this.superPictures = {}
}

/* ------------------------------- SCENE BASE ------------------------------- */
Scene_Base.prototype.createBelowWindowSuperPictureContainer = function() {
    this.belowWindowSuperPictureContainer = new Plugin.Container_AnimePicture()
    this.addChild(this.belowWindowSuperPictureContainer)
}

Scene_Base.prototype.createAboveWindowSuperPictureContainer = function() {
    this.aboveWindowSuperPictureContainer = new Plugin.Container_AnimePicture()
    this.addChild(this.aboveWindowSuperPictureContainer)
}

Alias.Scene_Base_createWindowLayer = Scene_Base.prototype.createWindowLayer
Scene_Base.prototype.createWindowLayer = function() {
    this.createBelowWindowSuperPictureContainer()
    Alias.Scene_Base_createWindowLayer.call(this)
    this.createAboveWindowSuperPictureContainer()
}

/* -------------------------------- SCENE MAP ------------------------------- */
Alias.Scene_Map_create = Scene_Map.prototype.create
Scene_Map.prototype.create = function() {
    Plugin.holdInterpreterIds = []
    Plugin.sprites = []
    Alias.Scene_Map_create.call(this)
    this.topSuperPictureContainer = new Plugin.Container_AnimePicture()
}

Alias.Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects
Scene_Map.prototype.createDisplayObjects = function() {
    Alias.Scene_Map_createDisplayObjects.call(this)
    Plugin.restorePictures()
}

Alias.Scene_Map_isAnyButtonPressed = Scene_Map.prototype.isAnyButtonPressed
Scene_Map.prototype.isAnyButtonPressed = function() {
    return Alias.Scene_Map_isAnyButtonPressed.call(this) || Plugin.clearDestination
}

Alias.Scene_Map_start = Scene_Map.prototype.start
Scene_Map.prototype.start = function() {
    Alias.Scene_Map_start.call(this)
    this.addChild(this.topSuperPictureContainer)
}

/* ------------------------------ SCENE BATTLE ------------------------------ */
Alias.Scene_Battle_create = Scene_Battle.prototype.create
Scene_Battle.prototype.create = function() {
    Alias.Scene_Battle_create.call(this)
    this.topSuperPictureContainer = new Plugin.Container_AnimePicture()
}

Alias.Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects
Scene_Battle.prototype.createDisplayObjects = function() {
    Alias.Scene_Battle_createDisplayObjects.call(this)
    Plugin.restorePictures()
}

Alias.Scene_Battle_start = Scene_Battle.prototype.start
Scene_Battle.prototype.start = function() {
    Alias.Scene_Battle_start.call(this)
    this.addChild(this.topSuperPictureContainer)
}

/* ----------------------------- SPRITESET BASE ----------------------------- */
Alias.Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer
Spriteset_Base.prototype.createUpperLayer = function() {
    this.createSuperPictureContainer()
    Alias.Spriteset_Base_createUpperLayer.call(this)
}

Spriteset_Base.prototype.createSuperPictureContainer = function() {
    this.superPictureContainer = new Plugin.Container_AnimePicture()
    this.addChild(this.superPictureContainer)
}

/* ------------------------------ SPRITESET MAP ----------------------------- */
Spriteset_Map.prototype.createBelowWeatherSuperPictureContainer = function() {
    this.belowWeatherSuperPictureContainer = new Plugin.Container_AnimePicture()
    this.addChild(this.belowWeatherSuperPictureContainer)
}

Alias.Spriteset_Map_createWeather = Spriteset_Map.prototype.createWeather
Spriteset_Map.prototype.createWeather = function() {
    this.createBelowWeatherSuperPictureContainer()
    Alias.Spriteset_Map_createWeather.call(this)
}

/* ---------------------------- GAME COMMON EVENT --------------------------- */
Alias.Game_CommonEvent_isActive = Game_CommonEvent.prototype.isActive
Game_CommonEvent.prototype.isActive = function() {
    return Plugin.commonEventIds[this._commonEventId] || Alias.Game_CommonEvent_isActive.call(this)
}

/* ---------------------------- GAME_INTERPRETER ---------------------------- */
Alias.Game_Interpreter_initialize = Game_Interpreter.prototype.initialize
Game_Interpreter.prototype.initialize = function() {
    Alias.Game_Interpreter_initialize.call(this)
    this.superPictureId = undefined
}

Alias.Game_Interpreter_updateWait = Game_Interpreter.prototype.updateWait
Game_Interpreter.prototype.updateWait = function() {
    return Alias.Game_Interpreter_updateWait.call(this) || Plugin.isHoldingInterpreter()
}

Alias.Game_Interpreter_onCommonEventEnd = Game_Interpreter.prototype.onCommonEventEnd
Game_Interpreter.prototype.onCommonEventEnd = function() {
    Alias.Game_Interpreter_onCommonEventEnd.call(this)
    if(this.isAnimePictureCommonEvent()) {
        this.endAnimePictureCommonEvent()
    }
}

Game_Interpreter.prototype.isAnimePictureCommonEvent = function() {
    return Plugin.commonEventIds[this._commonEventId]
}

Game_Interpreter.prototype.endAnimePictureCommonEvent = function() {
    const id = this._commonEventId
    const index = $gameMap._commonEvents.findIndex(item => item._commonEventId === id)
    $gameMap._commonEvents.splice(index, 1)
    Plugin.commonEventIds[this._commonEventId] = false
}

/* --------------------------- SUPER GAME PICTURE --------------------------- */
/**
 * 
 * @param {*} basicMembers 
 * @param {*} animeProps 
 * @param {*} mask 
 */
Game_AnimePicture.prototype.initialize = function(basicMembers, animeProps, mask, filters) {
    this.initBasicMembers(basicMembers)
    this.initAnimeProps(animeProps)
    this.initFilterMembers(filters)
    this.initMask(mask)
    this.initCurrentMembers()
    this.initSpecialMembers()
}

Game_AnimePicture.prototype.initBasicMembers = function(data) {
    this.id = data.id
    this.frontFilename = data.filename
    this.backFilename = data.backFilename || ""
    this.easing = data.easing
    this.duration = data.duration
    this.anchor = data.anchor
    this.blendMode = data.blendMode
    this.fixedPosition = data.fixedPosition
    this.refreshOnSceneChange = data.refreshOnSceneChange
    this.hoverCommonEventId = data.hoverCommonEventId
    this.clickCommonEventId = data.clickCommonEventId
    this.unhoverCommonEventId = data.unhoverCommonEventId
    this.positionPreset = data.positionPreset
    this.container = data.container
    this.zIndex = data.zIndex
    this.relativeObject = data.relativeObject
    this.groupName = data.groupName || ""
    this.animeRunning = true
}

Game_AnimePicture.prototype.initAnimeProps = function(animeProps) {
    this.animeProps = animeProps
}

Game_AnimePicture.prototype.initFilterMembers = function(filters) {
    this.initBlurFilterMembers(filters.blur)
    this.initBulgePinchFilterMembers(filters.bulgePinch)
    this.initColorMatrixFilterMembers(filters.colorMatrix)
    this.initGlowFilterMembers(filters.glow)
    this.initOutlineFilterMembers(filters.outline)
}

Game_AnimePicture.prototype.initBlurFilterMembers = function(filterOptions) {
    this.blurFilterCreated = false
    this.blurFilterEnabled = false

    if(filterOptions) {
        this.createBlurFilter(filterOptions)
    }
}

Game_AnimePicture.prototype.createBlurFilter = function(filterOptions) {
    this.blurFilterCreated = true
    this.blurFilterEnabled = true
    this.setBlurFilterOptions(filterOptions)
}

Game_AnimePicture.prototype.setBlurFilterOptions = function(filterOptions) {
    const {strength, quality, resolution, kernelSize} = filterOptions
    this.blurFilterOptions = {
        strength: Number(strength),
        quality: Number(quality),
        resolution: Number(resolution),
        kernelSize: Number(kernelSize)
    }
}

Game_AnimePicture.prototype.getBlurFilterOptions = function() {
    return this.blurFilterOptions
}

Game_AnimePicture.prototype.initBulgePinchFilterMembers = function(filterOptions) {
    this.bulgePinchFilterCreated = false
    this.bulgePinchFilterEnabled = false

    if(filterOptions) {
        this.createBulgePinchFilter(filterOptions)
    }
}

Game_AnimePicture.prototype.createBulgePinchFilter = function(filterOptions) {
    this.bulgePinchFilterCreated = true
    this.bulgePinchFilterEnabled = true
    this.setBulgePinchFilterOptions(filterOptions)
}

Game_AnimePicture.prototype.setBulgePinchFilterOptions = function(filterOptions) {
    const {center, radius, strength} = filterOptions
    const {x, y} = {
        UpperLeft: {x: 0, y: 0}, // Default
        UpperCenter: {x: 0.5, y: 0},
        UpperRight: {x: 1, y: 0},

        CenterLeft: {x: 0, y: 0.5},
        Center: {x: 0.5, y: 0.5}, // Default
        CenterRight: {x: 1, y: 0.5},

        LowLeft: {x: 0, y: 1},
        LowCenter: {x: 0.5, y: 1},
        LowRight: {x: 1, y: 1},
    }[center]
    this.bulgePinchFilterOptions = {
        centerX: x,
        centerY: y,
        radius: Number(radius),
        strength: Number(strength),
    }
}

Game_AnimePicture.prototype.getBulgePinchFilterOptions = function() {
    return this.bulgePinchFilterOptions
}

Game_AnimePicture.prototype.initColorMatrixFilterMembers = function(filterOptions) {
    this.colorMatrixFilterCreated = false
    this.colorMatrixFilterEnabled = false

    if(filterOptions) {
        this.createColorMatrixFilter(filterOptions)
    }
}

Game_AnimePicture.prototype.createColorMatrixFilter = function(filterOptions) {
    this.colorMatrixFilterCreated = true
    this.colorMatrixFilterEnabled = true
    this.setColorMatrixFilterOptions(filterOptions)
}

Game_AnimePicture.prototype.setColorMatrixFilterOptions = function(filterOptions) {
    const {
        blackAndWhite, brightness, brightnessAmount, browni, contrast, contrastAmount,
        desaturate, greyscale, greyscaleAmount, kodachrome, lsd,
        negative, night, nightAmount, polaroid,
        predator, predatorAmount, saturate, saturateAmount,
        sepia, technicolor, vintage
    } = filterOptions

    this.colorMatrixFilterOptions = {
        type1: {
            blackAndWhite, browni, desaturate, kodachrome, lsd,
            negative, polaroid, sepia, technicolor, vintage,
        },
        type2: {
            brightness, contrast, greyscale, night, predator, saturate,
            brightnessAmount: Number(brightnessAmount),
            contrastAmount: Number(contrastAmount),
            greyscaleAmount: Number(greyscaleAmount),
            nightAmount: Number(nightAmount),
            predatorAmount: Number(predatorAmount),
            saturateAmount: Number(saturateAmount),
        }
    }
}

Game_AnimePicture.prototype.getColorMatrixFilterOptions = function() {
    return this.colorMatrixFilterOptions
}

Game_AnimePicture.prototype.initGlowFilterMembers = function(filterOptions) {
    this.glowFilterCreated = false
    this.glowFilterEnabled = false

    if(filterOptions) {
        this.createGlowFilter(filterOptions)
    }
}

Game_AnimePicture.prototype.createGlowFilter = function(filterOptions) {
    this.glowFilterCreated = true
    this.glowFilterEnabled = true
    this.setGlowFilterOptions(filterOptions)
}

Game_AnimePicture.prototype.setGlowFilterOptions = function(filterOptions) {
    const {color, distance, innerStrength, outerStrength, quality, knockout} = filterOptions

    this.glowFilterOptions = {
        color: Eli.ColorManager.getHexValue(color.substring(1)),
        distance: Number(distance),
        innerStrength: Number(innerStrength),
        outerStrength: Number(outerStrength),
        quality: Number(quality).clamp(0, 1),
        knockout: knockout === "true",
    }
}

Game_AnimePicture.prototype.getGlowFilterOptions = function() {
    return this.glowFilterOptions
}

Game_AnimePicture.prototype.initOutlineFilterMembers = function(filterOptions) {
    this.outlineFilterCreated = false
    this.outlineFilterEnabled = false

    if(filterOptions) {
        this.createOutlineFilter(filterOptions)
    }
}

Game_AnimePicture.prototype.createOutlineFilter = function(filterOptions) {
    this.outlineFilterCreated = true
    this.outlineFilterEnabled = true
    this.setOutlineFilterOptions(filterOptions)
}

Game_AnimePicture.prototype.setOutlineFilterOptions = function({thickness, color, quality}) {
    this.outlineFilterOptions = {
        thickness: Number(thickness),
        color: Eli.ColorManager.getHexValue(color.substring(1)),
        quality: Number(quality).clamp(0, 1),
    }
}

Game_AnimePicture.prototype.getOutlineFilterOptions = function() {
    return this.outlineFilterOptions
}

Game_AnimePicture.prototype.initMask = function(mask) {
    this.mask = mask
}

Game_AnimePicture.prototype.initCurrentMembers = function() {
    this.x = -10000
    this.y = -10000
    this.alpha = 1
    this.scaleX = 1
    this.scaleY = 1
    this.skewX = 0
    this.skewY = 0
    this.angle = 0
    this.rotationSpeed = 0
    this.toneRed = 0
    this.toneGreen = 0
    this.toneBlue = 0
    this.toneGray = 0
    this.blendRed = 0
    this.blendGreen = 0
    this.blendBlue = 0
    this.blendAlpha = 0
    this.hue = 0
}

Game_AnimePicture.prototype.initSpecialMembers = function() {
    this.initBreathEffect()
    this.initFloatEffect()
    this.initShakeEffect()
    this.initCardEffect()
}

Game_AnimePicture.prototype.initBreathEffect = function() {
    this.breathX = 0
    this.breathY = 0
    this.isBreathingX = false
    this.isBreathingY = false
    this.needStopBreathY = false
    this.needStopBreathX = false
}

Game_AnimePicture.prototype.initFloatEffect = function() {
    this.floatY = 0
    this.isFloating = false
    this.needStopFloating = false
}

Game_AnimePicture.prototype.initShakeEffect = function() {
    this.shakeX = 0
    this.shakeY = 0
    this.shakeDurationX = 0
    this.shakeDurationY = 0
}

Game_AnimePicture.prototype.initCardEffect = function() {
    this.card = {
        enable: false,
        flipType: "horizontal"
    }
}

/**
 * Get all the anime props of the picture.
 * @returns {AnimePropList} Cola
 */
Game_AnimePicture.prototype.getAllAnimeProps = function() {
    return this.animeProps
}

/**
 * 
 * @param {string} propName The name of the property to get: x, y, alpha, scaleX, scaleY, skewX, skewY, angle, rotationSpeed, toneRed, toneGreen, toneBlue, toneGray, blendRed, blendGreen, blendBlue, blendAlpha, hue 
 * @returns {AnimeProp} The anime data of a property.
 */
Game_AnimePicture.prototype.getAnimeProp = function(propName) {
    return this.getAllAnimeProps()[propName]
}

/**
 * 
 * @param {string} propName The name of the property you want to change.
 * @param {AnimeProp} propData The data that will be set into the anime property.
 */
Game_AnimePicture.prototype.setAnimeProp = function(propName, propData) {
    this.getAllAnimeProps()[propName] = propData
}

/**
 * 
 * @param {number} power 
 * @param {number} duration 
 * @param {boolean} horizontal 
 * @param {boolean} vertical 
 */
Game_AnimePicture.prototype.startShake = function(shakeX, durationX, shakeY, durationY) {
    this.shakeX = shakeX
    this.shakeDurationX = durationX
    this.shakeY = shakeY
    this.shakeDurationY = durationY
}

Game_AnimePicture.prototype.reverseAnimePropValues = function() {
    for(const prop in this.animeProps) {
        this.getAnimeProp(prop).value.reverse()
    }
}

/* -------------------------- SPRITE ANIME PICTURE -------------------------- */
if(Plugin.getParam().touchOpacity > 0) {

    Alias.Sprite_AnimePicture_hitTest = Plugin.Sprite_AnimePicture.prototype.hitTest
    Plugin.Sprite_AnimePicture.prototype.hitTest = function(x, y) {
        const alias = Alias.Sprite_AnimePicture_hitTest.call(this, x, y)
        let alphaPixel = 0

        if(alias) {
            alphaPixel = this.bitmap?.getAlphaPixel(x, y)
        }

        return alias && alphaPixel >= Plugin.getParam().touchOpacity
    }

}

}