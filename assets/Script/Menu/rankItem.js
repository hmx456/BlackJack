cc.Class({
    extends: cc.Component,

    properties: {
        rankBg: cc.Sprite,
        rankLabel: cc.Label,
        head: cc.Sprite,
        nickLabel: cc.Label,
        goldLabel: cc.Label,
        headList:{
            default: [],
            type: cc.SpriteFrame
        },
        rankBgList: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    init: function(rank,playerInfo){
        if(rank<3)
        {
            this.rankLabel.node.active = false;
            this.rankBg.spriteFrame = this.rankBgList[rank];
        }
        else 
        {
            this.rankLabel.node.active = true;
            this.rankLabel.string = (rank + 1).toString();
        }

        this.head.spriteFrame = this.headList[playerInfo.photoIdx];
        this.nickLabel.string = playerInfo.name;
        this.goldLabel.string = playerInfo.gold.toString();
    }

    // use this for initialization
    // onLoad: function () {

    // },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
