<template>
<body>
  <v-app id="inspire">
    <Navbar/>
    <router-view v-if="this.$store.state.authChecked"></router-view>
    <Footer/>

    <loading/>
    <notification/>

  </v-app>
</body>
</template>

<style>

</style>

<script>
/* eslint-disable */
import { mapState, mapActions } from 'vuex'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import VueAxios from 'vue-axios'
import loading from '@/components/loading.vue'
import notification from '@/components/notification.vue'

export default {
  name: 'App',
  data () {
    return {
    }
  },
  components:{
    Navbar, Footer, loading, notification
  },
  computed: {
  },
  methods: {

  },
  watch: {
    $route (to, from){
    }
  }
}
</script>
<style scoped>
body{
  width:100%;
  height: 100%;
}
</style>

