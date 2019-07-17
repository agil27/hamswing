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

    /*
    let scaleUp = cc.scaleBy(200, 2)
    let scaleDown = cc.scaleBy(200, 0.5)
    let ymAction = cc.repeatForever(cc.sequence(scaleUp, scaleDown))
    this.node.runAction(ymAction)
    */
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
      other.node.getComponent(cc.Animation).play('monster die')
      let scaleAction = cc.scaleBy(0.2, 2).easing(cc.easeCubicActionOut())
      let fadeout = cc.fadeOut(1.5)
      other.node.runAction(cc.sequence(scaleAction, fadeout))
      setTimeout(() => {
        cc.game.emit('gameover')
      }, 0)
    } else if (other.node.name === 'star') {
      let jumpAction = cc.moveBy(0.1, cc.v2(0, 50)).easing(cc.easeCubicActionOut())
      let scaleAction = cc.scaleBy(0.1, 2).easing(cc.easeCubicActionOut())
      let fadeout = cc.fadeOut(0.1)
      other.node.runAction(cc.spawn(jumpAction, scaleAction, fadeout))
      setTimeout(() => {
        if (other) {
          other.node.active = false
        }
        cc.game.emit('touchstar')
      }, 100)
    }
  }
})
