import React from 'react';
import { Alert, Tooltip, Button} from 'reactstrap';
import { divStyle, divStyleBot, divStyleFirst, divStyleFirstBot, divStyleR, OUTPUT_CLIENT_DTL, OUTPUT_CLIENT_SUM, PDF_ANCHOR_ID, DFLT_PAGE_SIZE } from '../../base/constants/AppConstants';
import { RN_FILTER_PAYROLL_DATA } from '../../base/constants/RenderNames';
import JqxGrid from '../../deps/jqwidgets-react/react_jqxgrid.js';
import UIAlert from '../common/UIAlert';
import UIConfirm from '../common/UIConfirm';
import ViewPDF from '../common/ViewPDF';
import ViewCompanyAuditFiles from '../comp_outputs/ViewCompanyAuditFiles';
import PrintW2s from './PrintW2s';

const viewer_path ='/pdfjs/web/viewer.html?file=';
const viewer_url  = window.location.protocol+'//'+window.location.host+viewer_path;

class EEW2Records extends React.Component {
    constructor(props) {
        super(props);
        let eeW2GetRecInput = this.props.eew2data.eew2recordInput;
        console.debug("EE W2 Get Records input data --> ", eeW2GetRecInput);
        let getRecsUrl = this.props.eew2data.getRecsUrl;
        console.debug("EE W2 Get Records URL --> ", getRecsUrl);
        let source =
            {
                datatype: "json",
                datafields: [
                    { name: 'tranName', type: 'string' },
                    { name: 'tranFein', type: 'int' },
                    { name: 'compName', type: 'string' },
                    { name: 'compFein', type: 'int' },
                    { name: 'empId', type: 'string' },
                    { name: 'empFname', type: 'string' },
                    { name: 'empLname', type: 'string' },
                    { name: 'reportId', type: 'string' },
                    { name: 'isPublished', type: 'boolean' },
                    { name: 'isPrinted', type: 'boolean' },
                    { name: 'requestno', type: 'int' },
                    { name: 'generatedDateTime', type: 'date' },
                    { name: 'empkey', type: 'string' },
                    { name: 'last4digits', type: 'string' },
                    { name: 'year', type: 'int' }
                ],
                url: getRecsUrl,
                type: "POST",
                data: eeW2GetRecInput,
                filter: function() {
                    // update the grid and send a request to the server.
                    let _id = document.querySelector("div[role='grid']").id;
                    $('#' + _id).jqxGrid('updatebounddata', 'filter');
                },
                sort: function() {
                    // update the grid and send a request to the server.
                    let _id = document.querySelector("div[role='grid']").id;
                    $('#' + _id).jqxGrid('updatebounddata', 'sort');
                },
                beforeprocessing: function(data) {
                    if (data != null && data.length > 0) {
                        source.totalrecords = data[0].totalRecords;
                    }
                }
            };
            this.toggleSuccess = this.toggleSuccess.bind(this);
            this.toggleExpExl=this.toggleExpExl.bind(this);
            this.toggleExpCsv=this.toggleExpCsv.bind(this);
            this.toggleSelAll=this.toggleSelAll.bind(this);
            this.toggleRstAll=this.toggleRstAll.bind(this);
            this.togglePstSel=this.togglePstSel.bind(this);
            this.togglePubW2Sel=this.togglePubW2Sel.bind(this);
            this.toggleUnPubW2Sel=this.toggleUnPubW2Sel.bind(this);
            this.togglePrintW2s=this.togglePrintW2s.bind(this);
            this.toggleDelSel=this.toggleDelSel.bind(this);
            this.toggleFilDat=this.toggleFilDat.bind(this);
            this.hoverOff=this.hoverOff.bind(this);
            this.hoverOn=this.hoverOn.bind(this);
            this.hideUIAlert=this.hideUIAlert.bind(this);
            this.handleConfirmOk = this.handleConfirmOk.bind(this);
            this.handleConfirmCancel = this.handleConfirmCancel.bind(this);
            this.handleHidePDF = this.handleHidePDF.bind(this);
            this.handleShowPDF = this.handleShowPDF.bind(this);
            this.handleHideAuditPDF = this.handleHideAuditPDF.bind(this);
            this.handleShowAuditPDF = this.handleShowAuditPDF.bind(this);
            this.handleShowMessages = this.handleShowMessages.bind(this);
            this.handleInProgress = this.handleInProgress.bind(this);
            this.refreshDataSel = this.refreshDataSel.bind(this);
            this.handlePrintOk = this.handlePrintOk.bind(this);
            this.handlePrintCancel = this.handlePrintCancel.bind(this);
            
        this.state = {
            source: source,
            exptoExlTip:false,
            exptoCsvTip:false,
            selectAll:false,
            resetAll:false,
            generateOutput:false,
            publishW2:false,
            unpublishW2:false,
            printW2s:false,
            deleSelected:false,
            filterData:false,
            hover: false,
            showAlert:false,
            aheader:'',
            abody:'',
            abtnlbl:'',
            showConfirm:false,
            cheader:'',
            cbody:'',
            showPDF: false,
            title:'',
            outputSuccess: false,
            showAudits: false,
            outputMessage: false,
            allSelected:false,
            audits: {
                showClientKitSumPdf: false,
                showClientKitDetPdf: false
            },
            showPrint:false
        };
        //this.interval = setInterval(this.handleInProgress.bind(this), 60000);
    }
    handleInProgress(){
        const dataset = appDataset();
        this.props.actions.isOutputGenerationInprogress(dataset)
    }
    hoverOn(){
        this.setState({ hover: true });
    }
    hoverOff(){ 
        this.setState({ hover: false });    
    }
    goToFilterPage() {
        renderW2AdmApplication(appAnchor(), RN_FILTER_PAYROLL_DATA);
    }
    exportToExcel(){
        this.refs.eew2Grid.exportdata('xls', 'EEW2Records');
    }
    exportToCsv(){
        this.refs.eew2Grid.exportdata('csv', 'EEW2Records');
    }
    selectAllClk(){
        this.refs.eew2Grid.clearselection();
        this.showConfirm(true,'Select All', this.getSelAllMessage());
    }
    getSelAllMessage(){
        let grindRecInputData  = this.props.eew2data.eew2recordInput;
        let cbody = 'This selection will operate Generate W2s, Publish/Un-Publish W2s actions on Dataset :'+grindRecInputData.dataset+' for Year :'+ grindRecInputData.year+" and all the Companies and Employees selected on the \"Manage W2 Records\" filter."
        return cbody;
    }
    resetAll(){
        this.setState({
            allSelected: false
        });
       
        this.setState({
            allSelected: false
        });
        this.refreshDataSel();
    }
    refreshDataSel(){
        let grindRecInputData  = this.props.eew2data.eew2recordInput;
        this.state.source.data=grindRecInputData;
        this.state.source.url=this.props.eew2data.getRecsUrl;
        this.refs.eew2Grid.clearfilters();
        this.refs.eew2Grid.updatebounddata('data');
        this.refs.eew2Grid.clearselection();
    }
    unpublishW2(){
        let selIndexes = this.refs.eew2Grid.getselectedrowindexes();
        if(selIndexes.length >0 || this.state.allSelected){
            const dataset = appDataset();
            this.setState({outputSuccess: false});
            if(selIndexes.length >0){
                let publishCount=0;
                selIndexes.forEach(index => {
                    let data = this.refs.eew2Grid.getrowdata(index);
                    if(data.isPublished==true){
                            publishCount++;
                    }
                });
                //if(publishCount >0){
                    let taxYear = "";
                    selIndexes.forEach(index => {
                        let data = this.refs.eew2Grid.getrowdata(index);
                        taxYear = data.year
                        return;
                    });
                    var w2RequestInputs=[];
                    selIndexes.forEach(index => {
                        let data = this.refs.eew2Grid.getrowdata(index);
                        w2RequestInputs.push({"transmitterId":data.tranFein,"companyId":data.compFein,"empkey":data.empkey});
                    });
                    console.log('w2RequestInputs generateOutput===>');
                    console.log(w2RequestInputs);
                    var eew2recordInput = {
                        "dataset": dataset,
                        "year": taxYear,
                        "toUnpublish":true,
                        "w2RequestInputs": w2RequestInputs
                    };
                    console.log('unpublishW2 eew2recordInput ==>');
                    console.log(eew2recordInput);
                    this.props.actions.publishUnpublishEEW2Records(eew2recordInput).then(response => {
                        selIndexes.forEach(index => {
                            let data = this.refs.eew2Grid.getrowdata(index);
                            this.props.eew2data.eew2ecords.forEach(function (emp) {
                                if(data.compFein==emp.compFein && data.isPublished ==true && data.empkey == emp.empkey){
                                    emp.isPublished=false;
                                }
                            });
                        });
                        this.refs.eew2Grid.updatebounddata('data');
                        this.toggleSuccess('Employee W2 Output Un-Published Successfully!');
                        this.interval = setInterval(this.tick.bind(this), 300000);
                        return response
                    }).catch(error => {
                        throw new SubmissionError(error)
                    });
                //}
            }else if(this.state.allSelected){
                console.log('this.props.eew2data.eew2recordInput');
                let grindRecInputData  = this.props.eew2data.eew2recordInput;
                console.log('grindRecInputData Inside Select All Un-Publish.');
                console.log(grindRecInputData);
                var eew2recordInput = {
                    "dataset": grindRecInputData.dataset,
                    "year": grindRecInputData.year,
                    "toUnpublish":true,
                    "w2RequestInputs": grindRecInputData.w2RequestInputs
                };
                console.log('unpublishW2 eew2recordInput All==>');
                console.log(eew2recordInput);
                this.props.actions.publishUnpublishEEW2Records(eew2recordInput).then(response => {
                    selIndexes.forEach(index => {
                        let data = this.refs.eew2Grid.getrowdata(index);
                        this.props.eew2data.eew2ecords.forEach(function (emp) {
                            if(data.compFein==emp.compFein && data.isPublished ==true && data.empkey == emp.empkey){
                                emp.isPublished=false;
                            }
                        });
                    });
                    //this.refs.eew2Grid.clearselection();
                    this.refs.eew2Grid.updatebounddata('data');
                    this.toggleSuccess('Employee W2 Output Un-Published Successfully!');
                    this.interval = setInterval(this.tick.bind(this), 300000);
                    return response
                }).catch(error => {
                    throw new SubmissionError(error)
                });

            }
        }else{
            this.showAlert(true,'Publish W2','Please select at least one employee record from grid or check Select All option to Un-Publish W2 output.');
        }
    }
    publishW2(){
        let selIndexes = this.refs.eew2Grid.getselectedrowindexes();
        if(selIndexes.length >0 || this.state.allSelected){
            this.setState({outputSuccess: false});
            if(selIndexes.length >0){
                const dataset = appDataset();
                let unpublishCount=0;
                selIndexes.forEach(index => {
                    let data = this.refs.eew2Grid.getrowdata(index);
                    if(data.isPublished ==false){
                            unpublishCount++;
                    }
                });
                //if(unpublishCount >0){
                    let taxYear = "";
                    selIndexes.forEach(index => {
                        let data = this.refs.eew2Grid.getrowdata(index);
                        taxYear = data.year
                        return;
                    });
                    var w2RequestInputs=[];
                    selIndexes.forEach(index => {
                        let data = this.refs.eew2Grid.getrowdata(index);
                        w2RequestInputs.push({"transmitterId":data.tranFein,"companyId":data.compFein,"empkey":data.empkey});
                    });
                    console.log('w2RequestInputs generateOutput===>');
                    console.log(w2RequestInputs);
                    var eew2recordInput = {
                        "dataset": dataset,
                        "year": taxYear,
                        "toUnpublish":false,
                        "w2RequestInputs": w2RequestInputs
                    };
                    console.log('publishW2 eew2recordInput ==>');
                    console.log(eew2recordInput);
                    this.props.actions.publishUnpublishEEW2Records(eew2recordInput).then(response => {
                        selIndexes.forEach(index => {
                            let data = this.refs.eew2Grid.getrowdata(index);
                            this.props.eew2data.eew2ecords.forEach(function (emp) {
                                if(data.compFein==emp.compFein && data.isPublished ==false && data.empkey == emp.empkey){
                                    emp.isPublished=true;
                                }
                            });
                        });
                        this.refs.eew2Grid.updatebounddata('data');
                        this.toggleSuccess('Employee W2 Output Published Successfully!');
                        this.interval = setInterval(this.tick.bind(this), 300000);
                        return response
                    }).catch(error => {
                        throw new SubmissionError(error)
                    })
                //}
            }else if(this.state.allSelected){
                console.log('this.props.eew2data.eew2recordInput');
                let grindRecInputData  = this.props.eew2data.eew2recordInput;
                console.log('grindRecInputData Inside Select All Publish.');
                console.log(grindRecInputData);
                var eew2recordInput = {
                    "dataset": grindRecInputData.dataset,
                    "year": grindRecInputData.year,
                    "toUnpublish":false,
                    "w2RequestInputs": grindRecInputData.w2RequestInputs
                };
                console.log('publishW2 eew2recordInput All ==>');
                console.log(eew2recordInput);
                this.props.actions.publishUnpublishEEW2Records(eew2recordInput).then(response => {
                    selIndexes.forEach(index => {
                        let data = this.refs.eew2Grid.getrowdata(index);
                        this.props.eew2data.eew2ecords.forEach(function (emp) {
                            if(data.compFein==emp.compFein && data.isPublished ==false && data.empkey == emp.empkey){
                                emp.isPublished=true;
                            }
                        });
                    });
                    this.refs.eew2Grid.updatebounddata('data');
                    this.toggleSuccess('Employee W2 Output Published Successfully!');
                    this.interval = setInterval(this.tick.bind(this), 300000);
                    return response
                }).catch(error => {
                    throw new SubmissionError(error)
                })
            }
        }else{
            this.showAlert(true,'Publish W2','Please select at least one employee record from grid or check Select All option to Publish W2 output.');
        }
    }
    
    printW2s(){
        this.setState({
            showPrint: true
        });
    }
    toggleSuccess(message){
        this.setState({
            outputSuccess: !this.state.outputSuccess,
            outputMessage:message
        });
    }
    generateOutput(){
       let selIndexes = this.refs.eew2Grid.getselectedrowindexes();
       if(selIndexes.length >0 || this.state.allSelected){
            this.setState({outputSuccess: false});
            if(selIndexes.length >0){
                const dataset = appDataset();
                let taxYear = "";
                selIndexes.forEach(index => {
                    let data = this.refs.eew2Grid.getrowdata(index);
                    taxYear = data.year
                    return;
                });
                var w2RequestInputs=[];
                selIndexes.forEach(index => {
                    let data = this.refs.eew2Grid.getrowdata(index);
                    w2RequestInputs.push({"transmitterId":data.tranFein,"companyId":data.compFein,"empkey":data.empkey});
                });
                console.log('w2RequestInputs generateOutput===>');
                console.log(w2RequestInputs);
                var eew2recordInput = {
                    "dataset": dataset,
                    "year": taxYear,
                    "w2RequestInputs": w2RequestInputs
                };
                console.log('generateOutput eew2recordInput ==>');
                console.log(eew2recordInput);
                this.props.actions.generateOutputs(eew2recordInput).then(response => {
                    this.refs.eew2Grid.clearselection();
                    this.toggleSuccess('Employee W2 Output Generated Successfully!');
                    this.interval = setInterval(this.tick.bind(this), 300000);
                    return response
                }).catch(error => {
                    throw new SubmissionError(error)
                })
            }else if(this.state.allSelected){
                let grindRecInputData  = this.props.eew2data.eew2recordInput;
                var eew2recordInput = {
                    "dataset": grindRecInputData.dataset,
                    "year": grindRecInputData.year,
                    "w2RequestInputs": grindRecInputData.w2RequestInputs
                };
                console.log('generateOutput eew2recordInput ==>');
                console.log(eew2recordInput);
                this.props.actions.generateOutputs(eew2recordInput).then(response => {
                    this.refs.eew2Grid.clearselection();
                    this.toggleSuccess('Employee W2 Output Generated Successfully!');
                    this.interval = setInterval(this.tick.bind(this), 300000);
                    return response
                }).catch(error => {
                    throw new SubmissionError(error)
                })
            }
       }else{
            this.showAlert(true,'Generate W2','Please select at least one employee record from grid or check Select All option to Generate W2s.');
       }
    }
    tick(){
        clearInterval(this.interval);
        this.toggleSuccess('');
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.w2data && nextProps.w2data.loadeew2) {
            //$('[data-toggle="tooltip"]').tooltip('hide');
            var w2data = {
                loadeew2: false,
                eew2id: ''
            }
            this.props.actions.loadPdfData(w2data);
            let data = this.refs.eew2Grid.getrowdata(nextProps.w2data.eew2id);
            this.handleShowPDF(data);
        }else if(nextProps.compdata && nextProps.compdata.loadcomp){
            //$('[data-toggle="tooltip"]').tooltip('hide');
            var compdata = {
                loadcomp:false,
                compid:''
              }
            this.props.actions.loadCompData(compdata);
            let data = this.refs.eew2Grid.getrowdata(nextProps.compdata.compid);
            this.handleShowMessages(data, null);
        }
    }
    showConfirm(cshow, cheader, cbody){
        this.setState({
            showConfirm: cshow,
            cheader:cheader,
            cbody:cbody
        });
    }
    showAlert(ashow,aheader,abody){
        this.setState({
            showAlert: ashow,
            aheader:aheader,
            abody:abody
        });
    }
    toggleExpExl() {
        this.setState({
            exptoExlTip: !this.state.exptoExlTip
        });
    }
    toggleExpCsv() {
        this.setState({
            exptoCsvTip: !this.state.exptoCsvTip
        });
    }
    toggleSelAll(){
        this.setState({
            selectAll: !this.state.selectAll
        });
    }
    toggleRstAll(){
        this.setState({
            resetAll: !this.state.resetAll
        });
    }
    togglePstSel(){
        this.setState({
            generateOutput: !this.state.generateOutput
        });
    }
    toggleUnPubW2Sel(){
        this.setState({
            unpublishW2: !this.state.unpublishW2
        });
    }
    togglePrintW2s(){
        this.setState({
            printW2s: !this.state.printW2s
        });
    }
    togglePubW2Sel(){
        this.setState({
            publishW2: !this.state.publishW2
        });
    }
    toggleDelSel(){
        this.setState({
            deleSelected: !this.state.deleSelected
        });
    }
    toggleFilDat(){
        this.setState({
            filterData: !this.state.filterData
        }); 
    }
    componentDidMount() {
        //$('.tooltipempw2').tooltip({trigger : 'hover'});
        //$('.tooltipcomp2').tooltip({trigger : 'hover'});
        this.refs.eew2Grid.on('rowclick', (event) => {
            this.setState({
                allSelected: false
            });
        });
    }
    componentDidUpdate(){
        //$('.tooltipempw2').tooltip({trigger : 'hover'});
        //$('.tooltipcomp2').tooltip({trigger : 'hover'});
    }
    hideUIAlert(){
        this.setState({
            showAlert: !this.state.showAlert
        });
    }
    handleConfirmOk(){
        console.log('hideUIConfirmOk');
        this.handleConfirmCancel();
        this.setState({
            allSelected: true
        });
        this.refreshDataSel();
    }
    handleConfirmCancel(){
        console.log('hideUIConfirmCancel');
        this.setState({
            showConfirm: !this.state.showConfirm,allSelected: false
        });
    }
    handlePrintOk(){
        console.log('handlePrintOk');
        this.handlePrintCancel();
    }
    handlePrintCancel(){
        console.log('handlePrintCancel');
        this.setState({
            showPrint: !this.state.showPrint
        });
    }
    componentWillMount(){
        
    }
    handleHidePDF() {
        this.setState({ showPDF: false })
    }
    handleShowPDF(rowdata) {
        let eew2pdf ='JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
        'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
        'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
        'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
        'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
        'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
        'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
        'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
        'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
        'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
        'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
        'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
        'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G';
        this.setState({
            showPDF: true,
            title: rowdata.empFname+' '+rowdata.empLname+ ' W2 PDF'
        })
        //this.renderPDFData(eew2pdf);
        console.log('rowdata');
        console.log(rowdata);
        
        let reqNo=rowdata.requestno;//226; //
        let fein =rowdata.compFein;
        let empId=rowdata.empkey;//'001907'; 
        const dataset = appDataset();
        console.log('dataset : '+dataset+', reqNo : '+reqNo+', fein : '+fein+', empId : '+empId);
        //let reqNo=123;
        //let fein =123456789;
        //let empId=222333444;

        this.props.actions.getEEW2Pdf(dataset, reqNo, fein, empId).then(() => {
            if(this.props.eew2data.eew2pdf.docData){
                this.renderPDFData(this.props.eew2data.eew2pdf);
            }else if(this.props.eew2data.eew2pdf.type =='AppError'){
                this.renderErrorPDF(this.props.eew2data.eew2pdf);
            }
        });
    }
    handleShowMessages(rowdata, title) {
        this.setState({
            title: (!title ? `Showing Viewable/Downloadable Artifacts for ${rowdata.compName}` : title),
            audits: {
                showMessages: true,
                inputParams: rowdata
            },
            showAudits: true
        });
    }
    handleShowAuditPDF(rowdata, title, pdfType) {
        let isSumPdf = (OUTPUT_CLIENT_SUM === pdfType);
        let isDetPdf = (OUTPUT_CLIENT_DTL === pdfType);
        this.setState({
            title: (!title ? `Showing Viewable/Downloadable Artifacts for ${rowdata.compName}` : title),
            audits: {
                showClientKitSumPdf: isSumPdf,
                showClientKitDetPdf: isDetPdf
            },
            showAudits: isSumPdf || isDetPdf
        });
    }
    handleHideAuditPDF() {
        this.setState({
            audits: {
                showClientKitSumPdf: false,
                showClientKitDetPdf: false
            },
            showAudits: false
        });
    }
    getOutputFilters(inputParams) {
        const dataset = appDataset();
        let outputFilters = {
            "dataset": dataset,
            "compId": inputParams.compFein,
            "reqNo": inputParams.requestno
        };
        return outputFilters;
    }
    renderPDFData(eew2pdf){
        var raw = window.atob(eew2pdf.docData);
        //var raw = window.atob(eew2pdf);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));
        for(var i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        var pdfAsArray = array;
        var binaryData = [];
        binaryData.push(pdfAsArray);
        var dataPdf = window.URL.createObjectURL(new Blob(binaryData, {type: "application/pdf"}))
        document.getElementById(PDF_ANCHOR_ID).setAttribute('src',viewer_url + encodeURIComponent(dataPdf));
    }
    renderErrorPDF(yrEndTaxDoc) {
        var printFrame = document.getElementById(PDF_ANCHOR_ID);
        let errorContent = `<html><head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></head><body><div class="alert alert-danger" style="margin:3px;" role="alert"><strong>Error: </strong>Unable to Get Year End Tax Document. Please contact your system administrator.</div></body></html>`;
        if (printFrame) {
            printFrame.height='100'
            printFrame.src = "data:text/html;charset=utf-8,"+errorContent
        }
    }
    render() {
        var source = this.state.source;
        let dataAdapter = new $.jqx.dataAdapter(source, {
            // remove the comment to debug
            formatData: function(data) {
                // alert(JSON.stringify(data));
                var noOfFilters = data.filterscount;
                var i;
                for (i = 0; i < noOfFilters; i++) {
                    if ("generatedDateTime" === data["filterdatafield" + i]) {
                        data["filtervalue" + i] = $.jqx.formatDate(new Date(data["filtervalue" + i]), 'yyyyMMdd');
                        // alert(data["filtervalue" + i]);
                    }
                }
                return data;
            },
            downloadComplete: function(data, status, xhr) {
                if (!source.totalrecords) {
                    source.totalrecords = data.length;
                }
            },
            loadError: function(xhr, status, error) {
                throw new Error(error);
            }
        });

        let uiAlert    =   <UIAlert handleClick={this.hideUIAlert}  showAlert={this.state.showAlert} aheader={this.state.aheader} abody={this.state.abody} abtnlbl={'Ok'}/>;
        let uiDelConfirm = <UIConfirm handleOk={this.handleConfirmOk} handleCancel={this.handleConfirmCancel}  showConfirm={this.state.showConfirm} cheader={this.state.cheader} cbody={this.state.cbody} okbtnlbl={'Ok'} cancelbtnlbl={'Cancel'}/>;

        let printW2s = <PrintW2s handleOk={this.handlePrintOk} handleCancel={this.handlePrintCancel} showPrint={this.state.showPrint} />

        let data = this.props.eew2data;
        let cbody  = 'Select All'; //this.getSelAllMessage();
        let selectall = <div><a href="#" style={divStyleFirst} onClick={() => this.selectAllClk()} id="selectAllid"><i class="fas fa-check-square fa-lg"></i></a>
        <Tooltip placement="top" isOpen={this.state.selectAll} target="selectAllid" toggle={this.toggleSelAll}>
            {cbody}
        </Tooltip></div>

        let selectallnone = <div><a href="#" style={divStyleFirst} onClick={() => this.selectAllClk()} id="selectAllid"><i class="far fa-square fa-lg"></i></a>
        <Tooltip placement="top" isOpen={this.state.selectAll} target="selectAllid" toggle={this.toggleSelAll}>
            {cbody}
        </Tooltip></div>
        
        let printrenderer = (row, column, value) => {
            if(value){
                return '<div style="text-align:center;padding-top:5px;" class="align-self-center align-middle"><i class="fas fa-check"></i></div>';
            }else{
                return '';
            }
        }
        let pubrenderer= (row, column, value) => {
            if(value){
                return '<div style="text-align:center;padding-top:5px;" class="align-self-center align-middle"><i class="fas fa-check"></i></div>';
            }else{
                return '';
            }
        }
        let formatssn = (row, column, value) => {
            if(value != ''){
                return '<div style="text-align:center;padding-top:5px;" class="align-self-center align-middle">XXX-XX-'+value.substring(5, 9)+'</div>';
            }else{
                return '';
            }
        }
        const getEEW2PDF = (id)=>{
            let data =this.refs.eew2Grid.getrowdata(id);
            this.handleShowPDF(data);
        }
        let columns =
            [
                { text: 'Company Name', datafield: 'compName',  cellsalign: 'center',width: 'auto', align: 'center', cellsrenderer: function (ndex, datafield, value, defaultvalue, column, rowdata) {
                    return `<a href="#" data-toggle="tooltip" class="tooltipcomp2" title="View Company Artifacts"><div style="text-align:center;" class="align-self-center align-middle"><button type="button" style="padding-top:0.1rem;" class="btn btn-link align-self-center" onClick={onloadCompData('${ndex}')}>${rowdata.compName}</button></div></a>`;
                   },filtertype: 'input'},
                { text: 'Run Date/Time', datafield: 'generatedDateTime', width: 'auto', cellsformat: 'MM-dd-yyyy hh:mm:00 tt', filtertype: 'range' },
                { text: 'First Name', cellclassname:"gridcelltxt", datafield: 'empFname', cellsalign: 'center', align: 'center',width: 'auto',filtertype: 'input' },
                   { text: 'Last Name', datafield: 'lastName', cellsalign: 'center', align: 'center',width: 'auto',cellsrenderer: function (ndex, datafield, value, defaultvalue, column, rowdata) {
                    return `<a href="#" data-toggle="tooltip" class="tooltipempw2" title="View W2 PDF"><div style="text-align:center;" class="align-self-center align-middle"><button type="button" style="padding-top:0.1rem;" class="btn btn-link align-self-center" onClick={onloadPdfData('${ndex}')}>${rowdata.empLname}</button></div></a>`;
                   },filtertype: 'input'},
                { text: '  SSN  ', datafield: 'last4digits', cellsalign: 'center', align: 'center', width: 'auto', filterable: false, sortable: false },
                { text: 'Published', datafield: 'isPublished',cellsalign: 'center', align: 'center', cellsrenderer: pubrenderer,  width: 'auto',filtertype: 'bool', },
                { text: 'Printed', datafield: 'isPrinted', cellsalign: 'center', align: 'center', cellsrenderer: printrenderer, width: 'auto', filtertype: 'bool',},
            ];
        return (
            <div>
                <h3 class="text-bsi">Manage W2 Records 
                    <a href="#" onClick={() => this.goToFilterPage()} id="filterDataId"><i class="fas fa-filter fa-xs" title="Filter Payroll Data"></i></a>
                    <Tooltip placement="right" isOpen={this.state.filterData} target="filterDataId" toggle={this.toggleFilDat}>
                    Filter Payroll Data
                    </Tooltip>
                </h3>
                <Alert color="primary">
                    {data.filterlabel}
                </Alert>
                <Alert color="success" isOpen={this.state.outputSuccess}>
                    {this.state.outputMessage}
                </Alert>
                {this.state.allSelected ? selectall: selectallnone}
                <a href="#"  style={divStyle} onClick={() => this.resetAll()} id="resetAll"><i class='fas fa-redo-alt fa-lg'></i></a>
                <Tooltip placement="right" isOpen={this.state.resetAll} target="resetAll" toggle={this.toggleRstAll}>
                    Reset Selection
                </Tooltip>
                <a href="#" style={divStyleR} onClick={() => this.printW2s()} id="printW2s"><i class='fas fa-print fa-lg'></i></a>
                <Tooltip placement="right" isOpen={this.state.printW2s} target="printW2s" toggle={this.togglePrintW2s}>
                   Print W2s
                </Tooltip>
                <a href="#" style={divStyleR} onClick={() => this.unpublishW2()} id="unpublishW2"><i class='fas fa-calendar-minus fa-lg'></i></a>
                <Tooltip placement="bottom" isOpen={this.state.unpublishW2} target="unpublishW2" toggle={this.toggleUnPubW2Sel}>
                   Un-Publish W2
                </Tooltip>
                <a href="#" style={divStyleR} onClick={() => this.publishW2()} id="publishW2"><i class='fas fa-calendar-plus fa-lg'></i></a>
                <Tooltip placement="top" isOpen={this.state.publishW2} target="publishW2" toggle={this.togglePubW2Sel}>
                   Publish W2
                </Tooltip>
                <a href="#" style={divStyleR} onClick={() => this.generateOutput()} id="generateOutput"><i class='fas fa-calculator fa-lg'></i></a>
                <Tooltip placement="bottom" isOpen={this.state.generateOutput} target="generateOutput" toggle={this.togglePstSel}>
                    Generate W2
                </Tooltip>
                <JqxGrid ref='eew2Grid'
                    width={'100%'} source={dataAdapter} pageable={true}
                    sortable={true} altrows={false} enabletooltips={false}
                    autoheight={true} editable={false} columns={columns}
                    filterable={true} showfilterrow={true} virtualmode={true}
                    rendergridrows={function(obj){return obj.data;}}
                    selectionmode={'multiplerows'} cache={false}/>
                <a href="#"  style={divStyleFirstBot} onClick={() => this.exportToExcel()} id="exportToExcel"><i class='fas fa-table fa-lg'></i></a>
                <Tooltip placement="bottom" isOpen={this.state.exptoExlTip} target="exportToExcel" toggle={this.toggleExpExl}>
                    Export To Excel
                </Tooltip>
                <a href="#"  style={divStyleBot} onClick={() => this.exportToCsv()} id="exportToCsv"><i class='fas fa-pen-square fa-lg'></i></a>
                <Tooltip placement="right" isOpen={this.state.exptoCsvTip} target="exportToCsv" toggle={this.toggleExpCsv}>
                    Export To CSV
                </Tooltip>
                {this.props.isoutinprogress ? (<span href="#"  style={divStyleR} id="inProgressSpinner"> <i class="fas fa-spinner fa-spin"></i> Output Generation is in Progress..</span>) : null}
                {uiAlert}
                {uiDelConfirm}
                {this.state.showPDF ? (<ViewPDF view={this.state.showPDF} title={this.state.title} handleHidePDF={this.handleHidePDF} />) : null}
                {this.state.showAudits ? (<ViewCompanyAuditFiles isOpen="true" title={this.state.title} view="true" actions={this.props.actions}
                                                audits={this.state.audits} viewcompdata={this.props.viewcompdata} getOutputFilters={this.getOutputFilters} 
                                                handleShowAuditPDF={this.handleShowAuditPDF} handleHideAuditPDF={this.handleHideAuditPDF} />) : null}
                {this.state.showPrint ? (printW2s):null}                                                
            </div>
        );
    }
}
export default EEW2Records;