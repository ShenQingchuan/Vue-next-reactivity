# Vue-next Reactivity 部分代码重现及理解

## 少说废话，让我先看看测试结果

少年这么心急嘛？那请确保你有完整的 `node.js >12`, `typescript 3.6+`，

另外推荐：`yarn 1.17+`, 使用 VSCode，并装好 `Code-Runner`插件。
打开项目，按右上角的 **运行小三角形**后，Fire it up！

另外在不编译打包 typescript 时，使用如下命令启动我写的测试：

```bash
# 使用 npm
npm run dev-test

# 使用 yarn
yarn dev-test
```

## 源自教程

👇戳这里了解更多！~

[【珠峰架构师】从零实现Vue3.0源码中的响应式实现原理](https://www.bilibili.com/video/av70281743?from=search&seid=9995224344828633568)

[【Vue 2.6.x Object.defineProperty 实现数据响应式的解析】](https://www.bilibili.com/video/av70436740/?p=30)

## 自己的思考与改动

首先源教程是只采用了 Javascript 书写，并没有实际尤雨溪大大转投 Typescript 的真心。

所以我这里结合教程的思路，并节选部分 [`vue-next`](https://github.com/vuejs/vue-next) 的相关源码。

具体目录在 **`vue-next 仓库的 /packages/reactivity/src/reactive.ts`**。

### 我都缩略了什么

> **读源码的核心思想是要：化繁为简、汲取己用！**
>
> 所以千万不要太过沉迷每一行代码哦~

由于本次实验的核心是：**探索 Vue-next 的数据响应式的核心思想**，
所以只是对 reactive 方法实现了个七七八八...

其实拜读了一下源码后你会发现，源码实现中还区分出了 **`readOnly`**、
把创建响应式对象也封装成了单独的函数。

### 读源码期间一个小心得

从之前的 **手写Redux** 到这个小实验，我深入读源码的经历真的很有限，
但跟着一些只用 JavaScript 实现的教程、你自己硬用 Typescript 跟着写，
并时时刻刻注意类型、你会收获很多！

在此期间你会发现，某个方法需要依赖什么、得到什么，进而理解这个方法是做什么的。
当然也多亏了 Visual Studio Code 强大的提示。

因而我能无伤地将一些关联的函数、声明迁移到我的项目中，且并不报错。

### 看完视频，请再自行实现一遍

> 实践是检验真理的唯一标准。

如果不自己尝试，哪怕我的注释写的再清楚，那也是我在对代码不断做出更改，
最后加上去的描述罢了。
