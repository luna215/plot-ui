import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';

import PointComponent from './PointComponent';
import './index.css';

class CanvasComponent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            points: [
                {x: 100, y: 350},
                {x: 250, y: 50},
                {x: 400, y: 350},
                {x: 550, y: 50},
                {x: 700, y: 350}
            ],
            x: 0,
            y: 0,
            selected: undefined,
            copyPoint: undefined,
        };

        this.startDrag = this.startDrag.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handlePointUpdate = this.handlePointUpdate.bind(this);
        this.handlePointsUpdate = this.handlePointsUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleMouseDown(id) {
        this.setState({selected: id});
        this.startDrag(id);
    }

    startDrag(id) {
        let copyPoint = this.state.points[id];
        this.setState({
            copyPoint: <PointComponent fill="blue" key="copy" x={copyPoint.x} y={copyPoint.y} />
        });
    }

    handleDrag(event) {
        if(this.state.copyPoint === undefined){
            return
        }
        let updatedCopyPoint = {x: event.screenX, y: event.screenY-100};
        this.setState({
            copyPoint: <PointComponent fill="blue" key="copy" x={updatedCopyPoint.x} y={updatedCopyPoint.y} />
        });
    }

    renderPoints() {
        let points = [];
        
        for (let i = 0; i < this.state.points.length; i++){
            points.push(<PointComponent
                            key={i}
                            id={i}
                            x={this.state.points[i].x} 
                            y={this.state.points[i].y}
                            onMouseDown={() => this.handleMouseDown(i)}
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
        let updatedPoint = {x: event.screenX, y: event.screenY-100};
        let points = this.state.points.filter((_,i) => i !== this.state.selected);
        points.push(updatedPoint);;
        points.sort((a, b) => {
            return a.x - b.x;
        });
        this.setState({points: points});
        this.setState({selected: undefined});
        this.setState({copyPoint: undefined});
        event.preventDefault();
    }

    handlePointsUpdate(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
        event.preventDefault();
    }

    handleSubmit(event) {
        let newPoint = {x: this.state.x, y: this.state.y};
        let points = this.state.points.slice();
        points.push(newPoint);
        points.sort((a, b) => {
            return a.x - b.x;
        });
        this.setState({points: points});
        event.preventDefault();
    }

    render() {
        let points = this.renderPoints();
        let lines = this.renderLines();
        let ghostPoint = this.state.copyPoint;

        return (
            <div>
                <svg style={{border: "1px solid black"}} height="1000" width="1000" onMouseMove={this.handleDrag} onMouseUp={this.handlePointUpdate}>  
                    <g  stroke="black" fill="black">
                        {points}
                        {ghostPoint}
                    </g> 
                    {lines}
                    <Poly 
                    data={this.state.points}
                    k={1}
                    />
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

function Path(props) {
    return <path d={"M " + props.startX + " " + props.startY + " l " + props.endX + " " + props.endY}  stroke="#888"/>
}

function Poly(props) {
    if (props.k == null) props.k = 0.5;
    let data = props.data;
    let size = data.length;
    let last = size - 2;
    let path = "M" + [data[0].x, data[0].y];

    for (let i=0; i<size-1;i++){
        let x0 = i ? data[i-1].x : data[0].x;
        let y0 = i ? data[i-1].y : data[0].y;

        let x1 = data[i].x;
        let y1 = data[i].y;

        let x2 = data[i+1].x;
        let y2 = data[i+1].y;

        let x3 = i !== last ? data[i+2].x : x2;
        let y3 = i !== last ? data[i+2].y : y2; 

        let cp1x = x1 + (x2 - x0)/6 * props.k;
        let cp1y = y1 + (y2 -y0)/6 * props.k;

        let cp2x = x2 - (x3 -x1)/6 * props.k;
        let cp2y = y2 - (y3 - y1)/6 * props.k;

        path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];
    }

    return <path d={path} stroke="red" fill="none"/>
}