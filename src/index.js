import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';

function Point(props) {
    return <circle cx={props.x} cy={props.y} r="3" />
}

function Path(props) {
    return <path d={"M " + props.startX + " " + props.startY + " l " + props.endX + " " + props.endY} stroke="aqua"/>
}

class CanvasComponent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            points: [],
            x: 0,
            y: 0,
        };

        this.handlePointUpdate = this.handlePointUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    renderPoints() {
        let points = [];
        
        for (let i = 0; i < this.state.points.length; i++){
            points.push(<Point 
                            x={this.state.points[i].x} 
                            y={this.state.points[i].y}
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
                        />);
        }
        return lines;
    }   

    handlePointUpdate(event) {
        const name = event.target.name;
        const value = event.target.value;
        console.log(name + ": " + value);
        this.setState({[name]: value});    
    }

    handleSubmit(event) {
        let newPoint = {x: this.state.x, y: this.state.y};
        const points = this.state.points.slice();
        points.push(newPoint);
        this.setState({points: points});
        event.preventDefault();
    }

    render() {
        let points = this.renderPoints();
        let lines = this.renderLines();

        return (
            <div>
                <svg height="500" width="1000"> 
                    <g  stroke="black" fill="black">
                        {points}
                    </g> 
                    {lines}
                </svg>
                <form onSubmit={this.handleSubmit}>
                    <input type="number" name="x" value={this.state.x} onChange={this.handlePointUpdate} placeholder="X" />
                    <input type="number" name="y" value={this.state.y} onChange={this.handlePointUpdate} placeholder="Y" />
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
