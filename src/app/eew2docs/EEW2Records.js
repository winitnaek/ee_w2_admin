import React from 'react';
import { Alert, Tooltip, Button } from 'reactstrap';
import { divStyle, divStyleBot, divStyleFirst, divStyleFirstBot, divStyleR, OUTPUT_CLIENT_DTL, OUTPUT_CLIENT_SUM, PDF_ANCHOR_ID, DFLT_PAGE_SIZE,divStyleRDisable } from '../../base/constants/AppConstants';
import { RN_FILTER_PAYROLL_DATA } from '../../base/constants/RenderNames';
import JqxGrid from '../../deps/jqwidgets-react/react_jqxgrid.js';
import UIAlert from '../common/UIAlert';
import UIConfirm from '../common/UIConfirm';
import ViewPDF from '../common/ViewPDF';
import ViewCompanyAuditFiles from '../comp_outputs/ViewCompanyAuditFiles';
import PrintW2s from './PrintW2s';
import FilterPayrollData from './FilterPayrollData';
import eew2Api from './eew2AdminAPI';

const viewer_path ='/pdfjs/web/viewer.html?file=';
const viewer_url  = window.location.protocol+'//'+window.location.host+viewer_path;
const PRINTGEN_TIMER =10000;
const TICK_TIMER=300000;
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
                    { name: 'year', type: 'int' },
                    { name: 'correction', type: 'boolean' }
                ],
                url: getRecsUrl,
                type: "POST",
                contenttype: "application/json",
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
            this.toggleSuccessNew = this.toggleSuccessNew.bind(this);
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
            this.toggleFromGrid = this.toggleFromGrid.bind(this);
            this.onViewFailedMessages = this.onViewFailedMessages.bind(this);
            this.handlePrintProgress = this.handlePrintProgress.bind(this);
            this.hlptogglettt1 = this.hlptogglettt1.bind(this);
            
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
            showPrint:false,
            openFromGrid:false,
            totalRec:'',
            selecRec:'',
            optSelec:'',
            recordsSelected:'',
            divStyleRD:false,
            hlptooltipOpen1:false
        };
        //this.handleInProgress();
        this.interval = setInterval(this.handleInProgress.bind(this), PRINTGEN_TIMER);
       // this.interval = setInterval(this.handlePrintProgress.bind(this), PRINTGEN_TIMER);
    }
     hlptogglettt1() {
        this.setState({
          hlptooltipOpen1: !this.state.hlptooltipOpen1
        });
    }
    handleInProgress(){
        const dataset = appDataset();
        this.props.actions.isOutputGenerationInprogress(dataset).then(response => {
            if(this.props.isoutinprogress.status==='In-Progress'){
                console.log('isOutputGenerationInprogress In-Progress');
                this.setState({divStyleRD:true, outputSuccess: false});
            }else if(this.props.isoutinprogress.status==='Failed'){
                console.log('isOutputGenerationInprogress Failed');
                this.setState({divStyleRD:false,outputSuccess: false});
            }else if(this.props.isoutinprogress.status==='Processed'){
                this.setState({divStyleRD:false});
                console.log('isOutputGenerationInprogress Processed');
            }
            return response
        }).catch(error => {
            throw new SubmissionError(error)
        });
    }
    handlePrintProgress(){
        const dataset = appDataset();
        this.props.actions.isPrintGenerationInprogress(dataset)
    }
    hoverOn(){
        this.setState({ hover: true });
    }
    hoverOff(){ 
        this.setState({ hover: false });    
    }
    goToFilterPage() {
        this.setState({ openFromGrid: true });   
    }
    toggleFromGrid(){
        this.setState({ openFromGrid: false });   
    }
    exportToExcel(){
        this.refs.eew2Grid.exportdata('xls', 'EEW2Records');
    }
    exportToCsv(){
        this.refs.eew2Grid.exportdata('csv', 'EEW2Records');
    }
    selectAllClk(){
        if(this.state.allSelected){
            this.setState({
                allSelected: false
            });
        }else{
            this.refs.eew2Grid.clearselection();
            this.showConfirm(true,'Select All', this.getSelAllMessage());
        }
        
    }
    getSelAllMessage(){
        let grindRecInputData  = this.props.eew2data.eew2recordInput;
        let cbody = 'Employees that satisfy the filter condition set in ‘Manage W2 Records’ modal display in this grid. From here, one can view, generate, publish and/or un-publish W2s for these Employees.';
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
                        this.toggleSuccess('Un-Publishing of W2s initiated for the selected Employees.');
                        this.interval = setInterval(this.tick.bind(this), TICK_TIMER);
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
                    this.toggleSuccess('Un-Publishing of W2s initiated for the selected Employees.');
                    this.interval = setInterval(this.tick.bind(this), TICK_TIMER);
                    return response
                }).catch(error => {
                    throw new SubmissionError(error)
                });

            }
        }else{
            this.showAlert(true,'Publish W2','Please select at least one employee record from the grid or check Select All option to Un-Publish W2 output.');
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
                        this.toggleSuccess('Publishing of W2s initiated for the selected Employees.');
                        this.interval = setInterval(this.tick.bind(this), TICK_TIMER);
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
                    this.toggleSuccess('Publishing of W2s initiated for the selected Employees.');
                    this.interval = setInterval(this.tick.bind(this), TICK_TIMER);
                    return response
                }).catch(error => {
                    throw new SubmissionError(error)
                })
            }
        }else{
            this.showAlert(true,'Publish W2','Please select at least one employee record from the grid or check Select All option to Publish W2 output.');
        }
    }
    
    printW2s(){
        let selIndexes = this.refs.eew2Grid.getselectedrowindexes();
        let optSelec=1;
        var recSelected=[];
        if(this.state.allSelected){
            optSelec =1;
        }else if(selIndexes.length > 0 && this.state.allSelected==false){
            optSelec =2;
        }
      if(selIndexes.length >0 || this.state.allSelected){
            this.setState({outputSuccess: false});
            if(selIndexes.length >0){
               selIndexes.forEach(index => {
                    let data = this.refs.eew2Grid.getrowdata(index);
                    recSelected.push(data);
                });
            }
        }
        if(selIndexes.length >0 || this.state.allSelected){
            let totalRecordsInGrid = this.state.source.totalrecords
           this.setState({
                showPrint: true, selecRec:selIndexes.length,optSelec:optSelec,totalRec:totalRecordsInGrid,recordsSelected:recSelected
            });
        }else{
            this.showAlert(true,'Print W2','Please select at least one employee record from the grid or check Select All option to Print W2s.');
        }
    }
    toggleSuccess(message){
        this.setState({
            outputSuccess: !this.state.outputSuccess,
            outputMessage:message
        });
    }
    toggleSuccessNew(message, isShowOn){
        this.setState({
            outputSuccess: isShowOn,
            outputMessage:message
        });
    }
    generateOutput(){
       let selIndexes = this.refs.eew2Grid.getselectedrowindexes();
       this.setState({outputSuccess: false});
       if(selIndexes.length >0 || this.state.allSelected){
        this.toggleSuccessNew('Initiating W2 Generation...', true);
           
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
                    this.setState({outputSuccess: false});
                    this.refs.eew2Grid.clearselection();
                    this.toggleSuccessNew('Generation of W2s initiated for the selected Employees.',true);
                   this.interval = setInterval(this.tick.bind(this), TICK_TIMER);
                   this.handleInProgress();
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
                eew2Api.generateOutputs(eew2recordInput).then(response => response).then((repos) => {
                    console.log('Generate output count received : '+repos)
                    this.setState({outputSuccess: false});
                    this.toggleSuccessNew('Generation of W2s initiated for the selected Employees.', true);
                    this.refs.eew2Grid.clearselection();
                    this.interval = setInterval(this.tick.bind(this), TICK_TIMER);
                    this.handleInProgress();
                    return repos
                });
                /*this.props.actions.generateOutputs(eew2recordInput).then(response => {
                    this.setState({outputSuccess: false});
                    //this.handleInProgress();
                    this.refs.eew2Grid.clearselection();
                    this.toggleSuccessNew('Generation of W2s initiated for the selected Employees.', true);
                    this.interval = setInterval(this.tick.bind(this), TICK_TIMER);
                    return response
                }).catch(error => {
                    throw new SubmissionError(error)
                })*/
            }
       }else{
            this.showAlert(true,'Generate W2','Please select at least one employee record from the grid or check Select All option to Generate W2s.');
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
        console.log('rowdata');
        console.log(rowdata);
        this.setState({
            title: (!title ? `${rowdata.compName}` : title),
            audits: {
                showMessages: true,
                inputParams: rowdata
            },
            showAudits: true
        });
    }
    onViewFailedMessages(requestno,title,fein){
        let rowdata ={"compFein": fein,"compName":title,"requestno":requestno};
        this.setState({
            title: (!title ? `${rowdata.compName}` : title),
            audits: {
                showMessages: true,
                inputParams: rowdata,
                disableOtherIcons:true
            },
            showAudits: true
        });
    }
    handleShowAuditPDF(rowdata, title, pdfType) {
        let isSumPdf = (OUTPUT_CLIENT_SUM === pdfType);
        let isDetPdf = (OUTPUT_CLIENT_DTL === pdfType);
        this.setState({
            title: (!title ? `${rowdata.compName}` : title),
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
                try {
                    return JSON.stringify(data);
                } catch (error) {
                    return data;
                }
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
        let filter = <FilterPayrollData openFromGrid={this.state.openFromGrid} toggleFromGrid={this.toggleFromGrid} initgridData={ this.props.eew2data.w2dgridata}/>
        let uiAlert    =   <UIAlert handleClick={this.hideUIAlert}  showAlert={this.state.showAlert} aheader={this.state.aheader} abody={this.state.abody} abtnlbl={'Ok'}/>;
        let uiDelConfirm = <UIConfirm handleOk={this.handleConfirmOk} handleCancel={this.handleConfirmCancel}  showConfirm={this.state.showConfirm} cheader={this.state.cheader} cbody={this.state.cbody} okbtnlbl={'Ok'} cancelbtnlbl={'Cancel'}/>;
        let data = this.props.eew2data;
        let printW2s = <PrintW2s handleOk={this.handlePrintOk} handleCancel={this.handlePrintCancel} showPrint={this.state.showPrint} totalRec={this.state.totalRec} optSelec={this.state.optSelec} selecRec={this.state.selecRec} filterlabel={'Number of W2s selected for the print for Year '+data.eew2recordInput.year} recordsSelected={this.state.recordsSelected} year={data.eew2recordInput.year}/>
        let cbody  = 'Select All'; //this.getSelAllMessage();
        let selectall = <div><a href="#" style={divStyleFirst} onClick={() => this.selectAllClk()} id="selectAllid"><i class="fas fa-check-square fa-lg"></i></a>
        <Tooltip placement="top" isOpen={this.state.selectAll} target="selectAllid" toggle={this.toggleSelAll}>
            {cbody}
        </Tooltip></div>

        let selectallnone = <div><a href="#" style={divStyleFirst} onClick={() => this.selectAllClk()} id="selectAllid"><i class="far fa-square fa-lg"></i></a>
        <Tooltip placement="top" isOpen={this.state.selectAll} target="selectAllid" toggle={this.toggleSelAll}>
            {cbody}
        </Tooltip></div>
        
        let corrrenderer = (row, column, value) => {
            if(value){
                return '<div style="text-align:center;padding-top:5px;" class="align-self-center align-middle"><i class="fas fa-check"></i></div>';
            }else{
                return '';
            }
        }
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
                { text: 'Run Date/Time', datafield: 'generatedDateTime', width: 'auto',  cellsalign: 'center',align: 'center',  cellsformat: 'MM-dd-yyyy hh:mm:00 tt', filtertype: 'range' },
                { text: 'First Name', cellclassname:"gridcelltxt", datafield: 'empFname', cellsalign: 'center', align: 'center',width: 'auto',filtertype: 'input' },
                   { text: 'Last Name', datafield: 'lastName', cellsalign: 'center', align: 'center',width: 'auto',cellsrenderer: function (ndex, datafield, value, defaultvalue, column, rowdata) {
                    return `<a href="#" data-toggle="tooltip" class="tooltipempw2" title="View W2 PDF"><div style="text-align:center;" class="align-self-center align-middle"><button type="button" style="padding-top:0.1rem;" class="btn btn-link align-self-center" onClick={onloadPdfData('${ndex}')}>${rowdata.empLname}</button></div></a>`;
                   },filtertype: 'input'},
                { text: '  SSN  ', datafield: 'last4digits', cellsalign: 'center', align: 'center', width: 'auto', filterable: false, sortable: false },
                { text: 'Published', datafield: 'isPublished',cellsalign: 'center', align: 'center', cellsrenderer: pubrenderer,  width: 'auto',filtertype: 'bool' },
                { text: 'Printed', datafield: 'isPrinted', cellsalign: 'center', align: 'center', cellsrenderer: printrenderer, width: 'auto', filtertype: 'bool' },
                { text: 'Corrected', datafield: 'correction', cellsalign: 'center', align: 'center', cellsrenderer:     corrrenderer, width: 'auto', filtertype: 'bool' }
            ];
        return (
            <div>
                <h3 class="text-bsi">Manage W2 Records 
                    <a href="#" onClick={() => this.goToFilterPage()} id="filterDataId"><i class="fas fa-filter fa-xs" title="Filter"></i></a>
                    <Tooltip placement="top" isOpen={this.state.filterData} target="filterDataId" toggle={this.toggleFilDat}>
                   
                    Filter
                    </Tooltip> 
                     &nbsp;<a target="_blank" id="_ew2_hlpttip1" href="javascript:window.open('/help/ew2','_blank');"><i class="fas fa-question-circle fa-xs pl-1"></i></a><Tooltip placement="right" isOpen={this.state.hlptooltipOpen1} target="_ew2_hlpttip1" toggle={this.hlptogglettt1}>Help</Tooltip>
                </h3>
                <Alert color="primary">
                    {data.filterlabel}
                </Alert>
                <Alert color="success" isOpen={this.state.outputSuccess}>
                    {this.state.outputMessage}
                </Alert>
                <Alert color="success" isOpen={this.props.isoutinprogress.status==='In-Progress'}>
                    <span href="#" id="inProgressSpinner"> <i class="fas fa-spinner fa-spin"></i> Output Generation is In-Progress.</span>
                </Alert>
                <Alert color="danger" isOpen={this.props.isoutinprogress.status==='Failed'}>
                    <span href="#" id="inProgressSpinner"> <i class="fas fa-spinner"></i> Output Generation Failed. <Button style={{padding:'0em'}}  onClick={() => this.onViewFailedMessages(this.props.isoutinprogress.requestno,this.props.isoutinprogress.compName,this.props.isoutinprogress.compFein)} color="link">View Messages</Button></span>
                </Alert>
                <Alert color="success" isOpen={this.props.isprintinprogress.status==='In-Progress'}>
                    <span href="#" id="inProgressSpinner"> <i class="fas fa-spinner fa-spin"></i> Printing W2s is In-Progress.</span>
                </Alert>
                <Alert color="danger" isOpen={this.props.isprintinprogress.status==='Failed'}>
                    <span href="#" id="inProgressSpinner"> <i class="fas fa-spinner"></i> Printing of W2s Failed. Please contact your system administrator.</span>
                </Alert>
                {this.state.allSelected ? selectall: selectallnone}
                <a href="#"  style={divStyle} onClick={() => this.resetAll()} id="resetAll"><i class='fas fa-redo-alt fa-lg'></i></a>
                <Tooltip placement="right" isOpen={this.state.resetAll} target="resetAll" toggle={this.toggleRstAll}>
                    Reset Selection
                </Tooltip>
                <a href="#" style={this.state.divStyleRD==false ? divStyleR: divStyleRDisable} onClick={() => this.printW2s()} id="printW2s"><i class='fas fa-print fa-lg'></i></a>
               
                <Tooltip placement="right" isOpen={this.state.printW2s} target="printW2s" toggle={this.togglePrintW2s}>
                   Print W2s
                </Tooltip>
                <a href="#" style={this.state.divStyleRD==false ? divStyleR: divStyleRDisable} onClick={() => this.unpublishW2()} id="unpublishW2"><i class='fas fa-calendar-minus fa-lg'></i></a>
              
                <Tooltip placement="bottom" isOpen={this.state.unpublishW2} target="unpublishW2" toggle={this.toggleUnPubW2Sel}>
                   Un-Publish W2
                </Tooltip>
                <a href="#" style={this.state.divStyleRD==false ? divStyleR: divStyleRDisable} onClick={() => this.publishW2()} id="publishW2"><i class='fas fa-calendar-plus fa-lg'></i></a>
               
                <Tooltip placement="top" isOpen={this.state.publishW2} target="publishW2" toggle={this.togglePubW2Sel}>
                   Publish W2
                </Tooltip>
                <a href="#" style={this.state.divStyleRD==false ? divStyleR: divStyleRDisable} onClick={() => this.generateOutput()} id="generateOutput"><i class='fas fa-tasks fa-lg'></i></a>
                <Tooltip placement="left" isOpen={this.state.generateOutput} target="generateOutput" toggle={this.togglePstSel}>
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
               
                {uiAlert}
                {uiDelConfirm}
                {this.state.showPDF ? (<ViewPDF view={this.state.showPDF} title={this.state.title} handleHidePDF={this.handleHidePDF} />) : null}
                {this.state.showAudits ? (<ViewCompanyAuditFiles isOpen="true" year={this.props.eew2data.eew2recordInput.year} 
                                                title={this.state.title} view="true" actions={this.props.actions}
                                                audits={this.state.audits} viewcompdata={this.props.viewcompdata} getOutputFilters={this.getOutputFilters} 
                                                handleShowAuditPDF={this.handleShowAuditPDF} handleHideAuditPDF={this.handleHideAuditPDF} />) : null}
                {this.state.showPrint ? (printW2s):null}
                {this.state.openFromGrid ? (filter) : null}                                              
            </div>
        );
    }
}
export default EEW2Records;