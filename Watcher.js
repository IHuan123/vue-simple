//订阅者处理
/**
 * 
 * @param {*} vm selfVue实例
 * @param {*} exp data中的数据
 * @param {*} cb 执行回调函数
 */
function Watcher(vm,exp,cb){
    //vm当前实例 exp(需要绑定data中的那个属性) cd一个函数(主要操作dom将数据显示到上面)
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get();
}
Watcher.prototype = {
    update(){//数据发生变化时执行
        this.run()
    },
    /**
     * 执行回调
     */
    run(){
        var value = this.vm.data[this.exp];//获取绑定的值（最新）
        var oldVal = this.value;
        if(oldVal!==value){
            this.value = value;//如何值变化了 将这次变化的值保存 用于和下次更新的值做比较
            this.cb.call(this.vm,value,oldVal);
        }
    },
    /**
     * 获取绑定的数据
     */
    get(){
        Dep.target = this;
        var value = this.vm.data[this.exp];//获取到当前使用数据触发get 将this添加到订阅者容器
        Dep.target = null;
        return value;
    }
}