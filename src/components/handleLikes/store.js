import { createStore } from 'redux';

function counter(state ={}, action) {
	console.log(state);
	switch (action.type) {
		case 'SET':
			state.text=action.text;
			return state;
		case 'SHOW':
			state.show=true;
			return state;
		case 'HIDE':
			state.show=false;
			return state;
		default:
			return state;
	}
}

let store = createStore(counter);

export default store;