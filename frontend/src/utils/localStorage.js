import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config';

export const setJwtTokenToLocalStorage = (authInfo) => {
  const jwtToken = jwt.sign(
    { authInfo, exp: Math.floor(Date.now() / 1000) + parseFloat(JWT_EXPIRES_IN) * 3600 },
    JWT_SECRET
  );
  window.localStorage.setItem('jwtToken', jwtToken);
};
