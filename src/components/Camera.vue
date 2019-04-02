<template lang="pug">
  .wrapper
    div
      img(:src="base64", alt="")
    .screen-container
      transition(name="fade")
        .container.video-container(ref="container", v-show="isVideoReady")
          video(ref="video", @loadedmetadata="onLoadedmetadata")
          canvas(ref="canvas")
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
    result
</template>
<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { mutationType } from '~/store/results'
import result from '~/components/Result.vue'

declare const process: any
declare const TweenLite: any
declare const Linear: any

interface State {
  stream: undefined | MediaStream
  taken: boolean
  context: undefined | CanvasRenderingContext2D
  base64: string
  isVideoReady: boolean
}

export default Vue.extend({
  components: {
    result
  },
  data(): State {
    return {
      stream: undefined,
      taken: false,
      context: undefined,
      base64: '',
      isVideoReady: false
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
    ...mapMutations('results', [mutationType.SET_RESULT]),
    onTake(): void {
      console.log('onTake')
      const videoEl: HTMLVideoElement = this.$refs['video'] as HTMLVideoElement
      videoEl.pause()
      this.taken = true
    },
    onRetake(): void {
      const videoEl: HTMLVideoElement = this.$refs['video'] as HTMLVideoElement
      videoEl.play()
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
      const videoEl: any = this.$refs['video'] as HTMLVideoElement

      if (videoEl.mozSrcObject !== undefined) {
        videoEl.mozSrcObject = this.stream
      } else if (videoEl.srcObject !== undefined) {
        videoEl.srcObject = this.stream
      } else {
        videoEl.src = this.stream
      }

      return videoEl.play()
    },
    onLoadedmetadata(event): void {
      console.log(event)
    },
    getBase64(): string {
      const videoEl: HTMLVideoElement = this.$refs['video'] as HTMLVideoElement
      const canvasEl: HTMLCanvasElement = this.$refs['canvas'] as HTMLCanvasElement

      const videoWidth: number = videoEl.clientWidth
      const videoHeight: number = videoEl.clientHeight

      canvasEl.width = videoWidth
      canvasEl.height = videoHeight

      if (!this.context) {
        return ''
      }

      this.context.clearRect(0, 0, videoWidth, videoHeight)
      this.context.drawImage(
        videoEl,
        0,
        0,
        videoEl.clientWidth,
        videoEl.clientHeight
      )

      return canvasEl.toDataURL()
    },
    post(): void {
      const uri: string = process.env.NODE_ENV === 'production' ? '/mokumoku-1/us-central1/post' : '/sample.json'
      const option = process.env.NODE_ENV === 'production' ?
        {
          method: 'POST',
          // mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({
            base64: this.getBase64().replace(/^data:image\/png;base64,/, '')
          })
        } :
        {
          method: 'GET',
          // mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          }
        }

      this.base64 = this.getBase64()
      fetch(uri, option)
        .then(res => res.json())
        .then(json => {
          this[mutationType.SET_RESULT](json.results[0])
        })
    },
    drawBoundingRect(): void {
      const vertices: {x: number, y: number}[] = this.$store.getters['results/boundingVertices']

      if (!this.context) return

      this.context.beginPath()

      this.context.lineWidth = 9
      this.context.strokeStyle = '#0af'

      vertices.forEach((point: {x: number, y: number}, index: number): void => {
        if (!this.context) return

        console.log(point)

        if (index === 0) {
          this.context.moveTo(point.x, point.y)
        } else {
          this.context.lineTo(point.x, point.y)
        }
      })

      this.context.closePath()
      this.context.stroke()
    }
  },
  async mounted() {
    this.context = (this.$refs['canvas'] as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D

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
    ) as MediaStream

    if (!this.stream) {
      return
    }

    await this.startShooting()

    this.isVideoReady = true
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

.fade-enter
.fade-leave-to
  opacity 0
.fade-enter-to
.fade-leave
  opacity 1

.fade-enter-active
.fade-leave-active
  transition opacity 300ms linear
</style>
