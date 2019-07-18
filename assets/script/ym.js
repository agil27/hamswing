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
    invincible: false
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    cc.director.getPhysicsManager().enabled = true
    cc.director.getCollisionManager().enabled = true

    this.ropeJoint = this.node.getComponent(cc.RopeJoint)
    this.ceiling = this.node.parent.getChildByName('ceiling')
    this.collectAction = this.generateCollectAction()
    /*
    let rotateAction = cc.rotateBy(4, -360);
    let ymAction = cc.repeatForever(rotateAction)
    this.node.runAction(ymAction)
    */
   
    cc.game.on('ymstickout', this.stickOutTongue, this)
    cc.game.on('ymrollup', this.rollUpTongue, this)
    cc.game.on('detach', this.tangentAccelerate, this)
  },

  start () {
    this.stickOutTongue()
  },

  update (dt) {
    this.rebounce()
    if (this.invincible === true) {
      //cc.game.emit('invincible suit');
      this.node.color = new cc.color(65, 174, 60)
    } else {
      this.node.color = new cc.color(255, 255, 255)
    }
  },

  tangentAccelerate (angle) {
    let v = this.node.getComponent(cc.RigidBody).linearVelocity
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(v.x + 100 * Math.sin(-this.toArc(angle)), v.y - 100 * Math.cos(-this.toArc(angle)))
  },

  rebounce () {
    let v = this.node.getComponent(cc.RigidBody).linearVelocity
    if (this.node.y > this.ceiling.y) {
      this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(v.x, - 0.7 * v.y)
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

  generateCollectAction() {
    let jumpAction = cc.moveBy(0.1, cc.v2(0, 50)).easing(cc.easeCubicActionOut())
    let scaleAction = cc.scaleBy(0.1, 2).easing(cc.easeCubicActionOut())
    return cc.spawn(jumpAction, scaleAction, cc.fadeOut(0.08))
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
      }
    } else if (other.node.name === 'star') {
      other.node.runAction(this.collectAction)
      //Acceleration  
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
      }
    } else if (other.node.name === 'mushroom') {
      console.log('mushroom')
      other.node.runAction(this.collectAction)
      this.invincible = true
      setTimeout((() => {
        this.invincible = false
      }).bind(this), 5000) 
    }
  },

  toArc (ang) {
    return Math.PI * ang / 180
  },
})
