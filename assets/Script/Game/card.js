cc.Class({
    extends: cc.Component,

    properties: {
        point: cc.Label,
        suit: cc.Sprite,
        mainPic: cc.Sprite,
        redTextColor: cc.Color.WHITE,
        blackTextColor: cc.Color.WHITE,
        texFrontBG: cc.SpriteFrame,
        texBackBG: cc.SpriteFrame,
        texFaces: {
            default: [],
            type: cc.SpriteFrame,
        },
        texSuitBig: {
            default: [],
            type: cc.SpriteFrame
        },
        texSuitSmall: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    init: function(card){
        var isFaceCard = card.point>10;

        if(isFaceCard)
        {
            this.mainPic.spriteFrame = this.texFaces[card.point - 10 - 1];
        }
        else{
            this.mainPic.spriteFrame = this.texSuitBig[card.suit - 1];
        }

        this.point.string = card.pointName;

        if (card.isRedSuit) {
            this.point.node.color = this.redTextColor;
        }
        else {
            this.point.node.color = this.blackTextColor;
        }

        this.suit.spriteFrame = this.texSuitSmall[card.suit - 1];
    },

     reveal: function (isFaceUp) {
        this.point.node.active = isFaceUp;
        this.suit.node.active = isFaceUp;
        this.mainPic.node.active = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.texFrontBG : this.texBackBG;
    },

    // use this for initialization
    //onLoad: function () {

    //},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
