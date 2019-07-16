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

    cc.game.on('ymstickout', this.stickOutTongue, this)
    cc.game.on('ymrollup', this.rollUpTongue, this)
  },

  start () {
    this.stickOutTongue()
  },

  update (dt) {
    let v = this.node.getComponent(cc.RigidBody).linearVelocity
    if (this.node.y > this.ceiling.y) {
      this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(v.x, -200)
    }
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
      setTimeout(() => {
        
      }, 0.2);
      other.node.destroy()
      cc.game.emit('gameover')
    } else if (other.node.name === 'star') {
      other.node.destroy()
      cc.game.emit('touchstar')
    }
  }
})
