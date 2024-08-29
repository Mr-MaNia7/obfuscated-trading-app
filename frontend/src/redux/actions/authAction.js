import * as Types from '../actionTypes';

export const loginUser = (authInfo) => (dispatch) => {
  dispatch({
    type: Types.LOGIN_SUCCESS,
    payload: authInfo
  });
};

export const setCurrentAuthInfo = (authInfo) => (dispatch) => {
  dispatch({
    type: Types.LOGIN_SUCCESS,
    payload: authInfo
  });
};

export const logOutUser = () => async (dispatch) => {
  try {
    localStorage.removeItem('jwtToken');
    dispatch({
      type: Types.LOGOUT_USER
    });
  } catch (err) {
    console.log(err);
  }
};
