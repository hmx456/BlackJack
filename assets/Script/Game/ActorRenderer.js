var Types = require('Types');
var ActorPlayingState = Types.ActorPlayingState;
var Utils = require('Utils');
var Game = require('game');

cc.Class({
    extends: cc.Component,

    properties: {
        playerInfo: cc.Node,
        stakeOnTable: cc.Node,
        cardInfo: cc.Node,
        cardPrefab: cc.Prefab,
        anchorCards: cc.Node,
        spPlayerName: cc.Sprite,
        labelPlayerName: cc.Label,
        labelTotalStake: cc.Label,
        spPlayerPhoto: cc.Sprite,
        callCounter: cc.ProgressBar,
        labelStakeOnTable: cc.Label,
        spChips: {
            default: [],
            type: cc.Sprite
        },
        labelCardInfo: cc.Label,
        spCardInfo: cc.Sprite,
        animFX: cc.Node,
        cardSpace: 0,
        playerFace: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    init: function(playerInfo,playerInfoPos,stakePos,switchSide){
        // actor
        this.actor = this.getComponent('Actor');

        this.playerInfo.position = playerInfoPos;
        this.stakeOnTable.position = stakePos;

        this.labelPlayerName.string = playerInfo.name;
        this.updateTotalStake(playerInfo.gold);
        var photoIdx = playerInfo.photoIdx % 5;
        this.spPlayerPhoto.spriteFrame = this.playerFace[photoIdx];
        
        this.cardInfo.active = false;
        this.TotalStake = playerInfo.gold;

        if (switchSide) {
            this.spCardInfo.getComponent('SideSwitcher').switchSide();
            this.spPlayerName.getComponent('SideSwitcher').switchSide();
        }
    },

     updateTotalStake: function (num) {
        this.TotalStake = num;
        this.labelTotalStake.string = '$' + num;
    },

    getTotalStake: function(){
        return this.TotalStake;
    },
    //发牌
    onDeal: function(card,show){
        var card_ = cc.instantiate(this.cardPrefab);
        this.anchorCards.addChild(card_);
        var newCard = card_.getComponent('card');
        newCard.init(card);
        newCard.reveal(show);

        var startPos = cc.v2(0,0);
        var index = this.actor.cards.length -1;
        var endPos = cc.v2(index*this.cardSpace,0)
        card_.setPosition(startPos);
        this._updatePointPos(endPos.x);

        var moveAction = cc.moveTo(0.5,endPos);
        var callback = cc.callFunc(this._onDealEnd,this);
        card_.runAction(cc.sequence(moveAction,callback));  
    },

     _updatePointPos: function (xPos) {
        // cc.log(this.name + ' card info pos: ' + xPos);
        this.cardInfo.setPosition(xPos + 50, 0);
    },

     _onDealEnd: function(target) {
        //this.resetCountdown();
        //if(this.actor.state === ActorPlayingState.Normal) {
           // this.startCountdown();
        //}
        if(this.actor.state === ActorPlayingState.Bust || this.actor.state === ActorPlayingState.Stand)
            return;
        this.updatePoint();
    },

     updatePoint: function () {
        this.cardInfo.active = true;
        this.labelCardInfo.string = this.actor.bestPoint;

        // switch (this.actor.hand) {
        //     case Types.Hand.BlackJack:
        //         this.animFX.show(true);
        //         this.animFX.playFX('blackjack');
        //         break;
        //     case Types.Hand.FiveCard:
        //         // TODO
        //         break;
        // }
    },

    initDealer: function(){
         this.actor = this.getComponent('Actor');
    },

     onReset: function () {
        this.cardInfo.active = false;

        this.anchorCards.removeAllChildren();

        //this._resetChips();
    },

    onRevealHoldCard: function () {
        var card = cc.find('cardPrefab', this.anchorCards).getComponent('card');
        card.reveal(true);
        this.updateState();
    },

    updateState: function () {
        switch (this.actor.state) {
            case ActorPlayingState.Normal:
                this.cardInfo.active = true;
                //this.spCardInfo.spriteFrame = Game.instance.assetMng.texCardInfo;
                this.updatePoint();
                break;
            case ActorPlayingState.Bust:
                var min = Utils.getMinMaxPoint(this.actor.cards).min;
                this.labelCardInfo.string = '爆牌(' + min + ')';
                //this.spCardInfo.spriteFrame = Game.instance.assetMng.texBust;
                this.cardInfo.active = true;
                //this.animFX.show(true);
                //this.animFX.playFX('bust');
                //this.resetCountdown();
                break;
            case ActorPlayingState.Stand:
                var max = Utils.getMinMaxPoint(this.actor.cards).max;
                this.labelCardInfo.string = '停牌(' + max + ')';
               // this.spCardInfo.spriteFrame = Game.instance.assetMng.texCardInfo;
                //this.resetCountdown();
                // this.updatePoint();
                break;
        }
    },
    // use this for initialization
    //onLoad: function () {

    //},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
