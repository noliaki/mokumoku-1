import Vue from 'vue'

declare const process: any

const BASE_URL: string =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000'

Vue.prototype.$fetch = function(
  input: string | Request,
  init: any
): Promise<any> {
  return fetch(`${BASE_URL}${input}`, init).then(
    (res: Response): Promise<any> => res.json()
  )
}
