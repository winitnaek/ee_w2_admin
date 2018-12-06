import * as types from '../../base/constants/ActionTypes';
import initialState from '../../base/config/initialState';

export default function w2loaderReducer(state = initialState.w2data, action) {
    switch (action.type) {
        case types.LOAD_PDF_DATA:
            {
                return state = action.w2data
            }
        default:
            return state;
    }
}