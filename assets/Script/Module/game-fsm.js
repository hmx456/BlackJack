var evaluating = false;
var fsm = null;
exports = {
  
    init: function(target){
        var fsm = StateMachine.create({
        initial: 'bet',
        events:[
            {name: 'start', from: 'bet', to: 'playing'},     //下注-》开局
            {name: 'dispose', from: 'playing', to: 'deal'},  //开局-》发牌
            {name: 'playerdecision', from: 'deal', to: 'players'},  //发牌-》玩家决策
            {name: 'bankerdecision', from: 'players', to: 'banker'},   //玩家决策-》庄家决策
            {name: 'end', from: 'banker', to: 'settled'},   //庄家决策-》结算
            {name: 'restart', from: 'settled', to: 'bet'},   //结算-》下注  
        ],
        callbacks:{
            //下注
            onbet()
            {
                target.onBetState(true);
            },
            onleavebet(){
                 target.onBetState(false);
            },
            //结算
            onsettled()
            {
                target.onEndState(true);
            },
            onleavesettled(){
                 target.onEndState(false);
            },
            //玩家决策
            onplayers()
            {
                target.onPlayersTurnState(true);
            },
            onleaveplayers(){
                target.onPlayersTurnState(false);
            },
            //庄家决策
            onbanker()
            {
               target.onEnterDealersTurnState();
            },

            //发牌
            ondeal()
            {
                target.onEnterDealState();
            }
        },

        });

    },
    toDeal: function () {
        fsm.start();
    },

    toBet: function () {
        fsm.restart();
    },
    onDealed: function () {
        fsm.playerdecision();
    },
    onPlayerActed: function () {
        fsm.bankerdecision();
    },
    onDealerActed: function () {
        fsm.end();
    },
};

module.exports = exports;