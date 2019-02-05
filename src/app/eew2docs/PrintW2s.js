import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class PrintW2s extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPrint: this.props.showPrint,
            closeAll: false
        };
        this.toggleUIPrintOk = this.toggleUIPrintOk.bind(this);
        this.toggleUIPrintCancel = this.toggleUIPrintCancel.bind(this);
    }

    toggleUIPrintOk() {
        this.props.handleOk();
    }
    toggleUIPrintCancel() {
        this.props.handleCancel();
    }
    render() {
        return (
            <div>
                <Modal size="lg" isOpen={this.props.showPrint} backdrop="static">
                    <ModalHeader>Print W2 Records</ModalHeader>
                    <ModalBody>TDB</ModalBody>
                    <ModalFooter>
                        <Button color="secondary" className="btn btn-primary mr-auto" onClick={() => this.toggleUIPrintCancel()}>Cancel</Button>{' '}
                        <Button onClick={() => this.toggleUIPrintOk()}  color="success">Print W2s</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
export default PrintW2s;