import runtime from 'offline-plugin/runtime';

runtime.install({
	// When an update is ready, tell ServiceWorker to take control immediately:
	onUpdateReady() {
		console.log('SW Event: Update Ready');
		window.localStorage.setItem('sw','new found');
		runtime.applyUpdate();
	},

	// Reload to get the new version:
	onUpdated() {
		console.log('SW Event: Updated');
		window.localStorage.setItem('time',Date.now());
		window.localStorage.setItem('sw','Updated');
		//window.location.reload();
	},

	onUpdating(){
		console.log('SW Event: Updating');
		window.localStorage.setItem('sw','Updating');
	  },
	onUpdateFailed(){
		window.localStorage.setItem('sw','Failed to update');
		console.log('SW Event: Update Failed');
	}
});
