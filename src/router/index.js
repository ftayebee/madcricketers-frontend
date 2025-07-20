import { createRouter, createWebHistory } from "vue-router";
import Homepage from "../components/Homepage.vue";
import Tournaments from "../components/pages/Tournaments.vue";
import TournamentDetail from "../components/pages/TournamentDetail.vue";
import MatchDetail from "../components/pages/MatchDetail.vue";

const routes = [
  { path: "/", component: Homepage },
  { path: "/tournaments", component: Tournaments },
  { path: "/tournaments/:slug", component: TournamentDetail },
  { path: "/match/detail/:id", component: MatchDetail },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
