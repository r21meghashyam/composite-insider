import { h, Component } from 'preact';
import {route} from 'preact-router';
import style from './style';
import Head from '../head';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Loader from '../loader';
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
		let docRef = firestore.doc("logos/"+this.props.id+"/likes/"+firebase.auth().currentUser.uid);
		let batch =  firestore.batch();
	
		if (this.state.liked){
			batch.set(docRef,{
				time:Math.floor(Date.now()/1000)
			});
		}
		else {
			batch.delete(docRef);
		}
		
		batch.commit().then();
		
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
			likesListener:firebase.firestore().collection("logos/"+this.state.id+"/likes/").onSnapshot((data)=>{
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
		firebase.firestore().doc("logos/"+this.state.id).delete().then(()=>{
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
				<div class={style.actions}>
					{firebase.auth().currentUser&&firebase.auth().currentUser.uid==this.state.posted_by?
					<i class={"fa fa-trash "+style.deleteMsg} onClick={this.handleDelete}/>
					:
					<img src={this.state.liked>0?"/assets/liked.png":"/assets/like.png"} onClick={this.handleLike}/>
					}
				</div>
				<img src={photoURL} alt={alt}/>
				<div class={style.cardcontent}>
					<img src={this.state.url}/>
					<div class={style.cardcontent}>
						<span class="text">{this.state.tagline}</span>
						<div class={style.report}>{this.state.likesCount?this.state.likesCount+" liked this":""}</div>
						<div class={style.time}>{this.state.time}</div>
					</div>
				</div>
				
			</div>
		);
	}
}

export default class Themes extends Component {
	state={
		posted:false,
		themes:"",
		cards:[]
	}
	constructor(props){
		super(props);
		this.handleUpload=this.handleUpload.bind(this);
		this.handleFile=this.handleFile.bind(this);
		this.handleCheckbox=this.handleCheckbox.bind(this);
		//console.log(firebase);
		firebase.firestore().collection("logos").orderBy("time","desc").onSnapshot((data)=>{
			//console.log(data);
			let cards=[];
			data.forEach((doc)=>{
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
	handleUpload(e){
		
		this.setState({posted:true});
		if (firebase.auth().currentUser===null)
			route('/login');
		else {
			let file=document.querySelector("[name=logo]").files[0];
			if (!(file.type==="image/png"||file.type==="image/jpeg")){
				alert("Invalid Format");
				return;
			}
				
			let type=file.type.substr(6);
			let firestore = firebase.firestore();
			let data={
				'posted_by':firebase.auth().currentUser.uid,
				'time':Math.floor(Date.now()/1000),
				type
			};
			if	(!this.state.hpd)
				data['poster_details']={
					name:firebase.auth().currentUser.displayName,
					photoURL:firebase.auth().currentUser.photoURL
				};
			firestore.collection("logos").add(data).then((doc)=>{
				
				let ref= firebase.storage().ref("logos/"+doc.id+"."+type);
				let task = ref.put(file);
				
				
				task.on("state_changed",
					(progress)=>{
						e.target.innerHTML="Uploading...";
						console.log("progress",progress);
					},
					(error)=>{
						alert("Some error occured while uploading\n"+error);
					},
					(success)=>{
						console.log("success",success);
						ref.getDownloadURL().then((d)=>{
							console.log(d);
							data['url']=d;
							firestore.doc("logos/"+doc.id).set(data);
						},(e)=>{
							console.log(e);
						});
						document.querySelector("[name=logo]").value="";
						this.setState({img:null});
					}
				);
				
			});
		}
	}
	handleFile(e){
		console.log(e);
		this.setState({[e.target.name]:e.target.value});
		let reader = new FileReader();
		
		reader.onload =  (e)=> {
			// get loaded data and render thumbnail.
			this.setState({img:e.target.result});
		};
	
		// read the image file as a data URL.
		reader.readAsDataURL(e.target.files[0]);
	}
	handleCheckbox(e){
		this.setState({[e.target.name]:e.target.checked});
	}
	render() {
		return (
			<div class="section">
				<div class={style.themes}>
					<Head title="Logos" img="/assets/logos.png"/>
					<div class={style.list}>
					
						<div class={style.card}>
							<div class={style.group}>
								<label>Upload your suggested logo (Accepted in jpeg and png formats)</label>
								<input type="file" name="logo" onChange={this.handleFile} required/>
								{this.state.img?<img src={this.state.img}/>:""}
							</div>
							<div>
								
								<input type="checkbox" id="hpd" name="hpd" onChange={this.handleCheckbox}/> <label for="hpd">Hide personal details</label>
								<button onClick={this.handleUpload}>Upload</button>
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
									return <Card {...data}/>}):
								<Loader/>
						}
						
					</div>
				</div>
			</div>
		);
	}
}
