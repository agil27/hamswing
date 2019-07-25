// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },

    // plays when ym touch star
    touchToolsAudio: {
      default: null,
      type: cc.AudioSource
    },

    // plays when ym touch mushroom
    invincibleAudio: {
      default: null,
      type: cc.AudioSource
    },

    // plays when gameover
    gameoverAudio: {
      default: null,
      type: cc.AudioSource
    },

    // plays when ym kills enemy
    killMonsterAudio: {
      default: null,
      type: cc.AudioSource
    },

    clickButtonAudio: {
      default: null,
      type: cc.AudioSource
    },

    bgmAudio: {
      default: null,
      type: cc.AudioSource
    },

    audioEnabled: true
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    cc.game.on('touchstar', () => {
      if (this.audioEnabled && this.touchToolsAudio) {
        this.touchToolsAudio.play()
      }
    })
    cc.game.on('invincible start', () => {
      if (this.audioEnabled && this.invincibleAudio) {
        this.invincibleAudio.play()
      }
    })
    cc.game.on('gameover', () => {
      if (this.audioEnabled && this.gameoverAudio) {
        this.gameoverAudio.play()
      }
    })
    cc.game.on('killmonster', () => {
      if (this.audioEnabled && this.killMonsterAudio) {
        this.killMonsterAudio.play()
      }
    })
    cc.game.on('click button', () => {
      if (this.audioEnabled && this.clickButtonAudio) {
        this.clickButtonAudio.play()
      }
    })
    cc.game.on('enable audio', () => {
      if (this.bgmAudio && !this.bgmAudio.isPlaying) {
        this.bgmAudio.play()
      }
      if (!this.audioEnabled) {
        this.audioEnabled = true
      }
    })

    cc.game.on('disable audio', () => {
      if (this.bgmAudio && this.bgmAudio.isPlaying) {
        this.bgmAudio.stop()
      }
      if (this.audioEnabled) {
        this.audioEnabled = false
      }
    })
  },

  onEnable () {
    if (this.bgmAudio && !this.bgmAudio.isPlaying) {
      this.bgmAudio.play()
    }
    if (!this.audioEnabled) {
      this.audioEnabled = true
    }
  },

  onDisable () {
    if (this.bgmAudio && this.bgmAudio.isPlaying) {
      this.bgmAudio.stop()
    }
    if (this.audioEnabled) {
      this.audioEnabled = false
    }
  },

  start () {

  }

  // update (dt) {},
})
