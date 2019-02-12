<template lang="pug">
  .wrapper
    img(:src="base64")
    .screen-container
      .container.video-container(ref="container")
        video(ref="video", @loadedmetadata="onLoadedmetadata")
        canvas(ref="canvas", hide)
        .flash(ref="flash")
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
// import { TweenLite, CSSPlugin, Linear } from '~/plugins/gsap'

import firebase from '~/plugins/firebase'

// const gsapPlugins: any[] = [CSSPlugin]

declare const process: any

interface State {
  stream: undefined | MediaStream
  taken: boolean
  context: CanvasRenderingContext2D,
  base64: string
}

export default Vue.extend({
  data(): State {
    return {
      stream: undefined,
      taken: false,
      context: undefined,
      base64: ''
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

      // TweenLite.fromTo(
      //   this.$refs['flash'],
      //   1,
      //   {
      //     css: {
      //       opacity: 1
      //     },
      //     ease: Linear
      //   },
      //   {
      //     css: {
      //       opacity: 0
      //     }
      //   }
      // )
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
    },
    onLoadedmetadata(event): void {},
    getBase64(): string {
      const videoWidth: number = this.$refs['video'].clientWidth
      const videoHeight: number = this.$refs['video'].clientHeight

      this.$refs['canvas'].width = videoWidth
      this.$refs['canvas'].height = videoHeight
      this.context.clearRect(0, 0, videoWidth, videoHeight)
      this.context.drawImage(
        this.$refs['video'],
        0,
        0,
        this.$refs['video'].clientWidth,
        this.$refs['video'].clientHeight
      )

      return this.$refs['canvas'].toDataURL()
    },
    post(): void {
      this.base64 = this.getBase64()
      this.$fetch('/mokumoku-1/us-central1/post', {
        method: 'POST',
        // mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          base64: this.getBase64().replace(/^data:image\/png;base64,/, '')
        })
      })
      .then(console.log)
    }
  },
  async mounted(): Promise<void> {
    this.context = this.$refs['canvas'].getContext('2d')

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
.screen-container
  padding 20px 0
  background-color #F7F7F7

video
  display block
  max-width 100%
  margin auto
  transform scaleX(-1)

.screen-container
  position relative

.flash
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  background-color #fff
  opacity 0

.action
  margin-top 20px
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
