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
    nodeToFragment(el) {
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
                console.log("[Kue Compiler:] 编译元素<"+node.nodeName+">");
                // 对元素要访问其所有属性 attr
                const nodeAttrs = node.attributes;
                Array.from(nodeAttrs).forEach(attr => {
                    const attrName = attr.name;         // 属性名
                    const directive_val = attr.value;   // 属性值
                    if (this.isDirective(attrName)) {
                        // 例如 k-text
                        const dirc = attrName.substring(2);
                        // 执行指令对应的 UpdateFn
                        this[dirc] && this[dirc](node, this.$vm, directive_val);
                    } else if (this.isEvent(attrName)) {
                        let givenFnName = attrName.substring(1);
                        this.eventHandler(node, this.$vm, directive_val, givenFnName);
                    }
                })
            } else if (this.isInterpolation(node)) {
                this.compileInterpolation(node);
            }

            // 递归子节点
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node);
            }
        });
    }

    isElement(node) {
        return node.nodeType === 1;
    }
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }
    isDirective(attr) {
        return attr.indexOf("k-") === 0;
    }
    isEvent(attr) {
        return attr.indexOf("@") === 0;
    }

    compileInterpolation(node) {
        this.updateSwitch(node, this.$vm, RegExp.$1, 'interpolation');
    }

    updateSwitch(node, vm, expOrText, directive) {
        // 用户可能采用 (1)插值表达式、(2)指令更新
        const updateFn = this[directive+'UpdateFn'];
        // 根据指令得到的 updateFn 来初始化
        if (vm[expOrText] && updateFn) {
            updateFn(node, vm[expOrText]);
        } else {
            updateFn(node, expOrText);
        }
        // 依赖收集
        new Watcher(vm, expOrText, function(value) {
            updateFn && updateFn(node, value);
        });

    }
    interpolationUpdateFn(node, value) {
        // console.log("[Kue Compiler:] 更新插值表达式值...");
        node.textContent = value;
    }
    textUpdateFn(node, value) {
        // console.log("[Kue Compliler:] 更新text文本内容...");
        node.textContent = value;
    }
    // 以下是与 k- 指令名字对应的入口函数
    text(node, vm, expOrText) {
        this.updateSwitch(node, vm, expOrText, "text");
    }

    // 事件处理器
    eventHandler(node, vm, exp, dirc) {
        let fn = vm.$options.methods && vm.$options.methods[exp];
        if (dirc && fn) {
            node.addEventListener(dirc, fn.bind(vm));
            // Q: 为什么要用 .bind()
            // A: 为了让编程者在 methods 里的函数内可以使用 this 指向 Kue 实例
        }
    }
}

// CommonJS 导出
module.exports = {
    Compiler
}