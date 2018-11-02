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
                    fill={this.props.fill}
                />, 
                <PointInfoComponent 
                    x={this.props.x} 
                    y={this.props.y}
                    key={this.props.id}
                    width={70}
                    height={60}
                    show={this.state.show}
                />
            ]);
    }

}

class PointInfoComponent extends React.Component {
    // constructor(props) {
    //     super(props);
    // }
    
    render() {
        return [
            // <rect x={15+this.props.x} y={15+this.props.y} width={this.props.width} height={this.props.height} ry="15" rx="15" className={this.props.show ? "show info" : "show info"} />,
            <rect id={this.props.id} x={10} y={10} width={this.props.width} height={this.props.height} ry="15" rx="15" className={this.props.show ? "show info" : "hide"} />,
            <text id={"x"+this.props.id} className={this.props.show ? "show" : "hide"} x="15" y="25">x: {this.props.x}</text>,
            <text id={"y"+this.props.id} className={this.props.show ? "show " : "hide"} x="15" y="50">y: {this.props.y}</text>
              
        ]
    }
}