import React from 'react';
import ReactDOM from 'react-dom';

export default class InfoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {showModal: false};

        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);
    }

    handleShow() {
        this.setState({showModal: true});
    }

    handleHide = () =>  {
        this.setState({showModal: false});
    }
    
    render() {
        const modal = this.state.showModal ? (
            <Modal>
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
                    r="15" 
                    cx="1100" 
                    cy="80" 
                    fill={this.props.fill}
                    stroke={this.props.fill}
                    strokeWidth={this.props.strokeWidth}
                    onClick={this.handleShow}
                    />
                <text onClick={this.handleShow} className="medium" x="1097" y="90">i</text> 
                {modal}
            </g>
        );
    }
}

class Modal extends React.Component {

    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.modalRoot = document.getElementById('modal-root');
    }

    componentDidMount() {
        this.modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        this.modalRoot.removeChild(this.el);
    }

    // React does *not* create a new div. It renders the children into `domNode`.
    // `domNode` is any valid DOM node, regardless of its location in the DOM.
    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el
        );
    }
}