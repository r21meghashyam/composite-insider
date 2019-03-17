import { h, Component } from 'preact';
import {Link} from 'preact-router';

export default class NotFound extends Component {
	render() {
		return (
			<div>
				<div class="section">
					<h1>404 - Maybe you are too early here, or too late</h1>
					<h2><Link href="/">Home</Link></h2>
				</div>
			</div>
		);
	}
}
