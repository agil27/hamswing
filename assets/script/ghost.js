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
        scaleDuration: 0.2, //secs
        scaleFactorUp: 2,
        scaleFactorDown: 0.5,
        scaleAction: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.difficultify()
        //cc.director.getCollisionManager().enabled = true
    },
    
    generateScaleAction () {
        let scaleUp = cc.scaleBy(this.scaleDuration, this.scaleFactorUp)
        let scaleDown = cc.scaleBy(this.scaleDuration, this.scaleFactorDown)
        return cc.repeatForever(cc.sequence(scaleUp, scaleDown))
    },

    difficultify(score) {
        let rand = Math.random()
        if (this.node !== null) {
            this.scaleAction = this.generateScaleAction()
            if (rand > 0.9) {
                this.node.runAction(this.scaleAction)
            }
        }   
    },
    // update (dt) {},
});
