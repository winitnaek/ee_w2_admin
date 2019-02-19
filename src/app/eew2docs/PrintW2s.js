import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {Alert, Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Col, Form,Input,Tooltip,FormFeedback,CustomInput,Badge} from 'reactstrap';
import JqxDateTimeInput from '../../deps/jqwidgets-react/react_jqxdatetimeinput.js';
import JqxGrid from '../../deps/jqwidgets-react/react_jqxgrid.js';
import {RN_EEW2_RECORDS} from '../../base/constants/RenderNames';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loadPeriodicData,loadEEW2Records,stageRecsToPrint,getRecsToPrintCount,isPrintGenerationInprogress}  from './eew2AdminAction';
import eew2Api from './eew2AdminAPI';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import {divStyleep,selZindx} from '../../base/constants/AppConstants';
import styles from '../../css/cfapp.css';
const yearSpan = 7;
const PRINT_PDFS = 1;
const ALERTINTERVAL = 300000;
const PRINTGEN_TIMER =10000;
const CURRENT_YR = new Date().getFullYear();
const printOptions = [
    { value: 'S', label: 'SSN'},
    { value: 'L', label: 'Last Name'},
    { value: 'Z', label: 'Postal Code'}
  ];
class PrintW2s extends React.Component {
        constructor(props) {
            super(props);
            var ops =[]; 
            this.props.eew2data.transmitters.forEach(function (txm) {
                ops.push({'value':txm.tfein,'label':txm.name});
            });
            //ops = _.uniqWith(ops, _.isEqual);
            let data = [];
           data = this.props.eew2data;
            let source =
            {
                datatype: "json",
                datafields: [
                    { name: 'name', type: 'string' },
                    { name: 'company', type: 'string' },
                    { name: 'type', type: 'string' }
                ],
                pagesize: 5,
                localdata: data
            };
            console.log('this.props.totalRec');
            console.log(this.props.totalRec);
            
            let totalRec = this.props.totalRec;
            let optSelec = this.props.optSelec;
            let rSelected = optSelec;
            let selecRec = this.props.selecRec;
            let w2sselected = totalRec;
            if(optSelec==2){
                w2sselected = selecRec;
            }
            let disableMeSel=false;
            if(selecRec==0){
                disableMeSel=true;
            }
            this.state = {
                source: source,
                modal: true,
                backdrop: 'static',
                pSelected:1,
                rSelected:1,
                mSelected:1,
                selectedTransmitter: '',
                companies:[],
                selectedCompany:'',
                selectedEmployees:[],
                addEmps:false,
                w2dgridata:this.props.recordsSelected,
                disableaddemp:true,
                isCompLoading:false,
                isEmpsLoading:false,
                disableviewpdf:false,
                gridHasData:false,
                ops:ops,
                inputValue: '',
                value:'',
                isEmpSelDisabled:true,
                empInfo:false,
                selAllInfo:false,
                selAllInfoc:false,
                showActionAlert:false,
                actionAlertMessage:'',
                showPrint: this.props.showPrint,
                closeAll: false,
                selectedPrintOption:printOptions[0],
                cSelected: [],
                rSelected:rSelected,
                isDisabledOpt:false,
                disableMe:false,
                disableMeSel:disableMeSel,
                totalRec:totalRec,
                selecRec:selecRec,
                w2sselected:w2sselected,
                filterlabel:this.props.filterlabel,
                year:this.props.year
                
               
            };
            this.toggleUIPrintOk = this.toggleUIPrintOk.bind(this);
            this.toggleUIPrintCancel = this.toggleUIPrintCancel.bind(this);
            this.toggle = this.toggle.bind(this);
            this.toggleaddEmpsSel = this.toggleaddEmpsSel.bind(this);
            this.changeBackdrop = this.changeBackdrop.bind(this);
            this.onActionBtnSelected = this.onActionBtnSelected.bind(this);
            this.onSetQuarter = this.onSetQuarter.bind(this);
            this.onPerformAction = this.onPerformAction.bind(this);
            this.toggleempInfo = this.toggleempInfo.bind(this);
            this.toggleselAllInfo = this.toggleselAllInfo.bind(this);
            this.toggleselAllInfoc=this.toggleselAllInfoc.bind(this);
            this.toggleActAlert = this.toggleActAlert.bind(this);
            this.onDismiss = this.onDismiss.bind(this);
            this.onActionDone = this.onActionDone.bind(this);
            this.handleSortByChange = this.handleSortByChange.bind(this);
            this.onCheckboxPrinClick = this.onCheckboxPrinClick.bind(this);
            this.onTestPrint = this.onTestPrint.bind(this);
            this.handlePrintProgress = this.handlePrintProgress.bind(this);
    }
    handlePrintProgress(){
        const dataset = appDataset();
        this.props.isPrintGenerationInprogress(dataset)
    }
    toggleUIPrintOk() {
        this.props.handleOk();
    }
    toggleUIPrintCancel() {
        clearInterval(this.printinterval);
        this.props.handleCancel();
    }
    onDismiss() {
        this.setState({ visible: false });
    }
    handleSortByChange(selectedPrintOption){
        this.setState({ selectedPrintOption });
    }
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
       if(this.state.modal){
            renderWelcomePage(appAnchor());
       }
    }
    toggleaddEmpsSel(){
        this.setState({
            addEmps: !this.state.addEmps
        });
    }
    changeBackdrop(e) {
        let value = e.target.value;
        if (value !== 'static') {
            value = JSON.parse(value);
        }
        this.setState({ backdrop: value });
    }
    onActionBtnSelected(pSelected) {
        this.setState({ pSelected });
    }
    /**
     * onSetQuarter
     * @param {*} qSelected 
     */
    onSetQuarter(qSelected){
        this.setState({ qSelected });
    }
    toggleActAlert(message){
        this.setState({
            showActionAlert: !this.state.showActionAlert,
            actionAlertMessage:message
        });
    }
    /**
     * getRequestData
     * @param {*} fromBtn 
     */
    getRequestData(actionClicked){
        var fLabel;
      //  var eew2data={};
        var w2PrintRequestInput ={};
        const dataset = appDataset();
        console.log(this.state.w2dgridata);
        console.log("SortBY:"+this.state.selectedPrintOption);
       var w2RequestInputs=[];
        this.state.w2dgridata.forEach(function (data) {
            console.log('requestno');
            console.log(data.requestno);
            if(data.empid=='All'){
                w2RequestInputs.push({"transmitterId":data.tranFein,"companyId":data.compFein,"empId":"","allRecs":true,"requestno":data.requestno});
            }else{
             var  empId = data.requestno+"~"+data.compFein+"~"+data.empkey;
                w2RequestInputs.push({"transmitterId":'',"companyId":'',"empId":empId,"allRecs":false,"requestno":data.requestno});
            }
        });
        let optSelec = this.props.optSelec;
       let printType = '';
        if(actionClicked == 1)
        printType = 'A';
        else if(actionClicked == 2)
        printType = 'S';
        else if(actionClicked== 3)
        printType = 'P';
        else if(actionClicked == 4)
        printType = 'M';

        w2PrintRequestInput = {
                 "dataset": dataset,
                 "isLatest": (this.latestOnly.checked==true) ? true:false,
                 "year": this.state.year,
                 "isCorrection": (this.correctedOnly.checked==true) ? true:false,
                 "printType":printType,
               "sortOrder":this.state.selectedPrintOption.value,
                "fromEmpNo":'',
               "toEmpNo":'',
              "isTestMode":(this.testPrintOnly.checked==true) ? true:false,
              "w2RequestInputs": w2RequestInputs
             };
             console.log('stageRecordsToPrint ===>');
             console.log(w2PrintRequestInput);
        
        return w2PrintRequestInput;
    }
    /**
     * onPerformAction
     * @param {*} actionClicked 
     */
    onPerformAction(actionClicked){
     var eew2data = this.getRequestData(actionClicked);
            console.log("Data input received:");
            console.log(eew2data);
            let printids=[];
            eew2Api.stageRecordsToPrint(eew2data).then(response => response).then((repos) => {
                console.log(repos.printIds)
                if(repos.printIds && repos.printIds.length >0){
                    printids = repos.printIds;
                    console.log(printids)
                    printids.forEach(function (printid) {
                        console.log('printids')
                        console.log(printid)
                        printids.push(printid);
                    });
                    this.handlePrintProgress();
                    this.printinterval = setInterval(this.handlePrintProgress.bind(this), PRINTGEN_TIMER);
                }
                return repos
            });
            //renderW2AdmApplication(appAnchor(),RN_EEW2_RECORDS);
    }
    /**
     * onActionDone
     * @param {*} actionClicked 
     */
    onActionDone(actionClicked){
        this.setState({pSelected:actionClicked});
        if(actionClicked==PRINT_PDFS){
        }
    }
    /**
     * onResetSelection
     * @param {*} actionClicked 
     */
    onResetSelection(actionClicked){
        this.setState({w2dgridata:[], selectedTransmitter: null , selectedCompany: null, selectedEmployees: null,disableaddemp:true,addEmps:false,gridHasData:false,disableviewpdf:true,disablegenpdf:true,disablepubpdf:true,disableunpubpdf:true,isEmpSelDisabled:true});
        this.yearSelected.disabled=false;
        this.yearSelected.value=(CURRENT_YR-1);
        this.latestOnly.checked=true;
        this.correctedOnly.checked=false;
        this.state.source.localdata=[];
        this.refs.eew2ActionGrid.clearselection();
        this.refs.eew2ActionGrid.updatebounddata('data');
    }
    toggleempInfo(){
        this.setState({
            empInfo: !this.state.empInfo
        }); 
    }
    toggleselAllInfo(){
        this.setState({
            selAllInfo: !this.state.selAllInfo
        }); 
    }
    toggleselAllInfoc(){
        this.setState({
            selAllInfoc: !this.state.selAllInfoc
        }); 
    }
    onCheckboxPrinClick(selected) {
        const index = this.state.cSelected.indexOf(selected);
        if (index < 0) {
          this.state.cSelected.push(selected);
        } else {
          this.state.cSelected.splice(index, 1);
        }
        this.setState({ cSelected: [...this.state.cSelected] });
    }
    onRadioPrinClick(rSelected) {
        this.setState({rSelected:rSelected});
        var eew2data = this.getRequestData(rSelected);
         console.log("Data input received:"+eew2data);
         var count = 0;
         let w2sselected;
         eew2Api.getRecsToPrintCount(eew2data).then(response => response).then((repos) => {
            console.log('getRecsToPrintCount : '+repos)
            count = repos;
            w2sselected = count;
            this.setState({rSelected:rSelected, w2sselected:w2sselected});
            return repos
        });
     /*   let w2sselected;
        if(rSelected==1){
            w2sselected = count; //this.state.totalRec;
        }else if(rSelected==2){
            w2sselected = count;//this.state.selecRec;
        }else if(rSelected==3){
            w2sselected =count;
        }else if(rSelected==4){
            w2sselected = count;
        } */
      
    }
    onTestPrint(selected){
       if(this.testPrintOnly.checked){
            this.setEnableDisableForPrint(true);
       }else{
            this.setEnableDisableForPrint(false);
       }
    }
    setEnableDisableForPrint(isEnabled){
        let w2sselected;
        let disableMeSel = false;
        if(isEnabled){
            w2sselected='';
        }else{
            w2sselected=this.state.totalRec;
        }
        if(this.state.selecRec==0){
            disableMeSel = true;
        }else if(this.state.selecRec > 0 && isEnabled){
            disableMeSel = true;
        }
        this.setState({
            disableMe:isEnabled,disableMeSel:disableMeSel,isDisabledOpt: isEnabled,disableviewpdf:false,rSelected:1,w2sselected:w2sselected
        }); 
        this.inputPrintFrmSel.disabled=isEnabled;
        this.inputPrintToSel.disabled=isEnabled;
        this.latestOnly.disabled=isEnabled;
        this.correctedOnly.disabled=isEnabled;
    }
    render() {
        var eew2data={};
        eew2data.eew2ecords=[];
        //this.props.loadPeriodicData(eew2data);
        const removeMe = (id) => {
            console.log(id);
            var selectedrowindex = this.refs.eew2ActionGrid.getselectedrowindex();
            console.log('selectedrowindex '+selectedrowindex);
            var rowscount = this.refs.eew2ActionGrid.getdatainformation().rowscount;
            console.log('rowscount '+rowscount);
            if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
                var id = this.refs.eew2ActionGrid.getrowid(selectedrowindex);
                var commit = this.refs.eew2ActionGrid.deleterow(id);
                this.state.w2dgridata.splice(selectedrowindex,1);
                this.setState({selectedTransmitter: null , selectedCompany: null, selectedEmployees: null});
                let com =[];
                this.state.companies.forEach(function (comp) {
                    com.push({'value':comp.fein,'label':comp.name, disabled:'no'});
                });
                this.setState({companies:com});
            }
        }
        let eew2ActionView = null;
        let footerButtons = null;
        let date = new Date(), y = date.getFullYear(), m = date.getMonth();
        let firstDay = new Date(y, m, 1);
        let lastDay = new Date(y, m + 1, 0);
        
        let dataAdapter = new $.jqx.dataAdapter(this.state.source);

       
        let minYr = CURRENT_YR-yearSpan;;
        let maxYr = CURRENT_YR+yearSpan;

        let columns =
        [
            { text: 'Name', datafield: 'name',  cellsalign: 'center', width: 'auto', align: 'center'},
            { text: 'Company', datafield: 'company',  cellsalign: 'center', width: 'auto', align: 'center'},
            { text: 'Type', datafield: 'type',  cellsalign: 'center', width: 'auto', align: 'center'},
            { text: '        ', cellsalign: 'center', width: '65', align: 'center', datafield: 'Delete', columntype: 'button', cellsrenderer: function (ndex, datafield, value, defaultvalue, column, rowdata) {
                return 'Remove';
               }, buttonclick: function (id) {
                   removeMe(id);
               }
            },
        ];
        return (
            <div>
                <Modal size="lg" isOpen={this.props.showPrint} backdrop="static">
                    <ModalHeader toggle={this.toggleUIPrintCancel}>Print W2 Records</ModalHeader>
                    <ModalBody>
                       
                    <Form>
                        <FormGroup row>
                        <Label for="periodBy1" sm={1}></Label>
                        <Col sm={10}>
                        <Alert color="primary">
                            {this.state.filterlabel} <Badge color="info">{this.state.w2sselected}</Badge>
                        </Alert>
                        </Col>
                        </FormGroup>
                    </Form>
                    {this.props.isprintinprogress.status==='In-Progress' ?(<Form>
                        <FormGroup row>
                        <Label for="periodBy1" sm={1}></Label>
                        <Col sm={10}>
                        <Alert color="success" isOpen={this.props.isprintinprogress.status==='In-Progress'}>
                            <span href="#" id="inProgressSpinner"> <i class="fas fa-spinner fa-spin"></i> Printing W2s is In-Progress.</span>
                        </Alert>
                        </Col>
                        </FormGroup>
                    </Form>) : null}    
                    {this.props.isprintinprogress.status==='Failed' ?(<Form>
                        <FormGroup row>
                        <Label for="periodBy1" sm={1}></Label>
                        <Col sm={10}><Alert color="danger" isOpen={this.props.isprintinprogress.status==='Failed'}>
                            <span href="#" id="inProgressSpinner"> <i class="fas fa-spinner"></i> Printing of W2s Failed. Please contact your system administrator.</span>
                        </Alert> 
                        </Col>
                        </FormGroup>
                    </Form>) : null}   
                    <Form>
                        <FormGroup row>
                            <Label for="printOpt3" sm={1}></Label>
                            <Label for="printOpt4" sm={2}>Print</Label>
                            <Col sm={6}>
                            <ButtonGroup>
                                <Button outline color="primary" onClick={() => this.onRadioPrinClick(1)} active={this.state.rSelected===1} disabled={this.state.disableMe} >All</Button>
                                <Button outline color="primary" onClick={() => this.onRadioPrinClick(2)} active={this.state.rSelected===2} disabled={this.state.disableMeSel} >Selected</Button>
                                <Button outline color="primary" onClick={() => this.onRadioPrinClick(3)} active={this.state.rSelected===3} disabled={this.state.disableMe} >Not Printed</Button>
                                <Button outline color="primary" onClick={() => this.onRadioPrinClick(4)} active={this.state.rSelected===4} disabled={this.state.disableMe} >Printed</Button>
                            </ButtonGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup row style={{ paddingLeft: 20 }}>
                                <Label for="periodBy1" sm={3}></Label>
                                <CustomInput type="checkbox" innerRef={(input) => this.latestOnly = input} id="exampleCustomSwitch" defaultChecked={true} name="customSwitch" label="Select Latest Records" />
                                &nbsp;
                                <a href="#" id="selAllInfoId"><i class="fas fa-info-circle fa-sm"></i></a>
                                <Tooltip placement="right" isOpen={this.state.selAllInfo} target="selAllInfoId" toggle={this.toggleselAllInfo}>
                                Select latest records from all the previous runs.
                                </Tooltip>
                        </FormGroup>
                        <FormGroup row style={{ paddingLeft: 20 }}>
                                <Label for="periodBy1" sm={3}></Label>
                                <CustomInput type="checkbox" innerRef={(inputc) => this.correctedOnly = inputc} id="exampleCustomSwitch1" defaultChecked={false} name="customSwitch1" label="Corrected Records Only" />
                                &nbsp;
                                <a href="#" id="selAllInfoId1"><i class="fas fa-info-circle fa-sm"></i></a>
                                <Tooltip placement="right" isOpen={this.state.selAllInfoc} target="selAllInfoId1" toggle={this.toggleselAllInfoc}>
                                Select corrected records only for the print.
                                </Tooltip>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="printOpt1" sm={1}></Label>
                            <Label for="printOpt2" sm={2}>Sort W2s By</Label>
                                <Col sm={4} style={{ zIndex: 101 }}>
                                    <Select
                                        name="selSortBy"
                                        ref='selSortBy'
                                        className={selZindx}
                                        defaultValue={printOptions[0]}
                                        value={this.state.selectedPrintOption}
                                        onChange={this.handleSortByChange}
                                        isSearchable ={false}
                                        isClearable={true}
                                        options={printOptions}
                                        isDisabled={this.state.isDisabledOpt}
                                        />
                                </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="printOpt3" sm={1}></Label>
                            <Label for="printOpt4" sm={2}>W2 Range</Label>
                            <Label for="printOpt5" sm={1}>From</Label>
                            <Col sm={2}>
                                    <Input type="number" min={1} onChange={this.onYearChange} innerRef={(inputPrintFrm) => this.inputPrintFrmSel = inputPrintFrm} name="selPrintFrm" id="selPrintFrm"/>
                            </Col>
                            <Label for="printOpt6" sm={1}>To</Label>
                            <Col sm={2}>
                                    <Input type="number" min={1} onChange={this.onYearChange} innerRef={(inputPrintToSel) => this.inputPrintToSel = inputPrintToSel} name="selPrintTo" id="selPrintFrm"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row style={{ paddingLeft: 20 }}>
                            <Label for="periodBy11" sm={3}></Label>
                            <CustomInput onClick={() => this.onTestPrint(1)} type="checkbox" innerRef={(inputTestPrint) => this.testPrintOnly = inputTestPrint} id="inputTestPrint" defaultChecked={false} name="inputTestPrint" label="Test Print" />
                       </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" className="btn btn-primary mr-auto" onClick={() => this.toggleUIPrintCancel()}>Cancel</Button>{' '}
                        <Button disabled={this.state.disableviewpdf} onClick={() => this.onPerformAction(1)}  color="success">Print W2s</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        eew2data: state.eew2data,
        isprintinprogress: state.printinprogress
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loadEEW2Records ,loadPeriodicData,stageRecsToPrint,getRecsToPrintCount,isPrintGenerationInprogress}, dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(PrintW2s);