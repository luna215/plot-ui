import * as React from 'react';

import Modal from './Modal';

export default class InfoComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {showModal: false};
    }

    public render() {
        const modal = this.state.showModal ? (
            < Modal>
                <div className="modal">
                    <div className="inside-modal">
                        <header>
                            <h1>How To Use</h1>
                        </header>
                        <hr />
                        <section>
                             <h3>Moving Point:</h3>
                             <p>You are able to move any point on the graph EXCEPT the two end points.</p>
                        </section>
                        <hr />
                        <section>
                            <h3>Adding Point:</h3>
                            <p>Double click on an empty space on the graph to add a point</p>
                            <p><b>OR</b></p>
                            <p>You can input exact point in the input spaces down below</p>
                        </section> 
                        <hr />
                        <section>
                            <h3>Deleting Point:</h3>
                            <p>Click a point</p>
                        </section>
                        <section>
                            <h3>Ordering:</h3>
                            <p>Points are ordered from least -> greatest based on their x value.</p>
                        </section>
                        <footer>
                            <button className="default-button" onClick={this.handleHide}>Close</button>
                        </footer>
                    </div> 
                </div>
            </Modal>
        ) : null;
        return (
            <g>
                <circle 
                    className="infoCircle" 
                    r="20" 
                    cx={this.props.cx} 
                    cy={this.props.cy} 
                    fill={this.props.fill}
                    stroke={this.props.fill}
                    strokeWidth={this.props.strokeWidth}
                    onClick={this.handleShow}
                    />
                <text onClick={this.handleShow} className="medium" x={this.props.x} y={this.props.y}>i</text> 
                {modal}
            </g>
        );
    }

    private handleShow = () => {
        this.setState({showModal: true});
    }

    private handleHide = () =>  {
        this.setState({showModal: false});
    }
}