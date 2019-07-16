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
    label: {
      default: null,
      type: cc.Component
    },
    camera: {
      default: null,
      type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    cc.game.on('updatescore', this.updateScore, this)

    this.label = this.node.getComponent(cc.Label)
    this.ym = this.node.parent.getChildByName('ym')
  },

  start () {

  },

  update (dt) {
    this.node.x = this.node.parent.getChildByName('Main Camera').x
    this.node.y = 100
  },

  updateScore (score) {
    this.label.string = score + ''
  }
})
