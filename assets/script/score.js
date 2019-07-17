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
    cc.game.on('gameover', this.moveToMiddle, this)
  },

  start () {

  },

  update (dt) {
    this.node.x = this.node.parent.getChildByName('Main Camera').x
  },

  updateScore (score) {
    this.label.string = score + ''
  },

  moveToMiddle () {
    console.log('move')
    // this.node.y = -20
    // console.log(this.node.y)
    // let moveAction = cc.moveBy(1000, cc.v2(0, -120)).easing(cc.easeCubicActionIn())
    // this.node.runAction(moveAction)
  }
})
