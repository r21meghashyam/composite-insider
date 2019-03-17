import { h, Component } from 'preact';
import style from './style';
import * as firebase from 'firebase';
import store from '../toast/store';

export default class Profile extends Component {
	constructor(props){
		super(props);
		firebase.auth().onAuthStateChanged((user)=> {
			
			if (!user) {
			  window.history.back();
			}
		  });
	}
	handleLogOut(){
		firebase.auth().signOut().then(()=>{
			store.dispatch({type: 'SET', text: 'You have just logged out!'});
			store.dispatch({type:'SHOW'});
			setTimeout(()=>{
				store.dispatch({ type: 'HIDE'});
			},3000);
			window.history.back();
		});
	}
	render() {
		return (
			<div class="section">
				<div class={style.profile}>
					<img src={firebase.auth().currentUser.photoURL}/>
					
					<h1>{firebase.auth().currentUser.displayName}</h1>
					<button onClick={this.handleLogOut}>Log Out</button>
				</div>
			</div>
		);
	}
}
