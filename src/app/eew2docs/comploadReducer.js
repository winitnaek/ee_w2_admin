import * as types from '../../base/constants/ActionTypes';
import initialState from '../../base/config/initialState';

export default function comploadReducer(state = initialState.compdata, action) {
    switch (action.type) {
        case types.LOAD_COMP_DATA:
            {
                return state = action.compdata
            }
        default:
            return state;
    }
}