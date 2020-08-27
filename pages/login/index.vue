<template>
  <div>
    <h1>Login</h1>
    <a-input v-model="username" placeholder="Input your username to login" />
    <a-button type="primary" @click="login">
      Login
    </a-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: ''
    }
  },
  methods: {
    login () {
      this.$store.commit('auth/setUser', this.username)
      this.$router.push({ path: '/home' })
    }
  }
}
</script>
