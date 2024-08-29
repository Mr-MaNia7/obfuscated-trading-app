import * as Types from '../actionTypes';

const initailState = {
  isAuthenticated: false,
  user: {}
};

export const authReducer = (state = initailState, action) => {
  switch (action.type) {
    case Types.LOGIN_SUCCESS:
      return { ...state, user: action.payload, isAuthenticated: true };
    case Types.LOGOUT_USER:
      return { ...state, ...initailState };
    default:
      return state;
  }
};
