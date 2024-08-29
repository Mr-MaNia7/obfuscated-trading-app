import { createContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';
// utils
import Axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import { setJwtTokenToLocalStorage } from '../utils/localStorage';
import { JWT_SECRET } from '../config';
import { loginUser, logOutUser } from '../redux/actions/authAction';
import { PATH_AUTH } from '../routes/paths';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getVerifyCode: () => Promise.resolve(),
  getVerifyCodeForPasswordReset: () => Promise.resolve(),
  register: () => Promise.resolve()
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        const jwtToken = window.localStorage.getItem('jwtToken');

        if (accessToken && isValidToken(accessToken) && jwtToken) {
          const decoded = jwt.verify(localStorage.jwtToken, JWT_SECRET);

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: decoded.authInfo
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
          alert('Your token expired. Please log in again.');
        }
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (accountName, password) => {
    const response = await Axios.post('/api/v1/users/login', {
      accountName,
      password
    });
    const { token: accessToken, data: userData } = response.data;
    const { user } = userData;

    setSession(accessToken);
    setJwtTokenToLocalStorage(user);
    reduxDispatch(loginUser(user));

    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const getVerifyCode = async (values) => {
    const response = await Axios.post('/api/v1/users/getVerifyCode', values);
    const { verifyId } = response.data?.data;
    return verifyId;
  };

  const getVerifyCodeForPasswordReset = async (email) => {
    const response = await Axios.post('/api/v1/users/getVerifyCodeForPasswordReset', {
      email
    });
    const { verifyId } = response.data?.data;
    return verifyId;
  };

  const register = async ({
    email,
    phoneNumber,
    password,
    passwordConfirm,
    accountName,
    transactionKey,
    verifyId,
    verifyCode
  }) => {
    const response = await Axios.post('/api/v1/users/signup', {
      email,
      phoneNumber,
      password,
      passwordConfirm,
      accountName,
      transactionKey,
      verifyId,
      verifyCode
    });
    const { token: accessToken, data: userData } = response.data;
    const { user } = userData;

    setSession(accessToken);
    setJwtTokenToLocalStorage(user);
    reduxDispatch(loginUser(user));

    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    Axios.get('/api/v1/users/logout');
    setSession(null);
    window.localStorage.removeItem('jwtToken');
    dispatch({ type: 'LOGOUT' });
    reduxDispatch(logOutUser());
    navigate(PATH_AUTH.login);
  };

  const resetPassword = async (verifyId, verifyCode, email, password, passwordConfirm) => {
    await Axios.post('/api/v1/users/resetPassword', {
      email,
      password,
      passwordConfirm,
      verifyId,
      verifyCode
    });
  };

  const updateProfile = (user) => {
    setJwtTokenToLocalStorage(user);
    reduxDispatch(loginUser(user));

    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        getVerifyCode,
        getVerifyCodeForPasswordReset,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
