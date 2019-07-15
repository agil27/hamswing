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
    mainCamera: {
      default: null,
      type: cc.Node
    },
    hanging: false
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    cc.director.getPhysicsManager().enabled = true
    cc.director.getCollisionManager().enabled = true

    this.mainCamera = this.node.getChildByName('Main Camera')

    this.ropeJoint = this.node.getComponent(cc.RopeJoint)
    this.ceiling = this.node.parent.getChildByName('ceiling')

    this.node.parent.on('touchstart', this.stickOutTongue, this)
    this.node.parent.on('touchend', this.rollUpTongue, this)
  },

  start () {
    this.stickOutTongue()
  },

  update (dt) {
    let globalNodePos = this.node.parent.convertToWorldSpaceAR(this.node.position)
    let nodePos = this.node.convertToNodeSpaceAR(globalNodePos)
    let globalPos = this.node.parent.convertToWorldSpaceAR(cc.Vec2.ZERO)
    let pos = this.node.convertToNodeSpaceAR(globalPos)
    this.mainCamera.x = nodePos.x
    this.mainCamera.y = pos.y
    // console.log(globalPos.y, pos.y, this.node.parent.getChildByName('ceiling').y)
  },

  stickOutTongue () {
    if (!this.hanging) {
      console.log('stick out')
      cc.game.emit('stickout')
      this.hanging = true
    }
  },

  rollUpTongue () {
    if (this.hanging) {
      console.log('roll up')
      cc.game.emit('rollup')
      this.hanging = false
    }
  },

  onCollisionEnter (other, self) {
    if (other.node.name === 'monster') {
      cc.game.emit('gameover')
    } else if (other.node.name === 'star') {
      cc.game.emit('getstar')
    }
  }
})
