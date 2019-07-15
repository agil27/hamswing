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
    hanging: false
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    cc.director.getPhysicsManager().enabled = true
    cc.director.getCollisionManager().enabled = true

    this.ropeJoint = this.node.getComponent(cc.RopeJoint)
    this.ceiling = this.node.parent.getChildByName('ceiling')

    // this.node.parent.on('touchstart', this.stickOutTongue, this)
    cc.game.on('ymstickout', this.stickOutTongue, this)
    cc.game.on('ymrollup', this.rollUpTongue, this)
  },

  start () {
    this.stickOutTongue()
  },

  update (dt) {
    let bg1 = this.node.parent.getChildByName('bg1')
    let bg2 = this.node.parent.getChildByName('bg2')
    // console.log(bg1.x, bg2.x, this.node.x)
    if (bg1.x + 1600 < this.node.x) {
      bg1.x += 3200
    }
    if (bg2.x + 1600 < this.node.x) {
      bg2.x += 3200
    }
    let v = this.node.getComponent(cc.RigidBody).linearVelocity
    if (this.node.y > this.ceiling.y) {
      this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(v.x, -200)
    }

    this.node.parent.getChildByName('score').x = this.node.x
  },

  stickOutTongue () {
    if (!this.hanging) {
      cc.game.emit('stickout')
      this.hanging = true
    }
  },

  rollUpTongue () {
    if (this.hanging) {
      cc.game.emit('rollup')
      this.hanging = false
    }
  },

  onCollisionEnter (other, self) {
    if (other.node.name === 'monster') {
      other.node.destroy()
      cc.game.emit('gameover')
    } else if (other.node.name === 'star') {
      other.node.destroy()
      cc.game.emit('touchstar')
    }
  }
})
