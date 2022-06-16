//数据监听器
function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    //遍历数据中的每个属性
    walk(data) {
        var self = this;
        let keys = Object.keys(data);
        keys.forEach(function (key, index, arr) {
            self.defineReactive(data, key, data[key]);
        })

    },
    /**
     * 拦截selfVue data，设置setter getter
     * @param {*} data 拦截的对象
     * @param {*} key 拦截的属性
     * @param {*} value 拦截的值
     */
    //将对象中每个属性设置为defineProperty
    defineReactive(data, key, value) {
        //递归遍历对象中的子对象，如何为原型数据，则不执行，
        observe(value);
        let dep = new Dep(); //创建订阅者容器
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 判断是否存在订阅者
                if (Dep.target instanceof Watcher) dep.add(Dep.target); // 在这里添加一个订阅者 
                console.log("Dep",dep,Dep.target)
                return value;
            },
            set(newVal) {
                if (value === newVal) return;
                console.log('属性' + key + '已经被监听了，现在值为：“' + newVal.toString() + '”');
                value = newVal;
                dep.notify(); // 如果数据变化，通知所有订阅者
            }
        })
    }
}
//判断数据中的各数据类型 对象才执行
function observe(value, vm) {
    //如果为原始数据，则不执行
    if (!isObj(value)) return;
    new Observer(value);
};
//收集订阅者
function Dep() {
    this.subs = []; //订阅者list
}
Dep.prototype = {
    //添加
    add(sub) {
        this.subs.push(sub)
    },
    //通知
    notify() {
        this.subs.forEach(function (sub) {
            sub.update();
        });
    }
}
Dep.target = null;