import { h, Component } from 'preact';
import style from './style.less';



export default class Head extends Component {
	render(props) {
		return (
			<div class={style.head}>
				<img src={props.img} alt={props.title}/>
				<div>{props.title}</div>
			</div>
		);
	}
}
