<template>
   <div id="tab">
       <router-link to=""></router-link>
       <router-link to=""></router-link>
       <router-link to=""></router-link>
       <router-link to=""></router-link>
   </div>
</template>

<script>
import DynamicMenu from '@/components/dynamic-menu'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            isCollapse: true
        }
    },
    computed: {
        ...mapState(['isSidebarNavCollapse']),
        ...mapState('permission', ['sidebarMenu', 'currentMenu'])
    },
    methods: {},
    components: {
        DynamicMenu
    }
}
</script>
