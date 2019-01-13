<template lang="pug">
  section.c-section
    h1.c-heading Cloud Vision
    div
      camera
</template>

<script lang="ts">
import Vue from 'vue'
import Camera from '~/components/Camera.vue'

export default Vue.extend({
  components: {
    Camera
  }
})
</script>
