<template lang="pug">
  svg(:width="size", :height="size")
    polygon(:points="points", fill="#0af")
    text(
      v-for="(subject, index) in likelihoodKeys",
      :x="textPosition(index).x",
      :y="textPosition(index).y") {{ subject }}

</template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

enum Likelihood {
  UNKNOWN,
  VERY_UNLIKELY,
  UNLIKELY,
  POSSIBLE,
  LIKELY,
  VERY_LIKELY
}

export default Vue.extend({
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
      ],
      svgSize: 300
    }
  },
  computed: {
    faceAnnotations() {
      return (this as any).$store.getters['results/faceAnnotations']
    },
    points(): string {
      if (!this.faceAnnotations) return ''

      return this.likelihoodKeys.map((key, index) => {
        const level: number = Likelihood[this.faceAnnotations[key] as string]
        const angle = this.pieceOfAngle * index * this.ratio
        const x = Math.cos(angle) * level + this.radius
        const y = Math.sin(angle) * level + this.radius

        return `${x},${y}`
      }).join(' ')
    },
    ratio(): number {
      return Math.PI / 180
    },
    size(): number {
      return 300
    },
    radius(): number {
      return this.size / 2
    },
    pieceOfAngle(): number {
      return 360 / this.likelihoodKeys.length
    }
  },
  methods: {
    textPosition(index): { x: number, y: number } {
      const angle = (360 / this.likelihoodKeys.length) * index * this.ratio
      const x = Math.cos(angle) * this.radius + this.radius
      const y = Math.sin(angle) * this.radius + this.radius

      return {
        x,
        y
      }
    }
  }
})
</script>
