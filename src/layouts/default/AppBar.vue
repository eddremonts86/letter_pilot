<template>
  <v-app-bar flat density="compact" >
    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-4" />
        Letter Pilot
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <auth  />
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import auth from '@/components/auth.vue'
export default defineComponent({
  name: 'HelloWorld',
  components: {
    auth
  },
})
</script>
