// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let ym = cc.Class({
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
    mainCamera: {
      default: null,
      type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    cc.director.getPhysicsManager().enabled = true

    this.node.x = -450
    this.node.y = 200
    this.node.scaleX = 0.05
    this.node.scaleY = 0.05

    this.rigidBody = this.node.getComponent(cc.RigidBody)
    this.rigidBody.type = cc.RigidBodyType.Dynamic
    this.rigidBody.allowSleep = true
    this.rigidBody.gravityScale = 10

    this.ropeJoint = this.node.getComponent(cc.RopeJoint)
    let ceiling = this.node.parent.getChildByName('ceiling')
    this.ropeJoint.connectedBody = ceiling.getComponent(cc.RigidBody)
    this.ropeJoint.anchor = cc.v2(0, 0)
    this.ropeJoint.connectedAnchor = cc.v2(0, 0)
    this.ropeJoint.collideConnected = true
    this.maxLength = 200

    this.mainCamera = this.node.getChildByName('Main Camera')
  },

  start () {},

  update (dt) {
    this.mainCamera.x = this.node.x
    this.mainCamera.y = 320 - this.node.y
  },

  stickOutTongue () {
    console.log('stick out')
  },

  rollUpTongue () {
    console.log('roll up')
  }
})
