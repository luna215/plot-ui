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
                {x: props.padding/2, y: props.padding/2},
                {x: props.width-props.padding/2, y: props.padding/2}
            ],
            x: "",
            y: "",
            selected: undefined,
            copyPoint: undefined,
            startingX: 0,
            startingY: 0,
            updatedX: 0,
            updatedY: 0,
            boxBottom: 0,
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.refCallBack = this.refCallBack.bind(this);
        this.handlePointUpdate = this.handlePointUpdate.bind(this);
        this.handlePointsUpdate = this.handlePointsUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleMouseDown(id) {
        if(id === 0 || id === this.state.points.length-1){
            return;
        } 
        let copyPoint = {x: this.state.points[id].x, y: this.state.points[id]};
        this.setState({
            selected: id,
            copyPoint: copyPoint,
        });
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
        let updatedCopyPoint;
        let y;
        let x = event.screenX-this.state.startingX;
        if(event.screenY > this.state.boxBottom){
            y = (this.state.boxBottom + 100) - event.screenY;
        } else {
            y = this.state.boxBottom - event.screenY + 100;
        }

        if( x < 100 || x > 1100 || y > 600 || y < 100) {
            return;
        }
        updatedCopyPoint = {x: x, y: y};
        this.setState({
            updatedX: updatedCopyPoint.x,
            updatedY: updatedCopyPoint.y,
        });
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
        let selected = this.state.selected;
        if(selected === undefined || selected === 0 || selected === this.state.points.length-1) {
            this.setState({
                selected: undefined,
                copyPoint: undefined,
            });
            return
        }
        let updatedPoint = {x: this.state.updatedX, y: this.state.updatedY};
        let points = this.state.points.filter((_,i) => i !== this.state.selected);
        points.push(updatedPoint);;
        points.sort((a, b) => a.x - b.x);
        this.setState({
            points: points,
            selected: undefined,
            copyPoint: undefined,
        });
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
        newPoint = this.normalizePoint(newPoint);
        points.push(newPoint);
        points.sort((a, b) => a.x - b.x);
        this.setState({
            points: points,
            x: "",
            y: "",
        });
        event.preventDefault();
    }

    normalizePoint(point) {
        let min = this.props.padding/2;
        let maxX = this.props.width-min;
        let maxY = this.props.height-min; 
        let normalizedX = (point.x*(maxX-min))+min; 
        let normalizedY = (point.y*(maxY-min))+min;

        return {x:normalizedX, y:normalizedY};
    }

    refCallBack(element) {
        console.log(element.getBoundingClientRect());
        if(element){
            this.setState({
                startingX: element.getBoundingClientRect().x,
                startingY: element.getBoundingClientRect().y,
                boxBottom: element.getBoundingClientRect().bottom,
            });
        }
    }

    render() {
        let points = this.renderPoints();
        let lines = this.renderLines();
        let ghostPoint = this.state.copyPoint;

        return (
            <div>
                <svg ref={this.refCallBack} height={this.props.height} width={this.props.width} onMouseMove={this.handleDrag} onMouseUp={this.handlePointUpdate}>  
                    <g  transform="matrix(1 0 0 -1 0 700)" stroke="black" fill="black">
                        {points}
                        {ghostPoint}
                        {lines}
                        <Poly data={this.state.points} k={0.5}/>

                        <line x1="100" x2="1100" y1="100" y2="100" stroke="black" strokeWidth="5" strokeLinecap="square"/>
                        <line x1="100" x2="1100" y1="600" y2="600" stroke="black" strokeWidth="5" strokeLinecap="square"/>
                        <line x1="100" x2="100" y1="100" y2="600" stroke="black" strokeWidth="5" strokeLinecap="square"/>
                        <line x1="1100" x2="1100" y1="100" y2="600" stroke="black" strokeWidth="5" strokeLinecap="square"/>
                    </g> 
                    
                </svg>
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <input type="number" min="0" max="1" step="0.01" name="x" value={this.state.x} onChange={this.handlePointsUpdate} placeholder="X" required/>
                    <input type="number" min="0" max="1" step="0.01" name="y" value={this.state.y} onChange={this.handlePointsUpdate} placeholder="Y" required/>
                    <input type="submit" value="Add"/>
                </form>
            </div>
        )
            
    }
}

ReactDOM.render(<CanvasComponent 
                    height="700"
                    width="1200"
                    padding="200" />, document.getElementById('root'));

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