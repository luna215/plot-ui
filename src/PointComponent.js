import React from 'react'

export default class PointComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        }

        this.handleHover = this.handleHover.bind(this);
        this.handleHoverOff = this.handleHoverOff.bind(this);
    }

    handleHover() {
        this.setState({show: true});
    }

    handleHoverOff() {
        this.setState({show: false});
    }

    render() {
        return ([
                <circle 
                    r="10"
                    id={this.props.id}
                    cx={this.props.x} 
                    cy={this.props.y} 
                    onMouseEnter={this.handleHover} 
                    onMouseLeave={this.handleHoverOff}
                    onMouseDown={this.props.onMouseDown}
                    fill={this.state.fill}
                />, 
                <PointInfoComponent 
                    x={this.props.x} 
                    y={this.props.y}
                    width={100}
                    height={100}
                    show={this.state.show}
                />
            ]);
    }

}

class PointInfoComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return [
            <rect x={15+this.props.x} y={15+this.props.y} width={this.props.width} height={this.props.height} ry="15" rx="15" className={this.props.show ? "show info" : "hide"} />,
            <text className={this.props.show ? "show flip" : "hide"} x={this.props.x+20} y={this.props.y+this.props.height}>x: {this.props.x}</text>,
            <text className={this.props.show ? "show flip" : "hide"} x={this.props.x+20} y={this.props.y+this.props.height-20}>y: {this.props.y}</text>      
        ]
    }
}