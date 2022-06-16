//解析dom树
/**
 * 
 * @param {*} selector 页面绑定页面的id
 * @param {*} vm selfVue实例
 */

function Compile(selector, vm) {
    this.vm = vm;
    this.el = document.querySelector(selector.el);
    this.vNodes = null; //虚拟dom
    this.init();
}
Compile.prototype = {
    /**
     * dom解释器初始化
     */
    init() {
        if (this.el) {
            this.vNodes = this.nodeToFragment(this.el);
            this.compileElement(this.vNodes);
            this.el.appendChild(this.vNodes)
        }
    },
    /**
     * 创建虚拟dom
     * @param {*} el 整个页面的dom对象
     */
    nodeToFragment(el) {
        var vNodes = document.createDocumentFragment();
        child = el.firstChild;
        while (child) {
            // 将Dom元素移入vNodes中
            vNodes.appendChild(child);
            child = el.firstChild;
        }
        return vNodes;
    },
    /**
     * 匹配{{}}的标签
     * @param {*} el 整个页面的dom对象
     */
    compileElement(el) {
        var childNodes = el.childNodes;
        var self = this;
        var reg = /\{\{\s*(.*?)\s*\}\}/;
        // 将dom转换为数组进行遍历解析
        Array.prototype.slice.call(childNodes, 0).forEach(function (node) {
            //匹配到的节点
            let text = node.textContent;
            if (self.isTextNode(node) && reg.test(text)) { // 判断是否是符合这种形式{{}}的指令
                //reg.exec(text)[1] 获取到需要取data中的哪个数据
                self.compileText(node, reg.exec(text)[1].trim(),text);
            }
            //判断node中还有没有子节点
            if (!!node.childNodes && !!node.childNodes.length) self.compileElement(node); // 继续递归遍历子节点
        });;
    },
    /**
     * 
     * @param {*} node 需要渲染或更新的节点
     * @param {*} exp 需要渲染的data中的哪个数据的keyName
     */
    compileText(node, exp,text) {
        var self = this;
        var initText = this.vm[exp]; //页面初始化获取初始值显示在页面上
        initText = text.replace(`{{${exp}}}`,initText)
        self.updateText(node, initText);
        // 在模版中每使用一个数据，都需要生成一个监听器
        // 当数据更新时，就会执行回调函数更新视图
        new Watcher(this.vm, exp, function (value) { // 生成订阅器并绑定更新函数
            value = text.replace(`{{${exp}}}`,value)
            self.updateText(node, value);
        })
    },
    /**
     * 
     * @param {*} node 节点
     * @param {*} value 渲染到节点的数据
     */
    updateText(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    },
    //判断节点是否为文本
    // nodeType === 3 :一个元素的文本内容 或属性
    isTextNode(node) {
        return node.nodeType == 3;
    }
}