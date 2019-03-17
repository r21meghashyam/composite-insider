import { h, Component } from 'preact';
import style from  './style.less';
import {Link} from 'preact-router';
import * as firebase from 'firebase';

export default class Home extends Component {
	constructor(props){
		super(props);
		this.askPermission=this.askPermission.bind(this);
		this.messaging = firebase.messaging();
		
		if(Notification.permission !== "granted")
			this.setState({showNotifyBox:true});
		
	}
	askPermission(){
		this.messaging.requestPermission().then(()=>{
			this.setState({accepted:true});
			setTimeout(()=>{
				this.setState({showNotifyBox:false});
			},500);
		},(err)=>{
			console.log();
			this.setState({message:"Your browser denied access to send notifications, visit your browsers site settings and allow notifications."});
		});
	}
	render() {
		return (
			<div class={style.home}>
				<div class="section">
					{this.state.showNotifyBox?<div class={style.card+(this.state.accepted?" "+style.up:"")}>
						<i class="fa fa-bell"/> 
						Do you wish to be notified of all the great things that are happening here?
						<div><button onClick={this.askPermission}>Tap for yes</button></div>
						{this.state.message}
					</div>:null}
					<ul>
						<Link href="/themes"><li><img src="/assets/themes.png" alt="Theme"/> <div>Themes</div></li></Link>
						<Link href="/taglines"><li><img src="/assets/taglines.png" alt="Taglines"/> <div>Taglines</div></li></Link>
						<Link href="/logos"><li><img src="/assets/logos.png" alt="Logos"/> <div>Logos</div></li></Link>
						
					</ul>
				</div>
			</div>
		);
	}
}
