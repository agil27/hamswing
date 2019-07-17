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
    moveDuration: 3, //secs
    moveDistance: 100,
    score: {
      default: null,
      type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    /*
    this.score = this.node.parent.getChildByName('score')
    if (score > 2000) {
      this.difficultify(score, Math.random)
    }
    */
    // cc.director.getCollisionManager().enabled = true
  },

  generateFloatingAction() {
    let moveUp = cc.moveBy(this.moveDuration, cc.v2(0, this.moveDistance)).easing(cc.easeCubicActionOut())
    let moveDown = cc.moveBy(this.moveDuration, cc.v2(0, -this.moveDistance)).easing(cc.easeCubicActionOut())
    return cc.repeatForever(cc.sequence(moveUp, moveDown))
  },

  difficultify(score, rand) {
    /*
    if (score < 5000 && rand > 0.3) {
      this.floatAction
    }
    */
  },

  start () {
  },

  onCollideWithHero() {
    
  },
  // update (dt) {},
})
