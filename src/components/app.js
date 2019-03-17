import { h, Component } from 'preact';
import { Router } from 'preact-router';

//Components
import Header from './header';
import Home from './home';
import TagLine from './tagline';
import Themes from './themes';
import Logos from './logos';
import NotFound from './not-found';
import Login from './login';
import Profile from './profile';
import Toast from './toast';

const Footer=()=>(
	<div class="footer">
		&copy; Composite Fest 2018
	</div>
);

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
		
	};

	render() {
		return (
			<div id="app">
				<Header path={this.handleRoute}/>
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<TagLine path="/taglines"/>
					<Themes path="/themes"/>
					<Logos path="/logos"/>
					<Login path="/login"/>
					<Profile path="/profile"/>
					
					<NotFound default/>
				</Router>
				<Footer/>
				<Toast/>
			</div>
		);
	}
}
