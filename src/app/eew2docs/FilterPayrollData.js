import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {Alert, Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Col, Form,Input,Tooltip,FormFeedback,CustomInput} from 'reactstrap';
import JqxDateTimeInput from '../../deps/jqwidgets-react/react_jqxdatetimeinput.js';
import JqxGrid from '../../deps/jqwidgets-react/react_jqxgrid.js';
import {RN_EEW2_RECORDS} from '../../base/constants/RenderNames';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loadPeriodicData,loadEEW2Records,getTransmitters,getCompaniesByTransmitter,publishUnpublishEEW2Records,generateOutputs,isOutputGenerationInprogress}  from './eew2AdminAction';
import eew2Api from './eew2AdminAPI';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import {divStyleep,selZindx} from '../../base/constants/AppConstants';
import styles from '../../css/cfapp.css';
const yearSpan = 7;
const VIEW_PDF = 1;
const GENERATE_W2S = 2;
const PUBLISH_W2S = 3;
const UNPUBLISH_W2S = 4;
const ALERTINTERVAL = 300000;
const PRINTGEN_TIMER =10000;
const CURRENT_YR = new Date().getFullYear();
/**
 * FilterPayrollData
  * */
class FilterPayrollData extends Component {
    constructor(props) {
        super(props);
        var ops =[]; 
       
        this.props.eew2data.transmitters.forEach(function (txm) {
            ops.push({'value':txm.tfein,'label':txm.name});
        });
        //ops = _.uniqWith(ops, _.isEqual);
        let data = [];
        let isOpenFromGrid=false;
        let isTrmSelDisabled=false;
        let isEmpSelDisabled=true;
        if(this.props.openFromGrid){
            data=this.props.initgridData;
            if(data.length >0){
                isOpenFromGrid=true;
                isTrmSelDisabled=true;
                isEmpSelDisabled=true;  
            }
        }
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
            w2dgridata:data,
            disableaddemp:true,
            isCompLoading:false,
            isEmpsLoading:false,
            disableviewpdf:true,
            disablegenpdf:true,
            disablepubpdf:true,
            disableunpubpdf:true,
            gridHasData:false,
            ops:ops,
            inputValue: '',
            value:'',
            isEmpSelDisabled:isEmpSelDisabled,
            empInfo:false,
            selAllInfo:false,
            showActionAlert:false,
            actionAlertMessage:'',
            openFromGrid:isOpenFromGrid,
            isTrmSelDisabled:isTrmSelDisabled,
            hlptooltipOpen:false,
            divStyleGenD:false
        };
        this.toggle = this.toggle.bind(this);
        this.toggleaddEmpsSel = this.toggleaddEmpsSel.bind(this);
        this.changeBackdrop = this.changeBackdrop.bind(this);
        this.onActionBtnSelected = this.onActionBtnSelected.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
        this.onSetQuarter = this.onSetQuarter.bind(this);
        this.onPerformAction = this.onPerformAction.bind(this);
        this.handleTransmitterChange = this.handleTransmitterChange.bind(this);
        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        this.handleEmployeeChange = this.handleEmployeeChange.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
        this.getEmployees = this.getEmployees.bind(this);
        this.toggleempInfo = this.toggleempInfo.bind(this);
        this.toggleselAllInfo = this.toggleselAllInfo.bind(this);
        this.toggleActAlert = this.toggleActAlert.bind(this);
        this.tick2 = this.tick2.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onActionDone = this.onActionDone.bind(this);
        this.hlptogglettt = this.hlptogglettt.bind(this);
        if(this.props.openFromGrid){
            this.handleInProgress();
            this.interval = setInterval(this.handleInProgress.bind(this), PRINTGEN_TIMER);
        }
    }
    handleInProgress(){
        const dataset = appDataset();
        this.props.isOutputGenerationInprogress(dataset).then(response => {
            if(this.props.isoutinprogress.status==='In-Progress'){
                console.log('isOutputGenerationInprogress In-Progress');
                this.setState({divStyleGenD:true, showActionAlert: false});
            }else if(this.props.isoutinprogress.status==='Failed'){
                console.log('isOutputGenerationInprogress Failed');
                this.setState({divStyleGenD:false,showActionAlert: false});
            }else if(!this.props.isoutinprogress.status || this.props.isoutinprogress.status==='Processed'){
                this.setState({divStyleGenD:false});
                console.log('isOutputGenerationInprogress Processed');
            }
            return response
        }).catch(error => {
            throw new SubmissionError(error)
        });
    }
    hlptogglettt() {
        this.setState({
          hlptooltipOpen: !this.state.hlptooltipOpen
        });
    }
    onDismiss() {
        this.setState({ visible: false });
    }
    onYearChange(e){
        //console.log('Year val');
        //console.log(e.target.value);
        if(this.state.gridHasData && e.target.value > 0){
            this.setState({ disableviewpdf:false,disablegenpdf:false,disablepubpdf:false,disableunpubpdf:false});
        }else if(!this.state.gridHasData && !e.target.value){
            this.setState({ disableviewpdf:true,disablegenpdf:true,disablepubpdf:true,disableunpubpdf:true});
        }else if(!e.target.value){
            this.setState({ disableviewpdf:false,disablegenpdf:false,disablepubpdf:false,disableunpubpdf:false});
        }
    }
    handleTransmitterChange(selectedTransmitter){
        this.setState({ selectedTransmitter });
        let tfein = `${selectedTransmitter.value}`;
        this.setState({isCompLoading:true, selectedCompany: null, selectedEmployees: null});
        console.log('this.state.w2dgridata');
        console.log(this.state.w2dgridata);
        var dataSelected = this.state.w2dgridata;
        console.log('companies before ');
        console.log(this.state.companies);
        const dataset = appDataset();
        eew2Api.getCompaniesByTransmitter(dataset,tfein).then(function (tcomp) {
            var companies = [];
            console.log('dataSelected');
            console.log(dataSelected);
                tcomp.forEach(function (tcm) {
                var isDisabled='no';
                if(dataSelected && dataSelected.length >0){
                    for(i=0;i <dataSelected.length;i++){
                        if(dataSelected[i].companyId == tcm.fein && dataSelected[i].empid=="All" && dataSelected[i].name=="All"){
                            isDisabled ='yes';
                            break;
                        }
                    };
                }
                    companies.push({'value':tcm.fein,'label':tcm.name, disabled:isDisabled});
                });
        return companies;
        }).then(data => this.setState({ companies: data,isCompLoading:false}));
    }
    handleCompanyChange(selectedCompany){
        this.setState({isEmpsLoading:true})
        console.log('selectedCompany');
        console.log(selectedCompany);
        this.setState({ selectedCompany });
        var cfein =[];
        let comp = `${selectedCompany.value}`;
        cfein.push(comp);
        this.setState({ isEmpSelDisabled:false,selectedEmployees: null});
    }
    handleEmployeeChange(selectedEmployees){
        console.log('selectedEmployees');
        console.log(selectedEmployees);
        if(selectedEmployees.length == 0){
            this.setState({disableaddemp:true,addEmps:false});
        }else{
            this.setState({disableaddemp:false});
        }
        this.setState({ selectedEmployees: selectedEmployees });
    }
    addEmps(){
        this.yearSelected.invalid=true;
        //alert('addEmps');
        console.log('this.state.selectedTransmitter');
        console.log(this.state.selectedTransmitter);
        console.log('this.state.selectedEmployees');
        console.log(this.state.selectedEmployees);
        console.log('this.state.selectedCompany');
        console.log(this.state.selectedCompany);
        
        var transmitter = this.state.selectedTransmitter.value;
        var company = this.state.selectedCompany.label;
        var fein  = this.state.selectedCompany.value;
        var allRecs = false;
        var w2dgridata=[];
        var compsloaded = this.state.companies;
        var comps =[];
        var hasAllEmpSelected = false;
        this.state.selectedEmployees.forEach(function (emp) {
            if(emp.value=='All'){
                console.log('All employee selected for the company : '+company);
                compsloaded.forEach(function (comp) {
                    if(comp.value ==fein){
                        comps.push({'value':comp.value,'label':comp.label, disabled:'yes'});
                        hasAllEmpSelected=true;
                    }else{
                        comps.push({'value':comp.value,'label':comp.label, disabled:comp.disabled});
                    }
                });
            }
            w2dgridata.push({'name':emp.label, 'transmitterid':transmitter,'company':company,'companyId':fein, 'type': 'Employee', 'empid':emp.value,'empkey':emp.empkey,'allRecs':allRecs,'requestno':0});
        });
        if(hasAllEmpSelected){
            this.setState({ companies:comps,selectedCompany: null});
        }   
        //this.setState({ selectedTransmitter: null , selectedCompany: null, selectedEmployees: null , companies:[], disableaddemp:true,addEmps:false,gridHasData:true,isEmpSelDisabled:true});
        this.setState({ selectedEmployees: null , disableaddemp:true,addEmps:false,gridHasData:true,isEmpSelDisabled:false});
        
        this.state.w2dgridata.push(...w2dgridata);
       
        this.state.source.localdata=this.state.w2dgridata;
        this.refs.eew2ActionGrid.clearselection();
        this.refs.eew2ActionGrid.updatebounddata('data');
        if(this.yearSelected.value > 0){
            this.setState({ disableviewpdf:false,disablegenpdf:false,disablepubpdf:false,disableunpubpdf:false});
            //this.yearSelected.value=null;
            this.yearSelected.disabled=true;
        }
    }
    toggle() {
        if(this.state.openFromGrid){
            this.props.toggleFromGrid();
        }else if(this.state.modal){
            this.setState({
                modal: !this.state.modal
            });
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
        clearInterval(this.alertinterval);
        this.toggleActAlert('');
    }
    /**
     * getRequestData
     * @param {*} fromBtn 
     */
    getRequestData(actionClicked){
        var fLabel;
        var eew2data={};
        var eew2recordInput={};
        const dataset = appDataset();
        console.log('this.refs.yearSelected');
        console.log(this.yearSelected);
        console.log(this.yearSelected.value);
        var w2RequestInputs=[];
        this.state.w2dgridata.forEach(function (data) {
            console.log('requestno');
            console.log(data.requestno);
            if(data.empid=='All'){
                w2RequestInputs.push({"transmitterId":data.transmitterid,"companyId":data.companyId,"empId":"","allRecs":true,"requestno":data.requestno});
            }else{
                w2RequestInputs.push({"transmitterId":data.transmitterid,"companyId":data.companyId,"empId":data.empid,"empkey":data.empkey,"allRecs":data.allRecs,"requestno":data.requestno});
            }
        });
        if(actionClicked==VIEW_PDF){
            eew2recordInput = {
                 "dataset": dataset,
                 "latestonly": (this.latestOnly.checked==true) ? true:false,
                 "year": this.yearSelected.value,
                 "w2RequestInputs": w2RequestInputs
             };
             console.log('getViewW2PdfsData ===>');
             console.log(eew2recordInput);
             fLabel = 'W2s  for the Year '+this.yearSelected.value;
             eew2data.filtertype  = this.state.pSelected;
        }else if(actionClicked==GENERATE_W2S){
            eew2recordInput = {
                "dataset": dataset,
                "latestonly": (this.latestOnly.checked==true) ? true:false,
                "year": this.yearSelected.value,
                "w2RequestInputs": w2RequestInputs
            };
            console.log('getRequestGenerateData ===>');
            console.log(eew2recordInput);
            //fLabel = 'W2 Generation Initiated for the selected companies and employees'
            fLabel = 'W2s  for the Year '+this.yearSelected.value;
            this.props.eew2data.filtertype  = this.state.pSelected;
        }else if(actionClicked==PUBLISH_W2S){
            eew2recordInput = {
                "dataset": dataset,
                "toUnpublish":false,
                "latestonly": (this.latestOnly.checked==true) ? true:false,
                "year": this.yearSelected.value,
                "w2RequestInputs": w2RequestInputs
            };
            console.log('getRequestPublishData ===>');
            console.log(eew2recordInput);
            fLabel = 'Publish W2 Initiated for the selected companies and employees'
            this.props.eew2data.filtertype  = this.state.pSelected;
        }else if(actionClicked==UNPUBLISH_W2S){
            eew2recordInput = {
                "dataset": dataset,
                "toUnpublish":true,
                "latestonly": (this.latestOnly.checked==true) ? true:false,
                "year": this.yearSelected.value,
                "w2RequestInputs": w2RequestInputs
            };
            console.log('getRequestUnPublishData ===>');
            console.log(eew2recordInput);
            fLabel = 'Un-Publish Initiated W2 for the selected companies and employees'
            this.props.eew2data.filtertype  = this.state.pSelected;
        }
        eew2data.filterlabel = fLabel;
        eew2data.eew2recordInput = eew2recordInput;
        eew2data.w2dgridata = this.state.w2dgridata;
        return eew2data;
    }
    /**
     * onPerformAction
     * @param {*} actionClicked 
     */
    onPerformAction(actionClicked){
        if(actionClicked==VIEW_PDF){
            var eew2data = this.getRequestData(actionClicked);
            eew2data.eew2ecords=[];
            this.props.loadEEW2Records(eew2data);
            renderW2AdmApplication(appAnchor(),RN_EEW2_RECORDS);
        }else if(actionClicked==GENERATE_W2S){
            this.setState({showActionAlert: false});
            var eew2data = this.getRequestData(actionClicked);
            eew2data.eew2ecords=[];
            this.props.generateOutputs(eew2data.eew2recordInput).then(response => {
                //this.toggleActAlert('Generation of W2s initiated for the selected Employees.');
                //this.alertinterval = setInterval(this.tick2.bind(this), ALERTINTERVAL);
                //this.onActionDone(GENERATE_W2S);
                this.props.loadEEW2Records(eew2data);
                renderW2AdmApplication(appAnchor(),RN_EEW2_RECORDS);
                return response
            }).catch(error => {
                throw new SubmissionError(error)
            })
        }else if(actionClicked==PUBLISH_W2S){
            this.setState({showActionAlert: false});
            var eew2data = this.getRequestData(actionClicked);
            eew2data.eew2ecords=[];
            this.props.publishUnpublishEEW2Records(eew2data.eew2recordInput).then(response => {
                this.toggleActAlert('Publishing  of W2s initiated for the selected Employees.');
                this.alertinterval = setInterval(this.tick2.bind(this), ALERTINTERVAL);
                this.onActionDone(PUBLISH_W2S);
                return response
            }).catch(error => {
                throw new SubmissionError(error)
            });
        }else if(actionClicked==UNPUBLISH_W2S){
            this.setState({showActionAlert: false});
            var eew2data = this.getRequestData(actionClicked);
            eew2data.eew2ecords=[];
            this.props.publishUnpublishEEW2Records(eew2data.eew2recordInput).then(response => {
                this.toggleActAlert('Un-Publishing  of W2s initiated for the selected Employees.');
                this.alertinterval = setInterval(this.tick2.bind(this), ALERTINTERVAL);
                this.onActionDone(UNPUBLISH_W2S);
                return response
            }).catch(error => {
                throw new SubmissionError(error)
            });
        }
    }
    /**
     * onActionDone
     * @param {*} actionClicked 
     */
    onActionDone(actionClicked){
        this.setState({pSelected:actionClicked});
        if(actionClicked==VIEW_PDF){
        }else if(actionClicked==GENERATE_W2S){
            this.setState({disablegenpdf:true});
        }else if(actionClicked==PUBLISH_W2S){
            this.setState({disablepubpdf:true});
        }else if(actionClicked==UNPUBLISH_W2S){
            this.setState({disableunpubpdf:true});
        }
    }
    /**
     * onResetSelection
     * @param {*} actionClicked 
     */
    onResetSelection(actionClicked){
        this.setState({w2dgridata:[], isTrmSelDisabled:false, selectedTransmitter: null , selectedCompany: null, selectedEmployees: null,disableaddemp:true,addEmps:false,gridHasData:false,disableviewpdf:true,disablegenpdf:true,disablepubpdf:true,disableunpubpdf:true,isEmpSelDisabled:true});
        this.yearSelected.disabled=false;
        this.yearSelected.value=(CURRENT_YR-1);
        this.latestOnly.checked=true;
        this.state.source.localdata=[];
        this.refs.eew2ActionGrid.clearselection();
        this.refs.eew2ActionGrid.updatebounddata('data');
    }
    /**
     * getEmployees
     * @param {*} input 
     */
    getEmployees (input) {
        if (!input) {
			return  new Promise(resolve => {
                setTimeout(() => {
                    var empfiltered =[];
                    return empfiltered;
                }, 1000);
            });
        }
        if (input && input.length >=2) {
            const dataset = appDataset();
            var cfein =[];
            let comp = this.state.selectedCompany.value;
            cfein.push(comp);
            let tfein = this.state.selectedTransmitter.value;
            var eew2empInput= {"dataset":dataset,"transmitterId":tfein,"companyId":cfein,"allComps":false,"empFilter":input}
            console.log('this.state.selectedEmployees during employee search');  
            console.log(this.state.selectedEmployees);   
            var selectedEmp = this.state.selectedEmployees;
            console.log(this.state.w2dgridata);
            var dataSelected = this.state.w2dgridata;
            var employees = [];
            if(selectedEmp && selectedEmp.length > 0 && selectedEmp[0].label=='All'){
                var isDisabled='no';
                if(dataSelected && dataSelected.length >0){
                    for(i=0;i <dataSelected.length;i++){
                        if(dataSelected[i].companyId == comp && dataSelected[i].empid=="All" && dataSelected[i].name=="All"){
                            isDisabled ='yes';
                            break;
                        }
                    };
                }
                employees.push({'value':'All','label':'All',disabled: isDisabled});
            }else if(selectedEmp && selectedEmp.length > 0 && selectedEmp[0].label !='All'){
                employees.push({'value':'All','label':'All',disabled: 'yes'});
            }else{
                var isDisabled='no';
                if(dataSelected && dataSelected.length >0){
                    for(i=0;i <dataSelected.length;i++){
                        if(dataSelected[i].companyId == comp && dataSelected[i].empid !="All" && dataSelected[i].name !="All"){
                            isDisabled ='yes';
                            break;
                        }
                    };
                }
                employees.push({'value':'All','label':'All',disabled: isDisabled});
            }
            return eew2Api.getEmployees(eew2empInput).then(function (temps) {
              
                if(temps && temps.length >0){
                    if(selectedEmp && selectedEmp.length > 0 && selectedEmp[0].label=='All'){
                        temps.forEach(function (emp) {
                            employees.push({'value':emp.empid,'label':emp.fname+' '+emp.lname,disabled: 'yes','fein':comp,"empkey":emp.empkey});
                        });
                    }else if(selectedEmp && selectedEmp.length > 0 && selectedEmp[0].label !='All'){
                        temps.forEach(function (emp) {
                            var isDisabled='no';
                            if(dataSelected && dataSelected.length >0){
                                for(i=0;i <dataSelected.length;i++){
                                    if(dataSelected[i].companyId == comp && dataSelected[i].empid==emp.empid){
                                        isDisabled ='yes';
                                        break;
                                    }
                                };
                            }
                            employees.push({'value':emp.empid,'label':emp.fname+' '+emp.lname,disabled: isDisabled,'fein':comp,"empkey":emp.empkey});
                        });
                    }else{
                        temps.forEach(function (emp) {
                            var isDisabled='no';
                            if(dataSelected && dataSelected.length >0){
                                for(i=0;i <dataSelected.length;i++){
                                    if(dataSelected[i].companyId == comp && dataSelected[i].empid==emp.empid){
                                        isDisabled ='yes';
                                        break;
                                    }
                                };
                            }
                            employees.push({'value':emp.empid,'label':emp.fname+' '+emp.lname,disabled: isDisabled,'fein':comp,"empkey":emp.empkey});
                        });
                    }
                }
                return employees;
            });
        }   
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
    render() {
        var eew2data={};
        eew2data.eew2ecords=[];
        //this.props.loadPeriodicData(eew2data);
        const removeMe = (id) => {
            if(!this.state.openFromGrid){
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
                    let enableAction=false;
                    if(rowscount==1){
                        enableAction = true;
                    }
                    this.setState({companies:com,disableviewpdf:enableAction,disablegenpdf:enableAction,disablepubpdf:enableAction,disableunpubpdf:enableAction});
                }
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
        //const { selectedTransmitter } = this.state.selectedTransmitter;
        //const { selectedCompany } = this.state.selectedCompany;
        //const { selectedEmployees } = this.state.selectedEmployees;
        let eew2ActionViewFrm1=
        <Form>
        <FormGroup row>
            <Label for="filterYear" sm={1}>TDB</Label>
        </FormGroup>
        </Form>
        let eew2ActionViewFrm=
        <Form>
        <FormGroup row>
            <Label for="filterYear" sm={1}></Label>
            <Label for="chooseYear" sm={2}>Year</Label>
            <Col sm={3}>
                    <Input type="number" onChange={this.onYearChange} innerRef={(input) => this.yearSelected = input} name="selYear" min={minYr} max={maxYr} defaultValue={CURRENT_YR-1}  id="selYear" placeholder="Select Year" />
           </Col>
           <Label for="filtertrans" sm={2}>Transmitter</Label>
            <Col sm={3} style={{ zIndex: 101 }}>
                <Select
                    name="selTransmitter"
                    ref='selTransmitter'
                    className={selZindx}
                    value={this.state.selectedTransmitter}
                    isDisabled={this.state.isTrmSelDisabled}
                    onChange={this.handleTransmitterChange}
                    isSearchable ={false}
                    options={this.state.ops}
                    />
            </Col>
           </FormGroup>
            <FormGroup row>
                <Label sm={1}></Label>
                <Label sm={2}>Company</Label>
                <Col sm={8} style={{ zIndex: 100 }}>
                        <Select
                        name="selCompany"
                        className={selZindx}
                        value={this.state.selectedCompany}
                        onChange={this.handleCompanyChange}
                        isSearchable ={false}
                        isClearable ={false}
                        isOptionDisabled={(option) => option.disabled === 'yes'}
                        isMulti={false}
                        options={this.state.companies}
                        isLoading={this.state.isCompLoading}
                        />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label sm={1}></Label>
                <Label sm={2}>Employee  <a href="#" id="empInfoId"><i class="fas fa-info-circle fa-sm"></i></a></Label>
                <Tooltip placement="bottom" isOpen={this.state.empInfo} target="empInfoId" toggle={this.toggleempInfo}>
                    Type All or first few characters of Employee Name/Employee Id.
                </Tooltip>
                <Col sm={7}  style={{ zIndex: 99 }}>
                        <AsyncSelect
                            name="selEmployee"
                            className={selZindx}
                            closeMenuOnSelect={false}
                            value={this.state.selectedEmployees}
                            isDisabled={this.state.isEmpSelDisabled}
                            isMulti={true}
                            cacheOptions ={false}
                            defaultOptions
                            isLoading={true}
                            isOptionDisabled={(option) => option.disabled === 'yes'}
                            onChange={this.handleEmployeeChange}
                            loadOptions={this.getEmployees}
                        />
                </Col>
                <Col sm={1}>
                    <Button color="link" disabled={this.state.disableaddemp} style={divStyleep} onClick={() => this.addEmps()} id="addEmps"><i class="fas fa-plus-circle fa-lg"></i></Button>
                    <Tooltip placement="right" isOpen={this.state.addEmps} target="addEmps" toggle={this.toggleaddEmpsSel}>
                    Add Employees
                    </Tooltip>
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
                <Col sm={12} style={{ zIndex: 90 }}>
                <JqxGrid ref='eew2ActionGrid'
                    width={'100%'} source={dataAdapter} pageable={true} pagermode ={'simple'}
                    sortable={false} altrows={false} enabletooltips={false}
                    autoheight={true} editable={false} columns={columns}
                    filterable={false} showfilterrow={false}
                    selectionmode={'multiplerowsextended'}/>
                </Col> 
            </FormGroup>
        </Form>

        if(this.state.pSelected === 1){
            eew2ActionView=eew2ActionViewFrm
            footerButtons =
            <ModalFooter>
                <Button color="secondary" className="btn btn-primary" onClick={this.toggle}>Cancel</Button>
                <Button color="secondary" className="btn btn-primary mr-auto" onClick={() => this.onResetSelection(1)}>Reset</Button>{' '}
                <Button disabled={this.state.disableviewpdf} onClick={() => this.onPerformAction(1)}  color="success">View W2s</Button>{' '}
            </ModalFooter>
        }else if(this.state.pSelected === 2){
            eew2ActionView=eew2ActionViewFrm;
            footerButtons =
            <ModalFooter>
                <Button color="secondary" className="btn btn-primary" onClick={this.toggle}>Cancel</Button>
                <Button color="secondary" className="btn btn-primary mr-auto" onClick={() => this.onResetSelection(2)}>Reset</Button>
                <Button disabled={this.state.disablegenpdf} onClick={() => this.onPerformAction(2)}  color="success">Generate W2s</Button>{' '}
            </ModalFooter>
        }else if(this.state.pSelected === 3){
            eew2ActionView=eew2ActionViewFrm;
            footerButtons =
            <ModalFooter>
                <Button color="secondary" className="btn btn-primary" onClick={this.toggle}>Cancel</Button>
                <Button color="secondary" className="btn btn-primary mr-auto" onClick={() => this.onResetSelection(3)}>Reset</Button>
                <Button disabled={this.state.disablepubpdf} onClick={() => this.onPerformAction(3)}  color="success">Publish W2s</Button>{' '}
            </ModalFooter>
        }else if(this.state.pSelected === 4){
            eew2ActionView=eew2ActionViewFrm;
             footerButtons =
             <ModalFooter>
                <Button color="secondary" className="btn btn-primary" onClick={this.toggle}>Cancel</Button>
                <Button color="secondary" className="btn btn-primary mr-auto" onClick={() => this.onResetSelection(4)}>Reset</Button>
                <Button disabled={this.state.disableunpubpdf} onClick={() => this.onPerformAction(4)}  color="success">Un-Publish W2s</Button>{' '}
             </ModalFooter>
        } 
        return (
            <div>
                <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop={this.state.backdrop}>
                    <ModalHeader toggle={this.toggle}>Manage W2 Records <a target="_blank" id="_ew2_hlpttip" href="javascript:window.open('/help/modaleew2','_blank');"><i class="fas fa-question-circle fa-sm pl-1"></i></a><Tooltip placement="right" isOpen={this.state.hlptooltipOpen} target="_ew2_hlpttip" toggle={this.hlptogglettt}>Help</Tooltip></ModalHeader>
                    <ModalBody>
                     {this.state.showActionAlert ==true ?(<Form>
                            <FormGroup row><Label for="periodBy1" sm={1}></Label><Col sm={10}>
                                    <Alert color="success" isOpen={this.state.showActionAlert} toggle={this.onDismiss}>
                                    {this.state.actionAlertMessage}
                                    </Alert></Col></FormGroup></Form>) : null}
                            {this.props.isoutinprogress.status==='In-Progress' ?(<Form>
                            <FormGroup row><Label for="periodBy1" sm={1}></Label><Col sm={10}>
                            <Alert color="success" isOpen={this.props.isoutinprogress.status==='In-Progress'}>
                                <span href="#" id="inProgressSpinner"> <i class="fas fa-spinner fa-spin"></i> Output Generation is In-Progress.</span>
                            </Alert>
                            </Col></FormGroup></Form>) : null}
                            <Form>
                            <FormGroup row>
                                <Label for="filterType" sm={1}></Label>
                                <Label for="filterType" sm={2}>Action</Label>
                                <Col sm={7}>
                                <ButtonGroup>
                                    <Button outline color="info" onClick={() => this.onActionBtnSelected(1)} active={this.state.pSelected === 1}>View</Button>
                                    <Button outline color="info" onClick={() => this.onActionBtnSelected(2)} active={this.state.pSelected === 2}>Generate</Button>
                                </ButtonGroup>
                                </Col>
                            </FormGroup>
                            {eew2ActionView}
                        </Form>
                    </ModalBody>
                    {footerButtons}
                </Modal>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        eew2data: state.eew2data,
        isoutinprogress: state.outputgeninprogress
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loadEEW2Records ,loadPeriodicData,getTransmitters,getCompaniesByTransmitter,publishUnpublishEEW2Records,generateOutputs,isOutputGenerationInprogress}, dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(FilterPayrollData);