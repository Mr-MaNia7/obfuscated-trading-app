import axios from 'axios';

// ----------------------------------------------------------------------

const Server =
  process.env.REACT_APP_NODE_CLIENT_ENV === 'production' ? 'https://api-cr.onrender.com' : 'http://localhost:5001';

const accessToken = window.localStorage.getItem('accessToken');

const axiosInstance = axios.create({
  baseURL: Server,
  headers: {
    authorization: `Bearer ${accessToken}`
  }
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
