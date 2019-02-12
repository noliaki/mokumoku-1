import firebase from 'firebase'
import { firebaseConfig } from '@@/credential.json'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
