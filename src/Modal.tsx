import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class Modal extends React.Component<any, any> {
    private el: HTMLDivElement;
    private modalRoot: HTMLElement;
    constructor(props: any) {
        super(props);
        this.el = document.createElement('div');

        const modalRoot = document.getElementById('modal-root');
        if (modalRoot === null) {throw new Error(`'modal-root' element missing`)}
        this.modalRoot = modalRoot
    }

    public componentDidMount() {
        this.modalRoot.appendChild(this.el);
    }

    public componentWillUnmount() {
        this.modalRoot.removeChild(this.el);
    }

    public render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el,
        )
    }
}