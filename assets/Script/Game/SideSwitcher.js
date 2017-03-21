cc.Class({
    extends: cc.Component,

    properties: {
        retainSideNodes: {
            default: [],
            type: cc.Node
        }
    },

    switchSide: function(){
        this.node.scalex = -this.node.scalex;
        for(var i=0;i<this.retainSideNodes.length;i++)
        {
            var curNode = this.retainSideNodes[i];
            curNode.scalex = -curNode.scalex;
        }
    }
 

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
