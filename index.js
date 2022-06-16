     /**
     * vue双向绑定原理实现 参考（https://www.cnblogs.com/canfoo/p/6891868.html）
     * @param {*} options selfVue构造函数配置参数
     */
    let uid = 0
    function SelfVue(options) {
        let self = this;
        const vm = this;
        vm._uid = uid++
        this.data = options.data;
        if(isObj(this.data)){
            Object.keys(this.data).forEach(function (key) {
                self.proxyKeys(key);
            })
            new Observer(this.data); //监听data中所有数据
        }
        new Compile(options, vm);//使用new时 this为Compile
        return this;
    }
    /**
     * 没有这步需要使用selfVue.data.xxx修改值 需要添加data的代理
     * @param {*} key data访问属性名
     */
    SelfVue.prototype.proxyKeys = function (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false, //是否能枚举
            configurable: true,
            get: function proxyGetter() {
                return self.data[key];
            },
            set: function proxySetter(newVal) {
                self.data[key] = newVal;
            }
        });
    }