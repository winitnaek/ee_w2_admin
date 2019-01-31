import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Col, Form,Input,Tooltip,FormFeedback} from 'reactstrap';
import JqxDateTimeInput from '../../deps/jqwidgets-react/react_jqxdatetimeinput.js';
import JqxGrid from '../../deps/jqwidgets-react/react_jqxgrid.js';
import {RN_PERIODIC_COMPNAY_TOTAL,RN_AUTH_TAXTYPE_TOTAL,RN_EEW2_RECORDS} from '../../base/constants/RenderNames';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loadPeriodicData,loadEEW2Records,getTransmitters,getCompaniesByTransmitter}  from './eew2AdminAction';
import eew2Api from './eew2AdminAPI';
import Select from 'react-select';
import {divStyleep,selZindx,selZindx1} from '../../base/constants/AppConstants';
import styles from '../../css/cfapp.css';
const yearSpan = 7;
const usrobj = JSON.parse(sessionStorage.getItem('up'));
console.log(usrobj);
const dataset = '00_EE_W2_DATA';
//const dataset = usrobj.dataset;

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ];
var ops =[];  
/**
 * 
 * 
 * */
class FilterPayrollData extends Component {
    constructor(props) {
        super(props);
        console.log('this.props.eew2data');
        console.log(this.props.eew2data);
        this.props.eew2data.transmitters.forEach(function (txm) {
            if(txm.name =='Dennys inc'){
                ops.push({'value':'952023160','label':txm.name});
            }else{
                ops.push({'value':txm.tfein,'label':txm.name});
            }
        });
        ops = _.uniqWith(ops, _.isEqual);

        console.log('uniqWith');
        console.log(ops);

        let data = [];
        let source =
        {
            datatype: "json",
            datafields: [
                { name: 'name', type: 'string' },
                { name: 'company', type: 'string' },
                { name: 'type', type: 'string' }
            ],
            localdata: data
        };
       
        this.state = {
            source: source,
            modal: true,
            backdrop: 'static',
            pSelected:1,
            rSelected:1,
            mSelected:1,
            cSelected: [],
            selectedTransmitter: '',
            companies:[],
            selectedCompany:'',
            employees:[],
            selectedEmployees:[],
            addEmps:false,
            w2dgridata:[],
            disableaddemp:true,
            isCompLoading:false,
            isEmpsLoading:false
        };
        this.toggle = this.toggle.bind(this);
        this.toggleaddEmpsSel = this.toggleaddEmpsSel.bind(this);
        this.changeBackdrop = this.changeBackdrop.bind(this);
        this.onActionBtnClick = this.onActionBtnClick.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
        this.onSetMonthRange = this.onSetMonthRange.bind(this);
        this.setMonthRange = this.setMonthRange.bind(this);
        this.onSetQuarter = this.onSetQuarter.bind(this);
        this.onViewEEW2Records = this.onViewEEW2Records.bind(this);
        this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
        this.handleTransmitterChange = this.handleTransmitterChange.bind(this);
        this.handleCompanyChange = this.handleCompanyChange.bind(this);
        this.handleEmployeeChange = this.handleEmployeeChange.bind(this);
    }
    handleTransmitterChange(selectedTransmitter){
        this.setState({ selectedTransmitter });
        let tfein = `${selectedTransmitter.value}`;
        this.setState({isCompLoading:true})
        eew2Api.getCompaniesByTransmitter(dataset,tfein).then(function (tcomp) {
            var companies = [];
            companies.push({'value':'All','label':'All'});
            tcomp.forEach(function (tcm) {
                if(tcm.name=='Dennys inc'){
                    companies.push({'value':tcm.fein,'label':tcm.name, disabled: 'no'});
                }else{
                    companies.push({'value':tcm.fein,'label':tcm.name, disabled: 'no'});
                }
               
            });
            console.log('companies');
            companies = _.uniqWith(companies, _.isEqual);
            console.log(companies);
            return companies;
        }).then(data => this.setState({ companies: data,isCompLoading:false}));
    }
    handleCompanyChange(selectedCompany){
        this.setState({isEmpsLoading:true})
        console.log('selectedCompany');
        console.log(selectedCompany);
        this.setState({ selectedCompany });

        var cfein =[];
        let tfein = this.state.selectedTransmitter.value;
        let comp = `${selectedCompany.value}`;
        cfein.push(comp);
        
        var eew2empInput= {"dataset":dataset,"tfein":tfein,"cfein":cfein,"allComps":false}

        eew2Api.getEmployees(eew2empInput).then(function (temps) {
            var employees = [];
            employees.push({'value':'All','label':'All'});
            var temp;
            if(comp =='All'){
                temp ="[\r\n    {\r\n        \"empid\": \"123456789\",\r\n        \"fname\": \"Akron\",\r\n        \"lname\": \"Lisa\",\r\n        \"fein\":\"987654231\"\r\n\r\n    },\r\n    {\r\n        \"empid\": \"345678901\",\r\n        \"fname\": \"David\",\r\n        \"lname\": \"wills\",\r\n   \"fein\":\"123456789\"\r\n    },\r\n  {\r\n        \"empid\": \"345678902\",\r\n        \"fname\": \"Akela\",\r\n        \"lname\": \"Houston\",\r\n       \"fein\":\"999999999\"\r\n    }]";
            }else if(comp =='999999999'){
                temp ="[\r\n {\r\n        \"empid\": \"345678902\",\r\n        \"fname\": \"Akela\",\r\n        \"lname\": \"Houston\",\r\n       \"fein\":\"999999999\"\r\n    }]";
            }else if(comp =='987654231'){
                temp ="[\r\n    {\r\n        \"empid\": \"123456789\",\r\n        \"fname\": \"Akron\",\r\n        \"lname\": \"Lisa\",\r\n        \"fein\":\"987654231\"\r\n\r\n    }]";
            }else if(comp =='123456789'){
                temp ="[\r\n  \r\n    {\r\n        \"empid\": \"345678901\",\r\n        \"fname\": \"David\",\r\n        \"lname\": \"wills\",\r\n   \"fein\":\"123456789\"\r\n    }]";
            }
            temps = JSON.parse(temp);
            temps.forEach(function (emp) {
                employees.push({'value':emp.empid,'label':emp.fname+' '+emp.lname, 'fein':emp.fein});
            });
            employees = _.uniqWith(employees, _.isEqual);
            console.log('employees');
            console.log(employees);
            return employees;
        }).then(data => this.setState({ employees: data,isEmpsLoading:false}));
    }
    handleEmployeeChange(selectedEmployees){
        console.log('selectedEmployees');
        console.log(selectedEmployees);
        if(selectedEmployees.length > 0 && selectedEmployees[0].label=='All'){
            var data = [];
            this.state.employees.forEach(function (emp) {
                if(emp.value=='All'){
                    data.push({'value':'All','label':'All', disabled: 'no'});
                }else{
                    data.push({'value':emp.value,'label':emp.label, disabled: 'yes','fein':emp.fein});
                }
            });
            this.setState({ employees: data })
        }else if(selectedEmployees.length > 0 && selectedEmployees[0].label !='All'){
            var data = [];
            this.state.employees.forEach(function (emp) {
                if(emp.value=='All'){
                    data.push({'value':'All','label':'All', disabled: 'yes'});
                }else{
                    data.push({'value':emp.value,'label':emp.label, disabled: 'no','fein':emp.fein});
                }
            });
            this.setState({ employees: data })
        }else{
            var data = [];
            this.state.employees.forEach(function (emp) {
                data.push({'value':emp.value,'label':emp.label, disabled: 'no','fein':emp.fein});
            });
            this.setState({ employees: data })
        }
        if(selectedEmployees.length == 0){
            this.setState({disableaddemp:true,addEmps:false});
            
        }else{
            this.setState({disableaddemp:false});
        }

        this.setState({ selectedEmployees: selectedEmployees })
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
        var allRecs = true;
        var w2dgridata=[];
        this.state.selectedEmployees.forEach(function (emp) {
            w2dgridata.push({'name':emp.label, 'transmitterid':transmitter,'company':company,'companyId':fein, 'type': 'Employee', 'empid':emp.value,'allRecs':allRecs,'requestno':0});
        });
       
        this.setState({ selectedTransmitter: null , selectedCompany: null, selectedEmployees: null , employees: [], companies:[], disableaddemp:true,addEmps:false});
        
        this.state.w2dgridata.push(...w2dgridata);
       
        this.state.source.localdata=this.state.w2dgridata;
        this.refs.eew2ActionGrid.clearselection();
        this.refs.eew2ActionGrid.updatebounddata('data');
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
    onCheckboxBtnClick(selected) {
        const index = this.state.cSelected.indexOf(selected);
        if (index < 0) {
          this.state.cSelected.push(selected);
        } else {
          this.state.cSelected.splice(index, 1);
        }
        this.setState({ cSelected: [...this.state.cSelected] });
    }
    changeBackdrop(e) {
        let value = e.target.value;
        if (value !== 'static') {
            value = JSON.parse(value);
        }
        this.setState({ backdrop: value });
    }
    onActionBtnClick(pSelected) {
        this.setState({ pSelected });
    }
    onRadioBtnClick(rSelected) {
        this.setState({ rSelected });
    }
    onSetMonthRange(mSelected) {
        this.setState({ mSelected });
       this.setMonthRange(mSelected);
    }
    onSetQuarter(qSelected){
        this.setState({ qSelected });
    }
    setMonthRange(mSelected){
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay;
        var lastDay;
        if(mSelected===1){
            firstDay = new Date(y, m, 1);
            lastDay = new Date(y, m + 1, 0);
        }else if(mSelected===2){
            firstDay = new Date(y, m-1, 1);
            lastDay = new Date(y, m, 0);
        }else if(mSelected===3){
            var quarter = Math.floor((date.getMonth() / 3));	
            firstDay = new Date(date.getFullYear(), quarter * 3, 1);
            lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 3, 0);
        }
        this.refs.myDateTimeInputSt.setDate(firstDay);
        this.refs.myDateTimeInputEn.setDate(lastDay);
    }
    getRequestData(fromBtn){
        var fLabel;
        var eew2data={};
        console.log('this.refs.yearSelected');
        console.log(this.yearSelected);
        console.log(this.yearSelected.value);
        var w2RequestInputs=[];
        this.state.w2dgridata.forEach(function (data) {
            if(data.companyId=='All' && data.empid=='All'){
                w2RequestInputs.push({"transmitterId":data.transmitterid,"companyId":"","empid":"","allRecs":data.allRecs,"requestno":data.requestno});
            }else{
                w2RequestInputs.push({"transmitterId":data.transmitterid,"companyId":data.companyId,"empid":data.empid,"allRecs":data.allRecs,"requestno":data.requestno});
            }
        });
       console.log('w2RequestInputs');
       console.log(w2RequestInputs);
        var eew2recordInput = {
            "dataset": dataset,
            "latestonly": (this.state.cSelected[0] == 1)?true:false,
            "year": parseInt(this.yearSelected.value),
            "w2RequestInputs": w2RequestInputs
        };
        console.log('eew2recordInput');
        console.log(eew2recordInput);

        var eew2recordInput2 = {
            "dataset":"00_EE_W2_DATA",
            "latestonly":true,
            "year":"2017",
            "w2RequestInputs":[
               {
                  "transmitterId":"952023160",
                  "companyId":"",
                  "empid":"",
                  "allRecs":false,
                  "requestno":0
               }
            ]
         };
         
         var eew2recordInput3 =  {  
            "dataset":"00_EE_W2_DATA",
            "latestonly":true,
            "year":2017,
            "w2RequestInputs":[  
               {  
                  "transmitterId":"952023160",
                  "companyId":"952023160",
                  "empid":"001907",
                  "allRecs":false,
                  "requestno":0
               }
            ]
         }

         var eew2recordInput4 =   {  
            "dataset":"00_EE_W2_DATA",
            "latestonly":true,
            "year":2017,
            "w2RequestInputs":[  
               {  
                  "transmitterId":"123456789",
                  "companyId":"525012345",
                  "empid":"179",
                  "allRecs":false,
                  "requestno":0
               }
            ]
         }
         var eew2recordInput5 =   {  
            "dataset":"00_EE_W2_DATA",
            "latestonly":true,
            "year":2017,
            "w2RequestInputs":[  
               {  
                  "transmitterId":"123456789",
                  "companyId":"525012345",
                  "empid":"179",
                  "allRecs":false,
                  "requestno":0
               },
               {  
                  "transmitterId":"581234567",
                  "companyId":"225012345",
                  "empid":"179",
                  "allRecs":false,
                  "requestno":0
               }
            ]
         }

         var eew2recordInput6 = {
             "dataset": "00_EE_W2_DATA",
             "latestonly": true,
             "year": 2017,
             "w2RequestInputs": [{
                     "transmitterId": "952023160",
                     "companyId": "952023160"
                 },
                 {
                     "transmitterId": "581234567",
                     "companyId": "225012345",
                     "empid": "179",
                     "allRecs": false,
                     "requestno": 0
                 }
             ]
         };

         var eew2recordInput7= {  
            "dataset":"00_EE_W2_DATA",
            "latestonly":true,
            "year":2017,
            "w2RequestInputs":[  
              {"transmitterId":"123456789","companyId":"525012345","empid":"179","allRecs":false,"requestno":0}
            ]
         }

         var eew2recordInput8= {  
            "dataset":"00_EE_W2_DATA",
            "latestonly":true,
            "year":2017,
            "w2RequestInputs":[
            {"transmitterId":123456789,"allRecs":true,"requestno":0}
            ]
         }
         
        //console.log(eew2recordInput2);

        if(this.state.pSelected===1){
            fLabel = 'View W2';
            eew2data.filtertype  = this.state.pSelected;
        }else if(this.state.pSelected===2){
            fLabel = 'Generate W2'
            this.props.eew2data.filtertype  = this.state.pSelected;
        }else if(this.state.pSelected===3){
            fLabel = 'Generate W2C'
            this.props.eew2data.filtertype  = this.state.pSelected;
        }else if(this.state.pSelected===4){
            fLabel = 'Publish'
            this.props.eew2data.filtertype  = this.state.pSelected;
        }else if(this.state.pSelected===5){
            fLabel = 'Un-Publish'
            this.props.eew2data.filtertype  = this.state.pSelected;
        }
        if(fromBtn===1){
            fLabel = fLabel+' Company Total Data'
            eew2data.viewtype  = fromBtn;
        }else if(fromBtn===2){
            eew2data.viewtype  = fromBtn;
            fLabel = fLabel+' Authority/Tax Type Total data'
        }else if(fromBtn===1){
            fLabel = fLabel+' Company Total Data'
            eew2data.viewtype  = fromBtn;
        }
        if(this.state.rSelected===1){
            fLabel = fLabel+ ' by Check Date'
            eew2data.filterby  = this.state.rSelected;
        }else if(this.state.rSelected===2){
            fLabel = fLabel+ ' by Payroll Run Date'
            eew2data.filterby  = this.state.rSelected;
        }
        /*if(this.state.mSelected===1){
            fLabel = fLabel+' through '+this.refs.myDateTimeInputSt.val()+' to '+this.refs.myDateTimeInputEn.val();
        }else if(this.state.mSelected===2){
            fLabel = fLabel+' through '+this.refs.myDateTimeInputSt.val()+' to '+this.refs.myDateTimeInputEn.val();
        }else if(this.state.mSelected===3){
            fLabel = fLabel+' through '+this.refs.myDateTimeInputSt.val()+' to '+this.refs.myDateTimeInputEn.val();
        }
        eew2data.startdt = this.refs.myDateTimeInputSt.val();
        eew2data.enddate = this.refs.myDateTimeInputEn.val();*/
        eew2data.filterlabel = fLabel;

        
        eew2data.eew2recordInput = eew2recordInput6;
        return eew2data;
    }
    onViewEEW2Records(){
        var eew2data = this.getRequestData(1);
        eew2data.eew2ecords=[];
        this.props.loadEEW2Records(eew2data);
        renderW2AdmApplication(appAnchor(),RN_EEW2_RECORDS);
    }
   
    render() {
        var eew2data={};
        eew2data.eew2ecords=[];
      //  this.props.loadPeriodicData(eew2data);
        
        let eew2ActionView = null;
        let footerButtons = null;
        let date = new Date(), y = date.getFullYear(), m = date.getMonth();
        let firstDay = new Date(y, m, 1);
        let lastDay = new Date(y, m + 1, 0);
        
        let dataAdapter = new $.jqx.dataAdapter(this.state.source);

        let currentYr = new Date().getFullYear();
        let minYr = currentYr-yearSpan;;
        let maxYr = currentYr+yearSpan;

        let columns =
        [
            { text: 'Name', datafield: 'name',  cellsalign: 'center', width: 'auto', align: 'center'},
            { text: 'Company', datafield: 'company',  cellsalign: 'center', width: 'auto', align: 'center'},
            { text: 'Type', datafield: 'type',  cellsalign: 'center', width: 'auto', align: 'center'},
        ];
        //const { selectedTransmitter } = this.state.selectedTransmitter;
        //const { selectedCompany } = this.state.selectedCompany;
        //const { selectedEmployees } = this.state.selectedEmployees;
        if(this.state.pSelected === 1){
            eew2ActionView=
                <Form>
                <FormGroup row>
                    <Label for="periodBy1" sm={1}></Label>
                    <Label for="chooseYear" sm={1}>Year</Label>
                    <Col sm={3}>
                            <Input type="number" innerRef={(input) => this.yearSelected = input} name="selYear" min={minYr} max={maxYr} id="selYear" placeholder="Select Year" />
                   </Col>
                    <Label for="chooseYear" sm={2}>Transmitter</Label>
                    <Col sm={3} style={{ zIndex: 101 }}>
                        <Select
                            name="selTransmitter"
                            ref='selTransmitter'
                            className={selZindx}
                            value={this.state.selectedTransmitter}
                            onChange={this.handleTransmitterChange}
                            searchable ={true}
                           
                            options={ops}
                            />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={1}></Label>
                    <Label sm={2}>Company</Label>
                    <Col sm={7} style={{ zIndex: 100 }}>
                            <Select
                            name="selCompany"
                            className={selZindx}
                            value={this.state.selectedCompany}
                            onChange={this.handleCompanyChange}
                            searchable ={true}
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
                    <Label sm={2}>Employee</Label>
                    <Col sm={6}  style={{ zIndex: 99 }}>
                            <Select
                            name="selEmployee"
                            className={selZindx}
                            value={this.state.selectedEmployees}
                            onChange={this.handleEmployeeChange}
                            searchable ={true}
                            isMulti={true}
                            isClearable ={true}
                            isOptionDisabled={(option) => option.disabled === 'yes'}
                            options={this.state.employees}
                            />
                    </Col>
                    <Col sm={1}>
                        <Button color="link" disabled={this.state.disableaddemp} style={divStyleep} onClick={() => this.addEmps()} id="addEmps"><i class="fas fa-plus-circle fa-lg"></i></Button>
                        <Tooltip placement="right" isOpen={this.state.addEmps} target="addEmps" toggle={this.toggleaddEmpsSel}>
                        Add Employees
                        </Tooltip>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}></Label>
                    <Col sm={1}>
                        <Button color="primary" onClick={() => this.onCheckboxBtnClick(1)} active={this.state.cSelected.includes(1)}>Select From Latest Run Only</Button>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="periodBy1" sm={1}></Label>
                    <Col sm={10} style={{ zIndex: 90 }}>
                    <JqxGrid ref='eew2ActionGrid'
                        width={'100%'} source={dataAdapter} pageable={true} pagermode ={'simple'}
                        sortable={false} altrows={false} enabletooltips={false}
                        autoheight={true} editable={false} columns={columns}
                        filterable={false} showfilterrow={false}
                        selectionmode={'multiplerowsextended'}/>
                       </Col> 
                </FormGroup>
            </Form>
            
            footerButtons =
            <ModalFooter>
                        <Button color="secondary" className="btn btn-primary mr-auto" onClick={this.toggle}>Cancel</Button>
                        <Button  onClick={() => this.onViewEEW2Records()}  color="success">View W2s</Button>{' '}
            </ModalFooter>

        }else if(this.state.pSelected === 2){
            eew2ActionView = 
                <Form>
                    <FormGroup row>
                        <Label for="filterBy2" sm={2}>Year</Label>
                        <Col sm={4}>
                            <Input type="number" name="number" min="2009" max="2023" id="exampleNumber" placeholder="Select Year" />
                        </Col>
                        <Label for="selQuarter" sm={1}>Quarter</Label>
                        <Col sm={4}>
                            <ButtonGroup>
                                <Button outline color="primary" onClick={() => this.onSetQuarter(1)} active={this.state.qSelected === 1}>Q1</Button>
                                <Button outline color="primary" onClick={() => this.onSetQuarter(2)} active={this.state.qSelected === 2}>Q2</Button>
                                <Button outline color="primary" onClick={() => this.onSetQuarter(3)} active={this.state.qSelected === 3}>Q3</Button>
                                <Button outline color="primary" onClick={() => this.onSetQuarter(4)} active={this.state.qSelected === 4}>Q4</Button>
                            </ButtonGroup>
                        </Col>
                    </FormGroup>
                </Form>
            footerButtons =
            <ModalFooter>
                        <Button color="secondary" className="btn btn-primary mr-auto" onClick={this.toggle}>Cancel</Button>
                        <Button color="success">View Company Total</Button>{' '}
                        <Button color="success">View Authority/Tax Type Total</Button>
                        <Button color="success">View Employee Detail</Button>
            </ModalFooter>
        }else if(this.state.pSelected === 3){
            eew2ActionView = 
            <Form>
                <FormGroup row>
                    <Label for="filterBy3" sm={2}>Generate W2C</Label>
                </FormGroup>
            </Form>
        }else if(this.state.pSelected === 4){
            eew2ActionView = 
            <Form>
                <FormGroup row>
                    <Label for="filterBy4" sm={2}>Publish</Label>
                </FormGroup>
            </Form>
        }else if(this.state.pSelected === 5){
            eew2ActionView = 
            <Form>
                <FormGroup row>
                    <Label for="filterBy5" sm={2}>Un-Publish</Label>
                </FormGroup>
            </Form>
        }else if(this.state.pSelected === 6){
            eew2ActionView = 
            <Form>
                <FormGroup row>
                    <Label for="filterBy6" sm={2}>Print</Label>
                </FormGroup>
            </Form>
        }
        return (
            <div>
                <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop={this.state.backdrop}>
                    <ModalHeader toggle={this.toggle}>Manage EE W2 Records</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup row>
                                <Label for="periodBy" sm={1}></Label>
                                <Col sm={9}>
                                    <ButtonGroup>
                                        <Button outline color="info" onClick={() => this.onActionBtnClick(1)} active={this.state.pSelected === 1}>View W2</Button>
                                        <Button outline color="info" onClick={() => this.onActionBtnClick(2)} active={this.state.pSelected === 2}>Generate W2</Button>
                                        <Button outline color="info" onClick={() => this.onActionBtnClick(3)} active={this.state.pSelected === 3}>Generate W2C</Button>
                                        <Button outline color="info" onClick={() => this.onActionBtnClick(4)} active={this.state.pSelected === 4}>Publish</Button>
                                        <Button outline color="info" onClick={() => this.onActionBtnClick(5)} active={this.state.pSelected === 5}>Un-Publish</Button>
                                        <Button outline color="info" onClick={() => this.onActionBtnClick(6)} active={this.state.pSelected === 6}>Print</Button>
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
        eew2data: state.eew2data
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({loadEEW2Records,loadPeriodicData,getTransmitters,getCompaniesByTransmitter}, dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(FilterPayrollData);