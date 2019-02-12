import * as fs from 'fs'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as path from 'path'
import * as vision from '@google-cloud/vision'

enum Likelihood {
  UNKNOWN,
  VERY_UNLIKELY,
  UNLIKELY,
  POSSIBLE,
  LIKELY,
  VERY_LIKELY
}

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.resolve(__dirname, '../credential.json')
})

function faceDetection(data: string) {
  return client
    .faceDetection({
      image: {
        content: data
      }
    })
    .then(
      (results: any): void => {
        const faces = results[0].faceAnnotations

        console.log('Faces:')
        faces.forEach((face, i) => {
          console.log(face)
          console.log(`  Face #${i + 1}:`)
          console.log(`    Joy: ${Likelihood[face.joyLikelihood]}`)
          console.log(`    Anger: ${Likelihood[face.angerLikelihood]}`)
          console.log(`    Sorrow: ${Likelihood[face.sorrowLikelihood]}`)
          console.log(`    Surprise: ${Likelihood[face.surpriseLikelihood]}`)
        })

        return faces
      }
    )
}

export const post = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.set('Access-Control-Allow-Methods', 'POST')
  res.set('Access-Control-Allow-Headers', 'Content-Type')

  const request = {
    image: { content: req.body.base64 },
    features: [
      { type: 'FACE_DETECTION' },
      { type: 'IMAGE_PROPERTIES' }
    ]
  }

  client
    .annotateImage(request)
    .then(
      (results: any): void => {
        const faces = results[0].faceAnnotations

        console.log('Faces:')
        faces.forEach((face, i) => {
          console.log(face)
          console.log(`  Face #${i + 1}:`)
          console.log(`    Joy: ${Likelihood[face.joyLikelihood]}`)
          console.log(`    Anger: ${Likelihood[face.angerLikelihood]}`)
          console.log(`    Sorrow: ${Likelihood[face.sorrowLikelihood]}`)
          console.log(`    Surprise: ${Likelihood[face.surpriseLikelihood]}`)
        })

        res.status(200).end(
          JSON.stringify({
            message: 'ok',
            results
          })
        )
      }
    )
    .catch(error => {
      console.log('Error')
      console.log(error)
      res.status(200).end(
        JSON.stringify({
          message: 'ng',
          error
        })
      )
    })
})
