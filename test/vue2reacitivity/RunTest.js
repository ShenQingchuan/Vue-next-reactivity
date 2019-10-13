// 引入我们写的 Kue 对象
const Kue = require("../../src/vue2reactivity/Kue").Kue;

// 定义我们的 MyVue 对象
var app = new Kue({
    data() {
        return {
            test: "test-string",
            foo: {
                bar: "zzxx"
            }
        }
    }
});

app.$data.test = "hello world!";
app.$data.foo.bar = "sing-dance-rap";