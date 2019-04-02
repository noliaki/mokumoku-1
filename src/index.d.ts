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

declare module '~\/store\/*' {
  import vuex from 'vuex'
  export const mutationType: any
  export default vuex
}
