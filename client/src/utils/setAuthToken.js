// import axios from 'axios';
import api from './api';

const setAuthToken = token => {

    if (token) {
        // axios.defaults.headers.common['x-auth-token'] = token;
        token = api.defaults.headers.common['x-auth-token'];
        localStorage.setItem('token', token);
    } else {
        // delete axios.defaults.headers.common['x-auth-token'];
        delete api.defaults.headers.common['x-auth-token'];
        localStorage.removeItem('token');
    }
}

export default setAuthToken;