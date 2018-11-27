import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Col, Form,Input } from 'reactstrap';
import JqxDateTimeInput from '../../deps/jqwidgets-react/react_jqxdatetimeinput.js';
import {RN_PERIODIC_COMPNAY_TOTAL,RN_AUTH_TAXTYPE_TOTAL,RN_EEW2_RECORDS} from '../../base/constants/RenderNames';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loadPeriodicData,loadEEW2Records}  from './eew2AdminAction';
/**
 * 
 * 
 * */
class FilterPayrollData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            backdrop: 'static',
            pSelected:1,
            rSelected:1,
            mSelected:1
        };
        this.toggle = this.toggle.bind(this);
        this.changeBackdrop = this.changeBackdrop.bind(this);
        this.onPeriodBtnClick = this.onPeriodBtnClick.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
        this.onSetMonthRange = this.onSetMonthRange.bind(this);
        this.setMonthRange = this.setMonthRange.bind(this);
        this.onSetQuarter = this.onSetQuarter.bind(this);
        this.onViewEEW2Records = this.onViewEEW2Records.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
       if(this.state.modal){
            renderWelcomePage(appAnchor());
       }
    }
    changeBackdrop(e) {
        let value = e.target.value;
        if (value !== 'static') {
            value = JSON.parse(value);
        }
        this.setState({ backdrop: value });
    }
    onPeriodBtnClick(pSelected) {
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
        var eew2recordInput = {
            "dataset": "abc",
            "latestonly": true,
            "year": 2018,
            "w2RequestInputs": [
                {
                    "transmitterid": "123456789",
                    "companyId": "123456789",
                    "empid": "12345",
                    "allRecs": false
                }
            ]
        };
        if(this.state.pSelected===1){
            fLabel = 'Periodic';
            eew2data.filtertype  = this.state.pSelected;
        }else if(this.state.pSelected===2){
            fLabel = 'Quarterly'
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
        if(this.state.mSelected===1){
            fLabel = fLabel+' through '+this.refs.myDateTimeInputSt.val()+' to '+this.refs.myDateTimeInputEn.val();
        }else if(this.state.mSelected===2){
            fLabel = fLabel+' through '+this.refs.myDateTimeInputSt.val()+' to '+this.refs.myDateTimeInputEn.val();
        }else if(this.state.mSelected===3){
            fLabel = fLabel+' through '+this.refs.myDateTimeInputSt.val()+' to '+this.refs.myDateTimeInputEn.val();
        }
        eew2data.startdt = this.refs.myDateTimeInputSt.val();
        eew2data.enddate = this.refs.myDateTimeInputEn.val();
        eew2data.filterlabel = fLabel;

        
        eew2data.eew2recordInput = eew2recordInput;
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
        this.props.loadPeriodicData(eew2data);
        let periodicQuarterlyGroup = null;
        let footerButtons = null;
        let date = new Date(), y = date.getFullYear(), m = date.getMonth();
        let firstDay = new Date(y, m, 1);
        let lastDay = new Date(y, m + 1, 0);
        if(this.state.pSelected === 1){
            periodicQuarterlyGroup=
                <Form>
                <FormGroup row>
                    <Label for="filterBy" sm={2}>Filter By</Label>
                    <Col sm={10}>
                        <ButtonGroup>
                            <Button outline color="secondary" onClick={() => this.onRadioBtnClick(1)} active={this.state.rSelected === 1}>Check Date</Button>
                            <Button outline color="secondary" onClick={() => this.onRadioBtnClick(2)} active={this.state.rSelected === 2}>Payroll Run Date</Button>
                        </ButtonGroup>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="filterBy" sm={2}>Date range</Label>
                    <Col>
                        <JqxDateTimeInput ref='myDateTimeInputSt' height={25} width={125} animationType={'fade'}
                            dropDownHorizontalAlignment={'left'} disabled={true} value={`${firstDay}`} formatString="MM-dd-yyyy"/>
                    </Col>
                    <Col>
                        <Label for="filterBy">To</Label>
                    </Col>
                    <Col>
                        <JqxDateTimeInput ref='myDateTimeInputEn' height={25} width={125} animationType={'fade'}
                            dropDownHorizontalAlignment={'left'} disabled={true} value={`${lastDay}`} formatString="MM-dd-yyyy"/>
                    </Col>
                    <Col sm={4}></Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="filterByMonthr" sm={2}></Label>
                    <Col sm={10}>
                        <ButtonGroup>
                            <Button outline color="primary" size="sm"  onClick={() => this.onSetMonthRange(1)} active={this.state.mSelected === 1}>Current Month</Button>
                            <Button outline color="primary" size="sm"  onClick={() => this.onSetMonthRange(2)} active={this.state.mSelected === 2}>Previous Month</Button>
                            <Button outline color="primary" size="sm"  onClick={() => this.onSetMonthRange(3)} active={this.state.mSelected === 3}>Current Quarter</Button>
                        </ButtonGroup>
                    </Col>
                </FormGroup>
                </Form>
            footerButtons =
            <ModalFooter>
                        <Button color="secondary" className="btn btn-primary mr-auto" onClick={this.toggle}>Cancel</Button>
                        <Button  onClick={() => this.onViewEEW2Records()}  color="success">Get EE W2 Records</Button>{' '}
            </ModalFooter>

        }else{
            periodicQuarterlyGroup = 
                <Form>
                    <FormGroup row>
                        <Label for="filterBy" sm={2}>Year</Label>
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
        }
        return (
            <div>
                <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop={this.state.backdrop}>
                    <ModalHeader toggle={this.toggle}>Manage EE W2 Records</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup row>
                                <Label for="periodBy" sm={2}>Period Type</Label>
                                <Col sm={10}>
                                    <ButtonGroup>
                                        <Button outline color="info" onClick={() => this.onPeriodBtnClick(1)} active={this.state.pSelected === 1}>Periodic</Button>
                                        <Button outline color="info" onClick={() => this.onPeriodBtnClick(2)} active={this.state.pSelected === 2}>Quarterly</Button>
                                    </ButtonGroup>
                                </Col>
                            </FormGroup>
                            {periodicQuarterlyGroup}
                        </Form>
                    </ModalBody>
                    {footerButtons}
                </Modal>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loadEEW2Records ,loadPeriodicData}, dispatch)
}
export default connect(null,mapDispatchToProps)(FilterPayrollData);