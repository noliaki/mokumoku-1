import * as functions from 'firebase-functions'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const post = functions.https.onRequest((req, res) => {
  console.log(req.body)
})
