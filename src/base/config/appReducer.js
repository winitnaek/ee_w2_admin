import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import eew2Reducer from '../../app/eew2docs/eew2Reducer';
import w2dataReducer from '../../app/eew2docs/w2loaderReducer';
import compdataReducer from '../../app/eew2docs/comploadReducer';

import inProgressReducer from '../../app/eew2docs/inProgressReducer';
const rootReducer = combineReducers({
  form: formReducer,
  outputgeninprogress: inProgressReducer,
  eew2data: eew2Reducer,
  w2data: w2dataReducer,
  compdata: compdataReducer,
})
export default rootReducer;