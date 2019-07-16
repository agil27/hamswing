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

    minY: -150,
    maxY: 250,
    generateDistance: 1500,
    generateDeltaX: 50,

    minTimeInterval: 5,
    maxTimeInterval: 50,

    lastGenerateX: 0,
    lastCloudX: 0,

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
    this.bgc0 = this.node.getChildByName('bgcloud0')
    this.bgc1 = this.node.getChildByName('bgcloud1')
    this.panel = this.node.getChildByName('overPanel')
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
  },

  generateObject () {
    if (!this.isGameOver) {
      let obj
      if (Math.random() > 0.1) {
        obj = cc.instantiate(this.starPrefab)
      } else {
        obj = cc.instantiate(this.monsterPrefab)
      }
      let pos = this.generatePosition()
      if (pos !== null) {
        this.node.addChild(obj)
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
    let x = this.generateDistance + this.ym.x
    let y = this.minY + (this.maxY - this.minY) * Math.random()
    if (x < this.lastGenerateX + this.generateDeltaX) {
      return null
    }
    this.lastGenerateX = x
    return cc.v2(x, y)
  },

  generateInterval () {
    return this.minTimeInterval + (this.maxTimeInterval - this.minTimeInterval) * Math.random()
  },

  restartGame () {
    cc.director.loadScene('game')
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
      cloud.setPosition(this.generateCloudPosition(layer.y))
    }
  },

  generateCloudPosition (biasY) {
    let cloudX = this.lastCloudX + (Math.random() + 1) * 500
    let yMin = 80
    let yMax = 300
    let cloudY = yMin + (yMax - yMin) * Math.random()
    this.lastCloudX = cloudX
    return cc.v2(cloudX, cloudY - biasY)
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
  }
})
