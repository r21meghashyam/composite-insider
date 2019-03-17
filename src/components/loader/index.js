import { h, Component } from 'preact';
import style from './style';

export default class Loader extends Component {
	
	render() {
		return (
			<div class={style.loader}>
				<div class={style.fidget}>
					<div class={style.end}/>
					<div class={style.end}/>
					<div class={style.end}/>
					<div class={style.center}/>
					<div class={style.gap}/>
					<div class={style.gap}/>
					<div class={style.gap}/>
				</div>
			</div>
		);
	}
}
