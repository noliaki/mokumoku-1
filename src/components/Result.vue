<template lang="pug">
  .result(v-if="result")
    likelihood
    colors
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import likelihood from '~/components/Likelihood.vue'
import colors from '~/components/Colors.vue'

export default Vue.extend({
  components: {
    likelihood,
    colors
  },
  computed: {
    ...mapState('results', ['result'])
  }
})
</script>
