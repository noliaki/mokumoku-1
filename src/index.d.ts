declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*\/firebase' {
  import firebase from 'firebase'
  export default firebase
}

declare module '*\/plugins\/gsap' {
  import * as gsap from 'gsap'
  export default gsap
}
