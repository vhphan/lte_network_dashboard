import axios from "axios";
import Vue from 'vue'

const flaskInstance = createInstance("http://localhost:5000");
const vueInstance = createInstance("http://localhost:8679");
const eportalInstance = createInstance("https://cmeportal.eprojecttrackers.com/ds2/ep2021");
// const productionInstance = createInstance("http://localhost:3000"); // will change later
import keys from '../private/keys';
function createInstance(baseURL){
    return axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.token}`
        },
        params: {api: keys['apiKey']}
    });
}

export default {
    install () {
        Vue.prototype.$flask = flaskInstance
        Vue.prototype.$public = vueInstance
        Vue.prototype.$ePortal = eportalInstance
    }
}; // Check debug/build mode