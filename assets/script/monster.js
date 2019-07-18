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
    moveDuration: 2, // secs
    moveDistance: 100,
    floatAction: null
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.difficultify()
    // cc.director.getCollisionManager().enabled = true
  },

  generateFloatingAction (direction) {
    let moveUp = cc.moveBy(this.moveDuration, cc.v2(0, this.moveDistance))
    let moveDown = cc.moveBy(this.moveDuration, cc.v2(0, -this.moveDistance))
    if (direction === 0) {
      return cc.repeatForever(cc.sequence(moveUp, moveDown))
    } else {
      return cc.repeatForever(cc.sequence(moveDown, moveUp))
    }
  },

  /*
  generateDribbleAction() {
    let moveLeft = cc.moveBy(this.moveDuration, cc.v2(-this.distanceX, this.distanceY))
    let moveRight = cc.moveBy(this.moveDuration, cc.v2(this.distanceX, -this.distanceY))
    let move = cc.sequence(moveLeft, moveRight)
    return cc.repeatForever(move)
  },
  */

  difficultify () {
    let rand = Math.random()
    if (this.node !== null) {
      if (rand > 0.5) {
        this.floatAction = this.generateFloatingAction()
        if (rand > 0.7) {
          this.node.runAction(this.floatAction, 0)
        } else {
          this.node.runAction(this.floatAction, 1)
        }
      }
    }
  },

  start () {},

  onCollideWithHero () {

  },

  onDestroy () {
    cc.game.off('updatescore', this.difficultify)
  }
  // update (dt) {},
})
