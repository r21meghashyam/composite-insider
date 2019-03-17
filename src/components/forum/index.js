import { h, Component } from 'preact';
import {route} from 'preact-router';
import style from './style';
import Head from '../head';
import * as firebase from 'firebase';
import 'firebase/firestore';

class Card extends Component{
	state={
		liked:false,
		likedCount:0
	}
	constructor(props){
		super(props);
		this.handleLike=this.handleLike.bind(this);
		firebase.firestore().collection("taglines/"+this.props.id+"/likes/").onSnapshot((data)=>{
			this.setState({likedCount:data.size});
			let currentUser = firebase.auth().currentUser.uid;
			data.forEach((d)=>{
				if (d.id===currentUser)
					this.setState({liked:true});
				
			});
			
		});
	}
	handleLike(){
		if (firebase.auth().currentUser===null){
			route('/login');
			return;
		}
		this.setState({liked:!this.state.liked});
		
		console.log(this.props.id);
		let firestore = firebase.firestore();
		let docRef = firestore.doc("taglines/"+this.props.id+"/likes/"+firebase.auth().currentUser.uid);
		let batch =  firestore.batch();
		console.log(docRef);
		if (this.state.liked){
			batch.set(docRef,{
				time:Math.floor(Date.now()/1000)
			});
		}
		else {
			batch.delete(docRef);
		}
		
		batch.commit().then((s)=>{
			console.log(s);
		},(f)=>{
			console.log(f);
		});
		
	}
	
	render(){
		//console.log(this.props);
		let photoURL = "/assets/guest.png";
		let alt = "Guest";
		if (this.props.poster_details){
			photoURL=this.props.poster_details.photoURL;
			alt=this.props.poster_details.displayName;
		}
		return (
			<div class={style.card}>
				<img src={photoURL} alt={alt}/>
				<div class={style.cardcontent}>
					<span class="text">{this.props.tagline}</span>
					<div class={style.report}>{this.state.likedCount?this.state.likedCount+" liked this":""}</div>
				</div>
				<div class={style.actions}>
					<img src={this.state.liked>0?"/assets/liked.png":"/assets/like.png"} onClick={this.handleLike}/>
				</div>
			</div>
		);
	}
}

export default class Tagline extends Component {
	state={
		posted:false,
		tagline:"",
		cards:[]
	}
	constructor(props){
		super(props);
		this.handlePost=this.handlePost.bind(this);
		this.handleInput=this.handleInput.bind(this);
		this.handleCheckbox=this.handleCheckbox.bind(this);
		//console.log(firebase);
		firebase.firestore().collection("taglines").orderBy("time","desc").onSnapshot((data)=>{
			//console.log(data);
			let cards=[];
			data.forEach((doc)=>{
				let docData = doc.data();
				docData['id']=doc.id;
				cards.push(docData);
				this.setState({cards});
			});
			this.setState({cards});
		},(err)=>{
			console.log(err);
		});
	}
	handlePost(){
		
		this.setState({posted:true});
		if (firebase.auth().currentUser===null)
			route('/login');
		else {
			let tagline=document.querySelector("[name=tagline]").value;
			let firestore = firebase.firestore();
			let data={
				tagline,
				'posted_by':firebase.auth().currentUser.uid,
				'time':Math.floor(Date.now()/1000)
			};
			if	(!this.state.hpd)
				data['poster_details']={
					name:firebase.auth().currentUser.displayName,
					photoURL:firebase.auth().currentUser.photoURL
				};
			firestore.collection("taglines").add(data).then(()=>{
				document.querySelector("[name=tagline]").value="";
			});
		}
	}
	handleInput(e){
		this.setState({[e.target.name]:e.target.value});
	}
	handleCheckbox(e){
		this.setState({[e.target.name]:e.target.checked});
	}
	render() {
		return (
			<div class="section">
				<div class={style.tagline}>
					<Head title="Taglines" img="/assets/taglines.png"/>
					<div class={style.list}>
					
						<div class={style.card}>
							<div class={style.group}>
								<input type="text" name="tagline" onChange={this.handleInput} required/>
								<span class={style.highlight}/>
								<span class={style.bar}/>
								<label>Give your suggestions</label>
							</div>
							<div>
								
								<input type="checkbox" id="hpd" name="hpd" onChange={this.handleCheckbox}/> <label for="hpd">Hide personal details</label>
								<button onClick={this.handlePost}>Post</button>
							</div>
						</div>
						
						{
							this.state.cards.map((data)=>
								<Card {...data}/>
							)
						}
						
					</div>
				</div>
			</div>
		);
	}
}
