<template>
    <div class="main-container">
        <top-aside/>
        <main-content/>
    </div>
</template>

<script>
import topAside from './topAside'
import mainContent from './mainContent'

export default {
  data() {
    return {}
  },
  components: {
    topAside,
    mainContent
  }
}
</script>
