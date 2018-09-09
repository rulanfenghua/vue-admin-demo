<template>
    <div class="main-container">
        <top-aside/>
        <content/>
    </div>
</template>

<script>
import topAside from './topAside'
import content from './content'

export default {
    data() {
        return {}
    },
    components: {
        topAside,
        content
    }
}
</script>
