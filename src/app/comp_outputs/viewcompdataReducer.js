import * as types from '../../base/constants/ActionTypes';
import initialState from '../../base/config/initialState';

export default function viewcompdataReducer(state = initialState.viewcompdata, action) {
  switch (action.type) {
    case types.GET_COMPANY_FILE_SUCCESS:
      {
        return Object.assign({}, ...state, {
          messages: state.messages,
          outputDoc: action.outputDoc
        });
      }
      case types.GET_MESSAGES_SUCCESS:
      {
        return Object.assign({}, ...state, {
          messages: action.messages,
          outputDoc: state.outputDoc
        });
      }
    case types.GET_COMPANY_FILE_ERROR:
      {
        return Object.assign({}, ...state, {
          messages: {},
          outputDoc: {}
        });
      }
    default:
      return state;
  }
}