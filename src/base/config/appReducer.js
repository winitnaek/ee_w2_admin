import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import taxdocsReducer from '../../app/taxdocs/taxdocsReducer';
const rootReducer = combineReducers({
  form:formReducer,
  taxdox:taxdocsReducer,
})
export default rootReducer;