import * as React from 'react';

import PointInfoComponent from './PointInfoComponent';

interface PointComponentProps {
    id: number;
    x: number;
    y: number;
    nX: number;
    nY: number;
    selected: boolean;
    delete: (() => void); 
    onMouseDown: (() => void);
    onClick: (() => void); 
}

export default class PointComponent extends React.Component<any, any> {
    constructor(props: any){
        super(props);
        this.state = {show: false}
        
        this.handleHover = this.handleHover.bind(this);
        this.handleHoverOff = this.handleHoverOff.bind(this);
    }

    private handleHover() {
        this.setState({show: true});
    }

    private handleHoverOff(){
        this.setState({show: false});
    }
    
    public render() {
        return this.props.selected ? ([
            <circle
                r="10"
                key={`${this.props.id}circle`}
                id={`${this.props.id}`} 
                cx={this.props.x} 
                cy={this.props.y} 
                onMouseEnter={this.handleHover} 
                onMouseLeave={this.handleHoverOff}
                onMouseDown={this.props.onMouseDown}
                fill="#8DEEEE"
                stroke="black"
                strokeWidth="5"
            />,
            <PointInfoComponent 
                x={this.props.x} 
                y={this.props.y}
                nX={this.props.nX}
                nY={this.props.nY}
                key={`${this.props.id}pointinfo`}
                id={this.props.id}
                delete={this.props.delete}
                width={100}
                height={80}
                show={true}
            />
        ]) : ([
            <circle 
                r="10"
                key={`${this.props.id}circle`}
                id={`${this.props.id}`}
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
                key={`${this.props.id}pointinfo`}
                id={this.props.id}
                width={100}
                height={80}
                delete={this.props.delete}
                show={this.state.show}
            />
        ]);
    }
}