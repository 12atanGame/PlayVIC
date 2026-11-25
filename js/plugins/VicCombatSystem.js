//=============================================================================
// VicCombatSystem.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 休的次數護衛與維克方向鍵 QTE 詠唱。
 * @author 你的名字
 *
 * @help
 *
 * 維克的詠唱技能備註：
 *   <VicCast: 8, 2, 4, 6>
 *
 * 方向：8 上、2 下、4 左、6 右。
 *
 * 請放在使用中的 VisuStella 戰鬥插件下方。
 */

(function () {
  "use strict";

  const VIC_ACTOR_ID = 1;

  //-------------------------------------------------------------------------
  // 2. QTE 管理器
  //-------------------------------------------------------------------------

  window.VicQTEManager = {
    isCasting: false,
    qteWindow: null,

    startCast(skill, successCallback, failCallback) {
      if (this.isCasting) return;

      this.isCasting = true;
      this._successCallback = successCallback;
      this._failCallback = failCallback;

      const scene = SceneManager._scene;

      if (scene instanceof Scene_Battle) {
        this.qteWindow = new Window_VicQTE(
          new Rectangle(
            Graphics.boxWidth / 2 - 240,
            Graphics.boxHeight / 2 - 90,
            480,
            180,
          ),
          skill,
        );

        scene.addWindow(this.qteWindow);
        this.qteWindow.open();
      }
    },

    closeWindow() {
      if (this.qteWindow) {
        if (this.qteWindow.parent) {
          this.qteWindow.parent.removeChild(this.qteWindow);
        }

        this.qteWindow.destroy();
        this.qteWindow = null;
      }
    },

    onSuccess() {
      if (!this.isCasting) return;

      this.isCasting = false;
      this._inputReleaseFrame = Graphics.frameCount;
      this.closeWindow();
      SoundManager.playOk();

      if (this._successCallback) {
        this._successCallback();
      }
    },

    interruptCast() {
      if (!this.isCasting) return;

      this.isCasting = false;
      this._inputReleaseFrame = Graphics.frameCount;
      this.closeWindow();
      SoundManager.playBuzzer();

      if (this._failCallback) {
        this._failCallback();
      }
    },
  };

  //-------------------------------------------------------------------------
  // 3. QTE 視窗
  //-------------------------------------------------------------------------

  function Window_VicQTE() {
    this.initialize(...arguments);
  }

  Window_VicQTE.prototype = Object.create(Window_Base.prototype);
  Window_VicQTE.prototype.constructor = Window_VicQTE;

  Window_VicQTE.prototype.initialize = function (rect, skill) {
    Window_Base.prototype.initialize.call(this, rect);

    this._skill = skill;
    this.parseSequenceFromMeta();
    this._timer = Math.max(180, this._sequence.length * 45);
    this._currentIndex = 0;
    this.refresh();
  };

  Window_VicQTE.prototype.parseSequenceFromMeta = function () {
    this._sequence = [];

    const metaStr = this._skill.meta.VicCast;

    if (
      metaStr &&
      typeof metaStr === "string" &&
      metaStr.toLowerCase() !== "true"
    ) {
      const parts = metaStr.split(/[\s,]+/);

      for (const p of parts) {
        const dir = parseInt(p.trim());

        if ([2, 4, 6, 8].includes(dir)) {
          this._sequence.push(dir);
        }
      }
    }

    if (this._sequence.length === 0) {
      const directions = [2, 4, 6, 8];

      for (let i = 0; i < 4; i++) {
        this._sequence.push(
          directions[Math.floor(Math.random() * directions.length)],
        );
      }
    }
  };

  Window_VicQTE.prototype.update = function () {
    Window_Base.prototype.update.call(this);

    if (!VicQTEManager.isCasting) return;

    this._timer--;

    let inputDir = 0;

    if (Input.isTriggered("up") || Input.isRepeated("up")) {
      inputDir = 8;
    } else if (Input.isTriggered("down") || Input.isRepeated("down")) {
      inputDir = 2;
    } else if (Input.isTriggered("left") || Input.isRepeated("left")) {
      inputDir = 4;
    } else if (Input.isTriggered("right") || Input.isRepeated("right")) {
      inputDir = 6;
    }

    if (inputDir > 0) {
      if (inputDir === this._sequence[this._currentIndex]) {
        SoundManager.playCursor();
        this._currentIndex++;

        if (this._currentIndex >= this._sequence.length) {
          VicQTEManager.onSuccess();
          return;
        }
      } else {
        VicQTEManager.interruptCast();
        return;
      }
    } else if (this._timer <= 0) {
      VicQTEManager.interruptCast();
      return;
    }

    this.refresh();
  };

  Window_VicQTE.prototype.refresh = function () {
    this.contents.clear();

    this.drawText(
      `【維克・${this._skill.name} 詠唱中】`,
      0,
      0,
      this.contents.width,
      "center",
    );

    const dirSymbols = {
      2: "↓",
      4: "←",
      6: "→",
      8: "↑",
    };

    let seqText = "";

    for (let i = 0; i < this._sequence.length; i++) {
      const sym = dirSymbols[this._sequence[i]];

      if (i < this._currentIndex) {
        seqText += `[${sym}] `;
      } else if (i === this._currentIndex) {
        seqText += `<${sym}> `;
      } else {
        seqText += `${sym} `;
      }
    }

    this.drawText(seqText, 0, 45, this.contents.width, "center");

    const seconds = Math.ceil(this._timer / 60);

    this.drawText(
      `剩餘時間: ${seconds}s`,
      0,
      95,
      this.contents.width,
      "center",
    );
  };
  //-------------------------------------------------------------------------
  // 4. QTE 期間鎖住選單操作
  //-------------------------------------------------------------------------

  function isQteInputLocked() {
    return (
      VicQTEManager.isCasting ||
      VicQTEManager._inputReleaseFrame === Graphics.frameCount
    );
  }

  for (const method of [
    "processCursorMove",
    "processHandling",
    "processTouch",
  ]) {
    const original = Window_Selectable.prototype[method];

    Window_Selectable.prototype[method] = function () {
      if (SceneManager._scene instanceof Scene_Battle && isQteInputLocked()) {
        return;
      }

      return original.apply(this, arguments);
    };
  }

//-------------------------------------------------------------------------
// 5. 執行行動前進行 QTE
//-------------------------------------------------------------------------

const qtePassedActions = new WeakSet();

const _BattleManager_processTurn = BattleManager.processTurn;

BattleManager.processTurn = function () {
  const subject = this._subject;
  const action = subject ? subject.currentAction() : null;
  const skill = action ? action.item() : null;

  const needsQte =
    subject &&
    subject.isActor() &&
    subject.actorId() === VIC_ACTOR_ID &&
    action &&
    action.isSkill() &&
    skill &&
    skill.meta.VicCast &&
    !qtePassedActions.has(action);

  if (!needsQte) {
    return _BattleManager_processTurn.apply(this, arguments);
  }

  const scene = SceneManager._scene;

  if (!(scene instanceof Scene_Battle)) {
    return _BattleManager_processTurn.apply(this, arguments);
  }

  // 【修正】安全地關閉當前活躍的輸入視窗，不使用強制迴圈重選
  if (scene._actorCommandWindow) {
    scene._actorCommandWindow.deactivate();
    scene._actorCommandWindow.close();
  }
  if (scene._enemyWindow) {
    scene._enemyWindow.deactivate();
    scene._enemyWindow.hide();
  }

  const context = {
    subject: subject,
    action: action,
    previousPhase: this._phase,
    result: null,
  };

  this._vicQteContext = context;
  this._phase = "vicQte";

  VicQTEManager.startCast(
    skill,
    () => {
      if (this._vicQteContext === context) {
        context.result = "success";
      }
    },
    () => {
      if (this._vicQteContext === context) {
        context.result = "failure";
      }
    }
  );
};

//-------------------------------------------------------------------------
// 6. QTE 結果接回戰鬥流程
//-------------------------------------------------------------------------

const _BattleManager_update = BattleManager.update;

BattleManager.update = function () {
  const context = this._vicQteContext;

  if (!context) {
    return _BattleManager_update.apply(this, arguments);
  }

  if (!context.result) {
    return;
  }

  if (VicQTEManager._inputReleaseFrame === Graphics.frameCount) {
    return;
  }

  this._vicQteContext = null;
  this._phase = context.previousPhase;

  const scene = SceneManager._scene;
  if (scene && scene._actorCommandWindow) {
    scene._actorCommandWindow.open();
    scene._actorCommandWindow.activate();
  }

  const sameAction =
    this._subject === context.subject &&
    context.subject.currentAction() === context.action;

  if (!sameAction) {
    return;
  }

  if (context.result === "success") {
    qtePassedActions.add(context.action);
    _BattleManager_processTurn.call(this);
  } else {
    context.subject.removeCurrentAction();

    if (this._logWindow) {
      this._logWindow.addText(context.subject.name() + "的詠唱失敗了！");
    }
  }
};
})();
