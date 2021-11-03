const app = require('firebase/app')
const auth = require('firebase/auth')
const admin = require('firebase-admin')

//client
const firebaseConfig = {
	apiKey: 'AIzaSyDyD3TTz97Za-dqiMHjg5Ju_qmAQtFMPOw',
	authDomain: 'dag-something.firebaseapp.com',
	projectId: 'dag-something',
	storageBucket: 'dag-something.appspot.com',
	messagingSenderId: '413309871260',
	appId: '1:413309871260:web:ad74056dbfb97387a8f959',
	measurementId: 'G-8JV2T3FJJF'
}

app.initializeApp(firebaseConfig)

//admin
var serviceAccount = require('./dag-sdk.json')
admin.initializeApp({credential: admin.credential.cert(serviceAccount)})

module.exports = { app, auth, admin }