import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import eew2Reducer from '../../app/eew2docs/eew2Reducer';
import compdataReducer from '../../app/comp_outputs/compdataReducer';
const rootReducer = combineReducers({
  form: formReducer,
  eew2data: eew2Reducer,
  compdata: compdataReducer
})
export default rootReducer;