//=============================================================================
// VicCombatSystem.js - 《VIC》戰鬥系統核心：休之護衛與維克自訂序列 QTE 詠唱 (VisuStella 相容版)
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 實現休的次數制護衛與維克透過技能備註指定方向鍵序列的 QTE 機制（相容 VisuStella）。
 * @author 你的名字
 *
 * @help
 * 說明：
 * 1. 休的護衛技能備註：
 *    - 短護衛: <HughGuard:3>
 *    - 長護衛: <HughGuard:6>
 *
 * 2. 維克的詠唱技能備註（可透過逗號或空格指定方向鍵 8上 2下 4左 6右）：
 *    - 範例: <VicCast: 8, 2, 4, 6>
 */

(function () {
  const VIC_ACTOR_ID = 1; // 假設維克是 Actor 1
  const HUGH_ACTOR_ID = 2; // 假設休是 Actor 2
  const GUARD_STATE_ID = 32; // 休的護衛狀態 ID

  // -------------------------------------------------------------------------
  // 1. 休的護衛技能與代坦邏輯
  // -------------------------------------------------------------------------
  const _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function (target) {
    _Game_Action_apply.call(this, target);
    if (
      this.subject().isActor() &&
      this.subject().actorId() === HUGH_ACTOR_ID
    ) {
      const meta = this.item().meta;
      if (meta.HughGuard) {
        applyHughGuardToVic(parseInt(meta.HughGuard));
      }
    }
  };

  function applyHughGuardToVic(count) {
    const vic = $gameActors.actor(VIC_ACTOR_ID);
    if (vic && vic.isAlive()) {
      vic.addState(GUARD_STATE_ID);
      vic._hughGuardCount = count;
      SoundManager.playUseItem();
    }
  }

  const _Game_Action_itemApply = Game_Action.prototype.itemApply;
  Game_Action.prototype.itemApply = function (target, receiver) {
    if (receiver.isActor() && receiver.actorId() === VIC_ACTOR_ID) {
      const vic = receiver;
      if (vic.isStateAffected(GUARD_STATE_ID) && vic._hughGuardCount > 0) {
        const hugh = $gameActors.actor(HUGH_ACTOR_ID);
        if (hugh && hugh.isAlive()) {
          vic._hughGuardCount--;
          SoundManager.playDefend();
          receiver = hugh;
          if (vic._hughGuardCount <= 0) {
            vic.removeState(GUARD_STATE_ID);
          }
        }
      }
    }

    _Game_Action_itemApply.call(this, target, receiver);

    if (receiver.isActor() && receiver.actorId() === VIC_ACTOR_ID) {
      if (VicQTEManager.isCasting && this.isHpDamage()) {
        VicQTEManager.interruptCast();
      }
    }
  };

  // -------------------------------------------------------------------------
  // 2. 維克 QTE 詠唱管理器
  // -------------------------------------------------------------------------
  window.VicQTEManager = {
    isCasting: false,
    qteWindow: null,

    startCast(skill, successCallback, failCallback) {
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
      this.isCasting = false;
      this.closeWindow();
      SoundManager.playOk();
      if (this._successCallback) this._successCallback();
    },

    interruptCast() {
      this.isCasting = false;
      this.closeWindow();
      SoundManager.playBuzzer();
      if (this._failCallback) this._failCallback();
    },
  };

  // -------------------------------------------------------------------------
  // 3. QTE 視窗類別
  // -------------------------------------------------------------------------
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
    if (Input.isTriggered("up") || Input.isRepeated("up")) inputDir = 8;
    else if (Input.isTriggered("down") || Input.isRepeated("down"))
      inputDir = 2;
    else if (Input.isTriggered("left") || Input.isRepeated("left"))
      inputDir = 4;
    else if (Input.isTriggered("right") || Input.isRepeated("right"))
      inputDir = 6;

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

    const dirSymbols = { 2: "↓", 4: "←", 6: "→", 8: "↑" };
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

  // -------------------------------------------------------------------------
  // 4. 改為正確綁定技能的攔截邏輯（包含游標鎖定）
  // -------------------------------------------------------------------------
  const _Scene_Battle_onSkillOk = Scene_Battle.prototype.onSkillOk;
  Scene_Battle.prototype.onSkillOk = function () {
    const skill = this._skillWindow.item();
    const actor = BattleManager.actor();

    if (
      actor &&
      actor.actorId() === VIC_ACTOR_ID &&
      skill &&
      skill.meta.VicCast
    ) {
      // 隱藏並暫停技能視窗的游標活動
      this._skillWindow.deactivate();
      this._skillWindow.hide();

      VicQTEManager.startCast(
        skill,
        () => {
          // QTE 成功：恢復視窗並確實把玩家選的 skill 賦予給當前動作
          this._skillWindow.show();
          this._skillWindow.activate();

          const action = actor.inputtingAction();
          if (action) {
            action.setSkill(skill.id);
          }

          _Scene_Battle_onSkillOk.call(this);
        },
        () => {
          // QTE 失敗/被打斷：取消施法，恢復視窗讓玩家重新選擇
          this._skillWindow.show();
          this._skillWindow.activate();
        },
      );
      return;
    }

    _Scene_Battle_onSkillOk.call(this);
  };
})();
