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

    ghostPrefab: {
      default: null,
      type: cc.Prefab
    },

    starPrefab: {
      default: null,
      type: cc.Prefab
    },

    cloud0Prefab: {
      default: null,
      type: cc.Prefab
    },

    cloud1Prefab: {
      default: null,
      type: cc.Prefab
    },

    cloud2Prefab: {
      default: null,
      type: cc.Prefab
    },

    mushroomPrefab: {
      default: null,
      type: cc.Prefab
    },

    lastGenerateX: 0,
    lastCloudX: 0,
    lastYmX: 0,

    score: 0,
    scoreFactor: 1,

    doubleStateTimer: null,

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
      default: null,
      type: cc.Node
    },

    scoreBoard: {
      default: null,
      type: cc.Node
    },

    fasterLayer: {
      default: null,
      type: cc.Node
    },

    slowerLayer: {
      default: null,
      type: cc.Node
    },

    objsLayer: {
      default: null,
      type: cc.Node
    },

    invincibleText: {
      default: null,
      type: cc.Node
    },

    doubleScoreText: {
      default: null,
      type: cc.Node
    },

    isGameOver: false
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    cc.game.on('gameover', this.gameover, this)
    cc.game.on('touchstar', this.touchStar, this)
    this.mainCamera = this.node.getChildByName('Main Camera')
    this.ym = this.node.getChildByName('ym')
    this.bg1 = this.node.getChildByName('bg1')
    this.bg2 = this.node.getChildByName('bg2')
    this.bgc0 = this.node.getChildByName('bgcloud0')
    this.bgc1 = this.node.getChildByName('bgcloud1')
    this.panel = this.node.getChildByName('overPanel')
    this.scoreBoard = this.node.getChildByName('score')
    this.invincibleText = this.node.getChildByName('invincibleText')
    this.isGameOver = false

    this.bg1.on('touchstart', () => {
      if (!this.isGameOver) {
        cc.game.emit('ymstickout')
      }
    })
    this.bg2.on('touchstart', () => {
      if (!this.isGameOver) {
        cc.game.emit('ymstickout')
      }
    })
    this.bg1.on('touchend', () => {
      if (!this.isGameOver) {
        cc.game.emit('ymrollup')
      }
    })
    this.bg2.on('touchend', () => {
      if (!this.isGameOver) {
        cc.game.emit('ymrollup')
      }
    })
    this.bg1.on('touchcancel', () => {
      if (!this.isGameOver) {
        cc.game.emit('ymrollup')
      }
    })
    this.bg2.on('touchcancel', () => {
      if (!this.isGameOver) {
        cc.game.emit('ymrollup')
      }
    })
  },

  start () {
    setTimeout(this.generateObject.bind(this), 2000)
    cc.game.emit('updatescore', this.score)
    this.lastGenerateX = this.ym.x + this.node.width
    this.lastCloudX = this.ym.x + this.node.width + Math.random() * 1000
    this.lastYmX = this.ym.x
    setInterval(this.updateScore.bind(this), 100)
    setInterval(this.clearObjsOutOfScreen.bind(this), 1000)
  },

  update (dt) {
    this.mainCamera.x = this.ym.x + 360
    this.mainCamera.y = 0

    if (this.bg1.x + 1600 < this.mainCamera.x) {
      this.bg1.x += 3200
      this.bgc1.x += 3200
    }
    if (this.bg2.x + 1600 < this.mainCamera.x) {
      this.bg2.x += 3200
      this.bgc0.x += 3200
    }

    if (this.ym.y < -240 && !this.isGameOver) {
      this.gameover()
    }

    this.updateClouds()

    this.invincibleText.x = this.mainCamera.x
    this.doubleScoreText.x = this.mainCamera.x
  },

  generateObject () {
    if (!this.isGameOver) {
      let obj
      let rand = Math.random()
      if (rand > 0.5) {
        obj = cc.instantiate(this.mushroomPrefab)
      } else if (rand > 0) {
        obj = cc.instantiate(this.starPrefab)
      } else if (rand > 0.3) {
        obj = cc.instantiate(this.ghostPrefab)
      } else {
        obj = cc.instantiate(this.monsterPrefab)
      }
      let pos = this.generatePosition()
      if (pos !== null) {
        this.objsLayer.addChild(obj)
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
    this.doubleScoreText.active = false
    this.invincibleText.active = false
    this.isGameOver = true
    this.panel.active = true
    this.scoreBoard.y = -20
  },

  touchStar () {
    this.scoreFactor = 2
    this.doubleScoreText.active = true
    if (this.doubleStateTimer) {
      clearTimeout(this.doubleStateTimer)
    }
    this.doubleStateTimer = setTimeout(() => {
      this.scoreFactor = 1
      this.doubleStateTimer = null
      if (this.doubleScoreText) {
        this.doubleScoreText.active = false
      }
    }, 3000)
  },

  generatePosition () {
    let minY = -150
    let maxY = 250
    let generateDistance = 1500
    let generateDeltaX = 150
    let x = generateDistance + this.ym.x - this.objsLayer.x
    let y = minY + (maxY - minY) * Math.random() - this.objsLayer.y
    if (x < this.lastGenerateX + generateDeltaX) {
      return null
    }
    this.lastGenerateX = x
    return cc.v2(x, y)
  },

  generateInterval () {
    let minTimeInterval = 1000
    let maxTimeInterval = 2500
    return minTimeInterval + (maxTimeInterval - minTimeInterval) * Math.random()
  },

  restartGame () {
    cc.director.loadScene('game')
  },

  toMenu () {
    cc.director.loadScene('start')
  },

  generateCloud () {
    if (!this.isGameOver) {
      let cloud
      let typeRand = Math.random()
      if (typeRand > 0.6) {
        cloud = cc.instantiate(this.cloud0Prefab)
      } else if (typeRand > 0.2) {
        cloud = cc.instantiate(this.cloud1Prefab)
      } else {
        cloud = cc.instantiate(this.cloud2Prefab)
      }
      let layerRand = Math.random()
      let layer
      if (layerRand > 0.6) {
        layer = this.fasterLayer
        cloud.opacity = 255
      } else {
        layer = this.slowerLayer
        cloud.opacity = 150
      }
      layer.addChild(cloud)
      cloud.setPosition(this.generateCloudPosition(layer.position))
    }
  },

  generateCloudPosition (bias) {
    let cloudX = this.lastCloudX + (Math.random() + 1) * 500
    let yMin = 80
    let yMax = 300
    let cloudY = yMin + (yMax - yMin) * Math.random()
    this.lastCloudX = cloudX
    return cc.v2(cloudX - bias.x, cloudY - bias.y)
  },

  updateClouds () {
    let cloudRangeX = {
      lowerbound: this.ym.x - this.node.width,
      upperbound: this.ym.x + this.node.width
    }

    let speed = this.ym.getComponent(cc.RigidBody).linearVelocity.x
    this.updateCloudsInLayer(this.fasterLayer, speed * 0.001, cloudRangeX)
    this.updateCloudsInLayer(this.slowerLayer, speed * 0.005, cloudRangeX)
    if (this.lastCloudX < cloudRangeX.upperbound) {
      this.generateCloud()
    }
  },

  updateCloudsInLayer (layer, speed, rangeX) {
    let clouds = layer.children
    for (let c of clouds) {
      if (c.x < rangeX.lowerbound) {
        c.destroy()
      } else {
        c.x -= speed
      }
    }
  },

  updateScore () {
    if (this.ym && this.ym.x > this.lastYmX) {
      let deltaX = Math.floor((this.ym.x - this.lastYmX) / 10)
      this.score += deltaX * this.scoreFactor
      this.lastYmX = this.ym.x
      cc.game.emit('updatescore', this.score)
    }
  },

  clearObjsOutOfScreen () {
    if (this.ym) {
      let range = {
        lowerbound: null,
        upperbound: this.ym.x - this.node.width / 2
      }
      this.clearObjsInRange(range)
    }
  },

  clearObjsInRange (range) {
    let objs = this.objsLayer.children
    for (let o of objs) {
      let x = o.x + this.objsLayer.x
      if (x < range.upperbound && (!range.lowerbound || x > range.lowerbound)) {
        o.destroy()
      }
    }
  }
})
