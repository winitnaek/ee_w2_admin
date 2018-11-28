import * as types from '../../base/constants/ActionTypes';
import initialState from '../../base/config/initialState';

export default function eew2Reducer(state = initialState.eew2data, action) {
  switch(action.type) {
    case types.LOAD_EEW2_DATA:{
      return Object.assign({}, ...state, action.eew2data)  
    }
    case types.GET_EEW2RECORDS_SUCCESS:{
      return Object.assign({}, ...state, action.eew2data)  
    }
    case types.GET_EEW2PDF_SUCCESS: {
      return Object.assign({}, ...state, {
        filtertype:state.filtertype,
        filterby:state.filterby,
        startdt:state.startdt,
        enddate:state.enddate,
        viewtype:state.viewtype,
        filterlabel:state.filterlabel,
        eew2ecords: Object.assign([], ...state.eew2ecords, state.eew2ecords),
        eew2pdf: action.eew2pdf, 
      });
    }
    case types.GET_EEW2PDF_ERROR: {
      return Object.assign({}, ...state, {
        filtertype:state.filtertype,
        filterby:state.filterby,
        startdt:state.startdt,
        enddate:state.enddate,
        viewtype:state.viewtype,
        filterlabel:state.filterlabel,
        eew2ecords: Object.assign([], ...state.eew2ecords, state.eew2ecords),
        eew2pdf: {}
      });
    }
    case types.POST_GENERATE_OUTPUTS_SUCCESS:{
      return Object.assign({}, ...state, {
        filtertype:state.filtertype,
        filterby:state.filterby,
        startdt:state.startdt,
        enddate:state.enddate,
        viewtype:state.viewtype,
        filterlabel:state.filterlabel,
        eew2ecords: Object.assign([], ...state.eew2ecords, action.eew2ecords),
        eew2pdf: {} 
      });
    }
    default: 
      return state;
  }
}