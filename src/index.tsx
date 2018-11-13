import InfoComponent from './InfoComponent';
import PointComponent from './PointComponent';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';

const appRoot = document.getElementById('root');

interface Point {
    x: number;
    y: number;
}

class CanvasComponent extends React.Component<any, any> {
    private myRef:any;
    constructor(props: any) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            points:[
                {x: 0, y: 0},
                {x: 0.5, y: 0.5},
                {x: 1, y: 0}
            ] as Point[],
            selectedPoint: undefined,
            x: "",
            y: "",
            selected: undefined,
            copyPoint: undefined,
            startingX: 0,
            startingY: 0,
            updatedX: 0,
            updatedY: 0,
            boxBottom: 0,
        }

        this.handleDrag = this.handleDrag.bind(this);
        this.handleClickCanvas = this.handleClickCanvas.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.refCallBack = this.refCallBack.bind(this);
        this.resizingWindow = this.resizingWindow.bind(this);
        this.handlePointUpdate = this.handlePointUpdate.bind(this);
        this.handlePointsUpdate = this.handlePointsUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUnMount = this.componentDidUnMount.bind(this);
    }

    public render() {
        const points = this.renderPoints();
        const ghostPoint = this.state.copyPoint;
        const selectedPoint = this.state.selectedPoint;
        const widthInterval = this.props.width/11;
        const heightInterval = this.props.height/11; 
        const height = parseInt(this.props.height, 10) + parseInt(this.props.padding, 10)
        const width = parseInt(this.props.width, 10) + parseInt(this.props.padding, 10)
        return ([
            <div key="canvas" id="canvas">                
                <svg 
                    ref={this.refCallBack} 
                    viewBox={`0 0 ${width} ${height}`}
                    height={height} 
                    width={width}
                    onMouseMove={this.handleDrag} 
                    onMouseUp={this.handlePointUpdate}
                    onClick={this.handleClickCanvas}
                    onDoubleClick={this.handleDoubleClick}>  
                    <text x="100" y="90">Control Points</text>
                    <InfoComponent  key="rootInfo" fill="white" stroke="black" strokeWidth="5" />
                    <g stroke="black" fill="black">
                        <Poly 
                            data={this.state.points} 
                            k={0.5}
                            height={this.props.height}
                            width={this.props.width}
                            padding={this.props.padding}/>
                        {points}
                        {ghostPoint}
                        {selectedPoint}
                        

                        <line x1="100" x2="1100" y1="100" y2="100" stroke="black" strokeWidth="5" strokeLinecap="square"/>
                        <line x1="100" x2="1100" y1="600" y2="600" stroke="black" strokeWidth="5" strokeLinecap="square"/>
                        <line x1="100" x2="100" y1="100" y2="600" stroke="black" strokeWidth="5" strokeLinecap="square"/>
                        <line x1="1100" x2="1100" y1="100" y2="600" stroke="black" strokeWidth="5" strokeLinecap="square"/>
                    </g>
                    <g className="x-labels">
                        <text x="90" y="630">0</text>
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
 
                    <rect id="rect1" x={this.props.padding/2} y={(this.props.height+this.props.padding)-(this.props.padding/4)} rx="15" ry="15" width={this.props.width} height="30" fill="url(#Gradient)"/>
                    
                </svg>
                <form onSubmit={this.handleSubmit}>
                    <input type="number" min="0" max="1" step="0.01" name="x" value={this.state.x} onChange={this.handlePointsUpdate} placeholder="X" required={true}/>
                    <input type="number" min="0" max="1" step="0.01" name="y" value={this.state.y} onChange={this.handlePointsUpdate} placeholder="Y" required={true}/>
                    <input type="submit" value="Add"/>
                </form>
            </div>,
            <div key="modal" id="modal-root" />
        ]);
    }

    private handleMouseDown = (id:number) => (event) => {
        if(id === 0 || id === this.state.points.length-1){
            return;
        } 
        const copyPoint: Point = this.normalizePoint({x: this.state.points[id].x, y: this.state.points[id].y});
        this.setState({
            selected: id,
            copyPoint: "ready",
            updatedX: copyPoint.x,
            updatedY: copyPoint.y,
        });

        event.preventDefault();
    }

    private handleDrag(event) {
        if(this.state.copyPoint === undefined){
            return
        }
        let updatedCopyPoint;
        const padding = this.props.padding/2;
        const x = event.screenX-this.state.startingX;      
        const y = (this.props.height+this.props.padding) - (this.state.boxBottom - event.screenY + 130);

        if( x < (padding) || 
            x > (this.props.width+(padding)) || 
            y > (this.props.height+(padding)) || 
            y < (padding)) {
            return;
        }
        updatedCopyPoint = {x, y};
        this.setState({
            updatedX: updatedCopyPoint.x,
            updatedY: updatedCopyPoint.y,
        });
        const unNormalizePoint = this.unNormalizePoint(updatedCopyPoint);
        this.setState({
            copyPoint: <PointComponent selected={false} key="copy" x={updatedCopyPoint.x} y={updatedCopyPoint.y} nX={unNormalizePoint.x} nY={unNormalizePoint.y}/>
        });

        event.preventDefault()
    }

    private handlePointUpdate(event) {
        const selected = this.state.selected;
        if(selected === undefined || selected === 0 || selected === this.state.points.length-1) {
            this.setState({
                selected: undefined,
                copyPoint: undefined,
            });
            return
        }
        const updatedPoint = this.unNormalizePoint({x: this.state.updatedX, y: this.state.updatedY});
        const points = this.state.points.filter((_,i) => i !== this.state.selected);
        points.push(updatedPoint);;
        points.sort((a, b) => { 
            if(a.x === b.x){
                return a.y-b.y;
            }
            return a.x - b.x
        });
        this.setState({
            points,
            selected: undefined,
            copyPoint: undefined,
        });
        event.preventDefault();
    }

    private handlePointsUpdate(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
        event.preventDefault();
    }

    private handleSubmit(event) {
        const newPoint = {x: this.state.x, y: this.state.y};
        const points = this.state.points.slice();
        points.push(newPoint);
        points.sort((a, b) => { 
            if(a.x === b.x){
                return a.y-b.y;
            }
            return a.x - b.x
        });
        this.setState({
            points,
            x: "",
            y: "",
        });
        event.preventDefault();
    }

    private handleClickPoint = (id:number) => (event) => {
        const selectedPointX = this.state.points[id].x;
        const selectedPointY = this.state.points[id].y;
        const normalizePoint = this.normalizePoint({x: selectedPointX, y: selectedPointY});
        const selectedPoint = <PointComponent
                            key={id} 
                            id={id}
                            x={normalizePoint.x} 
                            y={normalizePoint.y}
                            nX={selectedPointX}
                            nY={selectedPointY}
                            selected={true}
                            delete={this.deletePoint}
                            onMouseDown={this.handleMouseDown(id)}
                        />

        this.setState({selectedPoint});

        event.stopPropagation();
    }
    
    private handleClickCanvas() {
        this.setState({selectedPoint: undefined});
    }

    private handleDoubleClick(event) {
        let newPoint;
        const x = event.screenX-this.state.startingX;      
        const y = (this.props.height+this.props.padding) - (this.state.boxBottom - event.screenY + 130);
        const points = this.state.points;
        const padding = this.props.padding/2; 

        if( x < (padding) || 
            x > (this.props.width+(padding)) || 
            y > (this.props.height+(padding)) || 
            y < (this.props.padding/2)) {
            return;
        }
        newPoint = this.unNormalizePoint({x,y});
        points.push(newPoint);
        points.sort((a, b) => { 
            if(a.x === b.x){
                return b.y-a.y;
            }
            return a.x - b.x
        });
        this.setState({points})
        event.preventDefault();
    }

    private deletePoint = (i:number) => {
    if(i===0 || i===this.state.points.length-1){ return};
        const points = this.state.points.filter((_,j) => j !== i);
        points.sort((a,b) => {
            if(a.x === b.x){
                return a.y - b.y;
            }
            return a.x - b.x
        })
        this.setState({points});
    }

    private normalizePoint(point: Point) {
        const min = this.props.padding/2;
        const maxX = this.props.width+min;
        const maxY = this.props.height+min; 
        const normalizedX = (point.x*(maxX-min))+min; 
        const normalizedY = (point.y*(maxY-min))+min;
        const reverseY = (this.props.height+this.props.padding)-normalizedY

        
        return {x:normalizedX, y:reverseY};
    }

    private unNormalizePoint(point: Point) {
        const min = this.props.padding/2;
        const maxX = this.props.width+min; 
        const maxY = this.props.height+min;
        const unNormalizedX = (point.x-min)/(maxX-min);

        // we have to take into account that we reversed y when we first normalized it.
        const unNormalizedY = ((this.props.height+this.props.padding)-point.y-min)/(maxY-min); 

        return {x: unNormalizedX, y: unNormalizedY};
    }

    private refCallBack(element) {
        if(element){
            this.myRef = element;
            this.setState({
                startingX: this.myRef.getBoundingClientRect().x,
                startingY: this.myRef.getBoundingClientRect().y,
                boxBottom: this.myRef.getBoundingClientRect().bottom,
            });
        }
    }

    public resizingWindow() {
        if(this.myRef) {
            this.setState({
                startingX: this.myRef.getBoundingClientRect().x,
                startingY: this.myRef.getBoundingClientRect().y,
                boxBottom: this.myRef.getBoundingClientRect().bottom,
            })
        }
    }

    private renderPoints() {
        const points: any[] = [];
        let point: Point;
        for (let i = 0; i < this.state.points.length; i++){
            point = this.normalizePoint(this.state.points[i]);
            points.push(<PointComponent
                            key={i}
                            id={i}
                            x={point.x} 
                            y={point.y}
                            nX={this.state.points[i].x}
                            nY={this.state.points[i].y}
                            selected={false}
                            onMouseDown={this.handleMouseDown(i)}
                            onClick={this.handleClickPoint(i)}
                        />);
        }
        return points;
    }

    public componentWillMount() {
        ['resize', 'scroll'].forEach(event => {
            window.addEventListener(event, this.resizingWindow);
        });
        // window.addEventListener("resize", this.resizingWindow);
      }
    
    public componentDidMount() {
        ['resize', 'scroll'].forEach(event => {
            window.addEventListener(event, this.resizingWindow);
        });
        // window.addEventListener("resize", this.resizingWindow);
      }
    
    public componentDidUnMount() {
        ['resize', 'scroll'].forEach(event => {
            window.addEventListener(event, this.resizingWindow);
        });
        // window.addEventListener("resize", this.resizingWindow);
    }
    
}

ReactDOM.render(<CanvasComponent 
    height={500}
    width={1000}
    padding={200} />, appRoot);

function Poly(props) {

    const points: Point[] = [];
    let min:number;
    let maxX:number;
    let maxY: number;
    let normalizedX: number;
    let normalizedY: number;
    let reverseY: number;

    for(const point of props.data){
        min = parseInt(props.padding, 10)/2;
        maxX = parseInt(props.width, 10)+min;
        maxY = parseInt(props.height, 10)+min; 
        normalizedX = (point.x*(maxX-min))+min; 
        normalizedY = (point.y*(maxY-min))+min;
        reverseY = (props.height+props.padding)-normalizedY;
        points.push({x: normalizedX, y: reverseY});
        points.sort((a, b) => { 
            if(a.x === b.x){
                return a.y-b.y;
            }
            return a.x - b.x
        });
    }

    if (props.k == null) {props.k = 0.5};
    const data = points;
    const size = data.length;
    const last = size - 2;
    let path = "M" + [data[0].x, data[0].y];

    for (let i=0; i<size-1;i++){
        const x0 = i ? data[i-1].x : data[0].x;
        const y0 = i ? data[i-1].y : data[0].y;

        const x1 = data[i].x;
        const y1 = data[i].y;

        const x2 = data[i+1].x;
        const y2 = data[i+1].y;

        const x3 = i !== last ? data[i+2].x : x2;
        const y3 = i !== last ? data[i+2].y : y2; 

        const cp1x = x1 + (x2 - x0)/6 * props.k;
        const cp1y = y1 + (y2 -y0)/6 * props.k;

        const cp2x = x2 - (x3 -x1)/6 * props.k;
        const cp2y = y2 - (y3 - y1)/6 * props.k;

        path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];
    }

    return <path d={path} strokeWidth="3" stroke="#339999" fill="none"/>
}