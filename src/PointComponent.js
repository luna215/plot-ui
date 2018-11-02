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
                    key={this.props.id+"circle"}
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
                    nX={this.props.nX}
                    nY={this.props.nY}
                    key={this.props.id + "pointinfo"}
                    id={this.props.id}
                    width={70}
                    height={60}
                    show={this.state.show}
                />
            ]);
    }

}

class PointInfoComponent extends React.Component {
    // constructor(props) {
    //      super(props);
    // }

    render() {
        
        return [
            <rect key={this.props.id+"rect"} x={15+this.props.x} y={this.props.y-this.props.height} width={this.props.width} height={this.props.height} ry="15" rx="15" className={this.props.show ? "show info" : "hide"} />,
            <text key={this.props.id+"x"} x={20+this.props.x} y={this.props.y-this.props.height+20} className={this.props.show ? "show" : "hide"}>x: {this.props.nX}</text>,
            <text key={this.props.id+"y"} x={20+this.props.x} y={this.props.y-this.props.height+40} className={this.props.show ? "show " : "hide"}>y: {this.props.nY}</text>
              
        ]
    }
}