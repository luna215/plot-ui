import InfoComponent from './InfoComponent';
import PointComponent from './PointComponent';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';

const appRoot = document.getElementById('root');

interface Point {
    x: number;
    y: number;
};

interface Line {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};

interface Rect {
    x: number;
    y: number;
}

interface TextLabel {
    x: number;
    y: number;
}

class CanvasComponent extends React.Component<any, any> {
    private myRef:any;
    private height: number;
    private width: number;
    private padding: number;
    private topLine: Line;
    private bottomLine: Line;
    private rightLine: Line;
    private leftLine: Line;
    private normalizedXLabels: Point[];
    private normalizedYLabels: Point[];
    private normalizedRect: Rect;
    private normalizedLabel: TextLabel;
    private normalizedInfoPoint: Point;
    private normalizedInfoLabel: Point;
    private label: TextLabel = {x: 0, y: 0.1};
    private infoPoint = {x: 0.95, y: 0.3};
    private infoLabel = {x: 0.945, y: 0.2};
    private rainbowRect: Rect = {x: 0.0, y: 0.5};
    private xLabel: Point[] = [
        {x: 0, y: 0.7},
        {x: 0.1, y: 0.7},
        {x: 0.2, y: 0.7},
        {x: 0.3, y: 0.7},
        {x: 0.4, y: 0.7},
        {x: 0.5, y: 0.7},
        {x: 0.6, y: 0.7},
        {x: 0.7, y: 0.7},
        {x: 0.8, y: 0.7},
        {x: 0.9, y: 0.7},
        {x: 1, y: 0.7},
    ];

    private yLabel: Point[] = [
        {x: 0.6, y: 0},
        {x: 0.6, y: 0.1},
        {x: 0.6, y: 0.2},
        {x: 0.6, y: 0.3},
        {x: 0.6, y: 0.4},
        {x: 0.6, y: 0.5},
        {x: 0.6, y: 0.6},
        {x: 0.6, y: 0.7},
        {x: 0.6, y: 0.8},
        {x: 0.6, y: 0.9},
        {x: 0.6, y: 1},       
    ];

    
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
        };
        this.height = 400;
        this.width = 800;
        this.padding = 200;
        this.normalizedXLabels = this.normalizeXLabel(this.xLabel);
        this.normalizedYLabels = this.normalizeYLabel(this.yLabel);
        this.topLine = {
            x1: this.padding/2,
            x2: this.width+this.padding/2,  
            y1: this.padding/2,
            y2: this.padding/2
        };
        this.rightLine = {
            x1: this.width+this.padding/2,
            x2: this.width+this.padding/2,
            y1: this.padding/2,
            y2: this.height+this.padding/2
        };
        this.bottomLine = {
            x1: this.padding/2,
            x2: this.width+this.padding/2,
            y1: this.height+this.padding/2,
            y2: this.height+this.padding/2
        };
        this.leftLine = {
            x1: this.padding/2,
            x2: this.padding/2, 
            y1: this.padding/2,
            y2: this.height+this.padding/2
        };
        this.normalizedLabel = this.normalizeGraphLabel(
            this.label, 
            this.padding/2, 
            this.height+this.padding/2, 
            this.width+this.padding/2, 
            this.height+this.padding
        );
        this.normalizedInfoPoint = this.normalizeGraphLabel(
            this.infoPoint, 
            this.padding/2, 
            this.height+this.padding/2, 
            this.width+this.padding/2, 
            this.height+this.padding
        );
        this.normalizedInfoLabel = this.normalizeGraphLabel(
            this.infoLabel, 
            this.padding/2, 
            this.height+this.padding/2, 
            this.width+this.padding/2, 
            this.height+this.padding
        );
        this.normalizedRect = this.normalizeGraphLabel(
            this.rainbowRect,
            this.padding/2,
            0,
            this.width+this.padding/2,
            this.padding/2
        );
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
        const addedPoint = this.state.addedPoint
        return ([
            <div key="canvas" id="canvas">                
                <svg 
                    id="svg"
                    ref={this.refCallBack} 
                    viewBox={`0 0 ${this.width+this.padding} ${this.height+this.padding}`}
                    preserveAspectRatio="xMidYMid contain"
                    onMouseMove={this.handleDrag} 
                    onMouseUp={this.handlePointUpdate}
                    onClick={this.handleClickCanvas}
                    onDoubleClick={this.handleDoubleClick}>  
                    <text x={this.normalizedLabel.x} y={this.normalizedLabel.y} fontSize="100%">Control Points</text>
                    <InfoComponent 
                        key="rootInfo" 
                        cx={this.normalizedInfoPoint.x} 
                        cy={this.normalizedInfoPoint.y} 
                        x={this.normalizedInfoLabel.x} 
                        y={this.normalizedInfoLabel.y} 
                        fill="white" 
                        stroke="black" 
                        strokeWidth="5" 
                    />
                    <g stroke="black" fill="black">
                        <Poly 
                            data={this.state.points} 
                            k={0.5}
                            height={this.height}
                            width={this.width}
                            padding={this.padding}/>
                        {points}
                        {ghostPoint}
                        {selectedPoint}
                        {addedPoint}

                        <line x1={this.topLine.x1} x2={this.topLine.x2} y1={this.topLine.y1} y2={this.topLine.y2} stroke="black" strokeWidth="5" strokeLinecap="square"/>
                        <line x1={this.bottomLine.x1} x2={this.bottomLine.x2} y1={this.bottomLine.y1} y2={this.bottomLine.y2} stroke="black" strokeWidth="5" strokeLinecap="square"/>
                        <line x1={this.rightLine.x1} x2={this.rightLine.x2} y1={this.rightLine.y1} y2={this.rightLine.y2} stroke="black" strokeWidth="5" strokeLinecap="square"/>
                        <line x1={this.leftLine.x1} x2={this.leftLine.x2} y1={this.leftLine.y1} y2={this.leftLine.y2} stroke="black" strokeWidth="5" strokeLinecap="square"/>
                    </g>
                    <g className="x-labels">
                        <text x={this.normalizedXLabels[0].x} y={this.normalizedXLabels[0].y} fontSize="100%">0</text>
                        <text x={this.normalizedXLabels[1].x} y={this.normalizedXLabels[1].y} fontSize="100%">0.1</text>
                        <text x={this.normalizedXLabels[2].x} y={this.normalizedXLabels[2].y} fontSize="100%">0.2</text>
                        <text x={this.normalizedXLabels[3].x} y={this.normalizedXLabels[3].y} fontSize="100%">0.3</text>
                        <text x={this.normalizedXLabels[4].x} y={this.normalizedXLabels[4].y} fontSize="100%">0.4</text>
                        <text x={this.normalizedXLabels[5].x} y={this.normalizedXLabels[5].y} fontSize="100%">0.5</text>
                        <text x={this.normalizedXLabels[6].x} y={this.normalizedXLabels[6].y} fontSize="100%">0.6</text>
                        <text x={this.normalizedXLabels[7].x} y={this.normalizedXLabels[7].y} fontSize="100%">0.7</text>
                        <text x={this.normalizedXLabels[8].x} y={this.normalizedXLabels[8].y} fontSize="100%">0.8</text>
                        <text x={this.normalizedXLabels[9].x} y={this.normalizedXLabels[9].y} fontSize="100%">0.9</text>
                        <text x={this.normalizedXLabels[10].x} y={this.normalizedXLabels[10].y} fontSize="100%">1</text>
                    </g>
                    <g className="y-labels">
                        <text x={this.normalizedYLabels[0].x} y={this.normalizedYLabels[0].y} fontSize="100%">0</text>
                        <text x={this.normalizedYLabels[1].x} y={this.normalizedYLabels[1].y} fontSize="100%">0.1</text>
                        <text x={this.normalizedYLabels[2].x} y={this.normalizedYLabels[2].y} fontSize="100%">0.2</text>
                        <text x={this.normalizedYLabels[3].x} y={this.normalizedYLabels[3].y} fontSize="100%">0.3</text>
                        <text x={this.normalizedYLabels[4].x} y={this.normalizedYLabels[4].y} fontSize="100%">0.4</text>
                        <text x={this.normalizedYLabels[5].x} y={this.normalizedYLabels[5].y} fontSize="100%">0.5</text>
                        <text x={this.normalizedYLabels[6].x} y={this.normalizedYLabels[6].y} fontSize="100%">0.6</text>
                        <text x={this.normalizedYLabels[7].x} y={this.normalizedYLabels[7].y} fontSize="100%">0.7</text>
                        <text x={this.normalizedYLabels[8].x} y={this.normalizedYLabels[8].y} fontSize="100%">0.8</text>
                        <text x={this.normalizedYLabels[9].x} y={this.normalizedYLabels[9].y} fontSize="100%">0.9</text>
                        <text x={this.normalizedYLabels[9].x} y={this.normalizedYLabels[10].y} fontSize="100%">1</text>
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
 
                    <rect id="rect1" x={this.normalizedRect.x} y={this.normalizedRect.y} rx="15" ry="15" width={this.width} height="30" fill="url(#Gradient)"/>
                    
                </svg>
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
        const pt = this.myRef.createSVGPoint();
        let updatedCopyPoint;
        const padding = this.padding/2;
        pt.x = event.clientX;
        pt.y = event.clientY;
        const svgP = pt.matrixTransform(this.myRef.getScreenCTM().inverse());

        if( svgP.x < (padding) || 
            svgP.x > (this.width+(padding)) || 
            svgP.y > (this.height+(padding)) || 
            svgP.y < (padding)) {
            return;
        }
        updatedCopyPoint = {x: svgP.x, y: svgP.y};
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
        const pt = this.myRef.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const svgP = pt.matrixTransform(this.myRef.getScreenCTM().inverse());
        const points = this.state.points;
        const padding = this.padding/2; 

        if( svgP.x < (padding) || 
            svgP.x > (this.width+(padding)) || 
            svgP.y > (this.height+(padding)) || 
            svgP.y < (this.padding/2)) {
            return;
        }
        newPoint = this.unNormalizePoint({x: svgP.x, y: svgP.y});
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
        const min = this.padding/2;
        const maxX = this.width+min;
        const maxY = this.height+min; 
        const normalizedX = (point.x*(maxX-min))+min; 
        const normalizedY = (point.y*(maxY-min))+min;
        const reverseY = (this.height+this.padding)-normalizedY;

        
        return {x:normalizedX, y:reverseY};
    }

    private normalizeGraphLabel(point: Point, minX, minY, maxX, maxY) {
        const normalizedX = (point.x*(maxX-minX))+minX;
        const normalizedY = (point.y*(maxY-minY))+minY;
        const reverseY = (this.height+this.padding)-normalizedY;

        return {x: normalizedX, y: reverseY};
    } 

    private normalizeXLabel(points: Point[]) {
        const minX = this.padding/2;
        const minY = 0;
        const maxX = this.width+this.padding/2;
        const maxY = this.padding/2;
        const normalizedPoints: Point[] = [];
        for(const point of points){
            normalizedPoints.push(this.normalizeGraphLabel(point, minX, minY, maxX, maxY));
        }

        return normalizedPoints;
    }

    private normalizeYLabel(points: Point[]) {
        const minX = 0;
        const minY = this.padding/2;
        const maxX = this.padding/2;
        const maxY = this.height+this.padding/2;
        const normalizedPoints: Point[] = [];
        for(const point of points) {
            normalizedPoints.push(this.normalizeGraphLabel(point, minX, minY, maxX, maxY));
        }
        return normalizedPoints;
    }

    private unNormalizePoint(point: Point) {
        const min = this.padding/2;
        const maxX = this.width+min; 
        const maxY = this.height+min;
        const unNormalizedX = (point.x-min)/(maxX-min);

        // we have to take into account that we reversed y when we first normalized it.
        const unNormalizedY = ((this.height+this.padding)-point.y-min)/(maxY-min); 

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
      }
    
    public componentDidMount() {
        ['resize', 'scroll'].forEach(event => {
            window.addEventListener(event, this.resizingWindow);
        });
      }
    
    public componentDidUnMount() {
        ['resize', 'scroll'].forEach(event => {
            window.addEventListener(event, this.resizingWindow);
        });
    }
    
}

ReactDOM.render(<CanvasComponent />, appRoot);

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