---
title: '前端图片预览, formData对象发给后端'
date: 2020-08-30 11:11:13
tags:
- 图片预览
- base64
- formData
- 二进制流(binary)
categories:
- formData
- JavaScript
---

## 项目: Vue.js + Ant Design of Vue
### 需求
上传图片, 前端预览, 以二进制流文件发送给后端
<!-- more -->
## 思路
1. 图片对象写入formData对象
2. 图片对象转化成base64格式, 前端预览
3. axios发所formData对象给后端
#### 上代码
```
// 部分代码省略 update.vue
<template>
  <a-upload-dragger
    name="file"
    @change="handleChange"
    :beforeUpload="beforeUpload"
    accept=".jpg">
    <img :scr="previewImage" alt="就是一个input, type="file" 的组件>
  </a-upload-dragger>
</template>
<script>
  // 文件对象转化成Base64格式
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  created() {
    this.formData = new FormData()
  },
  methods: {
    handleChange(info) {
      this.formData.set('file', info.file)
      this.formData.set('index', 0)
    },
    beforeUpload(file) {
      file.preview = await getBase64(file)
      this.previewImage = file.preview
      return false
    },
    // 发给后端
    generateDesign() {
      this.loading = true
      axios
        .post('/api/....', this.formData)
        .then(res => {
          if (res.data.meta.status_code === 200) {
            const data = res.data.data || []
          } else {
            console.error(res.data.meta.message)
            this.$message.error(res.data.meta.message)
          }
        })
        .catch(error => {
          console.error(error.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
</script>
```

业务有变更, 要求在下个页面, 发送同样的请求
#### 思路
我需要保存图片到localStorage, 下个页面取出, 发给后端, 发现直接取到的图片对象(应该是一个路径)保存之后是一个空对象
思考中...
那我就保存图片的Base64格式, 下个页面取出转化成文件对象, 通过FormData 发送给后端
```
// update.vue
beforeUpload(file) {
  file.preview = await getBase64(file)
  this.previewImage = file.preview
  localStorage.setItem('file', this.previewImage)
  return false
},

// list.vue
created() {
  let file = localStorage.getItem('file')
  this.formData = this.dataURLtoFile(file)
  this.getList()
},

methods: {
  /**
 * @desc 将base64转换为文件对象
 */
  dataURLtoFile(dataurl) {
    // data:image/jpeg;base64,
    const arr = `${dataurl}`.split(',')
    console.log(arr)
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    let blob = new File([u8arr], 'file', {type: mime})
    const params = new FormData()
    params.append('file', blob)
    return params
  },
  getList() {
    let row = new FormData()
    row.append('file', this.formData.get('file'))
    axios
      .post('/api/....', row)
      .then(res => {
        if (res.data.meta.status_code === 200) {
          const data = res.data.data || []
        } else {
          console.error(res.data.meta.message)
          this.$message.error(res.data.meta.message)
        }
      })
      .catch(error => {
        console.error(error.message)
      })
      .finally(() => {
        this.loading = false
      })
  }

}
```
完
参考链接
https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input/file#attr-multiple
https://juejin.im/post/6844904173750714381#comment | base64与文件对象相互转换深入浅出 - 掘金