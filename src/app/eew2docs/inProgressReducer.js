import * as types from '../../base/constants/ActionTypes';
import initialState from '../../base/config/initialState';

export default function inProgressReducer(state = initialState.outputgeninprogress,action) {
  switch(action.type) {
    case types.POST_OUTPUTGEN_INPROGRESS_SUCCESS:{
      return state = action.outputgeninprogress
    }
    case types.POST_OUTPUTGEN_INPROGRESS_ERROR:{
      return Object.assign({}, ...state, {
        outputgeninprogress:action.outputgeninprogress
      });   
    }
    default: 
      return state;
  }
}