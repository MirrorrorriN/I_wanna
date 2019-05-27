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
        // 一阶跳最大高度
        firstJumpHeight: 0,
        // 一阶跳持续时间
        firstJumpDuration: 0,
        // 二阶跳最大高度
        secondJumpHeight: 0,
        // 二阶跳持续时间
        secondJumpDuration: 0,
        // 水平移动速度
        xMoveSpeed: 4,
        // 最大移动速度
        maxMoveSpeed: 0,
        // kid的位置
        
    },

    setMoveAction: function () {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },

    onKeyDown (event) {
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.moveLeft = true;
                break;
            case cc.macro.KEY.right:
                this.moveRight = true;
                break;
            case cc.macro.KEY.shift:
                this.moveUp = true;
                break;
        }
    },

    onKeyUp (event) {
        // unset a flag when key released
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.moveLeft = false;
                break;
            case cc.macro.KEY.right:
                this.moveRight = false;
                break;
            case cc.macro.KEY.shift:
                this.moveUp = true;
                break;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        // 初始化跳跃动作
        this.moveAction = this.setMoveAction();
        this.node.runAction(this.moveAction);

        // 速度方向
        this.moveLeft = false;
        this.moveRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);   
    },

    onDestroy () {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },    

    start () {

    },

    update: function (dt) {
        // 根据当前加速度方向每帧更新速度
        if(this.moveLeft&&this.moveRight){
            this.xMoveSpeed=0;
        } else if (this.moveLeft) {
            this.xMoveSpeed=-maxMoveSpeed;
        } else if (this.moveRight) {
            this.xMoveSpeed=maxMoveSpeed;
        } else{
            this.xMoveSpeed=0;
        }
        // 限制主角的速度不能超过最大值
        // if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
        //     // if speed reach limit, use max speed with current direction
        //     this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        // }

        // 根据当前速度更新主角的位置
        this.node.x+=this.xMoveSpeed;
        // this.node.x += this.xSpeed * dt;
    },
});
