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

    rankContext: {
      default: null,
      type: cc.Node
    },

    page: 0,
    sharedCanvas: null,
    needUpdate: false,
    texture: null,
    spriteFrame: null,
    openDataContext: null
  },

  onLoad () {
    // 初始化画布等公用接口
    this.texture = new cc.Texture2D()
    this.rankContext = this.node.getChildByName('rankCanvas').getComponent(cc.Sprite)
    this.openDataContext = wx.getOpenDataContext()
    this.sharedCanvas = this.openDataContext.canvas

    // 设置画布大小
    this.sharedCanvas.width = 700
    this.sharedCanvas.height = 400

    // 显示画布
    this.showCanvas()

    // 对父控件发射的信号进行处理
    cc.game.on('next page', this.nextPage.bind(this), this)
    cc.game.on('prev page', this.prevPage.bind(this), this)
  },

  update (dt) {
    // 采用变量needUpdate控制是否更新
    if (this.needUpdate) {
      this.texture.initWithElement(this.sharedCanvas)
      this.texture.handleLoadedTexture()
      this.spriteFrame = new cc.SpriteFrame(this.texture)
      this.rankContext.spriteFrame = this.spriteFrame
    }
  },

  showCanvas () {
    if (!this.sharedCanvas) {
      this.initCanvas()
    }

    // 给开放数据域发送消息让其渲染排行榜图像，page用来传递当前页数
    this.openDataContext.postMessage({
      message: 'render',
      page: this.page
    })

    // 仅在showCanvas的时候才开始更新
    this.needUpdate = true
  },

  nextPage () {
    this.page += 1
    this.showCanvas()
  },

  prevPage () {
    // 如果已经是最前一页，那么不翻页了
    this.page = this.max(0, this.page - 1)
    this.showCanvas()
  },

  max (a, b) {
    return a > b ? a : b
  }
})
