export default {
  get UserToken() {
    return sessionStorage.getItem('token')
  },
  set UserToken(value) {
    sessionStorage.setItem('token', value)
  },
  crumbList: []
}
