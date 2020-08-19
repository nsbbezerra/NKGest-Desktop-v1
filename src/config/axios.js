import axios from 'axios';

const ipServ = localStorage.getItem('ip');
const portServ = localStorage.getItem('port');

var url;

if(!ipServ && !portServ) {
    url = 'not'
} else {
    url = `http://${ipServ}:${portServ}`;
}


const api = axios.create({
    baseURL: url
});

export default api;