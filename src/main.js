import 'core-js/stable'
import Vue from 'vue'
//import CoreuiVuePro from '@coreui/vue-pro'
import BootstrapVue from 'bootstrap-vue'
import CoreuiVuePro from '../node_modules/@coreui/vue-pro/src/index.js'
import App from './App'
import router from './router/index'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import i18n from './i18n.js'


import firebase from 'firebase'
import axios from 'axios';
import babelPolyfill from 'babel-polyfill'
import VueI18n from 'vue-i18n'
import Vuelidate from 'vuelidate'
import VueResource from 'vue-resource';

Vue.use(CoreuiVuePro)
Vue.use(BootstrapVue);
Vue.use(babelPolyfill);
Vue.use(VueI18n);
Vue.use(Vuelidate);
Vue.use(VueResource);


Vue.prototype.$axios = axios;
Vue.prototype.$log = console.log.bind(console)

var app = '';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCW-A0nbJsytiB4UwfgzJQZkyO8X7gGdxQ",
  authDomain: "contact-importer-f66a1.firebaseapp.com",
  projectId: "contact-importer-f66a1",
  storageBucket: "contact-importer-f66a1.appspot.com",
  messagingSenderId: "404401643921",
  appId: "1:404401643921:web:c0d0e3cd2aafc0a03c3a30"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
Vue.prototype.$firebase = firebase;

// api calls
axios.defaults.headers.get['Accepts'] = 'application/json'

// const i18n = new VueI18n({
//   locale: 'es', // set locale
//   messages: i18nConfig, // set locale messages
// })

/* eslint-disable no-new */
firebase.auth().onAuthStateChanged((user) => {   
  if (!app) {
      app = new Vue({
        el: '#app',
        router,
        store,
        //CIcon component documentation: https://coreui.io/vue/docs/components/icon
        icons,
        i18n,
        template: '<App/>',
        components: {
          App
        }
      })
  }
})

// new Vue({
//   el: '#app',
//   router,
//   store,
//   //CIcon component documentation: https://coreui.io/vue/docs/components/icon
//   icons,
//   i18n,
//   template: '<App/>',
//   components: {
//     App
//   }
// })
