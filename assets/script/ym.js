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
    hanging: false,
    collectAction: null,
    invincible: false,

    // Action factors
    scaleDownFactor: 0.8,
    scaleUpFactor: 1.2,
    scaleDuration: 1,
    rotateDuration: 1,

    // Actions
    invincibleAction: {
      default: null,
      type: cc.Action
    },

    // Timers
    invincibleTimer: null,

    // Nodes
    invincibleText: {
      default: cc.null,
      type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    cc.director.getPhysicsManager().enabled = true
    cc.director.getCollisionManager().enabled = true

    this.ropeJoint = this.node.getComponent(cc.RopeJoint)
    this.ceiling = this.node.parent.getChildByName('ceiling')

    // generate Actions
    this.collectAction = this.generateCollectAction()
    this.invincibleAction = this.generateInvincibleAction()

    // signal binding
    cc.game.on('ymstickout', this.stickOutTongue, this)
    cc.game.on('ymrollup', this.rollUpTongue, this)
    cc.game.on('detach', this.tangentAccelerate, this)
    cc.game.on('invincible start', this.invincibleStart, this)
    cc.game.on('invincible end', this.invincibleEnd, this)

    this.invincible = false
  },

  start () {
    this.stickOutTongue()
  },

  update (dt) {
    this.rebounce()
  },

  onDisable () {
    this.invincible = false
    if (!this.invincibleTimer) {
      clearTimeout(this.invincibleTimer)
    }
  },

  tangentAccelerate (angle) {
    let v = this.node.getComponent(cc.RigidBody).linearVelocity
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(v.x + 100 * Math.sin(-this.toArc(angle)), v.y - 100 * Math.cos(-this.toArc(angle)))
  },

  rebounce () {
    let v = this.node.getComponent(cc.RigidBody).linearVelocity
    if (this.node.y > this.ceiling.y) {
      this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(v.x, -0.7 * v.y)
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

  generateCollectAction () {
    let jumpAction = cc.moveBy(0.1, cc.v2(0, 50)).easing(cc.easeCubicActionOut())
    let scaleAction = cc.scaleBy(0.1, 2).easing(cc.easeCubicActionOut())
    return cc.spawn(jumpAction, scaleAction, cc.fadeOut(0.08))
  },

  generateInvincibleAction () {
    /*
    let scaleDown = cc.scaleBy(this.scaleDuration, this.scaleDownFactor)
    let scaleUp = cc.scaleBy(this.scaleDuration, this.scaleUpFactor)
    let scaleAction = cc.sequence(scaleDown, scaleUp)
    */
    let rotateAction = cc.rotateBy(this.rotateDuration, 360)
    return cc.repeatForever(rotateAction)
  },

  onCollisionEnter (other, self) {
    if (other.node.name === 'monster') {
      other.node.stopAllActions()
      other.node.getComponent(cc.Animation).play('monster die')
      let scaleAction = cc.scaleBy(0.2, 2).easing(cc.easeCubicActionOut())
      let fadeout = cc.fadeOut(1.5)
      other.node.runAction(cc.sequence(scaleAction, fadeout))
      if (this.invincible === false) {
        cc.game.emit('gameover')
      } else {
        cc.game.emit('killmonster')
      }
    } else if (other.node.name === 'star') {
      other.node.runAction(this.collectAction)
      // Acceleration
      let rigidbody = this.node.getComponent(cc.RigidBody)
      let v = rigidbody.linearVelocity
      rigidbody.linearVelocity = cc.v2(v.x * 1.1, v.y * 1.1)
      cc.game.emit('touchstar')
    } else if (other.node.name === 'ghost') {
      other.node.stopAllActions()
      other.node.getComponent(cc.Animation).play('ghostDie')
      let scaleAction = cc.scaleBy(0.2, 2).easing(cc.easeCubicActionOut())
      let fadeout = cc.fadeOut(1.5)
      other.node.runAction(cc.sequence(scaleAction, fadeout))
      if (this.invincible === false) {
        cc.game.emit('gameover')
      } else {
        cc.game.emit('killmonster')
      }
    } else if (other.node.name === 'mushroom') {
      console.log('mushroom')
      other.node.runAction(this.collectAction)
      if (this.invincible === false) {
        this.invincible = true
        cc.game.emit('invincible start')
      } else {
        clearTimeout(this.invincibleTimer)
        cc.game.emit('touchmushroom')
      }
      this.invincibleTimer = setTimeout(() => {
        if (this.invincible) {
          this.invincible = false
          cc.game.emit('invincible end')
        }
      }, 5000)
    }
  },

  toArc (ang) {
    return Math.PI * ang / 180
  },

  invincibleStart () {
    this.invincibleText.active = true
    this.node.parent.getChildByName('tongue').color = new cc.color(65, 174, 60)
    this.node.parent.getChildByName('tongue').getChildByName('claw').color = new cc.color(65, 174, 60)
    this.node.color = new cc.color(65, 174, 60)
    this.node.runAction(this.invincibleAction)
  },

  invincibleEnd () {
    this.invincibleText.active = false
    this.node.parent.getChildByName('tongue').color = new cc.color(255, 255, 255)
    this.node.parent.getChildByName('tongue').getChildByName('claw').color = new cc.color(255, 255, 255)
    this.node.color = new cc.color(255, 255, 255)
    this.node.stopAction(this.invincibleAction)
    this.node.rotation = 0
    this.node.scale = cc.v2(0.05, 0.05)
  }
})
