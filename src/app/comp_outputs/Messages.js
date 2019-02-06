import { Component } from 'react';
import { OUTPUT_MESSAGES } from '../../base/constants/AppConstants';
import JqxGrid from '../../deps/jqwidgets-react/react_jqxgrid.js';

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            actions: this.props.actions,
            inputParams: this.props.getOutputFilters
        };
        this.renderMessages = this.renderMessages.bind(this);
    }
    renderMessages() {
        console.log('in renderMessages()...');
        //
        let dataset = this.state.inputParams.dataset;
        let compId = this.state.inputParams.compId;
        let reqNo = this.state.inputParams.reqNo;
        //
        console.log('Get Messages Action Done.');

        if (this.props.msgdata) {
            let data = this.props.msgdata;
            let source =
                {
                    datatype: "json",
                    datafields: [
                        { name: 'msg', type: 'string' },
                        { name: 'severity', type: 'int' }
                    ],
                    localdata: data
    
            };
            let dataAdapter = new $.jqx.dataAdapter(source);
            let columns =
            [
                { text: 'Message', datafield: 'msg',  cellsalign: 'left', align: 'center', filtertype: 'input', width: '80%'},
                { text: 'Severity', datafield: 'severity',  cellsalign: 'center', align: 'center', filtertype: 'number', width: '20%'}
            ];
            return (
                <div>
                {
                    <JqxGrid ref='msgGrid'
                    width={'100%'} source={dataAdapter} pageable={true} pagermode ={'simple'}
                    sortable={false} altrows={false} enabletooltips={false}
                    autoheight={true} editable={false} columns={columns}
                    filterable={true} showfilterrow={true}
                    selectionmode={'multiplerowsextended'}/>
                }
               </div>
            );
        } else {
            return (
                <div class="alert alert-warning" style="margin:3px;" role="alert"><strong>Warning: </strong>No messages found!</div>
            );
        }
    }
    render() {
        return (
            <div>
                {this.renderMessages()}
            </div>
        );
    }
}

export default Messages;