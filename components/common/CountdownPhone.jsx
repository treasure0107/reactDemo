import React from 'react';

class CountdownPhone extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			time: this.props.time,
		}
	}
	componentDidMount() {
		let { time } = this.state;
		if (time > 0) {
			this.timer = setInterval(() => {
				if (time <= 0) {
					clearInterval(this.timer);
					this.setState({
						time: this.props.successContext
					})
					this.props.successCallBack();
					return
				}
				time = time - 1;
				this.setState({
					time: time
				})
			}, 1000);
		} else {
			this.setState({
				time: this.props.successContext
			})
			this.props.successCallBack();
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.time != this.props.time) {
			let time = nextProps.time;
			if (time > 0) {
				this.setState({
					time: time
				})
				this.timer = setInterval(() => {
					if (time <= 1) {
						this.setState({
							time: nextProps.successContext
						})
						this.props.successCallBack();
						clearInterval(this.timer)
						return
					}
					time = time - 1;
					this.setState({
						time: time
					})
				}, 1000);
			} else {
				this.setState({
					time: this.props.successContext
				})
				this.props.successCallBack();
			}
		}
	}
	componentWillUnmount() {
		this.setState({
			time: this.props.successContext
		})
		clearInterval(this.timer)
	}
	render() {

		return (
			<div>
				{this.state.time}
			</div>
		);
	}
}

export default CountdownPhone;

