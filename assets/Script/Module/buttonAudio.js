cc.Class({
    extends: cc.Component,

    properties: {
     AudioMng: {
         default: null,
         type: cc.Node
     }
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        this.node.on('touchstart',function(){
            self.AudioMng.getComponent('AudioMng').playBtnEffect();
        },this.node);
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
