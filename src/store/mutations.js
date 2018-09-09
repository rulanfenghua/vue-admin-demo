export default {
  LOGIN_IN(state, token) {
    state.UserToken = token
  },
  LOGIN_OUT(state) {
    state.UserToken = ''
  },
  setCrumbList(state, list) {
    state.crumbList = list
  }
}
