var players = require('PalyerData').players;

cc.Class({
    extends: cc.Component,

    properties: {
        playerPrefab: cc.Prefab,
        playerPos:{
            default: [],
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.createPlayers(5);
    },

    createPlayers: function(num){
        for(let i=0;i<num;i++)
        {
            var player = cc.instantiate(this.playerPrefab);
            var anchor = this.playerPos[i]
            var switchSide = (i>2);
            anchor.addChild(player);
            player.position = cc.v2(0,0);

            var playerInfoPos = cc.find('playerInfoPos',anchor);
            var stakePos = cc.find('stakePos',anchor);
            var actorRender = player.getComponent('ActorRenderer');
            actorRender.init(players[i],playerInfoPos,stakePos, switchSide);

        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
