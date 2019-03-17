import { h, Component } from 'preact';
import {route} from 'preact-router';
import style from './style';
import Head from '../head';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Loader from '../loader';
import store from '../toast/store';


class Card extends Component{
	constructor(props){
		super(props);
		this.handleLike=this.handleLike.bind(this);
		this.handleDelete=this.handleDelete.bind(this);
		this.setState(this.props);
		this.init();
	}

	handleLike(){
		if (firebase.auth().currentUser===null){
			route('/login');
			return;
		}
		this.setState({liked:!this.state.liked});
		let firestore = firebase.firestore();
		let docRef = firestore.doc("taglines/"+this.state.id+"/likes/"+firebase.auth().currentUser.uid);
		let batch =  firestore.batch();
		
		if (this.state.liked){
			batch.set(docRef,{
				time:Math.floor(Date.now()/1000)
			});
		}
		else {
			batch.delete(docRef);
		}
		
		batch.commit();
		
	}

	init(){
		
		this.setState({
			liked:false
		});
		
		let date=new Date((this.state.time*1000));
		let dateString=date.toLocaleString("en-us", {
			weekday:"short",
			day:"numeric",
			month: "long",
			year:"numeric",
			hour12:true,
			hour:"numeric",
			minute:"numeric",
			timeZoneName:"long",
			timeZone:"Asia/Kolkata"
		});
		this.setState({time:dateString,
			likesListener:firebase.firestore().collection("taglines/"+this.state.id+"/likes/").onSnapshot((data)=>{
			this.setState({likesCount:data.size});
			if (firebase.auth().currentUser){
				let currentUser = firebase.auth().currentUser.uid;
				data.forEach((d)=>{
					if (d.id===currentUser)
						this.setState({liked:true});
					
				});
			}
			
		})});
		
	}
	componentWillReceiveProps(newProps){
		this.state.likesListener();
		let newState = Object.assign({
			likesCount: null, 
			id:null,
			posted_by:null,
			poster_details:null,
			tagline:null,
			time:null,
			liked:false,
			likesListener:null
		},newProps); 
		this.setState(newState);
		this.init(); 
	}
	handleDelete(){
		firebase.firestore().doc("taglines/"+this.state.id).delete().then(()=>{
			store.dispatch({type: 'SET', text: 'Cleared it!..'});
			store.dispatch({ type: 'SHOW'});
			setTimeout(()=>{
				store.dispatch({ type: 'HIDE'});
			},3000);
		},()=>{
			store.dispatch({type: 'SET', text: 'Opps!.. Could not wipe that one'});
			store.dispatch({ type: 'SHOW'});
			setTimeout(()=>{
				store.dispatch({ type: 'HIDE'});
			},3000);
		});
	}
	render(){
		//console.log(this.props);
		let photoURL;
		let alt;
		if (this.state.poster_details){
			photoURL=this.state.poster_details.photoURL;
			alt=this.state.poster_details.displayName;
		}
		else{
			photoURL = "/assets/guest.png";
			alt = "Guest";
		}
		
		return (
			<div class={style.card}>
				<img src={photoURL} alt={alt}/>
				<div class={style.actions}>
					{firebase.auth().currentUser&&firebase.auth().currentUser.uid==this.state.posted_by?
					<i class={"fa fa-trash "+style.deleteMsg} onClick={this.handleDelete}/>
					:
					<img src={this.state.liked>0?"/assets/liked.png":"/assets/like.png"} onClick={this.handleLike}/>
					}
				</div>
				
				<div class={style.cardcontent}>
					<span class="text">{this.state.tagline}</span>
					<div class={style.report}>{this.state.likesCount?this.state.likesCount+" liked this":""}</div>
					<div class={style.time}>{this.state.time}</div>
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
		firebase.firestore().collection("taglines").orderBy("time","desc").onSnapshot((data)=>{
			let cards=[];
			//console.log("TAGLINE SNAPSHOT FIRED");
			data.forEach((doc)=>{
				//console.log("DOC OPEARTION");
				let docData = doc.data();
				
				docData['id']=doc.id;
				docData.likesCount=docData.likesCount||0;
				cards.push(docData);
				this.setState({cards});
			});
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
							this.state.cards.length>0?
								this.state.cards.sort((a,b)=>{
									//1,17,1
									let c=0;
									//c=17-1;16
									//	1-17=-16
									c=b.likesCount-a.likesCount;
									if (c===0)
										c=b.time-a.time;
									return c;
								}).map((data)=>{
									//console.log("CARD ("+data.likesCount+"): "+data.tagline);
									return <Card {...data}/>}):
								<Loader/>
						}
						
					</div>
				</div>
			</div>
		);
	}
}
