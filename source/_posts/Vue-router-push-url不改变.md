---
title: 'Vue router.push(), url不改变'
date: 2020-08-27 00:42:02
tags:
- Vue
- Vue Router
categories:
- Vue.js
---
### 问题
this.$router.push()之后, url没有变化, 通过Vue-Devtools查看router, query参数已改变
<!-- more -->
直接上代码
```
changeSort(d) {
  console.log(d)
  let row = this.$route.query
  row.currentSort = JSON.stringify(d) // 相当于 this.$route.query.currentSort = JSON.stringify(d)
  this.$router
    .push({
      name: this.$route.name,
      params: this.$route.params,
      query: row
    })
    .then(
      val => {
        console.log(val);
      },
      error => {
        console.log(error);
      }
    );
}
```
更改之后的代码
```
changeSort(d) {
  console.log(d)
  let row = JSON.parse(JSON.stringify(this.$route.query));
  row.currentSort = JSON.stringify(d)
  this.$router
    .push({
      name: this.$route.name,
      params: this.$route.params,
      query: row
    })
    .then(
      val => {
        console.log(val);
      },
      error => {
        console.log(error);
      }
    );
}
```

### 出现问题原因
1. 由于JavaScript对象为引用类型, 
2. row.currentSort = JSON.stringify(d) // 相当于 this.$route.query.currentSort = JSON.stringify(d)
3. 调用router.push()Api判断路由对象相同, 所以不跳转
