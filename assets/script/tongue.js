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
  本文件描述了抓钩类
  由于中途设想主角为吐舌头粘天花板晃悠的青蛙，所以取了这个名字
  因为文件结构原因保留了这个命名
*/

cc.Class({
  extends: cc.Component,

  properties: {
    // 有关抓钩的一些参数
    curLength: 0,
    lengthenSpeed: 25,
    shortenSpeed: 25,
    angle: 0,
    isLengthening: false,
    isShortening: false,

    // 节点
    ym: {
      default: null,
      type: cc.Node
    },
    ropeJoint: {
      default: null,
      type: cc.Node
    },
    ceiling: {
      default: null,
      type: cc.Node
    },
    claw: {
      default: null,
      type: cc.Node
    },

    // 不同坐标下抓钩附着的点
    attachPointInWorldSpace: {
      default: new cc.Vec2()
    },
    attachPointInNodeSpace: {
      default: new cc.Vec2()
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    // 先设为不可见
    this.node.enabled = false

    // 收到仓鼠发来的信号进行伸长或缩短
    cc.game.on('stickout', this.lengthen, this)
    cc.game.on('rollup', this.shorten, this)

    // 初始化控件
    this.ym = this.node.parent.getChildByName('ym')
    this.ropeJoint = this.ym.getComponent(cc.RopeJoint)
    this.ceiling = this.node.parent.getChildByName('ceiling')
  },

  start () {

  },

  update (dt) {
    // 找到抓钩附着的点，计算长度和角度
    let p1 = this.ym.position
    let p2 = this.attachPointInWorldSpace
    let distance = this.calculateDistance(p1, p2)
    let angle = this.calculateAngle(p1, p2)

    // 如果正在伸长
    if (this.isLengthening) {
      this.curLength += this.lengthenSpeed
      // 如果已经足够长了
      if (this.curLength > distance) {
        this.curLength = distance
        this.isLengthening = false
        this.attach(this.attachPointInNodeSpace)
      }
    }
    // 如果正在缩短
    if (this.isShortening) {
      this.curLength -= this.shortenSpeed
      // short enough
      if (this.curLength < 0) {
        cc.game.emit('detach', angle)
        this.curLength = 0
        this.isShortening = false
      }
    }

    // 绘制抓钩
    this.node.width = this.curLength
    this.node.position = this.ym.position
    this.node.rotation = angle

    // 确定钩爪的位置
    this.claw.x = this.node.width - this.claw.width / 2 + 1
  },

  lengthen () {
    if (!this.isLengthening) {
      this.node.active = true
      this.isLengthening = true
      this.isShortening = false
      let attachPoint = this.findAttachPoint()
      this.attachPointInNodeSpace = attachPoint.nodeSpace
      this.attachPointInWorldSpace = attachPoint.worldSpace
    }
  },

  shorten () {
    if (!this.isShortening) {
      this.isShortening = true
      this.isLengthening = false
      this.ropeJoint.enabled = false
      this.ropeJoint.connectedBody = null
    }
  },

  // 绳关节模型的连接
  attach (connectedAnchor) {
    this.ropeJoint.enabled = true
    this.ropeJoint.connectedBody = this.ceiling.getComponent(cc.RigidBody)
    this.ropeJoint.anchor = cc.v2(0, 0)
    this.ropeJoint.connectedAnchor = connectedAnchor
    this.ropeJoint.maxLength = this.curLength
    this.ropeJoint.collideConnected = true
    this.ropeJoint.apply()
  },

  // 在仓鼠的右上方45度定位抓钩应该附着的点
  findAttachPoint () {
    return {
      nodeSpace: cc.v2(this.ym.x + this.ceiling.y - this.ym.y - this.ceiling.x, 0),
      worldSpace: cc.v2(this.ym.x + this.ceiling.y - this.ym.y, this.ceiling.y)
    }
  },

  calculateDistance (p1, p2) {
    return Math.floor(Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)))
  },

  calculateAngle (p1, p2) {
    return -Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
  },

  toArc (ang) {
    return Math.PI * ang / 180
  }
})
