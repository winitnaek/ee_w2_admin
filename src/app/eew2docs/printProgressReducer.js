import * as types from '../../base/constants/ActionTypes';
import initialState from '../../base/config/initialState';

export default function inProgressReducer(state = initialState.printinprogress,action) {
  switch(action.type) {
    case types.GET_PRINT_INPROGRESS_SUCCESS:{
      return state = action.printinprogress
    }
    case types.GET_PRINT_INPROGRESS_ERROR:{
      return Object.assign({}, ...state, {
        printinprogress:action.printinprogress
      });   
    }
    default: 
      return state;
  }
}