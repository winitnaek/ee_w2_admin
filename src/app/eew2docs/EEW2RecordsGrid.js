import React from 'react';
import ReactDOM from 'react-dom';
import { Alert } from 'reactstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import EEW2Records from './EEW2Records'
import {getEEW2Pdf,generateOutputs,publishUnpublishEEW2Records,isOutputGenerationInprogress,loadPdfData,loadCompData,isPrintGenerationInprogress}  from './eew2AdminAction';
import {getAuditOutput,testjnlp,printjnlp,checkIfCompConfForTurboTaxImport}  from '../comp_outputs/compViewAction';
import {
    divStylePA
} from '../../base/constants/AppConstants';
import * as svcs from '../../base/constants/ServiceUrls';
import URLUtils from '../../base/utils/urlUtils';
class EEW2RecordsGrid extends React.Component {
    renderGrid(eew2data){
        eew2data.getRecsUrl = buildGetRecsUrl();

        if(eew2data && eew2data.eew2ecords){
            return(<EEW2Records eew2data={this.props.eew2data} w2data={this.props.w2data} viewcompdata={this.props.viewcompdata} 
                compdata={this.props.compdata} isoutinprogress={this.props.isoutinprogress} isprintinprogress={this.props.isprintinprogress} 
                actions={this.props.actions}/>);
        }else if(eew2data && eew2data.eew2ecords && eew2data.eew2ecords.type=='AppError'){
            return(<div>
                <Alert color="danger">
                    Error...
                </Alert>
                </div>
            );
        }else {
            if(eew2data && eew2data.eew2ecords && eew2data.eew2ecords.length ==0){
                /*return(<div>
                    <Alert color="warning">
                        <span>No records found. Please try another filter criteria.</span>
                    </Alert>
                    </div>
                );*/
                return(<div>
                    <Alert color="primary">
                        <span href="#"  style={divStylePA} id="inProgressAction"> <i class="fas fa-spinner fa-spin"></i> Loading...</span>
                    </Alert>
                    </div>
                );
            }else{
                return(<div>
                    <Alert color="primary">
                        <span href="#"  style={divStylePA} id="inProgressAction"> <i class="fas fa-spinner fa-spin"></i> Loading...</span>
                    </Alert>
                    </div>
                );
            }
        };
    }
    render() {
        return (<div>{this.renderGrid(this.props.eew2data)}</div>);
    }
};
function buildGetRecsUrl() {
    let url = URLUtils.buildURL(svcs.GET_EEW2RECORDS);
    return url;
};
function mapStateToProps(state) {
    return {
        eew2data: state.eew2data,
        isoutinprogress: state.outputgeninprogress,
        isprintinprogress: state.printinprogress,
        w2data:state.w2data,
        compdata:state.compdata,
        viewcompdata: state.viewcompdata
    }
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({getEEW2Pdf,generateOutputs,getAuditOutput,testjnlp,printjnlp,publishUnpublishEEW2Records,isOutputGenerationInprogress,loadPdfData,loadCompData,checkIfCompConfForTurboTaxImport,isPrintGenerationInprogress}, dispatch) }
 }
export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true })(EEW2RecordsGrid);