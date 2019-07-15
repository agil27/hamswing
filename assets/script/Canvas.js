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

    starPrefab: {
      default: null,
      type: cc.Prefab
    },

    minY: -150,
    maxY: 250,
    fixedDeltaX: 800,

    minTimeInterval: 1000,
    maxTimeInterval: 3000,

    lastGenerateX: 0,

    score: 0,

    ym: {
      default: null,
      type: cc.Node
    },

    mainCamera: {
      default: null,
      type: cc.Node
    },

    bg1: {
      default: null,
      type: cc.Node
    },

    bg2: {
      default: null,
      type: cc.Node
    },

    panel: {
      default : null,
      type : cc.Node
    },

    isGameOver: false
  },

  // LIFE-CYCLE CALLBACKS:

  onEnable () {
    cc.game.on('gameover', this.gameover, this)
    cc.game.on('touchstar', this.touchStar, this)
    this.mainCamera = this.node.getChildByName('Main Camera')
    this.ym = this.node.getChildByName('ym')
    this.bg1 = this.node.getChildByName('bg1')
    this.bg2 = this.node.getChildByName('bg2')
    this.panel = this.node.getChildByName('overPanel')
    this.isGameOver = false
    
    this.bg1.on('touchstart', ()=>{
      if (!this.isGameOver) {
        cc.game.emit('ymstickout')
      }
    })
    this.bg2.on('touchstart', ()=>{
      if (!this.isGameOver) {
        cc.game.emit('ymstickout')
      }
    })
    this.bg1.on('touchend', ()=>{
      if (!this.isGameOver) {
        cc.game.emit('ymrollup')
      }
    })
    this.bg2.on('touchend', ()=>{
      if (!this.isGameOver) {
        cc.game.emit('ymrollup')
      }
    })
    this.bg1.on('touchcancel', ()=>{
      if (!this.isGameOver) {
        cc.game.emit('ymrollup')
      }
    })
    this.bg2.on('touchcancel', ()=>{
      if (!this.isGameOver) {
        cc.game.emit('ymrollup')
      }
    })
  },

  start () {
    setTimeout(this.generateObject.bind(this), 2000)
    cc.game.emit('updatescore', this.score)
    this.lastGenerateX = this.ym.x + this.fixedDeltaX
  },

  update (dt) {
    this.mainCamera.x = this.ym.x
    this.mainCamera.y = 0
  },

  generateObject () {
    if (!this.isGameOver) {
      let obj
      if (Math.random() > 0.3) {
        obj = cc.instantiate(this.starPrefab)
      } else {
        obj = cc.instantiate(this.monsterPrefab)
      }
      //console.log(this.node)
      this.node.addChild(obj)
      let pos = this.generatePosition()
      if (pos !== null) {
        obj.setPosition(pos)
      }
      let timeInterval = this.generateInterval()
      setTimeout(this.generateObject.bind(this), timeInterval)
    }
  },

  gameover () {
    this.node.getChildByName('tongue').active = false
    this.ym.enabled = false
    this.ym.active = false
    this.isGameOver = true
    this.panel.active = true
    console.log('gameover!')
  },

  touchStar () {
    ++this.score
    cc.game.emit('updatescore', this.score)
  },

  generatePosition () {
    let x = this.fixedDeltaX + this.node.getChildByName('ym').x
    let y = this.minY + (this.maxY - this.minY) * Math.random()
    if (x < this.lastGenerateX + this.fixedDeltaX) {
      return null
    }
    this.lastGenerateX = x
    return cc.v2(x, y)
  },

  generateInterval () {
    return this.minTimeInterval + (this.maxTimeInterval - this.minTimeInterval) * Math.random()
  },

  restartGame() {
    cc.director.loadScene('game')
  }
})
