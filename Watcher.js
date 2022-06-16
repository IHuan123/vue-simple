//订阅者处理
/**
 *
 * @param {*} vm selfVue实例
 * @param {*} exp data中的数据key
 * @param {*} callback 执行回调函数
 */
function Watcher(vm, exp, callback) {
  //vm当前实例 exp(需要绑定data中的那个属性) cd一个函数(主要操作dom将数据显示到上面)
  this.vm = vm;
  this.exp = exp;
  this.callback = callback;
  this.value = this.get(); // 获取到data中的初始值
}
Watcher.prototype = {
  update() {
    //数据发生变化时执行
    this.run();
  },
  /**
   * 执行回调
   */
  run() {
    var value = this.vm.data[this.exp]; //获取绑定的值（最新）
    var oldVal = this.value;
    if (oldVal !== value) {
      this.value = value; //如何值变化了 将这次变化的值保存 用于和下次更新的值做比较
      this.callback.call(this.vm, value, oldVal);
    }
  },
  /**
   * 获取绑定的数据
   */
  get() {
    Dep.target = this; // 将watch实例赋值给Dep,在数据更新时，Observer会将watcher添加到Dep实例中
    // 获取到当前使用数据触发get 将this添加到订阅者容器(这里会触发Observer中Object.defineProperty中的get)
    // 通过dep.add添加Watcher
    var value = this.vm.data[this.exp]; 
    // 添加后清空Dep.target (防止每次都添加到Dep中)
    Dep.target = null;
    return value;
  },
};
