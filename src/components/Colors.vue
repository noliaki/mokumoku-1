<template lang="pug">
  .colors
    .colors__item(
      v-for="item in colors",
      :style="bgColor(item)"
    )
</template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters('results', ['colors'])
  },
  methods: {
    bgColor(item) {
      return {
        flexBasis: `${item.score * 100}%`,
        maxWidth: `${item.score * 100}%`,
        backgroundColor: `rgba(${item.color.red}, ${item.color.green}, ${
          item.color.blue
        }, 1)`
      }
    }
  }
})
</script>
<style lang="stylus" scoped>
.colors
  display flex
  justify-content center
  margin-top 60px

.colors__item
  flex-grow 1
  height 100px
</style>
