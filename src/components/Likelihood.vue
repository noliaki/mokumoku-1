<template lang="pug">
  svg(width="120" height="120")
    polygon(:points="points", fill="#0af")

</template>
<script lang="ts">
import Vue from 'vue'

enum Likelihood {
  UNKNOWN,
  VERY_UNLIKELY,
  UNLIKELY,
  POSSIBLE,
  LIKELY,
  VERY_LIKELY
}

export default Vue.extend({
  props: ['likelihoodData'],
  data() {
    return {
      likelihoodKeys: [
        'joyLikelihood',
        'sorrowLikelihood',
        'angerLikelihood',
        'surpriseLikelihood',
        'underExposedLikelihood',
        'blurredLikelihood',
        'headwearLikelihood'
      ]
    }
  },
  computed: {
    points(): string {
      if (!this.likelihoodData) return ''

      return this.likelihoodKeys.map((key, index) => {
        const level = Likelihood[this.likelihoodData[key]]
        console.log(level)
        const angle = (this.likelihoodKeys.length / 360) * index * this.radius
        const x = Math.cos(angle) * this.vol + 60
        const y = Math.sin(angle) * this.vol + 60

        return `${x},${y}`
      }).join(' ')
    },
    radius(): number {
      return Math.PI / 180
    },
    vol(): number {
      return 60
    }
  }
})
</script>
