//=============================================================================
// MPP_MoveRouteEX_8Dir.js
//=============================================================================
// Copyright (c) 2016 - 2022 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================
/*:
 * @target MV MZ
 * @plugindesc 移動ルートに関するコマンド詰め合わせ。
 * @author 木星ペンギン
 * @url
 *
 * @help [version 2.1.1]
 * 
 *  〇 MV / MZ
 *  
 *  〇 移動：腳本指令
 *  〇 Move To: x, y
 *   - 向座標 x, y 移動。
 * 
 *  〇 移動：插件指令
 *  〇 waitRoute
 *   - 等待移動完成
 * 
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠は半角)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 * 
 *  @command waitRoute
 *      @text 等待移動完成
 *      @desc 
 *      @arg character
 *          @text 對象
 *          @desc -1:玩家, 0:本事件, 1...:事件ID
 *          @type number
 *              @min -1
 *              @max 999
 *          @default 0
 */

(() => {
    'use strict';

    const pluginName = 'MPP_MoveRouteEX_8Dir';
    
    //-------------------------------------------------------------------------
    // Game_Character

    const _Game_Character_processMoveCommand = Game_Character.prototype.processMoveCommand;
    Game_Character.prototype.processMoveCommand = function(command) {
        if (command.code === Game_Character.ROUTE_SCRIPT) {
            const commandExt = {
                code: command.code,
                parameters: [this.convertMppScript(command.parameters[0])]
            };
            _Game_Character_processMoveCommand.call(this, commandExt);
        } else {
            _Game_Character_processMoveCommand.apply(this, arguments);
        }
    };

    Game_Character.prototype.convertMppScript = function(script) {
        return script
            .replace(
                /^Move To:(.+?)$/,
                (_, p1) => `this.moveCoordinates(${p1})`
            )
            .replace(
                /^x\s?=\s?(-?\d+\.?\d*|-?V\[\d+\])$/i,
                (_, p1) => `this.moveX(${p1})`
            )
            .replace(
                /^x\s?\+=\s?(-?\d+\.?\d*|-?V\[\d+\])$/i,
                (_, p1) => `this.moveX(${this._x} + ${p1})`
            )
            .replace(
                /^x\s?\-=\s?(-?\d+\.?\d*|-?V\[\d+\])$/i,
                (_, p1) => `this.moveX(${this._x} - ${p1})`
            )
            .replace(
                /^y\s?=\s?(-?\d+\.?\d*|-?V\[\d+\])$/i,
                (_, p1) => `this.moveY(${p1})`
            )
            .replace(
                /^y\s?\+=\s?(-?\d+\.?\d*|-?V\[\d+\])$/i,
                (_, p1) => `this.moveY(${this._y} + ${p1})`
            )
            .replace(
                /^y\s?\-=\s?(-?\d+\.?\d*|-?V\[\d+\])$/i,
                (_, p1) => `this.moveY(${this._y} - ${p1})`
            )
            .replace(/^roundX$/, 'this._x = Math.round(this._x)')
            .replace(/^roundY$/, 'this._y = Math.round(this._y)')
            .replace(/V\[(\d+)\]/ig, (_, p1) => $gameVariables.value(+p1));
    };

    //
    // by Sasuke KANNAZUKI
    // when fail to diagonally move, perform straight move.
    //
    // var _Game_Player_moveDiagonally = Game_Player.prototype.moveDiagonally;
    // Game_Player.prototype.moveDiagonally = function(horz, vert) {
    //     _Game_Player_moveDiagonally.call(this, horz, vert);
    //     if (!this.isMovementSucceeded()) {
    //         // try vertical move
    //         this.setMovementSuccess(this.canPass(this._x, this._y, vert));
    //         if (this.isMovementSucceeded()) {
    //             this.moveStraight(vert);
    //         }
    //         // try horizontal move
    //         this.setMovementSuccess(this.canPass(this._x, this._y, horz));
    //         if (this.isMovementSucceeded()) {
    //             this.moveStraight(horz);
    //         }
    //     }
    // };

    // atan 問 gpt 改↓
    // 🚧 安全修正版：防止鍵盤輸入導致瞬移
    // var _Game_Player_moveDiagonally = Game_Player.prototype.moveDiagonally;
    Game_Player.prototype.moveDiagonally = function(horz, vert) {
        // _Game_Player_moveDiagonally.call(this, horz, vert);
        // 嘗試對角移動（標準處理）
        const oldX = this._x;
        const oldY = this._y;

        const canDiagonal = this.canPassDiagonally(oldX, oldY, horz, vert);
        if (canDiagonal) {
            const x2 = $gameMap.roundXWithDirection(oldX, horz);
            const y2 = $gameMap.roundYWithDirection(oldY, vert);
            this._x = x2;
            this._y = y2;
            this.setDirection(vert);
            this.setMovementSuccess(true);
        } else {
            // 對角不通，改為單軸移動
            let moved = false;

            // 嘗試水平方向
            if (this.canPass(oldX, oldY, horz)) {
                this.moveStraight(horz);
                moved = true;
            }
            // 若水平方向不行，再嘗試垂直方向
            else if (this.canPass(oldX, oldY, vert)) {
                this.moveStraight(vert);
                moved = true;
            }

            if (!moved) this.setMovementSuccess(false);
        }

        // 🚫 防止跨界瞬移
        if (this._x < 0 || this._y < 0 || this._x >= $gameMap.width() || this._y >= $gameMap.height()) {
            console.warn(`[8Dir] 鍵盤移動瞬移(${this._x},${this._y})，已修正`);
            this._x = Math.max(0, Math.min($gameMap.width() - 1, this._x));
            this._y = Math.max(0, Math.min($gameMap.height() - 1, this._y));
        }
    };
    // atan 問 gpt 改↑

    // by Sasuke KANNAZUKI
    // add dir4mode.
    //
    // Game_Player.prototype.moveByInput = function() {
    //     if (!this.isMoving() && this.canMove()) {
    //         var dir4mode = false;
    //         var direction = dir4mode ? Input.dir4 :Input.dir8;
    //         if (direction > 0) {
    //             $gameTemp.clearDestination();
    //         } else if ($gameTemp.isDestinationValid()){
    //             var x = $gameTemp.destinationX();
    //             var y = $gameTemp.destinationY();
    //             if (dir4mode) {
    //                 direction = this.findDirectionTo(x, y);
    //             } else {
    //                 direction = this.findDiagonalDirectionTo(x, y);
    //             }
    //         }
    //         if (direction > 0) {
    //             this.processMoveByInput(direction);
    //         }
    //     }
    // };

    // atan 問 gpt 改↓
    Game_Player.prototype.moveByInput = function() {
        if (!this.isMoving() && this.canMove()) {
            let direction = Input.dir8; // 允許 8方向輸入
            if (direction > 0) {
                // 鍵盤輸入移動：不使用滑鼠路線
                $gameTemp.clearDestination();
                this.processMoveByInput(direction);
                return;
            }

            // 滑鼠點擊移動
            if ($gameTemp.isDestinationValid()) {
                const destX = $gameTemp.destinationX();
                const destY = $gameTemp.destinationY();

                // 🧭 保證目標在地圖範圍內
                if (destX < 0 || destY < 0 ||
                    destX >= $gameMap.width() || destY >= $gameMap.height()) {
                    console.warn(`[8Dir] 滑鼠目標(${destX},${destY})超出地圖範圍，忽略`);
                    $gameTemp.clearDestination();
                    return;
                }

                // 🔍 優先使用 8方向尋路，但若結果不合法，回退到 4方向
                let direction8 = this.findDiagonalDirectionTo(destX, destY);
                if (direction8 <= 0 || direction8 > 9) {
                    direction8 = this.findDirectionTo(destX, destY);
                }

                // 🚶‍♂️ 執行移動
                if (direction8 > 0) {
                    this.processMoveByInput(direction8);
                }
            }
        }
    };
    // atan 問 gpt 改↑

    Game_Character.prototype.moveCoordinates = function(x, y, skippable = false) {
        // atan 改↓
        const directionDir8 = this.findDiagonalDirectionTo(x, y);
        if (directionDir8 > 0) {
            this.processMoveByInput(directionDir8);
            this.setMovementSuccess(false);  
        } else if (
            Math.abs(this._x - x) + Math.abs(this._y - y) < this.searchLimit()
        ) {
            this.setMovementSuccess(true);
        } 
        
        // atan 改↑
        // const direction = this.findDirectionTo(x, y);
        // if (direction > 0) {
        //     this.moveStraight(direction);
        //     this.setMovementSuccess(false);
        // } else if (
        //     Math.abs(this._x - x) + Math.abs(this._y - y) < this.searchLimit()
        // ) {
        //     this.setMovementSuccess(skippable || this.pos(x, y));
        // }   
    };


    //
    // original routine by Yami
    //
    Game_Player.prototype.isMoveDiagonally = function(direction) {
        return [1, 3, 7, 9].contains(direction);
    };

    Game_Player.prototype.isMoveStraight = function(direction) {
        return [2, 4, 6, 8].contains(direction);
    };
    Game_Character.prototype.isMoveDiagonally = function(direction) {
        return [1, 3, 7, 9].contains(direction);
    };

    Game_Character.prototype.isMoveStraight = function(direction) {
        return [2, 4, 6, 8].contains(direction);
    };

    Game_Player.prototype.processMoveByInput = function(direction) {
        if (this.isMoveStraight(direction)) {
            this.moveStraight(direction);
        } else if (this.isMoveDiagonally(direction)) {
            var diagonal = this.getDiagonallyMovement(direction);
            this.moveDiagonally.apply(this, diagonal);
        }
    };
    Game_Character.prototype.processMoveByInput = function(direction) {
        if (this.isMoveStraight(direction)) {
            this.moveStraight(direction);
        } else if (this.isMoveDiagonally(direction)) {
            var diagonal = this.getDiagonallyMovement(direction);
            this.moveDiagonally.apply(this, diagonal);
        }
    };

    Game_Character.prototype.getDiagonallyMovement = function(direction) {
        var horz = 0;
        var vert = 0;
        if (direction === 1) {
            horz = 4;
            vert = 2;
        } else if (direction === 3) {
            horz = 6;
            vert = 2;
        } else if (direction === 7) {
            horz = 4;
            vert = 8;
        } else if (direction === 9) {
            horz = 6;
            vert = 8;
        } 
        return [horz, vert];
    };

    var _Game_Character_moveDiagonally = Game_Character.prototype.moveDiagonally;
    Game_Character.prototype.moveDiagonally = function(horz, vert) {
        _Game_Character_moveDiagonally.call(this, horz, vert);
        if (!this.isMovementSucceeded()) {
            // try vertical move
            this.setMovementSuccess(this.canPass(this._x, this._y, vert));
            if (this.isMovementSucceeded()) {
                this.moveStraight(vert);
            }
            // try horizontal move
            this.setMovementSuccess(this.canPass(this._x, this._y, horz));
            if (this.isMovementSucceeded()) {
                this.moveStraight(horz);
            }
        }
    };

    Game_Map.prototype.diagonalDistance = function(x1, y1, x2, y2) {
        var x = Math.abs(this.deltaX(x1, x2));
        var y = Math.abs(this.deltaY(y1, y2));
        return Math.min(x, y) * 3 / 2 + Math.abs(x - y);
    };


    Game_Character.prototype.findDiagonalDirectionTo = function(goalX, goalY) {   

    // atan 問 gpt 改↓
    // // 修正：禁止跨地圖邊界
    // if (goalX < 0 || goalY < 0 || goalX >= $gameMap.width() || goalY >= $gameMap.height()) {
    //     return 0;
    // }
    // // 修正：強制非環繞計算
    // const dx = goalX - this.x;
    // const dy = goalY - this.y;
    // // 如果距離太遠（可能是誤算 wrap around），直接停止
    // if (Math.abs(dx) > this.searchLimit() || Math.abs(dy) > this.searchLimit()) {
    //     return 0;
    // }
    // atan 問 gpt 改↑

    // ⬇️ 原本算法繼續
        var searchLimit = this.searchLimit()
        var mapWidth = $gameMap.width();
        var nodeList = [];
        var openList = [];
        var closedList = [];
        var start = {};
        var best = start
        var goaled = false;

        if (this.x === goalX && this.y === goalY) {
            return 0;
        }

        start.parent = null;
        start.x = this.x;
        start.y = this.y;
        start.g = 0;
        start.f = $gameMap.diagonalDistance(start.x, start.y, goalX, goalY);
        nodeList.push(start);
        openList.push(start.y * mapWidth + start.x);

        while (nodeList.length > 0) {
            var bestIndex = 0;
            for (var i = 0; i < nodeList.length; i++) {
                if (nodeList[i].f < nodeList[bestIndex].f) {
                    bestIndex = i;
                }
            }

            var current = nodeList[bestIndex];
            var x1 = current.x;
            var y1 = current.y;
            var pos1 = y1 * mapWidth + x1;
            var g1 = current.g;

            nodeList.splice(bestIndex, 1);
            openList.splice(openList.indexOf(pos1), 1);
            closedList.push(pos1);

            if (current.x === goalX && current.y === goalY) {
                best = current;
                goaled = true;
                break;
            }

           if (g1 >= searchLimit) {
                continue;
            }

            for (var j = 1; j <= 9; j++) {
                if(j === 5) {
                    continue;
                }
                var directions;
                if (this.isMoveDiagonally(j)) {
                    directions = this.getDiagonallyMovement(j);
                } else { 
                    directions = [j, j];
                }
                var horz = directions[0];
                var vert = directions[1];
                var x2 = $gameMap.roundXWithDirection(x1, horz);
                var y2 = $gameMap.roundYWithDirection(y1, vert);
                var pos2 = y2 * mapWidth + x2;

                if (closedList.contains(pos2)) {
                    continue;
                }

                if (this.isMoveStraight(j)) {
                    if (!this.canPass(x1, y1, j)) {
                        continue;
                    }
                } else if (this.isMoveDiagonally(j)) {
                    if (!this.canPassDiagonally(x1, y1, horz, vert)) {
                        continue;
                    }
                }

                var g2 = g1 + 1;
                var index2 = openList.indexOf(pos2);

                if (index2 < 0 || g2 < nodeList[index2].g) {
                    var neighbor;
                    if (index2 >= 0) {
                        neighbor = nodeList[index2];
                    } else {
                        neighbor = {};
                        nodeList.push(neighbor);
                        openList.push(pos2);
                    }
                    neighbor.parent = current;
                    neighbor.x = x2;
                    neighbor.y = y2;
                    neighbor.g = g2;
                    neighbor.f = g2 + $gameMap.diagonalDistance(x2, y2, goalX, goalY);
                    if (!best || neighbor.f - neighbor.g < best.f - best.g) {
                        best = neighbor;
                    }
                }
            }
        }
        var node = best;
        while (node.parent && node.parent !== start) {
            node = node.parent;
        }

        var deltaX1 = $gameMap.deltaX(node.x, start.x);
        var deltaY1 = $gameMap.deltaY(node.y, start.y);
        if (deltaY1 > 0) {
            return deltaX1 === 0 ? 2 : deltaX1 > 0 ? 3 : 1;
        } else if (deltaY1 < 0) {
            return deltaX1 === 0 ? 8 : deltaX1 > 0 ? 9 : 7;
        } else { // deltaY1 === 0
            if (deltaX1 !== 0) {
                return deltaX1 > 0 ? 6 : 4;
            }
        }

        var deltaX2 = this.deltaXFrom(goalX);
        var deltaY2 = this.deltaYFrom(goalY);
        if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
            if(deltaX2 > 0) {
                return deltaY2 === 0 ? 4 : deltaY2 > 0 ? 7 : 1;
            } else if (deltaX2 < 0) {
                return deltaY2 === 0 ? 6 : deltaY2 > 0 ? 9 : 3;
            } else { // deltaX2 === 0
                return deltaY2 === 0 ? 0 : deltaY2 > 0 ? 8 : 2;
            }
        } else {
            if (deltaY2 > 0) {
                return deltaX2 === 0 ? 8 : deltaX2 > 0 ? 7 : 9;
            } else if (deltaY2 < 0) {
                return deltaX2 === 0 ? 2 : deltaX2 > 0 ? 1 : 3;
            } else { // deltaY2 === 0
                return deltaX2 === 0 ? 0 : deltaX2 > 0 ? 4 : 6;
            }
        }
    };

    Game_Character.prototype.moveX = function(x) {
        if (this._x > x) this.setDirection(4);
        if (this._x < x) this.setDirection(6);
        this._x = x;
        this.resetStopCount();
    };

    Game_Character.prototype.moveY = function(y) {
        if (this._y < y) this.setDirection(2);
        if (this._y > y) this.setDirection(8);
        this._y = y;
        this.resetStopCount();
    };

    //-------------------------------------------------------------------------
    // Game_Interpreter

    const _mzCommands = {
        WaitRoute: { name:'waitRoute', keys:['character'] }
    };
    Object.assign(_mzCommands, {
        '移動が完了するまでウェイト': _mzCommands.WaitRoute
    });

    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        const mzCommand = _mzCommands[command];
        if (mzCommand) {
            const args2 = Object.assign(
                {},
                ...mzCommand.keys.map((k,i) => ({ [k]: args[i] }))
            );
            PluginManager.callCommandMV(this, pluginName, mzCommand.name, args2);
        }
    };

    //-------------------------------------------------------------------------
    // PluginManager
    
    if (!PluginManager.registerCommand) {
        PluginManager._commandsMV = PluginManager._commandsMV || {};

        PluginManager.registerCommandMV = function(pluginName, commandName, func) {
            const key = pluginName + ':' + commandName;
            this._commandsMV[key] = func;
        };
        
        PluginManager.callCommandMV = function(self, pluginName, commandName, args) {
            const key = pluginName + ':' + commandName;
            const func = this._commandsMV[key];
            if (typeof func === 'function') {
                func.bind(self)(args);
            }
        };
    }

    {
        const _registerCommand = PluginManager.registerCommand || PluginManager.registerCommandMV;

        _registerCommand.call(PluginManager, pluginName, 'waitRoute', function(args) {
            this._waitMode = 'route';
            this._characterId = PluginManager.mppValue(args.character);
        });
    }

    PluginManager.mppValue = function(value) {
        const match = /^V\[(\d+)\]$/i.exec(value);
        return match ? $gameVariables.value(+match[1]) : +value;
    };
    
})();
