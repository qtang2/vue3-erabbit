export default {
  namespaced: true,
  state () {
    return {
      // user profile
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      redirectUrl: '/'
    }
  },
  mutations: {
    setUser (state, payload) {
      state.profile = payload
    },
    setRedirectUrl (state, url) {
      state.redirectUrl = url
    }

  }
}
