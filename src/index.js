import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';

import './index.css';

class PointComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fill: "black",
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

function Path(props) {
    return <path d={"M " + props.startX + " " + props.startY + " l " + props.endX + " " + props.endY}  stroke="#888"/>
}


class CanvasComponent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            points: [
                {x: 100, y: 350},
                {x: 250, y: 50},
                {x: 400, y: 350},
                {x: 550, y: 50},
                {x: 700, y: 350},
            ],
            x: 0,
            y: 0,
            selected: undefined,
        };

        this.handleClik = this.handleClick.bind(this);
        this.handlePointUpdate = this.handlePointUpdate.bind(this);
        this.handlePointsUpdate = this.handlePointsUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleClick(id) {
        console.log("You selected: " + id);
        this.setState({selected: id});
    }

    renderPoints() {
        let points = [];
        
        for (let i = 0; i < this.state.points.length; i++){
            points.push(<PointComponent
                            key={i}
                            id={i}
                            x={this.state.points[i].x} 
                            y={this.state.points[i].y}
                            onMouseDown={() => this.handleClick(i)}
                        />);
        }
        return points;
    }

    renderLines() {
        const numberOfLines = this.state.points.length - 1;
        let start;
        let end;
        let lines = [];

        for (let i = 0; i < numberOfLines; i++){
            start = {x: this.state.points[i].x, y: this.state.points[i].y};
            end = {x: this.state.points[i+1].x-start.x, y: this.state.points[i+1].y-start.y};
            lines.push(<Path 
                            startX={start.x} 
                            startY={start.y} 
                            endX={end.x} 
                            endY={end.y}
                            key={i}
                        />);
        }
        return lines;
    }   

    handlePointUpdate(event) {
        if(this.state.selected === undefined) {
            return
        }
        var updatedPoint = {x: event.screenX, y: event.screenY-100};
        var points = this.state.points.filter((_,i) => i !== this.state.selected);
        points.push(updatedPoint);;
        points.sort((a, b) => {
            return a.x - b.x;
        });
        this.setState({points: points});
        event.preventDefault();
    }

    handlePointsUpdate(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value}); 
        event.preventDefault();
    }

    handleSubmit(event) {
        var newPoint = {x: this.state.x, y: this.state.y};
        var points = this.state.points.slice();
        points.push(newPoint);
        this.setState({points: points});
        event.preventDefault();
    }

    render() {
        let points = this.renderPoints();
        let lines = this.renderLines();

        return (
            <div>
                <svg style={{border: "1px solid black"}} height="600" width="1000" onMouseUp={this.handlePointUpdate}>  
                    <g  stroke="black" fill="black">
                        {points}
                    </g> 
                    {lines}
                </svg>
                <form onSubmit={this.handleSubmit}>
                    <input type="number" name="x" value={this.state.x} onChange={this.handlePointsUpdate} placeholder="X" />
                    <input type="number" name="y" value={this.state.y} onChange={this.handlePointsUpdate} placeholder="Y" />
                    <input type="submit" value="Add"/>
                </form>
            </div>
        )
            
    }
}

ReactDOM.render(<CanvasComponent />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
