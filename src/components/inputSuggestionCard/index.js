import { h, Component } from 'preact';
import style from './style.less';



export default class Head extends Component {
	render(props) {
		return (
			<div class={style.card}>
				<div class={style.group}>
					<input type="text" required/>
					<span class={style.highlight}/>
					<span class={style.bar}/>
					<label>Give your suggestions</label>
				</div>
				<div>
					<button>Post</button>
				</div>
			</div>
		);
	}
}
