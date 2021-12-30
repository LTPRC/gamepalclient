<template>
  <div id="app">
    <router-view/>
    <div id="bottom_layer" class="s-bottom-layer s-isindex-wrap">
       <div class="s-bottom-layer-content">
        <p class="lh"><a class="text-color" href="//home.baidu.com" target="_blank">关于百度</a></p>
        <p class="lh"><a class="text-color" href="http://ir.baidu.com" target="_blank">About Baidu</a></p>
        <p class="lh"><a class="text-color" href="//www.baidu.com/duty" target="_blank">使用百度前必读</a></p>
        <p class="lh"><a class="text-color" href="//help.baidu.com" target="_blank">帮助中心</a></p>
        <p class="lh"><a class="text-color" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11000002000001" target="_blank">京公网安备11000002000001号</a></p>
        <p class="lh"><a class="text-color" href="https://beian.miit.gov.cn" target="_blank">京ICP证030173号</a></p>
        <p class="lh"><span class="text-color">&copy;2021&nbsp;Baidu&nbsp;</span></p>
        <p class="lh"><span class="text-color">互联网药品信息服务资格证书 (京)-经营性-2017-0020</span></p>
        <p class="lh"><a class="text-color" href="//www.baidu.com/licence/" target="_blank">信息网络传播视听节目许可证 0110516</a></p>
       </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: -10px;
}
#bottom_layer {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 20px;
    padding-top: 0px;
    overflow: hidden;
    zoom: 1;
    margin: 0;
    line-height: 20px;
    background: #000;
}
#bottom_layer .lh {
    display: inline;
    margin-right: 20px;
    font-size:12px;
}
</style>
