// import 'promise-polyfill';
// import 'isomorphic-fetch';
import { h, render } from 'preact';
import './style';
import * as firebase from 'firebase';


let config = {
	apiKey: "AIzaSyCNYdzHLCF6DpfyfHsYSXyxHP_lf04ZnMg",
	authDomain: "composite2k18.firebaseapp.com",
	databaseURL: "https://composite2k18.firebaseio.com",
	projectId: "composite2k18",
	storageBucket: "composite2k18.appspot.com",
	messagingSenderId: "704199144768"
};

firebase.initializeApp(config);

// messaging.requestPermission()
// .then(function() {
//   console.log('Notification permission granted.');
//   // TODO(developer): Retrieve an Instance ID token for use with FCM.
//   // ...
// })
// .catch(function(err) {
//   console.log('Unable to get permission to notify.', err);
// });


let root;
function init() {
	let App = require('./components/app').default;
	root = render(<App />, document.body, root);
}

// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV==='production') {
	require('./pwa');
}

// in development, set up HMR:
if (module.hot) {
	//require('preact/devtools');   // turn this on if you want to enable React DevTools!
	module.hot.accept('./components/app', () => requestAnimationFrame(init) );
}

init();
