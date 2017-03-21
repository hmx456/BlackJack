const players = require('PalyerData').players;
//var foo = require('test');
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        prefabRankItem: cc.Prefab,
        rankCount: 0
    },

    // use this for initialization
    onLoad: function () {
        //cc.log(foo.dirty);        
        this.content = this.scrollView.content;
        this.populateList();
    },

    populateList: function(){
        for(var i=0;i<this.rankCount;i++)
        {
            var ss = players.length;
            cc.log(ss);
            var playersInfo = players[i];
            var item = cc.instantiate(this.prefabRankItem);
            item.getComponent('rankItem').init(i,playersInfo);
            this.content.addChild(item);
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
