import { h, Component } from 'preact';
import style from './style';
import * as firebase from 'firebase';
import store from '../toast/store';



export default class TagLine extends Component {
	constructor(props){
		super(props);
		
		
		
		firebase.auth().onAuthStateChanged((user)=> {
			
			if (user) {
				window.gtag('set', {'user_id': firebase.auth().currentUser.uid}); // Set the user ID using signed-in user_id.
				store.dispatch({type: 'SET', text: 'Successfully logged in :)'});
				setTimeout(()=>{
					store.dispatch({ type: 'HIDE'});
				},3000);
				window.history.back();
				
			}
		  });
	}
	loginFacebook(){
		store.dispatch({ type: 'SET',text:"Logging in using facebook..." });
		store.dispatch({ type: 'SHOW'});
		let provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope('user_likes');
		
		firebase.auth().signInWithPopup(provider).catch((err)=>{
			store.dispatch({ type: 'SET',text: "Some error occurred: "+err.message});
			setTimeout(()=>{
				store.dispatch({ type: 'HIDE'});
			},3000);
			
		});
		
	}
	loginGoogle(){
		store.dispatch({ type: 'SET',text:"Logging in using google..." });
		store.dispatch({ type: 'SHOW'});
		let provider =  new firebase.auth.GoogleAuthProvider();
		

		firebase.auth().signInWithPopup(provider).catch((err)=>{
			store.dispatch({ type: 'SET',text: "Some error occurred: "+err.message});
			setTimeout(()=>{
				store.dispatch({ type: 'HIDE'});
			},3000);
			
		});
		
	}
	loginTwitter(){
		store.dispatch({ type: 'SET',text:"Logging in using twitter..." });
		store.dispatch({ type: 'SHOW'});
		let provider =  new firebase.auth.TwitterAuthProvider();
		

		firebase.auth().signInWithPopup(provider).catch((err)=>{
			store.dispatch({ type: 'SET',text: "Some error occurred: "+err.message});
			setTimeout(()=>{
				store.dispatch({ type: 'HIDE'});
			},3000);
			
		});
		
	}
	loginGitHub(){
		store.dispatch({ type: 'SET',text:"Logging in using github..." });
		store.dispatch({ type: 'SHOW'});
		let provider =  new firebase.auth.GithubAuthProvider();
		firebase.auth().signInWithPopup(provider).catch((err)=>{
			store.dispatch({ type: 'SET',text: "Some error occurred: "+err.message});
			setTimeout(()=>{
				store.dispatch({ type: 'HIDE'});
			},3000);
			
		});
		
	}
	render() {
		return (
			<div class="section">
				<div class={style.login}>
					<h1>Select an account to login</h1>
					<i class="fa fa-facebook" aria-hidden="true" onClick={this.loginFacebook}/>
					<i class="fa fa-google" aria-hidden="true"  onClick={this.loginGoogle}/>
					<i class="fa fa-twitter" aria-hidden="true"  onClick={this.loginTwitter}/>
					
					<i class="fa fa-github" aria-hidden="true"  onClick={this.loginGitHub}/>
				</div>
			</div>
		);
	}
}
