import * as Types from '../actionTypes';

export const pricesReducer = (state = {}, action) => {
  switch (action.type) {
    case Types.FETCH_PRICES:
      return action.payload;
    case Types.LOGOUT_USER:
      return {};
    default:
      return state;
  }
};

export const balanceReducer = (state = {}, action) => {
  switch (action.type) {
    case Types.GET_BALANCES:
      return action.payload;
    case Types.LOGOUT_USER:
      return {};
    default:
      return state;
  }
};
