import { reactive } from "../src/reactivity";

// test 1
// 测试 reactive 的基本使用
console.log("\n# Run test (1): ");
let TestObj = {
  name: "vue-next",
  arr: [6, 9, 1]
}
console.log("Start: 刚开始时的 TestObj ->", TestObj);
let reactive_obj1 = reactive(TestObj);
reactive_obj1.name = "vue-3";
console.log("End: 修改后的 TestObj ->", TestObj);

// test 2
// 测试 reactive 对数组的适用性
// (因为 Proxy 对象本身是默认支持数组的)
console.log("\n# Run test (2): ");
let test_arr = [0, 4, 5];
console.log("Start: 刚开始时的 test_arr ->", test_arr);
let reactive_obj2 = reactive(test_arr);
reactive_obj2.push(4);
console.log("End: 修改后的 test_arr ->", test_arr);

/**
 * 所以看到这里你大概已经有些感觉了：
 * reactive 中既然使用了 Proxy，就相当于给某个对象 obj 挂了一个代理，
 * 但是如果去操作其属性，例如 obj.arr，时不会更新的。
 * 
 * 也就是说：代理挂载 **并不是向下传递** 的！
 * 
 * 而我们对此作出了调整，修复了这一情况。
 */
// test 3
// 测试深层次代理的挂载成功与否
console.log("\n# Run test (3): ");
let test_obj3 = {
    name: "test-3",
    array: ["string", "888", "7yus%$879#ll"]
}
console.log("Start: 刚开始时的 test_obj3 ->", test_obj3);

let reactive_obj3 = reactive(test_obj3);
reactive_obj3.array.push("00-22-fc-1a");
console.log("End: 修改后的 test_obj3 ->", test_obj3);


/**
 * 进一步改进：
 * 为了避免某一个对象被多次反复代理
 * 我们使用 WeakMap 来缓存记忆它
 * ----------------------------
 * 我们做一个极端测试，反复对一个对象使用 reactive 方法
 */
// test 4
console.log("\n# Run test (4): ");
let test_obj4 = {
    name: "test-4",
    sub: [992,7, 12]
}
console.log("Start: 刚开始时的 test_obj4 ->", test_obj4);

let reactive_obj4 = reactive(test_obj4);
reactive_obj4 = reactive(test_obj4);
reactive_obj4 = reactive(test_obj4);
reactive_obj4 = reactive(test_obj4);
// 看看是不是会反复触发 trigger
reactive_obj4.sub.push(1414);
console.log("End: 刚开始时的 test_obj4 ->", test_obj4);

// (可见只触发了一次)