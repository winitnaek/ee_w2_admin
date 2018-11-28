import React from 'react';
import ReactDOM from 'react-dom';
import { Alert } from 'reactstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import EEW2Records from './EEW2Records'
import {getEEW2Pdf,generateOutputs}  from './eew2AdminAction';

class EEW2RecordsGrid extends React.Component {
    renderGrid(eew2data){
        if(eew2data && eew2data.eew2ecords && eew2data.eew2ecords.length >0){
            return(<EEW2Records eew2data={this.props.eew2data} actions={this.props.actions}/>);
        }else {
            return(<div>
                <Alert color="primary">
                    Loading...
                </Alert>
                </div>
            );
        };
    }
    render() {
        return (<div>{this.renderGrid(this.props.eew2data)}</div>);
    }
};
function mapStateToProps(state) {
    return {
        eew2data: state.eew2data
    }
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({getEEW2Pdf,generateOutputs}, dispatch) }
 }
export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true })(EEW2RecordsGrid);