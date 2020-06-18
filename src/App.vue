<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    //在页面加载的时候加载sessionStorage里面的状态信息
    if(sessionStorage.getItem("store")){
      this.$store.replaceState(Object.assign(this.$store.state,JSON.parse(sessionStorage.getItem("store"))));
    }
    //在页面刷新时讲Vuex里面的值保存到sessionStorage里面
    window.addEventListener("beforeunload",()=>{
      sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })


  }
}
</script>

<style>
  @import "assets/css/base.css";
</style>
