<template>
  <router-view></router-view>
</template>

<script defer src="https://www.gstatic.com/firebasejs/7.0.0/firebase-app.js"></script>
<script defer src="https://www.gstatic.com/firebasejs/7.0.0/firebase-auth.js"></script>
<script defer src="https://www.gstatic.com/firebasejs/7.0.0/firebase-firestore.js"></script>

<script>
import Loading from 'vue-loading-overlay';
export default {
  name: 'App',
  data () {
    return {
      loading: true
    }
  },
  components: {Loading},
  created() {
    const currentUser = this.$firebase.auth().currentUser    
    const userId = currentUser != null ? currentUser.uid : "";
    this.$store.commit('defUserId', userId) 
  }
}
</script>

<style lang="scss">
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
