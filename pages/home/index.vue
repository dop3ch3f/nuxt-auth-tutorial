<template>
  <div>
    <h1>Home page</h1>
    <h1>Welcome {{ user }}</h1>
    <a-button type="primary" @click="logout">
      Logout
    </a-button>
  </div>
</template>

<script>
export default {
  computed: {
    user () {
      return this.$store.getters['auth/getUser']
    }
  },
  methods: {
    logout () {
      this.$store.commit('auth/setUser', '')
      this.$router.replace({ path: '/login' })
    }
  }
}
</script>
