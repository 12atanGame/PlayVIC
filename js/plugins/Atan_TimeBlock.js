/*:
 * @target MZ
 * @plugindesc [v1.0] 教學插件：視窗 + 圖片 + 倒數計時 + 按鈕互動
 * @author 12atan + GPT
 *
 * @help
 * 這是一個從零開始的範例插件，展示以下功能：
 * 1. 在地圖場景顯示自訂視窗
 * 2. 視窗中顯示圖片與倒數計時
 * 3. 在畫面上顯示可點擊的按鈕
 * 4. 按下按鈕後，按鈕會變大並改變顏色，再次點擊恢復
 *
 */

(() => {

    const picPath = "Time/";

    // =========================
    // 1. 自訂視窗類別
    // =========================
    class MyWindow extends Window_Base {
        constructor(rect) {
            super(rect);
            
            this.opacity = 0;

            this._BKimage = null;
            this._timeLine = null;
            this._LINEimage = null;
            this._TimePointImage = null;
            this._cutTime = 0;
            this._mouseInTime = [];
            this._mouseClock = 0;

            this._nowTimeRedLineX = 7;
            this._nowTimeRedLineX_Offset = 0;
            this._RedLineRealX = this._nowTimeRedLineX + this._nowTimeRedLineX_Offset;

            this._isDragging = false;   // 是否正在拖曳
            this._dragStartX = 0;       // 拖曳開始滑鼠位置
            this._originalWidth = 0; // 初始寬度


            this.isMouseHoverOnTime();
            this.HoverWhichClock();

            this.loadBKImage();
            this.loadImage();
            this.loadLINEImage();
            this.loadTimePoint();

            this.refresh();

        }
    
        isMouseHoverOnTime(){
            return TouchInput.x >= 14 &&
                   TouchInput.x <= 623 &&
                   TouchInput.y >= 788 &&
                   TouchInput.y <= 984;
        }

        HoverWhichClock(){
            if (this.isMouseHoverOnTime()){
                for(let i = 0;i <= 24;i++){
                    this._cutTime = 14 + (((623 - 14) / 24) * i);
                    this._mouseInTime.push(this._cutTime);
                }
                for(let j = 1;j <= 24;j++){
                    if(TouchInput.x > this._mouseInTime[j-1] && TouchInput.x < this._mouseInTime[j]){
                            this._mouseClock = j-1;
                    }
                }
            }else{
                this._mouseClock = -1;
            }
            return this._mouseClock;
        }

        // 載入背景圖片
        loadBKImage() {
            this._BKimage = ImageManager.loadPicture(picPath + "BK");
            this._BKimage.addLoadListener(() => this.refresh());
        }

        // 載入圖片
        loadImage() {
            this._timeLine = ImageManager.loadPicture(picPath + "timeLine");
            this._timeLine.addLoadListener(() => this.refresh());
        }
 
        // 載入圖片
        loadLINEImage() {
            this._LINEimage = ImageManager.loadPicture(picPath + "redLine");
            this._LINEimage.addLoadListener(() => this.refresh());
        }

        // 載入按鈕
        loadTimePoint() {
            this._TimePointImage = ImageManager.loadPicture(picPath + "taskpoint"); 
            this._TimePointImage.addLoadListener(() => this.refresh());
        }

        // 繪製內容
        refresh() {
            this.contents.clear();

            // 顯示背景圖片
            if (this._BKimage && this._BKimage.isReady()) {
                this.contents.blt(
                    this._BKimage,
                    0, 0,
                    this._BKimage.width, this._BKimage.height,
                    0, 0 // 位置
                );
            }

            // 顯示圖片
            if (this._timeLine && this._timeLine.isReady()) {
                this.contents.blt(
                    this._timeLine,
                    0, 0,
                    this._timeLine.width, this._timeLine.height,
                    12, 73 // 位置
                );
            }

            // 畫方塊
            if (this._TimePointImage && this._TimePointImage.isReady()) {
                this.contents.fillRect(
                    this._mouseInTime[this._mouseClock],    // x
                    105,    // y
                    this._originalWidth,     // 寬
                    48,     // 高
                    "#ff9090"
                );
            }
        
            // 顯示紅線圖片
            if (this._LINEimage && this._LINEimage.isReady()) {
                this.contents.blt(
                    this._LINEimage,
                    0, 0,
                    this._LINEimage.width, this._LINEimage.height,
                    this._RedLineRealX, 57 // 位置
                );
            }

        }

        // 更新
        update() {
            super.update();

            this.checkButtonClick(); 
            this.checkDrag();        // 新增拖曳檢查

            this._nowTimeRedLineX = 7 + ($gameVariables.value(31) * 25.5);
            this._nowTimeRedLineX_Offset = $gameVariables.value(32) * 26 / 60;
            this._RedLineRealX = this._nowTimeRedLineX + this._nowTimeRedLineX_Offset;
            this.refresh();

        }
        
        checkButtonClick() {
            if (TouchInput.isTriggered()) {
                if(this.isMouseHoverOnTime()){
                    this._originalWidth = 26; 
                    console.log("你點到了 " + this.HoverWhichClock());
                }
            }
        }

        checkDrag() {
            const mouseX = TouchInput.x;
            const mouseY = TouchInput.y;
        
                // Step 1: 按下滑鼠且在時間軸上 → 開始拖曳
                if (TouchInput.isTriggered()) {
                    if(this.isMouseHoverOnTime()){
                        this._isDragging = true;
                        this._dragStartX = mouseX;
                        this._originalWidth = 26;
                    }
                }

                // Step 2: 拖曳中 → 更新紅色方塊大小
                if (this._isDragging && TouchInput.isPressed()) {
                    const dragDistance = mouseX - this._dragStartX;
                    this._originalWidth = 26 + Math.floor(dragDistance / 25) * 25;
                }

                // Step 3: 放開滑鼠 → 結束拖曳
                if (this._isDragging && TouchInput.isReleased()) {
                    this._isDragging = false;
                }
            
        }

    }

    // =========================
    // 3. 整合到 Scene_Map
    // =========================
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        // 建立視窗
        const rect = new Rectangle(-16, 672, 662, 336);
        this._myWindow = new MyWindow(rect);
        this.addWindow(this._myWindow);
    };

})();
