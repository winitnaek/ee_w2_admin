import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import eew2Reducer from '../../app/eew2docs/eew2Reducer';
import inProgressReducer from '../../app/eew2docs/inProgressReducer';
const rootReducer = combineReducers({
  form:formReducer,
  outputgeninprogress:inProgressReducer,
  eew2data:eew2Reducer,
})
export default rootReducer;
