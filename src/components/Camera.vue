<template lang="pug">
  div
    .screen-container
      video(ref="video")
      .screen-container__flash(ref="flash")
    .action
      button.btn-shoot(
        type="button",
        :class="btnClass",
        @click.prevent="taken ? onRetake() : onTake()")
      button.btn-post(
        type="button",
        :class="btnPostClass",
        @click.prevent="post") POST
</template>
<script lang="ts">
import Vue from 'vue'
import TweenLite from 'gsap/TweenLite'
import CSSPlugin from 'gsap/CSSPlugin'
import { Linear } from 'gsap/EasePack'

const gsapPlugins: any[] = [CSSPlugin]

declare const process: any

interface State {
  stream: undefined | MediaStream
  taken: boolean
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
}

export default Vue.extend({
  data(): State {
    return {
      stream: undefined,
      taken: false,
      canvas: undefined,
      context: undefined
    }
  },
  computed: {
    btnClass(): { [key: string]: boolean } {
      return {
        'is-retake': this.taken
      }
    },
    btnPostClass(): { [key: string]: boolean } {
      return {
        'should-show': this.taken
      }
    }
  },
  watch: {
    taken(next, prev): void {
      if (!next) {
        return
      }

      TweenLite.fromTo(
        this.$refs['flash'],
        1,
        {
          css: {
            opacity: 1
          },
          ease: Linear
        },
        {
          css: {
            opacity: 0
          }
        }
      )
    }
  },
  methods: {
    onTake(): void {
      console.log('onTake')
      this.$refs['video'].pause()
      this.taken = true
    },
    onRetake(): void {
      this.$refs['video'].play()
      this.taken = false
    },
    getmediaDeviceInfos(): Promise<MediaDeviceInfo[]> {
      return navigator.mediaDevices
        .enumerateDevices()
        .then(
          (mediaDevicesInfo: MediaDeviceInfo[]): MediaDeviceInfo[] =>
            mediaDevicesInfo
        )
    },
    getUserVideoStream(videoDeviceId: string): Promise<MediaStream> {
      return navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            deviceId: videoDeviceId
          }
        })
        .then(stream => stream)
    },
    startShooting(): void {
      if (this.$refs['video'].mozSrcObject !== undefined) {
        this.$refs['video'].mozSrcObject = this.stream
      } else if (this.$refs['video'].srcObject !== undefined) {
        this.$refs['video'].srcObject = this.stream
      } else {
        this.$refs['video'].src = this.stream
      }

      this.$refs['video'].play()
    }
  },
  created(): void {
    if (process.client) {
      this.canvas = document.createElement('canvas')
      this.context = this.canvas.getContext('2d')
    }
  },
  async mounted(): Promise<void> {
    const devicesInfo:
      | MediaDeviceInfo[]
      | void = await this.getmediaDeviceInfos().catch(error =>
      console.log(error)
    )
    if (!devicesInfo) {
      return
    }

    const videInput: MediaDeviceInfo = devicesInfo.filter(
      (info: MediaDeviceInfo): boolean => info.kind === 'videoinput'
    )[0]
    if (!videInput) {
      return
    }

    this.stream = await this.getUserVideoStream(videInput.deviceId).catch(
      error => console.log(error)
    )
    if (!this.stream) {
      return
    }

    this.startShooting()
  }
})
</script>
<style lang="stylus" scoped>
video
  display block
  max-width 100%
  margin auto
  transform scaleX(-1)

.screen-container
  position relative

.screen-container__flash
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  background-color #fff
  opacity 0

.action
  position relative

$btn-size = 50px

button
  display block
  height $btn-size
  border-radius $btn-size

.btn-shoot
  position relative
  width $btn-size
  margin 0 auto
  background-color #898989

  &::before
    content ''
    position absolute
    display block
    top 0
    right 0
    bottom 0
    left 0
    margin 2px
    border-radius $btn-size
    border 2px solid #ffffff

.btn-post
  overflow hidden
  display flex
  justify-content center
  align-items center
  width 0
  margin 20px auto 0
  color #fff
  font-weight bold
  background-color #4A1840
  transition width 450ms cubic-bezier(0.645, 0.045, 0.355, 1)
  pointer-events none

  &.should-show
    width $btn-size * 2.5
    pointer-events auto
</style>
