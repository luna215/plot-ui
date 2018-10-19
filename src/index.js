import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';



function Point(props) {
    return <circle cx={props.x} cy={props.y} r="3" />
}

function Path(props) {
    return <path d={"M " + props.startX + " " + props.startY + " l " + props.endX + " " + props.endY} stroke="red"/>
}

class CanvasComponent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            points: [
                {x: 100, y: 350},
                {x: 250, y: 50},
                {x: 400, y: 350},
                {x: 20, y: 50},
                {x: 50, y: 100},
                {x: 990, y: 990},
            ]
        }
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

    render() {
        let points = this.renderPoints();
        let lines = this.renderLines();

        return (
            <svg height="1000" width="1000"> 
                <g  stroke="black" stroke-width="3" fill="black">
                    {points}
                </g> 
                {lines}
            </svg>
        )
    }
}

ReactDOM.render(<CanvasComponent />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
