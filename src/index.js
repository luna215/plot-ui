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
                {x: 0, y: 0},
                {x: 0.1, y: 0.1},
                {x: 0.6, y: 0.8},
                {x: 1, y: 0}
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
        let copyPoint = this.normalizePoint({x: this.state.points[id].x, y: this.state.points[id].y});
        this.setState({
            selected: id,
            copyPoint: <PointComponent key="copy" x={copyPoint.x} y={copyPoint.y} />,
            updatedX: copyPoint.x,
            updatedY: copyPoint.y,
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
        let point;
        for (let i = 0; i < this.state.points.length; i++){
            point = this.normalizePoint(this.state.points[i]);
            points.push(<PointComponent
                            key={i}
                            id={i}
                            x={point.x} 
                            y={point.y}
                            onMouseDown={() => this.handleMouseDown(i)}
                        />);
        }
        return points;
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
        let updatedPoint = this.unNormalizePoint({x: this.state.updatedX, y: this.state.updatedY});
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

    unNormalizePoint(point) {
        let min = this.props.padding/2;
        let maxX = this.props.width-min; 
        let maxY = this.props.height-min;
        let unNormalizedX = (point.x-min)/(maxX-min);
        let unNormalizedY = (point.y-min)/(maxY-min);
        
        return {x: unNormalizedX, y: unNormalizedY};
    }

    refCallBack(element) {
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
        // let lines = this.renderLines();
        let ghostPoint = this.state.copyPoint;

        return (
            <div>
                <svg ref={this.refCallBack} height={this.props.height} width={this.props.width} onMouseMove={this.handleDrag} onMouseUp={this.handlePointUpdate}>  

                    
                    <text x="100" y="90">Control Points</text>
                    <g  transform="matrix(1 0 0 -1 0 700)" stroke="black" fill="black">
                        {points}
                        {ghostPoint}
                        <Poly 
                            data={this.state.points} 
                            k={0.5}
                            height={this.props.height}
                            width={this.props.width}
                            padding={this.props.padding}/>
                        {points}

                        <line x1="100" x2="1100" y1="100" y2="100" stroke="black" strokeWidth="5" strokeLinecap="square"/>
                        <line x1="100" x2="1100" y1="600" y2="600" stroke="black" strokeWidth="5" strokeLinecap="square"/>
                        <line x1="100" x2="100" y1="100" y2="600" stroke="black" strokeWidth="5" strokeLinecap="square"/>
                        <line x1="1100" x2="1100" y1="100" y2="600" stroke="black" strokeWidth="5" strokeLinecap="square"/>
                    </g>
                    <g className="x-labels">
                        <text x="100" y="630">0</text>
                        <text x="190" y="630">0.1</text>
                        <text x="290" y="630">0.2</text>
                        <text x="390" y="630">0.3</text>
                        <text x="490" y="630">0.4</text>
                        <text x="590" y="630">0.5</text>
                        <text x="690" y="630">0.6</text>
                        <text x="790" y="630">0.7</text>
                        <text x="890" y="630">0.8</text>
                        <text x="990" y="630">0.9</text>
                        <text x="1090" y="630">1</text>
                    </g>
                    <g className="y-labels">
                        <text x="60" y="600">0</text>
                        <text x="60" y="550">0.1</text>
                        <text x="60" y="500">0.2</text>
                        <text x="60" y="450">0.3</text>
                        <text x="60" y="400">0.4</text>
                        <text x="60" y="350">0.5</text>
                        <text x="60" y="300">0.6</text>
                        <text x="60" y="250">0.7</text>
                        <text x="60" y="200">0.8</text>
                        <text x="60" y="150">0.9</text>
                        <text x="60" y="100">1</text>
                    </g>

                     <defs>
                        <linearGradient id="Gradient">
                            <stop offset="0%" stopColor="#d30000"/>
                            <stop offset="30%" stopColor="#ffff05"/>
                            <stop offset="50%" stopColor="#05ff05"/>
                            <stop offset="70%" stopColor="#05ffff"/>
                            <stop offset="100%" stopColor="#041ae0"/>
                        </linearGradient>
                    </defs>
 
                    <rect id="rect1" x="100" y="650" rx="15" ry="15" width="1000" height="30" fill="url(#Gradient)"/>
                    
                </svg>
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

function Poly(props) {

    let points = [];
    let min;
    let maxX;
    let maxY;
    let normalizedX;
    let normalizedY;
    let point;

    for(let i = 0; i < props.data.length; i++){
        point = props.data[i];
        min = props.padding/2;
        maxX = props.width-min;
        maxY = props.height-min; 
        normalizedX = (point.x*(maxX-min))+min; 
        normalizedY = (point.y*(maxY-min))+min;
        points.push({x: normalizedX, y: normalizedY});
    }

    if (props.k == null) props.k = 0.5;
    let data = points;
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