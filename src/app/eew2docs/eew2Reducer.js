import * as types from '../../base/constants/ActionTypes';
import initialState from '../../base/config/initialState';

export default function eew2Reducer(state = initialState.eew2data, action) {
  switch(action.type) {
    case types.LOAD_EEW2_DATA:{
      return Object.assign({}, ...state, {
        transmitters:state.transmitters,
        eew2ecords:[]
      });
    }
    case types.GET_EEW2RECORDS_SUCCESS:{
      return Object.assign({}, ...state, {
        filtertype:action.eew2data.filtertype,
        filterby:action.eew2data.filterby,
        startdt:action.eew2data.startdt,
        enddate:action.eew2data.enddate,
        viewtype:action.eew2data.viewtype,
        filterlabel:action.eew2data.filterlabel,
        transmitters:action.eew2data.transmitters,
        eew2ecords: Object.assign([], ...state.eew2ecords, action.eew2data.eew2ecords),
        eew2pdf: {}, 
      });
    }
    case types.GET_EEW2RECORDS_ERROR:{
      return Object.assign({}, ...state, {
        filtertype:action.eew2data.filtertype,
        filterby:action.eew2data.filterby,
        startdt:action.eew2data.startdt,
        enddate:action.eew2data.enddate,
        viewtype:action.eew2data.viewtype,
        filterlabel:action.eew2data.filterlabel,
        transmitters:action.eew2data.transmitters,
        eew2ecords: Object.assign([], ...state.eew2ecords, action.eew2data.eew2ecords),
        eew2pdf: {}, 
      });
    }
    case types.GET_EEW2PDF_SUCCESS: {
      return Object.assign({}, ...state, {
        filtertype:state.filtertype,
        filterby:state.filterby,
        startdt:state.startdt,
        enddate:state.enddate,
        viewtype:state.viewtype,
        filterlabel:state.filterlabel,
        transmitters:state.transmitters,
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
        transmitters:state.transmitters,
        eew2ecords: Object.assign([], ...state.eew2ecords, state.eew2ecords),
        eew2pdf: action.eew2pdf,
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
        transmitters:state.transmitters,
        eew2ecords: Object.assign([], ...state.eew2ecords, action.eew2ecords),
        eew2pdf: {} 
      });
    }
    case types.POST_GENERATE_OUTPUTS_ERROR:{
      return Object.assign({}, ...state, {
        filtertype:state.filtertype,
        filterby:state.filterby,
        startdt:state.startdt,
        enddate:state.enddate,
        viewtype:state.viewtype,
        filterlabel:state.filterlabel,
        transmitters:state.transmitters,
        eew2ecords: [],
        eew2pdf: {} 
      });
    }
    case types.POST_PUBUNPUB_OUTPUTS_SUCCESS:{
      return Object.assign({}, ...state, {
        filtertype:state.filtertype,
        filterby:state.filterby,
        startdt:state.startdt,
        enddate:state.enddate,
        viewtype:state.viewtype,
        filterlabel:state.filterlabel,
        transmitters:state.transmitters,
        eew2ecords: Object.assign([], ...state.eew2ecords, state.eew2ecords),
        pubunpubcnt:action.pubunpubcnt,
        eew2pdf: {} 
      });
    }
    case types.POST_PUBUNPUB_OUTPUTS_ERROR:{
      return Object.assign({}, ...state, {
        filtertype:state.filtertype,
        filterby:state.filterby,
        startdt:state.startdt,
        enddate:state.enddate,
        viewtype:state.viewtype,
        filterlabel:state.filterlabel,
        transmitters:state.transmitters,
        eew2ecords: Object.assign([], ...state.eew2ecords, state.eew2ecords),
        pubunpubcnt:action.pubunpubcnt,
        eew2pdf: {} 
      });
    }
    case types.GET_TRANSMITTER_SUCCESS:{
      return Object.assign({}, ...state, {
        transmitters:action.transmitters,
        eew2ecords:[]
      });
    }
    case types.GET_TRANSMITTER_ERROR:{
      return Object.assign({}, ...state, {
        transmitters:[]
      });
    }
    default: 
      return state;
  }
}