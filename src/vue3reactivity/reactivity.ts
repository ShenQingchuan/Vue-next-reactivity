import { UnwrapNestedRefs } from "./ref";


// WeakMaps that store {raw <-> observed} pairs.
const rawToReactive = new WeakMap<any, any>()  // 存放的是代理后的对象
const reactiveToRaw = new WeakMap<any, any>()  // 存放的是代理前的对象
const rawToReadonly = new WeakMap<any, any>()
const readonlyToRaw = new WeakMap<any, any>()

/**
 * Vue3 的响应式数据侦测主要基于
 * ECMAScript6 的 Proxy 对象
 */
export function fakeTrigger() {
  console.log("模拟触发视图更新..");
}

export function isObject(target: any) {
  return typeof target === 'object' && target !== null;
}

export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
/**
 * Q: ↑ 为什么要给 reactive这样的类型定义？
 * A: **为了让日后开发中** 通过 reactive(...) 返回的值仍是原来的类型
 * 
 * 例如 let p = reactive(obj), 原 obj 是 { name:"x_x", arr:[1,2,3] }
 * 那么接下来使用时仍然对 p.arr.push() 做良好的代码提示！
 */
export function reactive(target: object) {
  if(!isObject(target)) {
    return target;
  }
  // 如果代理表中已经存在了，就把这个结果返回
  let _reactive = rawToReactive.get(target);
  if (_reactive) {
    return _reactive;
  }
  // 如果该对象已经被代理过了，就直接返回该对象
  if (reactiveToRaw.get(target)) {
    return target;
  }
  const handlers: ProxyHandler<object> = {
    set(target, key, value, reciever) {
      // 如果修改的是私有属性，才触发更新事件
      // 屏蔽 Array.length 修改等...
      if (target.hasOwnProperty(key)) {
        fakeTrigger();
      }
      return Reflect.set(target, key, value, reciever);
    },
    get(target: any, key, reciever) {
      const result =  Reflect.get(target, key, reciever);
      if (isObject(target[key])) {
        // 递归挂载代理：
        return reactive(result);
      }
      return result;
    },
    deleteProperty(target, key) {
      return Reflect.deleteProperty(target, key)
    }
  }
  let observed = new Proxy(target, handlers);
  // 把原对象和代理后的对象 互相做表映射
  rawToReactive.set(target, observed);
  reactiveToRaw.set(observed, target);  
  return observed;
}

