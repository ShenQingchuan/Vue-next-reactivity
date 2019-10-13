/**
 *  希望用户 new MyVue({
 *      data: {
 *          ...
 *      }
 *  });
 */
// @vue/share
function isObject(target) {
    return (typeof target === "object") && target !== null;
}

class Kue {
    constructor(options) {
        this.$options = options;

        // 数据响应化
        this.$data = options.data();
        this.observe(this.$data);
    }

    observe(target) {
        // 如果不是对象就返回，说明不可被观察
        if (!isObject(target)) {
            return;
        }
        // 遍历该对象
        const self = this;
        Object.keys(target).forEach(function (key) {
            self.defineReactive(target, key, target[key]);
        });
    }

    defineReactive(obj, key, val) {
        // 如果要绑定深层次的 obj 自然需要递归
        this.observe(val);

        const dep = new Dep();  // 为本对象创建一个用于收集依赖的盒子

        Object.defineProperty(obj, key, {
            get() {
                // 一旦发现被调用，触发 getter 就添加一个监听订阅者
                // 接下来的代码会把自己 push 进本对象的 dep 里
                new Watcher();
                // && 表达式 先走左边，如果左边已经是 false 就不执行右边
                // Dep 当前已经没有 target 则无需添加依赖
                // 以下这是一种 Hack 写法，可以学一下：
                Dep.target && dep.addDependency(Dep.target);
                return val;
            },
            set(newVal) {
                if (newVal === val) {
                    return; // 数据不发生变化就不多做无用功
                }
                val = newVal;
                
                // 更新数据后立刻通知所有依赖
                dep.notify();
            }
        });
    }
}


// Dep: 用来管理 Watcher订阅者
class Dep {
    constructor() {
        // 这里存放若干依赖 (一个watcher 对应一个属性)
        this.deps = [];
    }

    addDependency(dep) {          // 类似于 Redux 里的 subscribe
        this.deps.push(dep);
    }

    notify() {      // 类似于 Redux 里的 dispatch
        this.deps.slice().forEach(dep => {
            dep.update();
        });
    }
}

class Watcher {
    constructor() {
        // 将当前 Watcher 实例指定到 Dep 静态属性 target 上
        Dep.target = this;
    }

    update() {
        // 其实这里实际在 Vue 框架内可能是去更新 template 的相关内容...
        console.log("更新渲染 template ..");
    }
}

// CommonJS 导出
module.exports = {
    Kue,
    Dep,
    Watcher,
}