<!-- src/components/HelloWorld.vue -->
<template>
  <div>
    <h1>{{ msg }}</h1>
    <p>这是一个示例组件 HelloWorld。</p>
  </div>
</template>

<script setup>
defineProps({
  msg: {
    type: String,
    default: 'Hello Vue'
  }
})
</script>

<style scoped>
h1 {
  font-size: 24px;
}
</style>
