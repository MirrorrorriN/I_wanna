// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        wanna_map: {
            default: null,
            type: cc.TiledMap,
        },
        groundLayer: {
            default: null,
            type: cc.TiledLayer,
        },
        thronLayer: {
            default: null,
            type: cc.TiledLayer,
        },
        jumpPhase: 1,
        jumpSpeedFirst:8.5,
        jumpSpeedSecond:7,
        jumpHeigthFirst: 0,
        jumpHeightSecond: 0,
        gravity: 0.4,
        moveSpeed: 4,
    },

    // LIFE-CYCLE CALLBACKS:

    onKeyDown(event) {
        // set a flag when key pressed
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.kidPos = cc.v2(this.kid.x - this.stepLength, this.kid.y);
                // this.updateKidPos();
                break;
            case cc.macro.KEY.right:
                this.kidPos = cc.v2(this.kid.x + this.stepLength, this.kid.y);
                // this.updateKidPos();
                break;
        }
        console.log(this.kidPos);
        // switch(event.keyCode) {
        //     case cc.macro.KEY.a:
        //         this.accLeft = true;
        //         break;
        //     case cc.macro.KEY.d:
        //         this.accRight = true;
        //         break;
        // }
    },

    onKeyUp(event) {

    },

    //将像素坐标转化为瓦片坐标
    getTilePos: function (posInPixel) {
        let mapSize = this.node.getContentSize();
        let tileSize = this.tiledMap.getTileSize();
        let x = Math.floor(posInPixel.x / tileSize.width);
        let y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height) - 1;
        console.log(cc.v2(x, y));
        return cc.v2(x, y);
    },

    onLoad() {
        this.loadMap();

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    loadMap: function () {
        // 初始化地图位置
        // TODO 从API取地图大小自适应
        // console.log(this.parentNode.width);
        this.node.setPosition(-480, -320);
        // 地图
        this.tiledMap = this.node.getComponent(cc.TiledMap);
        let tileSize = this.tiledMap.getTileSize().width;
        this.stepLength = tileSize * 2;
        this.firstJumpHeight = tileSize * 2.5;
        this.secondJumpHeight = tileSize * 2;
        // objects对象层
        var objects = this.tiledMap.getObjectGroup('objects');
        // player对象
        this.player = objects.getObject('player');
        // 像素坐标
        this.kidPos = cc.v2(this.player.x, this.player.y);
        console.log(this.kidPos);
        // 各图层
        this.background = this.tiledMap.getLayer('background');
        this.ground = this.tiledMap.getLayer('ground');
        this.throns = this.tiledMap.getLayer('throns');
        console.log(this.throns.getPositionAt(this.kidPos));
        console.log(this.throns.getTileGIDAt(this.getTilePos(this.kidPos)));
        // [64,160) (-15,16]
        var testPos = cc.v2(this.player.x + 159, this.player.y - 15);
        console.log(this.throns.getTileGIDAt(this.getTilePos(testPos)));
        // this.playerTile = this.startTile = this.getTilePos(this.playerPos);
        this.kid = this.node.getChildByName('kid');
        // this.updateKidPos();

    },

    start() {

    },

    onDestroy() {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    // dt为两次update之间的间隔时间 单位?
    update: function (dt) {
        this.kid.setPosition(this.kidPos);
        //    var pos = this.throns.getPositionAt(this.playerTile);
        //    this.kid.setPosition(pos);
    },
});
