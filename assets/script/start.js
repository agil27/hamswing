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
      type: cc.Node
    },

    closeRankBtn: {
      default: null,
      type: cc.Node
    },

    nextBtn: {
      default: null,
      type: cc.Node
    },

    prevBtn: {
      default: null,
      type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {},

  start () {
    // 为关闭排行榜、下一页、上一页按钮点击事件发送信号
    this.setHideRankBtn()
    this.setNextBtn()
    this.setPrevBtn()
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
    this.closeRankBtn.on('touchstart', () => {
      console.log('close rank panel')
      this.rankPanel.active = false
      cc.game.emit('close rank panel')
    }, this)
  },

  setNextBtn () {
    this.nextBtn.on('touchstart', () => {
      console.log('next page')
      cc.game.emit('next page')
    }, this)
  },

  setPrevBtn () {
    this.prevBtn.on('touchstart', () => {
      console.log('prev page')
      cc.game.emit('prev page')
    }, this)
  },

  buttonClicked () {
    cc.game.emit('click button')
  }
})
