/**
 *  希望用户 new Kue({
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

        new Compiler(options.el, this);

        // Life-cycle hooks:
        if(options.created) {
            options.created.call(this);
        }
    }

    observe(target) {
        // 如果不是对象就返回，说明不可被观察
        if (!isObject(target)) {
            return;
        }
        // 遍历该对象
        Object.keys(target).forEach((key) => {
            this.defineReactive(target, key, target[key]);

            // 代理 data 中的属性到 Kue 实例上
            this.proxyData(key);
        });
    }

    defineReactive(obj, key, val) {
        // 如果要绑定深层次的 obj 自然需要递归
        this.observe(val);

        const dep = new Dep();  // 为本对象创建一个用于收集依赖的盒子

        Object.defineProperty(obj, key, {
            get() {
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

    proxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key];
            },
            set(newVal) {
                this.$data[key] = newVal;
            }
        })
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
    constructor(vm, key, cb) {
        this.vm = vm;
        this.key = key;
        this.cb = cb;

        // 将当前 Watcher 实例指定到 Dep 静态属性 target 上
        Dep.target = this;
        this.vm[this.key];  // 触发 getter，添加依赖
        Dep.target = undefined;
    }

    update() {
        // 其实这里实际在 Vue 框架内可能是去更新 template 的相关内容...
        this.cb.call(this.vm, this.vm[this.key]);
    }
}

// CommonJS 导出
module.exports = {
    Kue,
    Dep,
    Watcher,
}