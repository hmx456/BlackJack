cc.Class({
    extends: cc.Component,

    properties: {
      bgm: {
          default: null,
          url: cc.AudioClip
      },

      btnEffect: {
          default: null,
          url: cc.AudioClip
      }

    },

    // use this for initialization
    onLoad: function () {

    },

    playBgm: function(){
        cc.audioEngine.playMusic(this.bgm,true);
    },

    playEffect: function(clip){
        cc.audioEngine.playEffect(clip,false);
    },

    pauseMusic: function(){
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function(){
        cc.audioEngine.resumeMusic();
    },

    playBtnEffect: function(){
        this.playEffect(this.btnEffect);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
