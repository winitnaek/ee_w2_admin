import {combineReducers} from 'redux';
import eew2Reducer from '../../app/eew2docs/eew2Reducer';
import w2dataReducer from '../../app/eew2docs/w2loaderReducer';
import compdataReducer from '../../app/eew2docs/comploadReducer';
import viewcompdataReducer from '../../app/comp_outputs/viewcompdataReducer';
import inProgressReducer from '../../app/eew2docs/inProgressReducer';
import printProgressReducer from '../../app/eew2docs/printProgressReducer';
const rootReducer = combineReducers({
  outputgeninprogress: inProgressReducer,
  printinprogress:printProgressReducer,
  eew2data: eew2Reducer,
  w2data: w2dataReducer,
  compdata: compdataReducer,
  viewcompdata: viewcompdataReducer
});
export default rootReducer;