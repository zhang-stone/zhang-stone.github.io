---
title: Vue多个子组件监听父组件事件
date: 2020-08-24 22:30:08
tags:
- Vue.js
- 组件
- 事件监听
categories:
- JavaScript
---

### 需要做一个标题吸顶的效果
在多个子组件中获取父组件DOM, 监听scroll事件
```
<!-- child.vue循环多个 -->
mounted() {
  // this.taskListApp 父组件实例
  let dom = this.taskListApp.$refs['task-content_scroll']
  dom.onscroll = () => {
    console.log('scoll')
    this.handlerScroll()
  }
}
```
只在最后一个组件中执行了一次? 为什么?
想到应该跟Vue.jsz=注册事件相关, 就改成下面的写法
```
let dom = this.taskListApp.$refs['task-content_scroll']
dom.addEventListener('scroll', () => {
  this.handlerScroll()
})
```

完美, 触发的多次. 但是为什么呢? 
去Vue,js文档看了一下注册事件相关的, 也没什么所以然.  又想到应该是事件注册方式的区边? 查了一下
addEventListener和on注册事件的区边? 
#### addEventListener
它允许给一个事件注册多个 listener
example:
```
<div class="box">ooxx</div>
```
```
window.onload = function(){
    var box = document.getElementById("box");
    box.onclick = function(){
        console.log("我是box1");
    }
    box.onclick = function(){
        box.style.fontSize = "18px";
        console.log("我是box2");
    }
}
// 运行结果：“我是box2”
```
 第二个onclick把第一个onclick给覆盖了
```
window.onload = function(){
    var box = document.getElementById("box");
    box.addEventListener("click",function(){
        console.log("我是box1");
    })
    box.addEventListener("click",function(){
        console.log("我是box2");
    })
}
运行结果：我是box1 我是box2
```
addEventListener可以多次绑定同一个事件并且不会覆盖上一个事件。
