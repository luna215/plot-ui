import React from 'react'

export default class PointComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fill: this.props.fill,
        }

        this.hoverOn = this.hoverOn.bind(this);
        this.hoverOff = this.hoverOff.bind(this);
    }

    hoverOn() {
        this.setState({fill: "red"});
    }

    hoverOff() {
        this.setState({fill: "black"});
    }

    render() {
        return <circle 
                    r="10"
                    id={this.props.id}
                    cx={this.props.x} 
                    cy={this.props.y} 
                    onMouseEnter={this.hoverOn} 
                    onMouseLeave={this.hoverOff}
                    onMouseDown={this.props.onMouseDown}
                    fill={this.state.fill}
                />
    }

}