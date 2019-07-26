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
    audioOn: true,
    sprite: null
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.sprite = this.node.getComponent(cc.Sprite)
    this.node.on('touchstart', this.onClick, this)
  },

  onClick () {
    let frameAddr = ''
    if (this.audioOn) {
      this.audioOn = false
      frameAddr = 'audioOff'
      cc.game.emit('disable audio')
    } else {
      this.audioOn = true
      frameAddr = 'audioOn'
      cc.game.emit('enable audio')
    }
    let self = this
    cc.loader.loadRes(frameAddr, cc.SpriteFrame, function (err, spriteFrame) {
      if (err) {
        cc.error(err.message || err)
        return
      }
      if (spriteFrame instanceof cc.SpriteFrame) {
        self.sprite.spriteFrame = spriteFrame
      }
    })
  }
  // update (dt) {},
})
