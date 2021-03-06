var players = require('PalyerData').players;
var Decks = require('Decks');
var Types = require('Types');
var ActorPlayingState = Types.ActorPlayingState;

var game = cc.Class({
    extends: cc.Component,

    properties: {
        playerPrefab: cc.Prefab,
        playerPos:{
            default: [],
            type: cc.Node
        },
        dealer: cc.Node,
        numberOfDecks: {
            default: 1,
            type: 'Integer'
        },
        gameUI: cc.Node,
        betUI: cc.Node,
        betDuration: 0,
    },
    
    // getInstance: function(){
    //     return game.instance;
    // },

    statics : {
        instance: null
    },

    // use this for initialization
    onLoad: function () {
        game.instance = this;

        this.gameUI = this.gameUI.getComponent('gameUI');
        this.gameUI.init(this.betDuration);
        this.info = this.gameUI.resultText;
        this.totalChips = this.gameUI.totalGold;

        this.betUI = this.betUI.getComponent('Bet');
        this.betUI.init();

        this.dealer = this.dealer.getComponent('Dealer');
        this.dealer.init();

        this.palyer = null;
        this.createPlayers(5);

        this.decks = new Decks(this.numberOfDecks);

        this.totalChipsNum = this.player.getTotalStake();
        //this.onEnterDealState();

    },

    start: function(){
        this.onBetState();
    },

    addStake: function(num){
        if(this.totalChipsNum <num){
            this.info.enabled = true;
            this.info.string = '金币不足';
            return false;
        }
        else{
            this.totalChipsNum -= num;
            this.player.addStake(num);
            this.info.enabled = false;
            this.info.string = '请下注';
            this.updateTotalChips();
            return true;
        }
    },

    updateTotalChips: function() {
        this.totalChips.string = this.totalChipsNum;
        this.player.renderer.updateTotalStake(this.totalChipsNum);
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

            if(i === 2){
                this.player = player.getComponent('Player');
                this.player.init();
                this.totalChips.string = players[i].gold;
            }
        }
    },

    //开始
    onEnterDealState: function () {
        this.betUI.resetTossedChips();
        this.gameUI.showGameState();
        this.player.addCard(this.decks.draw());
        var holdCard = this.decks.draw();
        this.dealer.addHoleCard(holdCard);
        this.player.addCard(this.decks.draw());
        this.dealer.addCard(this.decks.draw());
        //this.audioMng.playCard();
        //this.fsm.onDealed();
    },

    resetStake: function(){

    },
    // 玩家要牌
    hit: function () {
        this.player.addCard(this.decks.draw());
        if (this.player.state === ActorPlayingState.Bust) {
            // if every player end
            //this.fsm.onPlayerActed();
            this.onEnterDealersTurnState();
        }

        //this.audioMng.playCard();

        //if (this.dealer.state === ActorPlayingState.Normal) {
        //    if (this.dealer.wantHit()) {
        //        this.dealer.addCard(this.decks.draw());
        //    }
        //    else {
        //        this.dealer.stand();
        //    }
        //}
        //
        //if (this.dealer.state === ActorPlayingState.Bust) {
        //    this.state = GamingState.End;
        //}
        //this.audioMng.playButton();
    },

     // 玩家停牌
    stand: function () {
        this.player.stand();

        //this.audioMng.playButton();

        // if every player end
        //this.fsm.onPlayerActed();
        this.onEnterDealersTurnState();
    },

    //下注
    onBetState: function(){
        this.decks.reset();
        this.player.reset();
        this.dealer.reset();
        this.info.string = '请下注';
        this.gameUI.showBetState();
        this.gameUI.startCountdown();
    },

   onEnterDealersTurnState: function () {
        while (this.dealer.state === ActorPlayingState.Normal) {
            if (this.dealer.isHit()) {
                this.dealer.addCard(this.decks.draw());
            }
            else {
                this.dealer.stand();
            }
        }
        //this.fsm.onDealerActed();
        this.onEndState(true);
    },

    // 结算
    onEndState: function (enter) {
        if (enter) {
            this.dealer.revealHoldCard();
            this.gameUI.showResultState();
            this.gameUI.resetCountdown();
            this.info.enabled = true;
            var outcome = this._getPlayerResult(this.player, this.dealer);
            switch (outcome) {
                case Types.Outcome.Win:
                cc.log('You Win');
                    this.info.string = 'You Win';
                    // this.audioMng.pauseMusic();
                    // this.audioMng.playWin();
                    // // 拿回原先自己的筹码
                    // this.totalChipsNum += this.player.stakeNum;
                    // // 奖励筹码
                    // var winChipsNum = this.player.stakeNum;
                    // if (!this.player.state === Types.ActorPlayingState.Report) {
                    //     if (this.player.hand === Types.Hand.BlackJack) {
                    //         winChipsNum *= 1.5;
                    //     }
                    //     else {
                    //         // 五小龙
                    //         winChipsNum *= 2.0;
                    //     }
                    // }
                    // this.totalChipsNum += winChipsNum;
                    // this.updateTotalChips();
                    break;

                case Types.Outcome.Lose:
                    this.info.string = 'You Lose';
                    cc.log('You Lose');
                    //this.audioMng.pauseMusic();
                    //this.audioMng.playLose();
                    break;

                case Types.Outcome.Tie:
                    this.info.string = 'Draw';
                     cc.log('Draw');
                    // 退还筹码
                   // this.totalChipsNum += this.player.stakeNum;
                    //this.updateTotalChips();
                    break;
            }
        }

        //this.info.enabled = enter;
    },

    _getPlayerResult: function(player,dealer){
        var outcome = Types.Outcome;
        if(player.state === ActorPlayingState.Bust){
            return outcome.Lose;
        }
        else if(dealer.state === ActorPlayingState.Bust){
            return outcome.Win;
        }

        else{
            if(player.hand > dealer.hand){
                return outcome.Win;
            }
            else if(player.hand < dealer.hand){
                 return outcome.Lose;
            }
            else{
                if(player.bestPoint === dealer.bestPoint){
                    return outcome.Tie;
                }
                else if(player.bestPoint > dealer.bestPoint){
                    return outcome.Win;
                }
                else{
                    return outcome.Lose;
                }
            }
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
