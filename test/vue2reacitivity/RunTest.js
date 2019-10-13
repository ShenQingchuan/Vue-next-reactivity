// 定义我们的 MyVue 对象
var app = new MyVue({
    data: {
        test: "test-string",
        foo: {
            bar: "zzxx"
        }
    }
});
app.$data.test = "hello world!";
app.$data.foo.bar = "sing-dance-rap";