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
    // Prefab们
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

    // 最近敌人、云、仓鼠的x坐标
    lastGenerateX: 0,
    lastCloudX: 0,
    lastYmX: 0,

    // 得分
    score: 0,

    // 1为正常计分模式，2为吃了星星后的双倍计分模式
    scoreFactor: 1,

    // 一些有关动作特效的常数
    bonusAppearanceTime: 2000,
    fadeInDuration: 0.5,
    scaleDuration: 0.5,
    bonusScaleUpFactor: 2,
    touchTutorialDuration: 5000,
    collectTutorialDuration: 5000,
    monsterTutorialDuration: 5000,

    // 节点
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

    bonusText: {
      default: null,
      type: cc.Node
    },

    touchTutorial: {
      default: null,
      type: cc.Node
    },

    collectTutorial: {
      default: null,
      type: cc.Node
    },

    monsterTutorial: {
      default: null,
      type: cc.Node
    },

    // 计时器
    doubleStateTimer: null,
    touchTutorialTimer: null,
    collectTutorialTimer: null,
    monsterTutorialTimer: null,
    bonusTimer: null,
    bonusAction: null,

    // 游戏常量
    isGameOver: false,

    // 控制教学模式的变量
    notCollectYet: true,
    notMeetMonsterYet: true,
    firstTouch: false,
    firstCollect: false,
    firstMonster: false,
    readyToGenerateStars: false,
    readyToGenerateMonsters: false
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.initProps()
    this.bindSignals()
    this.processTouchEvent()
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

  bindSignals () {
    cc.game.on('gameover', this.gameover, this)
    cc.game.on('touchstar', this.touchStar, this)
    cc.game.on('killmonster', this.onKillMonster, this)
    cc.game.on('first touch', this.displayTutorial, this)
  },

  processTouchEvent () {
    this.bg1.on('touchstart', () => {
      if (!this.isGameOver) {
        cc.game.emit('ymstickout')
        if (!this.firstTouch) {
          cc.game.emit('first touch')
          this.firstTouch = true
        }
      }
    })
    this.bg2.on('touchstart', () => {
      if (!this.isGameOver) {
        cc.game.emit('ymstickout')
        if (!this.firstTouch) {
          cc.game.emit('first touch')
          this.firstTouch = true
        }
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

  initProps () {
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
    this.bonusAction = this.generateBonusAction()
  },

  update (dt) {
    this.updateChildPos()
    this.updateInfiniteBackground()
    this.updateClouds()
  },

  updateChildPos () {
    this.mainCamera.x = this.ym.x + 360
    this.mainCamera.y = 0
    this.invincibleText.x = this.mainCamera.x
    this.doubleScoreText.x = this.mainCamera.x
    this.bonusText.x = this.mainCamera.x + 150
    if (!this.firstCollect) {
      this.collectTutorial.x = this.mainCamera.x + 200
    }
    if (!this.firstMonster) {
      this.monsterTutorial.x = this.mainCamera.x + 200
    }
  },

  updateInfiniteBackground () {
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
  },

  generateBonusAction () {
    let fadeInAction = cc.fadeIn(this.fadeInDuration)
    let scaleAction = cc.scaleBy(this.scaleDuration, this.bonusScaleUpFactor)
    return cc.spawn(fadeInAction, scaleAction)
  },

  generateObject () {
    if (!this.isGameOver) {
      let obj

      // 根据教程进展的进度决定产生的对象
      // 一开始只产生星星，后来都产生
      if (this.readyToGenerateMonsters) {
        obj = this.generateAll()
      } else if (this.readyToGenerateStars) {
        obj = this.generateCollections()
      }

      let pos = this.generatePosition()
      if (pos !== null && obj) {
        this.objsLayer.addChild(obj)
        obj.setPosition(pos)
      }
      let timeInterval = this.generateInterval()
      setTimeout(this.generateObject.bind(this), timeInterval)
    }
  },

  generateAll () {
    let rand = Math.random()
    if (rand > 0.8) {
      return cc.instantiate(this.mushroomPrefab)
    } else if (rand > 0.7) {
      return cc.instantiate(this.starPrefab)
    } else if (rand > 0.3) {
      return cc.instantiate(this.ghostPrefab)
    } else {
      return cc.instantiate(this.monsterPrefab)
    }
  },

  generateCollections () {
    let rand = Math.random()
    if (rand >= 0.5) {
      return cc.instantiate(this.mushroomPrefab)
    } else {
      return cc.instantiate(this.starPrefab)
    }
  },

  displayTutorial (name) {
    // 一个恐怖的回调函数嵌套，用来计时产生提示文字
    if (this.node) {
      this.touchTutorialTimer = setTimeout(() => {
        // 玩法提示的标志该消失了
        this.touchTutorial.active = false
        this.collectTutorial.active = true
        // 可以产生星星了
        this.readyToGenerateStars = true
        this.collectTutorialTimer = setTimeout(() => {
          // 收集的提示标志该移动了
          this.firstCollect = true
          this.collectTutorialTimer = setTimeout(() => {
            // 收集的提示标志该消失了
            this.collectTutorial.active = false
            // 可以产生小怪兽了
            this.readyToGenerateMonsters = true
            this.monsterTutorial.active = true
            this.monsterTutorialTimer = setTimeout(() => {
              this.firstMonster = true
              this.monsterTutorialTimer = setTimeout(() => {
                this.monsterTutorial.active = false
              }, this.monsterTutorialDuration)
            }, this.monsterTutorialDuration)
          }, this.collectTutorialDuration)
        }, this.collectTutorialDuration)
      }, this.touchTutorialDuration)
    }
  },

  gameover () {
    this.stopTimers()
    this.node.getChildByName('tongue').active = false
    this.ym.enabled = false
    this.ym.active = false
    this.bonusText.active = false
    this.doubleScoreText.active = false
    this.invincibleText.active = false
    this.touchTutorial.active = false
    this.collectTutorial.active = false
    this.monsterTutorial.active = false
    this.isGameOver = true
    this.panel.active = true
    this.scoreBoard.y = -20
  },

  stopTimers () {
    if (this.monsterTutorialTimer) clearTimeout(this.monsterTutorialTimer)
    if (this.collectTutorialTimer) clearTimeout(this.collectTutorialTimer)
    if (this.touchTutorialTimer) clearTimeout(this.touchTutorialTimer)
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
    cc.director.loadScene('tutorial')
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
    if (this.ym && this.ym.x > this.lastYmX) { // the score won't decrease
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
  },

  onKillMonster () {
    this.score += 100
    if (this.bonusText) {
      if (this.bonusText.active === true) {
        clearTimeout(this.bonusTimer)
      }
      this.bonusText.active = true
      this.bonusText.scale = 0.1
      this.bonusText.runAction(this.bonusAction)
      this.bonusTimer = setTimeout(() => {
        this.bonusText.active = false
      }, this.bonusAppearanceTime)
    }
  },

  buttonClicked () {
    cc.game.emit('click button')
  }
})
