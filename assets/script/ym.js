// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/*
  本类用来描述仓鼠的行为，取名为ym意为Youngster of Miracle
  为本游戏最初构想的主角形象，后来受守望先锋中的英雄“破坏球”启发
  改为仓鼠形象，但是控件的名字不方便更改
*/

cc.Class({
  extends: cc.Component,

  properties: {
    // 一些有关仓鼠状态的变量
    hanging: false,
    collectAction: null,
    invincible: false,

    // 有关Action的一些参数
    scaleDownFactor: 0.8,
    scaleUpFactor: 1.2,
    scaleDuration: 1,
    rotateDuration: 1,

    // 定义的动作
    invincibleAction: {
      default: null,
      type: cc.Action
    },

    // 计时器
    invincibleTimer: null,

    // 节点
    invincibleText: {
      default: cc.null,
      type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.setPhysicsComponents()
    this.generateActions()
    this.bindSignals()
    this.invincible = false
  },

  setPhysicsComponents () {
    cc.director.getPhysicsManager().enabled = true
    cc.director.getCollisionManager().enabled = true

    this.ropeJoint = this.node.getComponent(cc.RopeJoint)
    this.ceiling = this.node.parent.getChildByName('ceiling')
  },

  generateActions () {
    this.collectAction = this.generateCollectAction()
    this.invincibleAction = this.generateInvincibleAction()
  },

  bindSignals () {
    cc.game.on('ymstickout', this.stickOutTongue, this)
    cc.game.on('ymrollup', this.rollUpTongue, this)
    cc.game.on('detach', this.tangentAccelerate, this)
    cc.game.on('invincible start', this.invincibleStart, this)
    cc.game.on('invincible end', this.invincibleEnd, this)
  },

  start () {
    this.stickOutTongue()
  },

  update (dt) {
    this.rebounce()
  },

  onDisable () {
    // 仓鼠死亡时，停止其有关无敌状态的计时器，否则会造成程序崩溃
    this.invincible = false
    if (!this.invincibleTimer) {
      clearTimeout(this.invincibleTimer)
    }
  },

  tangentAccelerate (angle) {
    // 仓鼠在松开钩绳的瞬间会有切线加速，用来保证游戏的可玩性
    let v = this.node.getComponent(cc.RigidBody).linearVelocity
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(v.x + 100 * Math.sin(-this.toArc(angle)), v.y - 100 * Math.cos(-this.toArc(angle)))
  },

  rebounce () {
    // 仓鼠在碰到天花板时，会向下反弹，但损失一部分动能，增加游戏趣味性
    let v = this.node.getComponent(cc.RigidBody).linearVelocity
    if (this.node.y > this.ceiling.y) {
      this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(v.x, -0.7 * v.y)
    }
  },

  // 仓鼠伸出抓钩
  stickOutTongue () {
    if (!this.hanging) {
      cc.game.emit('stickout')
      this.hanging = true
    }
  },

  // 仓鼠收起抓钩
  rollUpTongue () {
    if (this.hanging) {
      cc.game.emit('rollup')
      this.hanging = false
    }
  },

  // 产生收集和无敌的动作
  generateCollectAction () {
    let jumpAction = cc.moveBy(0.1, cc.v2(0, 50)).easing(cc.easeCubicActionOut())
    let scaleAction = cc.scaleBy(0.1, 2).easing(cc.easeCubicActionOut())
    return cc.spawn(jumpAction, scaleAction, cc.fadeOut(0.08))
  },

  generateInvincibleAction () {
    let rotateAction = cc.rotateBy(this.rotateDuration, 360)
    return cc.repeatForever(rotateAction)
  },

  // 处理碰撞事件
  onCollisionEnter (other, self) {
    if (other.node.name === 'monster' || other.node.name === 'ghost') {
      this.collideWithenemy(other)
    } else if (other.node.name === 'star') {
      this.collideWithStar(other)
    } else if (other.node.name === 'mushroom') {
      this.collideWithMushroom(other)
    }
  },

  // 分类处理碰撞事件
  collideWithStar (star) {
    star.node.runAction(this.collectAction)
    // Acceleration
    let rigidbody = this.node.getComponent(cc.RigidBody)
    let v = rigidbody.linearVelocity
    rigidbody.linearVelocity = cc.v2(v.x * 1.1, v.y * 1.1)
    cc.game.emit('touchstar')
  },

  collideWithenemy (enemy) {
    enemy.node.stopAllActions()
    if (this.isTreadOnHead(enemy)) {
      let rigidbody = this.node.getComponent(cc.RigidBody)
      let v = rigidbody.linearVelocity
      rigidbody.linearVelocity = cc.v2(v.x, -v.y * 0.6)
      cc.game.emit('killmonster')
      cc.game.emit('tread', enemy.node)
    } else {
      // 播放特效动画以及动作
      if (enemy.node.name === 'monster') {
        enemy.node.getComponent(cc.Animation).play('monster die')
      } else {
        enemy.node.getComponent(cc.Animation).play('ghostDie')
      }
      let scaleAction = cc.scaleBy(0.2, 2).easing(cc.easeCubicActionOut())
      let fadeout = cc.fadeOut(1.5)
      enemy.node.runAction(cc.sequence(scaleAction, fadeout))

      //根据是否在无敌状态选择游戏结束或杀死怪物得到加分
      if (this.invincible === false) {
        cc.game.emit('gameover')
      } else {
        cc.game.emit('killmonster')
      }
    }
  },

  // 判断仓鼠是否踩在敌人正上方，如果是，那么发出信号
  isTreadOnHead (enemy) {
    let dx = this.node.x - enemy.node.x
    let dy = this.node.y - enemy.node.y
    let angle = Math.atan2(dy, dx)
    return Math.PI / 4 < angle && angle < Math.PI * 3 / 4
  },

  collideWithMushroom (mushroom) {
    mushroom.node.runAction(this.collectAction)
    if (this.invincible === false) {
      this.invincible = true
    } else {
      clearTimeout(this.invincibleTimer)
    }
    cc.game.emit('invincible start')
    this.invincibleTimer = setTimeout(() => {
      if (this.invincible) {
        this.invincible = false
        cc.game.emit('invincible end')
      }
    }, 5000)
  },

  // 角度制转换为弧度制
  toArc (ang) {
    return Math.PI * ang / 180
  },

  // 开始进入无敌状态
  invincibleStart () {
    this.invincibleText.active = true
    this.node.parent.getChildByName('tongue').color = new cc.color(65, 174, 60)
    this.node.parent.getChildByName('tongue').getChildByName('claw').color = new cc.color(65, 174, 60)
    this.node.color = new cc.color(65, 174, 60)
    this.node.runAction(this.invincibleAction)
  },

  // 结束无敌状态
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
