<template lang="pug">
  svg(:width="size", :height="size")
    polygon(:points="points", fill="#0af")
    circle(
      v-for="index in likelihoodLevels",
      :cx="halfSize",
      :cy="halfSize",
      :r="index * (halfSize / likelihoodLevels)",
      fill="transparent",
      stroke="#000",
      stroke-width="1"
    )
    line(
      v-for="(item, key, index) in likelihoodKeys",
      :x1="halfSize",
      :y1="halfSize",
      :x2="textPosition(index).x",
      :y2="textPosition(index).y",
      stroke="#000",
      stroke-width="1"
    )
    text(
      v-for="(subject, key, index) in likelihoodKeys",
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

interface State {
  likelihoodKeys: { [key: string]: string }
  svgSize: number
  likelihoodLevels: number
  $store?: any
  faceAnnotations?: any
}

export default Vue.extend({
  data(): State {
    return {
      likelihoodKeys: {
        joyLikelihood: 'joy',
        sorrowLikelihood: 'sorrow',
        angerLikelihood: 'anger',
        surpriseLikelihood: 'surprise',
        underExposedLikelihood: 'exposed',
        blurredLikelihood: 'blurred',
        headwearLikelihood: 'headwear'
      },
      svgSize: 300,
      likelihoodLevels: Object.keys(Likelihood).length / 2 - 1
    }
  },
  computed: {
    faceAnnotations() {
      return (this as any).$store.getters['results/faceAnnotations']
    },
    points(): string {
      const self: any = this as any
      if (!self.faceAnnotations) return ''

      return Object.keys(self.likelihoodKeys)
        .map(
          (key, index): string => {
            const level: number =
              Likelihood[self.faceAnnotations[key] as string]
            console.log(level)
            const angle: number = self.pieceOfAngle * index * self.ratio
            const x: number =
              Math.cos(angle) *
                (level / self.likelihoodLevels) *
                self.halfSize +
              self.halfSize
            const y: number =
              Math.sin(angle) *
                (level / self.likelihoodLevels) *
                self.halfSize +
              self.halfSize

            return `${x},${y}`
          }
        )
        .join(' ')
    },
    ratio(): number {
      return Math.PI / 180
    },
    size(): number {
      return 300
    },
    halfSize(): number {
      return (this as any).size / 2
    },
    pieceOfAngle(): number {
      return 360 / (this as any).keysLen
    },
    keysLen(): number {
      return Object.keys((this as any).likelihoodKeys).length
    }
  },
  methods: {
    textPosition(index): { x: number; y: number } {
      const self: any = this as any

      const angle = (360 / self.keysLen) * index * self.ratio
      const x = Math.cos(angle) * self.halfSize + self.halfSize
      const y = Math.sin(angle) * self.halfSize + self.halfSize

      return {
        x,
        y
      }
    }
  }
})
</script>
<style lang="stylus" scoped>
svg
  overflow visible
  margin 60px auto 0
  display block
circle
line
  opacity 0.2
</style>
