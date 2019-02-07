import { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Tooltip } from 'reactstrap';
import { divStyleFloatNone, NON_PDF_ANCHOR_ID, OUTPUT_AUDIT, OUTPUT_CLIENT_DTL, OUTPUT_CLIENT_SUM, OUTPUT_MESSAGES, OUTPUT_PRINT, PDF_ANCHOR_ID } from '../../base/constants/AppConstants';
import Messages from '../comp_outputs/Messages';
import compApi from './compdataAPI';


const viewer_path = '/pdfjs/web/viewer.html?file=';
const viewer_url = window.location.protocol + '//' + window.location.host + viewer_path;
const printdataset = "00_EE_W2_DATA";
const printId= "236305,236309";

class ViewCompanyAuditFiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            backdrop: 'static',
            ckSumSel: false,
            ckDetSel: false,
            auditSel: false,
            msgSel: this.props.audits.showMessages,
            inputParams: this.props.audits.inputParams,
            renderMsg: false,
            printSel: false,
            ckSumSelTip: false,
            ckDetSelTip: false,
            auditSelTip: false,
            msgSelTip: false,
            printSelTip: false,
            title: this.props.title,
            messages: []
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
        this.onCkSumSel = this.onCkSumSel.bind(this);
        this.onCkDetSel = this.onCkDetSel.bind(this);
        this.onAuditSel = this.onAuditSel.bind(this);
        this.onMsgSel = this.onMsgSel.bind(this);
        this.onPrintSel = this.onPrintSel.bind(this);
        this.onOutputTypeSel = this.onOutputTypeSel.bind(this);
        this.getAuditFileType = this.getAuditFileType.bind(this);
        this.downloadAuditZip = this.downloadAuditZip.bind(this);
        this.flipPdfAnchor = this.flipPdfAnchor.bind(this);
    }

    toggle() {
        this.props.handleHideAuditPDF();
    }

    getAuditFileType() {
        let fileType = this.state.ckDetSel ? OUTPUT_CLIENT_DTL : OUTPUT_CLIENT_SUM;
        fileType = this.state.msgSel ? OUTPUT_MESSAGES : fileType;
        fileType = this.state.auditSel ? OUTPUT_AUDIT : fileType;
        return fileType;
    }

    handlePopulateAudit() {
        console.log('in view comp audit files handlePopulatePDF..');
        //
        let outputFilters = this.getOutputFilters(this.state.inputParams);
        let dataset = outputFilters.dataset;
        let compId = outputFilters.compId;
        let reqNo = outputFilters.reqNo;
        let fileType = this.getAuditFileType();
        //
        this.props.actions.getAuditOutput(dataset, compId, reqNo, fileType).then(() => {
            console.debug('Get Company Output Done.');

            if ($('#errAlrtCont')) {
                $('#errAlrtCont').addClass('d-none');
            }

            if (OUTPUT_MESSAGES === fileType && this.props.viewcompdata.messages) {
                // Get Messages Action
                this.state.messages = this.props.viewcompdata.messages;
                this.setState({
                    renderMsg: true
                });
            } else if ((OUTPUT_CLIENT_SUM === fileType || OUTPUT_CLIENT_DTL === fileType) && this.props.viewcompdata.outputDoc) {
                this.renderPDFData(this.props.viewcompdata.outputDoc);
            } else if (OUTPUT_AUDIT === fileType && this.props.viewcompdata.outputDoc) {
                this.downloadAuditZip(this.props.viewcompdata.outputDoc);
            }
        }).catch(error => {
            $('#errAlrt').html(error);
            $('#errAlrtCont').removeClass('d-none');
        });
    }
    handlePrint() {
       
       // var eew2printInput= {"dataset":printdataset,"printIds":printId}
       // compApi.printjnlp(eew2printInput); 
        //compApi.testjnlp(printdataset,printId);
       this.props.actions.testjnlp(printdataset, printId).then(() => {
            //this.renderJnlp(output);
      });
     // this.props.actions.printjnlp(eew2printInput).then(() => {
            //this.renderJnlp(output);
       //});


    }
    flipPdfAnchor(isPdf) {
        if (isPdf) {
            document.getElementById(PDF_ANCHOR_ID).classList.remove('d-none');
            document.getElementById(NON_PDF_ANCHOR_ID).classList.add('d-none');
        } else {
            document.getElementById(PDF_ANCHOR_ID).classList.add('d-none');
            document.getElementById(NON_PDF_ANCHOR_ID).classList.remove('d-none');
        }
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
        let frameObj = document.getElementById(PDF_ANCHOR_ID);

        if (frameObj.getAttribute('srcdoc')) {
            frameObj.removeAttribute('srcdoc');
        }

        frameObj.setAttribute('src', viewer_url + encodeURIComponent(dataPdf));
    }
    renderErrorPDF() {
        var printFrame = document.getElementById(PDF_ANCHOR_ID);
        let errorContent = `
            <html>
                <head>
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
                </head>
                <body>
                    <div class="alert alert-danger" style="margin:3px;" role="alert">
                        <strong>Error: </strong>Unable to get company audit files. Please contact your system administrator.
                    </div>
                    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
                </body>
            <html>`;
        if (printFrame) {
            printFrame.height = '100';
            printFrame.src = "data:text/html;charset=utf-8," + errorContent;
        }
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
        this.onOutputTypeSel(OUTPUT_CLIENT_SUM);
        this.handlePopulateAudit();
    }
    onCkDetSel() {
        this.onOutputTypeSel(OUTPUT_CLIENT_DTL);
        this.handlePopulateAudit();
    }
    onAuditSel() {
        this.onOutputTypeSel(OUTPUT_AUDIT);
        this.handlePopulateAudit();
    }
    onMsgSel() {
        this.onOutputTypeSel(OUTPUT_MESSAGES);
        this.handlePopulateAudit();
    }
    onPrintSel() {
        this.onOutputTypeSel(OUTPUT_PRINT);
        this.handlePrint();
    }
    onOutputTypeSel(outpType) {
        switch (outpType) {
            case OUTPUT_MESSAGES:
                this.state.msgSel = true;
                this.setState({
                    msgSel: true
                });
                this.state.ckSumSel = false;
                this.state.ckDetSel = false;
                this.state.auditSel = false;
                this.state.printSel = false;
                return;
            case OUTPUT_CLIENT_SUM:
                this.state.msgSel = false;
                this.state.ckSumSel = true;
                this.state.ckDetSel = false;
                this.state.auditSel = false;
                this.state.printSel = false;
                return;
            case OUTPUT_CLIENT_DTL:
                this.state.msgSel = false;
                this.state.ckSumSel = false;
                this.state.ckDetSel = true;
                this.state.auditSel = false;
                this.state.printSel = false;
                return;
            case OUTPUT_AUDIT:
                this.state.auditSel = true;
                return;
            default: // "Print" is selected
               // alert("'Print' option is selected!");
                return;
        }
    }
    componentDidMount() {
        this.getOutputFilters = this.props.getOutputFilters;
        this.onMsgSel();
    }
    render() {
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
                            <p class={false ? 'd-none' : 'd-block text-bsi small'}>Download Audit Logs</p>
                            <Tooltip className={false ? 'd-none' : 'd-block'} placement="top" isOpen={this.state.auditSelTip} target="auditIcon" toggle={this.toggleAuditSelTip}>
                                Download Audit Logs
                            </Tooltip>
                        </div>
                        <div class={false ? 'd-none' : 'd-block p-2'}>
                            <a href="#" style={divStyleFloatNone} class={false ? 'd-none' : 'd-block'} onClick={() => this.onMsgSel()} id="msgIcon"><i class='fas fa-envelope fa-lg'></i></a>
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
                    <div class="d-none alert alert-danger" id="errAlrtCont" role="alert">
                        <span id="errAlrt"></span>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    { (this.state.renderMsg && this.state.msgSel) ? (<div id={NON_PDF_ANCHOR_ID}>
                        <Messages 
                            title={this.state.title} 
                            actions={this.props.actions} viewcompdata={this.props.viewcompdata}
                            getOutputFilters={this.props.getOutputFilters} msgdata={this.state.messages}></Messages></div>) : null }
                    { !this.state.msgSel && (this.state.ckSumSel || this.state.ckDetSel) ? (<iframe id={PDF_ANCHOR_ID} 
                            width="100%" height={window.innerHeight-200} 
                            allowfullscreen webkitallowfullscreen ></iframe>) : null }
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>Close</Button>
                </ModalFooter>
                </Modal>;
            </div>
        );
    }
}

export default ViewCompanyAuditFiles;