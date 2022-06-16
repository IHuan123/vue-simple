### vue双向绑定实现原理模仿(原生js实现)
- index 应用入口，执行应用初始化
- Observer 观察者，主要对数据的一个拦截
- Compile 主要生成VNode虚拟dom，解析模版，
- Watcher 订阅者，主要监听数据的变更，及时更新页面