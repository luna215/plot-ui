import React from 'react';

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
        return this.props.selected ? ([
                <circle
                    r="10"
                    key={this.props.id+"circle"}
                    id={this.props.id}
                    cx={this.props.x} 
                    cy={this.props.y} 
                    onMouseEnter={this.handleHover} 
                    onMouseLeave={this.handleHoverOff}
                    onMouseDown={this.props.onMouseDown}
                    onClick={this.props.onClick}
                    fill="#8DEEEE"
                    stroke="black"
                    strokeWidth="5"
                />,
                <PointInfoComponent 
                    x={this.props.x} 
                    y={this.props.y}
                    nX={this.props.nX}
                    nY={this.props.nY}
                    key={this.props.id + "pointinfo"}
                    id={this.props.id}
                    delete={this.props.delete}
                    width={100}
                    height={80}
                    show={true}
                />
            ]) : ([
                <circle 
                    r="10"
                    key={this.props.id+"circle"}
                    id={this.props.id}
                    cx={this.props.x} 
                    cy={this.props.y} 
                    onMouseEnter={this.handleHover} 
                    onMouseLeave={this.handleHoverOff}
                    onMouseDown={this.props.onMouseDown}
                    onClick={this.props.onClick}
                    fill="black"
                />, 
                <PointInfoComponent 
                    x={this.props.x} 
                    y={this.props.y}
                    nX={this.props.nX}
                    nY={this.props.nY}
                    key={this.props.id + "pointinfo"}
                    id={this.props.id}
                    width={100}
                    height={80}
                    delete={this.props.delete}
                    show={this.state.show}
                />
            ]);
    }

}

class PointInfoComponent extends React.Component {
    render() {
        
        return [
            <rect key={this.props.id+"rect"} className={this.props.show ? "show info" : "hide"} x={15+this.props.x} y={this.props.y-this.props.height} width={this.props.width} height={this.props.height} ry="15" rx="15" />,
            <text key={this.props.id+"x"} x={20+this.props.x} y={this.props.y-this.props.height+20} className={this.props.show ? "show" : "hide"}>x: {this.props.nX}</text>,
            <text key={this.props.id+"y"} x={20+this.props.x} y={this.props.y-this.props.height+40} className={this.props.show ? "show " : "hide"}>y: {this.props.nY}</text>,
            <g key={this.props.id+"delete-div"}className={this.props.show ? "show delete-button" : "hide"} onClick={() => this.props.delete(this.props.id)}>
                <rect key={this.props.id+"delete-button"}  rx="10" ry="10" x={this.props.x+(this.props.width/4)} y={this.props.y-this.props.height+50} width={this.props.width-25} height={this.props.height/3}/>
                <text key={this.props.id+"delete-text"} x={(this.props.x+(this.props.width/4)+((this.props.width-20)/4))-10} y={this.props.y-this.props.height+70}>Delete</text>
            </g>
              
        ]
    }
}