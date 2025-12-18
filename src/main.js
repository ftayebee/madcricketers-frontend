import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './style.css';
import "./assets/css/app.css";
import "@splidejs/vue-splide/css";
import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import echo from './plugins/echo';

const app = createApp(App);
app.use(router);
app.use(Toast);
app.config.globalProperties.$echo = echo;
app.mount("#app");