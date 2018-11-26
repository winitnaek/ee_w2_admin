import * as types from '../../base/constants/ActionTypes';
import initialState from '../../base/config/initialState';

export default function confReducer(state = initialState.appconf,action) {
  switch(action.type) {
    case types.LOAD_APPCONF_SUCCESS:
    return Object.assign({}, ...state, action.appconf)  
    default: 
      return state;
  }
}