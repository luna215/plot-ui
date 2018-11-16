import * as React from 'react';

interface PointInfoComponentProps {
    id: number;
    x: number;
    y: number;
    height: number;
    width: number;
    show: boolean;
    nX: number;
    nY: number;
    delete: ((id:number) => void);
}

export default class PointInfoComponent extends React.Component<PointInfoComponentProps, any> {

    private delete = () => {
        this.props.delete(this.props.id);
    }

    public render() {
        const content = this.props.delete ? ([    
            <rect key={`${this.props.id}rect`} className={this.props.show ? "show info" : "hide"} x={15+this.props.x} y={this.props.y-this.props.height} width={this.props.width} height={this.props.height} ry="15" rx="15" />,
            <text key={`${this.props.id}x`} x={20+this.props.x} y={this.props.y-this.props.height+20} className={this.props.show ? "show" : "hide"}>x: {this.props.nX.toFixed(2)}</text>,
            <text key={this.props.id+"y"} x={20+this.props.x} y={this.props.y-this.props.height+40} className={this.props.show ? "show " : "hide"}>y: {this.props.nY.toFixed(2)}</text>,
            <g key={`${this.props.id}delete-div`} className={this.props.show ? "show delete-button" : "hide"} onClick={this.delete}>
                <rect key={`${this.props.id}delete-button`}  rx="10" ry="10" x={this.props.x+(this.props.width/4)} y={this.props.y-this.props.height+50} width={this.props.width-25} height={this.props.height/3}/>
                <text key={`${this.props.id}delete-text`} x={(this.props.x+(this.props.width/4)+((this.props.width-20)/4))-10} y={this.props.y-this.props.height+70}>Delete</text>
            </g>
        ]) : ([
            <rect key={`${this.props.id}rect`} className={this.props.show ? "show info" : "hide"} x={15+this.props.x} y={this.props.y-this.props.height} width={this.props.width} height={this.props.height} ry="15" rx="15" />,
            <text key={`{this.props.id}x`} x={20+this.props.x} y={this.props.y-this.props.height+20} className={this.props.show ? "show" : "hide"}>x: {this.props.nX.toFixed(2)}</text>,
            <text key={`${this.props.id}y`} x={20+this.props.x} y={this.props.y-this.props.height+40} className={this.props.show ? "show " : "hide"}>y: {this.props.nY.toFixed(2)}</text>,
            ]);
        return content;
    }
}