import { createRouter, createWebHistory } from "vue-router";
import Homepage from "../components/Homepage.vue";
// import FeaturesPage from "@/views/FeaturesPage.vue";
// import other pages as needed

const routes = [
  { path: "/", component: Homepage },
//   { path: "/features", component: FeaturesPage },
  // add more routes here
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
