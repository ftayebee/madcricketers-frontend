import { createRouter, createWebHistory } from "vue-router";
import Homepage from "../components/Homepage.vue";
import Tournaments from "../components/pages/Tournaments.vue";
import TournamentDetail from "../components/pages/TournamentDetail.vue";

const routes = [
  { path: "/", component: Homepage },
  { path: "/tournaments", component: Tournaments },
  { path: "/tournaments/:slug", component: TournamentDetail },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
