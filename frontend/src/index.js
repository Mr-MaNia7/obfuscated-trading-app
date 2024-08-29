// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import jwt from 'jsonwebtoken';
// redux
import { Provider as ReduxProvider } from 'react-redux';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
//
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import store from './redux/store';
import { setCurrentAuthInfo, logOutUser } from './redux/actions/authAction';
import { JWT_SECRET } from './config';
import { AuthProvider } from './contexts/JWTContext';

// ----------------------------------------------------------------------

if (localStorage.jwtToken) {
  try {
    const decoded = jwt.verify(localStorage.jwtToken, JWT_SECRET);
    store.dispatch(setCurrentAuthInfo(decoded.authInfo));
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      alert('Your token expired. Please log in again.');
    }
    store.dispatch(logOutUser());
  }
}

ReactDOM.render(
  <StrictMode>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <SettingsProvider>
          <CollapseDrawerProvider>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </CollapseDrawerProvider>
        </SettingsProvider>
      </ReduxProvider>
    </HelmetProvider>
  </StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
