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

        if (switchSide) {
            this.spCardInfo.getComponent('SideSwitcher').switchSide();
            this.spPlayerName.getComponent('SideSwitcher').switchSide();
        }
    },

     updateTotalStake: function (num) {
        this.labelTotalStake.string = '$' + num;
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
    // use this for initialization
    //onLoad: function () {

    //},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
