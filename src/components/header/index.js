import { h, Component } from 'preact';
import style from './style.less';
import { Match} from 'preact-router/match';
import * as firebase from 'firebase';
import {route} from 'preact-router';



export default class Header extends Component {
	constructor(props){
		super(props);
		firebase.auth().onAuthStateChanged((user)=>{
			this.setState({img:user?user.photoURL:null});
		});
	}
	goBack(){
		window.history.back();
	}
	handleProfile(){
		route('/profile');
	}
	render() {
		
		return (
			<div class={style.header}>
				<Match path="/">
					{
						({ matches }) => !matches && (<i class={"fa fa-chevron-left "+style.backButton} onClick={this.goBack} aria-hidden="true"/>)
					}
				</Match>
				Composite 2k18 <span class={style.small}>(insider)</span>
				{this.state.img?<img src={this.state.img} onClick={this.handleProfile}/>:""}
			</div>
		);
	}
}
