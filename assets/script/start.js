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

    rankPanel: {
      default: null,
      type: cc.Node,
    },

    closeRankBtn: {
      default: null,
      type: cc.Node,
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    /*
    (async () => {
      cc.loader.downloader.loadSubpackage('texture', (err) => {
        if (err) {
          return console.error(err)
        }
        console.log('load subpackage successfully.')
      })
    })()
    */
  },

  start () {
    this.setHideRankBtn()
    if (CC_WECHATGAME) {
      wx.getOpenDataContext().postMessage({
        message: "User info get success."
      });
    }
  },

  startTutorial () {
    cc.director.loadScene('tutorial')
  },

  startGame () {
    cc.director.loadScene('game')
  },

  showRank () {
    this.rankPanel.active = true
  },

  hideRank () {
    this.rankPanel.active = false
  },

  setHideRankBtn () {
    this.closeRankBtn.on('touchstart', (() => {
      console.log('close rank panel')
      this.rankPanel.active = false
    }).bind(this), this)
  },

  // update (dt) {},
})
