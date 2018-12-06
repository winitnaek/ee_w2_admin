import { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Tooltip, Table } from 'reactstrap';
import { renderToString } from 'react-dom/server';
import { divStyleFloatNone, OUTPUT_AUDIT, OUTPUT_CLIENT_DTL, OUTPUT_CLIENT_SUM, OUTPUT_MESSAGES } from '../../base/constants/AppConstants';

const viewer_path = '/pdfjs/web/viewer.html?file=';
const viewer_url = window.location.protocol + '//' + window.location.host + viewer_path;

class ViewCompanyAuditFiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            backdrop: 'static',
            ckSumSel: this.props.audits.showClientKitSumPdf,
            ckDetSel: this.props.audits.showClientKitDetPdf,
            auditSel: false,
            msgSel: false,
            printSel: false,
            ckSumSelTip: false,
            ckDetSelTip: false,
            auditSelTip: false,
            msgSelTip: false,
            printSelTip: false,
            title: this.props.title
        };
        this.toggle = this.toggle.bind(this);
        this.changeBackdrop = this.changeBackdrop.bind(this);
        this.toggleCkSumSelTip = this.toggleCkSumSelTip.bind(this);
        this.toggleCkDetSelTip = this.toggleCkDetSelTip.bind(this);
        this.toggleAuditSelTip = this.toggleAuditSelTip.bind(this);
        this.toggleMsgSelTip = this.toggleMsgSelTip.bind(this);
        this.togglePrintSelTip = this.togglePrintSelTip.bind(this);
        this.handlePopulateAudit = this.handlePopulateAudit.bind(this);
        this.renderPDFData = this.renderPDFData.bind(this);
        this.renderErrorPDF = this.renderErrorPDF.bind(this);
        this.getNoMsgFoundHtml = this.getNoMsgFoundHtml.bind(this);
        this.buildMessageTableHtml = this.buildMessageTableHtml.bind(this);
        this.createMsgRows = this.createMsgRows.bind(this);
        this.onCkSumSel = this.onCkSumSel.bind(this);
        this.onCkDetSel = this.onCkDetSel.bind(this);
        this.onAuditSel = this.onAuditSel.bind(this);
        this.onMsgSel = this.onMsgSel.bind(this);
        this.onPrintSel = this.onPrintSel.bind(this);
        this.renderOutput = this.renderOutput.bind(this);
        this.renderOutputs = this.renderOutputs.bind(this);
        this.getAuditFileType = this.getAuditFileType.bind(this);
        this.downloadAuditZip = this.downloadAuditZip.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
    }

    toggle() {
        this.props.handleHideAuditPDF();
    }

    getAuditFileType() {
        let fileType = this.state.ckDetSel ? OUTPUT_CLIENT_DTL : OUTPUT_CLIENT_SUM;
        fileType = this.state.auditSel ? OUTPUT_AUDIT : fileType;
        fileType = this.state.msgSel ? OUTPUT_MESSAGES : fileType;
        return fileType;
    }

    handlePopulateAudit() {
        console.log('in view comp audit files handlePopulatePDF..');
        //
        let outputFilters = this.getOutputFilters();
        let dataset = outputFilters.dataset;
        let compId = outputFilters.compId;
        let reqNo = outputFilters.reqNo;
        let fileType = this.getAuditFileType();
        //
        this.props.actions.getAuditOutput(dataset, compId, reqNo, fileType).then(() => {
            console.log('Get Company Output Done.');

            if (this.props.viewcompdata.outputDoc) {
                if (OUTPUT_CLIENT_SUM === fileType || OUTPUT_CLIENT_DTL === fileType) {
                    this.renderPDFData(this.props.viewcompdata.outputDoc);
                } else if (OUTPUT_AUDIT === fileType) {
                    this.downloadAuditZip(this.props.viewcompdata.outputDoc);
                } else { // Messages
                    this.renderMessages(this.props.viewcompdata.messages);
                }
            } else {
                this.renderErrorPDF();
            }
        });
    }
    renderMessages(messages) {
        let msgComponentHtml = "";
        
        if (messages) {
            msgComponentHtml += this.buildMessageTableHtml();
        } else {
            msgComponentHtml += this.getNoMsgFoundHtml();
        }

        let frameObj = document.getElementById('pdfi-frame');

        if (frameObj.getAttribute('src')) {
            frameObj.removeAttribute('src');
        }

        frameObj.setAttribute('srcdoc', msgComponentHtml);
    }
    downloadAuditZip(output) {
        const data = window.URL.createObjectURL(output);
        var link = document.createElement('a');
        link.href = data;
        link.download = "Audits.zip";
        link.click();
        setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
        }, 100);
    }
    renderPDFData(output) {
        let dataPdf = window.URL.createObjectURL(output);
        let frameObj = document.getElementById('pdfi-frame');

        if (frameObj.getAttribute('srcdoc')) {
            frameObj.removeAttribute('srcdoc');
        }

        frameObj.setAttribute('src', viewer_url + encodeURIComponent(dataPdf));
    }
    renderErrorPDF() {
        var printFrame = document.getElementById('pdfi-frame');
        let errorContent = `<html><head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></head><body><div class="alert alert-danger" style="margin:3px;" role="alert"><strong>Error: </strong>Unable to get company audit files. Please contact your system administrator.</div></body></html>`;
        if (printFrame) {
            printFrame.height = '100';
            printFrame.src = "data:text/html;charset=utf-8," + errorContent;
        }
    }
    getNoMsgFoundHtml() {
        return `<html><head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></head><body><div class="alert alert-warning" style="margin:3px;" role="alert"><strong>Warning: </strong>No messages found!</div></body></html>`;
    }
    createMsgRows() {
        let rows = [];
        this.props.viewcompdata.messages.forEach(r => {
            rows.push(
            <tr>
                <td>{r.msg}</td>
                <td class="text-center">{r.severity}</td>
            </tr>);
        });
        return rows;
    }
    buildMessageTableHtml() {
        let markup = '<html><head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></head><body><div>';
        markup += renderToString (
            <div>
                <Table hover responsive>
                    <thead>
                        <tr class="text-center">
                            <th>Message</th> 
                            <th>Severity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.createMsgRows()}
                    </tbody>
                </Table>
            </div>
        );
        markup += '</div></body></html>';
        return markup;
    }
    changeBackdrop(e) {
        let value = e.target.value;
        if (value !== 'static') {
            value = JSON.parse(value);
        }
        this.setState({
            backdrop: value
        });
    }
    toggleCkSumSelTip() {
        this.setState({
            ckSumSelTip: !this.state.ckSumSelTip
        });
    }
    toggleCkDetSelTip() {
        this.setState({
            ckDetSelTip: !this.state.ckDetSelTip
        });
    }
    toggleAuditSelTip() {
        this.setState({
            auditSelTip: !this.state.auditSelTip
        });
    }
    toggleMsgSelTip() {
        this.setState({
            msgSelTip: !this.state.msgSelTip
        });
    }
    togglePrintSelTip() {
        this.setState({
            printSelTip: !this.state.printSelTip
        });
    }
    onCkSumSel() {
        this.state.ckSumSel = true;
        this.state.ckDetSel = !this.state.ckSumSel;
        this.state.auditSel = !this.state.ckSumSel;
        this.state.msgSel = !this.state.ckSumSel;
        this.state.printSel = !this.state.ckSumSel;
        this.handlePopulateAudit();
    }
    onCkDetSel() {
        this.state.ckDetSel = true;
        this.state.ckSumSel = !this.state.ckDetSel;
        this.state.auditSel = !this.state.ckDetSel;
        this.state.msgSel = !this.state.ckDetSel;
        this.state.printSel = !this.state.ckDetSel;
        this.handlePopulateAudit();
    }
    onAuditSel() {
        this.state.auditSel = true;
        this.state.ckSumSel = !this.state.auditSel;
        this.state.ckDetSel = !this.state.auditSel;
        this.state.msgSel = !this.state.auditSel;
        this.state.printSel = !this.state.auditSel;
        this.handlePopulateAudit();
    }
    onMsgSel() {
        this.state.msgSel = true;
        this.state.ckSumSel = !this.state.msgSel;
        this.state.ckDetSel = !this.state.msgSel;
        this.state.auditSel = !this.state.msgSel;
        this.state.printSel = !this.state.msgSel;
        this.handlePopulateAudit();
    }
    onPrintSel() {
    }
    renderOutput(outputFilters) {
        return (
            <div>
                <Modal size="lg"  style={{ 'max-width': window.innerWidth-200}} isOpen={this.props.view} toggle={this.toggle} backdrop="static" className="align-items: center;justify-content: center">
                <ModalHeader toggle={this.toggle} className="d-block p-2 text-align-center">
                    <h3 class="text-center text-bsi">{this.props.title}</h3>
                    <div class="d-flex m-auto justify-content-center align-items-center text-align-center">
                        <div class={false ? 'd-none' : 'd-block p-2'}>
                            <a href="#" style={divStyleFloatNone} class={false ? 'd-none' : 'd-block'}  onClick={() => this.onCkSumSel()} id="ckSumIcon"><i class='fas fa-file-pdf fa-lg'></i></a>
                            <p class={false ? 'd-none' : 'd-block text-bsi small'}>Client Kit Summary</p>
                            <Tooltip className={false ? 'd-none' : 'd-block'} placement="top" isOpen={this.state.ckSumSelTip} target="ckSumIcon" toggle={this.toggleCkSumSelTip}>
                                Show Client Kit Summary PDF
                            </Tooltip>
                        </div>
                        <div class={false ? 'd-none' : 'd-block p-2'}>
                            <a href="#" style={divStyleFloatNone} class={false ? 'd-none' : 'd-block'}  onClick={() => this.onCkDetSel()} id="ckDetIcon"><i class='fas fa-file-pdf fa-lg'></i></a>
                            <p class={false ? 'd-none' : 'd-block text-bsi small'}>Client Kit Details</p>
                            <Tooltip className={false ? 'd-none' : 'd-block'} placement="top" isOpen={this.state.ckDetSelTip} target="ckDetIcon" toggle={this.toggleCkDetSelTip}>
                                Show Client Kit Details PDF
                            </Tooltip>
                        </div>
                        <div class={false ? 'd-none' : 'd-block p-2'}>
                            <a href="#" style={divStyleFloatNone} class={false ? 'd-none' : 'd-block'}  onClick={() => this.onAuditSel()} id="auditIcon"><i class='fas fa-file fa-lg'></i></a>
                            <p class={false ? 'd-none' : 'd-block text-bsi small'}>Audit Logs</p>
                            <Tooltip className={false ? 'd-none' : 'd-block'} placement="top" isOpen={this.state.auditSelTip} target="auditIcon" toggle={this.toggleAuditSelTip}>
                                Download Audit Logs
                            </Tooltip>
                        </div>
                        <div class={false ? 'd-none' : 'd-block p-2'}>
                            <a href="#" style={divStyleFloatNone} class={false ? 'd-none' : 'd-block'}  onClick={() => this.onMsgSel()} id="msgIcon"><i class='fas fa-envelope fa-lg'></i></a>
                            <p class={false ? 'd-none' : 'd-block text-bsi small'}>Messages</p>
                            <Tooltip className={false ? 'd-none' : 'd-block'} placement="top" isOpen={this.state.msgSelTip} target="msgIcon" toggle={this.toggleMsgSelTip}>
                                Show Messages
                            </Tooltip>
                        </div>
                        <div class={false ? 'd-none' : 'd-block p-2'}>
                            <a href="#" style={divStyleFloatNone} class={false ? 'd-none' : 'd-block'}  onClick={() => this.onPrintSel()} id="printIcon"><i class='fas fa-print fa-lg'></i></a>
                            <p class={false ? 'd-none' : 'd-block text-bsi small'}>Print All W2s</p>
                            <Tooltip className={false ? 'd-none' : 'd-block'} placement="top" isOpen={this.state.printSelTip} target="printIcon" toggle={this.togglePrintSelTip}>
                                Print All W2 PDFs
                            </Tooltip>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <iframe id="pdfi-frame" width="100%" height={window.innerHeight-200} allowfullscreen webkitallowfullscreen ></iframe>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>Close</Button>
                </ModalFooter>
                </Modal>
            </div>
        );
    }
    renderOutputs(outputFilters) {
        this.state.outputFilters = outputFilters;

        if (this.state.ckSumSel || this.state.ckDetSel || this.state.msgSel || this.state.auditSel || this.state.printSel) {
            return this.renderOutput(outputFilters);
        }
    }
    componentDidMount() {
        this.getOutputFilters = this.props.getOutputFilters;
        if (this.state.ckSumSel) {
            setTimeout(this.handlePopulateAudit());
        }
    }
    render() {
        return (
            <div>
                {this.renderOutputs(this.props.outputFilters)}
            </div>
        );
    }
}

export default ViewCompanyAuditFiles;