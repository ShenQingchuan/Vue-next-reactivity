const Kue = require('./Kue');
const Watcher = Kue.Watcher;

class Compiler {
    constructor(el, vm) {
        // 记录要遍历的宿主节点
        this.$el = document.querySelector(el);
        this.$vm = vm;

        // 编译
        if (this.$el) {
            // 先转换 内部内容为 Fragment，改动也不会影响页面内容
            this.$fragment = this.nodeToFragment(this.$el);
            // 执行编译
            this.compile(this.$fragment);
            // 因为我们刚才是单独将 文档内容取出（是真的拿走了），现在再顺次插回去
            this.$el.appendChild(this.$fragment);
        }
    }

    // 将宿主元素内部的结构片段拿出来遍历（比较高效(?)）
    nodeToFragment() {
        const fragment = document.createDocumentFragment();
        // 搬家操作：
        let child;
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    }

    compile(el) {
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            // 节点类型判断:
            if (this.isElement(node)) {
                
            } else if (this.isInterpolation(node)) {
                this.compileInterpolation(node);
            }
        });
    }

    isElement(node) {
        return node.nodeType === 1;
    }
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

    compileInterpolation(node) {
        this.updateSwitch(node, this.$vm, RegExp.$1, 'interpolation');
    }

    updateSwitch(node, vm, exp, directive) {
        // 用户可能采用 (1)插值表达式、(2)指令更新
        const updateFn = this[directive+'UpdateFn'];
        // 根据指令得到的 updateFn 来初始化
        updateFn && updateFn(node, vm[exp]);
        // 依赖收集
        new Watcher(vm, exp, (value) => {
            updateFn && updateFn(node, value);
        });

    }
    interpolationUpdateFn() {

    }
}


module.exports = {
    Compiler
}