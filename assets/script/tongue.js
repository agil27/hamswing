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
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
    curLength: 0,
    lengthenSpeed: 5,
    angle: 0,
    isLengthening: false,
    isShortening: false,
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
    attachPointInWorldSpace: {
      default: new cc.Vec2()
    },
    attachPointInNodeSpace: {
      default: new cc.Vec2()
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.node.enabled = false

    cc.game.on('stickout', this.lengthen, this)
    cc.game.on('rollup', this.shorten, this)

    this.ym = this.node.parent.getChildByName('ym')
    this.ropeJoint = this.ym.getComponent(cc.RopeJoint)
    this.ceiling = this.node.parent.getChildByName('ceiling')
  },

  start () {

  },

  update (dt) {
    let p1 = this.ym.position
    let p2 = this.attachPointInWorldSpace
    let distance = this.calculateDistance(p1, p2)
    let angle = this.calculateAngle(p1, p2)
    if (this.isLengthening) {
      this.curLength += this.lengthenSpeed
      console.log('len: ' + this.curLength)
      console.log('dis: ' + distance)
      if (this.curLength > distance) {
        this.curLength = distance
        this.isLengthening = false
        this.attach(this.attachPointInNodeSpace)
      }
    }
    // if (this.isShortening)
    this.node.width = this.curLength
    this.node.position = this.ym.position
    this.node.rotation = angle
  },

  lengthen () {
    console.log('lengthen')
    console.log(this.isLengthening)
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

  attach (connectedAnchor) {
    console.log('attach')
    this.ropeJoint.enabled = true
    this.ropeJoint.connectedBody = this.ceiling.getComponent(cc.RigidBody)
    this.ropeJoint.anchor = cc.v2(0, 0)
    this.ropeJoint.connectedAnchor = connectedAnchor
    this.ropeJoint.maxLength = this.curLength
    this.ropeJoint.collideConnected = true
    this.ropeJoint.apply()
  },

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
  }
})
