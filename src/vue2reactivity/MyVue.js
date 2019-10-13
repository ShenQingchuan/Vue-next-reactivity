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

class MyVue {
    constructor(options) {
        this.$options = options;

        // 数据响应化
        this.$data = options.data;
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

        Object.defineProperty(obj, key, {
            get() {
                return val;
            },
            set(newVal) {
                if (newVal === val) {
                    return; // 数据不发生变化就不多做无用功
                }
                val = newVal;
                console.log(`触发了${key}的更新!~`); // ...触发一些更新操作
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

    addDependencies(dep) {          // 类似于 Redux 里的 subscribe
        this.deps.push(dep);
    }

    notify() {      // 类似于 Redux 里的 dispatch
        this.deps.array.forEach(element => {
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
        console.log("")
    }
}