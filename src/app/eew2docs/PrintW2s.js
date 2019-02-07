import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {Alert, Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Col, Form,Input,Tooltip,FormFeedback,CustomInput} from 'reactstrap';
import JqxDateTimeInput from '../../deps/jqwidgets-react/react_jqxdatetimeinput.js';
import JqxGrid from '../../deps/jqwidgets-react/react_jqxgrid.js';
import {RN_EEW2_RECORDS} from '../../base/constants/RenderNames';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loadPeriodicData,loadEEW2Records}  from './eew2AdminAction';
import eew2Api from './eew2AdminAPI';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import {divStyleep,selZindx} from '../../base/constants/AppConstants';
import styles from '../../css/cfapp.css';
const yearSpan = 7;
const PRINT_PDFS = 1;
const ALERTINTERVAL = 300000;
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
                w2dgridata:[],
                disableaddemp:true,
                isCompLoading:false,
                isEmpsLoading:false,
                disableviewpdf:true,
                gridHasData:false,
                ops:ops,
                inputValue: '',
                value:'',
                isEmpSelDisabled:true,
                empInfo:false,
                selAllInfo:false,
                showActionAlert:false,
                actionAlertMessage:'',
                showPrint: this.props.showPrint,
                closeAll: false,
                selectedPrintOption:printOptions[0],
                cSelected: [],
                rSelected:''
            };
            this.toggleUIPrintOk = this.toggleUIPrintOk.bind(this);
            this.toggleUIPrintCancel = this.toggleUIPrintCancel.bind(this);
            this.toggle = this.toggle.bind(this);
            this.toggleaddEmpsSel = this.toggleaddEmpsSel.bind(this);
            this.changeBackdrop = this.changeBackdrop.bind(this);
            this.onActionBtnSelected = this.onActionBtnSelected.bind(this);
            this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
            this.onSetQuarter = this.onSetQuarter.bind(this);
            this.onPerformAction = this.onPerformAction.bind(this);
            this.toggleempInfo = this.toggleempInfo.bind(this);
            this.toggleselAllInfo = this.toggleselAllInfo.bind(this);
            this.toggleActAlert = this.toggleActAlert.bind(this);
            this.tick2 = this.tick2.bind(this);
            this.onDismiss = this.onDismiss.bind(this);
            this.onActionDone = this.onActionDone.bind(this);
            this.handleSortByChange = this.handleSortByChange.bind(this);
            this.onCheckboxPrinClick = this.onCheckboxPrinClick.bind(this);
    }
    toggleUIPrintOk() {
        this.props.handleOk();
    }
    toggleUIPrintCancel() {
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
    onRadioBtnClick(rSelected) {
        this.setState({ rSelected });
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
    tick2(){
        clearInterval(this.interval);
        this.toggleActAlert('');
    }
    /**
     * getRequestData
     * @param {*} fromBtn 
     */
    getRequestData(actionClicked){
       
    }
    /**
     * onPerformAction
     * @param {*} actionClicked 
     */
    onPerformAction(actionClicked){
        if(actionClicked==PRINT_PDFS){
            var eew2data = this.getRequestData(actionClicked);
            eew2data.eew2ecords=[];
            this.props.loadEEW2Records(eew2data);
            renderW2AdmApplication(appAnchor(),RN_EEW2_RECORDS);
        }
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
        this.setState({ rSelected });
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
                    <ModalHeader>Print W2 Records</ModalHeader>
                    <ModalBody>
                    <Form>
                        
                        <FormGroup row>
                            <Label for="printOpt3" sm={1}></Label>
                            <Label for="printOpt4" sm={2}>Print</Label>
                            <Col sm={6}>
                            <ButtonGroup>
                                <Button color="primary" onClick={() => this.onRadioPrinClick(1)} active={this.state.rSelected===1}>All W-2s</Button>
                                <Button color="primary" onClick={() => this.onRadioPrinClick(2)} active={this.state.rSelected===2}>Selected W-2s</Button>
                                <Button color="primary" onClick={() => this.onRadioPrinClick(3)} active={this.state.rSelected===3}>Not Printed W2s</Button>
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
                        <FormGroup row>
                            <Label for="printOpt1" sm={1}></Label>
                            <Label for="printOpt2" sm={2}>Sort W2s By</Label>
                                <Col sm={3} style={{ zIndex: 101 }}>
                                    <Select
                                        name="selSortBy"
                                        ref='selSortBy'
                                        className={selZindx}
                                        defaultValue={printOptions[0]}
                                        value={this.state.selectedPrintOption}
                                        onChange={this.handleSortByChange}
                                        searchable ={false}
                                        isClearable={true}
                                        options={printOptions}
                                        />
                                </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="printOpt7" sm={3}></Label>
                            <Label for="printOpt8" sm={4}>Number of W2s selected : 1</Label>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="printOpt3" sm={1}></Label>
                            <Label for="printOpt4" sm={2}>W2 Range</Label>
                            <Label for="printOpt5" sm={1}>From</Label>
                            <Col sm={2}>
                                    <Input type="number" onChange={this.onYearChange} innerRef={(inputPrintFrm) => this.inputPrintFrmSel = inputPrintFrm} name="selPrintFrm" id="selPrintFrm"/>
                            </Col>
                            <Label for="printOpt6" sm={1}>To</Label>
                            <Col sm={2}>
                                    <Input type="number" onChange={this.onYearChange} innerRef={(inputPrintToSel) => this.inputPrintToSel = inputPrintToSel} name="selPrintTo" id="selPrintFrm"/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="printOpt3" sm={3}></Label>
                            <Col>
                            <Button color="info" onClick={() => this.onCheckboxPrinClick(1)} active={this.state.cSelected.includes(1)}>Test Print</Button>
                            </Col>
                        </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" className="btn btn-primary mr-auto" onClick={() => this.toggleUIPrintCancel()}>Cancel</Button>{' '}
                        <Button disabled={this.state.disableviewpdf} onClick={() => this.toggleUIPrintOk()}  color="success">Print W2s</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        eew2data: state.eew2data
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loadEEW2Records ,loadPeriodicData}, dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(PrintW2s);