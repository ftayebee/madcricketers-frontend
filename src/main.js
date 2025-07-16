import { createApp } from 'vue'
import './style.css'
import "./assets/main.css";
import App from './App.vue'
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@splidejs/vue-splide/css";

const app = createApp(App);
app.use(router);
app.mount("#app");