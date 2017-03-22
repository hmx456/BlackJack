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
        this.playBgm();
        cc.director.preloadScene('gameScene');
    },

    playBgm: function(){
        this.AudioMng.getComponent('AudioMng').playBgm();
    },

    playGame: function(i){
        cc.director.loadScene('gameScene');
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
