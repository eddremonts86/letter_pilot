import { createStore } from 'vuex'
 export default createStore({
  state () {
    return {
      token: ''
    }
  },
  mutations: {
    updateToken (state, token) {
      state.token = token
    }
  },
})

