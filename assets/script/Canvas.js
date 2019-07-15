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
    monsterPrefab: {
      default: null,
      type: cc.Prefab
    },

    minY: -150,
    maxY: 250,
    fixedDeltaX: 500,

    minTimeInterval: 1000,
    maxTimeInterval: 3000,

    score: 0
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    cc.game.on('gameover', this.gameover, this)
  },

  start () {
    setTimeout(this.generateMonster.bind(this), 2000)
  },

  update (dt) {},

  generateMonster () {
    let monster = cc.instantiate(this.monsterPrefab)
    this.node.addChild(monster)
    monster.setPosition(this.generateMonsterPosition())
    let timeInterval = this.generateInterval()
    setTimeout(this.generateMonster.bind(this), timeInterval)
  },

  gameover () {
    console.log('gameover!')
  },

  generateMonsterPosition () {
    let x = this.fixedDeltaX + this.node.getChildByName('ym').x
    let y = this.minY + (this.maxY - this.minY) * Math.random()
    return cc.v2(x, y)
  },

  generateInterval () {
    return this.minTimeInterval + (this.maxTimeInterval - this.minTimeInterval) * Math.random()
  }

})
