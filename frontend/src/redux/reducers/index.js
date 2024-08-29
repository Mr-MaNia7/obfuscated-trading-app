import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { pricesReducer, balanceReducer } from './dataReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  prices: pricesReducer,
  balance: balanceReducer
});

export default rootReducer;
