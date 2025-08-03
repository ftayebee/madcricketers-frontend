import { createRouter, createWebHistory } from "vue-router";
import Homepage from "../components/Homepage.vue";
import Tournaments from "../components/pages/Tournaments.vue";
import TournamentDetail from "../components/pages/TournamentDetail.vue";
import MatchDetail from "../components/pages/MatchDetail.vue";
import Registration from "../components/pages/Registration.vue";

const routes = [
  { path: "/", component: Homepage },
  { path: "/registration", component: Registration },
  { path: "/tournaments", component: Tournaments },
  { path: "/tournaments/:slug", component: TournamentDetail },
  { path: "/match/detail/:id", component: MatchDetail },
  { path: "/:pathMatch(.*)*", redirect: "/", },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
