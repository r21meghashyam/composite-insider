const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Listen for any change on document `marie` in collection `users`
exports.handleLikes = functions.firestore.document('{type}/{id}/likes/{ind}').onWrite((event) => {
	// ... Your code here
	
	let colRef = event.data.ref.parent;
	let docRef = colRef.parent;
	return colRef.onSnapshot((data)=>{
		return docRef.set({likesCount:data.size},{merge:true});
	});
});