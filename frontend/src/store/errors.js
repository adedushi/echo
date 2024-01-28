import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './session';
import { echoErrorsReducer } from './echos';

export default combineReducers({
    session: sessionErrorsReducer,
    echos: echoErrorsReducer
});