<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，页面不存在</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  padding: 40px;
  text-align: center;
}

h1 {
  font-size: 72px;
  color: #666;
}

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style> 